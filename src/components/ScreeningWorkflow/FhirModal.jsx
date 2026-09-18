import React, { useState } from 'react';
import { X, Code, Check, Copy, ShieldCheck } from 'lucide-react';
import { buildFHIRDiagnosticReport } from '../../data/fhirSchemas';

export default function FhirModal({ isOpen, onClose, patient, screeningResult, concordanceResult }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const fhirPayload = buildFHIRDiagnosticReport({
    patient,
    screeningResult,
    concordanceResult
  });

  const jsonString = JSON.stringify(fhirPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '820px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={20} color="var(--color-teal)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-navy)', fontWeight: 600 }}>
              Ayushman Bharat Digital Mission (ABDM) • FHIR R4 Resource
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Standardized DiagnosticReport resource compliant with NRCES NDHM guidelines for interoperable health data exchange across Indian registries.
        </p>

        {/* Code Viewport */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '1rem',
          maxHeight: '440px',
          overflowY: 'auto'
        }}>
          <pre className="font-mono" style={{ fontSize: '0.775rem', color: '#38bdf8', margin: 0 }}>
            {jsonString}
          </pre>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 600 }}>
            <ShieldCheck size={16} /> NRCES Schema: DiagnosticReportRecord v1.0
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleCopy}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              {copied ? 'Copied to Clipboard!' : 'Copy FHIR JSON'}
            </button>
            <button 
              onClick={onClose}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem' }}
            >
              Close Inspector
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
