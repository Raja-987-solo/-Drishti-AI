/**
 * District Population Health & Screening Analytics Data
 * Modeled after Nanded District, Maharashtra (origin region of IDRiD dataset)
 */

export const DISTRICT_METRICS = {
  districtName: 'Nanded District Retinal Health Network',
  state: 'Maharashtra',
  totalPopulation: 3361292,
  targetDiabeticCohort: 185000,
  totalScreened: 24381,
  gradablePercentage: 91.4,
  retakePercentage: 8.6,
  referablePercentage: 6.3,
  pendingDoctorReview: 438,
  referralsCompleted: 81.2,
  avgInferenceSeconds: 0.48,
  networkBandwidthSavedGB: 198.4,
  phcCentersCount: 14,
  ophthalmologistsOnCall: 4,

  phcFacilities: [
    { id: 'PHC-01', name: 'Ardhapur PHC', screened: 2840, gradablePct: 93.2, referablePct: 6.1, retakePct: 6.8, status: 'OPTIMAL' },
    { id: 'PHC-02', name: 'Mudkhed PHC', screened: 1950, gradablePct: 87.4, referablePct: 7.2, retakePct: 12.6, status: 'RETAKE_ALERT' },
    { id: 'PHC-03', name: 'Loha Rural Hospital', screened: 3120, gradablePct: 92.8, referablePct: 6.5, retakePct: 7.2, status: 'OPTIMAL' },
    { id: 'PHC-04', name: 'Hadgaon PHC', screened: 2210, gradablePct: 90.1, referablePct: 5.9, retakePct: 9.9, status: 'OPTIMAL' },
    { id: 'PHC-05', name: 'Kinwat Tribal Health Post', screened: 1680, gradablePct: 88.6, referablePct: 8.4, retakePct: 11.4, status: 'RETAKE_ALERT' },
    { id: 'PHC-06', name: 'Bhokar Sub-District Hospital', screened: 3450, gradablePct: 94.5, referablePct: 5.8, retakePct: 5.5, status: 'OPTIMAL' },
    { id: 'PHC-07', name: 'Degloor Civil Dispensary', screened: 2420, gradablePct: 91.7, referablePct: 6.2, retakePct: 8.3, status: 'OPTIMAL' },
    { id: 'PHC-08', name: 'Mukhed PHC', screened: 2110, gradablePct: 89.2, referablePct: 6.7, retakePct: 10.8, status: 'OPTIMAL' },
    { id: 'PHC-09', name: 'Kandhar Rural Hospital', screened: 2601, gradablePct: 93.1, referablePct: 6.0, retakePct: 6.9, status: 'OPTIMAL' },
    { id: 'PHC-10', name: 'Naigaon PHC', screened: 2000, gradablePct: 90.9, referablePct: 5.5, retakePct: 9.1, status: 'OPTIMAL' }
  ],

  severityDistribution: [
    { grade: 'No DR (Level 0)', count: 18640, pct: 76.5, color: '#10b981' },
    { grade: 'Mild NPDR (Level 1)', count: 4210, pct: 17.2, color: '#f59e0b' },
    { grade: 'Moderate NPDR (Level 2)', count: 1120, pct: 4.6, color: '#ef4444' },
    { grade: 'Severe NPDR (Level 3)', count: 285, pct: 1.2, color: '#dc2626' },
    { grade: 'Proliferative DR (Level 4)', count: 126, pct: 0.5, color: '#991b1b' }
  ],

  weeklyScreeningTrend: [
    { day: 'Mon', screened: 640, referable: 42, retakes: 51 },
    { day: 'Tue', screened: 780, referable: 53, retakes: 58 },
    { day: 'Wed', screened: 810, referable: 49, retakes: 64 },
    { day: 'Thu', screened: 750, referable: 47, retakes: 52 },
    { day: 'Fri', screened: 890, referable: 61, retakes: 70 },
    { day: 'Sat', screened: 950, referable: 68, retakes: 82 },
    { day: 'Sun', screened: 320, referable: 21, retakes: 24 }
  ]
};
