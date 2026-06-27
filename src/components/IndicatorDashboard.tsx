import { useState, useMemo, useEffect } from "react";
import { PolicyIndicator, Ministry, SimulationScenario } from "../types";
import { INITIAL_INDICATORS, INITIAL_MINISTRIES, SIMULATION_SCENARIOS } from "../data";
import { 
  TrendingUp, 
  GraduationCap, 
  HeartPulse, 
  Zap, 
  Cpu, 
  ShieldAlert, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Sliders, 
  Activity,
  Maximize2,
  Landmark,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Helper to map string to lucide icons
const IconMap: { [key: string]: any } = {
  TrendingUp,
  GraduationCap,
  HeartPulse,
  Zap,
  Cpu,
  ShieldAlert,
  Landmark
};

const IDEOLOGY_PRESETS = {
  republicanos: {
    name: "Republicanos",
    description: "Foco na eficiência de livre mercado, privatizações, responsabilidade fiscal rígida, redução de tributos e infraestrutura produtiva pesada. Prioriza o fortalecimento das instituições monetárias independentes (Banco Central) e a segurança pública.",
    growthModifier: 1.2, // Adds +1.2% growth rate
    weights: {
      economy: 25,
      security: 15,
      fiscal: 15,
      monetary: 12,
      infrastructure: 15,
      state_efficiency: 10,
      technology: 4,
      education: 2,
      health: 1,
      foreign_trade: 1,
      environment: 0
    },
    scoreModifiers: {
      economy: 15,
      security: 12,
      fiscal: 15,
      monetary: 14,
      infrastructure: 10,
      state_efficiency: 12,
      technology: 0,
      education: -10,
      health: -12,
      foreign_trade: -2,
      environment: -15
    }
  },
  democratas: {
    name: "Democratas",
    description: "Foco no bem-estar social, investimentos maciços em capital humano (educação e saúde básica), transição ecológica sustentável profunda e diplomacia multilateral de comércio exterior.",
    growthModifier: 0.6, // Adds +0.6% growth rate
    weights: {
      economy: 8,
      security: 2,
      fiscal: 1,
      monetary: 1,
      infrastructure: 5,
      state_efficiency: 3,
      technology: 10,
      education: 25,
      health: 25,
      foreign_trade: 10,
      environment: 10
    },
    scoreModifiers: {
      economy: -5,
      security: -10,
      fiscal: -15,
      monetary: -12,
      infrastructure: 2,
      state_efficiency: -4,
      technology: 8,
      education: 20,
      health: 18,
      foreign_trade: 10,
      environment: 25
    }
  }
};

export default function IndicatorDashboard() {
  const [indicators, setIndicators] = useState<PolicyIndicator[]>(INITIAL_INDICATORS);
  const [ministries, setMinistries] = useState<Ministry[]>(INITIAL_MINISTRIES);
  const [selicSource, setSelicSource] = useState<string>("");
  const [activeMinistry, setActiveMinistry] = useState<string | null>("fazenda");
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>(SIMULATION_SCENARIOS[0]);
  const [selectedIdeology, setSelectedIdeology] = useState<"republicanos" | "democratas" | "custom">("custom");
  const [isSpeakingMinistry, setIsSpeakingMinistry] = useState<string | null>(null);

  // Legislative Articulation (PL do Excedente de Energia via Senado & Câmara)
  const [surplusPLApproved, setSurplusPLApproved] = useState<boolean>(false);
  const [chamberSupport, setChamberSupport] = useState<number>(45); // 45% initial support
  const [senateSupport, setSenateSupport] = useState<number>(42); // 42% initial support
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [voteProgressStep, setVoteProgressStep] = useState<number>(0); // 0=idle, 1=voting chamber, 2=voting senate, 3=approved, 4=rejected
  const [chamberVotes, setChamberVotes] = useState<number>(0);
  const [senateVotes, setSenateVotes] = useState<number>(0);
  const [politicalCapital, setPoliticalCapital] = useState<number>(2); // 2 negotiation tokens
  const [logMessage, setLogMessage] = useState<string>("");

  const handleNegotiate = (type: "emendas" | "desestatizacao" | "compromisso") => {
    if (type === "emendas") {
      if (politicalCapital < 1) return;
      setPoliticalCapital(prev => prev - 1);
      setChamberSupport(prev => Math.min(prev + 18, 100));
      setSenateSupport(prev => Math.min(prev + 10, 100));
      setLogMessage("Liberou R$ 15M em emendas técnicas para transmissão limpa. Apoio legislativo ampliado!");
    } else if (type === "desestatizacao") {
      if (politicalCapital < 1) return;
      setPoliticalCapital(prev => prev - 1);
      setChamberSupport(prev => Math.min(prev + 10, 100));
      setSenateSupport(prev => Math.min(prev + 22, 100));
      setLogMessage("Pactuou desoneração da infraestrutura fotovoltaica. Fortaleceu apoio no Senado!");
    } else if (type === "compromisso") {
      setPoliticalCapital(prev => prev + 2);
      setChamberSupport(prev => Math.max(prev - 8, 0));
      setSenateSupport(prev => Math.max(prev - 5, 0));
      setLogMessage("Acordou concessões de segundo escalão. Capital Político recarregado (+2), mas houve leve ruído nas bancadas.");
    }
  };

  const handleStartVote = () => {
    if (isVoting) return;
    setIsVoting(true);
    setVoteProgressStep(1);
    setLogMessage("Iniciando votação nominal na Câmara dos Deputados (Necessário 257 de 513 votos)...");

    setTimeout(() => {
      // Chamber vote count
      const variance = Math.floor(Math.random() * 21) - 10; // -10 to +10
      const calculatedSupport = Math.max(5, Math.min(95, chamberSupport + variance));
      const votes = Math.round(5.13 * calculatedSupport);
      setChamberVotes(votes);

      if (votes >= 257) {
        setVoteProgressStep(2);
        setLogMessage(`Aprovado na Câmara dos Deputados com ${votes} votos favoráveis! Enviando ao Senado Federal (Necessário 41 de 81)...`);
        
        setTimeout(() => {
          // Senate vote count
          const sVariance = Math.floor(Math.random() * 15) - 7;
          const sCalculatedSupport = Math.max(5, Math.min(95, senateSupport + sVariance));
          const sVotes = Math.round(0.81 * sCalculatedSupport);
          setSenateVotes(sVotes);

          if (sVotes >= 41) {
            setVoteProgressStep(3);
            setSurplusPLApproved(true);
            setLogMessage(`Histórico! PL aprovado no Senado com ${sVotes} votos! O arco-íris tarifário da ANEEL foi destruído: todas as bandeiras foram abolidas!`);
          } else {
            setVoteProgressStep(4);
            setLogMessage(`Rejeitado no Senado Federal com apenas ${sVotes} votos favoráveis (Necessário 41). O PL foi arquivado.`);
          }
          setIsVoting(false);
        }, 1500);

      } else {
        setVoteProgressStep(4);
        setLogMessage(`Rejeitado na Câmara dos Deputados com apenas ${votes} votos favoráveis (Necessário 257). O PL foi arquivado.`);
        setIsVoting(false);
      }
    }, 1500);
  };

  const handleResetVote = () => {
    setVoteProgressStep(0);
    setChamberVotes(0);
    setSenateVotes(0);
    setChamberSupport(45);
    setSenateSupport(42);
    setPoliticalCapital(2);
    setSurplusPLApproved(false);
    setLogMessage("Votação resetada. Pronto para nova articulação do PL de Excedente Energético.");
  };

  // Load live SELIC from our Central Bank API integration
  useEffect(() => {
    async function fetchSelic() {
      try {
        const res = await fetch("/api/selic");
        if (res.ok) {
          const data = await res.json();
          if (data.selic) {
            setSelicSource(data.source || "Banco Central do Brasil");
            setMinistries(prev => prev.map(m => {
              if (m.id === "banco_central") {
                return {
                  ...m,
                  kpis: m.kpis.map(k => {
                    if (k.name === "Taxa SELIC Nominal") {
                      return { ...k, current: data.selic };
                    }
                    return k;
                  })
                };
              }
              return m;
            }));
          }
        }
      } catch (err) {
        console.error("Erro ao buscar SELIC dinâmica no painel:", err);
      }
    }
    fetchSelic();
  }, []);

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech when active ministry changes
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingMinistry(null);
  }, [activeMinistry]);

  const speakMinistry = (min: Ministry) => {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta síntese de voz.");
      return;
    }

    if (isSpeakingMinistry === min.id) {
      window.speechSynthesis.cancel();
      setIsSpeakingMinistry(null);
      return;
    }

    const textToSpeak = `${min.name}. Ministro encarregado: ${min.ministerName}. Diretriz estratégica de ação: ${min.description}. Metas principais de entrega ágil: ${min.goals.join(". ")}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "pt-BR";
    
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith("pt"));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      setIsSpeakingMinistry(null);
    };

    utterance.onerror = () => {
      setIsSpeakingMinistry(null);
    };

    setIsSpeakingMinistry(min.id);
    window.speechSynthesis.speak(utterance);
  };

  // Handle Scenario Change
  const handleScenarioChange = (scenario: SimulationScenario) => {
    setCurrentScenario(scenario);
    // Update indicator scores based on the scenario and selected ideology
    const updated = indicators.map(ind => {
      const baseScore = scenario.indicators[ind.id] || ind.score;
      let finalScore = baseScore;
      if (selectedIdeology !== "custom") {
        const preset = IDEOLOGY_PRESETS[selectedIdeology];
        const mod = preset.scoreModifiers[ind.id as keyof typeof preset.scoreModifiers] || 0;
        finalScore = Math.max(0, Math.min(100, baseScore + mod));
      }
      return {
        ...ind,
        score: finalScore
      };
    });
    setIndicators(updated);
  };

  // Handle Ideology Toggle Change
  const handleIdeologyChange = (ideology: "republicanos" | "democratas" | "custom") => {
    setSelectedIdeology(ideology);
    if (ideology === "custom") return;

    const preset = IDEOLOGY_PRESETS[ideology];
    const updated = indicators.map(ind => {
      const baseScore = currentScenario.indicators[ind.id] || INITIAL_INDICATORS.find(i => i.id === ind.id)?.score || 50;
      const mod = preset.scoreModifiers[ind.id as keyof typeof preset.scoreModifiers] || 0;
      const finalScore = Math.max(0, Math.min(100, baseScore + mod));
      return {
        ...ind,
        weight: preset.weights[ind.id as keyof typeof preset.weights] || 0,
        score: finalScore
      };
    });
    setIndicators(updated);
  };

  // Reset Weights to original Portuguese prompt weights
  const handleResetWeights = () => {
    setSelectedIdeology("custom");
    const original = INITIAL_INDICATORS.map(ind => {
      // Keep score of current scenario
      return {
        ...ind,
        weight: INITIAL_INDICATORS.find(i => i.id === ind.id)?.weight || ind.weight,
        score: currentScenario.indicators[ind.id] || ind.score
      };
    });
    setIndicators(original);
  };

  // Handle individual weight change
  const handleWeightChange = (id: string, newWeight: number) => {
    setSelectedIdeology("custom");
    setIndicators(prev => prev.map(ind => ind.id === id ? { ...ind, weight: newWeight } : ind));
  };

  // Auto-normalize weights so they sum to 100%
  const handleNormalizeWeights = () => {
    setSelectedIdeology("custom");
    const sum = indicators.reduce((acc, ind) => acc + ind.weight, 0);
    if (sum === 0) return;
    const normalized = indicators.map(ind => ({
      ...ind,
      weight: Math.round((ind.weight / sum) * 100)
    }));
    // Minor correction to ensure sum is exactly 100
    const newSum = normalized.reduce((acc, ind) => acc + ind.weight, 0);
    if (newSum !== 100) {
      const difference = 100 - newSum;
      normalized[0].weight += difference;
    }
    setIndicators(normalized);
  };

  // Calculations
  const weightsSum = useMemo(() => {
    return indicators.reduce((sum, ind) => sum + ind.weight, 0);
  }, [indicators]);

  const politicalIndex = useMemo(() => {
    if (weightsSum === 0) return 0;
    const rawSum = indicators.reduce((sum, ind) => sum + (ind.score * ind.weight), 0);
    return parseFloat((rawSum / weightsSum).toFixed(1));
  }, [indicators, weightsSum]);

  // GDP Target Projection calculations
  const gdpTargetProgress = useMemo(() => {
    const current = 9500;
    const target = 130000;
    return parseFloat(((current / target) * 100).toFixed(2));
  }, []);

  const effectiveGrowthRate = useMemo(() => {
    let rate = currentScenario.growthRate;
    if (selectedIdeology === "republicanos") {
      rate += IDEOLOGY_PRESETS.republicanos.growthModifier;
    } else if (selectedIdeology === "democratas") {
      rate += IDEOLOGY_PRESETS.democratas.growthModifier;
    }
    if (surplusPLApproved) {
      rate += 0.4;
    }
    return parseFloat(rate.toFixed(1));
  }, [currentScenario, selectedIdeology, surplusPLApproved]);

  const yearsToTarget = useMemo(() => {
    const current = 9500;
    const target = 130000;
    const r = effectiveGrowthRate / 100;
    if (r <= 0) return "Infinito";
    // Formula: target = current * (1 + r)^t  => t = log(target/current) / log(1+r)
    const t = Math.log(target / current) / Math.log(1 + r);
    return Math.round(t) + " anos";
  }, [effectiveGrowthRate]);

  const projectedPib2045 = useMemo(() => {
    const current = 9500;
    const r = effectiveGrowthRate / 100;
    const t = 19; // 2045 - 2026
    const val = current * Math.pow(1 + r, t);
    return `US$ ${Math.round(val).toLocaleString("pt-BR")}`;
  }, [effectiveGrowthRate]);

  // Custom SVG Radar Coordinates Creator
  const radarChartData = useMemo(() => {
    const N = indicators.length;
    const cx = 150;
    const cy = 150;
    const rMax = 110;

    // Outer radar grid lines
    const grids = [20, 40, 60, 80, 100];

    // Axis angles and labels
    const axes = indicators.map((ind, i) => {
      const angle = (2 * Math.PI * i) / N - Math.PI / 2;
      const xMax = cx + rMax * Math.cos(angle);
      const yMax = cy + rMax * Math.sin(angle);
      
      const rVal = (ind.score / 100) * rMax;
      const xVal = cx + rVal * Math.cos(angle);
      const yVal = cy + rVal * Math.sin(angle);

      // Label positions (offset outward)
      const labelDist = rMax + 20;
      let lx = cx + labelDist * Math.cos(angle);
      let ly = cy + labelDist * Math.sin(angle);
      
      // Fine-tune label alignment
      let textAnchor = "middle";
      if (Math.cos(angle) > 0.1) textAnchor = "start";
      else if (Math.cos(angle) < -0.1) textAnchor = "end";

      return {
        id: ind.id,
        name: ind.name.split(" ")[0] + "..", // short name
        fullName: ind.name,
        angle,
        xMax,
        yMax,
        xVal,
        yVal,
        lx,
        ly,
        textAnchor,
        score: ind.score
      };
    });

    const polygonPoints = axes.map(a => `${a.xVal},${a.yVal}`).join(" ");

    return { cx, cy, grids, axes, polygonPoints, rMax };
  }, [indicators]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Ideology Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="h-5 w-5 text-slate-950" />
              Diretriz Ideológica de Políticas Públicas
            </h3>
            <p className="text-xs text-slate-500">Veja como premissas doutrinárias alteram pesos e resultados de metas governamentais</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full md:w-auto">
            <button
              onClick={() => handleIdeologyChange("republicanos")}
              className={`flex-1 md:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedIdeology === "republicanos"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🇧🇷 Republicanos
            </button>
            <button
              onClick={() => handleIdeologyChange("democratas")}
              className={`flex-1 md:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedIdeology === "democratas"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🇧🇷 Democratas
            </button>
            <button
              onClick={() => handleIdeologyChange("custom")}
              className={`flex-1 md:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedIdeology === "custom"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚙️ Customizado
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIdeology}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
          >
            <div className="md:col-span-8">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono mb-1">
                {selectedIdeology === "custom" ? "Ajuste Livre" : `Doutrina Ativa: ${IDEOLOGY_PRESETS[selectedIdeology].name}`}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedIdeology === "custom" 
                  ? "Ajuste os pesos dos sliders individualmente ou normalize para redistribuir em 100%. Qualquer modificação manual mudará automaticamente para o modo Customizado."
                  : IDEOLOGY_PRESETS[selectedIdeology].description}
              </p>
            </div>

            <div className="md:col-span-4 bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">Modificador de Crescimento</span>
              <strong className="text-sm font-black text-slate-900 block mt-1">
                {selectedIdeology === "custom" ? "Dinâmico" : `+${IDEOLOGY_PRESETS[selectedIdeology].growthModifier}% a.a.`}
              </strong>
              <span className="block text-[9px] text-slate-500 mt-0.5">
                {selectedIdeology === "custom" ? "Ajustado por cenário" : "Impacto de eficiência de políticas"}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Radar (5/12 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Unified GDP Progression Widget */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Objetivo Nacional</span>
                <h3 className="text-lg font-bold">Meta 2045: GDP per capita</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 font-mono">US$ 130K</span>
                <p className="text-[10px] text-slate-400 font-mono">PPP target</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Progress indicator */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>Atual: US$ 9.500</span>
                  <span>{gdpTargetProgress}% concluído</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(gdpTargetProgress, 5)}%` }}
                  ></div>
                </div>
              </div>

              {/* Simulated Speedometer */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div>
                  <span className="block text-[10px] text-slate-400">Crescimento</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">+{effectiveGrowthRate}% a.a.</span>
                </div>
                <div className="border-x border-slate-800">
                  <span className="block text-[10px] text-slate-400">PIB Estimado 2045</span>
                  <span className="text-sm font-bold text-white font-mono">{projectedPib2045}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Tempo de Espera</span>
                  <span className="text-sm font-bold text-teal-300 font-mono">{yearsToTarget}</span>
                </div>
              </div>

              {/* Maricá RJ Historical Benchmark */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                <span className="text-emerald-400 font-black block mb-0.5">💡 BENCHMARK NACIONAL (ACELERAÇÃO):</span>
                O município de <strong className="text-white">Maricá - RJ</strong> saltou de um PIB per capita de ~US$ 2.000 para mais de <strong className="text-emerald-400">US$ 130.000</strong> entre 2010 e 2021 impulsionado pela canalização estratégica de royalties de petróleo, provando que quebras estruturais aceleradas de renda média são factíveis sob governança orientada.
              </div>
            </div>
          </div>

        {/* Dynamic political index & radar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-700" />
                Índice Político Dinâmico (IP)
              </h3>
              <p className="text-xs text-slate-500">Média ponderada baseada no seu plano de governo</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">{politicalIndex}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">escala 0-100</span>
            </div>
          </div>

          {/* SVG Radar Chart */}
          <div className="w-full aspect-square max-w-[280px] my-2 relative">
            <svg 
              viewBox="0 0 300 300" 
              className="w-full h-full text-slate-300 overflow-visible"
            >
              {/* Radar Grid Circles */}
              {radarChartData.grids.map((grid, gIdx) => {
                const r = (grid / 100) * radarChartData.rMax;
                return (
                  <circle
                    key={grid}
                    cx={radarChartData.cx}
                    cy={radarChartData.cy}
                    r={r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.5}
                    strokeDasharray={gIdx === 4 ? "none" : "2 2"}
                    className="opacity-40"
                  />
                );
              })}

              {/* Grid concentric text labels */}
              <text x={radarChartData.cx} y={radarChartData.cy - (100/100)*radarChartData.rMax - 2} className="text-[8px] font-mono fill-slate-400 text-center" textAnchor="middle">100</text>
              <text x={radarChartData.cx} y={radarChartData.cy - (60/100)*radarChartData.rMax - 2} className="text-[8px] font-mono fill-slate-400 text-center" textAnchor="middle">60</text>
              <text x={radarChartData.cx} y={radarChartData.cy - (20/100)*radarChartData.rMax - 2} className="text-[8px] font-mono fill-slate-400 text-center" textAnchor="middle">20</text>

              {/* Radar Axes spokes */}
              {radarChartData.axes.map((axis) => (
                <line
                  key={axis.id}
                  x1={radarChartData.cx}
                  y1={radarChartData.cy}
                  x2={axis.xMax}
                  y2={axis.yMax}
                  stroke="currentColor"
                  strokeWidth={0.5}
                  className="opacity-40"
                />
              ))}

              {/* Performance Area Polygon */}
              <polygon
                points={radarChartData.polygonPoints}
                fill="rgba(15, 23, 42, 0.08)"
                stroke="#0f172a"
                strokeWidth={2}
                className="transition-all duration-300"
              />

              {/* Dots on axes */}
              {radarChartData.axes.map((axis) => (
                <g key={axis.id}>
                  <circle
                    cx={axis.xVal}
                    cy={axis.yVal}
                    r={3.5}
                    className="fill-slate-900 stroke-white stroke-2 transition-all duration-300"
                  />
                </g>
              ))}

              {/* Labels */}
              {radarChartData.axes.map((axis) => (
                <text
                  key={axis.id}
                  x={axis.lx}
                  y={axis.ly + 3}
                  textAnchor={axis.textAnchor}
                  className="text-[9px] font-mono fill-slate-600 font-bold"
                >
                  {axis.name} ({axis.score})
                </text>
              ))}
            </svg>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 text-[10px] font-mono mt-4 pt-3 border-t border-slate-100 text-slate-500">
            <div className="flex items-center gap-1.5 justify-center bg-slate-50 py-1.5 rounded">
              <span className="w-2.5 h-2.5 bg-slate-900 border border-white rounded-full"></span>
              <span>Evolução Atual</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center bg-slate-50 py-1.5 rounded">
              <span className="w-2.5 h-2.5 border border-dashed border-slate-400 rounded-full"></span>
              <span>Metas 2045 (100)</span>
            </div>
          </div>
        </div>

        {/* Legislative Articulation & Energy PL Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Landmark className="h-4 w-4 text-indigo-600" />
                Articulação: PL do Excedente Energético
              </h3>
              <p className="text-xs text-slate-500">Tramitação no Congresso para autorizar pessoa física a comercializar excedente de energia limpa</p>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              surplusPLApproved 
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                : "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
            }`}>
              {surplusPLApproved ? "APROVADO & SANCIONADO" : "EM TRAMITAÇÃO"}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Estratégia Nacional:</strong> Propõe autorizar o cliente pessoa física a comercializar diretamente o excedente elétrico das matrizes limpas. O excedente de receita gerado é injetado no superávit nacional, <strong className="text-slate-900">destruindo o complexo "arco-íris tarifário" da ANEEL</strong> (substituindo todas as bandeiras vermelhas/amarelas por tarifas fixas baratas).
          </p>

          {/* Support percentages */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/60">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-700">Câmara dos Deputados</span>
                <span className="font-mono text-indigo-600 font-bold">{chamberSupport}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${chamberSupport}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-1 block text-center bg-white border border-slate-100 rounded p-1">Est. Votos: {Math.round(5.13 * chamberSupport)} / 513 <br/> (Mínimo: 257)</span>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-700">Senado Federal</span>
                <span className="font-mono text-purple-600 font-bold">{senateSupport}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${senateSupport}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-1 block text-center bg-white border border-slate-100 rounded p-1">Est. Votos: {Math.round(0.81 * senateSupport)} / 81 <br/> (Mínimo: 41)</span>
            </div>
          </div>

          {/* Political Capital Tokens & Actions */}
          <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
            <div className="flex justify-between items-center mb-2.5 text-xs">
              <span className="font-bold text-slate-700">Capital de Negociação:</span>
              <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-100">
                {[...Array(3)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`h-2 w-2 rounded-full ${
                      i < politicalCapital 
                        ? "bg-amber-500 shadow-sm shadow-amber-500/20" 
                        : "bg-slate-200"
                    }`}
                  />
                ))}
                <strong className="ml-1 font-mono text-amber-600 text-[10px]">({politicalCapital} Tokens)</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                disabled={politicalCapital < 1 || surplusPLApproved || isVoting}
                onClick={() => handleNegotiate("emendas")}
                className="text-[9px] font-bold py-1.5 px-2 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 rounded-lg text-slate-700 disabled:opacity-50 transition-all cursor-pointer"
                title="Oferecer emendas técnicas municipais para transmissão de energia limpa (-1 Token, +18% Câmara, +10% Senado)"
              >
                Liberar Emendas
              </button>
              <button
                disabled={politicalCapital < 1 || surplusPLApproved || isVoting}
                onClick={() => handleNegotiate("desestatizacao")}
                className="text-[9px] font-bold py-1.5 px-2 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 rounded-lg text-slate-700 disabled:opacity-50 transition-all cursor-pointer"
                title="Pactuar desoneração tributária para microgeradores (-1 Token, +10% Câmara, +22% Senado)"
              >
                Pacto Solar
              </button>
              <button
                disabled={surplusPLApproved || isVoting}
                onClick={() => handleNegotiate("compromisso")}
                className="text-[9px] font-bold py-1.5 px-1 bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 rounded-lg text-amber-900 disabled:opacity-50 transition-all cursor-pointer"
                title="Aceitar cargos de segundo escalão e compromissos locais (+2 Tokens, -8% Câmara, -5% Senado)"
              >
                Concessão (+2T)
              </button>
            </div>
          </div>

          {/* Voting Animation Area / Status */}
          {logMessage && (
            <div className="text-[10px] font-mono bg-slate-900 text-slate-300 p-2.5 rounded-xl border border-slate-800 leading-normal whitespace-pre-wrap">
              {logMessage}
            </div>
          )}

          {/* Interaction Buttons */}
          <div className="flex gap-2">
            {!surplusPLApproved ? (
              <button
                disabled={isVoting}
                onClick={handleStartVote}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                  isVoting 
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10"
                }`}
              >
                {isVoting ? (
                  <>
                    <span className="animate-spin inline-block h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full" />
                    Votando no Congresso...
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    Iniciar Votação Nominal do PL
                  </>
                )}
              </button>
            ) : (
              <div className="flex-1 flex flex-col gap-2">
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] rounded-xl font-medium leading-relaxed">
                  🎉 <strong>Lei de Transição Tarifária Aprovada!</strong> Com a aprovação do PL de Excedente de Energia por Pessoas Físicas, o crescimento estrutural foi acelerado em <strong>+0.4% a.a.</strong> e a complexidade tarifária da ANEEL foi substituída por tarifas fixas e baratas.
                </div>
                <button
                  onClick={handleResetVote}
                  className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[9px] font-mono font-bold rounded-lg cursor-pointer text-center"
                >
                  Resetar Articulação para Testar Novamente
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Scenarios, Sliders & Ministry KPIs (7/12 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">

        {/* 1. Cabinet Scenario Selection */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Cenários de Políticas Públicas</h3>
              <p className="text-xs text-slate-500">Selecione uma abordagem de simulação para o desenvolvimento nacional</p>
            </div>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SIMULATION_SCENARIOS.map((sc) => {
              const isActive = currentScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleScenarioChange(sc)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "border-slate-900 bg-slate-950 text-white shadow-md shadow-slate-900/10" 
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <span className="text-[10px] font-bold block opacity-60 font-mono mb-2 uppercase">Scenario</span>
                  <span className="text-xs font-bold leading-tight line-clamp-2">{sc.name.split(" ")[2] || sc.name}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-600 mt-3 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
            &ldquo;{currentScenario.description}&rdquo;
          </p>
        </div>

        {/* 2. Interactive Weight sliders */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sliders className="h-4 w-4 text-slate-700" />
                Ajuste Pessoal de Prioridades
              </h3>
              <p className="text-xs text-slate-500">Customize os pesos de cada área e avalie as mudanças no Índice Geral</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleNormalizeWeights}
                className="text-[11px] font-bold text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                title="Distribui os pesos para totalizar 100%"
              >
                Normalizar (100%)
              </button>
              <button 
                onClick={handleResetWeights}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 p-1.5 rounded-lg transition-all cursor-pointer"
                title="Resetar para pesos oficiais"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sum tracker widget */}
          <div className="mb-4 flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">Soma dos Pesos Ajustada:</span>
            <span className={`font-mono font-bold ${weightsSum === 100 ? "text-emerald-600" : "text-amber-600"}`}>
              {weightsSum}% {weightsSum === 100 ? "✓ (Perfeito)" : "⚠ (Ajuste para totalizar 100%)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
            {indicators.map((ind) => (
              <div key={ind.id} className="border border-slate-50 bg-slate-50/20 p-3 rounded-xl flex flex-col gap-1 hover:border-slate-200 transition-all">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={ind.name}>{ind.name}</span>
                  <span className="font-mono font-black text-slate-900 bg-white border border-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                    Peso: {ind.weight}%
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={ind.weight}
                  onChange={(e) => handleWeightChange(ind.id, parseInt(e.target.value) || 0)}
                  className="w-full accent-slate-900 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer my-2"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Score Atual: <strong className="text-slate-800">{ind.score}/100</strong></span>
                  <span className="text-slate-400">Var: {ind.metricCurrent} ➔ {ind.metricTarget}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Ministries KPI & Goals Explorer */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Gabinete de Metas Setoriais</h3>
              <p className="text-xs text-slate-500">O que cada pasta do governo federal precisa entregar para atingir a meta global</p>
            </div>
          </div>

          {/* Ministry selector pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {ministries.map((min) => {
              const isActive = activeMinistry === min.id;
              const Icon = IconMap[min.icon] || TrendingUp;
              return (
                <button
                  key={min.id}
                  onClick={() => setActiveMinistry(min.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? "bg-slate-100 text-slate-900 border border-slate-200" 
                      : "bg-white text-slate-500 hover:text-slate-800 border border-slate-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  {min.name.replace("Ministério da ", "Min. ")}
                </button>
              );
            })}
          </div>

          {/* Selected Ministry View */}
          <AnimatePresence mode="wait">
            {ministries.map((min) => {
              if (min.id !== activeMinistry) return null;
              return (
                <motion.div
                  key={min.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* description */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Foco Estratégico</span>
                    <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 mt-0.5">
                      {min.ministerName}
                      <button
                        onClick={() => speakMinistry(min)}
                        className={`p-1 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                          isSpeakingMinistry === min.id 
                            ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20" 
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                        title={isSpeakingMinistry === min.id ? "Parar narração" : "Ouvir metas por voz"}
                      >
                        {isSpeakingMinistry === min.id ? (
                          <VolumeX className="h-3 w-3 animate-pulse" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                      </button>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{min.description}</p>
                  </div>

                  {/* Metas prioritárias */}
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">Ações de Entrega Rápidas</span>
                    <ul className="space-y-2">
                      {min.goals.map((g, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-slate-900 flex-shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* KPIs Tracker */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Indicadores Chave de Performance (KPIs)</span>
                      {min.id === "banco_central" && selicSource && (
                        <span className="text-[9px] font-semibold text-indigo-500 bg-indigo-50/80 px-2 py-0.5 rounded-full border border-indigo-100/30">
                          Fonte Real: {selicSource}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {min.kpis.map((kpi, i) => {
                        // Calculate a dynamic progressive progress matching the current scenario and selected ideology modifiers
                        let modProgress = kpi.progress;
                        
                        // Scenario modifications
                        if (currentScenario.id === "choque_gestao") {
                          modProgress += 15;
                        } else if (currentScenario.id === "fronteira_ia") {
                          modProgress += 30;
                        } else if (currentScenario.id === "pacto_sustentavel") {
                          modProgress += 10;
                        }

                        // Ideology modifications
                        if (selectedIdeology === "republicanos") {
                          if (min.id === "banco_central" || min.id === "fazenda" || min.id === "justica") {
                            modProgress += 12;
                          } else if (min.id === "educacao" || min.id === "saude") {
                            modProgress -= 10;
                          }
                        } else if (selectedIdeology === "democratas") {
                          if (min.id === "educacao" || min.id === "saude" || min.id === "infraestrutura") {
                            modProgress += 15;
                          } else if (min.id === "banco_central" || min.id === "fazenda") {
                            modProgress -= 6;
                          }
                        }

                        modProgress = Math.max(1, Math.min(modProgress, 99));
                        
                        return (
                          <div key={i} className="border border-slate-100 p-3 rounded-xl bg-white flex flex-col justify-between hover:shadow-sm transition-all">
                            <div>
                              <span className="text-[10px] font-semibold text-slate-500 block leading-tight">{kpi.name}</span>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-base font-bold text-slate-900 font-mono">{kpi.current}</span>
                                <span className="text-[10px] text-slate-400">➔ {kpi.target}</span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-1">
                                <span>Progresso</span>
                                <span>{modProgress}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-slate-900 rounded-full transition-all duration-300" 
                                  style={{ width: `${modProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

    </div>

    </div>
  );
}
