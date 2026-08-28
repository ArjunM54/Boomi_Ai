from typing import Optional, Dict, Any, List
from shapely.geometry import Point, Polygon
import json

class GISService:
    """
    Spatial GIS Service using Shapely for Point-in-Polygon parcel lookup
    and GeoJSON coordinate transforms.
    """

    @staticmethod
    def point_in_polygon(lng: float, lat: float, parcel_geometry: Dict[str, Any]) -> bool:
        """
        Tests whether a given (longitude, latitude) point falls within a parcel polygon geometry.
        """
        try:
            coords = parcel_geometry.get("coordinates", [])
            if not coords:
                return False
            # GeoJSON coordinates format: [[[lng, lat], [lng, lat], ...]]
            poly_points = coords[0]
            poly = Polygon(poly_points)
            point = Point(lng, lat)
            return poly.contains(point) or poly.touches(point)
        except Exception as e:
            print(f"Error in Point-in-Polygon calculation: {e}")
            return False

    @classmethod
    def match_coordinates_to_parcel(
        cls, lng: float, lat: float, parcels_list: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """
        Iterates over parcels and returns the matching parcel containing (lng, lat).
        Fallback to nearest parcel within tolerance if exact point is on border.
        """
        # 1. Exact Point-in-Polygon check
        for parcel in parcels_list:
            geom = parcel.get("geometry", {})
            if cls.point_in_polygon(lng, lat, geom):
                return parcel

        # 2. Distance-based fallback to closest parcel center if slightly offset
        closest_parcel = None
        min_dist = float("inf")
        point = Point(lng, lat)
        
        for parcel in parcels_list:
            p_lat = parcel.get("latitude")
            p_lng = parcel.get("longitude")
            if p_lat is not None and p_lng is not None:
                dist = ((p_lat - lat)**2 + (p_lng - lng)**2)**0.5
                if dist < min_dist and dist < 0.01: # Within ~1km threshold
                    min_dist = dist
                    closest_parcel = parcel
                    
        return closest_parcel
