from typing import Optional, Any
from pydantic import BaseModel
from datetime import datetime

class EligibilityRuleOut(BaseModel):
    id: int
    criterion_type: str
    operator: str
    target_value: str
    is_mandatory: bool
    explanation: Optional[str] = None

    class Config:
        from_attributes = True

class SchemeOut(BaseModel):
    id: int
    slug: str
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    department: str
    government_level: str
    state: Optional[str] = None
    category: str
    description: str
    description_hi: Optional[str] = None
    description_mr: Optional[str] = None
    benefits: str
    financial_benefit_amount: Optional[str] = None
    eligibility_summary: str
    eligibility_criteria_json: dict[str, Any] = {}
    required_documents: list[str] = []
    application_procedure: str
    official_portal_url: str
    last_verified_date: str
    is_active: bool
    
    # Dynamic fields populated during request
    eligibility_status: Optional[str] = "More Information Required" # Likely Eligible, Possibly Eligible, More Information Required, Not Eligible
    match_score: Optional[int] = 50
    missing_criteria: list[str] = []
    satisfied_criteria: list[str] = []

    class Config:
        from_attributes = True

class SchemeFilter(BaseModel):
    government_level: Optional[str] = None # Central, State
    state: Optional[str] = None
    category: Optional[str] = None
    search: Optional[str] = None
    eligibility_only: bool = False

class EligibilityCheckResult(BaseModel):
    scheme_id: int
    scheme_name: str
    status: str # Likely Eligible, Possibly Eligible, More Information Required, Not Eligible
    confidence_score: int # 0 - 100
    satisfied_criteria: list[str] = []
    missing_criteria: list[str] = []
    unmet_criteria: list[str] = []
    reasoning: str
    required_documents_status: dict[str, bool] = {} # e.g. {"Death Certificate": True, "7/12 Land Extract": False}
