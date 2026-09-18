/**
 * Simulink Digital Twin Model
 * 
 * Simulates district-scale screening workflow capacity, queuing dynamics,
 * network bandwidth bottlenecks, and specialist review queues based on
 * Simulink discrete-event queue architectures.
 */

export const PRESET_SCENARIOS = {
  SCENARIO_A: {
    id: 'SCENARIO_A',
    name: 'Scenario A: Remote Rural PHC',
    description: '500 patients/day, 1 local ophthalmologist, poor 2G connectivity (64 kbps), cloud-dependent AI.',
    dailyPatients: 500,
    phcCount: 4,
    bandwidthKbps: 64,
    useEdgeAI: false,
    imageRejectionRate: 18,
    doctorCount: 1,
    doctorSpeedMinutes: 4.5
  },
  SCENARIO_B: {
    id: 'SCENARIO_B',
    name: 'Scenario B: Semi-Urban Cluster',
    description: '1,500 patients/day, 2 district doctors, moderate 3G connectivity (512 kbps), hybrid cloud processing.',
    dailyPatients: 1500,
    phcCount: 8,
    bandwidthKbps: 512,
    useEdgeAI: false,
    imageRejectionRate: 12,
    doctorCount: 2,
    doctorSpeedMinutes: 3.5
  },
  SCENARIO_C: {
    id: 'SCENARIO_C',
    name: 'Scenario C: Drishti AI Edge Network',
    description: '3,000 patients/day, 12 rural PHCs equipped with Drishti AI Jetson Edge AI, 4 tele-specialists.',
    dailyPatients: 3000,
    phcCount: 12,
    bandwidthKbps: 2048,
    useEdgeAI: true, // Drishti AI Edge!
    imageRejectionRate: 8,
    doctorCount: 4,
    doctorSpeedMinutes: 1.5 // Accelerated by 30-second view!
  }
};

export function runSimulinkDistrictSimulation(params) {
  const {
    dailyPatients = 1000,
    phcCount = 6,
    bandwidthKbps = 256,
    useEdgeAI = true,
    imageRejectionRate = 10,
    doctorCount = 2,
    doctorSpeedMinutes = 2.0
  } = params;

  const imagesPerPatient = 2; // Left & Right eye
  const totalRawImages = dailyPatients * imagesPerPatient;
  const imageSizeBytesMB = 4.2; // High-res fundus image

  // 1. Quality Rejections
  const rejectedImages = Math.round(totalRawImages * (imageRejectionRate / 100));
  const gradableImages = totalRawImages - rejectedImages;

  // 2. Bandwidth & Transmission Time
  // If Edge AI is active, only metadata + structured JSON + 50KB thumbnail is synced (saving 98% bandwidth!)
  const syncPayloadMB = useEdgeAI
    ? (gradableImages * 0.08) // 80 KB lightweight JSON + feature vector
    : (gradableImages * imageSizeBytesMB);

  const totalBandwidthGigabytes = syncPayloadMB / 1024;
  const networkSpeedMBps = (bandwidthKbps / 8) / 1024;
  const uploadTimeHours = networkSpeedMBps > 0 ? (syncPayloadMB / networkSpeedMBps) / 3600 : 999;

  // 3. AI Inference Throughput
  // Edge GPU: 0.4s per image. Cloud API with upload queue: depends on latency
  const aiLatencySeconds = useEdgeAI ? 0.45 : (2.5 + (imageSizeBytesMB / (networkSpeedMBps || 0.01)));
  const aiThroughputPerHour = Math.round(3600 / aiLatencySeconds) * (useEdgeAI ? phcCount : 1);

  // 4. Clinical Triage Split
  // Population DR prevalence ~12.5%, Referable DR ~6.5%, Grey/Abstain review ~4%
  const referableCases = Math.round(dailyPatients * 0.065);
  const amberReviewCases = Math.round(dailyPatients * 0.08);
  const greyConflictCases = Math.round(dailyPatients * 0.035);
  const totalDoctorReviewCases = referableCases + amberReviewCases + greyConflictCases;

  // 5. Doctor Queuing Model (M/M/c discrete queue)
  const workingHoursPerDay = 7;
  const doctorCapacityPerDay = Math.round((doctorCount * workingHoursPerDay * 60) / doctorSpeedMinutes);
  const doctorQueueBacklog = Math.max(0, totalDoctorReviewCases - doctorCapacityPerDay);

  const doctorUtilizationPct = Math.min(100, Math.round((totalDoctorReviewCases / Math.max(1, doctorCapacityPerDay)) * 100));

  // Patient Average Total Turnaround Time (minutes)
  let avgWaitTimeMinutes = 8;
  if (!useEdgeAI && bandwidthKbps < 128) {
    avgWaitTimeMinutes += 45; // Bottlenecked by cloud upload
  }
  if (doctorQueueBacklog > 100) {
    avgWaitTimeMinutes += Math.round((doctorQueueBacklog / doctorCount) * 1.8);
  }

  // Recommended Staffing
  const neededDoctors = Math.ceil(totalDoctorReviewCases / ((workingHoursPerDay * 60) / doctorSpeedMinutes));

  return {
    dailyPatients,
    totalRawImages,
    gradableImages,
    rejectedImages,
    syncPayloadMB: Math.round(syncPayloadMB),
    totalBandwidthGB: totalBandwidthGigabytes.toFixed(2),
    bandwidthSavedPct: useEdgeAI ? 96 : 0,
    uploadTimeHours: uploadTimeHours.toFixed(1),
    aiThroughputPerHour,
    aiLatencySeconds: aiLatencySeconds.toFixed(2),
    totalDoctorReviewCases,
    doctorCapacityPerDay,
    doctorQueueBacklog,
    doctorUtilizationPct,
    avgWaitTimeMinutes,
    neededDoctors,
    isBottlenecked: doctorQueueBacklog > 50 || uploadTimeHours > 8,
    bottlenecks: [
      ...(uploadTimeHours > 8 ? ['Severe Bandwidth Bottleneck: Cloud sync takes longer than clinic hours! Enable Edge AI.'] : []),
      ...(doctorQueueBacklog > 50 ? [`Specialist Review Backlog: ${doctorQueueBacklog} patients delayed. Requires +${Math.max(1, neededDoctors - doctorCount)} ophthalmologist(s).`] : []),
      ...(imageRejectionRate > 15 ? ['High Field Retake Rate: Over 15% images rejected. Retrain field workers with Image Guardian.'] : [])
    ]
  };
}
