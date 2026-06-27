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
  VolumeX,
  Sun,
  Landmark,
  Zap,
  Users,
  Activity,
  Battery,
  Moon,
  Sparkles,
  Clock
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

  // Estados para a simulação do PL da Descentralização Solar e Venda de Excedente
  const [solarChamberSupport, setSolarChamberSupport] = useState<number>(48);
  const [solarSenateSupport, setSolarSenateSupport] = useState<number>(44);
  const [solarPoliticalCapital, setSolarPoliticalCapital] = useState<number>(3);
  const [solarPLApproved, setSolarPLApproved] = useState<boolean>(false);
  const [solarIsVoting, setSolarIsVoting] = useState<boolean>(false);
  const [solarVoteProgressStep, setSolarVoteProgressStep] = useState<number>(0); // 0=idle, 1=voting chamber, 2=voting senate, 3=approved, 4=rejected
  const [solarChamberVotes, setSolarChamberVotes] = useState<number>(0);
  const [solarSenateVotes, setSolarSenateVotes] = useState<number>(0);
  const [solarLog, setSolarLog] = useState<string>("Pronto para iniciar a articulação com o Congresso Nacional.");

  // Estados para o Simulador de Armazenamento Solar Diurno (Baterias) e Gestão de Pico
  const [hasSolarStorage, setHasSolarStorage] = useState<boolean>(true);
  const [batteryCapacity, setBatteryCapacity] = useState<number>(10); // em kWh
  const [dailyPeakUsage, setDailyPeakUsage] = useState<number>(6); // consumo em kWh das 18h às 21h
  const [solarPanelsCapacity, setSolarPanelsCapacity] = useState<number>(5); // kWp de geração solar instalada

  const handleSolarNegotiate = (actionType: "agro" | "icms" | "popular") => {
    if (actionType === "agro") {
      if (solarPoliticalCapital < 1) return;
      setSolarPoliticalCapital(prev => prev - 1);
      setSolarChamberSupport(prev => Math.min(prev + 16, 100));
      setSolarSenateSupport(prev => Math.min(prev + 8, 100));
      setSolarLog("Pactuou incentivos regulatórios para a microgeração fotovoltaica de produtores rurais. Forte avanço com a bancada do Agro (+16% na Câmara, +8% no Senado)!");
    } else if (actionType === "icms") {
      if (solarPoliticalCapital < 1) return;
      setSolarPoliticalCapital(prev => prev - 1);
      setSolarChamberSupport(prev => Math.min(prev + 8, 100));
      setSolarSenateSupport(prev => Math.min(prev + 20, 100));
      setSolarLog("Compensou os Estados com créditos federais para perdas locais de ICMS na autoprodução. Excelente avanço no Senado (+20%) e Câmara (+8%)!");
    } else if (actionType === "popular") {
      setSolarPoliticalCapital(prev => prev + 1);
      setSolarChamberSupport(prev => Math.min(prev + 10, 100));
      setSolarSenateSupport(prev => Math.min(prev + 10, 100));
      setSolarLog("Disparou uma campanha digital em defesa do consumidor/prossumidor solar. Mobilização popular gerou forte pressão orgânica nos parlamentares (+10% suporte em ambas as casas, +1 Token de Capital Político).");
    }
  };

  const handleStartSolarVote = () => {
    if (solarIsVoting) return;
    setSolarIsVoting(true);
    setSolarVoteProgressStep(1);
    setSolarLog("Votação iniciada! Os 513 deputados federais estão registrando seus votos na Câmara...");

    setTimeout(() => {
      const variance = Math.floor(Math.random() * 17) - 8; // -8% to +8%
      const finalChamberSupport = Math.max(10, Math.min(98, solarChamberSupport + variance));
      const votes = Math.round(5.13 * finalChamberSupport);
      setSolarChamberVotes(votes);

      if (votes >= 257) {
        setSolarVoteProgressStep(2);
        setSolarLog(`Aprovado na Câmara! Recebeu ${votes} votos favoráveis (necessário 257). Enviando imediatamente à comissão de infraestrutura do Senado Federal...`);
        
        setTimeout(() => {
          const sVariance = Math.floor(Math.random() * 13) - 6;
          const finalSenateSupport = Math.max(10, Math.min(98, solarSenateSupport + sVariance));
          const sVotes = Math.round(0.81 * finalSenateSupport);
          setSolarSenateVotes(sVotes);

          if (sVotes >= 41) {
            setSolarVoteProgressStep(3);
            setSolarPLApproved(true);
            setSolarLog(`Histórico! O PL de Descentralização Energética foi aprovado no Senado com ${sVotes} votos favoráveis (necessário 41). O arco-íris tarifário da ANEEL foi quebrado, garantindo o direito de venda livre do excedente solar!`);
          } else {
            setSolarVoteProgressStep(4);
            setSolarLog(`Rejeitado no Senado Federal! Obteve apenas ${sVotes} votos favoráveis dos 41 necessários. O PL de venda do excedente solar foi arquivado.`);
          }
          setSolarIsVoting(false);
        }, 1500);

      } else {
        setSolarVoteProgressStep(4);
        setSolarLog(`Rejeitado na Câmara dos Deputados! Obteve apenas ${votes} votos favoráveis dos 257 necessários. O projeto foi arquivado.`);
        setSolarIsVoting(false);
      }
    }, 1500);
  };

  const handleResetSolarVote = () => {
    setSolarChamberSupport(48);
    setSolarSenateSupport(44);
    setSolarPoliticalCapital(3);
    setSolarPLApproved(false);
    setSolarIsVoting(false);
    setSolarVoteProgressStep(0);
    setSolarChamberVotes(0);
    setSolarSenateVotes(0);
    setSolarLog("Votação e coalizão legislativa resetadas. Pronto para nova articulação.");
  };

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

      {/* Legislative Solar Microgeneration Surplus Sale Module */}
      <div className="mt-12 pt-10 border-t border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider font-mono block mb-1">
              Proposição Legislativa & Descentralização
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sun className="h-6 w-6 text-amber-500 fill-amber-300" />
              PL do Marco Regulatório da Microgeração Solar
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl mt-1">
              Uma análise aprofundada dos mecanismos de articulação política entre o Poder Executivo, a Câmara dos Deputados e o Senado Federal para viabilizar a venda direta do excedente solar por cidadãos e pequenos negócios, demolindo o oligopólio tarifário.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
              solarPLApproved 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
            }`}>
              <Zap className={`h-3.5 w-3.5 ${solarPLApproved ? "text-emerald-500" : "text-amber-500"}`} />
              {solarPLApproved ? "PL APROVADO & VIGENTE" : "PL EM TRAMITAÇÃO (CÂMARA / SENADO)"}
            </span>
          </div>
        </div>

        {/* Three-Way Power Interaction Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Executive Role */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-slate-100 font-mono text-3xl font-black select-none">01</div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-2 relative z-10">
              <span className="p-1 bg-indigo-50 text-indigo-600 rounded">
                <Activity className="h-4 w-4" />
              </span>
              Poder Executivo (Autor)
            </h4>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider font-mono block mb-2">Papel: Proposição & Articulação</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Formula o projeto de lei de descentralização e lidera a coordenação política. Utiliza recursos técnicos (como a liberação de emendas para redes de transmissão e compensações interestaduais) como moedas de diálogo para construir maioria no Congresso.
            </p>
            <div className="mt-3 text-[10px] text-slate-400 font-mono border-t border-slate-200/50 pt-2 flex items-center justify-between">
              <span>Alvo: Destruição do Arco-íris Tarifário</span>
              <span>Foco: Prossumidores</span>
            </div>
          </div>

          {/* Chamber Role */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-slate-100 font-mono text-3xl font-black select-none">02</div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-2 relative z-10">
              <span className="p-1 bg-purple-50 text-purple-600 rounded">
                <Users className="h-4 w-4" />
              </span>
              Câmara dos Deputados
            </h4>
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider font-mono block mb-2">Papel: Defesa do Consumidor & Voto Popular</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Primeira etapa de aprovação (mínimo de 257 de 513 votos). Concentra o debate no direito do consumidor residencial/comercial de vender energia livremente à rede elétrica, enfrentando a forte oposição das corporações distribuidoras de energia convencionais.
            </p>
            <div className="mt-3 text-[10px] text-slate-400 font-mono border-t border-slate-200/50 pt-2 flex items-center justify-between">
              <span>Mínimo: 257 deputados</span>
              <span>Foco: Geração livre</span>
            </div>
          </div>

          {/* Senate Role */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-slate-100 font-mono text-3xl font-black select-none">03</div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-2 relative z-10">
              <span className="p-1 bg-amber-50 text-amber-600 rounded">
                <Landmark className="h-4 w-4" />
              </span>
              Senado Federal
            </h4>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider font-mono block mb-2">Papel: Pacto Federativo & ICMS Estadual</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Casa revisora final (mínimo de 41 de 81 votos). Analisa a estabilidade de transmissão do grid e pactua compensações sobre a potencial perda de arrecadação de ICMS de energia pelos Estados por conta da autoprodução solar massiva.
            </p>
            <div className="mt-3 text-[10px] text-slate-400 font-mono border-t border-slate-200/50 pt-2 flex items-center justify-between">
              <span>Mínimo: 41 senadores</span>
              <span>Foco: Compensação fiscal</span>
            </div>
          </div>
        </div>

        {/* Interactive Simulator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950 text-slate-100 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Controls and States (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono block mb-1">
                Painel de Controle de Coalizão
              </span>
              <h4 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-indigo-400" />
                Estratégias de Negociação
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Use seu capital político remanescente para articular apoio estratégico nas comissões e plenários. Cada decisão muda os votos projetados.
              </p>
            </div>

            {/* Capital Político Indicator */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Capital de Articulação</span>
                <span className="text-base font-black text-white font-mono">
                  {solarPoliticalCapital} {solarPoliticalCapital === 1 ? "Token" : "Tokens"}
                </span>
              </div>
              <div className="flex gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                {[1, 2, 3, 4].map((tokenNum) => (
                  <span 
                    key={tokenNum}
                    className={`h-3.5 w-3.5 rounded-full block transition-all ${
                      tokenNum <= solarPoliticalCapital 
                        ? "bg-amber-500 shadow-sm shadow-amber-500/30 animate-pulse" 
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Negotiation Options */}
            <div className="flex flex-col gap-2.5">
              {/* Agro */}
              <button
                disabled={solarPoliticalCapital < 1 || solarPLApproved || solarIsVoting}
                onClick={() => handleSolarNegotiate("agro")}
                className="w-full text-left p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-start gap-2.5"
              >
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg mt-0.5 font-mono text-xs font-bold">1T</span>
                <div>
                  <span className="text-xs font-bold text-white block">Regulação Fotovoltaica Rural</span>
                  <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Concede marcos favoráveis para o agronegócio autoprodutor (+16% Câmara, +8% Senado)</span>
                </div>
              </button>

              {/* ICMS */}
              <button
                disabled={solarPoliticalCapital < 1 || solarPLApproved || solarIsVoting}
                onClick={() => handleSolarNegotiate("icms")}
                className="w-full text-left p-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-start gap-2.5"
              >
                <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg mt-0.5 font-mono text-xs font-bold">1T</span>
                <div>
                  <span className="text-xs font-bold text-white block">Pacto Federativo de ICMS</span>
                  <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">Subsidia parcialmente perdas tributárias dos estados na autoprodução (+8% Câmara, +20% Senado)</span>
                </div>
              </button>

              {/* Popular Campaign */}
              <button
                disabled={solarPLApproved || solarIsVoting}
                onClick={() => handleSolarNegotiate("popular")}
                className="w-full text-left p-3 rounded-xl border border-amber-900/40 hover:border-amber-800 bg-amber-950/20 hover:bg-amber-950/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-start gap-2.5"
              >
                <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg mt-0.5 font-mono text-xs font-bold">+1T</span>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">Campanha de Mobilização Popular</span>
                  <span className="text-[10px] text-amber-100/60 leading-normal block mt-0.5">Ativa pressão cívica digital contra as grandes distribuidoras (+10% em ambas as casas, recupera 1 Token)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Voting Visualizers and Projection (Col 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono block mb-1">
                Projeção Legislativa em Tempo Real
              </span>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-emerald-400" />
                Mapeamento de Apoio no Congresso
              </h4>
            </div>

            {/* Progress Gauges */}
            <div className="space-y-4">
              {/* Chamber gauge */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Apoio na Câmara dos Deputados</span>
                  <span className="font-mono text-indigo-400 font-bold">{solarChamberSupport}%</span>
                </div>
                <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${solarChamberSupport}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                  <span>Est. Votos: {Math.round(5.13 * solarChamberSupport)} / 513</span>
                  <span className="font-mono">Meta: 257 (Simples)</span>
                </div>
              </div>

              {/* Senate gauge */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Apoio no Senado Federal</span>
                  <span className="font-mono text-purple-400 font-bold">{solarSenateSupport}%</span>
                </div>
                <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${solarSenateSupport}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                  <span>Est. Votos: {Math.round(0.81 * solarSenateSupport)} / 81</span>
                  <span className="font-mono">Meta: 41 (Simples)</span>
                </div>
              </div>
            </div>

            {/* Log Window */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-1">Registro de Articulação</span>
              <p className="text-xs font-mono text-slate-300 leading-relaxed h-14 overflow-y-auto">
                {solarLog}
              </p>
            </div>

            {/* Dynamic Status / Actions */}
            <div className="space-y-3">
              {solarVoteProgressStep === 0 && (
                <button
                  onClick={handleStartSolarVote}
                  disabled={solarIsVoting}
                  className="w-full py-3 px-5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-950/50"
                >
                  <Zap className="h-4 w-4" />
                  Iniciar Tramitação Legislativa do PL
                </button>
              )}

              {solarIsVoting && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
                  <div className="animate-spin inline-block h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full mb-2"></div>
                  <p className="text-xs font-mono text-indigo-300">Votação nominal em andamento no Congresso Nacional...</p>
                </div>
              )}

              {solarVoteProgressStep === 3 && (
                <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <strong className="text-emerald-400 text-xs">🎉 LEI DE DESCENTRALIZAÇÃO ENERGÉTICA APROVADA!</strong>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">
                    O projeto de lei foi plenamente sancionado! Agora, clientes de microgeração solar residencial e comercial podem vender livremente seu excedente diretamente de volta para a rede com crédito líquido na conta. O arco-íris de bandeiras da ANEEL foi quebrado, reduzindo custos para toda a sociedade!
                  </p>
                  <button
                    onClick={handleResetSolarVote}
                    className="text-[9px] font-mono font-bold text-slate-400 hover:text-white underline mt-1 text-left cursor-pointer"
                  >
                    Resetar Articulação para Nova Simulação
                  </button>
                </div>
              )}

              {solarVoteProgressStep === 4 && (
                <div className="bg-rose-950/40 border border-rose-800/80 p-4 rounded-2xl flex flex-col gap-2">
                  <strong className="text-rose-400 text-xs">❌ PROJETO REJEITADO & ARQUIVADO</strong>
                  <p className="text-xs text-slate-300 leading-normal">
                    O projeto não conseguiu votos suficientes das bancadas devido ao lobby corporativo das grandes distribuidoras. Tente pactuar mais apoios ou mobilizar suporte popular e tente novamente.
                  </p>
                  <button
                    onClick={handleResetSolarVote}
                    className="text-xs text-indigo-400 font-bold hover:underline text-left cursor-pointer mt-1"
                  >
                    Tentar Novamente (Reiniciar Articulação)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Solar Storage & Peak-Shaving Simulator */}
      <div className="mt-12 pt-10 border-t border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono block mb-1">
              Armazenamento Inteligente & Demanda de Pico
            </span>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Battery className="h-6 w-6 text-emerald-500 fill-emerald-100" />
              Gestão de Pico (Peak Shaving) com Bateria Solar de Baixo Custo
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl mt-1">
              Armazene energia solar abundante gerada de graça durante o dia (custo zero de captação) e descarregue automaticamente no horário de pico (18h às 21h), zerando as tarifas inflacionadas e aliviando 100% da rede elétrica.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHasSolarStorage(!hasSolarStorage)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border ${
                hasSolarStorage
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
            >
              {hasSolarStorage ? "🔋 ARMAZENAMENTO ATIVADO" : "🔌 USANDO APENAS A REDE"}
            </button>
          </div>
        </div>

        {/* Dynamic Calculation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Simulation Inputs (Col 4) */}
          <div className="lg:col-span-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col gap-5 justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                Parâmetros de Consumo & Grid
              </h4>
              <p className="text-[11px] text-slate-500">
                Ajuste os valores para simular os ganhos econômicos e a estabilidade de rede em tempo real.
              </p>
            </div>

            {/* Input sliders */}
            <div className="space-y-4">
              {/* Solar Generation slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Capacidade Solar (kWp)</span>
                  <span className="font-mono text-amber-500 font-bold">{solarPanelsCapacity} kWp</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="0.5"
                  value={solarPanelsCapacity}
                  onChange={(e) => setSolarPanelsCapacity(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Gera aprox. {Math.round(solarPanelsCapacity * 4.2)} kWh diários de energia limpa livre de custos.
                </span>
              </div>

              {/* Battery Capacity slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Capacidade da Bateria (kWh)</span>
                  <span className="font-mono text-emerald-500 font-bold">{batteryCapacity} kWh</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Armazena o excedente de baixo custo gerado ao longo do dia para o horário noturno.
                </span>
              </div>

              {/* Peak usage slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">Consumo no Horário de Pico (kWh)</span>
                  <span className="font-mono text-indigo-500 font-bold">{dailyPeakUsage} kWh</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={dailyPeakUsage}
                  onChange={(e) => setDailyPeakUsage(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Demanda total do domicílio no horário crítico (18h às 21h).
                </span>
              </div>
            </div>

            {/* Note about low-cost LFP battery */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[10px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700 block mb-0.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500 fill-amber-300" />
                Como o Armazenamento Ficou Barato?
              </span>
              O PL de Descentralização isenta impostos de importação sobre células de LFP e estimula parcerias público-privadas de montagem local, reduzindo em até 65% o custo de aquisição do armazenamento.
            </div>
          </div>

          {/* Scenario Comparison (Col 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Scenario A: Without Storage */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              !hasSolarStorage 
                ? "bg-rose-50/40 border-rose-200/80 ring-2 ring-rose-200/50" 
                : "bg-white border-slate-100"
            }`}>
              <div>
                <span className="text-[10px] font-bold text-rose-500 font-mono uppercase tracking-wider block mb-1">Cenário A</span>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  Sem Bateria (Rede Tradicional)
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  O consumidor compra energia cara no pico e joga fora o excesso solar gerado de dia porque não tem onde guardar.
                </p>

                {/* Metrics */}
                <div className="mt-5 space-y-3.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">TARIFA NO HORÁRIO DE PICO (18h-21h)</span>
                    <span className="text-lg font-black text-rose-600 font-mono">
                      R$ 1,45 / kWh
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">CUSTO DO HORÁRIO DE PICO (MENSAL)</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      R$ {Math.round(dailyPeakUsage * 1.45 * 30).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">ESTRESSE DE TRANSMISSÃO DE PICO</span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                      🔴 100% dependente da distribuidora convencional
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100/80 text-[10px] text-slate-400">
                Sujeito às bandeiras tarifárias de escassez da ANEEL.
              </div>
            </div>

            {/* Scenario B: With Solar Storage */}
            <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              hasSolarStorage 
                ? "bg-emerald-50/50 border-emerald-200 ring-2 ring-emerald-200/50" 
                : "bg-white border-slate-100"
            }`}>
              <div>
                <span className="text-[10px] font-bold text-emerald-500 font-mono uppercase tracking-wider block mb-1">Cenário B</span>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500 fill-amber-300 animate-pulse" />
                  Com Armazenamento Diurno
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  Armazena de graça durante o pico solar do meio-dia e injeta localmente às 18h. A tarifa externa de pico é pulverizada.
                </p>

                {/* Metrics */}
                <div className="mt-5 space-y-3.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">TARIFA NO HORÁRIO DE PICO (18h-21h)</span>
                    <span className={`text-lg font-black font-mono flex items-center gap-1.5 ${
                      batteryCapacity >= dailyPeakUsage ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      R$ {Math.max(0, dailyPeakUsage - batteryCapacity) === 0 ? "0,00" : ( (Math.max(0, dailyPeakUsage - batteryCapacity) / dailyPeakUsage) * 1.45 ).toFixed(2)} / kWh
                      {batteryCapacity >= dailyPeakUsage && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">
                          Zerada!
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">CUSTO DO HORÁRIO DE PICO (MENSAL)</span>
                    <span className="text-base font-bold text-slate-900 font-mono flex items-center gap-1.5">
                      R$ {Math.round(Math.max(0, dailyPeakUsage - batteryCapacity) * 1.45 * 30).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {batteryCapacity >= dailyPeakUsage && (
                        <span className="text-xs text-emerald-600 font-bold">(100% de Autonomia)</span>
                      )}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">ECONOMIA MENSAL REALIZADA</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono flex items-center gap-1">
                      🟢 R$ {Math.round((dailyPeakUsage * 1.45 - Math.max(0, dailyPeakUsage - batteryCapacity) * 1.45) * 30).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} economizados/mês
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100/80 text-[10px] text-emerald-700 font-semibold bg-emerald-50/60 p-2.5 rounded-lg flex items-center justify-between">
                <span>🌱 Emissões salvas: {Math.round(Math.min(batteryCapacity, dailyPeakUsage) * 30 * 0.25)} kg CO2/mês</span>
                <span>Payback Estimado: 2.4 anos</span>
              </div>
            </div>

          </div>
        </div>

        {/* Visual Battery State Animation flow */}
        {hasSolarStorage && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="max-w-md">
                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">Status do Ciclo Energético Diário</span>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  Visualização do Fluxo de Carga e Alívio de Pico
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Durante o período solar abundante (10h-15h), os painéis geram até {solarPanelsCapacity} kW de potência instantânea. O excesso de geração recarrega a bateria LFP. À noite (18h-21h), a bateria assume 100% da carga, limpando o grid da distribuidora e neutralizando a tarifa inflacionada.
                </p>
              </div>

              {/* Battery Graphic with animation */}
              <div className="flex items-center gap-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 w-full md:w-auto justify-center">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-slate-400 block mb-2">Ciclo de Carga</span>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-400 fill-amber-300 animate-pulse" />
                    <span className="h-1.5 w-8 bg-amber-500/30 rounded-full overflow-hidden block">
                      <span className="h-full bg-amber-400 w-full block animate-pulse"></span>
                    </span>
                    <Battery className="h-10 w-10 text-emerald-400 fill-emerald-950/40" />
                    <span className="h-1.5 w-8 bg-emerald-500/30 rounded-full overflow-hidden block">
                      <span className="h-full bg-emerald-400 w-full block animate-pulse"></span>
                    </span>
                    <Moon className="h-5 w-5 text-indigo-400 fill-indigo-900/40" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-2.5">
                    Eficiência do Ciclo de Armazenamento: 94.5% (LFP de Baixa Degradabilidade)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
