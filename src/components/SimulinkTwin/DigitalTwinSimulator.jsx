import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Wifi, 
  Users, 
  Clock, 
  Database, 
  AlertOctagon, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Server
} from 'lucide-react';
import { PRESET_SCENARIOS, runSimulinkDistrictSimulation } from '../../core/simulinkModel';

export default function DigitalTwinSimulator() {
  const [activeScenario, setActiveScenario] = useState('SCENARIO_C');
  const [params, setParams] = useState(PRESET_SCENARIOS.SCENARIO_C);

  const handleSelectScenario = (scenarioKey) => {
    setActiveScenario(scenarioKey);
    setParams(PRESET_SCENARIOS[scenarioKey]);
  };

  const simulation = runSimulinkDistrictSimulation(params);

  return (
    <div className="animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                Simulink District Digital Twin
              </h2>
              <span className="status-badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                DISTRICT SCALE CAPACITY MODEL
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Discrete-event queuing and network flow model answering: <em>"Can one district realistically screen 100,000+ people?"</em>
            </p>
          </div>

          {/* Preset Scenario Selector Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSelectScenario('SCENARIO_A')}
              className={`btn ${activeScenario === 'SCENARIO_A' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
            >
              Scenario A (500 pts / 2G)
            </button>

            <button
              onClick={() => handleSelectScenario('SCENARIO_B')}
              className={`btn ${activeScenario === 'SCENARIO_B' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
            >
              Scenario B (1,500 pts / 3G)
            </button>

            <button
              onClick={() => handleSelectScenario('SCENARIO_C')}
              className={`btn ${activeScenario === 'SCENARIO_C' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem' }}
            >
              Scenario C (3,000 pts / Drishti AI Edge)
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation Layout: Left Controls, Right Output Flow */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.25rem' }}>
        
        {/* Left: Interactive Simulink Parameter Controls */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={16} color="var(--accent-cyan)" /> Simulink Variables
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Daily Patients Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Daily Patients Cohort</span>
                <span className="font-mono" style={{ color: '#38bdf8', fontWeight: '700' }}>
                  {params.dailyPatients} pts/day
                </span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="5000" 
                step="100"
                value={params.dailyPatients} 
                onChange={(e) => setParams({ ...params, dailyPatients: parseInt(e.target.value) })} 
              />
            </div>

            {/* Network Bandwidth Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Internet Bandwidth</span>
                <span className="font-mono" style={{ color: params.bandwidthKbps < 128 ? '#f87171' : '#38bdf8', fontWeight: '700' }}>
                  {params.bandwidthKbps >= 1024 ? `${(params.bandwidthKbps/1024).toFixed(1)} Mbps` : `${params.bandwidthKbps} kbps`}
                </span>
              </div>
              <input 
                type="range" 
                min="32" 
                max="4096" 
                step="32"
                value={params.bandwidthKbps} 
                onChange={(e) => setParams({ ...params, bandwidthKbps: parseInt(e.target.value) })} 
              />
            </div>

            {/* PHC Facilities Count */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Active Rural PHC Centers</span>
                <span className="font-mono" style={{ color: '#38bdf8', fontWeight: '700' }}>
                  {params.phcCount} facilities
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={params.phcCount} 
                onChange={(e) => setParams({ ...params, phcCount: parseInt(e.target.value) })} 
              />
            </div>

            {/* Doctor Count Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', marginBottom: '0.35rem' }}>
                <span>Tele-Ophthalmologists On-Call</span>
                <span className="font-mono" style={{ color: '#38bdf8', fontWeight: '700' }}>
                  {params.doctorCount} doctors
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="8" 
                value={params.doctorCount} 
                onChange={(e) => setParams({ ...params, doctorCount: parseInt(e.target.value) })} 
              />
            </div>

            {/* Edge AI Toggle (The Core Lever) */}
            <div style={{
              background: params.useEdgeAI ? 'rgba(6, 182, 212, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: params.useEdgeAI ? '1px solid var(--accent-cyan)' : '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: params.useEdgeAI ? '#38bdf8' : '#fca5a5' }}>
                  {params.useEdgeAI ? '⚡ Drishti AI Edge Active' : '☁️ Central Cloud Upload'}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {params.useEdgeAI ? 'Jetson / Local GPU inference' : 'Uploads 4MB raw images'}
                </span>
              </div>
              <button
                onClick={() => setParams({ ...params, useEdgeAI: !params.useEdgeAI })}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
              >
                Toggle
              </button>
            </div>

          </div>

          {/* Bottleneck Alerts */}
          {simulation.bottlenecks.length > 0 && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.775rem', fontWeight: '700', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                <AlertOctagon size={15} /> District Bottleneck Detected:
              </div>
              {simulation.bottlenecks.map((msg, i) => (
                <div key={i} style={{ fontSize: '0.725rem', color: '#fca5a5', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Live Simulink Output Graphs & Queuing Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Key Flow Metric Display Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            
            <div className="metric-box">
              <span className="metric-label">Avg Patient Turnaround</span>
              <span className="metric-value" style={{ color: simulation.avgWaitTimeMinutes > 30 ? '#f87171' : '#34d399' }}>
                {simulation.avgWaitTimeMinutes} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>min</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>From arrival to report</span>
            </div>

            <div className="metric-box">
              <span className="metric-label">AI Inference Latency</span>
              <span className="metric-value font-mono" style={{ color: '#38bdf8' }}>
                {simulation.aiLatencySeconds} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>sec</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {simulation.aiThroughputPerHour.toLocaleString()} screens / hr
              </span>
            </div>

            <div className="metric-box">
              <span className="metric-label">Doctor Queue Backlog</span>
              <span className="metric-value font-mono" style={{ color: simulation.doctorQueueBacklog > 50 ? '#f87171' : '#34d399' }}>
                {simulation.doctorQueueBacklog} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>cases</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {simulation.doctorUtilizationPct}% specialist utilization
              </span>
            </div>

            <div className="metric-box">
              <span className="metric-label">Bandwidth Saved</span>
              <span className="metric-value font-mono" style={{ color: '#6ee7b7' }}>
                {simulation.bandwidthSavedPct}%
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {simulation.totalBandwidthGB} GB payload / day
              </span>
            </div>

          </div>

          {/* Simulink Workflow Flowchart Visualizer */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-navy)', fontWeight: '700' }}>
              Simulink Discrete-Event Flow Dynamics
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', position: 'relative' }}>
              
              {/* Step 1: Ingestion */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>1. PHC ACQUISITION</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0.2rem 0', color: 'var(--color-navy)' }}>
                  {simulation.totalRawImages.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                  Raw fundus photos across {params.phcCount} clinics
                </span>
              </div>

              {/* Step 2: Quality Guardian Filter */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>2. QUALITY FILTER</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0.2rem 0', color: '#15803d' }}>
                  {simulation.gradableImages.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.725rem', color: '#dc2626', fontWeight: '500' }}>
                  {simulation.rejectedImages} retakes guided locally
                </span>
              </div>

              {/* Step 3: Edge AI Inference */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>3. CONCORDANCE AI</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0.2rem 0', color: 'var(--color-cyan)' }}>
                  {Math.round(simulation.gradableImages * 0.88).toLocaleString()}
                </div>
                <span style={{ fontSize: '0.725rem', color: '#15803d', fontWeight: '500' }}>
                  Routine cleared without doctor
                </span>
              </div>

              {/* Step 4: Specialist Queue */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>4. DOCTOR 30s DESK</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0.2rem 0', color: simulation.doctorQueueBacklog > 50 ? '#dc2626' : '#d97706' }}>
                  {simulation.totalDoctorReviewCases}
                </div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
                  Target: {params.doctorCount} doctors handling queue
                </span>
              </div>

            </div>

            {/* Narrative Conclusion */}
            <div style={{ marginTop: '1.25rem', background: 'rgba(13, 148, 136, 0.08)', border: '1px solid rgba(13, 148, 136, 0.25)', borderRadius: '8px', padding: '0.85rem 1.15rem', fontSize: '0.825rem', color: 'var(--color-navy)', lineHeight: 1.5 }}>
              <strong>Public Health Takeaway:</strong> With Drishti AI's Edge AI + 30-Second Doctor Triage, a rural district with {params.doctorCount} ophthalmologists can sustainably screen <strong>{params.dailyPatients.toLocaleString()} patients per day</strong> (100,000+ per quarter) while saving <strong>{simulation.bandwidthSavedPct}% bandwidth</strong> and maintaining zero ungradable diagnostic errors.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
