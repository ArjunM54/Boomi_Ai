-- BhoomiAI PostgreSQL / PostGIS Schema (SIH26014)
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS parcels (
    parcel_id VARCHAR(50) PRIMARY KEY,
    survey_number VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    area_acres NUMERIC(8,2) NOT NULL,
    land_type VARCHAR(50) NOT NULL,
    latitude NUMERIC(10,6) NOT NULL,
    longitude NUMERIC(10,6) NOT NULL,
    geometry GEOMETRY(Polygon, 4326) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Surveyed',
    risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    owner_name VARCHAR(255) DEFAULT 'Synthetic Land Record',
    last_survey_date DATE,
    latest_change TEXT,
    is_demo_target BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS parcels_geometry_idx ON parcels USING GIST (geometry);
CREATE INDEX IF NOT EXISTS parcels_survey_idx ON parcels (survey_number);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id VARCHAR(50) PRIMARY KEY,
    parcel_id VARCHAR(50) REFERENCES parcels(parcel_id),
    survey_number VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    detection_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    risk_score NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'NEW',
    description TEXT,
    evidence_image_before TEXT,
    evidence_image_after TEXT,
    evidence_image_diff TEXT,
    ai_confidence NUMERIC(4,3),
    change_area_sqm NUMERIC(10,2),
    officer_notes TEXT,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS citizen_reports (
    report_id VARCHAR(50) PRIMARY KEY,
    issue_type VARCHAR(100) NOT NULL,
    survey_number VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'NEW_REPORT',
    reporter_name VARCHAR(255),
    reporter_contact VARCHAR(100),
    assigned_parcel_id VARCHAR(50) REFERENCES parcels(parcel_id)
);
