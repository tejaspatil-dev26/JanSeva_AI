from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, UserProfile
from ..models.audit import AuditLog
from ..schemas.user import UserCreate, UserOut, UserProfileUpdate, UserProfileOut, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication & Profile"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = None
    if user_in.phone:
        existing = db.query(User).filter(User.phone == user_in.phone).first()
    if not existing and user_in.email:
        existing = db.query(User).filter(User.email == user_in.email).first()

    if existing:
        # Return existing user for frictionless onboarding in GovTech
        user = existing
    else:
        user = User(
            full_name=user_in.full_name,
            phone=user_in.phone,
            email=user_in.email,
            role=user_in.role or "citizen",
            preferred_language=user_in.preferred_language or "en"
        )
        db.add(user)
        db.flush()
        
        # Create empty profile
        profile = UserProfile(user_id=user.id)
        db.add(profile)

        # Audit log
        audit = AuditLog(
            user_id=user.id,
            action="CITIZEN_REGISTRATION",
            resource_type="user",
            resource_id=str(user.id),
            details={"phone": user.phone, "name": user.full_name}
        )
        db.add(audit)
        db.commit()
        db.refresh(user)

    return TokenResponse(
        access_token=f"janseva-token-usr-{user.id}",
        user=user
    )

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.phone == req.phone_or_email) | (User.email == req.phone_or_email)
    ).first()
    
    if not user:
        # Create quick session for demo persona convenience
        user = User(
            full_name=f"Citizen {req.phone_or_email[-4:] if len(req.phone_or_email) >= 4 else 'User'}",
            phone=req.phone_or_email,
            preferred_language="mr"
        )
        db.add(user)
        db.flush()
        profile = UserProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(user)

    return TokenResponse(
        access_token=f"janseva-token-usr-{user.id}",
        user=user
    )

@router.get("/me", response_model=UserOut)
def get_current_user(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Fallback to first user
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/profile", response_model=UserProfileOut)
def update_profile(profile_in: UserProfileUpdate, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if profile_in.preferred_language:
        user.preferred_language = profile_in.preferred_language

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.add(profile)

    update_data = profile_in.dict(exclude_unset=True)
    update_data.pop("preferred_language", None)

    for field, val in update_data.items():
        setattr(profile, field, val)

    audit = AuditLog(
        user_id=user.id,
        action="PROFILE_UPDATED",
        resource_type="profile",
        resource_id=str(profile.id),
        details={"updated_fields": list(update_data.keys())}
    )
    db.add(audit)
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/demo-persona/{persona_key}", response_model=UserOut)
def load_demo_persona(persona_key: str, db: Session = Depends(get_db)):
    """
    Instantly switch or load preset test personas for testing end-to-end scenarios:
    - 'widow': Savitribai Patil (Farmer's Widow, Pune)
    - 'farmer': Rameshwar Patil (Small Landholding Farmer)
    - 'youth': Priya Sharma (Vocational Education & Employment)
    """
    if persona_key == "widow":
        user = db.query(User).filter(User.phone == "9876543210").first()
        if not user:
            from ..seed_data import seed_database
            seed_database(db)
            user = db.query(User).filter(User.phone == "9876543210").first()
        return user
    elif persona_key == "farmer":
        user = db.query(User).filter(User.phone == "9822001122").first()
        if not user:
            user = User(
                phone="9822001122",
                full_name="Rameshwar Namdeo Patil",
                preferred_language="mr"
            )
            db.add(user)
            db.flush()
            profile = UserProfile(
                user_id=user.id,
                age=52,
                gender="Male",
                marital_status="Married",
                state="Maharashtra",
                district="Solapur",
                occupation="Farmer",
                is_farmer=True,
                land_holding_acres="3.2",
                annual_income=72000,
                income_category="EWS"
            )
            db.add(profile)
            db.commit()
            db.refresh(user)
        return user
    else:
        return db.query(User).first()
