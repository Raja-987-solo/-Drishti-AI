import React from 'react';
import { 
  Eye, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Sliders, 
  FileText, 
  Layers, 
  Wifi, 
  WifiOff, 
  Volume2, 
  Sparkles,
  Presentation,
  BarChart2,
  Mic,
  Bot,
  Building2,
  HeartHandshake
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  networkStatus, 
  setNetworkStatus, 
  pendingSyncCount,
  onStartDemoTour,
  onOpenPitchDeck,
  onOpenVoiceAssistant,
  onOpenChatbot
}) {
  return (
    <header className="app-header">
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0f172a 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)'
          }}>
            <Eye size={24} color="#ffffff" strokeWidth={2.3} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0, color: 'var(--color-navy)' }}>
                Drishti <span style={{ color: 'var(--color-teal)' }}>AI</span>
              </h1>
              <span className="status-badge badge-teal" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                SIH EDITION
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
              Evidence-Concordant Rural Retinal Tele-Screening
            </p>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', padding: '0.25rem 0' }}>
          <button 
            id="nav-screening"
            className={`nav-pill ${activeTab === 'screening' ? 'active' : ''}`}
            onClick={() => setActiveTab('screening')}
          >
            <Activity size={16} /> Screening
          </button>

          <button 
            id="nav-doctor"
            className={`nav-pill ${activeTab === 'doctor' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctor')}
          >
            <ShieldCheck size={16} /> Doctor 30s View
          </button>

          <button 
            id="nav-stresstest"
            className={`nav-pill ${activeTab === 'stresstest' ? 'active' : ''}`}
            onClick={() => setActiveTab('stresstest')}
          >
            <Sliders size={16} /> Rural Stress Test
          </button>

          <button 
            id="nav-simulink"
            className={`nav-pill ${activeTab === 'simulink' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulink')}
          >
            <Cpu size={16} /> Simulink Twin
          </button>

          <button 
            id="nav-timeline"
            className={`nav-pill ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <TrendingUp size={16} /> Progression
          </button>

          <button 
            id="nav-analytics"
            className={`nav-pill ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <Layers size={16} /> Population DHO
          </button>

          <button 
            id="nav-benchmark"
            className={`nav-pill ${activeTab === 'benchmark' ? 'active' : ''}`}
            onClick={() => setActiveTab('benchmark')}
          >
            <BarChart2 size={16} /> Clinical Benchmark & Ablation
          </button>

          <button 
            id="nav-abdm"
            className={`nav-pill ${activeTab === 'abdm' ? 'active' : ''}`}
            onClick={() => setActiveTab('abdm')}
          >
            <Building2 size={16} /> ABDM Gateway
          </button>

          <button 
            id="nav-patientchat"
            className={`nav-pill ${activeTab === 'patientchat' ? 'active' : ''}`}
            onClick={() => setActiveTab('patientchat')}
          >
            <HeartHandshake size={16} /> Patient Saathi
          </button>
        </nav>

        {/* Action Controls & Connectivity Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* Voice Assistant Button */}
          <button 
            id="btn-voice-assistant"
            className="btn" 
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.45rem 0.75rem',
              background: '#f0fdfa',
              border: '1px solid #99f6e4',
              color: '#0f766e'
            }}
            onClick={onOpenVoiceAssistant}
          >
            <Mic size={15} /> Voice AI
          </button>

          {/* Clinical GenAI Copilot Button */}
          <button 
            id="btn-clinical-copilot"
            className="btn" 
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.45rem 0.75rem',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              color: '#0284c7'
            }}
            onClick={onOpenChatbot}
          >
            <Bot size={15} /> Clinical Copilot
          </button>

          {/* Pitch Deck Button */}
          <button 
            id="btn-pitch-deck"
            className="btn btn-secondary" 
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
            onClick={onOpenPitchDeck}
          >
            <Presentation size={15} color="var(--color-teal)" /> Pitch Deck
          </button>

          {/* 4-Minute Demo Tour Button */}
          <button 
            id="btn-demo-tour"
            className="btn btn-primary" 
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
            onClick={onStartDemoTour}
          >
            <Sparkles size={15} /> Guided Demo
          </button>

          {/* ABDM Badge / Link */}
          <button
            onClick={() => setActiveTab('abdm')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.725rem',
              fontWeight: '600',
              color: 'var(--color-navy)',
              cursor: 'pointer'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0d9488' }} />
            ABDM M1-M3
          </button>

          {/* Network Selector Toggle */}
          <select 
            id="network-status-select"
            value={networkStatus}
            onChange={(e) => setNetworkStatus(e.target.value)}
            className="form-select"
            style={{ 
              width: 'auto', 
              fontSize: '0.775rem', 
              padding: '0.35rem 0.65rem',
              background: networkStatus === 'OFFLINE' ? '#fef2f2' : '#ffffff',
              borderColor: networkStatus === 'OFFLINE' ? '#fca5a5' : '#cbd5e1',
              color: networkStatus === 'OFFLINE' ? '#dc2626' : 'var(--color-navy)'
            }}
          >
            <option value="ONLINE">⚡ Online (High-Speed)</option>
            <option value="POOR_2G">📶 2G Rural Edge (Store & Sync)</option>
            <option value="OFFLINE">🚫 Offline (Field Zero-Net)</option>
          </select>
        </div>

      </div>
    </header>
  );
}
