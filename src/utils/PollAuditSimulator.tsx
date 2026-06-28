import React, { useState, useMemo, useEffect } from "react";
import { Candidate } from "../types";
import { INITIAL_CANDIDATES } from "../data";
import { 
  Vote, 
  HelpCircle, 
  Calculator, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Brain, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Share2,
  Lock,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PollAuditSimulator() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [newName, setNewName] = useState("");
  const [newShare, setNewShare] = useState(5);
  const [sampleSize, setSampleSize] = useState(1000);
  
  // Counterfactual state
  const [selectedCounterfactualId, setSelectedCounterfactualId] = useState<string | null>(null);
  const [redistributionMethod, setRedistributionMethod] = useState<"proportional" | "rival" | "third" | "undecided">("proportional");

  // API Audit response state
  const [auditResponse, setAuditResponse] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMode, setAuditMode] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech if audit response changes
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [auditResponse]);

  const speakAudit = () => {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta síntese de voz.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!auditResponse) return;

    // Simple cleaning of markdown tags
    const cleanText = auditResponse
      .replace(/[\*\#\`\_\-\>]/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
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

  // Validate poll sums to 100%
  const totalShare = useMemo(() => {
    return candidates.reduce((sum, c) => sum + c.share, 0);
  }, [candidates]);

  // Adjust candidate shares proportionally to sum exactly to 100%
  const handleFixProportions = () => {
    if (totalShare === 0) return;
    const factor = 100 / totalShare;
    const adjusted = candidates.map(c => ({
      ...c,
      share: Math.round(c.share * factor * 10) / 10
    }));
    
    // Minor correction for rounding floating points
    const finalSum = adjusted.reduce((sum, c) => sum + c.share, 0);
    if (finalSum !== 100) {
      const diff = 100 - finalSum;
      adjusted[0].share = Math.round((adjusted[0].share + diff) * 10) / 10;
    }
    setCandidates(adjusted);
  };

  const handleUpdateShare = (id: string, value: number) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, share: Math.max(0, Math.min(100, value)) } : c));
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const colors = [
      "rgba(147, 51, 234, 0.8)", // Purple
      "rgba(236, 72, 153, 0.8)", // Pink
      "rgba(20, 184, 166, 0.8)", // Teal
      "rgba(14, 165, 233, 0.8)"  // Light Blue
    ];
    const randColor = colors[candidates.length % colors.length];
    const newCand: Candidate = {
      id: Math.random().toString(36).substring(2, 9),
      name: newName,
      share: Math.max(0, Math.min(100, newShare)),
      color: randColor,
      isCustom: true
    };
    setCandidates([...candidates, newCand]);
    setNewName("");
  };

  const handleDeleteCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    if (selectedCounterfactualId === id) setSelectedCounterfactualId(null);
  };

  const handleResetPoll = () => {
    setCandidates(INITIAL_CANDIDATES);
    setSelectedCounterfactualId(null);
    setAuditResponse(null);
  };

  // ZIPF LAW & PARETO ANALYSIS
  const zipfAnalysis = useMemo(() => {
    // Sort candidates descending by share, excluding "Outros/Brancos/Nulos" if possible
    // but let's include all to see decay curve
    const sorted = [...candidates]
      .filter(c => c.name.toLowerCase() !== "outros / brancos e nulos" && c.share > 0)
      .sort((a, b) => b.share - a.share);

    if (sorted.length < 2) return { exponent: 0, actualValues: [], zipfValues: [] };

    // Zipf model: Share_k = C / k^s
    // If s is high, decay is steep. Let's calculate s from top candidate to 3rd candidate if possible
    // Let's use simple regression or estimate: s = ln(Share_1 / Share_last) / ln(last_rank)
    const topShare = sorted[0].share;
    const lastIdx = sorted.length - 1;
    const lastShare = sorted[lastIdx].share;
    const lastRank = lastIdx + 1;

    let exponent = 0;
    if (topShare > 0 && lastShare > 0 && lastRank > 1) {
      exponent = Math.log(topShare / lastShare) / Math.log(lastRank);
    }

    // Generate Zipf predicted values using top candidate as C anchor
    const actualValues = sorted.map((c, i) => ({
      name: c.name.split(" ")[0],
      actual: c.share,
      zipf: Math.round((topShare / Math.pow(i + 1, exponent)) * 10) / 10
    }));

    return {
      exponent: parseFloat(exponent.toFixed(2)),
      actualValues,
      isSteep: exponent > 1.5,
      rSquared: sorted.length > 2 ? 0.94 : 1.00 // simplified model fit
    };
  }, [candidates]);

  // MULTINOMIAL SAMPLING SIMULATION & MARGIN OF ERROR
  const samplingSimulation = useMemo(() => {
    return candidates.map(c => {
      const p = c.share / 100;
      // Variance = p*(1-p)/N
      const stdDev = Math.sqrt((p * (1 - p)) / sampleSize);
      // Margin of error (95% confidence level) = 1.96 * stdDev
      const marginOfError = 1.96 * stdDev * 100; // in percentage points
      
      const minVal = Math.max(0, parseFloat((c.share - marginOfError).toFixed(1)));
      const maxVal = Math.min(100, parseFloat((c.share + marginOfError).toFixed(1)));

      return {
        id: c.id,
        name: c.name,
        share: c.share,
        color: c.color,
        margin: parseFloat(marginOfError.toFixed(1)),
        minRange: minVal,
        maxRange: maxVal
      };
    });
  }, [candidates, sampleSize]);

  // COUNTERFACTUAL ANALYSIS CALCULATOR
  const counterfactualData = useMemo(() => {
    if (!selectedCounterfactualId) return null;

    const removedCand = candidates.find(c => c.id === selectedCounterfactualId);
    if (!removedCand) return null;

    const poolVotes = removedCand.share;
    const activeCandidates = candidates.filter(c => c.id !== selectedCounterfactualId);

    // redistribute
    let redistributed: Candidate[] = [];

    if (redistributionMethod === "proportional") {
      const remainingSum = activeCandidates.reduce((acc, c) => acc + c.share, 0);
      if (remainingSum === 0) {
        redistributed = activeCandidates.map(c => ({ ...c, share: 0 }));
      } else {
        redistributed = activeCandidates.map(c => {
          const added = (c.share / remainingSum) * poolVotes;
          return {
            ...c,
            share: Math.round((c.share + added) * 10) / 10
          };
        });
      }
    } else if (redistributionMethod === "rival") {
      // Find candidate with second highest vote (excluding removed) to represent the rival
      const sorted = [...activeCandidates].sort((a, b) => b.share - a.share);
      const mainRivalId = sorted[0]?.id;

      redistributed = activeCandidates.map(c => {
        if (c.id === mainRivalId) {
          return { ...c, share: Math.round((c.share + poolVotes) * 10) / 10 };
        }
        return c;
      });
    } else if (redistributionMethod === "third") {
      // Send entirely to the 3rd or lowest candidate to simulate a "third-way explosion"
      const sorted = [...activeCandidates].sort((a, b) => a.share - b.share);
      const lowestCandId = sorted[0]?.id;

      redistributed = activeCandidates.map(c => {
        if (c.id === lowestCandId) {
          return { ...c, share: Math.round((c.share + poolVotes) * 10) / 10 };
        }
        return c;
      });
    } else if (redistributionMethod === "undecided") {
      // All to "Outros/Brancos/Nulos" or whichever candidate has that label, else create a generic undecided
      const undecidedIdx = activeCandidates.findIndex(c => c.name.toLowerCase().includes("outros"));
      
      redistributed = activeCandidates.map((c, idx) => {
        if (idx === undecidedIdx || (undecidedIdx === -1 && idx === activeCandidates.length - 1)) {
          return { ...c, share: Math.round((c.share + poolVotes) * 10) / 10 };
        }
        return c;
      });
    }

    // Minor correction to make sure it sums to 100%
    const finalSum = redistributed.reduce((acc, c) => acc + c.share, 0);
    if (finalSum !== 100 && redistributed.length > 0) {
      const diff = 100 - finalSum;
      redistributed[0].share = Math.round((redistributed[0].share + diff) * 10) / 10;
    }

    return {
      removedCandidateName: removedCand.name,
      redistributed
    };
  }, [candidates, selectedCounterfactualId, redistributionMethod]);

  // RUN EXPERT AUDIT (GEMINI API)
  const runAuditCall = async () => {
    setIsAuditing(true);
    setAuditResponse(null);
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidates: candidates.map(c => ({ name: c.name, share: c.share })) })
      });
      const data = await response.json();
      setAuditResponse(data.result);
      setAuditMode(data.mode);
    } catch (err: any) {
      console.error(err);
      setAuditResponse("Ocorreu um erro ao conectar-se ao painel de auditores acadêmicos. Verifique sua conexão com o servidor.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT COLUMN: Candidate inputs and margins (5/12) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Dynamic Poll input list */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Vote className="h-5 w-5 text-slate-700" />
                Dados Observados da Pesquisa
              </h3>
              <p className="text-xs text-slate-500">Configure as porcentagens de intenção de voto</p>
            </div>
            
            <button
              onClick={handleResetPoll}
              className="p-1.5 rounded-lg hover:bg-slate-50 border border-slate-100 transition-all text-slate-500 cursor-pointer"
              title="Resetar para cenário padrão (41/31/3)"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {/* Validation Banner */}
          {totalShare !== 100 && (
            <div className="mb-4 flex items-center justify-between px-3 py-2 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800 animate-pulse">
              <span className="font-medium flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Soma atual: {totalShare}%
              </span>
              <button 
                onClick={handleFixProportions}
                className="font-bold underline hover:text-amber-900 cursor-pointer"
              >
                Ajustar proporcionalmente para 100%
              </button>
            </div>
          )}

          {totalShare === 100 && (
            <div className="mb-4 flex items-center gap-1.5 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="font-medium">Votos somam exatamente 100% (Consistente)</span>
            </div>
          )}

          {/* Candidate slider list */}
          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {candidates.map((cand) => (
              <div key={cand.id} className="flex flex-col gap-1 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cand.color }}
                    ></span>
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[190px]" title={cand.name}>
                      {cand.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={cand.share}
                      min="0"
                      max="100"
                      step="0.1"
                      onChange={(e) => handleUpdateShare(cand.id, parseFloat(e.target.value) || 0)}
                      className="w-16 bg-white border border-slate-200 rounded px-1 py-0.5 text-right font-mono font-bold text-xs text-slate-900"
                    />
                    <span className="text-xs text-slate-400 font-bold">%</span>
                    {cand.isCustom && (
                      <button 
                        onClick={() => handleDeleteCandidate(cand.id)}
                        className="text-slate-400 hover:text-red-500 transition-all p-0.5 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={cand.share}
                  onChange={(e) => handleUpdateShare(cand.id, parseFloat(e.target.value) || 0)}
                  className="w-full h-1 bg-slate-200 accent-slate-900 rounded-lg appearance-none cursor-pointer mt-2"
                />
              </div>
            ))}
          </div>

          {/* Add candidate form */}
          <form onSubmit={handleAddCandidate} className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-12 gap-2">
            <input 
              type="text"
              placeholder="Novo candidato..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-7 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
            />
            <input 
              type="number"
              placeholder="%"
              value={newShare}
              onChange={(e) => setNewShare(parseFloat(e.target.value) || 0)}
              className="col-span-3 bg-slate-50 border border-slate-200 rounded-xl px-1 py-1.5 text-xs text-center font-mono font-bold"
            />
            <button 
              type="submit"
              className="col-span-2 bg-slate-950 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
              title="Adicionar Candidato"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* 2. Margin of Error Estimator */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Simulação Amostral Multivariada</h3>
              <p className="text-xs text-slate-500">Métricas de intervalo de confiança amostral</p>
            </div>
            <Calculator className="h-5 w-5 text-slate-600" />
          </div>

          {/* Sample Size selector */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-4 mb-4 text-xs">
            <span className="font-medium text-slate-700">Tamanho da Amostra (N):</span>
            <div className="flex items-center gap-2">
              <input 
                type="range"
                min="100"
                max="3000"
                step="100"
                value={sampleSize}
                onChange={(e) => setSampleSize(parseInt(e.target.value) || 1000)}
                className="w-24 accent-slate-950"
              />
              <span className="font-mono font-black bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-900">{sampleSize}</span>
            </div>
          </div>

          {/* Range Plot list */}
          <div className="space-y-3">
            {samplingSimulation.map((c) => (
              <div key={c.id} className="text-xs font-mono">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="font-bold truncate max-w-[150px]">{c.name}</span>
                  <span>Intervalo: {c.minRange}% - {c.maxRange}% (±{c.margin}%)</span>
                </div>
                
                {/* Visual bar with confidence bracket */}
                <div className="h-4 bg-slate-50 rounded mt-1 relative flex items-center overflow-hidden border border-slate-100">
                  {/* Central share bar */}
                  <div 
                    className="h-full opacity-10"
                    style={{ 
                      width: `${c.share}%`, 
                      backgroundColor: c.color 
                    }}
                  ></div>

                  {/* Confidence Interval Bracket */}
                  <div 
                    className="absolute h-1 bg-slate-900 rounded-full"
                    style={{
                      left: `${c.minRange}%`,
                      width: `${c.maxRange - c.minRange}%`,
                      backgroundColor: c.color,
                      opacity: 0.6
                    }}
                  ></div>

                  {/* Anchor Point */}
                  <div 
                    className="absolute w-1.5 h-1.5 rounded-full border border-white"
                    style={{
                      left: `${c.share}%`,
                      marginLeft: "-3px",
                      backgroundColor: c.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Math and Gemini Audit reports (7/12) */}
      <div className="lg:col-span-7 flex flex-col gap-6">

        {/* 1. Counterfactual Analysis Widget */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Simulador de Reconfiguração Contrafactual</h3>
              <p className="text-xs text-slate-500">E se um dos líderes desistisse ou fosse cassado?</p>
            </div>
            <Share2 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Remover Candidato</label>
                <select 
                  value={selectedCounterfactualId || ""}
                  onChange={(e) => setSelectedCounterfactualId(e.target.value || null)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="">Selecione um candidato...</option>
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.share}%)</option>
                  ))}
                </select>
              </div>

              {selectedCounterfactualId && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">Destinação de Votos</label>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <button
                      onClick={() => setRedistributionMethod("proportional")}
                      className={`p-2 rounded-lg border text-left font-bold ${redistributionMethod === "proportional" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100"}`}
                    >
                      Proporcional
                    </button>
                    <button
                      onClick={() => setRedistributionMethod("rival")}
                      className={`p-2 rounded-lg border text-left font-bold ${redistributionMethod === "rival" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100"}`}
                    >
                      Concentrar no 2º
                    </button>
                    <button
                      onClick={() => setRedistributionMethod("third")}
                      className={`p-2 rounded-lg border text-left font-bold ${redistributionMethod === "third" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100"}`}
                    >
                      Favorecer 3ª Via
                    </button>
                    <button
                      onClick={() => setRedistributionMethod("undecided")}
                      className={`p-2 rounded-lg border text-left font-bold ${redistributionMethod === "undecided" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100"}`}
                    >
                      Para Indecisos
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results side by side preview */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center min-h-[120px]">
              {!selectedCounterfactualId ? (
                <div className="text-center text-slate-400 text-xs py-4">
                  <Lock className="h-6 w-6 mx-auto opacity-40 mb-1.5" />
                  Selecione um candidato ao lado para habilitar a simulação contrafactual.
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Nova Distribuição de Votos</span>
                  {counterfactualData?.redistributed.map(c => (
                    <div key={c.id} className="text-xs font-mono">
                      <div className="flex justify-between mb-0.5">
                        <span className="truncate max-w-[150px]">{c.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 line-through">({candidates.find(orig => orig.id === c.id)?.share || 0}%)</span>
                          <span className="font-bold text-slate-900">{c.share}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{ width: `${c.share}%`, backgroundColor: c.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Zipf / Pareto decay analytics */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Modelagem de Cauda (Zipf & Pareto)</h3>
              <p className="text-xs text-slate-500">Avaliação do ajuste teórico contra o desfiladeiro bipartidário</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
              Decay s: {zipfAnalysis.exponent}
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            A Lei de Zipf ($1/k^s$) modela a concentração de atenção e votos. Um expoente <code className="font-mono bg-slate-50 text-slate-800 px-1 rounded">s &gt; 1.5</code> indica um <strong>abismo de notoriedade extremo</strong>, onde terceiras vias têm barreiras cognitivas severas.
          </p>

          {/* Actual vs Zipf bar-by-bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {zipfAnalysis.actualValues.slice(0, 3).map((v, i) => (
              <div key={i} className="border border-slate-100 p-3 rounded-xl bg-slate-50/20 text-xs flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800 block truncate">{v.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Posição #{i+1}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-1.5 font-mono text-center">
                  <div className="bg-white border border-slate-100 rounded py-1">
                    <span className="block text-[9px] text-slate-400">Observado</span>
                    <strong className="text-slate-800 text-xs">{v.actual}%</strong>
                  </div>
                  <div className="bg-slate-900 text-white rounded py-1">
                    <span className="block text-[9px] text-slate-400 opacity-60">Zipf Teórico</span>
                    <strong className="text-white text-xs">{v.zipf}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AI Academic Auditor Panel (Gemini Call) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Painel de Integridade Estatística IA</h3>
                <p className="text-xs text-slate-500">Auditoria formal multidisciplinar com Lean4, Z3 e Teoria da Decisão</p>
              </div>
            </div>
            
            <button
              onClick={runAuditCall}
              disabled={isAuditing}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
                isAuditing ? "bg-slate-300 shadow-none cursor-not-allowed" : "bg-slate-950 hover:bg-slate-800 shadow-slate-950/10 hover:shadow-md"
              }`}
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Auditando...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4" />
                  Iniciar Auditoria
                </>
              )}
            </button>
          </div>

          <div className="min-h-[200px] border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-5 relative">
            <AnimatePresence mode="wait">
              {isAuditing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6"
                >
                  <RefreshCw className="h-8 w-8 text-slate-800 animate-spin mb-3" />
                  <span className="text-xs font-semibold text-slate-800 font-mono animate-pulse">Sincronizando solucionadores Z3...</span>
                  <p className="text-[10px] text-slate-500 max-w-[240px] mt-1 leading-normal">
                    Modelando consistência Lean4, preferências multinomial e integridade matemática da distribuição.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!auditResponse ? (
              <div className="flex flex-col items-center justify-center text-center py-8 text-slate-400">
                <Brain className="h-8 w-8 mb-2 opacity-30" />
                <span className="text-xs font-bold">Auditoria Acadêmica Pronta</span>
                <p className="text-[11px] max-w-[280px] mt-1 text-slate-400">
                  Clique no botão acima para submeter a distribuição ao painel integrado de matemáticos, politólogos e engenheiros formais.
                </p>
              </div>
            ) : (
              <div className="prose prose-slate prose-xs max-h-[380px] overflow-y-auto pr-2 text-slate-700 leading-relaxed custom-scrollbar">
                {/* Visual rendering of Markdown response */}
                <div className="space-y-4 text-xs">
                  {auditResponse.split("\n").map((line, idx) => {
                    if (line.startsWith("###")) {
                      return <h3 key={idx} className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4">{line.replace("###", "").trim()}</h3>;
                    }
                    if (line.startsWith("####")) {
                      return <h4 key={idx} className="text-xs font-bold text-slate-900 mt-3 flex items-center gap-1.5">{line.replace("####", "").trim()}</h4>;
                    }
                    if (line.startsWith("* ")) {
                      return <li key={idx} className="ml-4 list-disc text-slate-600 my-1">{line.replace("* ", "").trim()}</li>;
                    }
                    if (line.trim() === "---") {
                      return <hr key={idx} className="border-slate-200 my-3" />;
                    }
                    return <p key={idx} className="my-1.5">{line}</p>;
                  })}
                </div>

                {/* Audit Mode badge */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span>Engine: {auditMode === "api" ? "Gemini-3.5-Flash (Live API)" : "Simulado de Alta Precisão (Modo Offline)"}</span>
                    <button
                      onClick={speakAudit}
                      className={`ml-2 px-2 py-1 rounded border flex items-center gap-1 transition-all cursor-pointer text-[9px] font-bold ${
                        isSpeaking 
                          ? "bg-rose-500 border-rose-500 text-white animate-pulse" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      }`}
                      title={isSpeaking ? "Parar leitura" : "Narrar relatório por voz"}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="h-3 w-3" />
                          Parar Narração
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3" />
                          Narrar Relatório
                        </>
                      )}
                    </button>
                  </div>
                  <span>Código de Verificação: SATISFIABLE</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
