from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.audit import Notification
from ..schemas.notification import NotificationOut

router = APIRouter(prefix="/notifications", tags=["Citizen Notifications"])

@router.get("", response_model=list[NotificationOut])
def list_notifications(user_id: int = 1, db: Session = Depends(get_db)):
    notifs = db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()
    return notifs

@router.put("/{notif_id}/read", response_model=NotificationOut)
def mark_notification_read(notif_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id, Notification.user_id == user_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

@router.put("/read-all")
def mark_all_read(user_id: int = 1, db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == user_id).update({Notification.is_read: True})
    db.commit()
    return {"message": "All notifications marked as read"}
