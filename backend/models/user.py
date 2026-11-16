import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=True)
    hashed_password = Column(String(200), nullable=True)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="citizen") # citizen, admin, agent
    preferred_language = Column(String(10), default="en") # en, hi, mr, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Demographics
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True) # Female, Male, Other
    marital_status = Column(String(20), nullable=True) # Married, Widow, Single, Divorced
    
    # Location
    state = Column(String(100), default="Maharashtra")
    district = Column(String(100), nullable=True)
    taluka_or_subdistrict = Column(String(100), nullable=True)
    village_or_city = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)

    # Socio-economic
    occupation = Column(String(100), nullable=True) # Farmer, Agricultural Labourer, Artisan, Unemployed, etc.
    is_farmer = Column(Boolean, default=False)
    land_holding_acres = Column(String(20), nullable=True) # e.g. "2.5"
    annual_income = Column(Integer, nullable=True) # in INR
    income_category = Column(String(20), nullable=True) # BPL, EWS, APL
    social_category = Column(String(20), nullable=True) # General, OBC, SC, ST
    has_disability = Column(Boolean, default=False)

    # Family & Situation details
    is_widow = Column(Boolean, default=False)
    deceased_spouse_name = Column(String(100), nullable=True)
    date_of_spouse_demise = Column(String(50), nullable=True)
    dependents_count = Column(Integer, default=0)
    
    # Banking details (masked / verified indicator)
    has_bank_account = Column(Boolean, default=True)
    bank_name = Column(String(100), nullable=True)
    account_number_masked = Column(String(30), nullable=True) # e.g. "XXXX-XXXX-4589"
    ifsc_code = Column(String(20), nullable=True)

    raw_details = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")
