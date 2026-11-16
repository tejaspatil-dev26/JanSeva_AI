from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ExtractedFieldOut(BaseModel):
    id: int
    field_key: str
    field_label: str
    extracted_value: Optional[str] = None
    corrected_value: Optional[str] = None
    confidence: float
    is_sensitive: bool

    class Config:
        from_attributes = True

class DocumentOut(BaseModel):
    id: int
    user_id: int
    document_type: str
    original_filename: str
    file_size_bytes: int
    mime_type: str
    ocr_status: str
    ocr_confidence: float
    ocr_raw_text: Optional[str] = None
    is_verified: bool
    verified_by_user: bool
    has_issues: bool
    validation_notes: Optional[str] = None
    created_at: datetime
    extracted_fields: list[ExtractedFieldOut] = []

    class Config:
        from_attributes = True

class FieldCorrectionRequest(BaseModel):
    field_id: int
    corrected_value: str
