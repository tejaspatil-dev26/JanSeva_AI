import os
import shutil
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..config import settings
from ..models.user import User
from ..models.document import Document, ExtractedField
from ..models.audit import AuditLog, Notification
from ..schemas.document import DocumentOut, ExtractedFieldOut, FieldCorrectionRequest
from ..services.ocr_service import OCRService

router = APIRouter(prefix="/documents", tags=["Smart Document Intelligence"])

@router.get("", response_model=list[DocumentOut])
def list_documents(user_id: int = 1, db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.user_id == user_id).order_by(Document.created_at.desc()).all()
    return docs

@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form("Government Document"),
    user_id: int = Form(1),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_upload_dir = os.path.join(settings.UPLOAD_DIR, f"user_{user_id}")
    os.makedirs(user_upload_dir, exist_ok=True)
    
    timestamp = int(datetime.datetime.utcnow().timestamp())
    clean_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(user_upload_dir, clean_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)

    # Execute Document Intelligence OCR
    ocr_result = OCRService.process_document(file_path, document_type, file.filename)

    doc = Document(
        user_id=user.id,
        document_type=ocr_result["document_type"],
        original_filename=file.filename,
        file_path=file_path,
        file_size_bytes=file_size,
        mime_type=file.content_type or "application/pdf",
        ocr_status=ocr_result["ocr_status"],
        ocr_confidence=ocr_result["ocr_confidence"],
        ocr_raw_text=ocr_result["ocr_raw_text"],
        is_verified=True,
        has_issues=ocr_result["has_issues"],
        validation_notes=ocr_result["validation_notes"]
    )
    db.add(doc)
    db.flush()

    for f in ocr_result["extracted_fields"]:
        field = ExtractedField(
            document_id=doc.id,
            field_key=f["field_key"],
            field_label=f["field_label"],
            extracted_value=f["extracted_value"],
            confidence=f["confidence"],
            is_sensitive=f.get("is_sensitive", False)
        )
        db.add(field)

    # Create Audit Log for Privacy Compliance
    audit = AuditLog(
        user_id=user.id,
        action="DOCUMENT_UPLOAD_OCR",
        resource_type="document",
        resource_id=str(doc.id),
        details={"type": doc.document_type, "confidence": doc.ocr_confidence, "fields_extracted": len(ocr_result["extracted_fields"])}
    )
    db.add(audit)

    # In-App Notification
    notif = Notification(
        user_id=user.id,
        title=f"Document Processed: {doc.document_type}",
        message=f"OCR extracted {len(ocr_result['extracted_fields'])} fields with {int(doc.ocr_confidence*100)}% confidence. Please verify the details.",
        notification_type="success",
        category="document"
    )
    db.add(notif)
    db.commit()
    db.refresh(doc)
    return doc

@router.post("/load-sample/{sample_type}", response_model=DocumentOut)
def load_sample_document(sample_type: str, user_id: int = 1, db: Session = Depends(get_db)):
    """
    Loads pre-verified Indian civic document sample to test instant OCR extraction:
    - 'death_cert': Death Certificate of Tukaram Patil
    - 'land_record': 7/12 Satbara Land Record (Ambegaon Gat No 204/A)
    - 'aadhaar': Aadhaar Card (Savitribai Patil)
    - 'income_cert': BPL Income Certificate (Haveli Tahsil)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_upload_dir = os.path.join(settings.UPLOAD_DIR, f"user_{user_id}")
    os.makedirs(user_upload_dir, exist_ok=True)

    sample_meta = {
        "death_cert": {
            "type": "Death Certificate",
            "filename": "Tukaram_Patil_Death_Certificate_PuneMC.pdf"
        },
        "land_record": {
            "type": "7/12 Land Record Extract",
            "filename": "Satbara_7_12_Extract_Gat_204A_Ambegaon.pdf"
        },
        "aadhaar": {
            "type": "Aadhaar Card",
            "filename": "Savitribai_Patil_Aadhaar_Masked.pdf"
        },
        "income_cert": {
            "type": "Income Certificate",
            "filename": "Income_Certificate_Haveli_Tahsildar.pdf"
        }
    }

    meta = sample_meta.get(sample_type, sample_meta["death_cert"])
    file_path = os.path.join(user_upload_dir, meta["filename"])
    
    # Create realistic mock PDF content if file doesn't exist
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"Sample Official Government Document for Testing: {meta['type']}\nReference: {meta['filename']}")

    ocr_result = OCRService.process_document(file_path, meta["type"], meta["filename"])

    doc = Document(
        user_id=user.id,
        document_type=ocr_result["document_type"],
        original_filename=meta["filename"],
        file_path=file_path,
        file_size_bytes=42500,
        mime_type="application/pdf",
        ocr_status=ocr_result["ocr_status"],
        ocr_confidence=ocr_result["ocr_confidence"],
        ocr_raw_text=ocr_result["ocr_raw_text"],
        is_verified=True,
        has_issues=False,
        validation_notes="Verified government digital document format."
    )
    db.add(doc)
    db.flush()

    for f in ocr_result["extracted_fields"]:
        field = ExtractedField(
            document_id=doc.id,
            field_key=f["field_key"],
            field_label=f["field_label"],
            extracted_value=f["extracted_value"],
            confidence=f["confidence"],
            is_sensitive=f.get("is_sensitive", False)
        )
        db.add(field)

    db.commit()
    db.refresh(doc)
    return doc

@router.put("/fields/{field_id}/correct", response_model=ExtractedFieldOut)
def correct_field(field_id: int, req: FieldCorrectionRequest, user_id: int = 1, db: Session = Depends(get_db)):
    field = db.query(ExtractedField).filter(ExtractedField.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")

    field.corrected_value = req.corrected_value
    
    # Audit trail
    audit = AuditLog(
        user_id=user_id,
        action="FIELD_CORRECTED_BY_CITIZEN",
        resource_type="extracted_field",
        resource_id=str(field.id),
        details={"field_key": field.field_key, "original": field.extracted_value, "corrected": req.corrected_value}
    )
    db.add(audit)
    db.commit()
    db.refresh(field)
    return field
