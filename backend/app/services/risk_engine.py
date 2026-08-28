from typing import Dict, Any, List, Tuple

class TransparentRiskEngine:
    """
    Transparent Decision-Support Risk Engine for BhoomiAI Land Intelligence.
    Calculates weighted risk score based on detection confidence, land type conflict,
    and change magnitude.
    """

    LAND_TYPE_WEIGHTS = {
        "Agricultural": 1.4,      # High sensitivity to unauthorized construction
        "Forest / Green Belt": 1.8,# Critical environmental protection zone
        "Government": 1.6,        # High risk of illegal encroachment
        "Water Body": 1.9,        # Critical ecological zone
        "Residential": 1.0,       # Moderate baseline
        "Commercial": 0.9,        # Expected development
        "Industrial": 0.8         # Expected construction
    }

    CHANGE_TYPE_WEIGHTS = {
        "Unauthorized Construction": 1.5,
        "Encroachment": 1.6,
        "Land-use Conversion": 1.2,
        "Minor Vegetation Change": 0.6,
        "Earthwork / Excavation": 1.1,
    }

    @classmethod
    def calculate_risk(
        cls,
        ai_confidence: float,
        affected_area_pct: float,
        land_type: str,
        detection_type: str = "Unauthorized Construction"
    ) -> Tuple[float, str, List[str]]:
        
        rationale = []
        
        # 1. Base Score from AI Confidence (0 - 40 points)
        base_confidence_score = min(ai_confidence * 40.0, 40.0)
        rationale.append(f"AI Detection Confidence ({ai_confidence * 100:.1f}%): +{base_confidence_score:.1f} pts")

        # 2. Magnitude Score from Area Percentage (0 - 30 points)
        # Cap at 25% change for max 30 points
        area_factor = min(affected_area_pct / 25.0, 1.0)
        magnitude_score = area_factor * 30.0
        rationale.append(f"Change Magnitude ({affected_area_pct:.1f}% parcel area): +{magnitude_score:.1f} pts")

        # 3. Land-Use & Change Type Sensitivity Multipliers
        land_weight = cls.LAND_TYPE_WEIGHTS.get(land_type, 1.0)
        change_weight = cls.CHANGE_TYPE_WEIGHTS.get(detection_type, 1.0)
        
        sensitivity_score = 30.0 * (land_weight * 0.6 + change_weight * 0.4 - 0.5)
        sensitivity_score = max(5.0, min(sensitivity_score, 30.0))
        rationale.append(f"Land Type ({land_type}) & Violation Category ({detection_type}) Multiplier: +{sensitivity_score:.1f} pts")

        # Total Raw Score (0 - 100)
        raw_score = base_confidence_score + magnitude_score + sensitivity_score
        final_score = round(min(max(raw_score, 0.0), 100.0), 1)

        # Risk Classification Thresholds: 0-39 LOW, 40-69 MEDIUM, 70-100 HIGH
        if final_score >= 70.0:
            level = "HIGH"
        elif final_score >= 40.0:
            level = "MEDIUM"
        else:
            level = "LOW"

        rationale.append(f"Final Risk Classification: {final_score}/100 ({level})")
        return final_score, level, rationale
