from typing import Optional, Any
from pydantic import BaseModel
from datetime import datetime
from .scheme import SchemeOut

class ApplicationStatusHistoryOut(BaseModel):
    id: int
    status: str
    title: str
    description: Optional[str] = None
    action_by: str
    remarks: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicationPrepareRequest(BaseModel):
    scheme_id: int

class ApplicationCreate(BaseModel):
    scheme_id: int
    form_data: dict[str, Any]
    attached_documents: list[int] = []
    citizen_declaration_signed: bool = True
    submission_method: str = "playwright_automation" # or assisted_manual

class ApplicationOut(BaseModel):
    id: int
    application_reference_no: str
    portal_acknowledgment_no: Optional[str] = None
    user_id: int
    scheme_id: int
    status: str
    department: str
    form_data: dict[str, Any]
    attached_documents: list[Any] = []
    reviewed_by_citizen: bool
    citizen_approved_at: Optional[datetime] = None
    citizen_declaration_signed: bool
    submission_method: str
    portal_response_data: dict[str, Any] = {}
    screenshot_url: Optional[str] = None
    next_required_action: Optional[str] = None
    created_at: datetime
    submitted_at: Optional[datetime] = None
    updated_at: datetime
    scheme: Optional[SchemeOut] = None
    status_history: list[ApplicationStatusHistoryOut] = []

    class Config:
        from_attributes = True

class ApplicationStatusUpdate(BaseModel):
    status: str
    remarks: Optional[str] = None
    next_action: Optional[str] = None
