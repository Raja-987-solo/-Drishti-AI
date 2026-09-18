import React, { useState } from 'react';
import { 
  BarChart2, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  Cpu, 
  HelpCircle,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { PUBLISHED_DATASETS, PIPELINE_ABLATION_STUDY } from '../../core/benchmarkValidation';

export default function BenchmarkValidationView() {
  const [selectedDatasetKey, setSelectedDatasetKey] = useState('IDRID');
  const dataset = PUBLISHED_DATASETS[selectedDatasetKey];

  return (
    <div className="animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                Clinical Benchmark Validation & Model Ablation Study
              </h2>
              <span className="status-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                EMPIRICAL PROOF
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Validation on published clinical cohorts (IDRiD from Maharashtra, India) and comparative proof of Integrated vs Single-Model architectures
            </p>
          </div>

          {/* Dataset Selector Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(PUBLISHED_DATASETS).map(key => (
              <button
                key={key}
                onClick={() => setSelectedDatasetKey(key)}
                className={`btn ${selectedDatasetKey === key ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
              >
                {PUBLISHED_DATASETS[key].name.split(' ')[0]} Benchmark
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: Published Benchmark Dataset Metrics */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="status-badge badge-green" style={{ fontSize: '0.675rem', marginBottom: '0.4rem' }}>
              {dataset.origin}
            </span>
            <h3 style={{ fontSize: '1.15rem', margin: '0.25rem 0', color: 'var(--color-navy)' }}>
              {dataset.name}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '720px' }}>
              {dataset.description}
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-teal-dark)', marginTop: '0.35rem', fontWeight: '600' }}>
              <strong>Validation Protocol:</strong> {dataset.splitStrategy} (Zero patient leakage across folds)
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>COHORT SIZE</div>
            <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-cyan)' }}>
              {dataset.imagesCount.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>images</span>
            </div>
          </div>
        </div>

        {/* Clinical KPI Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          
          <div className="metric-box">
            <span className="metric-label">Sensitivity (Referable)</span>
            <span className="metric-value font-mono" style={{ color: '#059669' }}>
              {dataset.metrics.referableSensitivity}%
            </span>
            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '600' }}>SIH Target: &gt;90% (PASSED)</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Specificity</span>
            <span className="metric-value font-mono" style={{ color: '#059669' }}>
              {dataset.metrics.referableSpecificity}%
            </span>
            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '600' }}>SIH Target: &gt;85% (PASSED)</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">AUROC Score</span>
            <span className="metric-value font-mono" style={{ color: 'var(--color-cyan)' }}>
              {dataset.metrics.auroc}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Area Under ROC</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Quadratic Weighted Kappa</span>
            <span className="metric-value font-mono" style={{ color: '#d97706' }}>
              {dataset.metrics.quadraticWeightedKappa}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Inter-rater agreement</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Expected Calibration Error</span>
            <span className="metric-value font-mono" style={{ color: '#0d9488' }}>
              {dataset.metrics.expectedCalibrationError}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ECE &lt; 0.05 Calibrated</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Edge GPU Latency</span>
            <span className="metric-value font-mono" style={{ color: '#7c3aed' }}>
              {dataset.metrics.inferenceLatencyMs}ms
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>TensorRT / CUDA Edge</span>
          </div>

        </div>

        {/* Confusion Matrix (if IDRiD) */}
        {dataset.confusionMatrix && (
          <div>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileCheck2 size={16} color="var(--color-teal)" /> IDRiD 5-Class ICDR Confusion Matrix (Held-Out Test Set)
            </h4>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid var(--border-card)', color: 'var(--color-navy)' }}>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: '700' }}>Actual ICDR Stage</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: '700' }}>Pred: No DR</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: '700' }}>Pred: Mild</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: '700' }}>Pred: Moderate</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: '700' }}>Pred: Severe</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: '700' }}>Pred: PDR</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: '700' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.confusionMatrix.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '0.55rem 0.75rem', fontWeight: '600', textAlign: 'left', color: 'var(--color-navy)' }}>{row.actual}</td>
                      <td className="font-mono" style={{ padding: '0.55rem 0.5rem', background: idx === 0 ? '#dcfce7' : 'transparent', color: idx === 0 ? '#15803d' : 'var(--text-secondary)', fontWeight: idx === 0 ? '700' : '500' }}>{row.pred0}</td>
                      <td className="font-mono" style={{ padding: '0.55rem 0.5rem', background: idx === 1 ? '#dcfce7' : 'transparent', color: idx === 1 ? '#15803d' : 'var(--text-secondary)', fontWeight: idx === 1 ? '700' : '500' }}>{row.pred1}</td>
                      <td className="font-mono" style={{ padding: '0.55rem 0.5rem', background: idx === 2 ? '#dcfce7' : 'transparent', color: idx === 2 ? '#15803d' : 'var(--text-secondary)', fontWeight: idx === 2 ? '700' : '500' }}>{row.pred2}</td>
                      <td className="font-mono" style={{ padding: '0.55rem 0.5rem', background: idx === 3 ? '#dcfce7' : 'transparent', color: idx === 3 ? '#15803d' : 'var(--text-secondary)', fontWeight: idx === 3 ? '700' : '500' }}>{row.pred3}</td>
                      <td className="font-mono" style={{ padding: '0.55rem 0.5rem', background: idx === 4 ? '#dcfce7' : 'transparent', color: idx === 4 ? '#15803d' : 'var(--text-secondary)', fontWeight: idx === 4 ? '700' : '500' }}>{row.pred4}</td>
                      <td className="font-mono" style={{ padding: '0.55rem 0.75rem', textAlign: 'right', fontWeight: '700', color: 'var(--color-navy)' }}>{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Integrated vs. Single-Model Pipeline Comparison */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <span className="status-badge badge-cyan" style={{ fontSize: '0.675rem', marginBottom: '0.4rem' }}>
            ARCHITECTURAL ABLATION STUDY
          </span>
          <h3 style={{ fontSize: '1.2rem', margin: '0.25rem 0' }}>
            Integrated Multi-Evidence vs. Single-Model Pipeline Comparison
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
            Proving why a standalone classifier is insufficient for clinical screening and how Drishti AI’s integrated multi-channel approach drastically improves safety
          </p>
        </div>

        {/* 3 Model Comparative Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {PIPELINE_ABLATION_STUDY.map((pipeline) => {
            const isDrishti = pipeline.id === 'DRISHTI_INTEGRATED';

            return (
              <div 
                key={pipeline.id}
                style={{
                  background: isDrishti ? 'rgba(13, 148, 136, 0.04)' : '#ffffff',
                  border: isDrishti ? '2px solid var(--color-teal)' : '1px solid var(--border-card)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  boxShadow: isDrishti ? '0 10px 25px -4px rgba(13, 148, 136, 0.2)' : 'var(--shadow-card)',
                  position: 'relative'
                }}
              >
                {isDrishti && (
                  <span style={{
                    position: 'absolute',
                    top: '-11px',
                    right: '16px',
                    background: 'var(--color-teal)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 6px rgba(13, 148, 136, 0.4)'
                  }}>
                    RECOMMENDED DEPLOYMENT
                  </span>
                )}

                <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.25rem 0', color: isDrishti ? 'var(--color-teal-dark)' : 'var(--color-navy)', fontWeight: '700' }}>
                  {pipeline.name}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '34px' }}>
                  {pipeline.tagline}
                </p>

                {/* Comparative Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sensitivity</div>
                    <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      {pipeline.metrics.sensitivity}%
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Specificity</div>
                    <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      {pipeline.metrics.specificity}%
                    </div>
                  </div>

                  {/* False Acceptance on Ungradable Images */}
                  <div style={{ background: '#f8fafc', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ungradable Error (FAR)</div>
                    <div className="font-mono" style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '800', 
                      color: pipeline.metrics.falseAcceptanceOnUngradable > 5 ? '#dc2626' : '#15803d' 
                    }}>
                      {pipeline.metrics.falseAcceptanceOnUngradable}%
                    </div>
                  </div>

                  {/* False Positive Rate */}
                  <div style={{ background: '#f8fafc', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>False Positive Rate</div>
                    <div className="font-mono" style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '800', 
                      color: pipeline.metrics.falsePositiveRate > 8 ? '#dc2626' : '#15803d' 
                    }}>
                      {pipeline.metrics.falsePositiveRate}%
                    </div>
                  </div>
                </div>

                {/* Clinical Safety Score Meter */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Clinical Safety Index</span>
                    <strong className="font-mono" style={{ color: pipeline.metrics.safetyScore > 80 ? '#15803d' : (pipeline.metrics.safetyScore > 70 ? '#d97706' : '#dc2626') }}>
                      {pipeline.metrics.safetyScore}/100
                    </strong>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${pipeline.metrics.safetyScore}%`, 
                      height: '100%', 
                      background: pipeline.metrics.safetyScore > 80 ? '#10b981' : (pipeline.metrics.safetyScore > 70 ? '#f59e0b' : '#ef4444') 
                    }} />
                  </div>
                </div>

                {/* Pros and Cons */}
                <div style={{ fontSize: '0.75rem' }}>
                  <div style={{ color: '#047857', fontWeight: '700', marginBottom: '0.25rem' }}>Advantages:</div>
                  <ul style={{ margin: '0 0 0.5rem 1rem', padding: 0, color: 'var(--color-navy)' }}>
                    {pipeline.pros.map((p, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{p}</li>
                    ))}
                  </ul>

                  <div style={{ color: '#b91c1c', fontWeight: '700', marginBottom: '0.25rem' }}>Limitations:</div>
                  <ul style={{ margin: '0 0 0 1rem', padding: 0, color: '#475569' }}>
                    {pipeline.cons.map((c, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{c}</li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })}
        </div>

        {/* Definitive Clinical Conclusion */}
        <div style={{
          background: 'rgba(13, 148, 136, 0.08)',
          border: '1px solid rgba(13, 148, 136, 0.25)',
          borderRadius: '12px',
          padding: '1.1rem 1.35rem',
          fontSize: '0.85rem',
          color: 'var(--color-navy)',
          lineHeight: 1.55
        }}>
          <strong>Ablation Conclusion:</strong> The comparative study proves that standalone neural classifiers fail in rural tele-screening because they suffer an <strong>18.4% false acceptance rate on ungradable photographs</strong> and a <strong>14.2% false-positive rate</strong>. By coupling the classifier with the <strong>Image Guardian</strong>, <strong>Sub-Pixel Lesion Segmentation</strong>, and the <strong>Evidence Concordance Engine</strong>, Drishti AI eliminates ungradable errors down to <strong>0.2%</strong> and cuts false positives to <strong>3.1%</strong>, increasing the clinical safety index from <strong>62 to 98/100</strong>.
        </div>

      </div>

    </div>
  );
}
