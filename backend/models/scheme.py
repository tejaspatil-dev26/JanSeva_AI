import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True)
    name = Column(String(255), nullable=False)
    name_hi = Column(String(255), nullable=True)
    name_mr = Column(String(255), nullable=True)
    department = Column(String(255), nullable=False)
    government_level = Column(String(50), default="Central") # Central, State
    state = Column(String(100), nullable=True) # None for Central, state name for state schemes
    category = Column(String(100), nullable=False) # Agriculture, Social Welfare, Pension, Healthcare, Housing, Women & Child
    
    description = Column(Text, nullable=False)
    description_hi = Column(Text, nullable=True)
    description_mr = Column(Text, nullable=True)
    
    benefits = Column(Text, nullable=False)
    financial_benefit_amount = Column(String(100), nullable=True) # e.g. "Rs 6,000 / year" or "Rs 1,500 / month"
    
    eligibility_summary = Column(Text, nullable=False)
    eligibility_criteria_json = Column(JSON, default=dict) # Structured rules for eligibility engine
    
    required_documents = Column(JSON, default=list) # List of required document types, e.g. ["Death Certificate", "7/12 Land Extract", "Aadhaar", "Bank Passbook"]
    application_procedure = Column(Text, nullable=False)
    official_portal_url = Column(String(500), nullable=False)
    portal_adapter_key = Column(String(100), default="generic_mock_portal") # Used by Playwright automation
    
    last_verified_date = Column(String(50), default="2026-03-01")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    eligibility_rules = relationship("EligibilityRule", back_populates="scheme", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="scheme")

class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    
    criterion_type = Column(String(50), nullable=False) # age_min, age_max, gender, marital_status, occupation, max_income, landholding, category, state
    operator = Column(String(20), default="==") # ==, !=, >=, <=, in, contains
    target_value = Column(String(255), nullable=False)
    is_mandatory = Column(Boolean, default=True)
    explanation = Column(Text, nullable=True)

    scheme = relationship("Scheme", back_populates="eligibility_rules")
