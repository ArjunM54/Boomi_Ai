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

# 10 Major Tamil Nadu Districts & Towns
TN_LOCATIONS = [
    ("Coimbatore", "Coimbatore South", "Perur", "TN-CBE", 11.0168, 76.9558),
    ("Chennai", "Guindy", "Velachery", "TN-CHE", 13.0827, 80.2707),
    ("Madurai", "Madurai North", "Tallakulam", "TN-MDU", 9.9252, 78.1198),
    ("Salem", "Salem South", "Suramangalam", "TN-SLM", 11.6643, 78.1460),
    ("Tiruchirappalli", "Srirangam", "Thiruverumbur", "TN-TPJ", 10.7905, 78.7047),
    ("Tirunelveli", "Palayamkottai", "Melapalayam", "TN-TNV", 8.7139, 77.7567),
    ("Erode", "Erode Urban", "Perundurai", "TN-ERD", 11.3410, 77.7172),
    ("Vellore", "Vellore Fort", "Katpadi", "TN-VEL", 12.9165, 79.1325),
    ("Thanjavur", "Thanjavur Urban", "Punnainallur", "TN-TNJ", 10.7870, 79.1378),
    ("Kanchipuram", "Sriperumbudur", "Sunguvarchatram", "TN-KPM", 12.8342, 79.7036),
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

FIRST_NAMES = ["Ramasamy", "Karthik", "Murugan", "Senthil", "Sundaram", "Anand", "Meenakshi", "Priya", "Kavitha", "Ganesh", "Balaji", "Subramanian", "Venkatesh", "Vijay", "Selvam"]
LAST_NAMES = ["Kumar", "Nathan", "Rajan", "Pillai", "Chettiar", "Gounder", "Iyer", "Naidu", "Muthu", "Kannan", "Velasamy"]

def generate_parcel_data():
    parcels = []
    features = []
    
    random.seed(42)
    parcel_index = 1
    
    # 1. Primary Demo Target Parcel P-00102 / TN-CBE-123456789 (Survey 124/2A)
    demo_center_lat = 11.0168
    demo_center_lng = 76.9558
    
    demo_poly_coords = [
        [demo_center_lng - 0.0015, demo_center_lat - 0.0010],
        [demo_center_lng + 0.0012, demo_center_lat - 0.0012],
        [demo_center_lng + 0.0018, demo_center_lat + 0.0011],
        [demo_center_lng - 0.0010, demo_center_lat + 0.0014],
        [demo_center_lng - 0.0015, demo_center_lat - 0.0010],
    ]
    
    demo_parcel = {
        "parcel_id": "P-00102",
        "ulpin": "TN-CBE-123456789",
        "survey_number": "124/2A",
        "sub_division": "2A",
        "district": "Coimbatore",
        "taluk": "Coimbatore South",
        "village": "Perur",
        "ward": "Ward 12",
        "state": "Tamil Nadu",
        "area_acres": 2.45,
        "area_hectares": 0.99,
        "land_type": "Residential",
        "latitude": demo_center_lat,
        "longitude": demo_center_lng,
        "geometry": {
            "type": "Polygon",
            "coordinates": [demo_poly_coords]
        },
        "status": "Under Review",
        "risk_level": "HIGH",
        "risk_score": 88,
        "last_updated": "2026-08-30",
        
        "ownership": {
            "owner_name": "R. Selvaraj & Family (Demo Dataset)",
            "ownership_type": "Joint Pattadar",
            "owner_count": 2,
            "ownership_status": "Verified Patta",
            "ror_status": "Patta No. 4412 (Active)",
            "mutation_status": "Mutation Approved 2024"
        },
        "registration": {
            "reg_status": "Registered",
            "reg_number": "REG-2024-CBE-8821",
            "reg_date": "2024-03-12",
            "doc_type": "Sale Deed",
            "previous_tx_status": "Clean Chain of Title",
            "latest_tx": "Purchased from K. Sundaram"
        },
        "encumbrance": {
            "encumbrance_status": "None Detected",
            "mortgage_status": "None",
            "active_loan": "No Active Bank Charge",
            "litigation_status": "No Active Case",
            "legal_restrictions": "None"
        },
        "land_use_zoning": {
            "current_land_use": "Residential (Constructed)",
            "zoning_classification": "Mixed Residential Zone",
            "development_zone": "DTCP Approved Master Plan",
            "building_permission": "Eligible",
            "master_plan_zone": "Coimbatore Metropolitan Area 2026",
            "construction_restrictions": "Standard Floor Space Ratio 1.5"
        },
        "property_tax": {
            "tax_status": "Paid",
            "last_payment_date": "2026-07-15",
            "outstanding_amount": 0,
            "tax_assessment_number": "TAX-TN-CBE-90214"
        },
        "spatial_data": {
            "perimeter_meters": 480,
            "boundary_coords_summary": "4 Boundary Control Points Verified",
            "nearby_roads": "Perur Main Road (150m)",
            "nearby_buildings": "4 Commercial Structures within 200m",
            "nearby_waterbodies": "Noyyal River Basin (850m)"
        },
        "change_detection": {
            "prev_image_date": "2025-01-15",
            "curr_image_date": "2026-08-20",
            "detected_changes": "New Unpermitted Building Footprint Detected",
            "building_detection": "1 New Structure (240 sq.m)",
            "boundary_detection": "Minor encroachment on north border",
            "confidence_score": 92
        },
        "ai_risk": {
            "risk_score": 88,
            "risk_level": "HIGH",
            "positive_factors": [
                "Ownership & Patta records match revenue database",
                "Registration deed verified",
                "No bank mortgage or litigation detected",
                "Property tax paid up to date"
            ],
            "risk_factors": [
                "New unauthorized building detected in satellite imagery",
                "Land-use change from agricultural to commercial building",
                "Potential 1.2m boundary shift on north side"
            ],
            "disclaimer": "AI-assisted preliminary assessment — not a legal certification."
        },
        "cross_dept_verification": {
            "revenue_records": "Matched",
            "cadastral_map": "Matched",
            "registration_records": "Matched",
            "land_use": "Mismatch Detected",
            "property_tax": "Matched",
            "spatial_data": "Review Required"
        },
        "timeline": [
            {"year": "2021", "title": "Original Patta Issued", "description": "Patta No 4412 registered under Tamil Nadu e-Services.", "status": "Verified"},
            {"year": "2023", "title": "Ownership Mutation", "description": "Joint ownership updated following family settlement.", "status": "Verified"},
            {"year": "2024", "title": "Sale Deed Registered", "description": "Registered at Sub-Registrar Office Coimbatore South.", "status": "Verified"},
            {"year": "2025", "title": "Land-Use Baseline Survey", "description": "Aerial drone imagery baseline recorded as agricultural.", "status": "Surveyed"},
            {"year": "2026", "title": "Drone Survey Change Detection", "description": "BhoomiAI detected new building construction structure.", "status": "Under Review"}
        ],
        "documents": [
            {"doc_id": "DOC-01", "name": "Patta / Chitta Extract", "type": "Revenue Document", "date": "2024-03-15", "status": "Verified"},
            {"doc_id": "DOC-02", "name": "Cadastral Map (FMB Extract)", "type": "GIS Map", "date": "2024-03-15", "status": "Verified"},
            {"doc_id": "DOC-03", "name": "Registered Sale Deed", "type": "Legal Document", "date": "2024-03-12", "status": "Verified"},
            {"doc_id": "DOC-04", "name": "Property Tax Receipt 2026", "type": "Tax Receipt", "date": "2026-07-15", "status": "Verified"},
            {"doc_id": "DOC-05", "name": "AI Change Detection Imagery", "type": "Geospatial Analysis", "date": "2026-08-20", "status": "Pending Verification"}
        ],
        "is_demo_target": True
    }
    parcels.append(demo_parcel)
    features.append({
        "type": "Feature",
        "id": demo_parcel["parcel_id"],
        "properties": demo_parcel,
        "geometry": demo_parcel["geometry"]
    })

    # 2. Generate 999 Additional Parcels across Tamil Nadu (Total 1,000 Parcels)
    parcels_per_loc = 100
    for dist_idx, (district, taluk, village, code_prefix, base_lat, base_lng) in enumerate(TN_LOCATIONS):
        cols = 10
        rows = 10
        count_for_this_dist = 100 if dist_idx < 9 else 99 # Total 1 + 900 + 99 = 1000
        
        for i in range(count_for_this_dist):
            parcel_index += 1
            pid = f"P-{parcel_index:05d}"
            ulpin = f"{code_prefix}-{parcel_index:09d}"
            sub_div = f"{random.randint(1, 9)}{chr(65 + (parcel_index % 6))}"
            survey_no = f"{random.randint(10, 450)}/{sub_div}"
            
            row_idx = i // cols
            col_idx = i % cols
            
            c_lat = base_lat + (row_idx * 0.0028) + random.uniform(-0.0004, 0.0004)
            c_lng = base_lng + (col_idx * 0.0032) + random.uniform(-0.0004, 0.0004)
            
            w = random.uniform(0.0009, 0.0020)
            h = random.uniform(0.0009, 0.0018)
            
            poly = [
                [c_lng - w/2, c_lat - h/2],
                [c_lng + w/2 + random.uniform(-0.0001, 0.0001), c_lat - h/2],
                [c_lng + w/2, c_lat + h/2],
                [c_lng - w/2 - random.uniform(-0.0001, 0.0001), c_lat + h/2],
                [c_lng - w/2, c_lat - h/2],
            ]
            
            land_type = random.choice(LAND_TYPES)
            area_acres = round(random.uniform(0.5, 8.5), 2)
            area_hectares = round(area_acres * 0.404686, 2)
            risk = random.choices(["LOW", "MEDIUM", "HIGH"], weights=[0.75, 0.18, 0.07])[0]
            risk_score = random.randint(10, 35) if risk == "LOW" else (random.randint(36, 65) if risk == "MEDIUM" else random.randint(66, 95))
            status = random.choice(PARCEL_STATUSES)
            owner_name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)} (Demo Dataset)"
            
            p_data = {
                "parcel_id": pid,
                "ulpin": ulpin,
                "survey_number": survey_no,
                "sub_division": sub_div,
                "district": district,
                "taluk": taluk,
                "village": village,
                "ward": f"Ward {random.randint(1, 25)}",
                "state": "Tamil Nadu",
                "area_acres": area_acres,
                "area_hectares": area_hectares,
                "land_type": land_type,
                "latitude": round(c_lat, 6),
                "longitude": round(c_lng, 6),
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [poly]
                },
                "status": status,
                "risk_level": risk,
                "risk_score": risk_score,
                "last_updated": f"2026-08-{random.randint(10, 30):02d}",
                
                "ownership": {
                    "owner_name": owner_name,
                    "ownership_type": random.choice(["Single Owner", "Joint Pattadar", "Corporate Land", "Government Trust"]),
                    "owner_count": random.randint(1, 4),
                    "ownership_status": "Verified Patta" if risk != "HIGH" else "Pending Verification",
                    "ror_status": f"Patta No. {random.randint(1000, 9999)} (Active)",
                    "mutation_status": "Mutation Complete" if risk == "LOW" else "Under Process"
                },
                "registration": {
                    "reg_status": "Registered" if risk != "HIGH" else "Under Audit",
                    "reg_number": f"REG-2024-{code_prefix[3:]}-{random.randint(1000, 9999)}",
                    "reg_date": f"2024-0{random.randint(1, 9)}-{random.randint(10, 28)}",
                    "doc_type": random.choice(["Sale Deed", "Settlement Deed", "Gift Deed", "Partition Deed"]),
                    "previous_tx_status": "Clean Title Chain",
                    "latest_tx": "Mutation Recorded in Tamil Nadu Revenue Portal"
                },
                "encumbrance": {
                    "encumbrance_status": "None Detected" if risk == "LOW" else ("Attention Required" if risk == "HIGH" else "Minor Note"),
                    "mortgage_status": "None" if risk != "HIGH" else "Bank Charge Registered",
                    "active_loan": "No Active Loan" if risk != "HIGH" else "Active Agricultural Loan",
                    "litigation_status": "No Active Case" if risk == "LOW" else ("Court Inquiry Pending" if risk == "HIGH" else "No Case"),
                    "legal_restrictions": "None"
                },
                "land_use_zoning": {
                    "current_land_use": land_type,
                    "zoning_classification": f"{land_type} Zone",
                    "development_zone": "DTCP Approved Zone",
                    "building_permission": "Eligible" if land_type in ["Residential", "Commercial"] else "Restricted",
                    "master_plan_zone": f"{district} Urban Master Plan 2026",
                    "construction_restrictions": "Standard FSR 1.5"
                },
                "property_tax": {
                    "tax_status": "Paid" if risk != "HIGH" else "Outstanding",
                    "last_payment_date": f"2026-0{random.randint(5, 7)}-{random.randint(10, 28)}",
                    "outstanding_amount": 0 if risk != "HIGH" else random.randint(1500, 8500),
                    "tax_assessment_number": f"TAX-{code_prefix}-{random.randint(10000, 99999)}"
                },
                "spatial_data": {
                    "perimeter_meters": round(random.uniform(250, 850)),
                    "boundary_coords_summary": "4 Boundary Points Geo-referenced",
                    "nearby_roads": f"State Highway {random.randint(10, 99)} ({random.randint(100, 800)}m)",
                    "nearby_buildings": f"{random.randint(1, 8)} structures detected nearby",
                    "nearby_waterbodies": "Local Irrigation Channel (450m)"
                },
                "change_detection": {
                    "prev_image_date": "2025-01-10",
                    "curr_image_date": "2026-08-15",
                    "detected_changes": "No Major Structural Change" if risk == "LOW" else ("Minor Land-Use Modification" if risk == "MEDIUM" else "New Building Footprint Detected"),
                    "building_detection": "No New Building" if risk == "LOW" else ("1 Structure Detected" if risk == "HIGH" else "Shed Detected"),
                    "boundary_detection": "Boundary Stable",
                    "confidence_score": random.randint(85, 96)
                },
                "ai_risk": {
                    "risk_score": risk_score,
                    "risk_level": risk,
                    "positive_factors": [
                        "Patta records verified under Tamil Nadu Land Records Portal",
                        "Registration deed match confirmed",
                        "No litigation encumbrance found",
                        "Property tax paid"
                    ],
                    "risk_factors": [] if risk == "LOW" else ["Potential land-use mismatch detected", "Satellite imagery flagged structure change"],
                    "disclaimer": "AI-assisted preliminary assessment — not a legal certification."
                },
                "cross_dept_verification": {
                    "revenue_records": "Matched",
                    "cadastral_map": "Matched",
                    "registration_records": "Matched",
                    "land_use": "Matched" if risk == "LOW" else "Review Required",
                    "property_tax": "Matched" if risk != "HIGH" else "Unpaid Balance",
                    "spatial_data": "Matched" if risk == "LOW" else "Review Required"
                },
                "timeline": [
                    {"year": "2021", "title": "Land Record Digitized", "description": "Record entered into e-Revenue database.", "status": "Verified"},
                    {"year": "2023", "title": "Patta Update", "description": "Ownership updated under Patta Chitta portal.", "status": "Verified"},
                    {"year": "2025", "title": "Satellite Baseline Recorded", "description": "GIS spatial boundary mapped.", "status": "Verified"},
                    {"year": "2026", "title": "BhoomiAI Routine Scan", "description": "Automated change detection scan completed.", "status": "Verified"}
                ],
                "documents": [
                    {"doc_id": "DOC-01", "name": "Patta / Chitta Extract", "type": "Revenue Document", "date": "2024-05-10", "status": "Verified"},
                    {"doc_id": "DOC-02", "name": "FMB Cadastral Sketch", "type": "GIS Map", "date": "2024-05-10", "status": "Verified"},
                    {"doc_id": "DOC-03", "name": "Property Tax Receipt", "type": "Tax Receipt", "date": "2026-06-20", "status": "Verified"}
                ],
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
        "name": "BhoomiAI_TamilNadu_1000_Parcels",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": features
    }
    
    with open(os.path.join(SAMPLE_DATA_DIR, "parcels.geojson"), "w") as f:
        json.dump(geojson, f, indent=2)
        
    print(f"Successfully generated {len(parcels)} Tamil Nadu parcels in JSON & GeoJSON format.")
    return parcels

