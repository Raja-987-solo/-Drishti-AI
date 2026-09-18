import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PatientSelector from './components/ScreeningWorkflow/PatientSelector';
import ImageGuardianInspector from './components/ScreeningWorkflow/ImageGuardianInspector';
import MultiEvidenceViewer from './components/ScreeningWorkflow/MultiEvidenceViewer';
import ConcordanceCard from './components/ScreeningWorkflow/ConcordanceCard';
import GenAiReportSection from './components/ScreeningWorkflow/GenAiReportSection';
import ReferralModal from './components/ScreeningWorkflow/ReferralModal';
import FhirModal from './components/ScreeningWorkflow/FhirModal';
import DoctorTriageDesk from './components/DoctorTriage/DoctorTriageDesk';
import RobustnessLab from './components/RuralStressTest/RobustnessLab';
import DigitalTwinSimulator from './components/SimulinkTwin/DigitalTwinSimulator';
import PatientHistoryView from './components/LongitudinalTracker/PatientHistoryView';
import DistrictAnalytics from './components/PopulationDashboard/DistrictAnalytics';
import PitchPresentation from './components/PitchDeck/PitchPresentation';
import DemoTourModal from './components/DemoTourModal';
import BenchmarkValidationView from './components/BenchmarkValidation/BenchmarkValidationView';
import AbdmProductionView from './components/Abdm/AbdmProductionView';
import PatientChatbotView from './components/PatientChatbot/PatientChatbotView';
import GenAiChatModal from './components/Chatbot/GenAiChatModal';
import VoiceAssistantModal from './components/VoiceAssistant/VoiceAssistantModal';
import { Mic, Bot } from 'lucide-react';

import { SAMPLE_PATIENTS } from './data/samplePatients';
import { analyzeImageQuality } from './core/qualityGuardian';
import { classifyRetinaImage } from './core/drClassifier';
import { detectRetinalLesions } from './core/lesionDetector';
import { evaluateEvidenceConcordance } from './core/concordanceEngine';
import { syncManager } from './core/offlineSync';

