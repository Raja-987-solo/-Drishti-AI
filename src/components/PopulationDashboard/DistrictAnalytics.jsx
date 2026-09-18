import React, { useState } from 'react';
import { Layers, MapPin, AlertTriangle, Users, CheckCircle, BarChart3, TrendingUp, Hospital } from 'lucide-react';
import { DISTRICT_METRICS } from '../../data/districtData';

export default function DistrictAnalytics() {
  const [filterAlertsOnly, setFilterAlertsOnly] = useState(false);

  const displayedFacilities = filterAlertsOnly
    ? DISTRICT_METRICS.phcFacilities.filter(f => f.status === 'RETAKE_ALERT')
    : DISTRICT_METRICS.phcFacilities;

  return (
    <div className="animate-fade-in">
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                District Health Officer (DHO) Population Dashboard
              </h2>
              <span className="status-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                NANDED DISTRICT • MAHARASHTRA
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Real-time epidemiological monitoring, equipment quality auditing, and referral bottleneck triage across 14 rural PHCs
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
              className={`btn ${filterAlertsOnly ? 'btn-danger' : 'btn-secondary'}`}
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
            >
              {filterAlertsOnly ? 'Showing Retake Alerts' : 'Filter High-Retake PHCs'}
            </button>
          </div>
        </div>
      </div>

      {/* Top Level Population Health KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        
        <div className="metric-box">
          <span className="metric-label">Total Screened</span>
          <span className="metric-value font-mono" style={{ color: '#38bdf8' }}>
            {DISTRICT_METRICS.totalScreened.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Target: {DISTRICT_METRICS.targetDiabeticCohort.toLocaleString()} cohort
          </span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Gradable Images</span>
          <span className="metric-value font-mono" style={{ color: '#34d399' }}>
            {DISTRICT_METRICS.gradablePercentage}%
          </span>
          <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>
            Guardian Gate Quality Pass
          </span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Retake Rate</span>
          <span className="metric-value font-mono" style={{ color: '#fbbf24' }}>
            {DISTRICT_METRICS.retakePercentage}%
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Guided locally at PHC
          </span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Referable DR Detected</span>
          <span className="metric-value font-mono" style={{ color: '#f87171' }}>
            {DISTRICT_METRICS.referablePercentage}%
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            1,536 patients fast-tracked
          </span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Pending Doctor Triage</span>
          <span className="metric-value font-mono" style={{ color: '#e0f2fe' }}>
            {DISTRICT_METRICS.pendingDoctorReview}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            4 doctors on rotation
          </span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Referral Completion</span>
          <span className="metric-value font-mono" style={{ color: '#a7f3d0' }}>
            {DISTRICT_METRICS.referralsCompleted}%
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Closed-loop hospital arrival
          </span>
        </div>

      </div>

      {/* Main Analytics Grid: PHC Facility Table & Severity Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
        
        {/* PHC Performance & Retake Audit Table */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Hospital size={16} color="var(--accent-cyan)" /> PHC Network Facility Performance
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              10 Facilities Active
            </span>
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-card)', color: 'var(--color-navy)', background: '#f1f5f9' }}>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: '700' }}>PHC Name</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: '700' }}>Screened</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: '700' }}>Gradable %</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: '700' }}>Retake %</th>
                  <th style={{ padding: '0.65rem 0.5rem', fontWeight: '700' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedFacilities.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                      {f.name}
                    </td>
                    <td className="font-mono" style={{ padding: '0.65rem 0.5rem', color: 'var(--color-navy)' }}>
                      {f.screened.toLocaleString()}
                    </td>
                    <td className="font-mono" style={{ padding: '0.65rem 0.5rem', color: f.gradablePct > 90 ? '#15803d' : '#d97706', fontWeight: '600' }}>
                      {f.gradablePct}%
                    </td>
                    <td className="font-mono" style={{ padding: '0.65rem 0.5rem', color: f.retakePct > 10 ? '#dc2626' : '#15803d', fontWeight: '600' }}>
                      {f.retakePct}%
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>
                      <span className={`status-badge ${f.status === 'OPTIMAL' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                        {f.status === 'OPTIMAL' ? 'OPTIMAL' : 'HIGH RETAKE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Tip: Mudkhed and Kinwat centers flagged for field-worker camera technique retraining.
          </div>
        </div>

        {/* Severity Distribution & Epidemiological Breakdown */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-navy)', fontWeight: '700' }}>
            <BarChart3 size={16} color="var(--color-teal)" /> Epidemiological ICDR Staging
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {DISTRICT_METRICS.severityDistribution.map(item => (
              <div key={item.grade}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{item.grade}</span>
                  <span className="font-mono" style={{ color: 'var(--color-navy)', fontWeight: '700' }}>
                    {item.count.toLocaleString()} ({item.pct}%)
                  </span>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: item.color }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <strong>Public Health Summary:</strong> 76.5% of diabetic individuals screened in Nanded District have zero retinopathy and were cleared without overburdening district hospitals. Only 6.3% required tele-ophthalmology hospital escalation.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
