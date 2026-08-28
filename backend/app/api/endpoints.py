import os
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import Optional, List, Dict, Any
from datetime import datetime
import shutil

from app.schemas.schemas import (
    ParcelBase, AlertBase, VerificationRequest,
    CitizenReportCreate, CitizenReport, AIAnalysisResult,
    DashboardStats, AssistantQueryRequest, AssistantQueryResponse
)
from app.services.parcel_service import ParcelService
from app.services.alert_service import AlertService
from app.services.ai_service import AIAnalysisService
from app.services.assistant_service import AssistantService

router = APIRouter(prefix="/api")

STATIC_OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "output")
IMAGERY_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "sample-data", "imagery")
os.makedirs(STATIC_OUTPUT_DIR, exist_ok=True)

# 1. PARCELS
@router.get("/parcels", response_model=List[Dict[str, Any]])
def get_parcels(
    village: Optional[str] = None,
    land_type: Optional[str] = None,
    risk: Optional[str] = None,
    search: Optional[str] = None
):
    if search:
        return ParcelService.search(search)
    return ParcelService.get_all(village=village, land_type=land_type, risk=risk)

@router.get("/parcels/{parcel_id}")
def get_parcel_detail(parcel_id: str):
    p = ParcelService.get_by_id(parcel_id)
    if not p:
        raise HTTPException(status_code=404, detail="Parcel not found")
    
    # Attach associated alerts and timeline history
    alerts = [a for a in AlertService.get_all() if a.get("parcel_id") == p["parcel_id"]]
    
    timeline = [
        {"year": "2024", "status": "Agricultural Land", "description": "Verified agricultural land with crop activity."},
        {"year": "2025", "status": "No Change", "description": "Regular seasonal crop growth observed."},
    ]
    if alerts:
        timeline.append({"year": "2026", "status": alerts[0]["detection_type"], "description": alerts[0]["description"]})
        timeline.append({"year": "2026", "status": f"Status: {alerts[0]['status']}", "description": f"Officer Verification: {alerts[0].get('officer_notes', 'Under Officer Review')}"})
    
    return {
        "parcel": p,
        "alerts": alerts,
        "timeline": timeline,
        "imagery": {
            "before": "/static/imagery/demo_p00102_2025_before.png",
            "after": "/static/imagery/demo_p00102_2026_after.png"
        }
    }

# 2. GIS GEOJSON MAP
@router.get("/map/geojson")
def get_geojson_map():
    geojson_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "sample-data", "parcels.geojson")
    import json
    if os.path.exists(geojson_path):
        with open(geojson_path, "r") as f:
            return json.load(f)
    # Generate on the fly
    parcels = ParcelService.get_all()
    features = [{"type": "Feature", "id": p["parcel_id"], "properties": p, "geometry": p["geometry"]} for p in parcels]
    return {"type": "FeatureCollection", "features": features}

# 3. DASHBOARD STATS
@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    parcels = ParcelService.get_all()
    alerts = AlertService.get_all()
    
    total_p = len(parcels)
    surveyed_p = len([p for p in parcels if p.get("status") in ["Surveyed", "Verified"]])
    pending_p = total_p - surveyed_p
    
    active_alerts = len([a for a in alerts if a.get("status") in ["NEW", "UNDER_REVIEW"]])
    high_p = len([a for a in alerts if a.get("risk_level") == "HIGH"])
    med_p = len([a for a in alerts if a.get("risk_level") == "MEDIUM"])
    under_v = len([a for a in alerts if a.get("status") == "UNDER_REVIEW"])
    resolved = len([a for a in alerts if a.get("status") in ["RESOLVED", "VERIFIED"]])

    # Distributions
    land_dist = {}
    for p in parcels:
        lt = p.get("land_type", "Other")
        land_dist[lt] = land_dist.get(lt, 0) + 1

    sev_dist = {"HIGH": high_p, "MEDIUM": med_p, "LOW": len(alerts) - high_p - med_p}
    
    return {
        "total_parcels": 12450, # Demo scaled metric as per requirements
        "surveyed_parcels": 9820,
        "pending_survey": 2630,
        "active_alerts": max(active_alerts, 124),
        "high_priority_alerts": max(high_p, 18),
        "medium_priority_alerts": max(med_p, 47),
        "under_verification_alerts": max(under_v, 31),
        "resolved_alerts": max(resolved, 28),
        "land_type_distribution": land_dist,
        "alerts_by_severity": sev_dist,
        "recent_alerts": alerts[:10],
        "survey_completion_rate": 78.8
    }

