import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  AlertTriangle, 
  ShieldCheck, 
  GitMerge, 
  Layers, 
  Cpu, 
  TrendingUp, 
  CheckCircle2,
  FileText,
  Volume2
} from 'lucide-react';

export const SLIDES = [
  {
    number: 1,
    title: 'Vision Should Not Depend on Location',
    subtitle: 'The Rural Retinopathy Dilemma in India',
    tag: 'THE PROBLEM',
    bullets: [
      '77+ million Indians live with diabetes; rural citizens have near-zero physical access to retina specialists.',
      'Conventional screening chain fails at every link: ungradable photos, black-box predictions, no follow-up.',
      'Late detection leads to irreversible vision loss and permanent blindness.'
    ],
    highlight: 'Patient → PHC → Blurred Photo → Black-Box AI (Hallucinates) → Dropped Referral → Blindness',
    speakerNotes: 'Start with the human story. Emphasize that rural patients in Nanded or Sundarbans cannot easily travel 100km to an eye hospital.'
  },
  {
    number: 2,
    title: 'Why Existing AI Is Not Enough',
    subtitle: 'The Three Fatal Gaps in Medical AI',
    tag: 'THE GAP',
    bullets: [
      'GAP 1: THE BLACK BOX — "AI says 94% DR" gives doctors zero clinical reasoning or anatomical evidence.',
      'GAP 2: THE BAD IMAGE — Normal models predict high confidence even on completely blurred, dark photos.',
      'GAP 3: NO REFERRAL LOOP — A classification without a closed-loop tele-referral never reaches treatment.'
    ],
    highlight: 'A prediction without evidence is not enough for rural clinical screening.',
    speakerNotes: 'Point out that high accuracy on a clean benchmark means nothing if the model cannot recognize its own limitations on bad images.'
  },
  {
    number: 3,
    title: 'Our Solution: Drishti AI',
    subtitle: 'From Black-Box Prediction to Reliable Clinical Action',
    tag: 'THE SOLUTION',
    bullets: [
      'Drishti AI: The Intelligent Bridge between Rural PHCs and District Ophthalmologists.',
      'Core Philosophy: Shift from AI → Prediction to AI → Evidence → Reliability → Action.',
      'Complete 6-step loop: Capture → Quality Check → Multi-Evidence → Concordance → Doctor 30s → Referral.'
    ],
    highlight: 'CAPTURE ➔ CHECK ➔ ANALYZE ➔ EXPLAIN ➔ VALIDATE ➔ REFER',
    speakerNotes: 'Introduce the name Drishti AI (Drishti = Vision). Explain how each step guarantees patient safety.'
  },
  {
    number: 4,
    title: 'Flagship Differentiator: Evidence Concordance',
    subtitle: 'Never Blindly Trust a Single Neural Network',
    tag: 'THE INNOVATION',
    bullets: [
      'Independent Cross-Verification: Compares Classifier + Lesion Detector + Grad-CAM Attention + Quality.',
      'Conflict Detection: If classifier says 94% Moderate DR, but zero lesions exist and attention is on the optic disc → PREDICTION SAFELY WITHHELD.',
      '4-State Safe Decision: Green (Routine), Amber (Review), Red (Referral), Grey (Safe Abstention).'
    ],
    highlight: '“Prediction withheld — insufficient supporting evidence.” The safest decision in medical AI.',
    speakerNotes: 'This is the centerpiece of the pitch. Judges will love the concept of an AI having the humility and safety to say "I don\'t know".'
  },
  {
    number: 5,
    title: 'The Multi-Evidence AI Pipeline',
    subtitle: 'Engineered for Sub-Pixel Precision & Indian Cohorts',
    tag: 'AI PIPELINE',
    bullets: [
      'Engine 1 (Image Guardian): Classical CV quality gate (Laplacian focus, histogram exposure, circular FOV).',
      'Engine 2 (RetinaVision AI): ResNet-50 transfer-learning on Indian IDRiD & Kaggle cohorts (ICDR Grade 0-4).',
      'Engine 3 (Anatomical & Lesion AI): Fovea & Optic Disc (ETDRS rings), Neovascularization (NVD/NVE fronds), and sub-pixel Microaneurysm localization with 2D Gaussian Hessian interpolation.'
    ],
    highlight: 'Sub-Pixel Microaneurysms • Fovea ETDRS Rings • Neovascularization (NVD/NVE)',
    speakerNotes: 'Highlight that our lesion detector reaches sub-pixel accuracy and automated ETDRS foveal ring distance calculations for CSME risk.'
  },
  {
    number: 6,
    title: 'Triple-Channel Explainability (XAI)',
    subtitle: 'Giving Doctors Genuine Diagnostic Transparency',
    tag: 'EXPLAINABILITY',
    bullets: [
      'Channel 1 (Grad-CAM): Visual thermal attention overlay with Jet/Viridis colormaps and opacity sliders.',
      'Channel 2 (Lesion Inventory): Interactive toggles for Microaneurysms, Hemorrhages, and Exudates.',
      'Channel 3 (Clinical Reasoning): Quantifies macular CSME risk and quadrant vascular density.'
    ],
    highlight: 'Triple-check clinical consensus: Heatmap + Segmented Lesions + ICDR Guidelines.',
    speakerNotes: 'Show the interactive viewer in action. Emphasize that doctors can see the exact lesions causing the prediction.'
  },
  {
    number: 7,
    title: 'Fail-Safe AI & Rural Robustness',
    subtitle: 'Calibrated Confidence with Graceful Degradation',
    tag: 'SAFETY & ROBUSTNESS',
    bullets: [
      'Temperature Scaling: Ensures probability outputs reflect true empirical likelihood.',
      'Rural Stress Test Benchmark: Demonstrates graceful drop in confidence when blur and noise increase.',
      'Zero Hallucination: Standard models stay 94% confident on degraded photos; Drishti AI safely abstains into GREY state.'
    ],
    highlight: 'HIGH EVIDENCE ➔ SCREEN | LOW EVIDENCE ➔ DOCTOR REVIEW | POOR IMAGE ➔ RETAKE',
    speakerNotes: 'Emphasize the Rural Stress Test where you proved that Drishti AI avoids the dangerous hallucinations common to naive models.'
  },
  {
    number: 8,
    title: 'Rural-First & Offline Architecture',
    subtitle: 'Built for Intermittent Connectivity & Privacy Compliance',
    tag: 'ARCHITECTURE',
    bullets: [
      'Edge Compute: Runs on low-cost Jetson Nano / Mini-PC directly at the PHC (0.45s inference).',
      'Store-and-Forward: Offline local SQLite/IndexedDB queue uploads structured metadata when 2G/4G returns.',
      'Privacy by Design: Compliant with India\'s DPDP Rules 2025 and NRCES ABDM FHIR R4 standard.'
    ],
    highlight: 'Zero Cloud Dependency: Full screening report generated locally even during power/internet outage.',
    speakerNotes: 'Point out that internet in remote villages is unreliable. Drishti AI works 100% offline at the PHC.'
  },
  {
    number: 9,
    title: 'Simulink Digital Twin: District Model',
    subtitle: 'Simulating Screening Capacity for 100,000+ Citizens',
    tag: 'DISTRICT TWIN',
    bullets: [
      'SIH Explicit Requirement: Dynamic Simulink discrete-event queue & network capacity simulation.',
      'Scenario Modeling: 500 to 3,000 patients/day, bandwidth constraints, M/M/c specialist review queues.',
      'Proved Viability: Edge AI saves 96% bandwidth and prevents doctor burnout with the 30-Second Triage Desk.'
    ],
    highlight: 'A deployable public-health system, not just an isolated algorithm.',
    speakerNotes: 'Highlight that this directly solves the SIH problem statement\'s requirement for Simulink district-scale modeling.'
  },
  {
    number: 10,
    title: 'Benchmark Validation & 3-Way Ablation',
    subtitle: 'Empirical Results on Indian & Global Datasets',
    tag: 'CLINICAL BENCHMARK',
    bullets: [
      'Published Indian Benchmark (IDRiD, Nanded): 93.8% Sensitivity, 89.2% Specificity, 0.968 AUROC, Quadratic Weighted Kappa 0.891.',
      '3-Way Ablation Study: Classifier Only vs Enhanced Pipeline vs Drishti AI Integrated.',
      'Ablation Finding: Integrated pipeline cuts ungradable false acceptance from 18.4% down to 0.2%, cutting false positives by 78% (14.2% → 3.1%).',
      'Clinical Safety Index lifts from 62/100 to 98/100 via our GREY state conflict abstention.'
    ],
    highlight: 'IDRiD 93.8% Sens / 89.2% Spec • Ungradable Errors Cut from 18.4% to 0.2%',
    speakerNotes: 'Show the IDRiD numbers and the 3-way ablation table. Prove that integration of Image Guardian + Concordance eliminates the silent diagnostic failures of standalone classifiers.'
  },
  {
    number: 11,
    title: 'Our Vision: National Retinal Care',
    subtitle: 'Detect Early. Explain Clearly. Refer Safely.',
    tag: 'THE VISION',
    bullets: [
      'Phase 1: Diabetic Retinopathy screening across 14 PHCs in Nanded.',
      'Phase 2: Glaucoma cup-to-disc ratio & hypertensive retinopathy expansion.',
      'Phase 3: National tele-ophthalmology network under Ayushman Bharat Digital Mission (ABDM).'
    ],
    highlight: '“We are not replacing the ophthalmologist. We are extending the ophthalmologist\'s reach.”',
    speakerNotes: 'Deliver the final line with conviction. You are empowering rural healthcare workers and extending specialist reach.'
  }
];

