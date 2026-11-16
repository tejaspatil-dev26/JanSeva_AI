from typing import Optional, Any
from pydantic import BaseModel
from datetime import datetime
from .scheme import SchemeOut

class ChatMessageCreate(BaseModel):
    text: str
    language: Optional[str] = "en"
    session_id: Optional[str] = None
    has_audio: bool = False

class ChatMessageOut(BaseModel):
    id: int
    conversation_id: int
    sender: str
    text: str
    language: str
    has_audio: bool
    suggested_actions: list[str] = []
    recommended_schemes: list[dict[str, Any]] = []
    follow_up_questions: list[str] = []
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    id: int
    session_id: str
    language: str
    title: str
    extracted_context: dict[str, Any]
    created_at: datetime
    messages: list[ChatMessageOut] = []

    class Config:
        from_attributes = True

class AskAssistantRequest(BaseModel):
    message: str
    language: str = "en" # en, hi, mr, etc.
    session_id: Optional[str] = None
