import { Parcel } from '../types';

export function getFullTNParcelData(parcel: Parcel): Parcel {
  const codePrefix = parcel.district ? `TN-${parcel.district.substring(0, 3).toUpperCase()}` : 'TN-CBE';
  const ulpin = parcel.ulpin || `${codePrefix}-${(parcel.parcel_id || 'P-00001').replace('P-', '').padStart(9, '0')}`;
  const areaAcres = parcel.area_acres || 2.45;
  const areaHectares = parcel.area_hectares || Number((areaAcres * 0.404686).toFixed(2));
  const subDiv = parcel.sub_division || parcel.survey_number.split('/')[1] || '1A';
  const taluk = parcel.taluk || `${parcel.district || 'Coimbatore'} South`;
  const village = parcel.village || 'Perur';
  const district = parcel.district || 'Coimbatore';
  const ward = parcel.ward || 'Ward 12';
  const risk = parcel.risk_level || 'LOW';
  const riskScore = parcel.risk_score || (risk === 'HIGH' ? 88 : risk === 'MEDIUM' ? 45 : 18);
  const owner = parcel.owner_name || `${parcel.parcel_id} Landowner (Demo Dataset)`;

  return {
    ...parcel,
    ulpin,
    sub_division: subDiv,
    taluk,
    village,
    district,
    ward,
    state: 'Tamil Nadu',
    area_acres: areaAcres,
    area_hectares: areaHectares,
    last_updated: parcel.last_updated || '30 August 2026',
    risk_score: riskScore,

    ownership: parcel.ownership || {
      owner_name: owner,
      ownership_type: parcel.is_demo_target ? 'Joint Pattadar' : 'Single Owner',
      owner_count: parcel.is_demo_target ? 2 : 1,
      ownership_status: risk === 'HIGH' ? 'Pending Review' : 'Verified Patta',
      ror_status: `Patta No. ${Math.floor(1000 + Math.random() * 8999)} (Active)`,
      mutation_status: 'Mutation Approved'
    },

    registration: parcel.registration || {
      reg_status: 'Registered',
      reg_number: `REG-2024-${codePrefix.substring(3)}-${Math.floor(1000 + Math.random() * 8999)}`,
      reg_date: '12 March 2024',
      doc_type: 'Sale Deed',
      previous_tx_status: 'Verified Title Deed Chain',
      latest_tx: 'Mutation Entered in e-Revenue Registry'
    },

    encumbrance: parcel.encumbrance || {
      encumbrance_status: risk === 'HIGH' ? 'Attention Required' : 'None Detected',
      mortgage_status: risk === 'HIGH' ? 'Active Bank Charge' : 'None',
      active_loan: risk === 'HIGH' ? 'Bank Mortgage Registered' : 'No Active Loan',
      litigation_status: risk === 'HIGH' ? 'Court Case Inquiry' : 'No Active Case',
      legal_restrictions: 'None'
    },

    land_use_zoning: parcel.land_use_zoning || {
      current_land_use: parcel.land_type || 'Residential',
      zoning_classification: `${parcel.land_type || 'Residential'} Zone`,
      development_zone: 'DTCP Approved Master Plan Zone',
      building_permission: parcel.land_type === 'Forest / Green Belt' ? 'Restricted' : 'Eligible',
      master_plan_zone: `${district} Master Plan 2026`,
      construction_restrictions: 'Standard Floor Space Ratio 1.5'
    },

    property_tax: parcel.property_tax || {
      tax_status: risk === 'HIGH' ? 'Outstanding' : 'Paid',
      last_payment_date: '15 July 2026',
      outstanding_amount: risk === 'HIGH' ? 4250 : 0,
      tax_assessment_number: `TAX-${codePrefix}-${Math.floor(10000 + Math.random() * 89999)}`
    },

    spatial_data: parcel.spatial_data || {
      perimeter_meters: Math.floor(200 + areaAcres * 120),
      boundary_coords_summary: '4 Boundary Control Nodes Geo-Referenced',
      nearby_roads: `NH-544 / State Highway (${Math.floor(100 + Math.random() * 400)}m)`,
      nearby_buildings: `${Math.floor(2 + Math.random() * 6)} structures within 200m`,
      nearby_waterbodies: 'Local Canal / River Basin (650m)'
    },

    change_detection: parcel.change_detection || {
      prev_image_date: 'January 2025',
      curr_image_date: 'August 2026',
      detected_changes: risk === 'HIGH' ? '⚠ New Building Detected' : 'No Significant Change',
      building_detection: risk === 'HIGH' ? '1 New Building (240 sq.m)' : 'No New Building',
      boundary_detection: 'Boundary Stable',
      confidence_score: parcel.is_demo_target ? 92 : (risk === 'HIGH' ? 89 : 95)
    },

    ai_risk: parcel.ai_risk || {
      risk_score: riskScore,
      risk_level: risk,
      positive_factors: [
        'Ownership & Patta records match revenue database',
        'Registration deed verified under Sub-Registrar records',
        'No litigation encumbrance detected',
        'Property tax records updated'
      ],
      risk_factors: risk === 'HIGH' ? [
        'New building structure detected via aerial drone analysis',
        'Land-use modification flagged from agricultural baseline',
        'Potential 1.2m boundary shift flagged on north side'
      ] : [],
      disclaimer: 'AI-assisted preliminary assessment — not a legal certification.'
    },

    cross_dept_verification: parcel.cross_dept_verification || {
      revenue_records: 'Matched',
      cadastral_map: 'Matched',
      registration_records: 'Matched',
      land_use: risk === 'HIGH' ? 'Mismatch Detected' : 'Matched',
      property_tax: risk === 'HIGH' ? 'Unpaid Balance' : 'Matched',
      spatial_data: risk === 'HIGH' ? 'Review Required' : 'Matched'
    },

    timeline: parcel.timeline || [
      { year: '2021', title: 'Original Patta Issued', description: 'Patta recorded under Tamil Nadu e-Services.', status: 'Verified' },
      { year: '2023', title: 'Ownership Mutation', description: 'Joint ownership updated following family settlement.', status: 'Verified' },
      { year: '2024', title: 'Sale Deed Registered', description: `Registered at Sub-Registrar Office ${district}.`, status: 'Verified' },
      { year: '2025', title: 'Land-Use Baseline Survey', description: 'Aerial drone imagery recorded.', status: 'Surveyed' },
      { year: '2026', title: 'BhoomiAI Satellite Analysis', description: 'Automated geospatial risk assessment scan.', status: risk === 'HIGH' ? 'Under Review' : 'Verified' }
    ],

    documents: parcel.documents || [
      { doc_id: 'DOC-01', name: 'Patta / Chitta Extract', type: 'Revenue Document', date: '2024-03-15', status: 'Verified' },
      { doc_id: 'DOC-02', name: 'Cadastral Map (FMB Extract)', type: 'GIS Map', date: '2024-03-15', status: 'Verified' },
      { doc_id: 'DOC-03', name: 'Registered Sale Deed', type: 'Legal Document', date: '2024-03-12', status: 'Verified' },
      { doc_id: 'DOC-04', name: 'Property Tax Receipt 2026', type: 'Tax Receipt', date: '2026-07-15', status: 'Verified' },
      { doc_id: 'DOC-05', name: 'Land-Use Classification Certificate', type: 'Planning Document', date: '2025-01-10', status: 'Verified' }
    ]
  };
}
