import json
import os
from typing import List, Dict, Any, Optional

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "parcels.json")

class ParcelService:
    _parcels_cache: List[Dict[str, Any]] = []

    @classmethod
    def load_parcels(cls) -> List[Dict[str, Any]]:
        if not cls._parcels_cache:
            if os.path.exists(DATA_PATH):
                with open(DATA_PATH, "r") as f:
                    cls._parcels_cache = json.load(f)
            else:
                from app.utils.seed import generate_parcel_data
                cls._parcels_cache = generate_parcel_data()
        return cls._parcels_cache

    @classmethod
    def get_all(cls, village: Optional[str] = None, land_type: Optional[str] = None, risk: Optional[str] = None) -> List[Dict[str, Any]]:
        parcels = cls.load_parcels()
        res = parcels
        if village:
            res = [p for p in res if p.get("village", "").lower() == village.lower()]
        if land_type:
            res = [p for p in res if p.get("land_type", "").lower() == land_type.lower()]
        if risk:
            res = [p for p in res if p.get("risk_level", "").upper() == risk.upper()]
        return res

    @classmethod
    def get_by_id(cls, parcel_id: str) -> Optional[Dict[str, Any]]:
        parcels = cls.load_parcels()
        for p in parcels:
            if p.get("parcel_id").lower() == parcel_id.lower() or p.get("survey_number").lower() == parcel_id.lower():
                return p
        return None

    @classmethod
    def search(cls, query: str) -> List[Dict[str, Any]]:
        q = query.lower().strip()
        parcels = cls.load_parcels()
        results = []
        for p in parcels:
            if (q in p.get("parcel_id", "").lower() or
                q in p.get("survey_number", "").lower() or
                q in p.get("village", "").lower() or
                q in p.get("district", "").lower()):
                results.append(p)
        return results

    @classmethod
    def update_status(cls, parcel_id: str, status: str, risk_level: Optional[str] = None):
        parcels = cls.load_parcels()
        for p in parcels:
            if p.get("parcel_id") == parcel_id:
                p["status"] = status
                if risk_level:
                    p["risk_level"] = risk_level
                break
        with open(DATA_PATH, "w") as f:
            json.dump(parcels, f, indent=2)
