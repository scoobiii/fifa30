import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle,
  Play,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../utils/firestore-error";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function AIAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "model", 
      content: "Olá! Sou o **Agente de Decisão Racional 2026** (ajustado via RAG e Fine-Tuning). Posso analisar o modelo matemático de simulação, explicar o SWOT de qualquer candidato ou detalhar as metas de **Energia (20.000 kWh)** e **Taxa SELIC de 1 dígito (< 9%)**. \n\n*Clique no ícone de Microfone para falar comigo ou escolha uma sugestão abaixo!*" 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // States for Firebase Persistence
  const [sessionId, setSessionId] = useState<string>("");
  const [savedSessions, setSavedSessions] = useState<{ id: string, updatedAt: string, title: string }[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Load session from localStorage or create a new one
  useEffect(() => {
    let sId = localStorage.getItem("chat_session_id");
    if (!sId) {
      sId = "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("chat_session_id", sId);
    }
    setSessionId(sId);
    loadChatSession(sId);
    loadAllSavedSessions();
  }, []);

  const loadChatSession = async (sId: string) => {
    try {
      const docRef = doc(db, "chat_sessions", sId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.messages) {
          setMessages(data.messages);
          return;
        }
      }
      // If session doesn't exist yet, initialize it
      const initialMsgs: Message[] = [
        { 
          role: "model", 
          content: "Olá! Sou o **Agente de Decisão Racional 2026** (ajustado via RAG e Fine-Tuning). Posso analisar o modelo matemático de simulação, explicar o SWOT de qualquer candidato ou detalhar as metas de **Energia (20.000 kWh)** e **Taxa SELIC de 1 dígito (< 9%)**. \n\n*Clique no ícone de Microfone para falar comigo ou escolha uma sugestão abaixo!*" 
        }
      ];
      setMessages(initialMsgs);
      await setDoc(docRef, {
        id: sId,
        updatedAt: new Date().toISOString(),
        title: "Conversa em " + new Date().toLocaleDateString("pt-BR"),
        messages: initialMsgs
      });
    } catch (e) {
      console.error("Erro ao carregar sessão do chat:", e);
      handleFirestoreError(e, OperationType.GET, "chat_sessions");
    }
  };

  const loadAllSavedSessions = async () => {
    try {
      const colRef = collection(db, "chat_sessions");
      const q = query(colRef, orderBy("updatedAt", "desc"), limit(12));
      const querySnapshot = await getDocs(q);
      const list: { id: string, updatedAt: string, title: string }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          updatedAt: data.updatedAt || "",
          title: data.title || "Conversa Sem Título"
        });
      });
      setSavedSessions(list);
    } catch (e) {
      console.error("Erro ao carregar lista de conversas salvas:", e);
      handleFirestoreError(e, OperationType.LIST, "chat_sessions");
    }
  };

  const saveChatMessages = async (sId: string, updatedMsgs: Message[]) => {
    try {
      if (!sId) return;
      const docRef = doc(db, "chat_sessions", sId);
      let title = "Conversa em " + new Date().toLocaleDateString("pt-BR");
      const firstUserMsg = updatedMsgs.find(m => m.role === "user");
      if (firstUserMsg) {
        title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? "..." : "");
      }
      
      await setDoc(docRef, {
        id: sId,
        updatedAt: new Date().toISOString(),
        title: title,
        messages: updatedMsgs
      });
      
      loadAllSavedSessions();
    } catch (e) {
      console.error("Erro ao salvar mensagens do chat:", e);
      handleFirestoreError(e, OperationType.WRITE, "chat_sessions");
    }
  };

  const handleNewChat = () => {
    stopSpeaking();
    const newSId = "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("chat_session_id", newSId);
    setSessionId(newSId);
    setShowHistory(false);
    
    const initialMsgs: Message[] = [
      { 
        role: "model", 
        content: "Olá! Sou o **Agente de Decisão Racional 2026** (ajustado via RAG e Fine-Tuning). Posso analisar o modelo matemático de simulação, explicar o SWOT de qualquer candidato ou detalhar as metas de **Energia (20.000 kWh)** e **Taxa SELIC de 1 dígito (< 9%)**. \n\n*Clique no ícone de Microfone para falar comigo ou escolha uma sugestão abaixo!*" 
      }
    ];
    setMessages(initialMsgs);
    
    const docRef = doc(db, "chat_sessions", newSId);
    setDoc(docRef, {
      id: newSId,
      updatedAt: new Date().toISOString(),
      title: "Nova Conversa",
      messages: initialMsgs
    });
    
    loadAllSavedSessions();
  };

  // Handle Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "pt-BR";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Erro no reconhecimento de fala:", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Speak text helper
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    // Remove markdown symbols for better speech synthesis
    const cleanText = text
      .replace(/[\*\#\`\_\-\>]/g, " ")
      .replace(/https?:\/\/[^\s]+/g, "link")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "pt-BR";
    
    // Find pt-BR voice
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith("pt"));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Reconhecimento de voz não suportado neste navegador. Tente usar o Google Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.start();
    }
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    stopSpeaking();
    const userMsg: Message = { role: "user", content: textToSend };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInputValue("");
    setIsLoading(true);

    // Save to Firestore immediately
    saveChatMessages(sessionId, updatedMsgs);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMsgs,
          currentState: {
            selectedIdeology: localStorage.getItem("selected_ideology") || "Não especificado",
            effectiveGrowth: "Dinâmica por Cenário",
            projectedPib2045: "Dinâmico",
            yearsToTarget: "Dinâmico"
          }
        })
      });

      const data = await response.json();
      const replyText = data.reply || "Desculpe, tive um problema ao buscar a resposta.";

      const finalMsgs = [...updatedMsgs, { role: "model", content: replyText }];
      setMessages(finalMsgs);
      saveChatMessages(sessionId, finalMsgs);
      
      if (voiceEnabled) {
        speak(replyText);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMsgs = [...updatedMsgs, { 
        role: "model", 
        content: "Ops, ocorreu um erro de conexão com o Agente Fine-Tuned. Por favor, tente novamente em instantes." 
      } as Message];
      setMessages(errorMsgs);
      saveChatMessages(sessionId, errorMsgs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const suggestions = [
    "Explique a meta de 20.000 kWh de energia per capita",
    "Qual o impacto do Banco Central e da SELIC de 1 dígito?",
    "O que falta para Lula (PT) atingir a nota 3/3?",
    "Análise SWOT do Flávio Bolsonaro (PL)",
    "Por que Romeu Zema (Novo) recebeu nota 3/3?"
  ];


  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            layoutId="agent-chat-container"
            onClick={() => setIsOpen(true)}
            className="bg-slate-950 text-white p-4 rounded-full shadow-2xl flex items-center gap-2.5 hover:bg-slate-900 transition-all cursor-pointer group border border-slate-800"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="relative">
              <MessageSquare className="h-6 w-6 text-white group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-xs font-black tracking-wider uppercase pr-1">Agente RAG AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="agent-chat-container"
            className="bg-white rounded-3xl shadow-2xl border border-slate-150 w-[92vw] sm:w-[400px] h-[580px] flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {/* Header */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-500/20 p-1.5 rounded-xl border border-emerald-500/30">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-tight">Agente de Decisão Racional</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Fine-Tuned Weight Matrix & RAG</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Voice Toggle */}
                <button
                  onClick={() => {
                    if (voiceEnabled) {
                      stopSpeaking();
                    }
                    setVoiceEnabled(!voiceEnabled);
                  }}
                  title={voiceEnabled ? "Mudar para modo silencioso" : "Ativar leitura de voz automática"}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    voiceEnabled ? "bg-white/10 text-emerald-400 hover:bg-white/20" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>

                {/* Stop Speech */}
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    title="Parar de Falar"
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all cursor-pointer"
                  >
                    <Square className="h-4 w-4 fill-rose-400" />
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={() => {
                    stopSpeaking();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Persistence Toolbar */}
            <div className="bg-slate-900 text-slate-300 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`transition-colors cursor-pointer flex items-center gap-1.5 font-bold ${
                  showHistory ? "text-emerald-400" : "hover:text-white text-slate-400"
                }`}
              >
                📁 {showHistory ? "VOLTAR PARA O CHAT" : `HISTÓRICO DE CONVERSAS (${savedSessions.length})`}
              </button>
              <button
                type="button"
                onClick={handleNewChat}
                className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1 font-bold"
              >
                ➕ NOVO CHAT
              </button>
            </div>

            {showHistory ? (
              /* History Sessions Area */
              <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-slate-950 text-slate-300 custom-scrollbar">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">Suas Conversas Salvas no Firestore</span>
                {savedSessions.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500 font-mono">Nenhuma conversa encontrada na nuvem.</div>
                ) : (
                  savedSessions.map((session) => {
                    const isCurrent = sessionId === session.id;
                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => {
                          setSessionId(session.id);
                          localStorage.setItem("chat_session_id", session.id);
                          loadChatSession(session.id);
                          setShowHistory(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                          isCurrent 
                            ? "bg-slate-800 border-emerald-500/50 text-white shadow-md shadow-emerald-500/5" 
                            : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-start w-full gap-3">
                          <span className="text-xs font-bold leading-tight truncate flex-1">{session.title}</span>
                          <span className="text-[8px] text-slate-500 font-mono flex-shrink-0 mt-0.5">
                            {new Date(session.updatedAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 truncate block">ID: {session.id.substring(0, 15)}...</span>
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              /* Messages Area */
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 custom-scrollbar">
                  {messages.map((m, idx) => {
                    const isModel = m.role === "model";
                    return (
                      <div key={idx} className={`flex ${isModel ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm relative group ${
                          isModel 
                            ? "bg-white border border-slate-100 text-slate-800 rounded-tl-none" 
                            : "bg-slate-950 text-white rounded-tr-none"
                        }`}>
                          {/* Markdown rendering simplified */}
                          <div className="whitespace-pre-line">
                            {m.content.split("\n\n").map((para, pIdx) => (
                              <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
                                {para.split("**").map((part, partIdx) => {
                                  if (partIdx % 2 === 1) {
                                    return <strong key={partIdx} className="font-bold text-slate-950">{part}</strong>;
                                  }
                                  return part;
                                })}
                              </p>
                            ))}
                          </div>

                          {/* Manual Speak Button for Model replies */}
                          {isModel && (
                            <div className="absolute right-2 bottom-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md shadow border border-slate-100">
                              <button
                                type="button"
                                onClick={() => speak(m.content)}
                                title="Ouvir Resposta"
                                className="text-slate-500 hover:text-slate-900 transition-colors p-0.5"
                              >
                                <Play className="h-3 w-3 fill-slate-500" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 text-xs shadow-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        <span className="text-slate-400 ml-1">Processando pesos RAG...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions list when history is short */}
                {messages.length < 3 && (
                  <div className="p-3 border-t border-slate-100 bg-white space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono block px-1">Sugestões de Perguntas</span>
                    <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSuggestionClick(s)}
                          className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-lg border border-slate-200/60 transition-all text-left cursor-pointer truncate max-w-full"
                        >
                          💡 {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Form */}
                <div className="p-3 bg-white border-t border-slate-100">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage(inputValue);
                    }}
                    className="flex items-center gap-2"
                  >
                    {/* Voice recognition button */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                        isListening 
                          ? "bg-rose-50 border-rose-200 text-rose-500 animate-pulse" 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                      }`}
                      title={isListening ? "Parar de ouvir" : "Falar pergunta (Voz)"}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </span>
                        </>
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </button>

                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isListening ? "Ouvindo... fale agora." : "Digite sua dúvida..."}
                      className="flex-grow bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 transition-colors text-slate-900"
                      disabled={isLoading}
                    />

                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="bg-slate-950 text-white p-2.5 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                  <div className="flex justify-between items-center mt-2 px-1 text-[9px] text-slate-400 font-mono">
                    <span>Persistência: Cloud Firestore</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Sessão Ativa
                    </span>
                  </div>
                </div>
              </>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