def generate_demo_images():
    """Generates synthetic high-resolution before & after aerial drone images for Tamil Nadu demo parcel P-00102."""
    width, height = 800, 600
    
    img_before = Image.new("RGB", (width, height), (76, 128, 48))
    draw_b = ImageDraw.Draw(img_before)
    
    for y in range(0, height, 15):
        shade = random.randint(60, 95)
        draw_b.line([(0, y), (width, y)], fill=(shade, shade + 50, 40), width=6)
        
    draw_b.rectangle([0, 0, width, 25], fill=(160, 130, 90))
    draw_b.rectangle([0, height-25, width, height], fill=(160, 130, 90))
    draw_b.line([(30, 0), (30, height)], fill=(150, 120, 80), width=18)
    
    draw_b.ellipse([600, 80, 750, 200], fill=(45, 90, 140))
    for _ in range(35):
        tx = random.randint(100, 300)
        ty = random.randint(350, 500)
        tr = random.randint(15, 30)
        draw_b.ellipse([tx-tr, ty-tr, tx+tr, ty+tr], fill=(30, 90, 30))
        
    draw_b.rectangle([20, 20, 340, 60], fill=(0, 0, 0, 180))
    draw_b.text((30, 30), "BEFORE: JAN 2025 (COIMBATORE AGRICULTURAL)", fill=(255, 255, 255))
    
    before_path = os.path.join(IMAGERY_DIR, "demo_p00102_2025_before.png")
    img_before.save(before_path)
    
    img_after = img_before.copy()
    draw_a = ImageDraw.Draw(img_after)
    
    cx, cy = 450, 320
    draw_a.rectangle([cx - 160, cy - 140, cx + 180, cy + 150], fill=(180, 175, 160))
    
    bx1, by1, bx2, by2 = cx - 110, cy - 90, cx + 130, cy + 100
    draw_a.rectangle([bx1, by1, bx2, by2], fill=(210, 210, 215), outline=(60, 60, 60), width=4)
    draw_a.rectangle([bx1 + 10, by1 + 10, bx1 + 110, by2 - 10], fill=(180, 50, 40))
    draw_a.rectangle([bx1 + 120, by1 + 10, bx2 - 10, by2 - 10], fill=(60, 90, 140))
    
    draw_a.polygon([(cx - 20, by2), (cx + 30, by2), (cx + 50, height - 25), (cx - 40, height - 25)], fill=(140, 140, 145))
    draw_a.rectangle([cx - 150, cy + 80, cx - 120, cy + 120], fill=(240, 190, 20))
    draw_a.rectangle([cx - 140, cy + 40, cx - 120, cy + 70], fill=(100, 100, 100))
    
    draw_a.rectangle([20, 20, 360, 60], fill=(180, 0, 0, 200))
    draw_a.text((30, 30), "AFTER: FEB 2026 (NEW BUILDING FOOTPRINT DETECTED)", fill=(255, 255, 255))
    
    after_path = os.path.join(IMAGERY_DIR, "demo_p00102_2026_after.png")
    img_after.save(after_path)
    
    print(f"Generated synthetic aerial before/after demo imagery at:\n - {before_path}\n - {after_path}")

if __name__ == "__main__":
    generate_parcel_data()
    generate_demo_images()
