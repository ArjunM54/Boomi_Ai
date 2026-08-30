export interface ParcelGeometry {
  type: string;
  coordinates: number[][][];
}

export interface ParcelOwnership {
  owner_name: string;
  ownership_type: string;
  owner_count: number;
  ownership_status: string;
  ror_status: string;
  mutation_status: string;
}

export interface ParcelRegistration {
  reg_status: string;
  reg_number: string;
  reg_date: string;
  doc_type: string;
  previous_tx_status: string;
  latest_tx: string;
}

export interface ParcelEncumbrance {
  encumbrance_status: string;
  mortgage_status: string;
  active_loan: string;
  litigation_status: string;
  legal_restrictions: string;
}

export interface ParcelLandUseZoning {
  current_land_use: string;
  zoning_classification: string;
  development_zone: string;
  building_permission: string;
  master_plan_zone: string;
  construction_restrictions: string;
}

export interface ParcelPropertyTax {
  tax_status: string;
  last_payment_date: string;
  outstanding_amount: number;
  tax_assessment_number: string;
}

export interface ParcelSpatialData {
  perimeter_meters: number;
  boundary_coords_summary: string;
  nearby_roads: string;
  nearby_buildings: string;
  nearby_waterbodies: string;
}

export interface ParcelChangeDetection {
  prev_image_date: string;
  curr_image_date: string;
  detected_changes: string;
  building_detection: string;
  boundary_detection: string;
  confidence_score: number;
}

export interface ParcelAIRisk {
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  positive_factors: string[];
  risk_factors: string[];
  disclaimer: string;
}

export interface ParcelCrossDept {
  revenue_records: string;
  cadastral_map: string;
  registration_records: string;
  land_use: string;
  property_tax: string;
  spatial_data: string;
}

export interface ParcelTimelineEvent {
  year: string;
  title: string;
  description: string;
  status: string;
}

export interface ParcelDocument {
  doc_id: string;
  name: string;
  type: string;
  date: string;
  status: string;
}

export interface Parcel {
  parcel_id: string;
  ulpin?: string;
  survey_number: string;
  sub_division?: string;
  village: string;
  taluk?: string;
  district: string;
  ward?: string;
  state?: string;
  area_acres: number;
  area_hectares?: number;
  land_type: string;
  latitude: number;
  longitude: number;
  geometry: ParcelGeometry;
  status: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  risk_score?: number;
  last_updated?: string;
  owner_name?: string;
  last_survey_date?: string;
  latest_change?: string;
  is_demo_target?: boolean;
  
  // Detailed 21-Section Metadata
  ownership?: ParcelOwnership;
  registration?: ParcelRegistration;
  encumbrance?: ParcelEncumbrance;
  land_use_zoning?: ParcelLandUseZoning;
  property_tax?: ParcelPropertyTax;
  spatial_data?: ParcelSpatialData;
  change_detection?: ParcelChangeDetection;
  ai_risk?: ParcelAIRisk;
  cross_dept_verification?: ParcelCrossDept;
  timeline?: ParcelTimelineEvent[];
  documents?: ParcelDocument[];
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
