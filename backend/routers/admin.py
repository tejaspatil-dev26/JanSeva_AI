import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.scheme import Scheme
from ..models.document import Document
from ..models.application import Application, ApplicationStatusHistory
from ..models.audit import AuditLog, Notification
from ..schemas.application import ApplicationStatusUpdate, ApplicationOut

router = APIRouter(prefix="/admin", tags=["Administrative & Officer Operations"])

@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_schemes = db.query(Scheme).count()
    total_apps = db.query(Application).count()
    total_docs = db.query(Document).count()
    
    submitted_apps = db.query(Application).filter(Application.status == "Submitted").count()
    approved_apps = db.query(Application).filter(Application.status == "Approved").count()
    under_verification_apps = db.query(Application).filter(Application.status == "Under Verification").count()

    status_distribution = {
        "Submitted": submitted_apps,
        "Under Verification": under_verification_apps,
        "Approved": approved_apps,
        "Draft": db.query(Application).filter(Application.status == "Draft").count()
    }

    # Department distribution
    dept_stats = {}
    for app in db.query(Application).all():
        dept_stats[app.department] = dept_stats.get(app.department, 0) + 1

    return {
        "total_registered_users": total_users,
        "total_active_schemes": total_schemes,
        "total_applications": total_apps,
        "submitted_applications": submitted_apps,
        "approved_applications": approved_apps,
        "total_documents_processed": total_docs,
        "ocr_accuracy_rate": 96.8,
        "status_distribution": status_distribution,
        "department_distribution": dept_stats,
        "system_status": "Operational",
        "portal_gateway": "Connected (MahaSeva Demo Gateway)"
    }

@router.get("/applications", response_model=list[ApplicationOut])
def get_all_applications(db: Session = Depends(get_db)):
    return db.query(Application).order_by(Application.created_at.desc()).all()

@router.put("/applications/{app_id}/update-status", response_model=ApplicationOut)
def update_application_status(
    app_id: int,
    req: ApplicationStatusUpdate,
    officer_name: str = "Tahsildar / Desk Officer",
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = req.status
    if req.next_action:
        app.next_required_action = req.next_action
    
    # Add status history event
    hist = ApplicationStatusHistory(
        application_id=app.id,
        status=req.status,
        title=f"Status Updated to {req.status}",
        description=req.remarks or f"Application status advanced by {officer_name}.",
        action_by=officer_name,
        remarks=req.remarks
    )
    db.add(hist)

    # Citizen notification
    notif = Notification(
        user_id=app.user_id,
        title=f"Application Update: {app.scheme.name if app.scheme else 'Scheme'}",
        message=f"Status changed to '{req.status}'. {req.remarks or ''}",
        notification_type="info" if req.status != "Approved" else "success",
        category="application",
        link=f"/applications/{app.id}",
        sent_in_app=True,
        sent_whatsapp=True,
        whatsapp_status="simulated_delivered",
        sent_sms=True,
        sms_status="simulated_delivered"
    )
    db.add(notif)

    audit = AuditLog(
        user_id=app.user_id,
        action="APPLICATION_STATUS_UPDATE",
        resource_type="application",
        resource_id=app.application_reference_no,
        details={"new_status": req.status, "officer": officer_name, "remarks": req.remarks}
    )
    db.add(audit)
    db.commit()
    db.refresh(app)
    return app

@router.get("/audit-logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return logs
