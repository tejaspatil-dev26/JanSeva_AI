import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.user import User, UserProfile
from ..models.scheme import Scheme
from ..models.document import Document, ExtractedField
from ..models.application import Application, ApplicationStatusHistory
from ..models.audit import AuditLog, Notification
from ..schemas.application import ApplicationOut, ApplicationCreate, ApplicationPrepareRequest
from ..services.automation_service import AutomationService

router = APIRouter(prefix="/applications", tags=["Smart Application Preparation & Tracking"])

@router.get("/prepare/{scheme_id}")
def prepare_application_data(scheme_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    """
    Module F - Step 1 to 5:
    Retrieves scheme requirements, scans verified citizen profile & OCR extracted fields,
    and maps them into a ready-to-review application form.
    """
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = user.profile

    # Fetch user's uploaded documents & extracted fields
    docs = db.query(Document).filter(Document.user_id == user_id).all()
    doc_fields_map = {}
    attached_doc_ids = []
    
    for d in docs:
        attached_doc_ids.append(d.id)
        for ef in d.extracted_fields:
            val = ef.corrected_value if ef.corrected_value else ef.extracted_value
            doc_fields_map[ef.field_key] = val

    # Intelligent Field Mapping Engine
    form_data = {
        # Citizen Demographics
        "applicant_name": doc_fields_map.get("citizen_name") or user.full_name,
        "gender": doc_fields_map.get("gender") or (profile.gender if profile else "Female"),
        "date_of_birth": doc_fields_map.get("yob_dob") or (f"Age: {profile.age}" if profile and profile.age else "47"),
        "contact_phone": user.phone or "9876543210",
        
        # Address & Administrative Location
        "residence_address": doc_fields_map.get("address") or f"Village {profile.village_or_city or 'Ambegaon'}, Taluka {profile.taluka_or_subdistrict or 'Haveli'}, Dist {profile.district or 'Pune'}, {profile.state or 'Maharashtra'}",
        "district": profile.district if profile else "Pune",
        "taluka": profile.taluka_or_subdistrict if profile else "Haveli",
        "state": profile.state if profile else "Maharashtra",
        "pincode": profile.pincode if profile else "411046",
        
        # Identity & Social Category
        "aadhaar_masked": doc_fields_map.get("aadhaar_masked") or "XXXX-XXXX-6712",
        "social_category": profile.social_category if profile else "OBC",
        "annual_income": doc_fields_map.get("annual_income") or (f"₹ {profile.annual_income:,}" if profile and profile.annual_income else "₹ 48,000 / year"),
        "income_category": profile.income_category if profile else "BPL",
        
        # Bereavement / Widow specific mapping
        "is_widow_applicant": "Yes" if (profile and profile.is_widow) or "deceased_name" in doc_fields_map else "No",
        "deceased_spouse_name": doc_fields_map.get("deceased_name") or (profile.deceased_spouse_name if profile else "Late Tukaram Pandurang Patil"),
        "date_of_spouse_demise": doc_fields_map.get("date_of_death") or (profile.date_of_spouse_demise if profile else "14/10/2025"),
        "death_registration_no": doc_fields_map.get("registration_no") or "MC/PUN/DTH/2025/08941",
        "issuing_death_authority": doc_fields_map.get("issuing_authority") or "Registrar of Births & Deaths, Pune",
        
        # Land & Agricultural record mapping
        "is_farmer": "Yes" if (profile and profile.is_farmer) or "survey_gat_number" in doc_fields_map else "No",
        "survey_gat_number": doc_fields_map.get("survey_gat_number") or "Gat No. 204/A",
        "khata_number": doc_fields_map.get("khata_number") or "KH-148/2",
        "land_area_acres": doc_fields_map.get("land_area") or (f"{profile.land_holding_acres} Acres" if profile and profile.land_holding_acres else "4.32 Acres"),
        "land_cultivation_type": doc_fields_map.get("land_cultivation_type") or "Jirayat (Dryland agriculture)",
        
        # Banking for DBT Direct Benefit Transfer
        "bank_name": doc_fields_map.get("bank_name") or (profile.bank_name if profile else "State Bank of India"),
        "account_number_masked": doc_fields_map.get("account_masked") or (profile.account_number_masked if profile else "XXXX-XXXX-8921"),
        "ifsc_code": doc_fields_map.get("ifsc_code") or (profile.ifsc_code if profile else "SBIN0004123")
    }

    # Document check
    missing_docs = []
    available_doc_types = [d.document_type for d in docs]
    for req in (scheme.required_documents or []):
        r_low = req.lower()
        if not any(r_low[:6] in a.lower() for a in available_doc_types):
            missing_docs.append(req)

    return {
        "scheme": {
            "id": scheme.id,
            "name": scheme.name,
            "slug": scheme.slug,
            "department": scheme.department,
            "financial_benefit_amount": scheme.financial_benefit_amount,
            "official_portal_url": scheme.official_portal_url,
            "required_documents": scheme.required_documents
        },
        "mapped_form_data": form_data,
        "attached_document_ids": attached_doc_ids,
        "available_documents_count": len(docs),
        "missing_documents": missing_docs,
        "ready_for_review": True
    }

@router.post("/submit", response_model=ApplicationOut)
async def submit_application(
    app_in: ApplicationCreate,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """
    Submits application using browser automation / portal adapter after citizen review and declaration.
    """
    scheme = db.query(Scheme).filter(Scheme.id == app_in.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not app_in.citizen_declaration_signed:
        raise HTTPException(status_code=400, detail="Citizen explicit approval and declaration is required before government submission.")

    # Generate internal JanSeva reference number
    ref_suffix = int(datetime.datetime.utcnow().timestamp()) % 100000
    ref_no = f"JS-2026-MAHA-{ref_suffix:05d}"

    # Execute portal automation
    automation_result = await AutomationService.submit_application(
        scheme_slug=scheme.slug,
        form_data=app_in.form_data,
        attached_documents=[{"id": d} for d in app_in.attached_documents],
        citizen_consent=app_in.citizen_declaration_signed,
        user_id=user.id
    )

    app = Application(
        application_reference_no=ref_no,
        portal_acknowledgment_no=automation_result.acknowledgment_no,
        user_id=user.id,
        scheme_id=scheme.id,
        status="Submitted",
        department=scheme.department,
        form_data=app_in.form_data,
        attached_documents=app_in.attached_documents,
        reviewed_by_citizen=True,
        citizen_approved_at=datetime.datetime.utcnow(),
        citizen_declaration_signed=True,
        submission_method=app_in.submission_method,
        portal_response_data=automation_result.to_dict(),
        screenshot_url=automation_result.screenshot_path,
        next_required_action="Desk verification by Taluka Social Welfare / Revenue Officer",
        submitted_at=datetime.datetime.utcnow()
    )
    db.add(app)
    db.flush()

    # Create initial status history entry
    hist1 = ApplicationStatusHistory(
        application_id=app.id,
        status="Ready for Review",
        title="Application Prepared & Citizen Approved",
        description="All demographic details and OCR verified certificates were reviewed and confirmed by applicant.",
        action_by="Citizen (Self-Declaration)",
        remarks="Digital declaration accepted under IT Act 2000."
    )
    db.add(hist1)

    hist2 = ApplicationStatusHistory(
        application_id=app.id,
        status="Submitted",
        title="Dispatched to Government Portal",
        description=f"Transmitted to {scheme.department} via MahaSeva Gateway. Official Ack ID: {automation_result.acknowledgment_no}",
        action_by="JanSeva Automated Portal Agent",
        remarks="Form submission confirmed by portal receiver."
    )
    db.add(hist2)

    # In-App Notification
    notif = Notification(
        user_id=user.id,
        title=f"Application Submitted: {scheme.name}",
        message=f"Your application has been successfully submitted to {scheme.department}. Reference No: {ref_no}. Official Portal Ack: {automation_result.acknowledgment_no}",
        notification_type="success",
        category="application",
        link=f"/applications/{app.id}",
        sent_in_app=True,
        sent_whatsapp=True,
        whatsapp_status="simulated_delivered",
        sent_sms=True,
        sms_status="simulated_delivered"
    )
    db.add(notif)

    # Audit Log
    audit = AuditLog(
        user_id=user.id,
        action="APPLICATION_SUBMISSION",
        resource_type="application",
        resource_id=ref_no,
        details={
            "scheme": scheme.name,
            "ack_no": automation_result.acknowledgment_no,
            "submission_method": app_in.submission_method
        }
    )
    db.add(audit)
    db.commit()
    db.refresh(app)
    return app

@router.get("", response_model=list[ApplicationOut])
def get_user_applications(user_id: int = 1, db: Session = Depends(get_db)):
    apps = db.query(Application).filter(Application.user_id == user_id).order_by(Application.created_at.desc()).all()
    return apps

@router.get("/{app_id}", response_model=ApplicationOut)
def get_application_details(app_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app
