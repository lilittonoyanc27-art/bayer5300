import { useState, useEffect } from "react";
import { 
  Sparkles, 
  BookOpen, 
  RotateCw, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  Trash2, 
  History, 
  Globe, 
  Award,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TICKETS, QUESTIONS_DATA, Question, Option, Ticket } from "./questionsData";

interface AIFeedback {
  isCorrect: boolean;
  accuracyStatus: string; // perfect, good, needs_work, incorrect
  armenianFeedback: string;
  improvedSpanish: string;
  alternativeSuggestions: string[];
}

interface SavedAttempt {
  questionId: string;
  questionSpanish: string;
  userAnswer: string;
  timestamp: string;
  feedback: AIFeedback;
}

export default function App() {
  // Navigation & view states
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tickets" | "all" | "history">("tickets");
  
  // Translation disclosures (key: questionId, value: isExpanded)
  const [expandedQuestionTranslations, setExpandedQuestionTranslations] = useState<Record<string, boolean>>({});
  const [expandedOptionTranslations, setExpandedOptionTranslations] = useState<Record<string, boolean>>({});
  
  // Selected option for quick multiple choice highlights (key: questionId, value: selectedOptionKey 'a'|'b'|'c')
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  // User custom free-form typed answers (key: questionId, value: customAnswerString)
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  
  // Verification states (results from /api/verify)
  const [loadingVerifications, setLoadingVerifications] = useState<Record<string, boolean>>({});
  const [verificationResults, setVerificationResults] = useState<Record<string, AIFeedback>>({});
  
  // Saved logs in localStorage for history and scoreboard stats
  const [savedAttempts, setSavedAttempts] = useState<SavedAttempt[]>([]);
  
  // Shuffling ("pull ticket") animation state
  const [isPullingTicket, setIsPullingTicket] = useState(false);
  const [shuffledTicketIndex, setShuffledTicketIndex] = useState(0);
  const [pulledTicket, setPulledTicket] = useState<Ticket | null>(null);

  // Initialize and load saved attempts from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sp_arm_attempts");
      if (stored) {
        setSavedAttempts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved attempts.", e);
    }
  }, []);

  // Save attempts helper
  const saveAttempt = (questionId: string, qSpanish: string, answer: string, fb: AIFeedback) => {
    const newAttempt: SavedAttempt = {
      questionId,
      questionSpanish: qSpanish,
      userAnswer: answer,
      timestamp: new Date().toLocaleString("hy-AM", { hour12: false }),
      feedback: fb
    };
    const updated = [newAttempt, ...savedAttempts.filter(x => x.questionId !== questionId)];
    setSavedAttempts(updated);
    try {
      localStorage.setItem("sp_arm_attempts", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Clear session data helper
  const handleResetProgress = () => {
    if (window.confirm("Ցանկանո՞ւմ եք ջնջել ձեր բոլոր պահպանված պատասխանները և առաջադիմությունը:")) {
      setSavedAttempts([]);
      setVerificationResults({});
      setCustomAnswers({});
      setSelectedOptions({});
      localStorage.removeItem("sp_arm_attempts");
    }
  };

  // Toggle individual question translation
  const toggleQuestionTranslation = (qId: string) => {
    setExpandedQuestionTranslations(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Toggle option translation (stored as questionId_optionKey)
  const toggleOptionTranslation = (qId: string, optionKey: string) => {
    const key = `${qId}_${optionKey}`;
    setExpandedOptionTranslations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle drawing a random ticket with a lovely dynamic shuffling overlay
  const handlePullRandomTicket = () => {
    setIsPullingTicket(true);
    let counter = 0;
    const interval = setInterval(() => {
      setShuffledTicketIndex(Math.floor(Math.random() * TICKETS.length));
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalTicket = TICKETS[Math.floor(Math.random() * TICKETS.length)];
        setPulledTicket(finalTicket);
        setTimeout(() => {
          setActiveTicket(finalTicket);
          setIsPullingTicket(false);
          setPulledTicket(null);
        }, 1500);
      }
    }, 100);
  };

  // Trigger Gemini API evaluation for freeform Spanish response
  const triggerVerifyAnswer = async (question: Question, answerText: string) => {
    if (!answerText || !answerText.trim()) {
      alert("Խնդրում ենք նախապես գրել կամ ընտրել ձեր պատասխանը իսպաներենով։ / Por favor, escribe tu respuesta primero.");
      return;
    }

    const qId = question.id;
    setLoadingVerifications(prev => ({ ...prev, [qId]: true }));

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.spanish,
          armenianQuestion: question.armenian,
          answer: answerText
        })
      });

      if (!response.ok) {
        throw new Error("Failed response from server");
      }

      const feedback: AIFeedback = await response.json();
      
      setVerificationResults(prev => ({
        ...prev,
        [qId]: feedback
      }));

      // Persist the attempt
      saveAttempt(qId, question.spanish, answerText, feedback);

    } catch (err) {
      console.error(err);
      alert("Սխալ տեղի ունեցավ ստուգման ժամանակ: Խնդրում ենք փորձել կրկին։ / Error de validación.");
    } finally {
      setLoadingVerifications(prev => ({ ...prev, [qId]: false }));
    }
  };

  // Populate answer with a suggested choice to let them customize
  const handlePrepopulate = (qId: string, text: string) => {
    setCustomAnswers(prev => ({
      ...prev,
      [qId]: text
    }));
  };

  // Calculate quick stats
  const perfectAttempts = savedAttempts.filter(x => x.feedback.accuracyStatus === "perfect").length;
  const totalAttempts = savedAttempts.length;

  // Filtered list of all questions (for the 'All Questions' list search tab)
  const filteredQuestions = QUESTIONS_DATA.filter(q => 
    q.spanish.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.armenian.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-150 selection:text-indigo-900 pb-16">
      
      {/* Dynamic ticket shuffling overlay */}
      <AnimatePresence>
        {isPullingTicket && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700" />
              
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block text-5xl mb-4"
              >
                🎫
              </motion.div>
              
              <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                Քաշում ենք տոմսը...
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Extrayendo un billete aleatorio...
              </p>

              {/* Changing tickets animation content snippet */}
              <div className="my-8 bg-slate-50 rounded-xl p-6 border border-slate-150 min-h-[120px] flex flex-col items-center justify-center">
                <span className="text-[10px] font-mono tracking-widest text-indigo-500 uppercase font-bold">
                  {TICKETS[shuffledTicketIndex]?.id.replace("_", " ").toUpperCase()}
                </span>
                <p className="font-display font-bold text-lg text-slate-800 mt-2">
                  {TICKETS[shuffledTicketIndex]?.title}
                </p>
                <p className="text-indigo-600 font-medium text-xs mt-1 italic">
                  {TICKETS[shuffledTicketIndex]?.titleArmenian}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <RotateCw className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-500 font-medium font-mono">Խառնում ենք քարտերը...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Header Navigation in compliance with the Professional Polish theme */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Logo and Branding with indigo background accent */}
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-lg text-white shadow-md shadow-indigo-100 shrink-0">
                <BookOpen className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
                    Billetes de Español
                    <span className="text-slate-400 font-normal text-base">/ Իսպաներենի Տոմսեր</span>
                  </h1>
                  <span className="hidden sm:inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                    PRO 3.5
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                  Քննական տոմսեր, պատասխաններ և ավտոմատ ստուգում հայերենով
                </p>
              </div>
            </div>

            {/* Global Progress Panel - Sleek two-column display aligned right */}
            <div className="flex items-center gap-6 self-end md:self-auto">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Առաջընթաց / Progreso</p>
                <p className="text-base font-bold text-indigo-600 font-mono">
                  {totalAttempts} / 31 հարց
                </p>
              </div>
              <div className="h-9 w-[1px] bg-slate-200"></div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Անթերի / Perfecto</p>
                <p className="text-base font-bold text-emerald-600 font-mono flex items-center justify-end gap-1">
                  {perfectAttempts}
                  {totalAttempts > 0 && (
                    <span className="text-xs text-slate-400 font-normal">
                      ({Math.round((perfectAttempts / totalAttempts) * 100)}%)
                    </span>
                  )}
                </p>
              </div>

              {totalAttempts > 0 && (
                <>
                  <div className="h-9 w-[1px] bg-slate-200"></div>
                  <button
                    onClick={handleResetProgress}
                    title="Զրոյացնել քննության տվյալները"
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Navigation Tab Menu */}
          <div className="flex space-x-1 mt-5 border-t border-slate-100 pt-3">
            {[
              { id: "tickets", label: "Տոմսեր (Clases)", icon: BookOpen },
              { id: "all", label: "Բոլոր հարցերը (Todo)", icon: Search },
              { id: "history", label: "Ստուգումների պատմություն (Historial)", icon: History }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id !== "tickets") {
                      setActiveTicket(null); // Return to default lists
                    }
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* Info Guidelines Callout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-6">
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex gap-3 text-indigo-900 text-sm">
          <div className="text-xl shrink-0">💡</div>
          <p className="leading-relaxed">
            <span className="font-bold text-indigo-950">Ինչպե՞ս օգտագործել.</span> Ընտրեք քննական տոմսերից մեկը, կամ սեղմեք պատահական ընտրության կոճակը: Ցանկացած հարցի կամ տարբերակի վրա սեղմելով կարող եք <span className="font-bold underline text-indigo-950">բացել հայերեն թարգմանությունը</span>։ Գրեք իսպաներեն պատասխանը և ուղարկեք AI ստուգում, որպեսզի ստանաք կառուցողական խորհուրդներ և ճշգրիտ թարգմանություններ հայերենով։
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 mt-8">
        
        {/* VIEW 1: TICKETS INTERACTIVE DECK LIST */}
        {activeTab === "tickets" && !activeTicket && (
          <div>
            {/* Shuffling call to action bar */}
            <div className="mb-10 text-center flex flex-col items-center">
              <button
                onClick={handlePullRandomTicket}
                disabled={isPullingTicket}
                className="relative uppercase tracking-wider font-display font-bold text-sm cursor-pointer bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white rounded-2xl px-8 py-5 shadow-lg shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-3 border border-indigo-500"
              >
                <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
                <span>🎫 Քաշել պատահական տոմս (Tirar Billete)</span>
              </button>
              <p className="text-slate-400 text-xs mt-3 font-medium">
                Կամ ստորև ընտրեք քննական տոմսերից որևէ մեկը՝ ինքնաստուգումը սկսելու համար
              </p>
            </div>

            {/* Grid of tickets complying to card specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TICKETS.map((ticket, index) => {
                const ticketQIds = ticket.questions.map(q => q.id);
                const answeredInTicket = savedAttempts.filter(att => ticketQIds.includes(att.questionId)).length;
                const isComplete = answeredInTicket === ticket.questions.length;

                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all text-left flex flex-col justify-between"
                  >
                    <div>
                      {/* Ticket subtitle/id and score summary */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                          {ticket.id.toUpperCase().replace("_", " ")}
                        </span>
                        
                        {answeredInTicket > 0 && (
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            isComplete 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          }`}>
                            {answeredInTicket} / {ticket.questions.length} պատասխանված
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-lg text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {ticket.title}
                      </h3>
                      <h4 className="text-slate-500 font-medium text-xs mt-1">
                        {ticket.titleArmenian}
                      </h4>

                      {/* Brief questions preview block */}
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-2">
                          Տոմսում ընդգրկված հարցերը՝
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {ticket.questions.slice(0, 3).map((q, idx) => (
                            <li key={idx} className="truncate list-disc list-inside">
                              {q.spanish}
                            </li>
                          ))}
                          {ticket.questions.length > 3 && (
                            <li className="text-indigo-600 font-semibold text-[11px] list-none pl-4">
                              + ևս {ticket.questions.length - 3} հարցեր
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTicket(ticket);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="mt-6 w-full py-3 text-center text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Բացել տոմսը / Abrir Billete</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}


        {/* ACTIVE TICKET INTERACTIVE EXAM VIEW */}
        {activeTicket && (
          <div>
            {/* Header with back button */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <button
                  onClick={() => {
                    setActiveTicket(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1 mb-2 group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Վերադառնալ բոլոր տոմսերին</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-100">
                    {activeTicket.id.toUpperCase().replace("_", " ")}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    {activeTicket.title}
                  </h2>
                </div>
                <h3 className="text-slate-500 font-medium text-sm mt-1">
                  {activeTicket.titleArmenian}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePullRandomTicket}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-indigo-100 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Քաշել այլ տոմս</span>
                </button>
              </div>
            </div>

            {/* Questions list styled with Professional Polish details */}
            <div className="space-y-8">
              {activeTicket.questions.map((question, qIdx) => {
                const questionAttemptsCount = savedAttempts.filter(x => x.questionId === question.id).length;
                const verifiedFeedback = verificationResults[question.id] || savedAttempts.find(x => x.questionId === question.id)?.feedback;

                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIdx * 0.08 }}
                    className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs relative overflow-hidden"
                  >
                    {/* Visual left bar highlight */}
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-indigo-600" />

                    <div className="relative pl-2">
                      
                      {/* Top indicator bar */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          Հարց {qIdx + 1} ({question.category})
                        </span>
                        
                        {questionAttemptsCount > 0 && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            Ստուգված է
                          </span>
                        )}
                      </div>

                      {/* Spanish original sentence display */}
                      <p className="text-2xl font-bold text-slate-900 leading-tight">
                        {question.spanish}
                      </p>

                      {/* Armenian translation displays neatly italics below */}
                      <p className="text-lg text-slate-500 italic mt-2 border-l-4 border-slate-200 pl-4 py-0.5">
                        {question.armenian}
                      </p>

                      {/* Options Block in a professional layout */}
                      <div className="mt-8">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-3">
                          Ընտրության տարբերակներ (Ընտրեք ճիշտ տարբերակը)`
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {question.options.map((option) => {
                            const optKey = `${question.id}_${option.key}`;
                            const isTranslationExpanded = expandedOptionTranslations[optKey];
                            const isOptionChosen = selectedOptions[question.id] === option.key;

                            return (
                              <div
                                key={option.key}
                                className="flex flex-col h-full justify-between"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedOptions(prev => ({
                                      ...prev,
                                      [question.id]: option.key
                                    }));
                                    // Expand option translation
                                    if (!isTranslationExpanded) {
                                      toggleOptionTranslation(question.id, option.key);
                                    }
                                  }}
                                  className={`option-btn w-full text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                                    isOptionChosen 
                                      ? "border-indigo-600 bg-indigo-50/60 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]" 
                                      : "border-slate-200 bg-white hover:border-indigo-600 hover:bg-violet-50"
                                  }`}
                                >
                                  <div className="flex items-start gap-2.5">
                                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                                      isOptionChosen 
                                        ? "bg-indigo-600 text-white" 
                                        : "bg-slate-100 text-slate-600 border border-slate-250"
                                    }`}>
                                      {option.key.toUpperCase()}
                                    </span>
                                    <div>
                                      <p className="text-slate-900 font-semibold text-sm leading-snug">
                                        {option.spanish}
                                      </p>
                                      {isTranslationExpanded ? (
                                        <p className="text-xs text-indigo-600 italic mt-1 font-medium bg-white/70 py-1 px-2 rounded">
                                          🇦🇲 {option.armenian}
                                        </p>
                                      ) : (
                                        <span onClick={(e) => {
                                          e.stopPropagation();
                                          toggleOptionTranslation(question.id, option.key);
                                        }} className="text-[10px] text-slate-400 font-medium hover:underline mt-1 block">
                                          տեսնել հայերենը
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>

                                {/* Prepopulation quicklink */}
                                <button
                                  type="button"
                                  onClick={() => handlePrepopulate(question.id, option.spanish)}
                                  className="mt-2 text-left pl-3 text-[11px] font-bold text-indigo-500 hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <span>✍️ Պատասխանել սրանով</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Interactive Answer Area in Professional Polish theme: dark background panel */}
                      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col gap-4 mt-8">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Ձեր Պատասխանը / Tu Respuesta</h3>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">ակնթարթային ստուգում</span>
                        </div>

                        <textarea
                          value={customAnswers[question.id] || ""}
                          onChange={(e) => setCustomAnswers(prev => ({
                            ...prev,
                            [question.id]: e.target.value
                          }))}
                          placeholder="Գրեք ձեր պատասխանը իսպաներենով այստեղ կամ ընտրեք վերևի օրինակներից..."
                          rows={2}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24 resize-none text-sm transition-all"
                        />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-1">
                          <span className="text-xs text-slate-400 font-medium italic">
                            *կարող եք ավելացնել փոփոխություններ պատասխանից հետո
                          </span>

                          <button
                            type="button"
                            onClick={() => triggerVerifyAnswer(question, customAnswers[question.id])}
                            disabled={loadingVerifications[question.id]}
                            className="bg-indigo-500 text-white min-w-[200px] w-full sm:w-auto py-3 px-6 rounded-xl font-bold hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-950/20"
                          >
                            {loadingVerifications[question.id] ? (
                              <>
                                <RotateCw className="w-4 h-4 animate-spin text-white" />
                                <span>Ստուգվում է...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 text-indigo-200" />
                                <span>ՍՏՈՒԳԵԼ / COMPROBAR</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Verification Response card complying to Polish details */}
                      {verifiedFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-full ${
                              verifiedFeedback.isCorrect || verifiedFeedback.accuracyStatus === "perfect" || verifiedFeedback.accuracyStatus === "good"
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-rose-100 text-rose-600"
                            }`}>
                              {verifiedFeedback.isCorrect || verifiedFeedback.accuracyStatus === "perfect" || verifiedFeedback.accuracyStatus === "good" ? (
                                <Check className="w-5 h-5 stroke-[2.5]" />
                              ) : (
                                <AlertCircle className="w-5 h-5 stroke-[2.5]" />
                              )}
                            </div>
                            <div>
                              <h4 className={`font-bold text-lg ${
                                verifiedFeedback.isCorrect || verifiedFeedback.accuracyStatus === "perfect" || verifiedFeedback.accuracyStatus === "good"
                                  ? "text-emerald-700"
                                  : "text-rose-700"
                              }`}>
                                {verifiedFeedback.isCorrect || verifiedFeedback.accuracyStatus === "perfect" ? "Ճիշտ է! / ¡Correcto!" : "Կարիք ունի բարելավման / Revisar"}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">
                                Գնահատական՝ {verifiedFeedback.accuracyStatus.toUpperCase().replace("_", " ")}
                              </p>
                            </div>
                          </div>

                          {/* Instructive response written entirely in Armenian */}
                          <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line border-l-4 border-indigo-100 pl-4 py-0.5">
                            {verifiedFeedback.armenianFeedback}
                          </div>

                          {/* Advice and perfect version box */}
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-emerald-800 uppercase mb-1">Խորհուրդ / Consejo (Իդեալական տարբերակը)՝</p>
                              <p className="text-sm text-emerald-700 font-bold font-display">{verifiedFeedback.improvedSpanish}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handlePrepopulate(question.id, verifiedFeedback.improvedSpanish)}
                              className="shrink-0 bg-white hover:bg-emerald-100 border border-emerald-250 text-emerald-800 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                            >
                              Կիրառել սա
                            </button>
                          </div>

                          {/* Alternative suggest loop */}
                          {verifiedFeedback.alternativeSuggestions && verifiedFeedback.alternativeSuggestions.length > 0 && (
                            <div className="pt-2 bg-slate-50 border border-slate-100 rounded-xl p-4">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Այլընտրանքային օրինակներ իսպաներենով՝</p>
                              <div className="space-y-1.5">
                                {verifiedFeedback.alternativeSuggestions.map((s, idx) => (
                                  <p key={idx} className="text-xs text-slate-600 bg-white border border-slate-150 py-1.5 px-3 rounded-lg font-medium">
                                    • {s}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                        </motion.div>
                      )}

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Back action at the page footer */}
            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  setActiveTicket(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 py-3 text-sm cursor-pointer inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Վերադառնալ բոլոր տոմսերին</span>
              </button>
            </div>
          </div>
        )}


        {/* VIEW 2: SEARCHABLE INDEX OF ALL QUESTIONS */}
        {activeTab === "all" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Իսպաներենի հարցերի ամբողջական շտեմարան
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Փնտրեք ցանկացած հարց իսպաներենով կամ հայերենով և սկսեք ստուգումը
              </p>

              {/* Search bar widget */}
              <div className="mt-4 relative font-sans">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Փնտրել հարցը... (Օրինակ՝ camiseta, comida, գույն, սեղան...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-400 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Search list loop */}
            <div className="space-y-5">
              {filteredQuestions.map((question) => {
                const questionAttemptsCount = savedAttempts.filter(x => x.questionId === question.id).length;
                const verifiedFeedback = verificationResults[question.id] || savedAttempts.find(x => x.questionId === question.id)?.feedback;

                return (
                  <div
                    key={question.id}
                    className="border border-slate-200 rounded-xl p-6 hover:bg-slate-50/50 transition-colors bg-white"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                        {question.category.toUpperCase()}
                      </span>

                      {questionAttemptsCount > 0 && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          Պատասխանված է ({questionAttemptsCount} անգամ)
                        </span>
                      )}
                    </div>

                    {/* Question Spanish display with toggle translation */}
                    <button
                      onClick={() => toggleQuestionTranslation(question.id)}
                      className="text-left font-display font-bold text-lg text-slate-900 hover:text-indigo-600 block w-full outline-none"
                    >
                      {question.spanish}
                      <span className="text-xs text-indigo-500 font-semibold ml-2 inline-block hover:underline">
                        {expandedQuestionTranslations[question.id] ? "🇦🇲 թաքցնել" : "🇦🇲 տեսնել թարգմանությունը"}
                      </span>
                    </button>

                    {/* Embedded translation reveal */}
                    <AnimatePresence>
                      {expandedQuestionTranslations[question.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-2 text-slate-600 text-sm py-1"
                        >
                          <p className="bg-indigo-50/40 border border-indigo-100 p-3 rounded-lg font-medium">
                            🇦🇲 {question.armenian}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action form setup inside search cards */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <textarea
                        value={customAnswers[question.id] || ""}
                        onChange={(e) => setCustomAnswers(prev => ({
                          ...prev,
                          [question.id]: e.target.value
                        }))}
                        placeholder="Գրեք ձեր պատասխանը իսպաներենով ստուգման համար..."
                        rows={1}
                        className="bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-indigo-400 focus:bg-white focus:outline-none rounded-lg p-2.5 text-xs w-full resize-none font-medium"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => handlePrepopulate(question.id, question.options[0].spanish)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 px-2 py-1 rounded font-semibold transition"
                        >
                          Օգտագործել օրինակ պատասխանը
                        </button>

                        <button
                          onClick={() => triggerVerifyAnswer(question, customAnswers[question.id])}
                          disabled={loadingVerifications[question.id]}
                          className="bg-indigo-600 text-white disabled:bg-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                        >
                          {loadingVerifications[question.id] ? "Ստուգում..." : "Ստուգել պատասխանը"}
                        </button>
                      </div>
                    </div>

                    {/* Dynamic feedback display directly embedded */}
                    {verifiedFeedback && (
                      <div className="mt-4 bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs">
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] text-white ${
                            verifiedFeedback.accuracyStatus === "perfect" ? "bg-emerald-500" :
                            verifiedFeedback.accuracyStatus === "good" ? "bg-indigo-500" :
                            verifiedFeedback.accuracyStatus === "needs_work" ? "bg-amber-500" :
                            "bg-rose-500"
                          }`}>
                            {verifiedFeedback.accuracyStatus.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed font-semibold mb-2">
                          {verifiedFeedback.armenianFeedback}
                        </p>
                        <div className="bg-white p-2 rounded border border-slate-100 mt-2">
                          <span className="text-[9px] text-slate-400 font-bold block uppercase">Լավագույն տարբերակ՝</span>
                          <p className="text-indigo-950 font-bold font-display">{verifiedFeedback.improvedSpanish}</p>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}

              {filteredQuestions.length === 0 && (
                <div className="py-12 mt-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                  <p className="text-slate-400 text-sm">
                    Ոչինչ չի գտնվել Ձեր որոնման հարցումով։
                  </p>
                </div>
              )}
            </div>
          </div>
        )}


        {/* VIEW 3: COMPOSITIONS HISTORY / PROGRESS STATS LOOPS */}
        {activeTab === "history" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Իմ բոլոր գրանցված պատասխանները և ստուգումները
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Այստեղ պահվում են Ձեր բոլոր պրակտիկ պատասխանների գնահատականները:
            </p>

            {savedAttempts.length === 0 ? (
              <div className="py-16 mt-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                <span className="text-4xl">📑</span>
                <p className="text-slate-400 text-sm mt-2 font-semibold">
                  Դեռևս չունեք պահպանված պատասխաններ։
                </p>
                <button
                  onClick={() => setActiveTab("tickets")}
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg inline-block cursor-pointer transition-colors"
                >
                  Բացել տոմսերը և սկսել
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {savedAttempts.map((attempt) => (
                  <div
                    key={attempt.questionId}
                    className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-slate-50/25"
                  >
                    <div className="bg-slate-100 border-b border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block font-mono uppercase">ՀԱՐՑ՝</span>
                        <h4 className="font-display font-semibold text-slate-900 text-md">
                          {attempt.questionSpanish}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono text-right shrink-0">
                        {attempt.timestamp}
                      </span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left side: user answer */}
                      <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-3.5">
                        <span className="text-[10px] text-indigo-600 font-bold tracking-wider block uppercase mb-1">
                          Ձեր գրած պատասխանը՝
                        </span>
                        <p className="text-slate-900 text-sm font-semibold italic">
                          "{attempt.userAnswer}"
                        </p>
                      </div>

                      {/* Right side: AI verification report */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                            Ստուգման արդյունք՝
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            attempt.feedback?.accuracyStatus === "perfect" ? "bg-emerald-50 text-emerald-700 border border-emerald-150" :
                            attempt.feedback?.accuracyStatus === "good" ? "bg-indigo-50 text-indigo-700 border border-indigo-150" :
                            attempt.feedback?.accuracyStatus === "needs_work" ? "bg-amber-50 text-amber-700 border border-amber-150" :
                            "bg-rose-50 text-rose-700 border border-rose-150"
                          }`}>
                            {attempt.feedback?.accuracyStatus || "Verified"}
                          </span>
                        </div>

                        <p className="text-slate-600 text-xs font-semibold mb-3 leading-relaxed">
                          {attempt.feedback?.armenianFeedback}
                        </p>

                        <div className="bg-slate-50 p-2.5 px-3 rounded border border-slate-100">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase mb-0.5">Լավագույն տարբերակ՝</span>
                          <p className="text-slate-900 font-bold text-xs">{attempt.feedback?.improvedSpanish}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Elegant footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 mt-16 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-sans">
        <p className="font-semibold text-slate-500">
          Spanish-Armenian Exam Billetes Practice Accelerator • Powered by Gemini 3.5 Engine
        </p>
        <p className="mt-1 text-[10px]">
          © 2026 Bilingual Learning Deck. Secure client persistence, pure learning focus.
        </p>
      </footer>

    </div>
  );
}
