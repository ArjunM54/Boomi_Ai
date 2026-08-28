# BhoomiAI System Architecture (SIH26014)

**BhoomiAI** is an integrated AI & GIS land governance decision-support platform designed to automate land parcel visualization, aerial/satellite imagery analysis, computer vision change detection, transparent risk scoring, official officer verification, and citizen reporting.

## Architectural Layers

```text
+-------------------------------------------------------------------------+
|                          1. Presentation Layer                          |
|  - Next.js 14 App Router (React, TypeScript, Tailwind CSS)              |
|  - Leaflet Interactive Map Engine (GeoJSON Parcels Layer)              |
|  - Live Hackathon Storyboard Guided Demo Wizard                         |
+------------------------------------+------------------------------------+
                                     |
                          REST APIs / JSON / GeoJSON
                                     v
+-------------------------------------------------------------------------+
|                           2. Service Layer                              |
|  - FastAPI (Python 3.10)                                                |
|  - ParcelService & GIS Point-in-Polygon Engine (Shapely)                 |
|  - AI Analysis Service (OpenCV Computer Vision + YOLO Wrapper)          |
|  - Transparent Risk Engine (Weighted Score 0 - 100)                     |
|  - Alert & Verification Service                                         |
|  - AI Assistant Query Engine                                            |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        3. Data & Storage Layer                          |
|  - SQLite Local Cache Engine / PostGIS PostgreSQL Production Support    |
|  - GeoJSON Parcel Spatial Store                                         |
|  - Annotated Output Imagery Store                                       |
+-------------------------------------------------------------------------+
```

## Modular AI & GIS Pipeline

```text
Aerial Drone/Satellite Upload
          ↓
OpenCV Image Difference & Gaussian Blur
          ↓
Morphological Contours & Bounding Box Extraction
          ↓
Geographic Point Mapping
          ↓
Shapely Point-in-Polygon Parcel Matching (P-00102 / Survey 102/3A)
          ↓
Transparent Multi-Factor Risk Calculation
          ↓
Automatic Incident Alert Creation (ALT-00102)
          ↓
Government Officer Verification & Audit Sign-Off
```
