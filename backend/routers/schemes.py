from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.scheme import Scheme
from ..models.user import User, UserProfile
from ..models.document import Document
from ..schemas.scheme import SchemeOut, EligibilityCheckResult
from ..services.eligibility_engine import EligibilityEngine

router = APIRouter(prefix="/schemes", tags=["Government Scheme Discovery"])

@router.get("", response_model=list[SchemeOut])
def list_schemes(
    category: Optional[str] = None,
    government_level: Optional[str] = None,
    search: Optional[str] = None,
    user_id: Optional[int] = 1,
    db: Session = Depends(get_db)
):
    query = db.query(Scheme).filter(Scheme.is_active == True)

    if category and category != "All":
        query = query.filter(Scheme.category == category)
    if government_level and government_level != "All":
        query = query.filter(Scheme.government_level == government_level)
    if search:
        s = f"%{search}%"
        query = query.filter((Scheme.name.ilike(s)) | (Scheme.description.ilike(s)) | (Scheme.department.ilike(s)))

    schemes = query.all()

    # Retrieve user profile and uploaded document types to evaluate live eligibility
    profile = None
    uploaded_docs = []
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            profile = user.profile
            docs = db.query(Document).filter(Document.user_id == user_id).all()
            uploaded_docs = [d.document_type for d in docs]

    result = []
    for s in schemes:
        eval_result = EligibilityEngine.evaluate(s, profile, uploaded_docs)
        s_out = SchemeOut.from_orm(s)
        s_out.eligibility_status = eval_result["status"]
        s_out.match_score = eval_result["confidence_score"]
        s_out.satisfied_criteria = eval_result["satisfied_criteria"]
        s_out.missing_criteria = eval_result["missing_criteria"]
        result.append(s_out)

    # Sort so Likely Eligible and high match scores appear at the top
    status_priority = {
        "Likely Eligible": 1,
        "Possibly Eligible": 2,
        "More Information Required": 3,
        "Not Eligible": 4
    }
    result.sort(key=lambda x: (status_priority.get(x.eligibility_status, 5), -(x.match_score or 0)))

    return result

@router.get("/{scheme_id}", response_model=SchemeOut)
def get_scheme_by_id(scheme_id: int, user_id: Optional[int] = 1, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    profile = None
    uploaded_docs = []
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            profile = user.profile
            docs = db.query(Document).filter(Document.user_id == user_id).all()
            uploaded_docs = [d.document_type for d in docs]

    eval_result = EligibilityEngine.evaluate(scheme, profile, uploaded_docs)
    s_out = SchemeOut.from_orm(scheme)
    s_out.eligibility_status = eval_result["status"]
    s_out.match_score = eval_result["confidence_score"]
    s_out.satisfied_criteria = eval_result["satisfied_criteria"]
    s_out.missing_criteria = eval_result["missing_criteria"]
    return s_out

@router.get("/{scheme_id}/check-eligibility", response_model=EligibilityCheckResult)
def check_eligibility(scheme_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    profile = None
    uploaded_docs = []
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            profile = user.profile
            docs = db.query(Document).filter(Document.user_id == user_id).all()
            uploaded_docs = [d.document_type for d in docs]

    eval_result = EligibilityEngine.evaluate(scheme, profile, uploaded_docs)
    return EligibilityCheckResult(**eval_result)
