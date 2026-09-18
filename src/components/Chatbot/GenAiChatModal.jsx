import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Bot, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { generateChatbotResponse, CLINICAL_TOPIC_PRESETS } from '../../core/genAiChatbotEngine';
import { speakText, stopSpeaking } from '../../core/voiceAssistantEngine';

export default function GenAiChatModal({
  isOpen,
  onClose,
  patient,
  screeningResult,
  concordanceResult
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  // Initialize messages on patient change or modal open
  useEffect(() => {
    if (isOpen) {
      const initialResponse = generateChatbotResponse({
        userMessage: 'summary',
        patient,
        screeningResult,
        concordanceResult
      });

      setMessages([
        {
          sender: 'assistant',
          text: initialResponse.text,
          references: initialResponse.references,
          suggestions: initialResponse.suggestedNextQuestions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, patient?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsGenerating(true);

    setTimeout(() => {
      const botResponse = generateChatbotResponse({
        userMessage: query,
        patient,
        screeningResult,
        concordanceResult,
        chatHistory: messages
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: botResponse.text,
          references: botResponse.references,
          suggestions: botResponse.suggestedNextQuestions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsGenerating(false);
    }, 600);
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      // Clean markdown symbols for cleaner TTS audio
      const clean = text.replace(/[*#_`]/g, '').slice(0, 350);
      speakText(clean, 'en', () => setIsSpeaking(false), () => setIsSpeaking(false));
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
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
        maxWidth: '850px',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-modal)',
        overflow: 'hidden'
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
              background: 'linear-gradient(135deg, #0d9488, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: '700' }}>
                  Drishti Clinical AI Copilot
                </h3>
                <span className="status-badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  GROUNDED GENAI
                </span>
                <span className="status-badge badge-green" style={{ fontSize: '0.65rem' }}>
                  ICDR / NPCBVI
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Evidence-verified clinical reasoning for doctors & primary health workers
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
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Patient Telemetry Strip */}
        <div style={{
          padding: '0.65rem 1.25rem',
          background: '#f0f9ff',
          borderBottom: '1px solid #bae6fd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Context:</span>
            <strong style={{ color: 'var(--color-navy)' }}>{patient?.name}</strong>
            <span style={{ color: 'var(--text-secondary)' }}>• {patient?.age}y / {patient?.gender} • {patient?.village}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="status-badge badge-amber" style={{ fontSize: '0.7rem' }}>
              {screeningResult?.grade || 'Moderate NPDR'} ({screeningResult?.calibratedConfidence || 92}%)
            </span>
            <span className="status-badge badge-green" style={{ fontSize: '0.7rem' }}>
              Quality: {concordanceResult?.qualityScore || 88}/100
            </span>
            <span className="status-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              Foveal Dist: {concordanceResult?.foveaDistanceUm || 620} µm
            </span>
          </div>
        </div>

        {/* Chat Message History */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: '#f8fafc'
        }}>
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: msg.sender === 'user' ? 'var(--color-navy)' : 'var(--color-teal)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>

              {/* Message Content */}
              <div style={{
                maxWidth: '75%',
                background: msg.sender === 'user' ? 'rgba(13, 148, 136, 0.12)' : '#ffffff',
                border: msg.sender === 'user' ? '1px solid rgba(13, 148, 136, 0.3)' : '1px solid var(--border-card)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                color: 'var(--color-navy)',
                fontSize: '0.85rem',
                lineHeight: 1.55,
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Text render with basic markdown headings */}
                <div style={{ whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>

                {/* References */}
                {msg.references && msg.references.length > 0 && (
                  <div style={{
                    marginTop: '0.65rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong style={{ color: 'var(--color-navy)' }}>Clinical Citations:</strong> {msg.references.join(' • ')}
                  </div>
                )}

                {/* Action Buttons */}
                {msg.sender === 'assistant' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.65rem',
                    paddingTop: '0.4rem',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: isSpeaking ? 'var(--color-cyan)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px'
                      }}
                    >
                      {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      {isSpeaking ? 'Mute' : 'Read Aloud'}
                    </button>

                    <button
                      onClick={() => handleCopy(msg.text, idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedIdx === idx ? '#15803d' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.4rem',
                        borderRadius: '4px'
                      }}
                    >
                      {copiedIdx === idx ? <Check size={13} /> : <Copy size={13} />}
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </button>

                    <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                {/* Suggested Follow-up chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{
                    marginTop: '0.65rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.35rem'
                  }}>
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        style={{
                          background: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          color: 'var(--color-cyan)',
                          borderRadius: '6px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        ↳ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(13, 148, 136, 0.15)',
                color: 'var(--color-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={16} className="animate-spin" />
              </div>
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '0.6rem 0.9rem',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontStyle: 'italic'
              }}>
                Consulting ICDR & ETDRS clinical knowledge base...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Topic Presets */}
        <div style={{
          padding: '0.5rem 1.25rem',
          background: '#ffffff',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {CLINICAL_TOPIC_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSendMessage(preset.query)}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-card)',
                color: 'var(--color-navy)',
                borderRadius: '6px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: '500',
                cursor: 'pointer',
                flexShrink: 0
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-teal)'; e.currentTarget.style.borderColor = 'var(--color-teal)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-navy)'; e.currentTarget.style.borderColor = 'var(--border-card)'; }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '0.85rem 1.25rem',
          background: '#ffffff',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.65rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about lesions, CSME distance, treatments, or differential diagnosis..."
            style={{
              flex: 1,
              background: '#f8fafc',
              border: '1px solid var(--border-card)',
              borderRadius: '8px',
              padding: '0.65rem 0.9rem',
              color: 'var(--color-navy)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isGenerating}
            style={{
              background: 'var(--color-teal)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.65rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: inputValue.trim() && !isGenerating ? 'pointer' : 'not-allowed',
              opacity: inputValue.trim() && !isGenerating ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)'
            }}
          >
            <Send size={15} /> Send
          </button>
        </div>

      </div>
    </div>
  );
}
