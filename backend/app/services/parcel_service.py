import json
import os
from typing import List, Dict, Any, Optional

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "parcels.json")

class ParcelService:
    _parcels_cache: List[Dict[str, Any]] = []

    @classmethod
    def load_parcels(cls, force_reload: bool = False) -> List[Dict[str, Any]]:
        if not cls._parcels_cache or force_reload:
            if os.path.exists(DATA_PATH):
                with open(DATA_PATH, "r") as f:
                    cls._parcels_cache = json.load(f)
            else:
                from app.utils.seed import generate_parcel_data
                cls._parcels_cache = generate_parcel_data()
        return cls._parcels_cache

    @classmethod
    def get_all(cls, district: Optional[str] = None, village: Optional[str] = None, land_type: Optional[str] = None, risk: Optional[str] = None) -> List[Dict[str, Any]]:
        parcels = cls.load_parcels(force_reload=True)
        res = parcels
        if district and district != 'ALL':
            res = [p for p in res if p.get("district", "").lower() == district.lower()]
        if village and village != 'ALL':
            res = [p for p in res if p.get("village", "").lower() == village.lower()]
        if land_type and land_type != 'ALL':
            res = [p for p in res if p.get("land_type", "").lower() == land_type.lower()]
        if risk and risk != 'ALL':
            res = [p for p in res if p.get("risk_level", "").upper() == risk.upper()]
        return res

    @classmethod
    def get_by_id(cls, parcel_id: str) -> Optional[Dict[str, Any]]:
        parcels = cls.load_parcels(force_reload=True)
        for p in parcels:
            pid = p.get("parcel_id", "").lower()
            sno = p.get("survey_number", "").lower()
            ulpin = p.get("ulpin", "").lower()
            target = parcel_id.lower()
            if pid == target or sno == target or ulpin == target:
                return p
        return None

    @classmethod
    def search(cls, query: str) -> List[Dict[str, Any]]:
        q = query.lower().strip()
        parcels = cls.load_parcels(force_reload=True)
        results = []
        for p in parcels:
            if (q in p.get("parcel_id", "").lower() or
                q in p.get("ulpin", "").lower() or
                q in p.get("survey_number", "").lower() or
                q in p.get("village", "").lower() or
                q in p.get("district", "").lower()):
                results.append(p)
        return results

    @classmethod
    def update_status(cls, parcel_id: str, status: str, risk_level: Optional[str] = None):
        parcels = cls.load_parcels(force_reload=True)
        for p in parcels:
            if p.get("parcel_id") == parcel_id or p.get("ulpin") == parcel_id:
                p["status"] = status
                if risk_level:
                    p["risk_level"] = risk_level
                break
        with open(DATA_PATH, "w") as f:
            json.dump(parcels, f, indent=2)
        cls._parcels_cache = parcels
