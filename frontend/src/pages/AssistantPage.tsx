import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Upload, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  User as UserIcon,
  HelpCircle,
} from 'lucide-react';
import { LanguageCode, ChatMessage, User } from '../types';
import { translations } from '../translations';
import { api } from '../api';

interface AssistantPageProps {
  language: LanguageCode;
  currentUser: User | null;
  onOpenUploadModal: () => void;
  onSelectSchemeForApplication: (schemeId: number) => void;
  initialPrompt?: string;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({
  language,
  currentUser,
  onOpenUploadModal,
  onSelectSchemeForApplication,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Load chat history or initialize welcome
  useEffect(() => {
    loadHistory();
  }, [currentUser?.id, language]);

  // Handle passed initial prompt (e.g. from Landing Page Widow Demo)
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadHistory = async () => {
    try {
      const sessionId = `session_${currentUser?.id || 1}_${language}`;
      const history = await api.getChatHistory(sessionId, currentUser?.id || 1);
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        const welcomeText = language === 'mr' 
          ? "नमस्कार! मी जनसेवा AI — तुमचा शासकीय सेवा व कल्याणकारी योजना सहाय्यक आहे. तुमच्या परिस्थितीबद्दल साध्या भाषेत सांगा (उदा. 'माझे पती शेतकरी होते, त्यांचे निधन झाले'). मी केंद्र व राज्य शासनाच्या सर्व योजना शोधून अर्ज भरण्यात मदत करेन."
          : language === 'hi'
          ? "नमस्ते! मैं जनसेवा AI हूँ — आपका सरकारी सेवा और कल्याणकारी योजनाओं का मार्गदर्शक। आप अपनी स्थिति के बारे में बताएं, मैं आपके लिए सभी पात्र योजनाओं की पहचान कर आवेदन तैयार करूँगा।"
          : language === 'gu'
          ? "નમસ્તે! હું જનસેવા AI છું — તમારો સરકારી યોજના સહાયક. તમારી પરિસ્થિતિ વિશે કહો, હું તમારા માટે તમામ યોગ્ય યોજનાઓ શોધી આપીશ."
          : language === 'ta'
          ? "வணக்கம்! நான் ஜன்சேவா AI — உங்கள் அரசு திட்ட வழிகாட்டி. உங்கள் தேவைகளை கூறுங்கள், அரசு நன்மைகளை பெற உதவுகிறேன்."
          : language === 'te'
          ? "నమస్కారం! నేను జనసేవ AI — ప్రభుత్వ పథకాల సహాయకుడిని. మీ అవసరాలను తెలపండి, అర్హత గల పథకాలను కనుగొంటాను."
          : language === 'bn'
          ? "নমস্কার! আমি জনসেবা AI — আপনার সরকারি প্রকল্প সহায়ক। আপনার সমস্যা বলুন, আমি সমস্ত যোগ্য প্রকল্প খুঁজে দেব।"
          : "Namaste! I am JanSeva AI — your one-stop Government Service Agent. Tell me about your situation in plain words (e.g. 'My husband was a farmer and recently passed away'). I will identify all eligible central and state schemes and help you apply directly.";

        setMessages([
          {
            id: 1,
            conversation_id: 1,
            sender: 'assistant',
            text: welcomeText,
            language: language,
            has_audio: true,
            suggested_actions: [
              t.quickDemoScenario,
              language === 'mr' ? 'संजय गांधी निराधार योजना' :
              language === 'hi' ? 'संजय गांधी निराधार योजना' :
              language === 'gu' ? 'સંજય ગાંધી નિરાધાર યોજના' :
              language === 'ta' ? 'சஞ்சய் காந்தி ஆதரவற்றோர் திட்டம்' :
              language === 'te' ? 'సంజయ్ గాంధీ నిరాధార పథకం' :
              language === 'bn' ? 'সঞ্জয় গান্ধী নিরাধার যোজনা' :
              'Sanjay Gandhi Niradhar Yojana',
              language === 'mr' ? 'पी.एम. किसान वारस हक्क' :
              language === 'hi' ? 'पीएम किसान वारिस हस्तांतरण' :
              language === 'gu' ? 'પીએમ કિસાન વારસાઈ ટ્રાન્સફર' :
              language === 'ta' ? 'விவசாயி வாரிசு பரிமாற்றம்' :
              language === 'te' ? 'పీఎం కిసాన్ వారసత్వ బదిలీ' :
              language === 'bn' ? 'পিএম কিষাণ উত্তরাধিকার স্থানান্তর' :
              'PM-KISAN Succession Transfer'
            ],
            follow_up_questions: [
              language === 'mr' ? 'पतींचा मृत्यू दाखला उपलब्ध आहे का?' :
              language === 'hi' ? 'क्या पति का मृत्यु प्रमाण पत्र उपलब्ध है?' :
              language === 'gu' ? 'શું પતિનું મૃત્યુ પ્રમાણપત્ર ઉપલબ્ધ છે?' :
              language === 'ta' ? 'கணவரின் இறப்புச் சான்றிதழ் உள்ளதா?' :
              language === 'te' ? 'భర్త మరణ ధృవీకరణ పత్రం ఉందా?' :
              language === 'bn' ? 'স্বামীর মৃত্যুর শংসাপত্র আছে কি?' :
              'Do you hold your husband\'s Death Certificate?',
              language === 'mr' ? 'शेतीचा ७/१२ उतारा आहे का?' :
              language === 'hi' ? 'क्या कृषि भूमि (7/12) का रिकॉर्ड है?' :
              language === 'gu' ? 'શું ખેતીની જમીનનો રેકોર્ડ (7/12) છે?' :
              language === 'ta' ? 'விவசாய நில ஆவணங்கள் உள்ளதா?' :
              language === 'te' ? 'వ్యవసాయ భూమి పట్టాదారు పాస్ పుస్తకం ఉందా?' :
              language === 'bn' ? 'কৃষিজমির খতিয়ান বা রেকর্ড আছে কি?' :
              'Do you have agricultural land (7/12 record)?'
            ],
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const sessionId = `session_${currentUser?.id || 1}_${language}`;
    const userMsg: ChatMessage = {
      id: Date.now(),
      conversation_id: 1,
      sender: 'user',
      text: text,
      language: language,
      has_audio: false,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const aiReply = await api.askAssistant(text, language, sessionId, currentUser?.id || 1);
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          conversation_id: 1,
          sender: 'assistant',
          text: language === 'mr' ? "शासकीय सर्व्हरशी संपर्क साधताना अडचण आली. कृपया पुन्हा प्रयत्न करा." : "I encountered a brief connection error while contacting the welfare database. Please verify your connection or try again.",
          language: language,
          has_audio: false,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API: Voice-to-Text
  const handleToggleVoiceInput = () => {
    const windowWithSpeech = window as any;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Web Speech Synthesis: Text-to-Speech
  const handleSpeakText = (text: string) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleResetChat = () => {
    const welcomeText = language === 'mr' 
      ? "नमस्कार! मी जनसेवा AI — तुमचा शासकीय सेवा व कल्याणकारी योजना सहाय्यक आहे. तुमच्या परिस्थितीबद्दल साध्या भाषेत सांगा (उदा. 'माझे पती शेतकरी होते, त्यांचे निधन झाले'). मी केंद्र व राज्य शासनाच्या सर्व योजना शोधून अर्ज भरण्यात मदत करेन."
      : language === 'hi'
      ? "नमस्ते! मैं जनसेवा AI हूँ — आपका सरकारी सेवा और कल्याणकारी योजनाओं का मार्गदर्शक। आप अपनी स्थिति के बारे में बताएं, मैं आपके लिए सभी पात्र योजनाओं की पहचान कर आवेदन तैयार करूँगा।"
      : language === 'gu'
      ? "નમસ્તે! હું જનસેવા AI છું — તમારો સરકારી યોજના સહાયક. તમારી પરિસ્થિતિ વિશે કહો, હું તમારા માટે તમામ યોગ્ય યોજનાઓ શોધી આપીશ."
      : language === 'ta'
      ? "வணக்கம்! நான் ஜன்சேவா AI — உங்கள் அரசு திட்ட வழிகாட்டி. உங்கள் தேவைகளை கூறுங்கள், அரசு நன்மைகளை பெற உதவுகிறேன்."
      : language === 'te'
      ? "నమస్కారం! నేను జనసేవ AI — ప్రభుత్వ పథకాల సహాయకుడిని. మీ అవసరాలను తెలపండి, అర్హత గల పథకాలను కనుగొంటాను."
      : language === 'bn'
      ? "নমস্কার! আমি জনসেবা AI — আপনার সরকারি প্রকল্প সহায়ক। আপনার সমস্যা বলুন, আমি সমস্ত যোগ্য প্রকল্প খুঁজে দেব।"
      : "Namaste! I am JanSeva AI — your one-stop Government Service Agent. Tell me about your situation in plain words (e.g. 'My husband was a farmer and recently passed away'). I will identify all eligible central and state schemes and help you apply directly.";

    setMessages([
      {
        id: Date.now(),
        conversation_id: 1,
        sender: 'assistant',
        text: welcomeText,
        language: language,
        has_audio: true,
        suggested_actions: [
          t.quickDemoScenario,
          language === 'mr' ? 'संजय गांधी निराधार योजना' : language === 'hi' ? 'संजय गांधी निराधार योजना' : 'Sanjay Gandhi Niradhar Yojana',
          language === 'mr' ? 'पी.एम. किसान वारस हक्क' : language === 'hi' ? 'पीएम किसान वारिस हस्तांतरण' : 'PM-KISAN Succession Transfer'
        ],
        follow_up_questions: [
          language === 'mr' ? 'पतींचा मृत्यू दाखला उपलब्ध आहे का?' : language === 'hi' ? 'क्या पति का मृत्यु प्रमाण पत्र उपलब्ध है?' : 'Do you hold your husband\'s Death Certificate?',
          language === 'mr' ? 'शेतीचा ७/१२ उतारा आहे का?' : language === 'hi' ? 'क्या कृषि भूमि (7/12) का रिकॉर्ड है?' : 'Do you have agricultural land records?'
        ]
      }
    ]);
  };

  const suggestedPrompts = [
    {
      title: language === 'mr' ? "पतीचे निधन झाले, शेतकरी होते" : language === 'hi' ? "पति का निधन हुआ, किसान थे" : "Husband was a farmer and passed away",
      prompt: language === 'mr' ? "माझे पती शेतकरी होते, त्यांचे नुकतेच निधन झाले. आम्हाला कोणती शासकीय मदत मिळू शकते?" : language === 'hi' ? "मेरे पति किसान थे, उनका निधन हो गया है। मुझे कौन सी सरकारी सहायता मिलेगी?" : "My husband was a farmer and recently passed away. What government assistance can I receive?"
    },
    {
      title: language === 'mr' ? "इंदिरा गांधी विधवा पेन्शन" : "Indira Gandhi Widow Pension",
      prompt: language === 'mr' ? "इंदिरा गांधी राष्ट्रीय विधवा पेन्शन योजनेची पात्रता व कागदपत्रे सांगा." : "Tell me the eligibility rules and required documents for Indira Gandhi National Widow Pension."
    },
    {
      title: language === 'mr' ? "पी.एम. किसान वारस नोंद" : "PM-KISAN Heirship Transfer",
      prompt: language === 'mr' ? "शेतकरी विधवेला पीएम किसानचा ६,००० रुपयांचा हप्ता स्वतःच्या नावावर कसा हस्तांतरित करता येईल?" : "How can a farmer's widow transfer the PM-KISAN ₹6,000 yearly benefit to her name?"
    },
    {
      title: language === 'mr' ? "आयुष्मान मोफत उपचार कार्ड" : "Ayushman Free Health Card",
      prompt: language === 'mr' ? "माझ्या कुटुंबाला आयुष्मान भारत ५ लाख रुपयांचे मोफत आरोग्य कार्ड कसे मिळेल?" : "How do I check if my family qualifies for the Ayushman Bharat ₹5 Lakh cashless treatment card?"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-130px)]">
      {/* Top Agent Identity Bar */}
      <div className="bg-[#0C382E] text-white rounded-t-2xl p-4 flex items-center justify-between shadow-md shrink-0 border-b border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-base">{t.appName} — {t.navAssistant}</h2>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                {t.assistantActiveBadge}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              {t.assistantSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="bg-[#165646] hover:bg-[#1f735e] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/40 flex items-center gap-1.5 transition"
        >
          <Upload className="w-3.5 h-3.5 text-amber-300" />
          <span>{t.uploadDocBtn}</span>
        </button>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 bg-white border-x border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-[#0C382E] text-amber-400 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div 
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser 
                      ? 'bg-[#0C382E] text-white rounded-tr-xs' 
                      : 'bg-[#FAF9F5] text-stone-900 border border-stone-200 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                      <span>{t.appName} Public Service AI</span>
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="text-stone-600 hover:text-[#0C382E] p-1 rounded transition flex items-center gap-1"
                        title={t.listenBtn}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5 text-stone-600" />}
                        <span className="text-[10px] font-bold">{t.listenBtn}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow-up Question Prompts */}
                {!isUser && msg.follow_up_questions && msg.follow_up_questions.length > 0 && (
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1.5">
                    <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      {t.keyQuestionsTitle}
                    </span>
                    <ul className="list-disc list-inside text-stone-700 space-y-1">
                      {msg.follow_up_questions.map((q, qIdx) => (
                        <li key={qIdx} className="cursor-pointer hover:text-[#0C382E] font-medium" onClick={() => handleSendMessage(q)}>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Scheme Cards inside chat */}
                {!isUser && msg.recommended_schemes && msg.recommended_schemes.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                      {t.eligibleSchemesTitle}
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommended_schemes.map((sch: any) => {
                        const displayName = language === 'mr' && sch.name_mr ? sch.name_mr : language === 'hi' && sch.name_hi ? sch.name_hi : sch.name;
                        return (
                          <div 
                            key={sch.id || sch.slug}
                            className="bg-white border-2 border-emerald-600/30 hover:border-emerald-600 rounded-xl p-3 shadow-xs transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{displayName}</h4>
                                <p className="text-[11px] text-stone-500">{sch.department}</p>
                                {sch.financial_benefit_amount && (
                                  <span className="inline-block mt-1 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                                    {sch.financial_benefit_amount}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => onSelectSchemeForApplication(sch.id || 1)}
                                className="shrink-0 px-3 py-1.5 bg-[#D97706] hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition"
                              >
                                <span>{t.prepareApplication}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {!isUser && msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggested_actions.map((act, actIdx) => (
                      <button
                        key={actIdx}
                        onClick={() => {
                          if (act.toLowerCase().includes('upload') || act.includes('अपलोड')) {
                            onOpenUploadModal();
                          } else {
                            handleSendMessage(act);
                          }
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-[#0C382E] border border-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded-full transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{act}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 mt-1 shadow-xs text-xs">
                  {currentUser?.full_name?.charAt(0) || <UserIcon className="w-4 h-4" />}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-[#0C382E]" />
            <span>{t.evaluatingNotice}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="bg-[#FAF9F5] border-x border-stone-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
        <span className="text-[10px] font-bold text-stone-400 shrink-0 uppercase tracking-wider">{t.suggestedTitle}</span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.prompt)}
            className="shrink-0 bg-white hover:bg-emerald-50 text-stone-700 hover:text-[#0C382E] border border-stone-200 px-2.5 py-1 rounded-lg text-xs transition"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Message Input Box with Microphone Voice Input */}
      <div className="bg-[#FAF9F5] rounded-b-2xl border border-stone-200 p-3 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-2.5 rounded-xl border transition ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse border-red-600' 
                : 'bg-white text-stone-600 hover:text-[#0C382E] border-stone-300'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.askPlaceholder}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C382E]"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 bg-[#0C382E] hover:bg-[#165646] disabled:bg-stone-300 text-white rounded-xl shadow-xs transition flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
