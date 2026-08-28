# Implementation Plan - BhoomiAI (SIH26014)

**BhoomiAI** is an AI-powered GIS Intelligence platform built for Smart India Hackathon 2026 (Problem Statement SIH26014) for smarter land governance. It integrates land parcel visualization, aerial/satellite imagery analysis, AI change & encroachment detection, transparent risk scoring, government officer verification workflows, citizen reporting, and historical timeline tracking.

## Architecture Overview

```text
               +-------------------------------------------------------+
               |                  BhoomiAI Frontend                    |
               |         (Next.js 14 / React / Tailwind / Leaflet)     |
               +---------------------------+---------------------------+
                                           |
                         REST APIs / JSON / GeoJSON
                                           v
               +-------------------------------------------------------+
               |                  BhoomiAI Backend                     |
               |                 (FastAPI / Python 3.11)               |
               +-------------+---------------------+-------------------+
                             |                     |
                             v                     v
              +----------------------+  +--------------------+
              |   AI Analysis Module |  | GIS & Risk Engine  |
              | (OpenCV / Detection) |  | (Point-in-Polygon) |
              +----------------------+  +--------------------+
                             |                     |
                             +----------+----------+
                                        |
                                        v
                       +-----------------------------------+
                       |    Database Layer (PostGIS /      |
                       | SQLite Fallback + GeoJSON Store)  |
                       +-----------------------------------+
```

---

## User Review Required

> [!NOTE]
> - **Demo & Prototype Transparency**: All AI confidence values, change percentages, and risk scores are clearly labeled as **"AI Decision-Support Prototype"** in accordance with SIH ethical guidelines. No real government database connection is claimed.
> - **Synthetic Dataset**: A rich dataset of 100+ Indian land parcels (with realistic survey numbers like `102/3A`, `145/2`, village names like `Rampur`, `Kishangarh`) and high-res demo aerial images (agricultural before vs building after) will be generated.
> - **SQLite / PostGIS Dual Compatibility**: The backend will run out of the box with SQLite and pure Python spatial geometry (Shapely/PyProj logic) so zero external DB setup is required for instant demo running, while also providing `PostGIS` `schema.sql` and `docker-compose.yml`.

---

## Open Questions

None. The prompt details the exact core demo story, stack, navigation structure, APIs, and workflows required.

---

## Proposed Changes