export default function App() {
  const [activeTab, setActiveTab] = useState('screening');
  const [selectedPatient, setSelectedPatient] = useState(SAMPLE_PATIENTS[0]);
  const [simulateConflict, setSimulateConflict] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('ONLINE');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Modals state
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [showDemoTour, setShowDemoTour] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Subscribe to offline sync manager
  useEffect(() => {
    syncManager.setNetworkStatus(networkStatus);
    const unsubscribe = syncManager.subscribe((status, queue) => {
      setPendingSyncCount(queue.filter(q => q.status === 'PENDING').length);
    });
    return unsubscribe;
  }, [networkStatus]);

  // Handle custom image upload
  const handleUploadCustomImage = (url, fileName) => {
    const customPatient = {
      id: `CUSTOM-${Date.now().toString().slice(-4)}`,
      abhaId: '91-0000-1111-2222',
      name: `Custom Upload (${fileName.slice(0, 15)})`,
      age: 55,
      gender: 'Unknown',
      village: 'Field Clinic',
      block: 'Rural Block',
      district: 'Nanded',
      state: 'Maharashtra',
      phcCenter: 'Mobile Screening Van',
      diabetesDurationYears: 5,
      hba1c: 7.5,
      bp: '130/85 mmHg',
      currentEye: 'OD (Right Eye)',
      imageFile: url,
      condition: fileName.toLowerCase().includes('blur') ? 'blurred' : 'moderate_dr',
      history: []
    };
    setSelectedPatient(customPatient);
  };

  // Run AI Core Engines dynamically based on selected patient and conflict toggle
  const qualityResult = analyzeImageQuality(selectedPatient.condition);
  const classifierResult = classifyRetinaImage(selectedPatient.condition, qualityResult.overallQuality);
  const lesionResult = detectRetinalLesions(selectedPatient.condition);
  const concordanceResult = evaluateEvidenceConcordance({
    classifierResult,
    lesionResult,
    qualityResult,
    simulateConflict
  });

  // Facts for GenAI explanation
  const factsForGenAi = {
    grade: classifierResult.grade,
    level: classifierResult.level,
    confidence: classifierResult.calibratedConfidence,
    qualityScore: qualityResult.overallQuality,
    evidenceConsistency: concordanceResult.concordanceStatus.toLowerCase(),
    lesions: lesionResult.counts,
    eye: selectedPatient.currentEye,
    isConflict: concordanceResult.isConflict,
    isUngradable: !qualityResult.gradable
  };

  // Guided demo tour step handler
  const handleApplyDemoStep = (step) => {
    setActiveTab(step.targetTab);
    if (typeof step.patientIdx === 'number') {
      setSelectedPatient(SAMPLE_PATIENTS[step.patientIdx]);
    }
    if (typeof step.conflictMode === 'boolean') {
      setSimulateConflict(step.conflictMode);
    }
  };

  // Voice Command Action Handler
  const handleExecuteVoiceAction = (action, payload) => {
    switch (action) {
      case 'SELECT_PATIENT_0':
        setSelectedPatient(SAMPLE_PATIENTS[0]);
        setActiveTab('screening');
        break;
      case 'SELECT_PATIENT_1':
        setSelectedPatient(SAMPLE_PATIENTS[1]);
        setActiveTab('screening');
        break;
      case 'SELECT_PATIENT_2':
        setSelectedPatient(SAMPLE_PATIENTS[2]);
        setActiveTab('screening');
        break;
      case 'SELECT_PATIENT_3':
        setSelectedPatient(SAMPLE_PATIENTS[3]);
        setActiveTab('screening');
        break;
      case 'NAV_DOCTOR':
        setActiveTab('doctor');
        break;
      case 'NAV_ABDM':
        setActiveTab('abdm');
        break;
      case 'NAV_PATIENT':
        setActiveTab('patientchat');
        break;
      case 'NAV_BENCHMARK':
        setActiveTab('benchmark');
        break;
      case 'CHECK_CONCORDANCE':
        setActiveTab('screening');
        setSimulateConflict(true);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Sticky Header with navigation & status */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        networkStatus={networkStatus}
        setNetworkStatus={setNetworkStatus}
        pendingSyncCount={pendingSyncCount}
        onStartDemoTour={() => setShowDemoTour(true)}
        onOpenPitchDeck={() => setShowPitchDeck(true)}
        onOpenVoiceAssistant={() => setShowVoiceModal(true)}
        onOpenChatbot={() => setShowChatModal(true)}
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1, padding: '1.5rem 1.5rem 3rem 1.5rem' }}>
        
        {/* TAB 1: Clinical Screening (6-Step Workflow) */}
        {activeTab === 'screening' && (
          <div className="animate-fade-in">
            {/* Step 1: Patient Cohort Selector */}
            <PatientSelector 
              selectedPatient={selectedPatient}
              onSelectPatient={(p) => {
                setSelectedPatient(p);
                setSimulateConflict(false);
              }}
              onUploadCustomImage={handleUploadCustomImage}
            />

            {/* Step 2: Engine 1 Image Quality Guardian */}
            <ImageGuardianInspector 
              qualityResult={qualityResult}
              onTriggerRetake={() => {
                alert('Smart Retake Guidance triggered: Please align patient with chin rest, maintain 2-3 cm distance, and steady capture.');
              }}
            />

            {/* Step 3 & 4: Engine 2 & 3 Triple-Channel Evidence-XAI */}
            <MultiEvidenceViewer 
              imageSrc={selectedPatient.imageFile}
              imageType={selectedPatient.condition}
              lesionResult={lesionResult}
              classifierResult={classifierResult}
              simulateConflict={simulateConflict}
            />

            {/* Step 5: Flagship Innovation - Evidence Concordance Card */}
            <ConcordanceCard 
              concordanceResult={concordanceResult}
              classifierResult={classifierResult}
              simulateConflict={simulateConflict}
              onToggleSimulateConflict={() => setSimulateConflict(!simulateConflict)}
            />

            {/* Step 6: Controlled GenAI Explanation & Multilingual Reports */}
            <GenAiReportSection 
              facts={factsForGenAi}
              onOpenReferralModal={() => setShowReferralModal(true)}
              onOpenFhirModal={() => setShowFhirModal(true)}
            />
          </div>
        )}

        {/* TAB 2: Doctor 30-Second Triage Desk */}
        {activeTab === 'doctor' && (
          <DoctorTriageDesk 
            onSignoffCase={() => {
              alert('Clinical verification signed with digital tele-ophthalmology key.');
            }}
          />
        )}

        {/* TAB 3: Rural Stress Test (Benchmark Lab) */}
        {activeTab === 'stresstest' && (
          <RobustnessLab />
        )}

        {/* TAB 4: Simulink District Digital Twin */}
        {activeTab === 'simulink' && (
          <DigitalTwinSimulator />
        )}

        {/* TAB 5: Longitudinal Retinal Progression */}
        {activeTab === 'timeline' && (
          <PatientHistoryView />
        )}

        {/* TAB 6: District Population Health Analytics */}
        {activeTab === 'analytics' && (
          <DistrictAnalytics />
        )}

        {/* TAB 7: Clinical Benchmark & Model Ablation Study */}
        {activeTab === 'benchmark' && (
          <BenchmarkValidationView />
        )}

        {/* TAB 8: ABDM Production Gateway & Health Locker */}
        {activeTab === 'abdm' && (
          <AbdmProductionView 
            patient={selectedPatient}
            screeningResult={classifierResult}
            concordanceResult={concordanceResult}
          />
        )}

        {/* TAB 9: Advanced Rural Patient Chatbot ("Drishti Saathi") */}
        {activeTab === 'patientchat' && (
          <PatientChatbotView 
            patient={selectedPatient}
            screeningResult={classifierResult}
            concordanceResult={concordanceResult}
          />
        )}

      </main>

      {/* Floating Action Buttons for Ambient Voice & Clinical Copilot */}
      <div style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 1500
      }}>
        <button
          id="floating-voice-btn"
          onClick={() => setShowVoiceModal(true)}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(168, 85, 247, 0.5)',
            transition: 'all 0.2s ease'
          }}
          title="Ambient Voice Assistant"
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Mic size={24} />
        </button>

        <button
          id="floating-chat-btn"
          onClick={() => setShowChatModal(true)}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.5)',
            transition: 'all 0.2s ease'
          }}
          title="Clinical GenAI Copilot"
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Bot size={24} />
        </button>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.25rem 0',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.02)'
      }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <strong style={{ color: 'var(--color-navy)' }}>Drishti AI</strong> • Rural Healthcare & Tele-Retinal Intelligence
          </div>
          <div>
            Built with Deep Learning, Grad-CAM, Evidence Concordance & Simulink District Digital Twin
          </div>
          <div style={{ color: 'var(--color-teal)', fontWeight: 600 }}>
            DPDP Rules 2025 & NRCES NDHM Compliant
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReferralModal 
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        patient={selectedPatient}
        screeningResult={classifierResult}
        concordanceResult={concordanceResult}
      />

      <FhirModal 
        isOpen={showFhirModal}
        onClose={() => setShowFhirModal(false)}
        patient={selectedPatient}
        screeningResult={classifierResult}
        concordanceResult={concordanceResult}
      />

      <PitchPresentation 
        isOpen={showPitchDeck}
        onClose={() => setShowPitchDeck(false)}
      />

      <DemoTourModal 
        isOpen={showDemoTour}
        onClose={() => setShowDemoTour(false)}
        onApplyDemoStep={handleApplyDemoStep}
      />

      <GenAiChatModal 
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        patient={selectedPatient}
        screeningResult={classifierResult}
        concordanceResult={concordanceResult}
      />

      <VoiceAssistantModal 
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onExecuteAction={handleExecuteVoiceAction}
        currentPatient={selectedPatient}
      />

    </div>
  );
}
