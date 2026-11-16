import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String(100), unique=True, index=True)
    language = Column(String(10), default="en") # en, hi, mr, etc.
    title = Column(String(200), default="Government Assistance Inquiry")
    
    extracted_context = Column(JSON, default=dict) # Accumulated facts from conversation e.g. {"is_widow": True, "husband_was_farmer": True}
    recommended_scheme_ids = Column(JSON, default=list)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    
    sender = Column(String(20), nullable=False) # user, assistant, system
    text = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    
    # Metadata for rich UI rendering
    has_audio = Column(Boolean, default=False)
    suggested_actions = Column(JSON, default=list) # e.g. ["Upload Death Certificate", "Check Sanjay Gandhi Yojana"]
    recommended_schemes = Column(JSON, default=list)
    follow_up_questions = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
