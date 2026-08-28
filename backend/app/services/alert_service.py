import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.services.parcel_service import ParcelService

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
ALERTS_PATH = os.path.join(DATA_DIR, "alerts.json")
REPORTS_PATH = os.path.join(DATA_DIR, "citizen_reports.json")

class AlertService:
    _alerts: List[Dict[str, Any]] = []
    _reports: List[Dict[str, Any]] = []

    @classmethod
    def _init_default_alerts(cls):
        if not cls._alerts:
            if os.path.exists(ALERTS_PATH):
                with open(ALERTS_PATH, "r") as f:
                    cls._alerts = json.load(f)
            else:
                # Seed realistic default alerts matching hackathon requirement
                cls._alerts = [
                    {
                        "alert_id": "ALT-00102",
                        "parcel_id": "P-00102",
                        "survey_number": "102/3A",
                        "village": "Rampur",
                        "district": "Jaipur",
                        "detection_type": "Unauthorized Building Construction",
                        "risk_level": "HIGH",
                        "risk_score": 88.5,
                        "created_at": "2026-08-28 09:30:00",
                        "status": "UNDER_REVIEW", # Default demo status
                        "description": "High-confidence building structure detected on agricultural land P-00102 without recorded conversion permit.",
                        "evidence_image_before": "/static/imagery/demo_p00102_2025_before.png",
                        "evidence_image_after": "/static/imagery/demo_p00102_2026_after.png",
                        "ai_confidence": 0.94,
                        "change_area_sqm": 420.0,
                        "officer_notes": "Assigned to SDM Jaipur office for physical boundary verification.",
                        "verified_by": "SDM Officer R. Sharma",
                        "verified_at": "2026-08-28 11:15:00"
                    },
                    {
                        "alert_id": "ALT-00145",
                        "parcel_id": "P-00014",
                        "survey_number": "145/2",
                        "village": "Kishangarh",
                        "district": "Ajmer",
                        "detection_type": "Land-use Change / Clearing",
                        "risk_level": "MEDIUM",
                        "risk_score": 58.0,
                        "created_at": "2026-08-28 07:15:00",
                        "status": "NEW",
                        "description": "Noticeable vegetation removal and land clearing detected near forest buffer zone.",
                        "evidence_image_before": "/static/imagery/demo_p00102_2025_before.png",
                        "evidence_image_after": "/static/imagery/demo_p00102_2026_after.png",
                        "ai_confidence": 0.82,
                        "change_area_sqm": 210.0,
                        "officer_notes": None,
                        "verified_by": None,
                        "verified_at": None
                    },
                    {
                        "alert_id": "ALT-00088",
                        "parcel_id": "P-00045",
                        "survey_number": "88/1B",
                        "village": "Devpur",
                        "district": "Pune",
                        "detection_type": "Possible Encroachment",
                        "risk_level": "HIGH",
                        "risk_score": 82.0,
                        "created_at": "2026-08-27 16:45:00",
                        "status": "VERIFIED",
                        "description": "Structure encroaching onto designated Government land buffer.",
                        "evidence_image_before": "/static/imagery/demo_p00102_2025_before.png",
                        "evidence_image_after": "/static/imagery/demo_p00102_2026_after.png",
                        "ai_confidence": 0.91,
                        "change_area_sqm": 310.0,
                        "officer_notes": "Encroachment notice issued to occupier.",
                        "verified_by": "Officer V. Kulkarni",
                        "verified_at": "2026-08-27 18:20:00"
                    }
                ]
                cls.save_alerts()

    @classmethod
    def save_alerts(cls):
        with open(ALERTS_PATH, "w") as f:
            json.dump(cls._alerts, f, indent=2)

    @classmethod
    def get_all(cls, severity: Optional[str] = None, status: Optional[str] = None) -> List[Dict[str, Any]]:
        cls._init_default_alerts()
        res = cls._alerts
        if severity:
            res = [a for a in res if a.get("risk_level", "").upper() == severity.upper()]
        if status:
            res = [a for a in res if a.get("status", "").upper() == status.upper()]
        return res

    @classmethod
    def get_by_id(cls, alert_id: str) -> Optional[Dict[str, Any]]:
        cls._init_default_alerts()
        for a in cls._alerts:
            if a.get("alert_id").lower() == alert_id.lower():
                return a
        return None

    @classmethod
    def create_alert(cls, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        cls._init_default_alerts()
        # Avoid duplicate active alerts for same parcel
        for existing in cls._alerts:
            if existing.get("parcel_id") == alert_data.get("parcel_id") and existing.get("status") in ["NEW", "UNDER_REVIEW"]:
                # Update existing alert with fresh AI findings
                existing.update(alert_data)
                cls.save_alerts()
                return existing

        cls._alerts.insert(0, alert_data)
        cls.save_alerts()
        return alert_data

    @classmethod
    def update_verification(cls, alert_id: str, new_status: str, officer_name: str, notes: str) -> Optional[Dict[str, Any]]:
        cls._init_default_alerts()
        target = None
        for a in cls._alerts:
            if a.get("alert_id") == alert_id:
                a["status"] = new_status
                a["verified_by"] = officer_name
                a["officer_notes"] = notes
                a["verified_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                target = a
                break

        if target:
            cls.save_alerts()
            # Sync parcel status
            ParcelService.update_status(
                parcel_id=target["parcel_id"],
                status=new_status,
                risk_level=target["risk_level"]
            )
        return target

    # Citizen Reports
    @classmethod
    def _init_default_reports(cls):
        if not cls._reports:
            if os.path.exists(REPORTS_PATH):
                with open(REPORTS_PATH, "r") as f:
                    cls._reports = json.load(f)
            else:
                cls._reports = [
                    {
                        "report_id": "RPT-000123",
                        "issue_type": "Unauthorized Encroachment",
                        "survey_number": "102/3A",
                        "village": "Rampur",
                        "district": "Jaipur",
                        "description": "New concrete building frame erected overnight near agricultural boundary line.",
                        "created_at": "2026-08-28 08:00:00",
                        "status": "UNDER_INVESTIGATION",
                        "reporter_name": "Citizen (Local Farmer)",
                        "reporter_contact": "9876543210",
                        "assigned_parcel_id": "P-00102"
                    }
                ]
                with open(REPORTS_PATH, "w") as f:
                    json.dump(cls._reports, f, indent=2)

    @classmethod
    def get_citizen_reports(cls) -> List[Dict[str, Any]]:
        cls._init_default_reports()
        return cls._reports

    @classmethod
    def create_citizen_report(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        cls._init_default_reports()
        rpt_id = f"RPT-{len(cls._reports)+124:06d}"
        new_rpt = {
            "report_id": rpt_id,
            "issue_type": data.get("issue_type", "Encroachment"),
            "survey_number": data.get("survey_number", "N/A"),
            "village": data.get("village", "Rampur"),
            "district": data.get("district", "Jaipur"),
            "description": data.get("description", ""),
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "NEW_REPORT",
            "reporter_name": data.get("reporter_name", "Citizen"),
            "reporter_contact": data.get("reporter_contact", ""),
            "assigned_parcel_id": "P-00102" if "102" in data.get("survey_number", "") else None
        }
        cls._reports.insert(0, new_rpt)
        with open(REPORTS_PATH, "w") as f:
            json.dump(cls._reports, f, indent=2)
        return new_rpt
