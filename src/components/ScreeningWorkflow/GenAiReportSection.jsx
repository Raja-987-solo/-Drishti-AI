import React, { useState } from 'react';
import { Sparkles, Globe2, Volume2, FileText, UserCheck, ShieldCheck, Code, Check } from 'lucide-react';
import { generateControlledExplanation, SUPPORTED_LANGUAGES } from '../../core/genAiExplainer';

export default function GenAiReportSection({ 
  facts, 
  onOpenReferralModal,
  onOpenFhirModal 
}) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [audienceMode, setAudienceMode] = useState('patient'); // 'patient' | 'doctor'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const patientReport = generateControlledExplanation(facts, selectedLang, 'patient');
  const doctorReport = generateControlledExplanation(facts, 'en', 'doctor');

  const speakExplanation = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Attempt language mapping
    const langMap = { en: 'en-US', hi: 'hi-IN', bn: 'bn-IN', mr: 'mr-IN', ta: 'ta-IN', te: 'te-IN' };
    utterance.lang = langMap[selectedLang] || 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const copyStructuredJson = () => {
    navigator.clipboard.writeText(JSON.stringify(facts, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      
      {/* Header & Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(168, 85, 247, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c084fc'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>
                Controlled GenAI Clinical & Patient Explainer
              </h3>
              <span className="status-badge badge-grey" style={{ fontSize: '0.65rem' }}>
                ANTI-HALLUCINATION
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Structured ML JSON facts transformed into clinical briefings & vernacular patient counseling
            </p>
          </div>
        </div>

        {/* Audience & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '0.2rem', display: 'flex', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setAudienceMode('patient')}
              style={{
                background: audienceMode === 'patient' ? '#ffffff' : 'transparent',
                color: audienceMode === 'patient' ? 'var(--color-navy)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.775rem',
                fontWeight: '600',
                boxShadow: audienceMode === 'patient' ? '0 2px 4px rgba(15, 23, 42, 0.08)' : 'none',
                cursor: 'pointer'
              }}
            >
              Rural Patient View
            </button>
            <button
              onClick={() => setAudienceMode('doctor')}
              style={{
                background: audienceMode === 'doctor' ? '#ffffff' : 'transparent',
                color: audienceMode === 'doctor' ? 'var(--color-navy)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.775rem',
                fontWeight: '600',
                boxShadow: audienceMode === 'doctor' ? '0 2px 4px rgba(15, 23, 42, 0.08)' : 'none',
                cursor: 'pointer'
              }}
            >
              Doctor Clinical Briefing
            </button>
          </div>

          <button
            onClick={onOpenReferralModal}
            className="btn btn-primary"
            style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem' }}
          >
            <FileText size={14} /> Clinical Referral Letter
          </button>

          <button
            onClick={onOpenFhirModal}
            className="btn btn-secondary"
            style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem' }}
          >
            <Code size={14} /> ABDM FHIR JSON
          </button>
        </div>
      </div>

      {/* Audience Mode: Patient (Multilingual + Speech Synthesis) */}
      {audienceMode === 'patient' ? (
        <div style={{
          background: '#f8fafc',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          {/* Language Selection Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe2 size={16} color="var(--color-teal)" />
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Select Vernacular Language:
              </span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      border: selectedLang === lang.code ? '1px solid var(--color-teal)' : '1px solid var(--border-subtle)',
                      background: selectedLang === lang.code ? '#f0fdfa' : '#ffffff',
                      color: selectedLang === lang.code ? 'var(--color-teal-dark)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontWeight: selectedLang === lang.code ? '700' : '500'
                    }}
                  >
                    {lang.nativeName} ({lang.name})
                  </button>
                ))}
              </div>
            </div>

            {/* Read Aloud Audio Simulation */}
            <button
              id="btn-voice-read"
              onClick={() => speakExplanation(patientReport.explanation)}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '0.4rem' }}
            >
              <Volume2 size={15} color={isPlayingAudio ? '#dc2626' : 'var(--color-teal)'} />
              {isPlayingAudio ? 'Stop Speech' : 'Listen Aloud (Vernacular Voice)'}
            </button>
          </div>

          {/* Explanation Text Box */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--color-teal)',
            padding: '1rem',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'var(--color-navy)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {patientReport.explanation}
          </div>
        </div>
      ) : (
        /* Audience Mode: Doctor Technical Briefing */
        <div style={{
          background: '#f8fafc',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--color-teal)" /> Automated Clinical Impression
            </h4>
            <button
              onClick={copyStructuredJson}
              className="btn btn-secondary"
              style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem' }}
            >
              {copiedJson ? <Check size={13} color="#16a34a" /> : <Code size={13} />}
              {copiedJson ? 'Copied JSON!' : 'Copy Grounding Facts JSON'}
            </button>
          </div>

          <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--color-navy)', lineHeight: 1.55 }}>
            {doctorReport.summary}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div style={{ background: 'rgba(2, 6, 23, 0.3)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: '600' }}>PATHOLOGICAL TOPOGRAPHY</div>
              <div style={{ color: '#cbd5e1' }}>{doctorReport.pathology}</div>
            </div>
            <div style={{ background: 'rgba(2, 6, 23, 0.3)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: '600' }}>CLINICAL MANAGEMENT PATHWAY</div>
              <div style={{ color: '#93c5fd' }}>{doctorReport.recommendation}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
