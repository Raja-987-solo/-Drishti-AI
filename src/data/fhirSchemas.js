/**
 * ABDM (Ayushman Bharat Digital Mission) & HL7 FHIR R4 Data Models
 * Provides interoperable JSON representation for clinical exchange.
 */

export function buildFHIRDiagnosticReport({
  patient,
  screeningResult,
  concordanceResult,
  clinicianNotes = 'Verified by Dr. Arvind Kulkarni, MS (Ophth)'
}) {
  const dateIso = new Date().toISOString();
  const reportId = `DRISHTI-DIAG-${Date.now()}`;

  return {
    resourceType: 'DiagnosticReport',
    id: reportId,
    meta: {
      profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DiagnosticReportRecord'],
      versionId: '1',
      lastUpdated: dateIso
    },
    identifier: [
      {
        system: 'https://drishtiai.gov.in/reports',
        value: reportId
      }
    ],
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
            code: 'OPH',
            display: 'Ophthalmology'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '422338006',
          display: 'Screening for diabetic retinopathy (procedure)'
        }
      ],
      text: 'Diabetic Retinopathy Screening with Evidence-XAI'
    },
    subject: {
      reference: `Patient/${patient.id}`,
      display: patient.name,
      identifier: {
        system: 'https://healthid.ndhm.gov.in',
        value: patient.abhaId
      }
    },
    effectiveDateTime: dateIso,
    issued: dateIso,
    performer: [
      {
        display: patient.phcCenter,
        type: 'Organization'
      },
      {
        display: 'Drishti AI ResNet-50 Autonomous Inference Pipeline',
        type: 'Device'
      }
    ],
    conclusionCode: [
      {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: screeningResult?.level === 0 ? '267027003' : '4855003',
            display: screeningResult?.grade || 'Diabetic Retinopathy'
          }
        ]
      }
    ],
    conclusion: `${screeningResult?.grade} (ICDR Level ${screeningResult?.level}). Multi-evidence concordance: ${concordanceResult?.concordanceStatus}. ${concordanceResult?.safeDecision?.summary}`,
    presentedForm: [
      {
        contentType: 'application/json',
        data: btoa(JSON.stringify({
          calibratedConfidence: screeningResult?.calibratedConfidence,
          concordanceScore: concordanceResult?.concordanceScore,
          lesionCounts: concordanceResult?.lesionCounts,
          imageQualityScore: concordanceResult?.qualityScore,
          clinicianVerification: clinicianNotes
        }))
      }
    ]
  };
}