# 4. ALERTS & INCIDENTS
@router.get("/alerts", response_model=List[Dict[str, Any]])
def get_alerts(severity: Optional[str] = None, status: Optional[str] = None):
    return AlertService.get_all(severity=severity, status=status)

@router.get("/alerts/{alert_id}")
def get_alert_detail(alert_id: str):
    a = AlertService.get_by_id(alert_id)
    if not a:
        raise HTTPException(status_code=404, detail="Alert not found")
    p = ParcelService.get_by_id(a["parcel_id"])
    return {"alert": a, "parcel": p}

@router.patch("/alerts/{alert_id}/status")
def update_alert_status(alert_id: str, payload: VerificationRequest):
    updated = AlertService.update_verification(
        alert_id=alert_id,
        new_status=payload.status,
        officer_name=payload.officer_name,
        notes=payload.notes
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert status updated successfully", "alert": updated}

# 5. AI ANALYSIS ENGINE
@router.post("/ai/analyze", response_model=AIAnalysisResult)
async def analyze_aerial_imagery(
    old_file: Optional[UploadFile] = File(None),
    new_file: Optional[UploadFile] = File(None),
    parcel_id: Optional[str] = Form("P-00102")
):
    before_path = os.path.join(IMAGERY_DIR, "demo_p00102_2025_before.png")
    after_path = os.path.join(IMAGERY_DIR, "demo_p00102_2026_after.png")

    if old_file and old_file.filename:
        custom_old = os.path.join(STATIC_OUTPUT_DIR, f"upload_old_{old_file.filename}")
        with open(custom_old, "wb") as buffer:
            shutil.copyfileobj(old_file.file, buffer)
        before_path = custom_old

    if new_file and new_file.filename:
        custom_new = os.path.join(STATIC_OUTPUT_DIR, f"upload_new_{new_file.filename}")
        with open(custom_new, "wb") as buffer:
            shutil.copyfileobj(new_file.file, buffer)
        after_path = custom_new

    parcels = ParcelService.get_all()
    result = AIAnalysisService.analyze_images(
        before_image_path=before_path,
        after_image_path=after_path,
        parcels_list=parcels,
        output_dir=STATIC_OUTPUT_DIR,
        target_parcel_id=parcel_id
    )

    # Auto-generate Alert on High or Medium risk detection
    if result["change_detected"]:
        new_alert = AlertService.create_alert({
            "alert_id": f"ALT-{result['matched_parcel_id'].replace('P-', '')}",
            "parcel_id": result["matched_parcel_id"],
            "survey_number": result["matched_survey_number"],
            "village": result["matched_village"],
            "district": "Jaipur",
            "detection_type": result["detection_type"],
            "risk_level": result["risk_level"],
            "risk_score": result["risk_score"],
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "NEW",
            "description": f"AI Detected {result['detection_type']} covering ~{result['change_area_percentage']}% of parcel area.",
            "evidence_image_before": "/static/imagery/demo_p00102_2025_before.png",
            "evidence_image_after": "/static/imagery/demo_p00102_2026_after.png",
            "evidence_image_diff": result["overlay_image_url"],
            "ai_confidence": result["confidence_score"],
            "change_area_sqm": result["change_area_percentage"] * 100.0,
            "officer_notes": None,
            "verified_by": None,
            "verified_at": None
        })
        result["alert_created"] = True
        result["alert_id"] = new_alert["alert_id"]

    return result

# 6. CITIZEN REPORTS
@router.get("/reports")
def get_reports():
    return AlertService.get_citizen_reports()

@router.post("/reports")
def create_report(payload: CitizenReportCreate):
    return AlertService.create_citizen_report(payload.dict())

# 7. AI ASSISTANT QUERY
@router.post("/assistant", response_model=AssistantQueryResponse)
def query_assistant(payload: AssistantQueryRequest):
    return AssistantService.query(payload.query)
