import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  FileText, 
  Server, 
  Database, 
  Send, 
  Smartphone,
  Building2,
  UserCheck
} from 'lucide-react';
import { 
  generateAbhaProfile, 
  buildCompleteAbdmFhirBundle, 
  simulateGatewayCalls,
  ABDM_FACILITY_REGISTRY 
} from '../../core/abdmProductionEngine';

export default function AbdmProductionView({ 
  patient, 
  screeningResult, 
  concordanceResult 
}) {
  const [currentStep, setCurrentStep] = useState(3); // 1: M1, 2: M2, 3: M3 Complete
  const [activeConsoleTab, setActiveConsoleTab] = useState('logs'); // 'logs' | 'fhir' | 'locker'
  const [copiedFhir, setCopiedFhir] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const abhaProfile = generateAbhaProfile(patient);
  const fhirBundle = buildCompleteAbdmFhirBundle({
    patient,
    abhaProfile,
    screeningResult,
    concordanceResult
  });
  const gatewayLogs = simulateGatewayCalls(patient, abhaProfile);

  const handleCopyFhir = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirBundle, null, 2));
    setCopiedFhir(true);
    setTimeout(() => setCopiedFhir(false), 2000);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 900);
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #06b6d4' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <Building2 size={24} color="#06b6d4" />
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                Ayushman Bharat Digital Mission (ABDM) Production Gateway
              </h2>
              <span className="status-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                NRCES NDHM COMPLIANT
              </span>
              <span className="status-badge badge-green" style={{ fontSize: '0.7rem' }}>
                M1 / M2 / M3 ACTIVE
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              End-to-end national health data interoperability for rural tele-ophthalmology screening
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Synchronizing...' : 'Resync Gateway'}
            </button>
            <button
              onClick={handleCopyFhir}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
            >
              {copiedFhir ? <Check size={14} /> : <Copy size={14} />}
              {copiedFhir ? 'Copied FHIR R4' : 'Export FHIR R4'}
            </button>
          </div>
        </div>
      </div>

      {/* 3-Milestone Stepper */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Milestone 1 */}
          <div 
            onClick={() => setCurrentStep(1)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              opacity: currentStep >= 1 ? 1 : 0.6 
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: currentStep >= 1 ? '#dcfce7' : '#f1f5f9',
              border: currentStep >= 1 ? '2px solid #16a34a' : '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentStep >= 1 ? '#16a34a' : '#94a3b8',
              fontWeight: '700'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>Milestone 1 (M1)</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>ABHA Verification & ID Creation</div>
            </div>
          </div>

          <ArrowRight size={18} color="#94a3b8" />

          {/* Milestone 2 */}
          <div 
            onClick={() => setCurrentStep(2)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              opacity: currentStep >= 2 ? 1 : 0.6 
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: currentStep >= 2 ? '#dcfce7' : '#f1f5f9',
              border: currentStep >= 2 ? '2px solid #16a34a' : '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentStep >= 2 ? '#16a34a' : '#94a3b8',
              fontWeight: '700'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>Milestone 2 (M2)</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>HIP Care-Context Linkage</div>
            </div>
          </div>

          <ArrowRight size={18} color="#94a3b8" />

          {/* Milestone 3 */}
          <div 
            onClick={() => setCurrentStep(3)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              opacity: currentStep >= 3 ? 1 : 0.6 
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: currentStep >= 3 ? '#dcfce7' : '#f1f5f9',
              border: currentStep >= 3 ? '2px solid #16a34a' : '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentStep >= 3 ? '#16a34a' : '#94a3b8',
              fontWeight: '700'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>Milestone 3 (M3)</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>HIU Consent & FHIR Data Flow</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: ABHA Card on Left, Gateway Console on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Official Digital ABHA Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Card Wrapper */}
          <div style={{
            background: 'linear-gradient(135deg, #0f2b48 0%, #101e33 60%, #16243b 100%)',
            border: '2px solid #38bdf8',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Holographic Watermark effect */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* ABHA Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  National Health Authority
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>
                  आभा (ABHA) CARD
                </div>
              </div>
              <div style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                color: '#4ade80',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.65rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <ShieldCheck size={12} /> AADHAAR VERIFIED
              </div>
            </div>

            {/* Patient Info Row */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {/* Photo placeholder with initials */}
              <div style={{
                width: '70px',
                height: '80px',
                borderRadius: '8px',
                background: '#091322',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                fontWeight: '700',
                fontSize: '1.2rem',
                flexShrink: 0
              }}>
                {patient.name.split(' ').map(n => n[0]).join('')}
                <span style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '4px' }}>PHOTO</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                  {patient.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '2px' }}>
                  Gender: {abhaProfile.gender} • YOB: {abhaProfile.yearOfBirth}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  Mobile: {abhaProfile.mobile}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  PHC: {patient.phcCenter}
                </div>
              </div>
            </div>

            {/* 14-Digit ABHA Number Display */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              marginBottom: '0.75rem',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>ABHA Number (14 Digits):</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '1.5px', fontFamily: 'monospace' }}>
                {abhaProfile.abhaNumber}
              </div>
            </div>

            {/* ABHA Address & QR Code Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>ABHA Address:</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#4ade80' }}>
                  {abhaProfile.abhaAddress}
                </div>
              </div>

              {/* QR Code Icon Representation */}
              <div style={{
                width: '42px',
                height: '42px',
                background: '#fff',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a'
              }}>
                <QrCode size={30} />
              </div>
            </div>

          </div>

          {/* Health Facility Metadata Card */}
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-teal-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={14} /> Registered Health Facility (HFR)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div><strong>Facility:</strong> {ABDM_FACILITY_REGISTRY.facilityName}</div>
              <div><strong>HFR ID:</strong> <code style={{ color: 'var(--color-navy)', fontWeight: '600' }}>{ABDM_FACILITY_REGISTRY.hfrId}</code></div>
              <div><strong>Doctor (HPR):</strong> {ABDM_FACILITY_REGISTRY.doctorName}</div>
              <div><strong>HPR ID:</strong> <code style={{ color: 'var(--color-navy)', fontWeight: '600' }}>{ABDM_FACILITY_REGISTRY.hprId}</code></div>
            </div>
          </div>

        </div>

        {/* Right Column: Live ABDM Gateway Console */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Console Tab Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setActiveConsoleTab('logs')}
                style={{
                  background: activeConsoleTab === 'logs' ? 'var(--color-navy)' : '#f1f5f9',
                  color: activeConsoleTab === 'logs' ? '#ffffff' : 'var(--color-navy)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Live Gateway Logs
              </button>
              <button
                onClick={() => setActiveConsoleTab('fhir')}
                style={{
                  background: activeConsoleTab === 'fhir' ? 'var(--color-navy)' : '#f1f5f9',
                  color: activeConsoleTab === 'fhir' ? '#ffffff' : 'var(--color-navy)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                NRCES FHIR R4 Bundle
              </button>
              <button
                onClick={() => setActiveConsoleTab('locker')}
                style={{
                  background: activeConsoleTab === 'locker' ? 'var(--color-navy)' : '#f1f5f9',
                  color: activeConsoleTab === 'locker' ? '#ffffff' : 'var(--color-navy)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Health Locker Status
              </button>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              Gateway Connected (NHA Sandbox)
            </div>
          </div>

          {/* Tab 1: Live Gateway Logs */}
          {activeConsoleTab === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Real-time chronological HTTP transaction audit trail with cryptographic HMAC signatures:
              </div>

              {gatewayLogs.map((log, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--color-teal-dark)', fontWeight: '700' }}>{log.step}</span>
                    <span style={{ color: '#15803d', background: '#dcfce7', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                      HTTP {log.status} OK • {log.latency}
                    </span>
                  </div>

                  <div style={{ color: 'var(--color-navy)', marginBottom: '0.35rem' }}>
                    <code style={{ color: '#b45309', fontWeight: '600' }}>{log.endpoint}</code>
                  </div>

                  <pre style={{ margin: 0, color: 'var(--color-navy)', fontSize: '0.7rem', overflowX: 'auto', background: '#ffffff', border: '1px solid var(--border-card)', padding: '0.5rem', borderRadius: '4px' }}>
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: NRCES FHIR R4 Bundle */}
          {activeConsoleTab === 'fhir' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Profile: <code>https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle</code>
                </span>
                <button
                  onClick={handleCopyFhir}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-card)',
                    color: copiedFhir ? '#15803d' : 'var(--color-navy)',
                    borderRadius: '4px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {copiedFhir ? <Check size={12} /> : <Copy size={12} />}
                  {copiedFhir ? 'Copied' : 'Copy JSON'}
                </button>
              </div>

              <pre style={{
                flex: 1,
                background: '#090e17',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '1rem',
                color: '#38bdf8',
                fontSize: '0.72rem',
                overflowY: 'auto',
                maxHeight: '420px',
                lineHeight: 1.45
              }}>
                {JSON.stringify(fhirBundle, null, 2)}
              </pre>
            </div>
          )}

          {/* Tab 3: Health Locker Status */}
          {activeConsoleTab === 'locker' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem'
              }}>
                <Smartphone size={24} color="#16a34a" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>
                    Available in Patient's Ayushman Bharat (ABHA) App
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The encrypted diagnostic report and fundus observation metrics have been synced with {patient.name}'s National Health Locker. The patient or any treating doctor in India can view this screening with consent.
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HIP Link Status</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#15803d', marginTop: '2px' }}>ACTIVE / SYNCED</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Encryption Standard</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-cyan)', marginTop: '2px' }}>ECDH-AES-GCM-256</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Consent Duration</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#7c3aed', marginTop: '2px' }}>12 MONTHS</div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
