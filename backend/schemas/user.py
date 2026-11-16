from typing import Optional, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    preferred_language: str = "en"

class UserCreate(UserBase):
    password: Optional[str] = "JanSeva@2026"
    role: str = "citizen"

class UserProfileOut(BaseModel):
    id: int
    user_id: int
    age: Optional[int] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = None
    taluka_or_subdistrict: Optional[str] = None
    village_or_city: Optional[str] = None
    pincode: Optional[str] = None
    occupation: Optional[str] = None
    is_farmer: bool = False
    land_holding_acres: Optional[str] = None
    annual_income: Optional[int] = None
    income_category: Optional[str] = None
    social_category: Optional[str] = None
    has_disability: bool = False
    is_widow: bool = False
    deceased_spouse_name: Optional[str] = None
    date_of_spouse_demise: Optional[str] = None
    dependents_count: int = 0
    has_bank_account: bool = True
    bank_name: Optional[str] = None
    account_number_masked: Optional[str] = None
    ifsc_code: Optional[str] = None
    raw_details: dict[str, Any] = {}

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    taluka_or_subdistrict: Optional[str] = None
    village_or_city: Optional[str] = None
    pincode: Optional[str] = None
    occupation: Optional[str] = None
    is_farmer: Optional[bool] = None
    land_holding_acres: Optional[str] = None
    annual_income: Optional[int] = None
    income_category: Optional[str] = None
    social_category: Optional[str] = None
    has_disability: Optional[bool] = None
    is_widow: Optional[bool] = None
    deceased_spouse_name: Optional[str] = None
    date_of_spouse_demise: Optional[str] = None
    dependents_count: Optional[int] = None
    has_bank_account: Optional[bool] = None
    bank_name: Optional[str] = None
    account_number_masked: Optional[str] = None
    ifsc_code: Optional[str] = None
    preferred_language: Optional[str] = None

class UserOut(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    profile: Optional[UserProfileOut] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    phone_or_email: str
    password: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
