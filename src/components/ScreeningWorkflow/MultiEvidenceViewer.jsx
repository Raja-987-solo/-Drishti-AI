import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  Eye, 
  Crosshair, 
  Sparkles, 
  Filter, 
  Target, 
  Activity, 
  AlertOctagon, 
  CheckSquare, 
  Compass
} from 'lucide-react';
import { drawGradCamOnCanvas, getGradCamAttentionCenters } from '../../core/gradCamEngine';
import { detectRetinalLandmarks, calculateDistanceToFovea } from '../../core/landmarkDetector';

export default function MultiEvidenceViewer({ 
  imageSrc, 
  imageType = 'normal', 
  lesionResult, 
  classifierResult,
  simulateConflict = false
}) {
  const canvasRef = useRef(null);
  const [showGradCam, setShowGradCam] = useState(true);
  const [showLesions, setShowLesions] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true); // Fovea & Optic Disc
  const [showEtdrsGrid, setShowEtdrsGrid] = useState(false); // 500um & 1500um macula rings
  const [claheFilter, setClaheFilter] = useState(false);
  const [gradCamOpacity, setGradCamOpacity] = useState(0.65);
  const [colormap, setColormap] = useState('jet');
  const [hoveredEntity, setHoveredEntity] = useState(null);

  // Lesion filter toggles
  const [filterMA, setFilterMA] = useState(true);
  const [filterHE, setFilterHE] = useState(true);
  const [filterEX, setFilterEX] = useState(true);
  const [filterSE, setFilterSE] = useState(true);
  const [filterNV, setFilterNV] = useState(true); // Neovascularization

  // Detect landmarks (Optic disc and Fovea)
  const landmarks = detectRetinalLandmarks(imageType);

  // Render Grad-CAM on canvas whenever dependencies change
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    if (showGradCam) {
      const centers = getGradCamAttentionCenters(imageType, simulateConflict);
      drawGradCamOnCanvas(canvas, centers, colormap, gradCamOpacity);
    } else {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [showGradCam, imageType, simulateConflict, colormap, gradCamOpacity]);

  const activeLesions = (lesionResult?.lesions || []).filter(lesion => {
    if (lesion.type === 'microaneurysm' && !filterMA) return false;
    if (lesion.type === 'hemorrhage' && !filterHE) return false;
    if (lesion.type === 'hardExudate' && !filterEX) return false;
    if (lesion.type === 'softExudate' && !filterSE) return false;
    if (lesion.type === 'neovascularization' && !filterNV) return false;
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Layers size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>
              Engine 3: Evidence-XAI Multi-Channel Inspector
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Fovea/Disc localization • Sub-pixel MAs • Neovascularization fronds • Grad-CAM
            </span>
          </div>
        </div>

        {/* View Channel Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setClaheFilter(!claheFilter)}
            className={`btn ${claheFilter ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
          >
            <Filter size={13} /> CLAHE Normalization
          </button>

          <button 
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`btn ${showLandmarks ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
          >
            <Compass size={13} /> Fovea & Optic Disc
          </button>

          <button 
            onClick={() => setShowEtdrsGrid(!showEtdrsGrid)}
            className={`btn ${showEtdrsGrid ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
          >
            <Target size={13} /> ETDRS Macula Rings
          </button>

          <button 
            onClick={() => setShowGradCam(!showGradCam)}
            className={`btn ${showGradCam ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
          >
            <Sparkles size={13} /> Grad-CAM
          </button>

          <button 
            onClick={() => setShowLesions(!showLesions)}
            className={`btn ${showLesions ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
          >
            <Crosshair size={13} /> Lesion Masks
          </button>
        </div>
      </div>

      {/* Main Viewport & Evidence Controls Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 350px', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* Left: Retinal Fundus Viewport */}
        <div style={{ position: 'relative' }}>
          <div className="fundus-viewport" style={{ maxHeight: '540px' }}>
            {/* Base Clinical Fundus Image */}
            <img 
              src={imageSrc} 
              alt="Clinical Fundus Retina" 
              style={{
                filter: claheFilter ? 'contrast(1.35) saturate(1.2) brightness(0.95)' : 'none'
              }}
            />

            {/* Canvas for Grad-CAM Heatmap */}
            <canvas 
              ref={canvasRef} 
              width={1000} 
              height={1000} 
              className="fundus-overlay-canvas"
            />

            {/* Anatomical Landmarks (Optic Disc & Fovea Centralis) */}
            {showLandmarks && (
              <>
                {/* 1. Optic Disc Boundary Ellipse */}
                <div 
                  onMouseEnter={() => setHoveredEntity({
                    name: 'Optic Disc (OD)',
                    type: 'landmark',
                    coords: `(${landmarks.disc.x}, ${landmarks.disc.y})`,
                    details: `Vertical CDR: ${landmarks.disc.cdr} • Status: ${landmarks.disc.status}`
                  })}
                  onMouseLeave={() => setHoveredEntity(null)}
                  style={{
                    position: 'absolute',
                    left: `${(landmarks.disc.x - landmarks.disc.radiusX) / 10}%`,
                    top: `${(landmarks.disc.y - landmarks.disc.radiusY) / 10}%`,
                    width: `${(landmarks.disc.radiusX * 2) / 10}%`,
                    height: `${(landmarks.disc.radiusY * 2) / 10}%`,
                    borderRadius: '50%',
                    border: '2px solid #38bdf8',
                    background: 'rgba(56, 189, 248, 0.1)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    zIndex: 25
                  }}
                >
                  <div style={{ position: 'absolute', top: '-18px', left: '0', fontSize: '0.65rem', background: 'rgba(15, 23, 42, 0.85)', padding: '1px 4px', borderRadius: '3px', color: '#38bdf8', fontWeight: '700' }}>
                    OD (CDR {landmarks.disc.cdr})
                  </div>
                </div>

                {/* 2. Fovea Centralis & FAZ Crosshair */}
                <div 
                  onMouseEnter={() => setHoveredEntity({
                    name: 'Fovea Centralis (FC)',
                    type: 'landmark',
                    coords: `(${landmarks.fovea.x}, ${landmarks.fovea.y})`,
                    details: `Intact FAZ (500μm) • Disc Distance: ${landmarks.discToFoveaDistanceUm}μm`
                  })}
                  onMouseLeave={() => setHoveredEntity(null)}
                  style={{
                    position: 'absolute',
                    left: `${(landmarks.fovea.x - landmarks.fovea.fazRadius) / 10}%`,
                    top: `${(landmarks.fovea.y - landmarks.fovea.fazRadius) / 10}%`,
                    width: `${(landmarks.fovea.fazRadius * 2) / 10}%`,
                    height: `${(landmarks.fovea.fazRadius * 2) / 10}%`,
                    borderRadius: '50%',
                    border: '2px solid #34d399',
                    background: 'rgba(52, 211, 153, 0.15)',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    zIndex: 25
                  }}
                >
                  {/* Fovea Crosshair */}
                  <div style={{ position: 'absolute', left: '50%', top: '-6px', bottom: '-6px', width: '1px', background: '#34d399' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '-6px', right: '-6px', height: '1px', background: '#34d399' }} />
                  <div style={{ position: 'absolute', bottom: '-18px', left: '-10px', fontSize: '0.65rem', background: 'rgba(15, 23, 42, 0.85)', padding: '1px 4px', borderRadius: '3px', color: '#34d399', fontWeight: '700' }}>
                    FOVEA
                  </div>
                </div>
              </>
            )}

            {/* ETDRS Concentric Rings (Centered on Fovea) */}
            {showEtdrsGrid && (
              <>
                {landmarks.etdrsRings.map((ring, idx) => (
                  <div 
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${(landmarks.fovea.x - ring.radiusPx) / 10}%`,
                      top: `${(landmarks.fovea.y - ring.radiusPx) / 10}%`,
                      width: `${(ring.radiusPx * 2) / 10}%`,
                      height: `${(ring.radiusPx * 2) / 10}%`,
                      borderRadius: '50%',
                      border: `1.5px dashed ${ring.color}`,
                      pointerEvents: 'none',
                      zIndex: 22
                    }}
                  />
                ))}
              </>
            )}

            {/* Interactive Lesion Overlay Markers */}
            {showLesions && activeLesions.map(lesion => {
              let color = '#ef4444'; // Red for microaneurysm
              let border = '2px solid #ef4444';
              let bg = 'rgba(239, 68, 68, 0.4)';

              if (lesion.type === 'hemorrhage') {
                color = '#b91c1c';
                border = '2px dashed #f87171';
                bg = 'rgba(185, 28, 28, 0.4)';
              } else if (lesion.type === 'hardExudate') {
                color = '#fbbf24';
                border = '2px solid #f59e0b';
                bg = 'rgba(245, 158, 11, 0.4)';
              } else if (lesion.type === 'softExudate') {
                color = '#ffffff';
                border = '2px solid #38bdf8';
                bg = 'rgba(255, 255, 255, 0.5)';
              } else if (lesion.type === 'neovascularization') {
                color = '#e11d48';
                border = '3px solid #f43f5e';
                bg = 'rgba(244, 63, 94, 0.45)';
              }

              const leftPct = (lesion.x / 1000) * 100;
              const topPct = (lesion.y / 1000) * 100;
              const radiusPct = (lesion.radius / 1000) * 100;

              // Compute distance to fovea center
              const foveaDist = calculateDistanceToFovea(lesion.x, lesion.y, landmarks.fovea);

              return (
                <div
                  key={lesion.id}
                  onMouseEnter={() => setHoveredEntity({
                    ...lesion,
                    name: lesion.desc,
                    coords: `(${lesion.x.toFixed(2)}, ${lesion.y.toFixed(2)})`,
                    foveaDist
                  })}
                  onMouseLeave={() => setHoveredEntity(null)}
                  style={{
                    position: 'absolute',
                    left: `calc(${leftPct}% - ${radiusPct}%)`,
                    top: `calc(${topPct}% - ${radiusPct}%)`,
                    width: `${radiusPct * 2}%`,
                    height: `${radiusPct * 2}%`,
                    borderRadius: lesion.type === 'neovascularization' ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '50%',
                    border,
                    background: bg,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease',
                    transform: hoveredEntity?.id === lesion.id ? 'scale(1.35)' : 'scale(1)',
                    boxShadow: lesion.type === 'neovascularization' ? '0 0 12px #f43f5e' : 'none',
                    zIndex: 20
                  }}
                />
              );
            })}

            {/* Dynamic Scanning Line */}
            <div className="animate-scan" />
          </div>

          {/* Hovered Entity Inspector Bar */}
          {hoveredEntity && (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              zIndex: 35
            }}>
              <div>
                <strong>{hoveredEntity.name}</strong>{' '}
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  Sub-Pixel Pos: {hoveredEntity.coords}
                </span>
                {hoveredEntity.diameterUm && (
                  <span style={{ marginLeft: '0.5rem', color: '#fbbf24' }}>
                    • Diameter: <strong>{hoveredEntity.diameterUm}μm</strong> (SNR {hoveredEntity.snrDb}dB)
                  </span>
                )}
              </div>
              {hoveredEntity.foveaDist ? (
                <span style={{ 
                  color: hoveredEntity.foveaDist.csmeThreat === 'IMMEDIATE_VISION_THREAT' ? '#f87171' : '#34d399',
                  fontWeight: '600'
                }}>
                  Fovea Distance: {hoveredEntity.foveaDist.distanceUm}μm ({hoveredEntity.foveaDist.zone})
                </span>
              ) : (
                <span style={{ color: '#cbd5e1' }}>{hoveredEntity.details}</span>
              )}
            </div>
          )}
        </div>

        {/* Right: Evidence Controls & Precision Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Neovascularization (PDR) Alert Banner if detected */}
          {lesionResult?.neovascularization?.hasNVD && (
            <div style={{
              background: 'rgba(225, 29, 72, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: '10px',
              padding: '0.85rem',
              color: '#fecdd3'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '0.825rem', color: '#f43f5e', marginBottom: '0.25rem' }}>
                <AlertOctagon size={16} /> NEOVASCULARIZATION DETECTED (PDR)
              </div>
              <div style={{ fontSize: '0.75rem', lineHeight: 1.35 }}>
                {lesionResult.neovascularization.clinicalAlert}
              </div>
              <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#fda4af' }}>
                <span>Fronds: <strong>{lesionResult.neovascularization.totalFronds}</strong></span>
                <span>Tortuosity: <strong>{lesionResult.neovascularization.tortuosityIndex}</strong></span>
              </div>
            </div>
          )}

          {/* Anatomical Landmark Telemetry */}
          <div className="glass-panel" style={{ padding: '0.85rem' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Compass size={15} color="var(--accent-cyan)" /> Anatomical Landmarking
              </span>
              <span className="status-badge badge-green" style={{ fontSize: '0.65rem' }}>
                LOCALIZED
              </span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.775rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Optic Disc Center:</span>
                <span className="font-mono">({landmarks.disc.x}, {landmarks.disc.y})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vertical Cup-to-Disc Ratio:</span>
                <strong style={{ color: landmarks.disc.cdr > 0.5 ? '#fbbf24' : '#34d399' }}>
                  {landmarks.disc.cdr} (Normal &lt; 0.5)
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fovea Centralis Center:</span>
                <span className="font-mono">({landmarks.fovea.x}, {landmarks.fovea.y})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Disc-to-Fovea Distance:</span>
                <span className="font-mono">{landmarks.discToFoveaDistanceUm} μm (~{landmarks.discToFoveaDistancePx}px)</span>
              </div>
            </div>
          </div>

          {/* Lesion Quantitative Channel Checklist */}
          <div className="glass-panel" style={{ padding: '0.85rem' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Verified Pathology Inventory</span>
              <span className="status-badge badge-cyan" style={{ fontSize: '0.675rem' }}>
                {lesionResult?.totalCount || 0} TOTAL
              </span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              
              {/* Neovascularization (NVD/NVE) */}
              <div 
                onClick={() => setFilterNV(!filterNV)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  background: filterNV ? '#ffe4e6' : '#f8fafc',
                  cursor: 'pointer',
                  border: filterNV ? '1px solid #fda4af' : '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48' }} />
                  <span style={{ color: 'var(--color-navy)', fontWeight: '500' }}>Neovascularization (NVD/NVE)</span>
                </div>
                <span className="font-mono" style={{ fontWeight: '700', color: '#e11d48' }}>
                  {lesionResult?.counts?.neovascularization || 0}
                </span>
              </div>

              {/* Sub-Pixel Microaneurysms */}
              <div 
                onClick={() => setFilterMA(!filterMA)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  background: filterMA ? '#fee2e2' : '#f8fafc',
                  cursor: 'pointer',
                  border: filterMA ? '1px solid #fca5a5' : '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ color: 'var(--color-navy)', fontWeight: '500' }}>Sub-Pixel Microaneurysms</span>
                </div>
                <span className="font-mono" style={{ fontWeight: '700', color: '#dc2626' }}>
                  {lesionResult?.counts?.microaneurysm || 0}
                </span>
              </div>

              {/* Hemorrhages */}
              <div 
                onClick={() => setFilterHE(!filterHE)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  background: filterHE ? '#fee2e2' : '#f8fafc',
                  cursor: 'pointer',
                  border: filterHE ? '1px solid #fca5a5' : '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#b91c1c' }} />
                  <span style={{ color: 'var(--color-navy)', fontWeight: '500' }}>Blot Hemorrhages (HE)</span>
                </div>
                <span className="font-mono" style={{ fontWeight: '700', color: '#b91c1c' }}>
                  {lesionResult?.counts?.hemorrhage || 0}
                </span>
              </div>

              {/* Hard Exudates */}
              <div 
                onClick={() => setFilterEX(!filterEX)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  background: filterEX ? '#fef3c7' : '#f8fafc',
                  cursor: 'pointer',
                  border: filterEX ? '1px solid #fde68a' : '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }} />
                  <span style={{ color: 'var(--color-navy)', fontWeight: '500' }}>Hard Lipid Exudates (EX)</span>
                </div>
                <span className="font-mono" style={{ fontWeight: '700', color: '#d97706' }}>
                  {lesionResult?.counts?.hardExudate || 0}
                </span>
              </div>

              {/* Soft Exudates */}
              <div 
                onClick={() => setFilterSE(!filterSE)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  background: filterSE ? '#f1f5f9' : '#f8fafc',
                  cursor: 'pointer',
                  border: filterSE ? '1px solid #cbd5e1' : '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} />
                  <span style={{ color: 'var(--color-navy)', fontWeight: '500' }}>Cotton Wool Spots (SE)</span>
                </div>
                <span className="font-mono" style={{ fontWeight: '700', color: '#475569' }}>
                  {lesionResult?.counts?.softExudate || 0}
                </span>
              </div>
            </div>

            {/* Macular CSME Proximity Status */}
            <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Macular CSME Risk:</span>
              <strong style={{ 
                color: lesionResult?.csmeRisk === 'VERY_HIGH' || lesionResult?.csmeRisk === 'HIGH' ? '#dc2626' : '#16a34a' 
              }}>
                {lesionResult?.csmeRisk || 'NONE'}
              </strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
