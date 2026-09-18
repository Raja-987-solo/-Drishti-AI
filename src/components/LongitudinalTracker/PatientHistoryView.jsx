import React, { useState } from 'react';
import { TrendingUp, Calendar, AlertTriangle, Eye, ArrowRight, CheckCircle2, History } from 'lucide-react';
import { SAMPLE_PATIENTS } from '../../data/samplePatients';

export default function PatientHistoryView() {
  const [selectedPatientId, setSelectedPatientId] = useState('P-10482'); // Ramesh Patil default
  const patient = SAMPLE_PATIENTS.find(p => p.id === selectedPatientId) || SAMPLE_PATIENTS[0];

  return (
    <div className="animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                Longitudinal Retinal Progression Timeline
              </h2>
              <span className="status-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                CHRONIC CARE TRACKING
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Multi-year surveillance comparing retinal vascular changes over time (labeled as screening trend, not definitive prognosis)
            </p>
          </div>

          {/* Patient Selector */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {SAMPLE_PATIENTS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`btn ${selectedPatientId === p.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>{patient.name}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              ABHA: <span className="font-mono">{patient.abhaId}</span> • {patient.age} yrs • {patient.village}, {patient.district}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Diabetes Duration:</span>{' '}
              <strong>{patient.diabetesDurationYears} years</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Latest HbA1c:</span>{' '}
              <strong style={{ color: patient.hba1c > 8 ? '#f87171' : '#34d399' }}>{patient.hba1c}%</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Blood Pressure:</span>{' '}
              <strong>{patient.bp}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Longitudinal Timeline Visualizer */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} color="var(--accent-cyan)" /> Annual Screening History & Pathology Trend
        </h3>

        {patient.history && patient.history.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${patient.history.length}, 1fr)`, gap: '1.25rem', position: 'relative' }}>
            {patient.history.map((record, index) => {
              let badgeColor = 'badge-green';
              if (record.status === 'AMBER') badgeColor = 'badge-amber';
              if (record.status === 'RED') badgeColor = 'badge-red';

              return (
                <div 
                  key={index}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-card)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    position: 'relative',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      <Calendar size={16} color="var(--color-teal)" /> {record.year}
                    </div>
                    <span className={`status-badge ${badgeColor}`} style={{ fontSize: '0.675rem' }}>
                      {record.grade}
                    </span>
                  </div>

                  {/* Visual Progress Thumbnail simulation */}
                  <div style={{ 
                    height: '140px', 
                    borderRadius: '8px', 
                    background: '#090e17', 
                    overflow: 'hidden', 
                    marginBottom: '0.75rem',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-card)'
                  }}>
                    <img 
                      src={record.level === 0 ? '/images/normal.jpg' : (record.level === 1 ? '/images/normal.jpg' : (record.level === 2 ? '/images/moderate_dr.jpg' : '/images/severe_dr.jpg'))} 
                      alt="Historical Fundus"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(15, 23, 42, 0.85)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.675rem', color: '#ffffff' }}>
                      {record.clinic}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Microaneurysms:</span>{' '}
                      <strong className="font-mono" style={{ color: record.microaneurysms > 10 ? '#dc2626' : 'var(--color-navy)' }}>
                        {record.microaneurysms} detected
                      </strong>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.3 }}>
                      <em>"{record.notes}"</em>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            No prior historical screenings recorded for this patient. Baseline session active today.
          </div>
        )}

        {/* Disclaimer Note */}
        <div style={{ marginTop: '1.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.775rem', color: '#92400e', lineHeight: 1.4 }}>
          <strong>Clinical Regulatory Notice:</strong> The Retinal Progression Timeline represents an empirical retrospective screening trend based on historical fundus acquisitions and must not be interpreted as an automated predictive or prognostic medical judgment.
        </div>
      </div>

    </div>
  );
}
