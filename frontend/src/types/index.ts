export interface ParcelGeometry {
  type: string;
  coordinates: number[][][];
}

export interface Parcel {
  parcel_id: string;
  survey_number: string;
  village: string;
  district: string;
  area_acres: number;
  land_type: string;
  latitude: number;
  longitude: number;
  geometry: ParcelGeometry;
  status: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  owner_name?: string;
  last_survey_date?: string;
  latest_change?: string;
  is_demo_target?: boolean;
}

export interface Alert {
  alert_id: string;
  parcel_id: string;
  survey_number: string;
  village: string;
  district: string;
  detection_type: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  risk_score: number;
  created_at: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RESOLVED' | string;
  description: string;
  evidence_image_before: string;
  evidence_image_after: string;
  evidence_image_diff?: string;
  ai_confidence: number;
  change_area_sqm: number;
  officer_notes?: string;
  verified_by?: string;
  verified_at?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

export interface AIAnalysisResult {
  analysis_id: string;
  status: string;
  change_detected: boolean;
  detection_type: string;
  change_area_percentage: number;
  confidence_score: number;
  matched_parcel_id?: string;
  matched_survey_number?: string;
  matched_village?: string;
  matched_latitude: number;
  matched_longitude: number;
  risk_score: number;
  risk_level: string;
  rationale: string[];
  boxes: BoundingBox[];
  overlay_image_url: string;
  alert_created?: boolean;
  alert_id?: string;
  disclaimer: string;
}

export interface CitizenReport {
  report_id: string;
  issue_type: string;
  survey_number: string;
  village: string;
  district: string;
  description: string;
  created_at: string;
  status: string;
  reporter_name: string;
  reporter_contact?: string;
  assigned_parcel_id?: string;
}

export interface DashboardStats {
  total_parcels: number;
  surveyed_parcels: number;
  pending_survey: number;
  active_alerts: number;
  high_priority_alerts: number;
  medium_priority_alerts: number;
  under_verification_alerts: number;
  resolved_alerts: number;
  land_type_distribution: Record<string, number>;
  alerts_by_severity: Record<string, number>;
  recent_alerts: Alert[];
  survey_completion_rate: number;
}

export type UserRole = 'ADMIN' | 'OFFICER' | 'CITIZEN';
