import os
import json
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
SAMPLE_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "sample-data")
IMAGERY_DIR = os.path.join(SAMPLE_DATA_DIR, "imagery")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(SAMPLE_DATA_DIR, exist_ok=True)
os.makedirs(IMAGERY_DIR, exist_ok=True)

VILLAGES = [
    ("Rampur", "Jaipur", 26.9124, 75.7873),
    ("Kishangarh", "Ajmer", 26.5743, 74.8657),
    ("Devpur", "Pune", 18.5204, 73.8567),
    ("Sonpur", "Lucknow", 26.8467, 80.9462),
    ("Chandanpur", "Bhopal", 23.2599, 77.4126),
    ("Anandpur", "Patna", 25.5941, 85.1376),
    ("Shivpur", "Varanasi", 25.3176, 82.9739),
    ("Govindpur", "Ranchi", 23.3441, 85.3096),
    ("Chandpur", "Dehradun", 30.3165, 78.0322),
    ("Sundarpur", "Cuttack", 20.4625, 85.8828),
]

LAND_TYPES = [
    "Agricultural",
    "Government",
    "Residential",
    "Commercial",
    "Forest / Green Belt",
    "Water Body",
    "Industrial",
]

PARCEL_STATUSES = [
    "Surveyed",
    "Pending Survey",
    "Under Review",
    "Verified",
    "Disputed",
]

RISK_LEVELS = ["LOW", "MEDIUM", "HIGH"]

def generate_parcel_data():
    parcels = []
    features = []
    
    parcel_counter = 1
    
    # 1. Demo Target Parcel P-00102 (Survey 102/3A)
    demo_center_lat = 26.9124
    demo_center_lng = 75.7873
    
    demo_poly_coords = [
        [demo_center_lng - 0.0015, demo_center_lat - 0.0010],
        [demo_center_lng + 0.0012, demo_center_lat - 0.0012],
        [demo_center_lng + 0.0018, demo_center_lat + 0.0011],
        [demo_center_lng - 0.0010, demo_center_lat + 0.0014],
        [demo_center_lng - 0.0015, demo_center_lat - 0.0010],
    ]
    
    demo_parcel = {
        "parcel_id": "P-00102",
        "survey_number": "102/3A",
        "village": "Rampur",
        "district": "Jaipur",
        "area_acres": 2.4,
        "land_type": "Agricultural",
        "latitude": demo_center_lat,
        "longitude": demo_center_lng,
        "geometry": {
            "type": "Polygon",
            "coordinates": [demo_poly_coords]
        },
        "status": "Under Review",
        "risk_level": "HIGH",
        "owner_name": "Demo Land Records (Synthetic)",
        "last_survey_date": "2025-01-15",
        "latest_change": "Potential Construction Detected",
        "is_demo_target": True
    }
    parcels.append(demo_parcel)
    
    features.append({
        "type": "Feature",
        "id": demo_parcel["parcel_id"],
        "properties": demo_parcel,
        "geometry": demo_parcel["geometry"]
    })
    
    # 2. Generate 100 additional parcels around the villages
    random.seed(42)
    
    for village_name, district_name, base_lat, base_lng in VILLAGES:
        # Create a cluster of 10 parcels per village grid
        cols = 4
        rows = 3
        for i in range(10):
            parcel_counter += 1
            pid = f"P-{parcel_counter:05d}"
            sub_div = chr(65 + (parcel_counter % 5))
            survey_no = f"{random.randint(10, 350)}/{random.randint(1, 9)}{sub_div}"
            
            # Position offset
            row_idx = i // cols
            col_idx = i % cols
            
            c_lat = base_lat + (row_idx * 0.0035) + random.uniform(-0.0005, 0.0005)
            c_lng = base_lng + (col_idx * 0.0040) + random.uniform(-0.0005, 0.0005)
            
            w = random.uniform(0.0010, 0.0022)
            h = random.uniform(0.0010, 0.0020)
            
            poly = [
                [c_lng - w/2, c_lat - h/2],
                [c_lng + w/2 + random.uniform(-0.0002, 0.0002), c_lat - h/2],
                [c_lng + w/2, c_lat + h/2],
                [c_lng - w/2 - random.uniform(-0.0002, 0.0002), c_lat + h/2],
                [c_lng - w/2, c_lat - h/2],
            ]
            
            land_type = random.choice(LAND_TYPES)
            area = round(random.uniform(0.5, 12.5), 2)
            risk = random.choices(["LOW", "MEDIUM", "HIGH"], weights=[0.7, 0.2, 0.1])[0]
            status = random.choice(PARCEL_STATUSES)
            
            p_data = {
                "parcel_id": pid,
                "survey_number": survey_no,
                "village": village_name,
                "district": district_name,
                "area_acres": area,
                "land_type": land_type,
                "latitude": round(c_lat, 6),
                "longitude": round(c_lng, 6),
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [poly]
                },
                "status": status,
                "risk_level": risk,
                "owner_name": f"Landowner {parcel_counter} (Synthetic)",
                "last_survey_date": f"2024-0{random.randint(1,9)}-{random.randint(10,28)}",
                "latest_change": "No significant change" if risk == "LOW" else ("Land-use update" if risk == "MEDIUM" else "Unauthorized structure detected"),
                "is_demo_target": False
            }
            
            parcels.append(p_data)
            features.append({
                "type": "Feature",
                "id": pid,
                "properties": p_data,
                "geometry": p_data["geometry"]
            })

    # Write parcels JSON
    with open(os.path.join(DATA_DIR, "parcels.json"), "w") as f:
        json.dump(parcels, f, indent=2)
        
    geojson = {
        "type": "FeatureCollection",
        "name": "BhoomiAI_Synthetic_Parcels",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": features
    }
    
    with open(os.path.join(SAMPLE_DATA_DIR, "parcels.geojson"), "w") as f:
        json.dump(geojson, f, indent=2)
        
    print(f"Generated {len(parcels)} synthetic parcels in JSON & GeoJSON.")
    return parcels

