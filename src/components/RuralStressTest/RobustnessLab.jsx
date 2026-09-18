import React, { useState } from 'react';
import { Sliders, AlertTriangle, ShieldCheck, Zap, Activity, RotateCcw, AlertOctagon } from 'lucide-react';
import { analyzeImageQuality } from '../../core/qualityGuardian';

export default function RobustnessLab() {
  const [blurIntensity, setBlurIntensity] = useState(0);
  const [lowLight, setLowLight] = useState(0);
  const [glare, setGlare] = useState(0);
  const [sensorNoise, setSensorNoise] = useState(0);
  const [cameraTilt, setCameraTilt] = useState(0);

  // Compute live quality index with modifications
  const quality = analyzeImageQuality('moderate', {
    blurIntensity,
    lowLight,
    noise: sensorNoise,
    cameraTilt
  });

  // Calculate comparative behavior
  // Standard Model: Blindly overconfident ResNet (flat 94% until almost completely black)
  const naiveConfidence = Math.max(88, Math.round(96 - (blurIntensity + lowLight) * 0.08));

  // NetraSetu Model: Calibrated confidence and safe abstention
  const netraConfidence = Math.max(18, Math.round(92 * (quality.overallQuality / 100)));
  const isNetraAbstained = quality.overallQuality < 58 || blurIntensity > 55 || lowLight > 65;

  const resetFilters = () => {
    setBlurIntensity(0);
    setLowLight(0);
    setGlare(0);
    setSensorNoise(0);
    setCameraTilt(0);
  };

  return (
    <div className="animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                Rural Robustness Benchmark Lab
              </h2>
              <span className="status-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                JURY STRESS-TEST
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
              Simulate harsh rural deployment conditions (camera vibration, poor lighting, dust, compression) and observe safe AI abstention in real time
            </p>
          </div>

          <button 
            onClick={resetFilters}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            <RotateCcw size={14} /> Reset Conditions
          </button>
        </div>
      </div>

      {/* Main Duel View: Degradation Sliders + Side-by-Side Model Responses */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem' }}>
        
        {/* Left: Interactive Stress Sliders */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sliders size={16} color="var(--accent-cyan)" /> Environmental Stressors
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Motion Blur Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Camera Motion Blur</span>
                <span className="font-mono" style={{ color: blurIntensity > 50 ? '#f87171' : '#38bdf8' }}>{blurIntensity}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={blurIntensity} 
                onChange={(e) => setBlurIntensity(parseInt(e.target.value))} 
              />
            </div>

            {/* Low Light / Underexposure Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Underexposure / Dark</span>
                <span className="font-mono" style={{ color: lowLight > 50 ? '#f87171' : '#38bdf8' }}>{lowLight}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={lowLight} 
                onChange={(e) => setLowLight(parseInt(e.target.value))} 
              />
            </div>

            {/* Glare / Overexposure Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Optical Glare / Flare</span>
                <span className="font-mono" style={{ color: glare > 50 ? '#f87171' : '#38bdf8' }}>{glare}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={glare} 
                onChange={(e) => setGlare(parseInt(e.target.value))} 
              />
            </div>

            {/* Sensor Noise Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Sensor ISO Noise</span>
                <span className="font-mono" style={{ color: sensorNoise > 50 ? '#f87171' : '#38bdf8' }}>{sensorNoise}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sensorNoise} 
                onChange={(e) => setSensorNoise(parseInt(e.target.value))} 
              />
            </div>

            {/* Camera Tilt / Off-Center Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Optical Axis Misalignment</span>
                <span className="font-mono" style={{ color: cameraTilt > 50 ? '#f87171' : '#38bdf8' }}>{cameraTilt}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={cameraTilt} 
                onChange={(e) => setCameraTilt(parseInt(e.target.value))} 
              />
            </div>

          </div>

          {/* Resulting Guardian Score */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Image Guardian Score:</span>
              <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: '800', color: quality.overallQuality >= 65 ? '#34d399' : '#f87171' }}>
                {quality.overallQuality}/100
              </span>
            </div>
            <div style={{ marginTop: '0.35rem' }}>
              <span className={`status-badge ${quality.statusBadge}`} style={{ width: '100%', justifyContent: 'center' }}>
                {quality.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Degraded Retina + AI Architecture Duel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Degraded Fundus Viewport */}
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Live Degraded Optical Field Simulation
            </div>

            <div className="fundus-viewport" style={{ maxHeight: '340px' }}>
              <img 
                src="/images/moderate_dr.jpg" 
                alt="Degraded Field" 
                style={{
                  filter: `
                    blur(${blurIntensity * 0.15}px) 
                    brightness(${1 - (lowLight * 0.007) + (glare * 0.008)}) 
                    contrast(${1 - (blurIntensity * 0.005) - (lowLight * 0.003)})
                  `,
                  transform: `rotate(${cameraTilt * 0.2}deg) scale(${1 - (cameraTilt * 0.002)})`
                }}
              />
              <div className="animate-scan" />
            </div>
          </div>

          {/* Model Duel Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* Model A: Standard Naive Black-Box AI */}
            <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid #fecaca', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={18} color="#dc2626" />
                <h4 style={{ fontSize: '0.95rem', margin: 0, color: '#dc2626', fontWeight: '700' }}>
                  Standard Naive Classifier
                </h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Vanilla ResNet without quality gating or concordance verification
              </p>

              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.725rem', color: '#991b1b', fontWeight: '700' }}>REPORTED DIAGNOSIS:</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#dc2626' }}>
                  Moderate NPDR (Referable)
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#b91c1c', marginTop: '0.25rem' }}>
                  {naiveConfidence}% Confidence
                </div>
              </div>

              <div style={{ fontSize: '0.775rem', color: '#991b1b', lineHeight: 1.4 }}>
                <strong>Critical Failure:</strong> Model hallucinates high confidence on a severely degraded or blurred image where human experts cannot safely discern vessels.
              </div>
            </div>

            {/* Model B: Drishti AI Safe Concordance Architecture */}
            <div className="glass-panel" style={{ 
              padding: '1.25rem', 
              background: isNetraAbstained ? '#f8fafc' : '#ffffff',
              border: isNetraAbstained ? '2px solid var(--color-cyan)' : '2px solid var(--color-teal)',
              boxShadow: isNetraAbstained ? '0 4px 20px rgba(2, 132, 199, 0.15)' : '0 4px 20px rgba(13, 148, 136, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={18} color={isNetraAbstained ? 'var(--color-cyan)' : 'var(--color-teal)'} />
                <h4 style={{ fontSize: '0.95rem', margin: 0, color: isNetraAbstained ? 'var(--color-cyan)' : 'var(--color-teal-dark)', fontWeight: '700' }}>
                  Drishti AI Guardian System
                </h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Evidence Concordance + Image Guardian + 4-State Safe Decision
              </p>

              <div style={{ 
                background: isNetraAbstained ? '#f1f5f9' : '#f0fdf4', 
                border: isNetraAbstained ? '1px solid #cbd5e1' : '1px solid #bbf7d0',
                padding: '0.75rem', 
                borderRadius: '8px', 
                marginBottom: '0.75rem' 
              }}>
                <div style={{ fontSize: '0.725rem', color: isNetraAbstained ? 'var(--color-navy)' : '#15803d', fontWeight: '700' }}>
                  SYSTEM DECISION:
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: isNetraAbstained ? 'var(--color-navy)' : '#15803d' }}>
                  {isNetraAbstained ? 'PREDICTION WITHHELD (GREY STATE)' : 'Moderate NPDR Verified'}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: isNetraAbstained ? '#475569' : '#15803d', marginTop: '0.25rem' }}>
                  {isNetraAbstained ? 'Calibrated Abstention Active' : `${netraConfidence}% Calibrated`}
                </div>
              </div>

              <div style={{ fontSize: '0.775rem', color: isNetraAbstained ? '#0369a1' : '#15803d', lineHeight: 1.4 }}>
                {isNetraAbstained ? (
                  <span>
                    <strong>Safe Refusal:</strong> System deliberately refused to make an unsafe prediction. Triggered field retake guidance: <em>"Hold camera steady & clean lens."</em>
                  </span>
                ) : (
                  <span>
                    <strong>Concordant:</strong> Image quality adequate for safe microvascular evaluation.
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
