import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Command, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import { parseVoiceIntent, speakText, stopSpeaking, VOICE_COMMANDS } from '../../core/voiceAssistantEngine';

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  onExecuteAction,
  currentPatient,
  activeLanguage = 'en'
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAction, setLastAction] = useState(null);
  const [speechFeedback, setSpeechFeedback] = useState('Voice assistant ready. Tap the microphone or speak a command.');
  const [selectedLang, setSelectedLang] = useState(activeLanguage);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const animFrameRef = useRef(null);

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start recognition:', e);
      }
    } else {
      // Simulation mode
      setIsListening(true);
      setSpeechFeedback('Listening (Simulation mode). Speak or select a command below.');
    }
  };

  const handleProcessVoice = (text) => {
    const parsed = parseVoiceIntent(text);
    setLastAction(parsed);
    setSpeechFeedback(parsed.feedback);

    // Speak feedback back to user in chosen language
    speakText(parsed.feedback, selectedLang);

    // Execute application action
    if (onExecuteAction && parsed.action !== 'UNKNOWN_QUERY') {
      onExecuteAction(parsed.action, parsed);
    }
  };

  // Initialize Web Speech API Recognition
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN' };
      recognition.lang = langMap[selectedLang] || 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn('Voice recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const recognizedText = final || interim;
        setTranscript(recognizedText);

        if (final) {
          handleProcessVoice(final);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (err) {}
      }
      stopSpeaking();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, selectedLang]);

  // Waveform visualization animation
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      const numBars = 32;
      const barWidth = width / numBars;

      for (let i = 0; i < numBars; i++) {
        const amplitude = isListening 
          ? Math.sin(phase + i * 0.3) * 28 + Math.cos(phase * 0.7 + i * 0.2) * 18 + 20
          : Math.sin(phase + i * 0.15) * 6 + 10;

        const x = i * barWidth + barWidth * 0.2;
        const h = Math.max(4, Math.abs(amplitude));
        const y = centerY - h / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + h);
        if (isListening) {
          grad.addColorStop(0, '#38bdf8');
          grad.addColorStop(1, '#a855f7');
        } else {
          grad.addColorStop(0, '#475569');
          grad.addColorStop(1, '#1e293b');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth * 0.6, h, 4);
        ctx.fill();
      }

      phase += isListening ? 0.08 : 0.02;
      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isOpen, isListening]);

  if (!isOpen) return null;

  const handleManualCommand = (cmd) => {
    setTranscript(cmd.trigger);
    handleProcessVoice(cmd.trigger);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-card)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '720px',
        boxShadow: 'var(--shadow-modal)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          background: '#ffffff',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0d9488, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Mic size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                  Drishti Ambient Voice Assistant
                </h3>
                <span className="status-badge badge-teal" style={{ fontSize: '0.65rem' }}>
                  SPEECH-AI
                </span>
                <span className="status-badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  6 LANGUAGES
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Hands-free clinical navigation, triage execution & vernacular patient translation
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              color: 'var(--color-navy)',
              borderRadius: '8px',
              padding: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Central Audio Waveform & Mic Button */}
        <div style={{
          padding: '2rem 1.5rem',
          background: 'radial-gradient(circle at center, rgba(13, 148, 136, 0.08) 0%, #f8fafc 70%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Waveform Canvas */}
          <canvas 
            ref={canvasRef} 
            width={480} 
            height={80} 
            style={{ width: '100%', maxWidth: '480px', height: '80px', marginBottom: '1.25rem' }} 
          />

          {/* Glowing Mic Trigger */}
          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: isListening 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : 'linear-gradient(135deg, #0d9488, #0284c7)',
              border: isListening ? '4px solid rgba(239, 68, 68, 0.4)' : '4px solid rgba(13, 148, 136, 0.3)',
              boxShadow: isListening 
                ? '0 0 35px rgba(239, 68, 68, 0.5)' 
                : '0 4px 20px rgba(13, 148, 136, 0.4)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: isListening ? 'scale(1.08)' : 'scale(1)'
            }}
          >
            {isListening ? <Mic size={32} /> : <MicOff size={32} />}
          </button>

          <p style={{
            marginTop: '0.9rem',
            marginBottom: 0,
            fontSize: '0.85rem',
            color: isListening ? '#dc2626' : 'var(--text-secondary)',
            fontWeight: '600'
          }}>
            {isListening ? 'Listening for voice commands...' : 'Microphone paused • Click circle to activate'}
          </p>

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginTop: '1rem',
            background: '#ffffff',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px',
            border: '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Voice Language:</span>
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'mr', label: 'मराठी' },
              { code: 'bn', label: 'বাংলা' }
            ].map(l => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code)}
                style={{
                  background: selectedLang === l.code ? 'var(--color-teal)' : 'transparent',
                  color: selectedLang === l.code ? '#ffffff' : 'var(--color-navy)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Recognized Feedback Box */}
        <div style={{
          padding: '1rem 1.25rem',
          background: '#f8fafc',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <Sparkles size={18} color="var(--color-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', fontWeight: '600' }}>
                Recognized Voice Intent & Action:
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-navy)', fontWeight: '600' }}>
                {speechFeedback}
              </div>
              {transcript && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', marginTop: '0.3rem', fontWeight: '500' }}>
                  Transcript: "{transcript}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Voice Command Shortcuts Sheet */}
        <div style={{
          padding: '1rem 1.25rem',
          background: '#ffffff',
          maxHeight: '220px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
            <Command size={13} /> Quick Voice Command Shortcuts (Click to trigger):
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.5rem'
          }}>
            {VOICE_COMMANDS.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleManualCommand(cmd)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.65rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-teal)'; e.currentTarget.style.background = '#f0fdfa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-navy)', fontWeight: '600' }}>
                    "{cmd.trigger}"
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    {cmd.desc}
                  </div>
                </div>
                <Play size={12} color="var(--color-teal)" style={{ opacity: 0.8 }} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
