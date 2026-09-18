import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Play, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export const DEMO_STEPS = [
  {
    step: 1,
    time: '00:00 – 00:30',
    title: 'The Rural Patient Context',
    script: '“This is Ramesh Patil, a 58-year-old farmer from Ardhapur village in Nanded District. He has had diabetes for 9 years, but the nearest vitreoretinal specialist is 90 kilometers away. Today he visits his local Primary Health Centre (PHC).”',
    actionText: 'Select Ramesh Patil (Moderate NPDR case)',
    targetTab: 'screening',
    patientIdx: 0,
    conflictMode: false
  },
  {
    step: 2,
    time: '00:30 – 01:00',
    title: 'Engine 1: Image Quality Guardian Rejection',
    script: '“In rural field screening, 15–20% of photographs are ruined by motion blur or poor focus. Watch what happens when an untrained field worker takes a shaky, dark image. Instead of guessing, Drishti AI\'s Image Guardian flags it immediately as UNGRADABLE (Score 34/100) and gives actionable smart retake guidance: \'Move camera 2-3 cm closer and hold steady\'.”',
    actionText: 'Test Ungradable Image (Lakshmi Bai)',
    targetTab: 'screening',
    patientIdx: 3,
    conflictMode: false
  },
  {
    step: 3,
    time: '01:00 – 01:45',
    title: 'Quality Pass & Preprocessing',
    script: '“Now the health worker retakes the photo following the AI guidance. Quality Score jumps to 89/100 (ACCEPTABLE). The gate passes, and CLAHE normalization and vessel extraction are automatically applied on the edge device.”',
    actionText: 'Switch to High Quality Image (Ramesh Patil)',
    targetTab: 'screening',
    patientIdx: 0,
    conflictMode: false
  },
  {
    step: 4,
    time: '01:45 – 02:30',
    title: 'Triple-Channel Evidence-XAI (WOW Moment 1)',
    script: '“Don\'t just show the doctor an arbitrary percentage. Drishti AI presents three independent clinical evidence channels: First, Grad-CAM attention heatmap overlay; Second, U-Net segmented lesion masks for 18 microaneurysms, 5 blot hemorrhages, and a circinate hard exudate ring; Third, ICDR clinical reasoning confirming Moderate NPDR with 92% calibrated confidence.”',
    actionText: 'Inspect Triple-Channel Evidence',
    targetTab: 'screening',
    patientIdx: 0,
    conflictMode: false
  },
  {
    step: 5,
    time: '02:30 – 03:00',
    title: 'Evidence Concordance Conflict Demo (WOW Moment 2)',
    script: '“Now watch our biggest differentiator. What if a black-box model predicts 94% Moderate DR, but the lesion detector finds zero lesions and Grad-CAM is fixated on the optic disc? Normal AI gives a dangerous false positive. Drishti AI\'s Concordance Engine detects the conflict, withholds the prediction, and enters GREY ABSTENTION MODE: \'Prediction withheld — insufficient supporting evidence\'. That is safe medical AI.”',
    actionText: 'Activate Simulated Conflict Mode',
    targetTab: 'screening',
    patientIdx: 0,
    conflictMode: true
  },
  {
    step: 6,
    time: '03:00 – 03:45',
    title: 'Doctor 30-Second Triage & Multilingual Patient GenAI',
    script: '“Now switch to the Doctor 30-Second View. The ophthalmologist at the district civil hospital sees the original photo, annotated masks, and concordance report on one screen, signing off in 30 seconds. Simultaneously, our controlled GenAI generates a plain-language explanation in Marathi, Hindi, or Bengali that can be read aloud to the patient, paired with a QR-coded hospital referral.”',
    actionText: 'Open Doctor 30s View',
    targetTab: 'doctor',
    patientIdx: 0,
    conflictMode: false
  },
  {
    step: 7,
    time: '03:45 – 04:30',
    title: 'Simulink District Digital Twin (Public Health Scale)',
    script: '“Finally, this isn\'t just an algorithm—it\'s a deployable public health system. As required by the SIH problem statement, we built a working Simulink Digital Twin. Watch what happens when we scale from 500 to 3,000 patients a day: our Edge AI architecture saves 96% cellular bandwidth and prevents specialist backlog, proving that 1 district can realistically screen 100,000+ people.”',
    actionText: 'Open Simulink Digital Twin',
    targetTab: 'simulink',
    patientIdx: 0,
    conflictMode: false
  },
  {
    step: 8,
    time: '04:30 – 05:00',
    title: 'Clinical Benchmark & 3-Way Ablation Study',
    script: '“Here is our empirical clinical proof. Tested on the published Indian IDRiD cohort from Nanded, Drishti AI achieves 93.8% sensitivity, 89.2% specificity, and 0.968 AUROC. Furthermore, our 3-way ablation study proves that integrating Image Guardian with Evidence Concordance slashes ungradable image false acceptances from 18.4% to 0.2%, boosting clinical safety from 62 to 98/100.”',
    actionText: 'View IDRiD Benchmark & Ablation Study',
    targetTab: 'benchmark',
    patientIdx: 0,
    conflictMode: false
  },
  {
    step: 9,
    time: '05:00 – 05:30',
    title: 'Closing Vision: District Health Surveillance',
    script: '“We are not replacing the ophthalmologist. We are extending the ophthalmologist’s reach. Through our DHO population health dashboard, health directors monitor screening rates and retake anomalies across all 14 rural PHCs. Drishti AI: Detect early, explain clearly, refer safely.”',
    actionText: 'View Population DHO Dashboard',
    targetTab: 'analytics',
    patientIdx: 0,
    conflictMode: false
  }
];

export default function DemoTourModal({ 
  isOpen, 
  onClose, 
  onApplyDemoStep 
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleExecuteStep = (step) => {
    onApplyDemoStep(step);
  };

  return (
    <div className="modal-backdrop" style={{ background: 'rgba(2, 6, 23, 0.88)' }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '680px' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
              4-Minute Guided Pitch & Demo Tour
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Timing & Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="status-badge badge-cyan" style={{ fontSize: '0.725rem' }}>
            STEP {currentStep.step} OF {DEMO_STEPS.length} • {currentStep.time}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            {currentStep.title}
          </span>
        </div>

        {/* Presenter Spoken Script Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          borderLeft: '4px solid var(--accent-cyan)',
          borderRadius: '0 10px 10px 0',
          padding: '1.25rem',
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#f8fafc',
          marginBottom: '1.25rem'
        }}>
          {currentStep.script}
        </div>

        {/* One-Click Action Trigger */}
        <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid var(--accent-cyan)', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>LIVE DEMO ACTION:</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#38bdf8' }}>
              {currentStep.actionText}
            </div>
          </div>
          <button
            onClick={() => handleExecuteStep(currentStep)}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            <Play size={14} /> Execute on UI Now
          </button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => {
              if (currentStepIdx > 0) {
                const prev = currentStepIdx - 1;
                setCurrentStepIdx(prev);
                handleExecuteStep(DEMO_STEPS[prev]);
              }
            }}
            disabled={currentStepIdx === 0}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            <ChevronLeft size={16} /> Previous Step
          </button>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Step {currentStepIdx + 1} / {DEMO_STEPS.length}
          </span>

          <button
            onClick={() => {
              if (currentStepIdx < DEMO_STEPS.length - 1) {
                const next = currentStepIdx + 1;
                setCurrentStepIdx(next);
                handleExecuteStep(DEMO_STEPS[next]);
              } else {
                onClose();
              }
            }}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem' }}
          >
            {currentStepIdx < DEMO_STEPS.length - 1 ? 'Next Step' : 'Finish Tour'} <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
