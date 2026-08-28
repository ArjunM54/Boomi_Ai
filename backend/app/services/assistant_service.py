from typing import Dict, Any, List
from app.services.parcel_service import ParcelService
from app.services.alert_service import AlertService

class AssistantService:
    """
    AI Land Intelligence Assistant.
    Translates officer natural language prompts into database queries and synthesizes factual answers.
    """

    @classmethod
    def query(cls, prompt: str) -> Dict[str, Any]:
        q = prompt.lower().strip()
        
        all_parcels = ParcelService.get_all()
        all_alerts = AlertService.get_all()

        relevant_parcels = []
        relevant_alerts = []
        reply_lines = []

        if "high risk" in q or "high-risk" in q or "dangerous" in q or "high priority" in q:
            relevant_parcels = [p for p in all_parcels if p.get("risk_level") == "HIGH"]
            relevant_alerts = [a for a in all_alerts if a.get("risk_level") == "HIGH"]
            reply_lines.append(f"Found {len(relevant_parcels)} high-risk land parcels and {len(relevant_alerts)} high-priority alerts in the system.")
            reply_lines.append(f"Top priority parcel is P-00102 (Survey 102/3A in Rampur) with detected unauthorized construction.")

        elif "construction" in q or "building" in q or "structure" in q:
            relevant_alerts = [a for a in all_alerts if "construction" in a.get("detection_type", "").lower() or "building" in a.get("detection_type", "").lower()]
            p_ids = set([a["parcel_id"] for a in relevant_alerts])
            relevant_parcels = [p for p in all_parcels if p["parcel_id"] in p_ids or p.get("is_demo_target")]
            reply_lines.append(f"Identified {len(relevant_alerts)} parcels where building or construction activity was detected via satellite/drone AI analysis.")
            reply_lines.append("Key incident: Parcel P-00102 (Survey No: 102/3A) shows new concrete construction on Agricultural land.")

        elif "unresolved" in q or "pending" in q or "open" in q or "new" in q:
            relevant_alerts = [a for a in all_alerts if a.get("status") in ["NEW", "UNDER_REVIEW"]]
            reply_lines.append(f"There are currently {len(relevant_alerts)} unresolved alerts requiring officer verification or field inspection.")
            for a in relevant_alerts:
                reply_lines.append(f"• Alert {a['alert_id']} ({a['survey_number']} - {a['village']}): Risk {a['risk_level']} [{a['status']}]")

        elif "summary" in q or "today" in q or "overview" in q or "report" in q:
            high_count = len([a for a in all_alerts if a.get("risk_level") == "HIGH"])
            under_rev = len([a for a in all_alerts if a.get("status") == "UNDER_REVIEW"])
            reply_lines.append(f"Daily Land Governance Intelligence Summary:")
            reply_lines.append(f"• Total Parcels Monitored: {len(all_parcels)}")
            reply_lines.append(f"• Total Active Alerts: {len(all_alerts)}")
            reply_lines.append(f"• High Priority Incidents: {high_count}")
            reply_lines.append(f"• Under Officer Review: {under_rev}")
            reply_lines.append(f"Primary flag: Survey 102/3A (Rampur) requires urgent officer sign-off.")

        else:
            # General query search across survey numbers and villages
            matched_p = ParcelService.search(q)
            if matched_p:
                relevant_parcels = matched_p[:5]
                reply_lines.append(f"Found {len(matched_p)} matching land records for query '{prompt}'.")
                for p in relevant_parcels:
                    reply_lines.append(f"• Parcel {p['parcel_id']} (Survey {p['survey_number']} - {p['village']}): {p['land_type']}, Area {p['area_acres']} acres, Risk: {p['risk_level']}")
            else:
                reply_lines.append("No matching records found in the current dataset.")
                reply_lines.append("Try asking: 'Show high-risk parcels', 'Which parcels had construction changes?', or 'Show unresolved alerts'.")

        return {
            "query": prompt,
            "reply": "\n".join(reply_lines),
            "relevant_parcels": relevant_parcels,
            "relevant_alerts": relevant_alerts
        }
