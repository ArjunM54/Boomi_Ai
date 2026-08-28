# BhoomiAI REST API Documentation (SIH26014)

Base URL: `http://127.0.0.1:8000/api`

## Endpoints Summary

### 1. Land Parcels
- `GET /api/parcels` — List all parcels with optional filtering (`village`, `land_type`, `risk`, `search`).
- `GET /api/parcels/{id}` — Get detailed metadata, timeline, alerts, and aerial imagery for a specific parcel.
- `GET /api/map/geojson` — Returns full GeoJSON FeatureCollection for Leaflet map rendering.

### 2. Dashboard & Analytics
- `GET /api/dashboard/stats` — Executive metrics (Total Parcels 12,450, Surveyed, Pending, Active Alerts 124, priority breakdown, and recent alerts).

### 3. AI Aerial Analysis Pipeline
- `POST /api/ai/analyze` — Upload before & after imagery. Runs OpenCV contour diffing, matches target parcel `P-00102`, calculates transparent risk score, returns bounding box overlay URL, and generates incident alert.

### 4. Alerts & Verification
- `GET /api/alerts` — Fetch alerts filtered by severity (`HIGH`, `MEDIUM`, `LOW`) or status (`NEW`, `UNDER_REVIEW`, `VERIFIED`, `RESOLVED`).
- `PATCH /api/alerts/{id}/status` — Government officer sign-off endpoint to update alert status with notes and officer name.

### 5. Citizen Reports & AI Assistant
- `GET /api/reports` / `POST /api/reports` — Submit & inspect citizen land issue reports.
- `POST /api/assistant` — Query AI assistant with natural language prompts.
