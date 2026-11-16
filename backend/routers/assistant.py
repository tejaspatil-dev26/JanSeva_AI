import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, UserProfile
from ..models.chat import Conversation, ChatMessage
from ..models.scheme import Scheme
from ..models.audit import AuditLog
from ..schemas.chat import AskAssistantRequest, ChatMessageOut, ConversationOut
from ..services.ai_service import AIService

router = APIRouter(prefix="/assistant", tags=["AI Government Assistant"])

@router.post("/chat", response_model=ChatMessageOut)
async def chat_with_assistant(
    req: AskAssistantRequest,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session_id = req.session_id or f"session_{user.id}"
    conv = db.query(Conversation).filter(
        Conversation.user_id == user.id,
        Conversation.session_id == session_id
    ).first()

    if not conv:
        conv = Conversation(
            user_id=user.id,
            session_id=session_id,
            language=req.language or user.preferred_language or "en",
            extracted_context={}
        )
        db.add(conv)
        db.flush()

    # Save user message
    user_msg = ChatMessage(
        conversation_id=conv.id,
        sender="user",
        text=req.message,
        language=req.language or conv.language
    )
    db.add(user_msg)
    db.flush()

    # Gather history
    recent_msgs = db.query(ChatMessage).filter(
        ChatMessage.conversation_id == conv.id
    ).order_by(ChatMessage.created_at.desc()).limit(8).all()
    history = [{"role": m.sender, "text": m.text} for m in reversed(recent_msgs)]

    # Gather profile
    profile_dict = {}
    if user.profile:
        profile_dict = {
            "name": user.full_name,
            "age": user.profile.age,
            "gender": user.profile.gender,
            "state": user.profile.state,
            "is_farmer": user.profile.is_farmer,
            "is_widow": user.profile.is_widow,
            "annual_income": user.profile.annual_income,
            "landholding": user.profile.land_holding_acres
        }

    # Query schemes
    schemes = db.query(Scheme).filter(Scheme.is_active == True).all()
    scheme_dicts = [{"slug": s.slug, "name": s.name, "category": s.category} for s in schemes]

    # Call AI Service
    ai_response = await AIService.chat_response(
        user_message=req.message,
        language=req.language or conv.language,
        conversation_history=history,
        user_profile=profile_dict,
        available_schemes=scheme_dicts
    )

    # Update extracted facts into citizen profile
    if ai_response.get("extracted_facts"):
        current_ctx = dict(conv.extracted_context or {})
        current_ctx.update(ai_response["extracted_facts"])
        conv.extracted_context = current_ctx

        if user.profile:
            if "is_widow" in ai_response["extracted_facts"]:
                user.profile.is_widow = ai_response["extracted_facts"]["is_widow"]
                user.profile.marital_status = "Widow"
            if "is_farmer" in ai_response["extracted_facts"]:
                user.profile.is_farmer = ai_response["extracted_facts"]["is_farmer"]

    # Match recommended scheme objects
    rec_scheme_slugs = ai_response.get("recommended_scheme_slugs", [])
    rec_schemes = []
    if rec_scheme_slugs:
        matched = db.query(Scheme).filter(Scheme.slug.in_(rec_scheme_slugs)).all()
        for m in matched:
            rec_schemes.append({
                "id": m.id,
                "slug": m.slug,
                "name": m.name,
                "category": m.category,
                "department": m.department,
                "financial_benefit_amount": m.financial_benefit_amount,
                "required_documents": m.required_documents or []
            })

    # Save Assistant Chat Message
    assistant_msg = ChatMessage(
        conversation_id=conv.id,
        sender="assistant",
        text=ai_response["text"],
        language=req.language or conv.language,
        has_audio=True,
        suggested_actions=ai_response.get("suggested_actions", []),
        recommended_schemes=rec_schemes,
        follow_up_questions=ai_response.get("follow_up_questions", [])
    )
    db.add(assistant_msg)

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        action="ASSISTANT_QUERY",
        resource_type="chat",
        resource_id=str(conv.id),
        details={"query_length": len(req.message), "recommended_count": len(rec_schemes)}
    )
    db.add(audit)
    db.commit()
    db.refresh(assistant_msg)
    return assistant_msg

@router.get("/history", response_model=list[ChatMessageOut])
def get_chat_history(session_id: str = None, user_id: int = 1, db: Session = Depends(get_db)):
    session_id = session_id or f"session_{user_id}"
    conv = db.query(Conversation).filter(
        Conversation.user_id == user_id,
        Conversation.session_id == session_id
    ).first()
    
    if not conv:
        return []
    
    msgs = db.query(ChatMessage).filter(ChatMessage.conversation_id == conv.id).order_by(ChatMessage.created_at.asc()).all()
    return msgs
