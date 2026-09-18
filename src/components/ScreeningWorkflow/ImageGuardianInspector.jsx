import React from 'react';
import { ShieldCheck, AlertOctagon, HelpCircle, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';

export default function ImageGuardianInspector({ qualityResult, onTriggerRetake }) {
  const { overallQuality, status, statusBadge, metrics, issues, recommendation, gradable } = qualityResult;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: gradable ? 'rgba(21, 128, 61, 0.12)' : 'rgba(220, 38, 38, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: gradable ? 'var(--state-green)' : 'var(--state-red)'
          }}>
            {gradable ? <ShieldCheck size={20} /> : <AlertOctagon size={20} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--color-navy)', fontWeight: 600 }}>
              Engine 1: Image Guardian (AI Quality Gate)
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Laplacian focus variance • Histogram exposure • Circular FOV edge detection
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>QUALITY INDEX</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: gradable ? 'var(--state-green)' : 'var(--state-red)' }}>
              {overallQuality}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
          </div>
          <span className={`status-badge ${statusBadge}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
            {status}
          </span>
        </div>
      </div>

      {/* Metrics Progress Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Focus / Laplacian Sharpness</span>
            <span className="font-mono" style={{ fontWeight: 600, color: metrics.blur < 50 ? 'var(--state-red)' : 'var(--color-navy)' }}>{metrics.blur}%</span>
          </div>
          <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${metrics.blur}%`, height: '100%', background: metrics.blur < 50 ? 'var(--state-red)' : 'var(--state-green)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Illumination & Exposure</span>
            <span className="font-mono" style={{ fontWeight: 600, color: metrics.illumination < 50 ? 'var(--state-red)' : 'var(--color-navy)' }}>{metrics.illumination}%</span>
          </div>
          <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${metrics.illumination}%`, height: '100%', background: metrics.illumination < 50 ? 'var(--state-red)' : 'var(--state-green)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Retinal Area Coverage</span>
            <span className="font-mono" style={{ fontWeight: 600, color: metrics.retinalArea < 60 ? 'var(--state-red)' : 'var(--color-navy)' }}>{metrics.retinalArea}%</span>
          </div>
          <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${metrics.retinalArea}%`, height: '100%', background: metrics.retinalArea < 60 ? 'var(--state-red)' : 'var(--state-green)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Field of View (FOV) Centering</span>
            <span className="font-mono" style={{ fontWeight: 600, color: metrics.fov < 60 ? 'var(--state-red)' : 'var(--color-navy)' }}>{metrics.fov}%</span>
          </div>
          <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${metrics.fov}%`, height: '100%', background: metrics.fov < 60 ? 'var(--state-red)' : 'var(--state-green)', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* "Why Did AI Reject This Image?" Guidance Banner */}
      {!gradable ? (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c', fontWeight: '700', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <AlertOctagon size={16} /> Why did AI reject this image?
            </div>
            <p style={{ margin: 0, fontSize: '0.825rem', color: '#7f1d1d' }}>
              {issues.map(i => i.name).join(' • ') || 'Image fails minimum clinical resolution criteria.'}
            </p>
            <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: '#9a3412', fontWeight: '600' }}>
              {recommendation}
            </div>
          </div>

          <button 
            id="btn-smart-retake"
            className="btn btn-danger"
            onClick={onTriggerRetake}
            style={{ fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} /> Guide Retake Now
          </button>
        </div>
      ) : (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.825rem',
          color: '#166534'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} color="var(--state-green)" /> Image quality exceeds threshold (Score ≥ 65). Safe to proceed with deep multi-evidence inference.
          </span>
          <span style={{ fontWeight: '600', color: 'var(--state-green)' }}>Gate Status: PASSED</span>
        </div>
      )}
    </div>
  );
}
