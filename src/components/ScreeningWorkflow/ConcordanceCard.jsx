import React from 'react';
import { 
  GitMerge, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  ZapOff, 
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

export default function ConcordanceCard({ 
  concordanceResult, 
  classifierResult, 
  simulateConflict, 
  onToggleSimulateConflict 
}) {
  const { 
    concordanceScore, 
    concordanceStatus, 
    safeDecision, 
    disagreementReasons, 
    metricsBreakdown 
  } = concordanceResult;

  const isConflict = concordanceStatus === 'CONFLICT';
  const isAbstain = safeDecision.state === 'GREY';

  return (
    <div className="glass-panel" style={{ 
      padding: '1.25rem', 
      marginBottom: '1.25rem',
      border: isConflict ? '1px solid rgba(239, 68, 68, 0.5)' : (safeDecision.state === 'RED' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-card)'),
      boxShadow: isConflict ? '0 0 25px rgba(239, 68, 68, 0.15)' : 'var(--shadow-card)'
    }}>
      
      {/* Top Banner & Differentiator Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: isAbstain ? 'rgba(100, 116, 139, 0.2)' : (isConflict ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isAbstain ? '#94a3b8' : (isConflict ? '#f87171' : '#34d399')
          }}>
            <GitMerge size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', margin: 0 }}>
                Flagship Differentiator: Evidence Concordance Engine
              </h3>
              <span className="status-badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                PATENTABLE ARCHITECTURE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Independent cross-verification prevents false-positive hallucinations & dangerous predictions
            </p>
          </div>
        </div>

        {/* Live Demo Toggle for Evidence Conflict */}
        <button 
          id="btn-toggle-conflict"
          onClick={onToggleSimulateConflict}
          className={`btn ${simulateConflict ? 'btn-danger' : 'btn-secondary'}`}
          style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem' }}
          title="Simulate a scenario where neural classifier outputs 94% confidence but lesion detector & Grad-CAM disagree"
        >
          {simulateConflict ? <ZapOff size={14} /> : <AlertTriangle size={14} />}
          {simulateConflict ? 'Active: Conflict Mode' : 'Test AI Conflict Demo'}
        </button>
      </div>

      {/* 4-State Safe Decision Banner */}
      <div style={{
        background: safeDecision.state === 'GREEN' 
          ? '#f0fdf4' 
          : (safeDecision.state === 'AMBER'
            ? '#fffbeb'
            : (safeDecision.state === 'RED'
              ? '#fef2f2'
              : '#f8fafc')),
        border: `1px solid ${safeDecision.state === 'GREEN' 
          ? '#bbf7d0' 
          : (safeDecision.state === 'AMBER'
            ? '#fde68a'
            : (safeDecision.state === 'RED'
              ? '#fecaca'
              : '#e2e8f0'))}`,
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ flex: '1 1 340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className={`status-badge ${safeDecision.badge}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                STATE: {safeDecision.state}
              </span>
              <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--color-navy)', fontWeight: 700 }}>
                {safeDecision.title}
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {safeDecision.summary}
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
              <strong style={{ color: 'var(--color-navy)' }}>Clinical Pathway:</strong> {safeDecision.actionPrompt}
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '130px' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>CONCORDANCE INDEX</div>
            <div className="font-mono" style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              color: isConflict ? 'var(--state-red)' : (concordanceScore >= 80 ? 'var(--state-green)' : 'var(--state-amber)') 
            }}>
              {concordanceScore}%
            </div>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', color: isConflict ? 'var(--state-red)' : (concordanceScore >= 80 ? 'var(--state-green)' : 'var(--state-amber)') }}>
              {concordanceStatus} ALIGNMENT
            </span>
          </div>
        </div>

        {/* Discrepancy Alert Box if Conflict */}
        {disagreementReasons && disagreementReasons.length > 0 && (
          <div style={{
            marginTop: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: '#991b1b'
          }}>
            <div style={{ fontWeight: '700', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertTriangle size={15} color="#dc2626" /> Discrepancies Identified Across Evidence Channels:
            </div>
            <ul style={{ margin: '0 0 0 1.25rem', padding: 0 }}>
              {disagreementReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4-Channel Concordance Correlation Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {metricsBreakdown.map((item, idx) => (
          <div key={idx} style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.65rem 0.85rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: '600' }}>{item.name}</span>
              <span>Weight {item.weight}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span className="font-mono" style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700',
                color: item.score < 50 ? '#dc2626' : 'var(--color-navy)'
              }}>
                {item.score}%
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: '600', color: item.score < 50 ? '#dc2626' : '#16a34a' }}>
                {item.score < 50 ? 'Conflict' : 'Concordant'}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
