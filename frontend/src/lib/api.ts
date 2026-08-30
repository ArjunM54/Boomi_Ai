import { Parcel, Alert, CitizenReport, DashboardStats, AIAnalysisResult } from '../types';

const API_BASE = '/api';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export async function fetchParcels(params?: { village?: string; land_type?: string; risk?: string; search?: string }): Promise<Parcel[]> {
  try {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/parcels?${query}`);
    if (!res.ok) throw new Error('Backend API not reachable');
    return await res.json();
  } catch (err) {
    try {
      // Fallback to static public 1000 Tamil Nadu parcels dataset
      const resStatic = await fetch(`${BASE_PATH}/parcels.json`);
      if (resStatic.ok) {
        return await resStatic.json();
      }
    } catch (e) {
      console.warn('Failed to load static parcels dataset:', e);
    }
    return getFallbackParcels();
  }
}

export async function fetchParcelDetail(parcelId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/parcels/${parcelId}`);
    if (!res.ok) throw new Error('Failed to fetch parcel detail');
    return await res.json();
  } catch (err) {
    let parcels = getFallbackParcels();
    try {
      const resStatic = await fetch('/parcels.json');
      if (resStatic.ok) parcels = await resStatic.json();
    } catch (e) {}
    
    const found = parcels.find(p => p.parcel_id === parcelId || p.survey_number === parcelId || p.ulpin === parcelId) || parcels[0];
    return {
      parcel: found,
      alerts: [getFallbackAlerts()[0]],
      timeline: [
        { year: '2024', status: 'Agricultural / Land Record', description: 'Verified Tamil Nadu land record.' },
        { year: '2025', status: 'No Change', description: 'Regular seasonal baseline imagery observed.' },
        { year: '2026', status: 'Potential Spatial Discrepancy', description: 'AI aerial difference flagged structure.' },
        { year: '2026', status: `Status: ${found.status}`, description: 'Officer verification workflow active.' },
      ],
      imagery: {
        before: '/static/imagery/demo_p00102_2025_before.png',
        after: '/static/imagery/demo_p00102_2026_after.png'
      }
    };
  }
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (err) {
    return {
      total_parcels: 1000,
      surveyed_parcels: 780,
      pending_survey: 220,
      active_alerts: 48,
      high_priority_alerts: 12,
      medium_priority_alerts: 24,
      under_verification_alerts: 12,
      resolved_alerts: 16,
      land_type_distribution: {
        'Agricultural': 420,
        'Residential': 250,
        'Government': 180,
        'Commercial': 80,
        'Forest / Green Belt': 50,
        'Water Body': 20
      },
      alerts_by_severity: { 'HIGH': 12, 'MEDIUM': 24, 'LOW': 12 },
      recent_alerts: getFallbackAlerts(),
      survey_completion_rate: 78.0
    };
  }
}

export async function fetchAlerts(params?: { severity?: string; status?: string }): Promise<Alert[]> {
  try {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/alerts?${query}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return await res.json();
  } catch (err) {
    return getFallbackAlerts();
  }
}

export async function updateAlertStatus(alertId: string, status: string, notes?: string, officerName?: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes, officer_name: officerName })
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return await res.json();
  } catch (err) {
    return { message: 'Updated locally (fallback)', alert: { alert_id: alertId, status } };
  }
}

export async function runAIAnalysis(formData: FormData): Promise<AIAnalysisResult> {
  try {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to analyze');
    return await res.json();
  } catch (err) {
    return {
      analysis_id: 'ANL-DEMO102',
      status: 'COMPLETED',
      change_detected: true,
      detection_type: 'Unauthorized Construction',
      change_area_percentage: 14.5,
      confidence_score: 0.94,
      matched_parcel_id: 'P-00102',
      matched_survey_number: '124/2A',
      matched_village: 'Perur',
      matched_latitude: 11.0168,
      matched_longitude: 76.9558,
      risk_score: 88.0,
      risk_level: 'HIGH',
      rationale: [
        'AI Detection Confidence (94.0%): +37.6 pts',
        'Change Magnitude (14.5% parcel area): +17.4 pts',
        'Land Type (Residential) & Violation Category Multiplier: +33.0 pts',
        'Final Risk Classification: 88.0/100 (HIGH)'
      ],
      boxes: [{ x: 340, y: 230, w: 240, h: 190, label: 'Building / Construction', confidence: 0.94 }],
      overlay_image_url: '/static/imagery/demo_p00102_2026_after.png',
      alert_created: true,
      alert_id: 'ALT-00102',
      disclaimer: 'Decision-Support Prototype Model — Official Verification Required.'
    };
  }
}

export async function submitCitizenReport(data: any): Promise<CitizenReport> {
  try {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return await res.json();
  } catch (err) {
    return {
      report_id: 'RPT-000123',
      issue_type: data.issue_type || 'Encroachment',
      survey_number: data.survey_number || '124/2A',
      village: data.village || 'Perur',
      district: 'Coimbatore',
      description: data.description || '',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'NEW_REPORT',
      reporter_name: data.reporter_name || 'Citizen'
    };
  }
}

export async function askAssistant(query: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('Failed to query assistant');
    return await res.json();
  } catch (err) {
    return {
      query,
      reply: "Found 1 high-risk demo parcel P-00102 (ULPIN: TN-CBE-123456789, Survey No: 124/2A) with detected unauthorized building construction in Perur village, Coimbatore.",
      relevant_parcels: [getFallbackParcels()[0]],
      relevant_alerts: [getFallbackAlerts()[0]]
    };
  }
}

function getFallbackParcels(): Parcel[] {
  return [
    {
      parcel_id: "P-00102",
      ulpin: "TN-CBE-123456789",
      survey_number: "124/2A",
      sub_division: "2A",
      district: "Coimbatore",
      taluk: "Coimbatore South",
      village: "Perur",
      ward: "Ward 12",
      state: "Tamil Nadu",
      area_acres: 2.45,
      area_hectares: 0.99,
      land_type: "Residential",
      latitude: 11.0168,
      longitude: 76.9558,
      geometry: {
        type: "Polygon",
        coordinates: [[
          [76.9543, 11.0158],
          [76.9570, 11.0156],
          [76.9576, 11.0179],
          [76.9548, 11.0182],
          [76.9543, 11.0158]
        ]]
      },
      status: "Under Review",
      risk_level: "HIGH",
      risk_score: 88,
      owner_name: "R. Selvaraj & Family (Demo Dataset)",
      last_survey_date: "2025-01-15",
      latest_change: "Potential Construction Detected",
      is_demo_target: true
    }
  ];
}

function getFallbackAlerts(): Alert[] {
  return [
    {
      alert_id: "ALT-00102",
      parcel_id: "P-00102",
      survey_number: "124/2A",
      village: "Perur",
      district: "Coimbatore",
      detection_type: "Possible Unauthorized Construction",
      risk_level: "HIGH",
      risk_score: 88.0,
      created_at: "2 hours ago",
      status: "UNDER_REVIEW",
      description: "High-confidence building structure detected on parcel TN-CBE-123456789 (Survey 124/2A).",
      evidence_image_before: "/static/imagery/demo_p00102_2025_before.png",
      evidence_image_after: "/static/imagery/demo_p00102_2026_after.png",
      ai_confidence: 0.94,
      change_area_sqm: 420
    }
  ];
}
