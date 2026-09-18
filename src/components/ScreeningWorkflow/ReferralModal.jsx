import React from 'react';
import { X, QrCode, Printer, CheckCircle, Hospital, ShieldAlert, ArrowRight, Download } from 'lucide-react';

export default function ReferralModal({ isOpen, onClose, patient, screeningResult, concordanceResult }) {
  if (!isOpen) return null;

  const referralId = `REF-${patient.district.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-6)}`;
  const priority = screeningResult?.level >= 3 ? 'EMERGENCY / FAST-TRACK' : 'PRIORITY (WITHIN 2 WEEKS)';
  const hospital = `${patient.district} District Civil & Eye Hospital`;

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '680px' }}>
        
        {/* Modal Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hospital size={22} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Closed-Loop Tele-Ophthalmology Referral</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Referral Letter Area */}
        <div id="printable-referral" style={{
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          fontFamily: 'var(--font-body)'
        }}>
          {/* Letter Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#0f172a', fontWeight: '800' }}>
                DRISHTI AI TELE-RETINAL SCREENING NETWORK
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '500' }}>
                National Programme for Control of Blindness & Visual Impairment (NPCBVI) • ABDM Enabled
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                background: screeningResult?.level >= 3 ? '#fee2e2' : '#fef3c7',
                color: screeningResult?.level >= 3 ? '#dc2626' : '#b45309',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                {priority}
              </span>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                ID: {referralId}
              </div>
            </div>
          </div>

          {/* Patient Demographics Box */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.825rem' }}>
            <div><strong>Patient Name:</strong> {patient.name}</div>
            <div><strong>ABHA ID:</strong> {patient.abhaId}</div>
            <div><strong>Age / Gender:</strong> {patient.age} yrs / {patient.gender}</div>
            <div><strong>Diabetes Duration:</strong> {patient.diabetesDurationYears} years (HbA1c: {patient.hba1c}%)</div>
            <div><strong>Referring PHC:</strong> {patient.phcCenter}</div>
            <div><strong>District / State:</strong> {patient.district}, {patient.state}</div>
          </div>

          {/* Clinical Findings */}
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
            <h4 style={{ margin: '0 0 0.35rem 0', color: '#0f172a', fontSize: '0.9rem' }}>Screening Diagnostic Impression:</h4>
            <div style={{ background: '#f1f5f9', padding: '0.65rem', borderRadius: '6px', borderLeft: '4px solid #06b6d4' }}>
              <div><strong>Primary Finding:</strong> {screeningResult?.grade} (ICDR Scale Level {screeningResult?.level})</div>
              <div><strong>Calibrated Confidence:</strong> {screeningResult?.calibratedConfidence}% • <strong>Concordance:</strong> {concordanceResult?.concordanceStatus} ({concordanceResult?.concordanceScore}/100)</div>
              <div><strong>Validated Lesions:</strong> Microaneurysms, Hemorrhages, Hard Exudate clusters (CSME Risk: HIGH)</div>
            </div>
          </div>

          {/* Destination & Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '600' }}>REFERRED TO SPECIALIST HOSPITAL:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#14532d' }}>{hospital}</div>
              <div style={{ fontSize: '0.75rem', color: '#15803d' }}>Department of Ophthalmology & Vitreoretinal Care</div>
            </div>
            
            {/* Mock QR Code for Specialist Fast-Track Scan */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                border: '2px solid #0f172a',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff'
              }}>
                <QrCode size={48} color="#0f172a" />
              </div>
              <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: '600' }}>ABDM TOKEN</span>
            </div>
          </div>

          {/* Signoff */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
            <span>Auto-generated by Drishti AI Edge Tele-Portal</span>
            <span>Attending Tele-Ophthalmologist: Dr. Arvind Kulkarni, MS (Ophth)</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button 
            onClick={() => window.print()}
            className="btn btn-secondary"
          >
            <Printer size={16} /> Print Referral Letter
          </button>
          <button 
            onClick={onClose}
            className="btn btn-primary"
          >
            <CheckCircle size={16} /> Confirm & Dispatch Case
          </button>
        </div>

      </div>
    </div>
  );
}
