from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    category: str
    link: Optional[str] = None
    is_read: bool
    sent_in_app: bool
    sent_whatsapp: bool
    whatsapp_status: Optional[str] = None
    sent_sms: bool
    sms_status: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
