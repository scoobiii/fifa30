import React, { useState, useEffect } from "react";
import { Candidate } from "../types";
import { 
  BookOpen, 
  Star, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Lightbulb, 
  Flame, 
  ArrowRight,
  TrendingUp,
  Award,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CandidatePlansDashboardProps {
  candidates: Candidate[];
}

export default function CandidatePlansDashboard({ candidates }: CandidatePlansDashboardProps) {
  // Select first candidate as default (Lula)
  const [selectedId, setSelectedId] = useState<string>("1");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const currentCandidate = candidates.find(c => c.id === selectedId) || candidates[0];

  // Stop speech when changing candidate
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [selectedId]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakPlan = (candidate: Candidate) => {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta síntese de voz.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const strengthsText = candidate.swot?.strengths.join(", ") || "";
    const weaknessesText = candidate.swot?.weaknesses.join(", ") || "";
    const goalsText = candidate.governmentPlan || "";

    const textToSpeak = `Plano de governo de ${candidate.name}, do partido ${candidate.party || "Sem Partido"}. Índice de maturidade avaliado como ${candidate.score || 1} de 3 estrelas. Diretrizes do plano de governo: ${goalsText}. Principais forças da análise SWOT: ${strengthsText}. Principais fraquezas estruturais identificadas: ${weaknessesText}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "pt-BR";
    
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

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const renderStars = (score: number = 1) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((star) => (
          <Star 
            key={star} 
            className={`h-4.5 w-4.5 ${
              star <= score 
                ? "text-amber-500 fill-amber-400 drop-shadow-sm" 
                : "text-slate-200"
            }`} 
          />
        ))}
        <span className="text-xs font-mono font-black text-slate-500 ml-1.5 bg-slate-100 px-2 py-0.5 rounded-full">
          {score}/3
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8 mt-8" id="planos-governo">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">Mapeamento Programático</span>
        <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-slate-950" />
          Análise de Planos de Governo & Matriz SWOT
        </h2>
        <p className="text-xs text-slate-500 max-w-3xl mt-1">
          Investigue a maturidade técnica de cada plano em relação aos objetivos nacionais de longo prazo. O índice de maturidade (nota 1 a 3) avalia a compatibilidade das propostas com a solvência fiscal, sustentabilidade energética (meta de 20.000 kWh per capita) e política monetária estável.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT NAV PANEL: List of candidates */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block px-2 mb-1">Escolha o Candidato ({candidates.length})</span>
          {candidates.map((c) => {
            const isSelected = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected 
                    ? "bg-slate-950 border-slate-950 text-white shadow-md shadow-slate-950/10" 
                    : "bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Circle indicating party color */}
                  <span 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  ></span>
                  <div className="min-w-0">
                    <strong className={`block text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-900"}`}>
                      {c.name}
                    </strong>
                    <span className={`text-[10px] uppercase font-mono tracking-wider ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                      {c.party || "Sem Partido"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-lg ${
                    isSelected ? "bg-white/10 text-white" : "bg-white border border-slate-200 text-slate-800"
                  }`}>
                    {c.share}%
                  </span>
                  <ArrowRight className={`h-3.5 w-3.5 opacity-60 ${isSelected ? "text-white" : "text-slate-400"}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT PANEL: Details of the selected candidate's government plan and SWOT */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Candidate Card Hero */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: currentCandidate.color }}
                    ></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Candidatura Presidencial
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                    {currentCandidate.name} <span className="text-slate-400 font-mono text-sm font-normal">({currentCandidate.party})</span>
                    <button
                      onClick={() => speakPlan(currentCandidate)}
                      className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                        isSpeaking 
                          ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20" 
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                      title={isSpeaking ? "Parar narração por voz" : "Ouvir Plano por Voz"}
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-3.5 w-3.5 animate-pulse" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Intenção de Voto Datafolha: <strong className="text-slate-800 font-mono">{currentCandidate.share}%</strong>
                  </p>
                </div>

                {/* Score badge */}
                <div className="bg-white border border-slate-200/60 p-3 rounded-xl flex flex-col justify-center shadow-sm">
                  <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-1">Nota de Maturidade</span>
                  {renderStars(currentCandidate.score)}
                </div>
              </div>

              {/* Government Plan description */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-slate-700" />
                  Diretrizes do Plano de Governo
                </h4>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed shadow-sm">
                  {currentCandidate.governmentPlan || "Nenhum plano cadastrado."}
                </div>
              </div>

              {/* SWOT Matrix Analysis */}
              {currentCandidate.swot && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-slate-700" />
                    Análise Diagnóstica SWOT (F.O.F.A.)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col">
                      <h5 className="font-bold text-emerald-800 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-emerald-100/50 pb-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Forças (Strengths)
                      </h5>
                      <ul className="space-y-1.5 flex-grow">
                        {currentCandidate.swot.strengths.map((str, i) => (
                          <li key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 shadow-sm flex flex-col">
                      <h5 className="font-bold text-rose-800 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-rose-100/50 pb-2 mb-2">
                        <ShieldAlert className="h-4 w-4 text-rose-600" />
                        Fraquezas (Weaknesses)
                      </h5>
                      <ul className="space-y-1.5 flex-grow">
                        {currentCandidate.swot.weaknesses.map((weak, i) => (
                          <li key={i} className="text-xs text-rose-950 flex items-start gap-1.5">
                            <span className="text-rose-400 mt-0.5">•</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 shadow-sm flex flex-col">
                      <h5 className="font-bold text-blue-800 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-blue-100/50 pb-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        Oportunidades (Opportunities)
                      </h5>
                      <ul className="space-y-1.5 flex-grow">
                        {currentCandidate.swot.opportunities.map((opp, i) => (
                          <li key={i} className="text-xs text-blue-950 flex items-start gap-1.5">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Threats */}
                    <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 shadow-sm flex flex-col">
                      <h5 className="font-bold text-amber-800 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-amber-100/50 pb-2 mb-2">
                        <Flame className="h-4 w-4 text-amber-600" />
                        Ameaças (Threats)
                      </h5>
                      <ul className="space-y-1.5 flex-grow">
                        {currentCandidate.swot.threats.map((thr, i) => (
                          <li key={i} className="text-xs text-amber-950 flex items-start gap-1.5">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{thr}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* What is missing (O que falta para 3/3) */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-slate-700" />
                  O Que Falta Para Nota Máxima (3/3)?
                </h4>
                <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex gap-3 items-start relative z-10">
                    <AlertCircle className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-indigo-300 uppercase font-mono tracking-wider block mb-1">
                        Análise de Lacunas Estruturais
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {currentCandidate.whatIsMissing || "Candidato sem mapeamento de lacunas estruturais cadastrado."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
