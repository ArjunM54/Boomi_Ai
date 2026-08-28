# BhoomiAI — AI-Powered GIS Intelligence for Smarter Land Governance

> **Smart India Hackathon 2026 Problem Statement SIH26014**

![BhoomiAI Banner](https://img.shields.io/badge/SIH26014-BhoomiAI-10B981?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20OpenCV%20%7C%20Leaflet-3B82F6?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon%20Prototype-D97706?style=for-the-badge)

## 1. Project Overview
**BhoomiAI** is an integrated GIS platform that combines land parcel intelligence, aerial satellite/drone imagery, and AI-powered computer vision change detection to help government authorities monitor land boundaries, identify potential unauthorized construction or encroachment, calculate transparent risk scores, and execute evidence-based officer verification workflows.

---

## 2. SIH26014 Problem Mapping
| Problem Statement Requirement | BhoomiAI Module Implementation |
| :--- | :--- |
| GIS-based Land Parcel Visualization | Interactive Leaflet GeoJSON layer with 100+ synthetic Indian land parcels |
| Satellite & Drone Imagery Analysis | OpenCV computer vision difference engine with bounding box detection |
| Land-Change & Encroachment Detection | Automated spatial Point-in-Polygon matching (`P-00102` / `102/3A`) |
| Transparent Risk Scoring | Multi-factor risk engine (Confidence + Change Magnitude + Land Use) |
| Government Officer Alert & Verification | Audit sign-off panel (`NEW` → `UNDER_REVIEW` → `VERIFIED` / `RESOLVED`) |
| Citizen Reporting Portal | Public land issue submission form & officer investigation list |
| Historical Land Monitoring Timeline | Transformation audit log tracking parcel history from 2024 to 2026 |

---

## 3. Key Features
- **Interactive GIS Map**: Vector GeoJSON parcel boundaries with color-coded risk indicators, land-type filters, and satellite layers.
- **AI Image Difference Studio**: OpenCV contour extraction detecting new building footprints with bounding box overlays.
- **Transparent Decision-Support Risk Engine**: 0-100 weighted risk score with audit rationale lines.
- **Officer Audit Workflow**: Incident verification modal with field notes and status sign-off.
- **Embedded AI Assistant**: Natural language query interface for officers on the dashboard.
- **Hackathon Presentation Demo Mode**: Step-by-step guided storyboard wizard for live presentation.

---

## 4. Architecture
```text
Drone / Satellite Image → AI Image Analysis → Change Detection → Building Detection
     → Geographic Location → Land Parcel Identification → Risk Assessment
     → Government Officer Alert → Officer Verification → Status Update
```

---

## 5. Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Leaflet / React-Leaflet, Recharts, Lucide Icons.
- **Backend**: Python 3.10, FastAPI, Pydantic, OpenCV (`opencv-python-headless`), NumPy, Shapely (Spatial GIS), Pillow.
- **Database**: SQLite (Local Fallback Cache) / PostgreSQL with PostGIS extension.

---

## 6. Installation & Quick Setup

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Quick Start (Local Development)

#### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend API will run at `http://127.0.0.1:8000`.

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 7. Docker Deployment
Run full stack via Docker Compose:
```bash
docker-compose up --build
```

---

## 8. Demo Target Parcel Story (`P-00102` / `102/3A`)
- **Survey Number**: 102/3A
- **Village**: Rampur, District: Jaipur
- **Land Type**: Agricultural (2.4 acres)
- **Scenario**: 2025 agricultural baseline image vs 2026 drone survey image where a new concrete building structure appears.
- **AI Action**: Detects building, matches parcel `P-00102`, calculates 88.5/100 HIGH Risk, generates Alert `ALT-00102`, and allows officer verification.

---

## 9. Limitations & Ethical Transparency
- **AI Decision Support Only**: BhoomiAI is a decision-support prototype. Final legal decisions remain strictly with authorized government officials.
- **Synthetic Demonstration Dataset**: Uses synthetic land records and demo imagery to protect real-world privacy.

---

## 10. License & Team
Built for **Smart India Hackathon 2026**.
