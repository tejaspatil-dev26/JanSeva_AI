import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    application_reference_no = Column(String(100), unique=True, index=True) # e.g. "JS-2026-MAHA-WID-91823"
    portal_acknowledgment_no = Column(String(100), nullable=True) # e.g. "MH-REV-2026-449102"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    
    # Statuses: Draft, Ready for Review, Submitted, Under Verification, Approved, Rejected, Additional Documents Required
    status = Column(String(50), default="Draft", index=True)
    department = Column(String(255), nullable=False)
    
    # Prepared data mapped from profile and documents
    form_data = Column(JSON, default=dict) # Mapped key-values ready for portal
    attached_documents = Column(JSON, default=list) # List of document IDs attached
    
    # Citizen consent & review
    reviewed_by_citizen = Column(Boolean, default=False)
    citizen_approved_at = Column(DateTime, nullable=True)
    citizen_declaration_signed = Column(Boolean, default=False)
    
    # Automation details
    submission_method = Column(String(50), default="playwright_automation") # playwright_automation, assisted_manual, direct_api
    portal_response_data = Column(JSON, default=dict)
    screenshot_url = Column(String(500), nullable=True)
    next_required_action = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="applications")
    scheme = relationship("Scheme", back_populates="applications")
    status_history = relationship("ApplicationStatusHistory", back_populates="application", cascade="all, delete-orphan")

class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    
    status = Column(String(50), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    action_by = Column(String(100), default="System") # Citizen, System, Portal Officer, Verification Officer
    remarks = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    application = relationship("Application", back_populates="status_history")
