import { Parcel, Alert, CitizenReport, DashboardStats, AIAnalysisResult } from '../types';

const API_BASE = '/api';

export async function fetchParcels(params?: { village?: string; land_type?: string; risk?: string; search?: string }): Promise<Parcel[]> {
  try {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/parcels?${query}`);
    if (!res.ok) throw new Error('Failed to fetch parcels');
    return await res.json();
  } catch (err) {
    console.warn('API connection fallback, using local fallback:', err);
    return getFallbackParcels();
  }
}

export async function fetchParcelDetail(parcelId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/parcels/${parcelId}`);
    if (!res.ok) throw new Error('Failed to fetch parcel detail');
    return await res.json();
  } catch (err) {
    const parcels = getFallbackParcels();
    const found = parcels.find(p => p.parcel_id === parcelId || p.survey_number === parcelId) || parcels[0];
    return {
      parcel: found,
      alerts: [getFallbackAlerts()[0]],
      timeline: [
        { year: '2024', status: 'Agricultural Land', description: 'Verified agricultural land record.' },
        { year: '2025', status: 'No Change', description: 'Regular seasonal farming observed.' },
        { year: '2026', status: 'Potential Construction Detected', description: 'AI aerial difference flagged new building.' },
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
      total_parcels: 12450,
      surveyed_parcels: 9820,
      pending_survey: 2630,
      active_alerts: 124,
      high_priority_alerts: 18,
      medium_priority_alerts: 47,
      under_verification_alerts: 31,
      resolved_alerts: 28,
      land_type_distribution: {
        'Agricultural': 5400,
        'Government': 2800,
        'Residential': 2100,
        'Forest / Green Belt': 1200,
        'Commercial': 650,
        'Water Body': 300
      },
      alerts_by_severity: { 'HIGH': 18, 'MEDIUM': 47, 'LOW': 59 },
      recent_alerts: getFallbackAlerts(),
      survey_completion_rate: 78.8
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
      matched_survey_number: '102/3A',
      matched_village: 'Rampur',
      matched_latitude: 26.9124,
      matched_longitude: 75.7873,
      risk_score: 88.5,
      risk_level: 'HIGH',
      rationale: [
        'AI Detection Confidence (94.0%): +37.6 pts',
        'Change Magnitude (14.5% parcel area): +17.4 pts',
        'Land Type (Agricultural) & Violation Category Multiplier: +33.5 pts',
        'Final Risk Classification: 88.5/100 (HIGH)'
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
      survey_number: data.survey_number || '102/3A',
      village: data.village || 'Rampur',
      district: 'Jaipur',
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
      reply: "Found 1 high-risk demo parcel P-00102 (Survey No: 102/3A) with detected unauthorized building construction in Rampur village.",
      relevant_parcels: [getFallbackParcels()[0]],
      relevant_alerts: [getFallbackAlerts()[0]]
    };
  }
}

function getFallbackParcels(): Parcel[] {
  return [
    {
      parcel_id: "P-00102",
      survey_number: "102/3A",
      village: "Rampur",
      district: "Jaipur",
      area_acres: 2.4,
      land_type: "Agricultural",
      latitude: 26.9124,
      longitude: 75.7873,
      geometry: {
        type: "Polygon",
        coordinates: [[
          [75.7858, 26.9114],
          [75.7885, 26.9112],
          [75.7891, 26.9135],
          [75.7863, 26.9138],
          [75.7858, 26.9114]
        ]]
      },
      status: "Under Review",
      risk_level: "HIGH",
      owner_name: "Demo Land Records (Synthetic)",
      last_survey_date: "2025-01-15",
      latest_change: "Potential Construction Detected",
      is_demo_target: true
    },
    {
      parcel_id: "P-00014",
      survey_number: "145/2",
      village: "Kishangarh",
      district: "Ajmer",
      area_acres: 5.1,
      land_type: "Government",
      latitude: 26.5743,
      longitude: 74.8657,
      geometry: {
        type: "Polygon",
        coordinates: [[
          [74.8647, 26.5733],
          [74.8667, 26.5733],
          [74.8667, 26.5753],
          [74.8647, 26.5753],
          [74.8647, 26.5733]
        ]]
      },
      status: "Surveyed",
      risk_level: "MEDIUM",
      owner_name: "State Revenue Dept",
      last_survey_date: "2024-11-20",
      latest_change: "Land-use Change"
    }
  ];
}

function getFallbackAlerts(): Alert[] {
  return [
    {
      alert_id: "ALT-00102",
      parcel_id: "P-00102",
      survey_number: "102/3A",
      village: "Rampur",
      district: "Jaipur",
      detection_type: "Possible Unauthorized Construction",
      risk_level: "HIGH",
      risk_score: 88.5,
      created_at: "2 hours ago",
      status: "UNDER_REVIEW",
      description: "High-confidence building structure detected on agricultural land P-00102.",
      evidence_image_before: "/static/imagery/demo_p00102_2025_before.png",
      evidence_image_after: "/static/imagery/demo_p00102_2026_after.png",
      ai_confidence: 0.94,
      change_area_sqm: 420
    },
    {
      alert_id: "ALT-00145",
      parcel_id: "P-00014",
      survey_number: "145/2",
      village: "Kishangarh",
      district: "Ajmer",
      detection_type: "Land-use Change",
      risk_level: "MEDIUM",
      risk_score: 58.0,
      created_at: "5 hours ago",
      status: "NEW",
      description: "Land clearing and earthwork detected near boundary zone.",
      evidence_image_before: "/static/imagery/demo_p00102_2025_before.png",
      evidence_image_after: "/static/imagery/demo_p00102_2026_after.png",
      ai_confidence: 0.82,
      change_area_sqm: 210
    }
  ];
}
