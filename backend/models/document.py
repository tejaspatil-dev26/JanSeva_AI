import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from ..database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    document_type = Column(String(100), nullable=False) # Aadhaar Card, PAN Card, Death Certificate, 7/12 Land Extract, Income Certificate, Ration Card, etc.
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    mime_type = Column(String(100), default="application/pdf")
    
    ocr_status = Column(String(50), default="pending") # pending, processing, completed, failed
    ocr_confidence = Column(Float, default=0.0) # 0.0 - 1.0
    ocr_raw_text = Column(Text, nullable=True)
    
    is_verified = Column(Boolean, default=False)
    verified_by_user = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True)
    
    # Missing / validation flags
    has_issues = Column(Boolean, default=False)
    validation_notes = Column(Text, nullable=True)
    expiry_date = Column(String(50), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="documents")
    extracted_fields = relationship("ExtractedField", back_populates="document", cascade="all, delete-orphan")

class ExtractedField(Base):
    __tablename__ = "extracted_fields"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    
    field_key = Column(String(100), nullable=False) # e.g. "deceased_name", "date_of_death", "registration_no", "survey_number", "aadhaar_masked"
    field_label = Column(String(100), nullable=False)
    extracted_value = Column(Text, nullable=True)
    corrected_value = Column(Text, nullable=True)
    confidence = Column(Float, default=0.9)
    is_sensitive = Column(Boolean, default=False) # If True, value is masked in logs/APIs unless authorized
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="extracted_fields")
