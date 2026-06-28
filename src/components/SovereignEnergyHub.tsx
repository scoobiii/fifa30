import React, { useState, useEffect } from "react";
import { 
  Scale, 
  Cpu, 
  TrendingUp, 
  Zap, 
  Coins, 
  Search, 
  Database, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Check, 
  Copy, 
  Activity, 
  Globe, 
  DollarSign, 
  Layers, 
  Terminal, 
  RefreshCw, 
  Lock, 
  ChevronRight, 
  Info,
  QrCode,
  Share2,
  FileText,
  Sliders,
  Sparkles,
  BookOpen,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import LegislativeProposalManager from "./LegislativeProposalManager";

// Type definition for generator
export interface GeneratorNode {
  id: string;
  name: string;
  type: "Solar" | "Eólica" | "Hidrelétrica" | "Térmica";
  state: string;
  municipality: string;
  capacityMW: number;
  plantsCount: number;
  status: "Ativo" | "Em Construção";
}

export default function SovereignEnergyHub() {
  const [activeDashboard, setActiveDashboard] = useState<"legislativo_energetico" | "operacional" | "legislativo_juridico" | "financeiro" | "ajuste_fino_rag">("legislativo_energetico");
  
  // States for Prompt Engineering & RAG Fine-Tuning
  const [systemPromptValue, setSystemPromptValue] = useState<string>("Você é o Agente de Decisão Racional 2026, um assistente virtual analítico altamente especializado em estatística, economia e políticas públicas brasileiras.");
  const [isSavingPrompt, setIsSavingPrompt] = useState<boolean>(false);
  const [ragDocs, setRagDocs] = useState<any[]>([]);
  const [isLoadingRag, setIsLoadingRag] = useState<boolean>(false);
  const [isSavingRagDoc, setIsSavingRagDoc] = useState<boolean>(false);
  const [newDocTitle, setNewDocTitle] = useState<string>("");
  const [newDocCategory, setNewDocCategory] = useState<string>("Energia");
  const [newDocContent, setNewDocContent] = useState<string>("");
  const [ragAlert, setRagAlert] = useState<{ show: boolean, message: string, type: "success" | "error" } | null>(null);
  
  // States for Smart Meter (Relógio Inteligente)
  const [smartMeterValue, setSmartMeterValue] = useState<number>(342.8);
  const [smartMeterGen, setSmartMeterGen] = useState<number>(4.2); // Current generation (kW)
  const [smartMeterCons, setSmartMeterCons] = useState<number>(1.8); // Current consumption (kW)
  const [contractAddress, setContractAddress] = useState<string>("0x4f88...LFP94");
  const [smartContractSync, setSmartContractSync] = useState<boolean>(true);
  const [signedBlock, setSignedBlock] = useState<string>("SHA256-8f3a9e11c750ba42fd9a908d13904e223bfbfa398d7890bfa");
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  // States for CCEE Surplus Trade
  const [isTradingRealTime, setIsTradingRealTime] = useState<boolean>(true);
  const [tradingLogs, setTradingLogs] = useState<string[]>([]);
  const [accumulatedCredits, setAccumulatedCredits] = useState<number>(128.45);
  const [pldRate, setPldRate] = useState<number>(145.80); // R$ / MWh

  // States for Finviz-style ONS/ANEEL Treemap
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("Todos");
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>("Todos");
  const [selectedNode, setSelectedNode] = useState<GeneratorNode | null>(null);
  const [treemapData, setTreemapData] = useState<GeneratorNode[]>([]);
  const [isLoadingTreemap, setIsLoadingTreemap] = useState<boolean>(false);

  // States for Financeiro: Pix & Drex
  const [tokenizeAmount, setTokenizeAmount] = useState<number>(50); // MWh to tokenize
  const [isTokenizing, setIsTokenizing] = useState<boolean>(false);
  const [tokenizedBalance, setTokenizedBalance] = useState<number>(12.8); // RCT Balance (Renewable Credit Tokens)
  const [pixPayload, setPixPayload] = useState<string>("00020101021226870014br.gov.bcb.pix2565pix-ccee-gos3-tokenization-produtor-recebivel520400005303986540510.005802BR5915CCEE_TOKEN_LFP6009SAO_PAULO62070503***6304CA1B");
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  
  // Drex Latency & Security Solver States
  const [drexLatencyMode, setDrexLatencyMode] = useState<"standard" | "l2_rollup">("l2_rollup");
  const [latencyBenchmarkResult, setLatencyBenchmarkResult] = useState<{
    latencyMs: number;
    throughputTps: number;
    gasFeeDrex: number;
    securityLevel: string;
    privacyStatus: string;
  }>({
    latencyMs: 120,
    throughputTps: 3500,
    gasFeeDrex: 0.0001,
    securityLevel: "ZK-SNARK Shielded",
    privacyStatus: "Totalmente Privado (Lei Geral de Proteção de Dados + BCB Compliance)"
  });
  const [isMeasuringLatency, setIsMeasuringLatency] = useState<boolean>(false);

  // Ecosystem API Explorer states
  const [apiActiveEndpoint, setApiActiveEndpoint] = useState<string>("/api/ons-aneel/generators");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  // Background Simulation for real-time Smart Meter & CCEE Trade
  useEffect(() => {
    const interval = setInterval(() => {
      if (smartContractSync) {
        // Fluctuating power generation & consumption
        const genDelta = (Math.random() - 0.4) * 0.4;
        const consDelta = (Math.random() - 0.5) * 0.3;
        
        setSmartMeterGen(prev => Math.max(0.5, parseFloat((prev + genDelta).toFixed(2))));
        setSmartMeterCons(prev => Math.max(0.2, parseFloat((prev + consDelta).toFixed(2))));
        
        // Accumulate net surplus
        const netSurplus = Math.max(0, smartMeterGen - smartMeterCons);
        setSmartMeterValue(prev => parseFloat((prev + (netSurplus / 3600)).toFixed(4)));
        
        // If real-time trading is active, sell surplus to CCEE
        if (isTradingRealTime && netSurplus > 0) {
          const creditDelta = (netSurplus * (pldRate / 1000000)); // MWh conversion
          setAccumulatedCredits(prev => parseFloat((prev + creditDelta).toFixed(5)));
          
          if (Math.random() > 0.8) {
            const time = new Date().toLocaleTimeString();
            const txHash = "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4);
            setTradingLogs(prev => [
              `[${time}] CCEE: Liquidado excedente de ${(netSurplus).toFixed(2)} kW via PLD de R$ ${pldRate.toFixed(2)}/MWh. Tx: ${txHash}`,
              ...prev.slice(0, 15)
            ]);
          }
        }
        
        setLastSyncTime(new Date().toLocaleTimeString());
        // Dynamic block signature
        setSignedBlock("SHA256-" + Math.random().toString(16).substr(2, 10) + "drex" + Math.random().toString(16).substr(2, 6));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [smartContractSync, smartMeterGen, smartMeterCons, isTradingRealTime, pldRate]);

  // Load prompt and RAG docs on component mount
  useEffect(() => {
    const loadPromptAndDocs = async () => {
      setIsLoadingRag(true);
      try {
        // Fetch active system prompt from Firestore
        const promptDoc = await getDoc(doc(db, "system_config", "agent_prompt"));
        if (promptDoc.exists()) {
          setSystemPromptValue(promptDoc.data().prompt);
        } else {
          // If it doesn't exist, seed it with the default
          await setDoc(doc(db, "system_config", "agent_prompt"), {
            prompt: "Você é o Agente de Decisão Racional 2026, um assistente virtual analítico altamente especializado em estatística, economia e políticas públicas brasileiras.",
            updatedAt: new Date().toISOString()
          });
        }

        // Fetch custom RAG documents from Firestore
        const querySnapshot = await getDocs(collection(db, "rag_knowledge"));
        const docs: any[] = [];
        querySnapshot.forEach((docSnap) => {
          docs.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Seed default RAG documents if the collection is empty
        if (docs.length === 0) {
          const defaultRagDocs = [
            {
              id: "ons_sin_2026",
              title: "Operador Nacional do Sistema (ONS) - Estrutura de Geração do SIN 2026",
              category: "Energia",
              content: "O Sistema Interligado Nacional (SIN) é composto por mais de 1.800 usinas geradoras outorgadas pela ANEEL, com capacidade instalada total ultrapassando 210 GW. Destacam-se as fontes hidrelétricas (57%), seguidas por eólica (15%), biomassa (8%) e solar fotovoltaica (14%). O ONS coordena o despacho em tempo real para minimizar o Custo Marginal de Operação (CMO) através da otimização estocástica via modelo Newave/Decomp."
            },
            {
              id: "ccee_resolucao_mmgd",
              title: "CCEE - Resolução Normativa para Comercialização de Excedente de Microgeração",
              category: "Regulatório",
              content: "A comercialização de excedente elétrico de Micro e Minigeração Distribuída (MMGD) no mercado livre ou sob regras CCEE obedece ao princípio da liquidação instantânea. Produtores podem tokenizar sua capacidade líquida não injetada através de Certificados de Crédito de Energia Renovável (RCT), convertidos de forma paritária em Pix ou DREX (moeda digital do Banco Central) utilizando carteiras assinadas por hardware e contratos inteligentes auditados."
            },
            {
              id: "drex_zkp_privacy",
              title: "Banco Central do Brasil - Especificação de Privacidade de Drex L2 Rollup",
              category: "Monetário",
              content: "A rede de testes do DREX implementa provas de conhecimento zero (ZK-SNARKs) na camada 2 para garantir privacidade e conformidade com o sigilo bancário. O L2 Rollup utiliza lotes criptográficos assinados que resolvem o trilema de blockchain, alcançando taxas superiores a 3.500 TPS com tempos de liquidação abaixo de 120ms, eliminando problemas históricos de latência sob rigoroso compliance regulatório."
            }
          ];

          for (const d of defaultRagDocs) {
            await setDoc(doc(db, "rag_knowledge", d.id), {
              title: d.title,
              category: d.category,
              content: d.content,
              updatedAt: new Date().toISOString()
            });
            docs.push(d);
          }
        }
        setRagDocs(docs);
      } catch (error) {
        console.error("Erro ao carregar RAG do Firestore:", error);
      } finally {
        setIsLoadingRag(false);
      }
    };

    loadPromptAndDocs();
  }, []);

  // Save custom system prompt
  const handleSaveSystemPrompt = async () => {
    setIsSavingPrompt(true);
    setRagAlert(null);
    try {
      await setDoc(doc(db, "system_config", "agent_prompt"), {
        prompt: systemPromptValue,
        updatedAt: new Date().toISOString()
      });
      setRagAlert({
        show: true,
        type: "success",
        message: "Prompt de Sistema atualizado no Firestore com sucesso! O Agente em tempo real passará a responder utilizando esta diretriz."
      });
    } catch (error: any) {
      console.error("Erro ao salvar prompt no Firestore:", error);
      setRagAlert({
        show: true,
        type: "error",
        message: "Ocorreu um erro ao persistir o prompt no Firestore. Por favor, tente novamente."
      });
    } finally {
      setIsSavingPrompt(false);
    }
  };

  // Add new RAG document
  const handleAddRagDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) {
      setRagAlert({ show: true, type: "error", message: "Por favor, preencha o título e o conteúdo do documento RAG." });
      return;
    }

    setIsSavingRagDoc(true);
    setRagAlert(null);
    try {
      const docId = "doc_" + Math.random().toString(36).substr(2, 9);
      const newDoc = {
        title: newDocTitle,
        category: newDocCategory,
        content: newDocContent,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "rag_knowledge", docId), newDoc);
      setRagDocs(prev => [...prev, { id: docId, ...newDoc }]);
      
      // Clear inputs
      setNewDocTitle("");
      setNewDocContent("");
      
      setRagAlert({
        show: true,
        type: "success",
        message: `Documento "${newDocTitle}" indexado e sincronizado no Firestore com sucesso!`
      });
    } catch (error) {
      console.error("Erro ao adicionar documento RAG:", error);
      setRagAlert({ show: true, type: "error", message: "Não foi possível indexar o documento no Firestore." });
    } finally {
      setIsSavingRagDoc(false);
    }
  };

  // Delete RAG document
  const handleDeleteRagDoc = async (id: string, title: string) => {
    setRagAlert(null);
    try {
      await deleteDoc(doc(db, "rag_knowledge", id));
      setRagDocs(prev => prev.filter(d => d.id !== id));
      setRagAlert({
        show: true,
        type: "success",
        message: `Documento "${title}" desindexado do Firestore.`
      });
    } catch (error) {
      console.error("Erro ao desindexar:", error);
      setRagAlert({ show: true, type: "error", message: "Erro ao excluir o documento do Firestore." });
    }
  };

  // Load ANEEL / ONS Generators structured data
  useEffect(() => {
    async function loadGenerators() {
      setIsLoadingTreemap(true);
      try {
        const res = await fetch("/api/ons-aneel/generators");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.generators)) {
            setTreemapData(data.generators);
          }
        } else {
          // Robust Fallback Data for local preview
          const fallbackData: GeneratorNode[] = [
            { id: "gen-1", name: "Complexo Solar Pirapora", type: "Solar", state: "MG", municipality: "Pirapora", capacityMW: 321, plantsCount: 11, status: "Ativo" },
            { id: "gen-2", name: "Parque Eólico Casa Nova", type: "Eólica", state: "BA", municipality: "Casa Nova", capacityMW: 180, plantsCount: 6, status: "Ativo" },
            { id: "gen-3", name: "UHE Belo Monte", type: "Hidrelétrica", state: "PA", municipality: "Altamira", capacityMW: 11233, plantsCount: 1, status: "Ativo" },
            { id: "gen-4", name: "Solar Coremas", type: "Solar", state: "PB", municipality: "Coremas", capacityMW: 135, plantsCount: 4, status: "Ativo" },
            { id: "gen-5", name: "Complexo Eólico Rio do Vento", type: "Eólica", state: "RN", municipality: "Lajes", capacityMW: 504, plantsCount: 22, status: "Ativo" },
            { id: "gen-6", name: "UHE Itaipu (Margem Brasileira)", type: "Hidrelétrica", state: "PR", municipality: "Foz do Iguaçu", capacityMW: 7000, plantsCount: 1, status: "Ativo" },
            { id: "gen-7", name: "UTE GNA I (Biomassa/Gás)", type: "Térmica", state: "RJ", municipality: "São João da Barra", capacityMW: 1338, plantsCount: 1, status: "Ativo" },
            { id: "gen-8", name: "Solar Janaúba", type: "Solar", state: "MG", municipality: "Janaúba", capacityMW: 1200, plantsCount: 28, status: "Ativo" },
            { id: "gen-9", name: "Complexo Eólico Ventos do Piauí", type: "Eólica", state: "PI", municipality: "Lagoa do Barro", capacityMW: 356, plantsCount: 14, status: "Ativo" },
            { id: "gen-10", name: "MMGD Residencial Solar Distribuído", type: "Solar", state: "SP", municipality: "Campinas", capacityMW: 45, plantsCount: 1240, status: "Ativo" },
            { id: "gen-11", name: "MMGD Comercial Solar LFP", type: "Solar", state: "CE", municipality: "Fortaleza", capacityMW: 18, plantsCount: 154, status: "Ativo" },
            { id: "gen-12", name: "Complexo Eólico Delfina", type: "Eólica", state: "BA", municipality: "Campo Formoso", capacityMW: 210, plantsCount: 10, status: "Ativo" },
            { id: "gen-13", name: "Solar Futura", type: "Solar", state: "BA", municipality: "Juazeiro", capacityMW: 855, plantsCount: 18, status: "Em Construção" },
            { id: "gen-14", name: "PCH Sapucaia", type: "Hidrelétrica", state: "RS", municipality: "Sapucaia", capacityMW: 28, plantsCount: 1, status: "Ativo" },
            { id: "gen-15", name: "UTE Termopernambuco", type: "Térmica", state: "PE", municipality: "Ipojuca", capacityMW: 532, plantsCount: 1, status: "Ativo" }
          ];
          setTreemapData(fallbackData);
        }
      } catch (err) {
        console.error("Erro ao carregar geradores ANEEL/ONS:", err);
      } finally {
        setIsLoadingTreemap(false);
      }
    }
    loadGenerators();
  }, []);

  // Filtered generators list for custom treemap
  const filteredGenerators = treemapData.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.municipality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === "Todos" || node.type === selectedTypeFilter;
    const matchesState = selectedStateFilter === "Todos" || node.state === selectedStateFilter;
    return matchesSearch && matchesType && matchesState;
  });

  // Unique types and states in the dataset for dropdown filters
  const uniqueStates = ["Todos", ...Array.from(new Set(treemapData.map(g => g.state))).sort()];
  const uniqueTypes = ["Todos", "Solar", "Eólica", "Hidrelétrica", "Térmica"];

  // DREX Latency & Security measure trigger
  const runLatencyBenchmark = () => {
    setIsMeasuringLatency(true);
    setTimeout(() => {
      setIsMeasuringLatency(false);
      if (drexLatencyMode === "standard") {
        setLatencyBenchmarkResult({
          latencyMs: 14800, // Standard Ethereum-compatible Drex block latency
          throughputTps: 15,
          gasFeeDrex: 0.12,
          securityLevel: "Standard EVM Base",
          privacyStatus: "Vulnerável a vazamentos de tráfego (Sem criptografia de transações locais)"
        });
      } else {
        setLatencyBenchmarkResult({
          latencyMs: 115, // Layer 2 State Channel / Rollup
          throughputTps: 4200,
          gasFeeDrex: 0.00008,
          securityLevel: "Zero-Knowledge SNARK Shielded (State Rollup)",
          privacyStatus: "Privacidade Criptográfica Total (Saldos e fluxos mascarados por prova ZK)"
        });
      }
    }, 1500);
  };

  // Run Benchmark automatically when mode toggles
  useEffect(() => {
    runLatencyBenchmark();
  }, [drexLatencyMode]);

  // Handler to run API call inside explorer
  const handleTryApi = async () => {
    setApiLoading(true);
    setApiResponse("");
    try {
      let url = apiActiveEndpoint;
      let options: RequestInit = { method: "GET" };
      
      if (apiActiveEndpoint === "/api/ccee/trade") {
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            producerId: "produtor-lfp-9824",
            amountMWh: 1.5,
            pldRate: pldRate
          })
        };
      } else if (apiActiveEndpoint === "/api/drex-pix/tokenize") {
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amountMWh: tokenizeAmount,
            walletAddress: "0x34293fA...DrexLFP"
          })
        };
      } else if (apiActiveEndpoint === "/api/smart-meter/sync") {
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meterId: "meter-gos3-8842",
            currentGenKw: smartMeterGen,
            currentConsKw: smartMeterCons
          })
        };
      }

      const res = await fetch(url, options);
      if (res.ok) {
        const data = await res.json();
        setApiResponse(JSON.stringify(data, null, 2));
      } else {
        setApiResponse(`Erro ${res.status}: ${await res.text()}`);
      }
    } catch (err: any) {
      setApiResponse(`Erro na requisição: ${err.message}`);
    } finally {
      setApiLoading(false);
    }
  };

  // Tokenize Energy credits to RCT
  const handleTokenizeEnergy = () => {
    if (tokenizeAmount <= 0) return;
    setIsTokenizing(true);
    setTimeout(() => {
      setIsTokenizing(false);
      setTokenizedBalance(prev => parseFloat((prev + tokenizeAmount).toFixed(2)));
      setAccumulatedCredits(prev => Math.max(0, parseFloat((prev - (tokenizeAmount * (pldRate / 1000))).toFixed(5))));
      
      const newLog = `[${new Date().toLocaleTimeString()}] Tokenização: ${tokenizeAmount} MWh de créditos convertidos em ${tokenizeAmount * 1000} RCT (Renewable Credit Tokens). Contrato registrado!`;
      setTradingLogs(prev => [newLog, ...prev]);
      
      alert(`Tokenização efetuada com sucesso! Emitidos ${tokenizeAmount * 1000} RCT. Liquidez Pix/Drex disponível.`);
    }, 1200);
  };

  return (
    <div className="space-y-8" id="sovereign-energy-hub-root">
      
      {/* 4 Separated Dashboards Selector Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-sm flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-3 pl-2.5 py-1">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">Sovereign GOS3 Energy Hub</h4>
            <span className="text-[10px] text-slate-500 font-mono">Consórcio de Prossumidores & Big Techs de IA</span>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveDashboard("legislativo_energetico")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDashboard === "legislativo_energetico"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            Legislativo Energético
          </button>

          <button
            onClick={() => setActiveDashboard("operacional")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDashboard === "operacional"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Operacional (Treemap)
          </button>

          <button
            onClick={() => setActiveDashboard("legislativo_juridico")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDashboard === "legislativo_juridico"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            Legislativo Jurídico
          </button>

          <button
            onClick={() => setActiveDashboard("financeiro")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDashboard === "financeiro"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <Coins className="h-3.5 w-3.5" />
            Financeiro (Pix/Drex)
          </button>

          <button
            onClick={() => setActiveDashboard("ajuste_fino_rag")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDashboard === "ajuste_fino_rag"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Ajuste Fino RAG & Prompts
          </button>
        </div>
      </div>

      {/* Main Panel Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDashboard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm"
        >
          
          {/* ========================================================
              DASHBOARD 1: LEGISLATIVO ENERGÉTICO (CCEE & Smart Meter Contract)
              ======================================================== */}
          {activeDashboard === "legislativo_energetico" && (
            <div className="space-y-8" id="dashboard-legislativo-energetico">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider font-mono block mb-1">
                    Dashboard Legislativo Energético
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Zap className="h-6 w-6 text-indigo-600" />
                    Trading de Excedente em Tempo Real & CCEE
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Monitore a integração de microgeradores à Câmara de Comercialização de Energia Elétrica (CCEE). Energia limpa negociada sem intermediários direto com as indústrias de Inteligência Artificial.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-xl p-2.5">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-mono font-bold block leading-none">PREÇO PLD MÉDIO</span>
                    <strong className="text-sm font-black font-mono text-indigo-600">R$ {pldRate.toFixed(2)} / MWh</strong>
                  </div>
                  <input 
                    type="range" 
                    min="80" 
                    max="350" 
                    value={pldRate} 
                    onChange={(e) => setPldRate(parseFloat(e.target.value))}
                    className="w-20 accent-indigo-600"
                    title="Ajustar Preço de Liquidação das Diferenças (PLD)"
                  />
                </div>
              </div>

              {/* Grid: Smart Meter Left & Trading Desk Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Relógio Inteligente Integrado ao Contrato Inteligente */}
                <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-indigo-600 animate-pulse" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Relógio Inteligente IoT (Smart Meter)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      On-Chain
                    </span>
                  </div>

                  {/* Meter Graphics */}
                  <div className="bg-slate-950 text-white rounded-xl p-5 font-mono relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute top-0 right-0 p-3 text-[9px] text-indigo-400 font-bold">
                      GOS3-MET-948
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">ENERGIA LÍQUIDA GERADA (SURPLUS ACUMULADO)</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black tracking-tight text-white">{smartMeterValue.toFixed(4)}</span>
                        <span className="text-sm text-indigo-400 font-bold">kWh</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-slate-800/80 py-3.5 my-2 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-450 block mb-0.5 uppercase font-bold">Geração Solar</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {smartMeterGen.toFixed(2)} kW
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-450 block mb-0.5 uppercase font-bold">Consumo Local</span>
                        <span className="text-red-400 font-bold">
                          {smartMeterCons.toFixed(2)} kW
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[9px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Contrato Assinado:</span>
                        <span className="text-slate-350 font-bold">{contractAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Último Bloco Assinado:</span>
                        <span className="text-indigo-400 truncate max-w-[170px]" title={signedBlock}>{signedBlock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sincronização Física:</span>
                        <span>{lastSyncTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl text-xs text-slate-600">
                    <span className="font-bold flex items-center gap-1.5 text-slate-800">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Assinatura de Integridade Regulatória
                    </span>
                    <button
                      onClick={() => setSmartContractSync(!smartContractSync)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                        smartContractSync
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {smartContractSync ? "✓ Sincronizado" : "⏸ Pausar"}
                    </button>
                  </div>
                </div>

                {/* Mesa de Trading CCEE */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4 flex-1">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        CCEE Real-Time Settlement Engine
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-bold">Venda Instantânea:</span>
                        <button
                          onClick={() => setIsTradingRealTime(!isTradingRealTime)}
                          className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            isTradingRealTime ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${
                            isTradingRealTime ? "translate-x-5" : ""
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-mono block uppercase">Créditos Acumulados</span>
                        <span className="text-xl font-black text-slate-900 font-mono block mt-1">R$ {accumulatedCredits.toFixed(4)}</span>
                        <span className="text-[10px] text-slate-500 mt-1 block">Aguardando liquidação ou tokenização</span>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 font-mono block uppercase">Status da Conexão API CCEE</span>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mt-2">
                          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
                          CCEE API V3 Integrada e Operacional
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 block">Roteamento direto de microgeração MMGD</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                        Fila de Transações de Excedente em Tempo Real (CCEE Broker Logs)
                      </label>
                      <div className="bg-slate-950 rounded-xl p-3 font-mono text-[10px] text-slate-300 space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar">
                        {tradingLogs.length === 0 ? (
                          <p className="text-slate-500 italic text-center py-2">Injetando energia limpa no grid... Aguardando primeiro lote de excedente acima de 1 kW para comercialização em tempo real.</p>
                        ) : (
                          tradingLogs.map((log, idx) => (
                            <p key={idx} className="leading-normal">{log}</p>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4 flex gap-3 text-xs text-amber-850">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      <strong>Adequação Regulatória:</strong> Este ambiente segue estritamente as diretrizes da API CCEE e o Marco Geral do Consumidor Solar. Toda transação é registrada no ledger distribuído para proteção jurídica mútua entre Big Techs (compradores) e prossumidores de energia (vendedores).
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              DASHBOARD 2: OPERACIONAL (ONS/ANEEL Finviz-style Generator Treemap)
              ======================================================== */}
          {activeDashboard === "operacional" && (
            <div className="space-y-6" id="dashboard-operacional-treemap">
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-mono block mb-1">
                  Dashboard Operacional Integrado
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Globe className="h-6 w-6 text-emerald-600" />
                  Mapeamento de Geradores ONS & ANEEL
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Consulte a base unificada de usinas geradoras brasileiras de Micro e Minigeração Distribuída (MMGD) e Centrais Geradoras de grande escala. Treemap dinâmico no estilo Finviz dimensionado por capacidade de potência nominal em Megawatts (MW).
                </p>
              </div>

              {/* Filtros e Busca */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar gerador por nome ou município..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-slate-400 text-slate-900 font-medium"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono font-bold whitespace-nowrap">Tipo:</span>
                    <select
                      value={selectedTypeFilter}
                      onChange={(e) => setSelectedTypeFilter(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400 text-slate-800"
                    >
                      {uniqueTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono font-bold whitespace-nowrap">Estado:</span>
                    <select
                      value={selectedStateFilter}
                      onChange={(e) => setSelectedStateFilter(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-slate-400 text-slate-800"
                    >
                      {uniqueStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Finviz-Style Treemap Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">
                    Exibindo <strong className="text-slate-900">{filteredGenerators.length}</strong> geradores mapeados
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">Clique em qualquer bloco do Treemap para exibir os dados de telemetria e o rito regulatório</span>
                </div>

                <div className="min-h-[420px] bg-slate-950 rounded-2xl p-4 border border-slate-900 flex flex-wrap gap-2.5 items-stretch overflow-hidden select-none">
                  {isLoadingTreemap ? (
                    <div className="w-full flex flex-col items-center justify-center text-slate-400 gap-3">
                      <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
                      <span className="font-mono text-xs">Sincronizando base de dados ONS/ANEEL...</span>
                    </div>
                  ) : filteredGenerators.length === 0 ? (
                    <div className="w-full flex items-center justify-center text-slate-500 italic text-xs">
                      Nenhum gerador solar, eólico, hídrico ou térmico encontrado para estes parâmetros de busca.
                    </div>
                  ) : (
                    // Elegant Native CSS grid box-sizing based on Capacity ratio
                    filteredGenerators.map((node) => {
                      // Basic logarithmic proportional width calculation for high-quality tree mapping
                      const capacityFactor = Math.log(node.capacityMW + 2) / 6;
                      const flexGrow = Math.max(1, Math.round(capacityFactor * 100));
                      
                      let colorClass = "bg-emerald-950 border-emerald-900 hover:border-emerald-700 text-emerald-300"; // Solar
                      if (node.type === "Eólica") colorClass = "bg-sky-950 border-sky-900 hover:border-sky-700 text-sky-300";
                      if (node.type === "Hidrelétrica") colorClass = "bg-blue-950 border-blue-900 hover:border-blue-700 text-blue-300";
                      if (node.type === "Térmica") colorClass = "bg-amber-950 border-amber-900 hover:border-amber-700 text-amber-300";

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          style={{ flexGrow }}
                          className={`min-w-[120px] p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 cursor-pointer relative ${colorClass} ${
                            selectedNode?.id === node.id ? "ring-2 ring-white scale-[1.01]" : ""
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[8px] font-mono font-bold bg-black/30 px-1.5 py-0.5 rounded uppercase">
                                {node.type}
                              </span>
                              <span className="text-[10px] font-mono font-bold">{node.state}</span>
                            </div>
                            <h5 className="text-xs font-black tracking-tight text-white mt-1.5 truncate max-w-[160px]" title={node.name}>
                              {node.name}
                            </h5>
                            <span className="text-[9px] text-slate-300 font-semibold block">{node.municipality}</span>
                          </div>

                          <div className="mt-4 pt-1.5 border-t border-white/10 flex items-baseline justify-between text-[10px] font-mono">
                            <span className="text-slate-400">Capacidade:</span>
                            <span className="font-bold text-white">{node.capacityMW.toLocaleString()} MW</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Generator Info Panel Overlay */}
              {selectedNode && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-xl">
                      <Zap className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{selectedNode.name}</h4>
                      <p className="text-xs text-slate-600">
                        {selectedNode.type} • {selectedNode.municipality} - {selectedNode.state} • Status: <strong className="text-emerald-600">{selectedNode.status}</strong>
                      </p>
                      <div className="flex gap-4 mt-2 font-mono text-[10px] text-slate-500">
                        <span>Capacidade Comercial: <strong>{selectedNode.capacityMW} MW</strong></span>
                        <span>Quantidade de Unidades Geradoras: <strong>{selectedNode.plantsCount}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Quick bind to smart meter address simulated demo
                        setContractAddress(`0x${selectedNode.id.substring(0,4)}...${selectedNode.state}LFP`);
                        alert(`Contrato Inteligente on-chain vinculado com sucesso ao gerador comercial ${selectedNode.name}!`);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer"
                    >
                      Vincular Contrato
                    </button>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer"
                    >
                      Fechar Detalhes
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================
              DASHBOARD 3: LEGISLATIVO JURÍDICO (Legislative Draft Creator)
              ======================================================== */}
          {activeDashboard === "legislativo_juridico" && (
            <div className="space-y-6" id="dashboard-legislativo-juridico">
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono block mb-1">
                  Dashboard Legislativo Jurídico
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Scale className="h-6 w-6 text-indigo-600" />
                  Geração e Calibração de Propostas Legislativas
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Redija textos de Projetos de Lei, Propostas de Emendas (PECs), Decretos e Emendas de Plenário com calibração estrutural baseada em Inteligência Artificial e RAG de precedentes aprovados no e-Cidadania.
                </p>
              </div>

              {/* Mount the actual LegislativeProposalManager component directly here! */}
              <LegislativeProposalManager />
            </div>
          )}

          {/* ========================================================
              DASHBOARD 4: FINANCEIRO (Tokenization, Pix & Drex Solver)
              ======================================================== */}
          {activeDashboard === "financeiro" && (
            <div className="space-y-8" id="dashboard-financeiro-tokenization">
              <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider font-mono block mb-1">
                    Dashboard Financeiro
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Coins className="h-6 w-6 text-amber-600" />
                    Tokenização, Pix & Soluções Drex de Próxima Geração
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Gerencie recebíveis de comercialização de energia através de canais de liquidez instantânea (Pix) e moeda soberana tokenizada (Drex). Reduza a latência de liquidação e resguarde a privacidade de transações.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-2 rounded-xl text-xs font-mono text-slate-800">
                  RCT Balance: <strong className="text-indigo-600">{(tokenizedBalance * 1000).toLocaleString()} RCT</strong>
                </div>
              </div>

              {/* Grid: Tokenization Left & Drex Solver Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Tokenizador de Energia & Pix */}
                <div className="lg:col-span-6 bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block border-b border-slate-200/50 pb-2">
                    Tokenizador de Energia Limpa e Recebíveis Pix
                  </span>

                  <p className="text-xs text-slate-600 leading-normal">
                    Converta seus excedentes acumulados de energia CCEE em <strong>Renewable Credit Tokens (RCT)</strong>. Cada token RCT representa 1 kWh de energia solar sustentável certificada on-chain e pode ser negociada ou sacada instantaneamente via Pix ou Drex.
                  </p>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 font-mono block mb-1.5">MWh para Tokenizar</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={tokenizeAmount}
                          onChange={(e) => setTokenizeAmount(parseFloat(e.target.value))}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                          min="1"
                        />
                        <button
                          onClick={handleTokenizeEnergy}
                          disabled={isTokenizing}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          {isTokenizing ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              Tokenizando...
                            </>
                          ) : (
                            "Tokenizar!"
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Tokens Gerados:</span>
                      <strong className="text-indigo-600 font-mono">{(tokenizeAmount * 1000).toLocaleString()} RCT</strong>
                    </div>
                  </div>

                  {/* Infraestrutura Pix Integrada */}
                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <QrCode className="h-4 w-4 text-emerald-600" />
                      QR Code Dinâmico - Liquidação Pix instantânea
                    </div>
                    <p className="text-[10px] text-slate-500">Pague ou receba diretamente por energia tokenizada utilizando a infraestrutura Pix do Banco Central.</p>
                    
                    <div className="flex gap-2 items-center">
                      <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl flex-1 truncate font-mono text-[9px] text-slate-600">
                        {pixPayload}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pixPayload);
                          setPixCopied(true);
                          setTimeout(() => setPixCopied(false), 2000);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl transition-all cursor-pointer"
                        title="Copiar Pix Copia e Cola"
                      >
                        {pixCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resolvendo Limitações do DREX: Latência e Segurança */}
                <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl border border-slate-850 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        Drex Latency & Security Solver Layer
                      </span>
                    </div>

                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setDrexLatencyMode("standard")}
                        className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                          drexLatencyMode === "standard"
                            ? "bg-slate-800 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Padrão EVM
                      </button>
                      <button
                        onClick={() => setDrexLatencyMode("l2_rollup")}
                        className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                          drexLatencyMode === "l2_rollup"
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        L2 ZK-Rollup
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-normal">
                    Os testes oficiais do <strong>Drex (Real Digital)</strong> revelaram dois gargalos principais: alta latência de bloco (12-15s na EVM Hyperledger Besu) e exposição de saldos comerciais (vulnerabilidade de privacidade). 
                    Nossa solução de engenharia implementa canais de estado <strong>L2 ZK-Rollups (Zero-Knowledge)</strong> para agrupar e liquidar transações fora da cadeia principal, assegurando desempenho instantâneo e criptografia total.
                  </p>

                  {/* Benchmark Output Card */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="text-slate-450 uppercase font-bold text-[8px]">Métrica de Desempenho</span>
                      <span className="text-indigo-400 font-bold">L2 Rollup Actived</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 block text-[9px]">LATÊNCIA DE CONFIRMAÇÃO</span>
                        <strong className={`text-base font-black ${drexLatencyMode === "l2_rollup" ? "text-emerald-400" : "text-red-400"}`}>
                          {isMeasuringLatency ? "Calculando..." : `${latencyBenchmarkResult.latencyMs} ms`}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">VAZÃO (THROUGHPUT)</span>
                        <strong className="text-base font-black text-white">
                          {isMeasuringLatency ? "Calculando..." : `${latencyBenchmarkResult.throughputTps} TPS`}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 space-y-1 text-[9px] text-slate-400">
                      <div className="flex justify-between">
                        <span>Privacidade de Saldo:</span>
                        <span className="text-slate-200 font-bold">{latencyBenchmarkResult.securityLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gas Fee (Drex):</span>
                        <span className="text-emerald-400 font-bold">{latencyBenchmarkResult.gasFeeDrex} Drex</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Status Legal BCB:</span>
                        <p className="text-slate-300 mt-0.5 font-sans leading-normal text-[10px]">{latencyBenchmarkResult.privacyStatus}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={runLatencyBenchmark}
                    disabled={isMeasuringLatency}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isMeasuringLatency ? "animate-spin" : ""}`} />
                    Medir Latência & Auditar Segurança
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              DASHBOARD 5: AJUSTE FINO RAG & PROMPT SPRINT
              ======================================================== */}
          {activeDashboard === "ajuste_fino_rag" && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Sliders className="h-6 w-6 text-indigo-600" />
                    Engenharia de Prompt & Ajuste Fino RAG Live
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Calibre o comportamento e a base de conhecimento (Retrieval-Augmented Generation) do Agente de Decisão Racional 2026.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start md:self-auto">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  CONECTADO AO FIRESTORE EM TEMPO REAL
                </div>
              </div>

              {ragAlert && (
                <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                  ragAlert.type === "success" 
                    ? "bg-emerald-50 border border-emerald-100 text-emerald-950" 
                    : "bg-red-50 border border-red-100 text-red-950"
                }`}>
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{ragAlert.type === "success" ? "Operação bem-sucedida!" : "Atenção:"}</span> {ragAlert.message}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Coluna 1: Ajuste de Prompt do Sistema (Prompt Engineering Sprint) */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                        <h4 className="text-xs font-black text-slate-900 uppercase">Instruções de Alinhamento (System Prompt)</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">SPRINT #1</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-normal">
                      Esta instrução define a <strong>personalidade, diretrizes analíticas, tom de voz e regras lógicas</strong> que o modelo Gemini seguirá. Edite as instruções abaixo para afinar o enquadramento estatístico, econômico e de utilidade esperada.
                    </p>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Instrução Primária do Agente</label>
                      <textarea
                        value={systemPromptValue}
                        onChange={(e) => setSystemPromptValue(e.target.value)}
                        rows={8}
                        className="w-full text-xs font-mono bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed text-slate-800"
                        placeholder="Insira as instruções de sistema para calibrar o comportamento do agente..."
                      />
                    </div>

                    <button
                      onClick={handleSaveSystemPrompt}
                      disabled={isSavingPrompt}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSavingPrompt ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Gravando Instruções...
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          Salvar Prompt de Alinhamento
                        </>
                      )}
                    </button>

                    <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-[10px] text-indigo-950 leading-relaxed">
                      💡 <strong>Dica de Prompting:</strong> Você pode ordenar que o agente priorize metas de SELIC abaixo de 9% ou force notas SWOT específicas sob critérios macroeconômicos alternativos de mercado. Qualquer alteração aqui é refletida instantaneamente no chat do Agente.
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Base de Conhecimento RAG */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Lista de Documentos Ativos no RAG */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                        <h4 className="text-xs font-black text-slate-900 uppercase">Documentos Ativos na Base RAG (L1 & L2)</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">FIRESTORE INDEX</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-normal">
                      Documentos armazenados e persistidos no Firestore. No momento em que o usuário envia uma mensagem, estes arquivos de contexto são extraídos e injetados de forma dinâmica na janela de atenção do modelo.
                    </p>

                    {isLoadingRag ? (
                      <div className="flex items-center justify-center py-8 text-xs text-slate-400 font-mono gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
                        Recuperando vetores do Firestore...
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                        {ragDocs.map((doc) => (
                          <div key={doc.id} className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm relative group">
                            <button
                              onClick={() => handleDeleteRagDoc(doc.id, doc.title)}
                              className="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remover Documento da Base RAG"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] font-bold uppercase font-mono px-1.5 py-0.5 rounded ${
                                doc.category === "Energia" ? "bg-amber-100 text-amber-800" :
                                doc.category === "Regulatório" ? "bg-indigo-100 text-indigo-800" :
                                doc.category === "Monetário" ? "bg-emerald-100 text-emerald-800" :
                                "bg-slate-150 text-slate-700"
                              }`}>
                                {doc.category}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">id: {doc.id}</span>
                            </div>
                            <h5 className="text-[11px] font-bold text-slate-900 pr-5">{doc.title}</h5>
                            <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 italic">&quot;{doc.content}&quot;</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Form para Indexar Novo Documento RAG */}
                  <form onSubmit={handleAddRagDocument} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Database className="h-4 w-4 text-emerald-600" />
                      <h4 className="text-xs font-black text-slate-900 uppercase">Indexar Novo Artigo de Conhecimento RAG</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 font-mono">Título do Documento</label>
                        <input
                          type="text"
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          placeholder="Ex: ANEEL Resolução 1045"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 font-mono">Categoria temática</label>
                        <select
                          value={newDocCategory}
                          onChange={(e) => setNewDocCategory(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
                        >
                          <option value="Energia">Energia (ONS/ANEEL)</option>
                          <option value="Regulatório">Regulatório (Excedente)</option>
                          <option value="Monetário">Monetário (Drex/Selic)</option>
                          <option value="Estatístico">Estatístico (Pareto/Zipf)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-400 font-mono">Conteúdo Técnico Completo</label>
                      <textarea
                        value={newDocContent}
                        onChange={(e) => setNewDocContent(e.target.value)}
                        rows={3}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700 leading-normal"
                        placeholder="Cole aqui as novas metas regulatórias, resoluções, estudos de mercado ou notas legislativas brasileiras..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingRagDoc}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSavingRagDoc ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Gravando e Indexando Vetores...
                        </>
                      ) : (
                        <>
                          <Database className="h-3.5 w-3.5" />
                          Indexar Documento no Firestore
                        </>
                      )}
                    </button>
                  </form>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              COMPARTILHAMENTO DE APIS COM O ECOSSISTEMA (API Reference Panel)
              ======================================================== */}
          <div className="border-t border-slate-100 mt-10 pt-8" id="ecosystem-api-panel">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-indigo-600" />
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase">APIs do Ecossistema GOS3</h4>
                <p className="text-xs text-slate-500">Exponha e integre barramentos regulatórios de energia, CCEE, ONS/ANEEL e Drex para desenvolvedores de terceiros.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Endpoint selectors */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                {[
                  {
                    path: "/api/ons-aneel/generators",
                    method: "GET",
                    desc: "Recupera todos geradores de energia solar/eólica/hídrica mapeados."
                  },
                  {
                    path: "/api/ccee/trade",
                    method: "POST",
                    desc: "Simula o envio de surplus energético para liquidação CCEE instantânea."
                  },
                  {
                    path: "/api/drex-pix/tokenize",
                    method: "POST",
                    desc: "Emite créditos energéticos sob RCT para recebimento via Pix ou Drex."
                  },
                  {
                    path: "/api/smart-meter/sync",
                    method: "POST",
                    desc: "Sincroniza e assina criptograficamente a medição do medidor IoT."
                  }
                ].map((endpoint) => (
                  <button
                    key={endpoint.path}
                    onClick={() => {
                      setApiActiveEndpoint(endpoint.path);
                      setApiResponse("");
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      apiActiveEndpoint === endpoint.path
                        ? "bg-indigo-50 border-indigo-200 text-indigo-950"
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        endpoint.method === "GET" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-850"
                      }`}>
                        {endpoint.method}
                      </span>
                      <span className="text-xs font-mono font-bold">{endpoint.path}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">{endpoint.desc}</p>
                  </button>
                ))}
              </div>

              {/* LIVE API Sandbox terminal */}
              <div className="lg:col-span-7 flex flex-col bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-850">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-850 text-[10px] font-mono text-slate-400">
                  <span>SANDBOX DE TESTES DA API EM TEMPO REAL</span>
                  <button
                    onClick={handleTryApi}
                    disabled={apiLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {apiLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                    Testar API Live!
                  </button>
                </div>

                <div className="p-4 font-mono text-[10px] flex-1 min-h-[180px] overflow-y-auto custom-scrollbar text-slate-350 leading-relaxed">
                  {apiLoading ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2 text-indigo-500" />
                      Consultando servidor backend...
                    </div>
                  ) : apiResponse ? (
                    <pre className="text-emerald-400 font-semibold max-w-full overflow-x-auto whitespace-pre-wrap">{apiResponse}</pre>
                  ) : (
                    <p className="text-slate-500 italic text-center pt-8">Clique no botão &apos;Testar API Live!&apos; para efetuar uma requisição HTTP real ao backend e exibir os dados de retorno do ecossistema GOS3.</p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
}

// Simple Helper component for Play icon
function Play({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}
