import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False) # e.g. "DOCUMENT_UPLOAD", "CONSENT_GRANTED", "APPLICATION_PREPARED", "PORTAL_SUBMISSION", "DATA_MASKED"
    resource_type = Column(String(50), nullable=True) # document, application, profile, scheme
    resource_id = Column(String(100), nullable=True)
    
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), default="127.0.0.1")
    user_agent = Column(String(255), default="JanSeva-Web-Client")
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="info") # info, success, warning, alert, action_required
    category = Column(String(50), default="application") # application, document, scheme, system
    
    link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    
    # Multichannel dispatch simulation
    sent_in_app = Column(Boolean, default=True)
    sent_whatsapp = Column(Boolean, default=False)
    whatsapp_status = Column(String(50), nullable=True) # simulated_delivered, pending, not_connected
    sent_sms = Column(Boolean, default=False)
    sms_status = Column(String(50), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
