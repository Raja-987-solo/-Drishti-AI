/**
 * Sample Patient Cohorts with Longitudinal Screening History
 * Aligned with rural healthcare demographic profiles (IDRiD / Maharashtra / Bihar / Bengal)
 */

export const SAMPLE_PATIENTS = [
  {
    id: 'P-10482',
    abhaId: '91-4829-1048-2918',
    name: 'Ramesh Patil',
    age: 58,
    gender: 'Male',
    village: 'Ardhapur',
    block: 'Nanded Rural',
    district: 'Nanded',
    state: 'Maharashtra',
    phcCenter: 'Ardhapur Primary Health Centre',
    diabetesDurationYears: 9,
    hba1c: 8.4,
    bp: '138/88 mmHg',
    currentEye: 'OS (Left Eye)',
    imageFile: '/images/moderate_dr.jpg',
    condition: 'moderate_dr',
    history: [
      { year: '2024', grade: 'No DR', level: 0, status: 'GREEN', clinic: 'Ardhapur PHC', microaneurysms: 0, notes: 'Clear fundus exam' },
      { year: '2025', grade: 'Mild NPDR', level: 1, status: 'AMBER', clinic: 'Ardhapur PHC', microaneurysms: 3, notes: 'Single dot hemorrhage observed, advised glycemic control' },
      { year: '2026', grade: 'Moderate NPDR', level: 2, status: 'RED', clinic: 'Ardhapur PHC', microaneurysms: 18, notes: 'Circinate exudate ring + blot hemorrhages' }
    ]
  },
  {
    id: 'P-10483',
    abhaId: '91-3921-5049-1192',
    name: 'Sunita Devi',
    age: 52,
    gender: 'Female',
    village: 'Rajnagar',
    block: 'Madhubani North',
    district: 'Madhubani',
    state: 'Bihar',
    phcCenter: 'Rajnagar Health & Wellness Centre',
    diabetesDurationYears: 4,
    hba1c: 6.8,
    bp: '122/78 mmHg',
    currentEye: 'OD (Right Eye)',
    imageFile: '/images/normal.jpg',
    condition: 'normal',
    history: [
      { year: '2025', grade: 'No DR', level: 0, status: 'GREEN', clinic: 'Rajnagar HWC', microaneurysms: 0, notes: 'Routine baseline' },
      { year: '2026', grade: 'No DR', level: 0, status: 'GREEN', clinic: 'Rajnagar HWC', microaneurysms: 0, notes: 'Clear retina, stable HbA1c' }
    ]
  },
  {
    id: 'P-10484',
    abhaId: '91-7712-4029-9401',
    name: 'Kamalendu Mondal',
    age: 64,
    gender: 'Male',
    village: 'Gosaba',
    block: 'Sundarbans Coastal',
    district: 'South 24 Parganas',
    state: 'West Bengal',
    phcCenter: 'Gosaba Rural Hospital',
    diabetesDurationYears: 16,
    hba1c: 9.8,
    bp: '154/96 mmHg',
    currentEye: 'OS (Left Eye)',
    imageFile: '/images/severe_dr.jpg',
    condition: 'severe_dr',
    history: [
      { year: '2023', grade: 'Mild NPDR', level: 1, status: 'AMBER', clinic: 'Canning SDH', microaneurysms: 4, notes: 'Initial microaneurysms' },
      { year: '2025', grade: 'Moderate NPDR', level: 2, status: 'RED', clinic: 'Gosaba RH', microaneurysms: 22, notes: 'Blot hemorrhages, poor compliance' },
      { year: '2026', grade: 'Proliferative DR', level: 4, status: 'RED', clinic: 'Gosaba RH', microaneurysms: 42, notes: 'Neovascularization of disc (NVD) & cotton wool spots' }
    ]
  },
  {
    id: 'P-10485',
    abhaId: '91-8840-2091-7734',
    name: 'Lakshmi Bai',
    age: 60,
    gender: 'Female',
    village: 'Mudkhed',
    block: 'Mudkhed Rural',
    district: 'Nanded',
    state: 'Maharashtra',
    phcCenter: 'Mudkhed PHC',
    diabetesDurationYears: 7,
    hba1c: 7.9,
    bp: '142/90 mmHg',
    currentEye: 'OD (Right Eye)',
    imageFile: '/images/blurred_ungradable.jpg',
    condition: 'blurred',
    history: []
  }
];