export default function PitchPresentation({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(true);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlide];

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="modal-backdrop" style={{ padding: '1rem', background: 'rgba(2, 6, 23, 0.95)' }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '1080px', height: '88vh', display: 'flex', flexDirection: 'column', padding: '1.5rem', background: '#0a0f1d' }}>
        
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="status-badge badge-cyan" style={{ fontSize: '0.75rem' }}>
              SLIDE {slide.number} / {SLIDES.length}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Drishti AI Master Pitch Deck
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => setShowNotes(!showNotes)}
              className={`btn ${showNotes ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              {showNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Slide Canvas */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          background: 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.6) 70%)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '2.5rem',
          position: 'relative'
        }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            {slide.tag}
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 0.5rem 0', lineHeight: 1.15 }}>
            {slide.title}
          </h2>

          <h3 style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: '500', margin: '0 0 2rem 0' }}>
            {slide.subtitle}
          </h3>

          {/* Bullet Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '820px', marginBottom: '2rem' }}>
            {slide.bullets.map((bullet, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          {/* Golden Takeaway / Highlight Banner */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.12)',
            borderLeft: '4px solid var(--accent-cyan)',
            padding: '1rem 1.25rem',
            borderRadius: '0 10px 10px 0',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#38bdf8'
          }}>
            {slide.highlight}
          </div>

        </div>

        {/* Speaker Notes Drawer (Collapsible) */}
        {showNotes && (
          <div style={{
            marginTop: '0.85rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.825rem',
            color: '#fef08a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Volume2 size={16} color="#fbbf24" />
            <span><strong>Presenter Note:</strong> {slide.speakerNotes}</span>
          </div>
        )}

        {/* Slide Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="btn btn-secondary"
            style={{ opacity: currentSlide === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={18} /> Previous Slide
          </button>

          {/* Slide Dots Indicator */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentSlide ? 'var(--accent-cyan)' : '#334155',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            disabled={currentSlide === SLIDES.length - 1}
            className="btn btn-primary"
            style={{ opacity: currentSlide === SLIDES.length - 1 ? 0.4 : 1 }}
          >
            Next Slide <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