def generate_demo_images():
    """Generates synthetic high-resolution before & after aerial drone images for demo parcel P-00102."""
    width, height = 800, 600
    
    # 1. BEFORE IMAGE (2025: Pure Lush Green Agricultural Field with crop rows and tree cluster)
    img_before = Image.new("RGB", (width, height), (76, 128, 48)) # Base grass green
    draw_b = ImageDraw.Draw(img_before)
    
    # Draw field crop pattern lines
    for y in range(0, height, 15):
        shade = random.randint(60, 95)
        draw_b.line([(0, y), (width, y)], fill=(shade, shade + 50, 40), width=6)
        
    # Draw dirt paths/roads on boundaries
    draw_b.rectangle([0, 0, width, 25], fill=(160, 130, 90)) # Top road
    draw_b.rectangle([0, height-25, width, height], fill=(160, 130, 90)) # Bottom road
    draw_b.line([(30, 0), (30, height)], fill=(150, 120, 80), width=18) # Left path
    
    # Add a small pond and tree grove
    draw_b.ellipse([600, 80, 750, 200], fill=(45, 90, 140)) # Water body
    for _ in range(35):
        tx = random.randint(100, 300)
        ty = random.randint(350, 500)
        tr = random.randint(15, 30)
        draw_b.ellipse([tx-tr, ty-tr, tx+tr, ty+tr], fill=(30, 90, 30))
        
    # Add stamp label
    draw_b.rectangle([20, 20, 260, 60], fill=(0, 0, 0, 180))
    draw_b.text((30, 30), "BEFORE: JAN 2025 (AGRICULTURAL)", fill=(255, 255, 255))
    
    before_path = os.path.join(IMAGERY_DIR, "demo_p00102_2025_before.png")
    img_before.save(before_path)
    
    # 2. AFTER IMAGE (2026: Land cleared, concrete foundation + large multi-room building constructed)
    img_after = img_before.copy()
    draw_a = ImageDraw.Draw(img_after)
    
    # Land clearing zone (grayish cleared soil)
    cx, cy = 450, 320
    draw_a.rectangle([cx - 160, cy - 140, cx + 180, cy + 150], fill=(180, 175, 160)) # Cleared dirt patch
    
    # Concrete base foundation & building structure
    bx1, by1, bx2, by2 = cx - 110, cy - 90, cx + 130, cy + 100
    draw_a.rectangle([bx1, by1, bx2, by2], fill=(210, 210, 215), outline=(60, 60, 60), width=4) # Roof/Structure 1
    
    # Roof details (Red/Blue tin roof & ventilation)
    draw_a.rectangle([bx1 + 10, by1 + 10, bx1 + 110, by2 - 10], fill=(180, 50, 40)) # Main building red roof
    draw_a.rectangle([bx1 + 120, by1 + 10, bx2 - 10, by2 - 10], fill=(60, 90, 140)) # Annex blue roof
    
    # Driveway / Concrete path to road
    draw_a.polygon([(cx - 20, by2), (cx + 30, by2), (cx + 50, height - 25), (cx - 40, height - 25)], fill=(140, 140, 145))
    
    # Construction materials / vehicles (yellow excavator box)
    draw_a.rectangle([cx - 150, cy + 80, cx - 120, cy + 120], fill=(240, 190, 20)) # Excavator
    draw_a.rectangle([cx - 140, cy + 40, cx - 120, cy + 70], fill=(100, 100, 100)) # Sand pile
    
    # Update stamp label
    draw_a.rectangle([20, 20, 280, 60], fill=(180, 0, 0, 200))
    draw_a.text((30, 30), "AFTER: FEB 2026 (NEW BUILDING DETECTED)", fill=(255, 255, 255))
    
    after_path = os.path.join(IMAGERY_DIR, "demo_p00102_2026_after.png")
    img_after.save(after_path)
    
    print(f"Generated synthetic aerial before/after demo imagery at:\n - {before_path}\n - {after_path}")

if __name__ == "__main__":
    generate_parcel_data()
    generate_demo_images()
