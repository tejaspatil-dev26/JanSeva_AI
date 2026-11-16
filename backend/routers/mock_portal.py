import datetime
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/mock-portal", tags=["MahaSeva Government Portal Testbed Gateway"])

@router.get("/verify/{acknowledgment_no}")
def verify_portal_application(acknowledgment_no: str):
    """
    Simulates the official Government Department Portal (e.g. MahaDBT / NSAP)
    acknowledgment verification service.
    """
    clean_ack = acknowledgment_no.strip().upper()
    
    is_widow = "WID" in clean_ack or "REV" in clean_ack or "NIRADHAR" in clean_ack
    department = "Social Justice and Special Assistance Department, Govt of Maharashtra" if is_widow else "Department of Agriculture & Farmers Welfare, Govt of India"
    scheme_name = "Sanjay Gandhi Niradhar Anudan Yojana" if is_widow else "PM-KISAN Samman Nidhi"

    return {
        "portal_name": "MahaSeva Government Digital Gateway (Testbed)",
        "acknowledgment_number": clean_ack,
        "is_valid": True,
        "department": department,
        "scheme_name": scheme_name,
        "submission_channel": "JanSeva AI Automated Gateway Service",
        "transmission_timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "current_portal_stage": "Stage 2: Desk Scrutiny by Taluka Verification Officer",
        "assigned_office": "Haveli Taluka Tahsildar Office, Pune District",
        "beneficiary_verification_status": "Aadhaar e-KYC Verified & Land Record Linked",
        "estimated_resolution_days": 14,
        "direct_benefit_status": "DBT Bank Mandate Active (State Bank of India)",
        "official_disclaimer": "This is a verified testbed portal response simulating state & central digital administrative workflows."
    }

@router.get("/status")
def portal_health_status():
    return {
        "gateway_status": "ONLINE",
        "response_time_ms": 28,
        "supported_schemes_count": 8,
        "portal_endpoints": [
            "https://mahadbt.maharashtra.gov.in/portal/services",
            "https://nsap.nic.in/citizen-services",
            "https://pmkisan.gov.in/aadharservice"
        ],
        "uptime": "99.98%"
    }
