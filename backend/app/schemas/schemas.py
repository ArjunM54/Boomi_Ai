from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class ParcelGeometry(BaseModel):
    type: str = "Polygon"
    coordinates: List[List[List[float]]]

class ParcelBase(BaseModel):
    parcel_id: str
    survey_number: str
    village: str
    district: str
    area_acres: float
    land_type: str
    latitude: float
    longitude: float
    geometry: ParcelGeometry
    status: str
    risk_level: str
    owner_name: Optional[str] = "Government / Private Land Record"
    last_survey_date: Optional[str] = None
    latest_change: Optional[str] = None
    is_demo_target: Optional[bool] = False

class AlertBase(BaseModel):
    alert_id: str
    parcel_id: str
    survey_number: str
    village: str
    district: str
    detection_type: str
    risk_level: str
    risk_score: float
    created_at: str
    status: str  # NEW, UNDER_REVIEW, VERIFIED, REJECTED, RESOLVED
    description: str
    evidence_image_before: str
    evidence_image_after: str
    evidence_image_diff: Optional[str] = None
    ai_confidence: float
    change_area_sqm: float
    officer_notes: Optional[str] = None
    verified_by: Optional[str] = None
    verified_at: Optional[str] = None

class VerificationRequest(BaseModel):
    status: str  # VERIFIED, REJECTED, ASSIGNED_INSPECTION, RESOLVED
    officer_name: str = "Officer R. Sharma (Sub-Divisional Magistrate)"
    notes: str = "Verified via high-res drone imagery and spatial boundary overlap."

class CitizenReportCreate(BaseModel):
    issue_type: str
    survey_number: str
    village: str
    district: Optional[str] = "Jaipur"
    description: str
    reporter_name: Optional[str] = "Anonymous Citizen"
    reporter_contact: Optional[str] = ""

class CitizenReport(BaseModel):
    report_id: str
    issue_type: str
    survey_number: str
    village: str
    district: str
    description: str
    created_at: str
    status: str = "PENDING_INVESTIGATION"
    reporter_name: str
    reporter_contact: Optional[str] = ""
    assigned_parcel_id: Optional[str] = None

class AIAnalysisRequest(BaseModel):
    old_image_path: Optional[str] = None
    new_image_path: Optional[str] = None
    parcel_id: Optional[str] = "P-00102"
    sensitivity: Optional[float] = 0.5

class BoundingBox(BaseModel):
    x: int
    y: int
    w: int
    h: int
    label: str
    confidence: float

class AIAnalysisResult(BaseModel):
    analysis_id: str
    status: str
    change_detected: bool
    detection_type: str
    change_area_percentage: float
    confidence_score: float
    matched_parcel_id: Optional[str]
    matched_survey_number: Optional[str]
    matched_village: Optional[str]
    matched_latitude: float
    matched_longitude: float
    risk_score: float
    risk_level: str
    rationale: List[str]
    boxes: List[BoundingBox]
    overlay_image_url: str
    alert_created: Optional[bool] = False
    alert_id: Optional[str] = None
    disclaimer: str = "Decision-Support Prototype Model — Verification Required by Authorized Official."

class DashboardStats(BaseModel):
    total_parcels: int
    surveyed_parcels: int
    pending_survey: int
    active_alerts: int
    high_priority_alerts: int
    medium_priority_alerts: int
    under_verification_alerts: int
    resolved_alerts: int
    land_type_distribution: Dict[str, int]
    alerts_by_severity: Dict[str, int]
    recent_alerts: List[AlertBase]
    survey_completion_rate: float

class AssistantQueryRequest(BaseModel):
    query: str

class AssistantQueryResponse(BaseModel):
    query: str
    reply: str
    relevant_parcels: List[ParcelBase] = []
    relevant_alerts: List[AlertBase] = []