### 1. Project Infrastructure & Monorepo Setup
- [NEW] [package.json](file:///d:/SIH/BoomiAi/package.json) / Next.js setup at `frontend/`
- [NEW] [docker-compose.yml](file:///d:/SIH/BoomiAi/docker-compose.yml)
- [NEW] [.env.example](file:///d:/SIH/BoomiAi/.env.example)
- [NEW] [README.md](file:///d:/SIH/BoomiAi/README.md)
- [NEW] [docs/architecture.md](file:///d:/SIH/BoomiAi/docs/architecture.md)
- [NEW] [docs/api.md](file:///d:/SIH/BoomiAi/docs/api.md)
- [NEW] [docs/demo.md](file:///d:/SIH/BoomiAi/docs/demo.md)

---

### 2. Backend Services & AI Detection Pipeline (`backend/`)
- [NEW] [`backend/app/main.py`](file:///d:/SIH/BoomiAi/backend/app/main.py): FastAPI application entrypoint with CORS, route mounting, and auto-seeding.
- [NEW] [`backend/app/services/ai_service.py`](file:///d:/SIH/BoomiAi/backend/app/services/ai_service.py): OpenCV image difference analysis, contour detection, bounding box generation, building change detection, and modular plug-and-play YOLO model interface.
- [NEW] [`backend/app/services/gis_service.py`](file:///d:/SIH/BoomiAi/backend/app/services/gis_service.py): Point-in-polygon spatial lookup for matching coordinates to synthetic parcel GeoJSON boundaries.
- [NEW] [`backend/app/services/risk_engine.py`](file:///d:/SIH/BoomiAi/backend/app/services/risk_engine.py): Weighted risk score calculation (Detection confidence, change magnitude, land-use type like Agricultural vs Government).
- [NEW] [`backend/app/services/parcel_service.py`](file:///d:/SIH/BoomiAi/backend/app/services/parcel_service.py) & `alert_service.py`: CRUD operations & state management for parcels, alerts, citizen reports, and timelines.
- [NEW] [`backend/app/services/assistant_service.py`](file:///d:/SIH/BoomiAi/backend/app/services/assistant_service.py): Structured natural language query responder for high-risk parcels, alerts summary, and construction changes.
- [NEW] [`backend/app/api/`](file:///d:/SIH/BoomiAi/backend/app/api/): Endpoints for `/api/parcels`, `/api/alerts`, `/api/ai/analyze`, `/api/reports`, `/api/dashboard/stats`, `/api/map/geojson`, `/api/assistant`.
- [NEW] [`backend/app/utils/seed.py`](file:///d:/SIH/BoomiAi/backend/app/utils/seed.py): Synthetic dataset generator producing 100+ GeoJSON parcels & realistic before/after imagery for demo parcel `P-00102` / `102/3A`.

---

### 3. Frontend Web Application (`frontend/`)
- [NEW] [`frontend/src/app/layout.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/layout.tsx) & [`globals.css`](file:///d:/SIH/BoomiAi/frontend/src/app/globals.css): Modern dark/light government tech design system, Inter font, custom CSS utilities, leaflet styles.
- [NEW] [`frontend/src/components/Navbar.tsx`](file:///d:/SIH/BoomiAi/frontend/src/components/Navbar.tsx) & [`Sidebar.tsx`](file:///d:/SIH/BoomiAi/frontend/src/components/Sidebar.tsx): Responsive top navigation, role selector (Admin, Officer, Citizen), Demo Mode banner & Hackathon Presentation Wizard launcher.
- [NEW] [`frontend/src/app/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/page.tsx): Hero section, tagline, core capabilities, visual flowchart, demo login modal, CTA buttons.
- [NEW] [`frontend/src/app/dashboard/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/dashboard/page.tsx): Stats cards (Total Parcels 12,450, Surveyed, Active Alerts 124, High/Med/Low priority), Recharts graphs (Land Type, Alerts by Severity, Historical Change Trend), Recent Alerts table, and embedded AI Assistant drawer.
- [NEW] [`frontend/src/app/map/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/map/page.tsx): Dynamic Leaflet map with GeoJSON polygons, accessibility status badges/icons, custom color coding, search & filter controls, layer toggles, interactive parcel inspection side panel.
- [NEW] [`frontend/src/app/parcels/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/parcels/page.tsx): Parcel Explorer grid & table with search, village/land type/status filters, pagination, export options.
- [NEW] [`frontend/src/app/parcels/[id]/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/parcels/[id]/page.tsx): Parcel detail view with metadata grid, geometry map, before/after slider comparison, change timeline, officer action panel (Verify, Reject, Assign Inspection, Resolve).
- [NEW] [`frontend/src/app/ai-analysis/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/ai-analysis/page.tsx): Interactive AI Studio with dual image upload / demo preset selector, visual change difference overlay canvas, bounding boxes, live execution triggering `POST /api/ai/analyze`, auto alert creation.
- [NEW] [`frontend/src/app/alerts/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/alerts/page.tsx): Incident management list, severity filters, evidence inspector, verification workflow modal.
- [NEW] [`frontend/src/app/reports/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/reports/page.tsx): Citizen report submission form + Officer review list.
- [NEW] [`frontend/src/app/timeline/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/timeline/page.tsx): Visual timeline of historical parcel transformations.
- [NEW] [`frontend/src/app/settings/page.tsx`](file:///d:/SIH/BoomiAi/frontend/src/app/settings/page.tsx): Demo Mode toggles, AI sensitivity parameters, map layer providers, role switcher.
- [NEW] [`frontend/src/components/HackathonDemoWizard.tsx`](file:///d:/SIH/BoomiAi/frontend/src/components/HackathonDemoWizard.tsx): Interactive guided tour walking through the step-by-step hackathon demo flow (1. Landing -> 2. Dashboard -> 3. GIS Map -> 4. Demo Parcel -> 5. AI Analysis -> 6. Risk Scoring & Alert Creation -> 7. Officer Verification -> 8. Updated Timeline).

---

## Verification Plan

### Automated Tests & Checks
1. Backend: Python environment validation, endpoint test suite via `pytest` or Python HTTP requests testing `/api/parcels`, `/api/ai/analyze`, `/api/alerts`, `/api/dashboard/stats`, `/api/map/geojson`.
2. Frontend: Next.js build verification (`npm run build`), TypeScript type checking (`tsc --noEmit`), and lint checking.

### Manual Verification Workflow
1. Launch full backend & frontend local server.
2. Open Browser & trigger Hackathon Presentation Demo Mode.
3. Test uploading old vs new images in `/ai-analysis` -> verify contour detection & parcel matching (`P-00102`).
4. Check auto-generated alert appearing on `/alerts` and `/dashboard`.
5. Perform Officer Verification on parcel `102/3A` -> verify status transition from `NEW` to `VERIFIED` in timeline and parcel detail view.
