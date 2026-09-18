import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  RotateCcw, 
  User, 
  Layers, 
  Sparkles, 
  Crosshair, 
  ArrowRight,
  Clock,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_PATIENTS } from '../../data/samplePatients';

export default function DoctorTriageDesk({ onSignoffCase }) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [activeLayer, setActiveLayer] = useState('both'); // 'original' | 'gradcam' | 'lesions' | 'both'
  const [doctorOverrideGrade, setDoctorOverrideGrade] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);

  const activePatient = SAMPLE_PATIENTS[selectedCaseIdx] || SAMPLE_PATIENTS[0];

  const handleAction = (decision) => {
    setActionSuccess(decision);
    setTimeout(() => {
      setActionSuccess(false);
      // Advance to next patient
      setSelectedCaseIdx((prev) => (prev + 1) % SAMPLE_PATIENTS.length);
    }, 1200);
  };

  return (
    <div className="animate-fade-in">
      
      {/* Top Header Card */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                Doctor 30-Second Rapid Tele-Triage Desk
              </h2>
              <span className="status-badge badge-green" style={{ fontSize: '0.7rem' }}>
                ACTIVE QUEUE: 4 PENDING
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              One-screen consolidated multi-evidence summary allowing ophthalmologists to review, verify, or override AI in 30 seconds
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="var(--color-teal)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Review Latency:</span>
              <strong style={{ color: 'var(--color-navy)' }}>&lt; 45 sec</strong>
            </div>
          </div>
        </div>

        {/* Rapid Patient Queue Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {SAMPLE_PATIENTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setSelectedCaseIdx(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: selectedCaseIdx === idx ? '2px solid var(--color-teal)' : '1px solid var(--border-subtle)',
                background: selectedCaseIdx === idx ? 'rgba(13, 148, 136, 0.08)' : '#ffffff',
                color: selectedCaseIdx === idx ? 'var(--color-teal-dark)' : 'var(--color-navy)',
                fontWeight: selectedCaseIdx === idx ? '700' : '500',
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: selectedCaseIdx === idx ? '0 2px 8px rgba(13, 148, 136, 0.15)' : 'none'
              }}
            >
              <User size={14} />
              <span>{p.name} ({p.currentEye})</span>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: p.condition === 'moderate_dr' || p.condition === 'severe_dr' ? '#dc2626' : (p.condition === 'blurred' ? '#64748b' : '#16a34a') 
              }} />
            </button>
          ))}
        </div>
      </div>

      {/* Main 30-Second Triage Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(360px, 1fr)', gap: '1.25rem' }}>
        
        {/* Left: Retinal Multi-Channel Visualizer with Layer Toggles */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>
              Diagnostic Imaging: {activePatient.name} • {activePatient.currentEye}
            </span>
            
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {['original', 'gradcam', 'lesions', 'both'].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    border: activeLayer === layer ? '1px solid var(--color-teal)' : '1px solid var(--border-subtle)',
                    background: activeLayer === layer ? 'var(--color-navy)' : '#ffffff',
                    color: activeLayer === layer ? '#ffffff' : 'var(--color-navy)',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          <div className="fundus-viewport" style={{ maxHeight: '420px', position: 'relative' }}>
            <img 
              src={activePatient.imageFile || activePatient.image} 
              alt="Diagnostic Fundus" 
              style={{ filter: activePatient.condition === 'blurred' ? 'blur(3px) brightness(0.7)' : 'none' }}
            />
            {activeLayer === 'gradcam' && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 45% 55%, rgba(239, 68, 68, 0.5) 0%, rgba(245, 158, 11, 0.3) 35%, transparent 70%)',
                mixBlendMode: 'screen',
                pointerEvents: 'none'
              }} />
            )}
          </div>
        </div>

        {/* Right: AI Evidence Dossier & Decision Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>AI CLINICAL IMPRESSION</span>
                <h3 style={{ fontSize: '1.15rem', margin: '0.15rem 0', color: activePatient.condition === 'moderate_dr' || activePatient.condition === 'severe_dr' ? '#dc2626' : (activePatient.condition === 'blurred' ? '#64748b' : '#16a34a') }}>
                  {activePatient.condition === 'moderate_dr' ? 'Moderate NPDR (Referable)' : (activePatient.condition === 'severe_dr' ? 'Proliferative DR (High Risk)' : (activePatient.condition === 'blurred' ? 'Ungradable Photograph' : 'No Retinopathy Detected'))}
                </h3>
              </div>

              <span className={`status-badge ${activePatient.condition === 'moderate_dr' || activePatient.condition === 'severe_dr' ? 'badge-red' : (activePatient.condition === 'blurred' ? 'badge-grey' : 'badge-green')}`}>
                {activePatient.condition === 'moderate_dr' || activePatient.condition === 'severe_dr' ? 'STATE: RED' : (activePatient.condition === 'blurred' ? 'STATE: GREY' : 'STATE: GREEN')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confidence</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                  {activePatient.condition === 'blurred' ? '28%' : '92%'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Concordance</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: activePatient.condition === 'blurred' ? '#64748b' : '#16a34a' }}>
                  {activePatient.condition === 'blurred' ? 'LOW' : 'HIGH (91%)'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Quality Index</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: activePatient.condition === 'blurred' ? '#dc2626' : '#16a34a' }}>
                  {activePatient.condition === 'blurred' ? '34/100' : '88/100'}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {activePatient.condition === 'moderate_dr' 
                ? 'Strong agreement between ResNet-50 activation and segmented circinate hard exudates. Macular CSME risk elevated.'
                : (activePatient.condition === 'severe_dr'
                  ? 'Severe ischemia detected. Confluent blot hemorrhages and cotton wool spots confirmed across 4 quadrants.'
                  : (activePatient.condition === 'blurred'
                    ? 'Image Guardian blocked diagnostic prediction due to severe motion blur and underexposure. Safe abstention active.'
                    : 'Clear fundus without microaneurysms. Annual routine follow-up confirmed.'))}
            </p>
          </div>

          {/* Doctor Adjudication & 1-Click Actions */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Edit3 size={15} color="var(--accent-cyan)" /> Specialist Adjudication & Sign-Off
            </h4>

            {actionSuccess ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '8px', padding: '1rem', textAlign: 'center', color: '#6ee7b7' }}>
                <CheckCircle2 size={24} style={{ margin: '0 auto 0.5rem auto' }} />
                <strong>Decision Recorded: {actionSuccess.toUpperCase()}</strong>
                <p style={{ fontSize: '0.75rem', margin: '0.25rem 0 0 0', color: '#a7f3d0' }}>Advancing queue to next patient...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <button 
                    id="btn-doc-accept"
                    onClick={() => handleAction('Accepted & Signed Off')}
                    className="btn btn-success"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <CheckCircle2 size={16} /> Accept AI Assessment
                  </button>

                  <button 
                    id="btn-doc-override"
                    onClick={() => handleAction('Modified / Overridden')}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <Edit3 size={16} /> Override Grade
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button 
                    id="btn-doc-retake"
                    onClick={() => handleAction('Mandatory Retake Requested')}
                    className="btn btn-danger"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <RotateCcw size={16} /> Mandate Retake
                  </button>

                  <button 
                    id="btn-doc-refer"
                    onClick={() => handleAction('Priority Hospital Escalation')}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <ArrowRight size={16} /> Escalate to Hospital
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
