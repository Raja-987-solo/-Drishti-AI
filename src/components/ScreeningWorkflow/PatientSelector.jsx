import React from 'react';
import { User, Activity, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SAMPLE_PATIENTS } from '../../data/samplePatients';

export default function PatientSelector({ selectedPatient, onSelectPatient, onUploadCustomImage }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--accent-cyan)" /> Select Patient Cohort / Active Case
          </h3>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
            Choose a clinical scenario to test quality rejection, evidence concordance, or referable disease
          </p>
        </div>
        
        {/* Custom Image Upload Option */}
        <label className="btn btn-secondary" style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem', cursor: 'pointer' }}>
          📤 Upload Custom Fundus Image
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                onUploadCustomImage(url, e.target.files[0].name);
              }
            }}
          />
        </label>
      </div>

      {/* Grid of Preloaded Cases */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
        {SAMPLE_PATIENTS.map((p) => {
          const isSelected = selectedPatient.id === p.id;
          let conditionBadge = 'badge-green';
          let conditionLabel = 'Normal Retina';

          if (p.condition === 'moderate_dr') {
            conditionBadge = 'badge-red';
            conditionLabel = 'Moderate NPDR (Exudates + Hemorrhages)';
          } else if (p.condition === 'severe_dr') {
            conditionBadge = 'badge-red';
            conditionLabel = 'Severe PDR (Soft Exudates + NVD)';
          } else if (p.condition === 'blurred') {
            conditionBadge = 'badge-grey';
            conditionLabel = 'Ungradable (Motion Blur / Dark)';
          }

          return (
            <div 
              key={p.id}
              onClick={() => onSelectPatient(p)}
              className={`glass-card-interactive ${isSelected ? 'selected-patient-card' : ''}`}
              style={{
                background: isSelected ? 'rgba(13, 148, 136, 0.08)' : '#ffffff',
                border: isSelected ? '2px solid var(--color-teal)' : '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '0.85rem',
                boxShadow: isSelected ? '0 4px 14px rgba(13, 148, 136, 0.15)' : 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.925rem', margin: 0, color: isSelected ? 'var(--color-teal-dark)' : 'var(--color-navy)' }}>
                    {p.name}
                  </h4>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {p.gender}, {p.age} yrs • {p.village}, {p.district}
                  </span>
                </div>
                <span className={`status-badge ${conditionBadge}`} style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem' }}>
                  {p.condition === 'blurred' ? 'UNGRADABLE TEST' : p.condition.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>HbA1c: <strong style={{ color: p.hba1c > 8 ? '#dc2626' : '#16a34a' }}>{p.hba1c}%</strong></span>
                <span>Duration: <strong>{p.diabetesDurationYears} yrs</strong></span>
                <span>Eye: <strong>{p.currentEye}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
