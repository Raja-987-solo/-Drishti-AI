import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Volume2, 
  VolumeX, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  Smartphone, 
  Eye, 
  Sparkles, 
  Languages,
  User,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon
} from 'lucide-react';
import { PATIENT_FAQS, sendSmsAppointmentBooking } from '../../core/patientChatbotEngine';
import { speakText, stopSpeaking } from '../../core/voiceAssistantEngine';
import { SUPPORTED_LANGUAGES } from '../../core/genAiExplainer';

export default function PatientChatbotView({ 
  patient, 
  screeningResult, 
  concordanceResult 
}) {
  const [selectedLang, setSelectedLang] = useState('hi'); // Default to Hindi for rural accessibility
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [customInput, setCustomInput] = useState('');

  // Initial welcome greeting on mount or patient change
  useEffect(() => {
    const welcomeMessages = {
      hi: `नमस्ते ${patient.name} जी! मैं आपका डिजिटल नेत्र साथी (Drishti Saathi) हूँ। आज आपके गाँव के स्वास्थ्य केंद्र में आपकी आँखों की जाँच पूरी हो गई है। घबराइए नहीं, अपनी जाँच, दवाइयों, खान-पान या अस्पताल के बारे में आप मुझसे अपनी भाषा में कोई भी सवाल पूछ सकते हैं।`,
      mr: `नमस्कार ${patient.name} जी! मी आपला डिजिटल नेत्र साथी (Drishti Saathi) आहे. आज आपल्या गावातील आरोग्य केंद्रात डोळ्यांची तपासणी पूर्ण झाली आहे. तपासणी, औषधे किंवा उपचारांविषयी आपण मला मराठीत कोणतेही प्रश्न विचारू शकता.`,
      en: `Welcome, ${patient.name}! I am your Drishti Saathi eye companion. Your screening at the health centre is complete. Please feel free to ask any questions about your vision, diet, treatment, or hospital visits.`,
      bn: `নমস্কার ${patient.name} বাবু! আমি আপনার দৃষ্টি সাথী। আজ আপনার চোখের পরীক্ষা সম্পন্ন হয়েছে। কোনো চিন্তা করবেন না, চোখ বা চিকিৎসা সম্পর্কিত যেকোনো প্রশ্ন আপনি আমাকে করতে পারেন।`,
      ta: `வணக்கம் ${patient.name}! உங்கள் கண் பரிசோதனை முடிந்தது. சிகிச்சை மற்றும் உணவு முறை குறித்த உங்கள் சந்தேகங்களை என்னிடம் கேட்கலாம்.`,
      te: `నమస్కారం ${patient.name} గారు! మీ కంటి పరీక్ష పూర్తయింది. చికిత్స మరియు ఆహార జాగ్రత్తల గురించి మీరు నన్ను ఏవైనా ప్రశ్నలు అడగవచ్చు.`
    };

    const initialText = welcomeMessages[selectedLang] || welcomeMessages.hi;
    setChatHistory([
      {
        sender: 'saathi',
        text: initialText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    if (autoSpeak) {
      speakText(initialText, selectedLang, () => setIsSpeaking(false), () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  }, [patient.id, selectedLang]);

  const handleAskFaq = (faq) => {
    const qText = faq.question[selectedLang] || faq.question.en;
    const aText = faq.answer[selectedLang] || faq.answer.en;

    const userEntry = {
      sender: 'user',
      text: qText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const saathiEntry = {
      sender: 'saathi',
      text: aText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userEntry, saathiEntry]);

    if (autoSpeak) {
      stopSpeaking();
      setIsSpeaking(true);
      speakText(aText, selectedLang, () => setIsSpeaking(false), () => setIsSpeaking(false));
    }
  };

  const handleSendCustom = () => {
    if (!customInput.trim()) return;
    const text = customInput;
    setCustomInput('');

    const userEntry = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Generic empathetic fallback response in selected vernacular
    const genericAnswers = {
      hi: `आपके सवाल के लिए धन्यवाद। आपकी आँख की सुरक्षा हमारे लिए सबसे पहले है। प्राथमिक स्वास्थ्य केंद्र (PHC) की रिपोर्ट के अनुसार, समय पर दवा लेने और जिला अस्पताल में डॉक्टर को दिखाने से आपकी आँखें सुरक्षित रहेंगी। क्या आप डॉक्टर से मिलने का समय बुक करना चाहते हैं?`,
      mr: `तुमच्या प्रश्नाबद्दल धन्यवाद. वेळेवर औषधे घेणे आणि जिल्हा रुग्णालयातील नेत्रतज्ज्ञांचा सल्ला घेणे दृष्टी सुरक्षित ठेवण्यासाठी पुरेसे आहे. आपण डॉक्टरांची अपॉइंटमेंट बुक करू इच्छिता का?`,
      en: `Thank you for asking. Based on your screening today, timely checkups and proper sugar regulation will keep your eyesight safe. Would you like to schedule an appointment with the district hospital specialist?`,
      bn: `আপনার প্রশ্নের জন্য ধন্যবাদ। সময়মতো ওষুধ খাওয়া ও হাসপাতালে ডাক্তার দেখানোই দৃষ্টি সুরক্ষিত রাখার শ্রেষ্ঠ উপায়। আপনি কি ডাক্তারবাবুর সাথে দেখা করার সময় বুক করতে চান?`,
      ta: `உங்கள் கேள்விக்கு நன்றி. சரியான நேரத்தில் சிகிச்சை பெறுவது உங்கள் பார்வையை பாதுகாக்கும். நீங்கள் மருத்துவரை சந்திக்க முன்பதிவு செய்ய விரும்புகிறீர்களா?`,
      te: `మీ ప్రశ్నకు ధన్యవాదాలు. సరైన సమయంలో డాక్టరు సలహా తీసుకోవడం ద్వారా చూపును కాపాడుకోవచ్చు. మీరు అపాయింట్‌మెంట్ బుక్ చేయాలనుకుంటున్నారా?`
    };

    const saathiEntry = {
      sender: 'saathi',
      text: genericAnswers[selectedLang] || genericAnswers.en,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userEntry, saathiEntry]);
    if (autoSpeak) {
      speakText(saathiEntry.text, selectedLang, () => setIsSpeaking(false), () => setIsSpeaking(false));
    }
  };

  const handleSpeechToggle = (text) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, selectedLang, () => setIsSpeaking(false), () => setIsSpeaking(false));
    }
  };

  const handleConfirmBooking = () => {
    const booking = sendSmsAppointmentBooking({ patient });
    setBookingConfirmed(booking);
  };

  // Accessibility theme variables
  const containerBg = highContrast ? '#000000' : 'transparent';
  const panelBg = highContrast ? '#050505' : '#ffffff';
  const textColor = highContrast ? '#ffff00' : 'var(--color-navy)';
  const borderColor = highContrast ? '#ffff00' : 'var(--border-subtle)';
  const fontSizeBase = largeFont ? '1.05rem' : '0.88rem';

  return (
    <div className="container" style={{ paddingBottom: '3rem', background: containerBg }}>
      
      {/* Top Banner & Accessibility Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem', background: panelBg, borderColor }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d9488, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <HeartHandshake size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0, color: highContrast ? '#ffff00' : 'var(--color-navy)' }}>
                  Drishti Saathi (दृष्टी साथी)
                </h2>
                <span className="status-badge badge-teal" style={{ fontSize: '0.65rem' }}>
                  RURAL PATIENT COMPANION
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Empathetic, voice-enabled retinal care companion in your mother tongue
              </p>
            </div>
          </div>

          {/* Accessibility Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {/* Vernacular Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <Languages size={14} color="var(--color-teal)" />
              {SUPPORTED_LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLang(l.code)}
                  style={{
                    background: selectedLang === l.code ? 'var(--color-teal)' : 'transparent',
                    color: selectedLang === l.code ? '#fff' : 'var(--color-navy)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>

            {/* Font Size Toggle */}
            <button
              onClick={() => setLargeFont(!largeFont)}
              style={{
                background: largeFont ? 'var(--color-teal)' : '#ffffff',
                color: largeFont ? '#fff' : 'var(--color-navy)',
                border: '1px solid var(--border-card)',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {largeFont ? <ZoomOut size={13} /> : <ZoomIn size={13} />}
              {largeFont ? 'Normal Font' : 'Large Font (125%)'}
            </button>

            {/* High Contrast Mode */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              style={{
                background: highContrast ? '#ffff00' : '#ffffff',
                color: highContrast ? '#000' : 'var(--color-navy)',
                border: '1px solid var(--border-card)',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Sun size={13} />
              {highContrast ? 'High Contrast ON' : 'High Contrast'}
            </button>

            {/* Auto-Readout Toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              style={{
                background: autoSpeak ? '#f0fdf4' : '#ffffff',
                color: autoSpeak ? '#15803d' : 'var(--color-navy)',
                border: autoSpeak ? '1px solid #bbf7d0' : '1px solid var(--border-card)',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {autoSpeak ? <Volume2 size={13} /> : <VolumeX size={13} />}
              {autoSpeak ? 'Voice Audio ON' : 'Audio Muted'}
            </button>
          </div>

        </div>
      </div>

      {/* Main Grid: Patient Status & FAQ Chips on Left, Live Dialogue on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* Left Column: Patient Status Card & FAQ Chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Patient Card */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: panelBg, borderColor }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                fontWeight: '700',
                fontSize: '1.1rem'
              }}>
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: highContrast ? '#ffff00' : 'var(--color-navy)' }}>
                  {patient.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {patient.age} वर्ष • {patient.gender === 'Male' ? 'पुरुष' : 'महिला'} • {patient.village}
                </div>
              </div>
            </div>

            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>
                जाँच का परिणाम (Screening Summary)
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--color-navy)', marginTop: '3px' }}>
                {screeningResult?.grade || 'Moderate NPDR'}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                शुरुआती लक्षण • समय पर इलाज से नज़र पूरी तरह सुरक्षित रह सकती है
              </div>
            </div>

            {/* Quick Action: Book Appointment */}
            <button
              onClick={() => setShowBookingModal(true)}
              style={{
                width: '100%',
                background: 'var(--color-teal)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
              }}
            >
              <Calendar size={16} /> डॉक्टर से मिलने का समय बुक करें
            </button>
          </div>

          {/* Rural FAQ Chips */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: panelBg, borderColor }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: highContrast ? '#ffff00' : 'var(--color-navy)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--color-teal)" /> अक्सर पूछे जाने वाले सवाल (FAQs):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PATIENT_FAQS.map(faq => (
                <button
                  key={faq.id}
                  onClick={() => handleAskFaq(faq)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-card)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    textAlign: 'left',
                    color: highContrast ? '#ffff00' : 'var(--color-navy)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdfa'; e.currentTarget.style.borderColor = 'var(--color-teal)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = 'var(--border-card)'; }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{faq.icon}</span>
                  <span style={{ flex: 1, fontWeight: '500' }}>{faq.question[selectedLang] || faq.question.en}</span>
                  <ChevronRight size={14} color="#94a3b8" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Conversational Dialogue Area */}
        <div className="glass-panel" style={{
          padding: '1.25rem',
          background: panelBg,
          borderColor,
          display: 'flex',
          flexDirection: 'column',
          height: '620px'
        }}>
          
          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: msg.sender === 'user' ? 'var(--color-navy)' : 'var(--color-teal)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {msg.sender === 'user' ? <User size={16} /> : <HeartHandshake size={18} />}
                </div>

                <div style={{
                  maxWidth: '78%',
                  background: msg.sender === 'user' 
                    ? 'rgba(13, 148, 136, 0.1)' 
                    : highContrast ? '#111' : '#f8fafc',
                  border: msg.sender === 'user' 
                    ? '1px solid rgba(13, 148, 136, 0.3)' 
                    : highContrast ? '2px solid #ffff00' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  color: highContrast ? '#ffff00' : 'var(--color-navy)',
                  fontSize: fontSizeBase,
                  lineHeight: 1.6,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div>{msg.text}</div>

                  {/* Audio Listen button for assistant response */}
                  {msg.sender === 'saathi' && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem' }}>
                      <button
                        onClick={() => handleSpeechToggle(msg.text)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-teal-dark)',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '4px'
                        }}
                      >
                        <Volume2 size={14} /> आवाज में सुनें (Listen)
                      </button>
                      <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {msg.time}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Custom Input Bar */}
          <div style={{
            marginTop: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '0.65rem'
          }}>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCustom()}
              placeholder="यहाँ अपना सवाल लिखें या ऊपर से कोई सवाल चुनें..."
              style={{
                flex: 1,
                background: '#ffffff',
                border: '1px solid var(--border-card)',
                borderRadius: '8px',
                padding: '0.65rem 0.9rem',
                color: highContrast ? '#ffff00' : 'var(--color-navy)',
                fontSize: fontSizeBase,
                outline: 'none'
              }}
            />
            <button
              onClick={handleSendCustom}
              disabled={!customInput.trim()}
              style={{
                background: 'var(--color-teal)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.65rem 1.2rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: customInput.trim() ? 'pointer' : 'not-allowed',
                opacity: customInput.trim() ? 1 : 0.5,
                boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)'
              }}
            >
              पूछें
            </button>
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2500,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-card)',
            borderRadius: '16px',
            padding: '1.5rem',
            maxWidth: '480px',
            width: '100%',
            boxShadow: 'var(--shadow-modal)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-navy)', fontSize: '1.15rem' }}>
              जिला अस्पताल में डॉक्टर से मिलने का समय
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              मरीज़: <strong>{patient.name}</strong> • आभा ID: <code>{patient.abhaId}</code>
            </p>

            {bookingConfirmed ? (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: '700', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={18} /> समय सफलतापूर्वक बुक हो गया!
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-navy)', lineHeight: 1.5 }}>
                  {bookingConfirmed.smsText}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  मरीज़ के मोबाइल पर पुष्टि SMS भेजा गया है।
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--color-navy)' }}>
                  <div><strong>अस्पताल:</strong> जिला नागरिक चिकित्सालय, खड़कपुरा, नांदेड</div>
                  <div style={{ marginTop: '3px' }}><strong>तारीख:</strong> 24 सितम्बर 2026 (गुरुवार)</div>
                  <div style={{ marginTop: '3px' }}><strong>समय:</strong> सुबह 10:30 बजे</div>
                  <div style={{ marginTop: '3px', color: '#15803d', fontWeight: '700' }}><strong>खर्च:</strong> ₹0 मुफ़्त (आयुष्मान भारत कार्ड द्वारा)</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => { setShowBookingModal(false); setBookingConfirmed(null); }}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem' }}
              >
                बंद करें
              </button>
              {!bookingConfirmed && (
                <button
                  onClick={handleConfirmBooking}
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem' }}
                >
                  पुष्टि करें (Confirm & Send SMS)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
