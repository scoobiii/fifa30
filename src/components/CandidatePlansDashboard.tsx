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
  Clock,
  Search,
  Filter,
  Cpu,
  Coins,
  Share2,
  Send,
  Copy,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Check,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { doc, setDoc, collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../utils/firestore-error";
import LegislativePortal from "./LegislativePortal";
import LegislativeProposalManager from "./LegislativeProposalManager";


export interface Legislator {
  id: string;
  type: "deputy" | "senator";
  name: string;
  party: string;
  state: string;
  baseLobby: "Distribuidoras" | "Big Techs" | "Agronegócio" | "Social/Clima" | "Fisiológico";
  financialSupport: string;
  vote: "SIM" | "NÃO" | "ABSTENÇÃO";
}

const generateLegislators = (): Legislator[] => {
  const firstNames = ["Arthur", "Beto", "Camila", "Daniel", "Eduardo", "Felipe", "Gleisi", "Helder", "Igor", "Jandira", "Kim", "Luiza", "Marcelo", "Nikolas", "Orlando", "Priscila", "Rodrigo", "Sâmia", "Tabata", "Valdemar", "Zeca", "Aécio", "Bruna", "Ciro", "Davi", "Eliane", "Flávio", "Guilherme", "Hugo", "Isabela", "João", "Katia", "Leonardo", "Marina", "Newton", "Otávio", "Paulo", "Regina", "Simone", "Teresa", "Ulysses", "Valéria", "Walter"];
  const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Barbosa", "Vieira", "Teixeira", "Aruda", "Guimarães", "Cardoso", "Melo"];
  const states = ["SP", "RJ", "MG", "BA", "PR", "RS", "PE", "CE", "SC", "GO", "MA", "PA", "DF", "AM", "ES", "PB", "RN", "AL", "MT", "MS", "SE", "TO", "PI", "AC", "RO", "RR", "AP"];
  const parties = ["CENTRO-PP", "ESQUERDA-PT", "DIREITA-PL", "CENTRO-PSD", "CENTRO-MDB", "DIREITA-NOVO", "DIREITA-REP", "ESQUERDA-PSOL", "CENTRO-UNIÃO", "CENTRO-PSDB"];
  
  const list: Legislator[] = [];
  
  // 513 Deputies
  for (let i = 1; i <= 513; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i * 3) % lastNames.length];
    const lName2 = lastNames[(i * 7) % lastNames.length];
    const name = `Dep. ${fName} ${lName} ${lName2}`;
    const state = states[i % states.length];
    const party = parties[(i * 11) % parties.length];
    
    // Distribute lobbies logically
    let baseLobby: "Distribuidoras" | "Big Techs" | "Agronegócio" | "Social/Clima" | "Fisiológico" = "Fisiológico";
    if (i % 5 === 0) baseLobby = "Distribuidoras";
    else if (i % 5 === 1) baseLobby = "Big Techs";
    else if (i % 5 === 2) baseLobby = "Agronegócio";
    else if (i % 5 === 3) baseLobby = "Social/Clima";
    
    let financialSupport = "";
    if (baseLobby === "Distribuidoras") {
      financialSupport = `R$ ${120 + (i % 8) * 20}k do Lobby das Distribuidoras (Abradee)`;
    } else if (baseLobby === "Big Techs") {
      financialSupport = `R$ ${150 + (i % 10) * 25}k do Consórcio de Big Techs & Data Centers`;
    } else if (baseLobby === "Agronegócio") {
      financialSupport = `R$ ${100 + (i % 6) * 30}k da Bancada Ruralista / FPA`;
    } else if (baseLobby === "Social/Clima") {
      financialSupport = "Base Social (Prossumidores & Clima)";
    } else {
      financialSupport = `R$ ${(i % 5) * 35}k de Doações Individuais / Fisiológico`;
    }
    
    list.push({
      id: `dep-${i}`,
      type: "deputy",
      name,
      party,
      state,
      baseLobby,
      financialSupport,
      vote: "ABSTENÇÃO"
    });
  }
  
  // 81 Senators
  for (let i = 1; i <= 81; i++) {
    const fName = firstNames[(i * 5) % firstNames.length];
    const lName = lastNames[(i * 13) % lastNames.length];
    const name = `Sen. ${fName} ${lName}`;
    const state = states[i % states.length];
    const party = parties[(i * 7) % parties.length];
    
    let baseLobby: "Distribuidoras" | "Big Techs" | "Agronegócio" | "Social/Clima" | "Fisiológico" = "Fisiológico";
    if (i % 4 === 0) baseLobby = "Distribuidoras";
    else if (i % 4 === 1) baseLobby = "Big Techs";
    else if (i % 4 === 2) baseLobby = "Agronegócio";
    else if (i % 4 === 3) baseLobby = "Social/Clima";
    
    let financialSupport = "";
    if (baseLobby === "Distribuidoras") {
      financialSupport = `R$ ${250 + (i % 5) * 50}k do Lobby das Distribuidoras (Abradee)`;
    } else if (baseLobby === "Big Techs") {
      financialSupport = `R$ ${300 + (i % 6) * 60}k do Consórcio de Big Techs & Data Centers`;
    } else if (baseLobby === "Agronegócio") {
      financialSupport = `R$ ${200 + (i % 4) * 80}k da Bancada Ruralista (FPA)`;
    } else if (baseLobby === "Social/Clima") {
      financialSupport = "Base Popular e Clima";
    } else {
      financialSupport = "Fundo Eleitoral Partidário";
    }
    
    list.push({
      id: `sen-${i}`,
      type: "senator",
      name,
      party,
      state,
      baseLobby,
      financialSupport,
      vote: "ABSTENÇÃO"
    });
  }
  
  return list;
};

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
  const [bigTechLobbyActive, setBigTechLobbyActive] = useState<boolean>(false);

  // Estados para Persistência no Firestore
  const [savedSimulations, setSavedSimulations] = useState<any[]>([]);

  const loadSavedSimulations = async () => {
    try {
      const colRef = collection(db, "simulations");
      const q = query(colRef, orderBy("timestamp", "desc"), limit(8));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setSavedSimulations(list);
    } catch (e) {
      console.error("Erro ao carregar simulações do Firestore:", e);
      handleFirestoreError(e, OperationType.LIST, "simulations");
    }
  };

  const saveSimulationState = async (status: "approved" | "rejected", chamberVotes: number, senateVotes: number, finalLegs: Legislator[]) => {
    try {
      const docId = "sim_" + Date.now();
      const docRef = doc(db, "simulations", docId);
      
      const parties = ["CENTRO-PP", "ESQUERDA-PT", "DIREITA-PL", "CENTRO-PSD", "CENTRO-MDB", "DIREITA-NOVO", "DIREITA-REP", "ESQUERDA-PSOL", "CENTRO-UNIÃO", "CENTRO-PSDB"];
      const partyBalances: Record<string, { SIM: number, NAO: number, ABSTENCION: number }> = {};
      parties.forEach(p => {
        partyBalances[p] = { SIM: 0, NAO: 0, ABSTENCION: 0 };
      });
      
      finalLegs.forEach(leg => {
        const party = leg.party;
        const vote = leg.vote;
        if (partyBalances[party]) {
          if (vote === "SIM") partyBalances[party].SIM++;
          else if (vote === "NÃO") partyBalances[party].NAO++;
          else partyBalances[party].ABSTENCION++;
        }
      });

      const payload = {
        id: docId,
        timestamp: new Date().toISOString(),
        candidateId: selectedId,
        candidateName: currentCandidate.name,
        candidateParty: currentCandidate.party,
        status: status,
        chamberVotes: chamberVotes,
        senateVotes: senateVotes,
        bigTechLobbyActive: bigTechLobbyActive,
        dataCenterDemand: dataCenterDemand,
        dataCenterPue: dataCenterPue,
        utilityTariff: utilityTariff,
        dcSavingsAnnually: dcSavingsAnnually,
        lobbyFunding: lobbyFunding,
        solarChamberSupport: solarChamberSupport,
        solarSenateSupport: solarSenateSupport,
        partyBalances: partyBalances
      };
      
      await setDoc(docRef, payload);
      loadSavedSimulations();
    } catch (e) {
      console.error("Erro ao salvar simulação de votação:", e);
      handleFirestoreError(e, OperationType.WRITE, "simulations");
    }
  };

  useEffect(() => {
    loadSavedSimulations();
  }, []);

  const getCandidateHandle = (name: string) => {
    if (name.includes("Lula")) return { handle: "@lulaoficial", avatar: "🔴" };
    if (name.includes("Bolsonaro")) return { handle: "@flaviobolsonaro", avatar: "🟢" };
    if (name.includes("Zema")) return { handle: "@romeuzema_novo", avatar: "🍊" };
    if (name.includes("Caiado")) return { handle: "@ronaldocaiado", avatar: "🔵" };
    if (name.includes("Renan")) return { handle: "@renansantos_mbl", avatar: "🟡" };
    return { handle: "@candidato_2026", avatar: "👤" };
  };


  // Estados para a Central de Pressão Social (Bluesky & Twitter)
  const [socialStakeholder, setSocialStakeholder] = useState<"bigtech" | "prosumer" | "utility" | "legislator" | "general">("general");
  const [socialTone, setSocialTone] = useState<"analytical" | "persuasive" | "corporate">("analytical");
  const [socialPlatform, setSocialPlatform] = useState<"bluesky" | "twitter" | "simulated">("simulated");
  const [socialPosts, setSocialPosts] = useState<string[]>([
    "1/4 👥 Energia barata e tarifa flat são direitos do cidadão! O PL do Excedente Energético propõe extinguir o confuso sistema de bandeiras da ANEEL e reduzir a conta de luz. #EnergiaLimpa #Consumidor",
    "2/4 ☀️ Ao democratizar a geração distribuída, qualquer família pode vender o excedente gerado pelo seu painel solar diretamente na rede, criando uma fonte sustentável de renda complementar.",
    "3/4 🔋 A isenção tributária para baterias de LFP de longa duração barateia o armazenamento em 65%, garantindo redundância contra apagões urbanos.",
    "4/4 🏛️ Não vote no escuro! Siga as votações nominais no Painel do Plenário e veja quais deputados defendem o cidadão e quem protege tarifas abusivas das distribuidoras!"
  ]);
  const [socialIsGenerating, setSocialIsGenerating] = useState<boolean>(false);
  const [socialIsPublishing, setSocialIsPublishing] = useState<boolean>(false);
  const [bskyIdentifier, setBskyIdentifier] = useState<string>("");
  const [bskyPassword, setBskyPassword] = useState<string>("");
  const [socialCampaigns, setSocialCampaigns] = useState<any[]>([]);
  const [socialLogs, setSocialLogs] = useState<string[]>(["Central de Imprensa iniciada. Pronto para planejar campanhas."]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const addSocialLog = (msg: string) => {
    setSocialLogs(prev => [`[${new Date().toLocaleTimeString("pt-BR")}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const loadSocialCampaigns = async () => {
    try {
      const colRef = collection(db, "social_posts");
      const q = query(colRef, orderBy("timestamp", "desc"), limit(6));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setSocialCampaigns(list);
    } catch (e) {
      console.error("Erro ao carregar campanhas sociais do Firestore:", e);
      handleFirestoreError(e, OperationType.LIST, "social_posts");
    }
  };

  const generateSocialThread = async () => {
    setSocialIsGenerating(true);
    addSocialLog(`Iniciando geração de thread de alta performance para stakeholder [${socialStakeholder}]...`);
    try {
      const res = await fetch("/api/generate-threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: currentCandidate.name,
          candidateParty: currentCandidate.party,
          stakeholder: socialStakeholder,
          tone: socialTone,
          swotRating: `${currentCandidate.score || 2}/3`
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.threads && Array.isArray(data.threads)) {
          setSocialPosts(data.threads);
          addSocialLog(`Thread gerada com sucesso (${data.mode === "api" ? "Gemini AI" : "Biblioteca Local"}).`);
        } else {
          addSocialLog("Erro: formato de resposta inválido recebido.");
        }
      } else {
        addSocialLog("Erro de rede ao comunicar com o servidor de geração.");
      }
    } catch (error: any) {
      console.error("Erro na chamada do gerador:", error);
      addSocialLog(`Falha na geração: ${error.message}`);
    } finally {
      setSocialIsGenerating(false);
    }
  };

  const publishSocialThread = async () => {
    setSocialIsPublishing(true);
    addSocialLog(`Iniciando publicação da thread via canal [${socialPlatform}]...`);
    try {
      const payload = {
        platform: socialPlatform,
        posts: socialPosts,
        blueskyConfig: socialPlatform === "bluesky" ? {
          identifier: bskyIdentifier,
          password: bskyPassword
        } : null,
        candidateId: selectedId,
        stakeholder: socialStakeholder
      };

      const res = await fetch("/api/publish-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        
        // Salvar no Cloud Firestore
        const docId = "campaign_" + Date.now();
        const docRef = doc(db, "social_posts", docId);
        await setDoc(docRef, {
          id: docId,
          timestamp: new Date().toISOString(),
          candidateName: currentCandidate.name,
          candidateParty: currentCandidate.party,
          stakeholder: socialStakeholder,
          tone: socialTone,
          platform: socialPlatform,
          posts: socialPosts,
          realPublish: data.realPublish || false
        });

        addSocialLog(data.message);
        if (data.warning) {
          addSocialLog(`Aviso: ${data.warning}`);
        }
        
        loadSocialCampaigns();
        setSuccessToast(`Campanha salva com sucesso no Firestore!`);
        setTimeout(() => setSuccessToast(null), 4000);
      } else {
        const errData = await res.json();
        addSocialLog(`Erro de publicação: ${errData.error || "Erro de rede"}`);
      }
    } catch (error: any) {
      console.error("Erro ao publicar:", error);
      addSocialLog(`Falha de envio: ${error.message}`);
    } finally {
      setSocialIsPublishing(false);
    }
  };

  // Carregar histórico de campanhas na inicialização
  useEffect(() => {
    loadSocialCampaigns();
  }, []);


  // Estados para o Simulador de Lobby de Big Techs e IA Data Centers
  const [dataCenterDemand, setDataCenterDemand] = useState<number>(150); // MW de capacidade instalada de data center
  const [dataCenterPue, setDataCenterPue] = useState<number>(1.25); // PUE do data center (Power Usage Effectiveness)
  const [utilityTariff, setUtilityTariff] = useState<number>(0.85); // Tarifa da distribuidora (R$/kWh)

  // Estados para rastrear deputados e senadores individualmente
  const [legislators, setLegislators] = useState<Legislator[]>(() => generateLegislators());
  const [legislatorSearch, setLegislatorSearch] = useState<string>("");
  const [legislatorFilterParty, setLegislatorFilterParty] = useState<string>("ALL");
  const [legislatorFilterVote, setLegislatorFilterVote] = useState<string>("ALL");
  const [legislatorFilterType, setLegislatorFilterType] = useState<string>("ALL");
  const [selectedLegislator, setSelectedLegislator] = useState<Legislator | null>(null);

  // Estados para Mensageria Direta de Legisladores
  const [legMsgSenderName, setLegMsgSenderName] = useState<string>("Eleitor Consciente");
  const [legMsgSenderEmail, setLegMsgSenderEmail] = useState<string>("eleitor@exemplo.com");
  const [legMsgSubject, setLegMsgSubject] = useState<string>("PL de Descentralização Energética - Apelo Cívico");
  const [legMsgBody, setLegMsgBody] = useState<string>("");
  const [legMsgIsSending, setLegMsgIsSending] = useState<boolean>(false);
  const [legMsgActiveTab, setLegMsgActiveTab] = useState<"dossier" | "message">("dossier");
  const [legMsgHistory, setLegMsgHistory] = useState<any[]>([]);
  const [legMsgResponse, setLegMsgResponse] = useState<string | null>(null);
  const [legMsgSentEmailAddress, setLegMsgSentEmailAddress] = useState<string | null>(null);

  const loadLegislatorMessages = async (legId: string) => {
    try {
      const colRef = collection(db, "legislator_communications");
      const q = query(colRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.legislatorId === legId) {
          list.push({ id: doc.id, ...data });
        }
      });
      setLegMsgHistory(list);
    } catch (e) {
      console.error("Erro ao carregar mensagens do legislador do Firestore:", e);
      handleFirestoreError(e, OperationType.LIST, "legislator_communications");
    }
  };

  useEffect(() => {
    if (selectedLegislator?.id) {
      loadLegislatorMessages(selectedLegislator.id);
      setLegMsgActiveTab("dossier");
      setLegMsgResponse(null);
      setLegMsgSentEmailAddress(null);
      const voteWord = selectedLegislator.vote === "NÃO" ? "mude seu voto para SIM no" : "mantenha seu voto favorável ao";
      setLegMsgBody(`Prezado(a) ${selectedLegislator.name}, como cidadão e eleitor, peço encarecidamente que ${voteWord} PL de Descentralização Energética. A expansão de energia limpa (rumo à meta de 20.000 kWh/hab) e o barateamento das baterias de LFP beneficiam diretamente o desenvolvimento tecnológico e social do nosso estado! Peço que ouça a voz da sociedade.`);
    }
  }, [selectedLegislator?.id]);

  const sendLegislatorMessage = async () => {
    if (!selectedLegislator) return;
    setLegMsgIsSending(true);
    try {
      const payload = {
        legislatorId: selectedLegislator.id,
        legislatorName: selectedLegislator.name,
        legislatorType: selectedLegislator.type,
        legislatorParty: selectedLegislator.party,
        legislatorLobby: selectedLegislator.baseLobby,
        legislatorVote: selectedLegislator.vote,
        senderName: legMsgSenderName,
        senderEmail: legMsgSenderEmail,
        subject: legMsgSubject,
        messageContent: legMsgBody
      };

      const res = await fetch("/api/message-legislator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        
        // Salvar no Firestore
        const docId = "msg_" + Date.now();
        const docRef = doc(db, "legislator_communications", docId);
        const savedPayload = {
          id: docId,
          timestamp: data.timestamp || new Date().toISOString(),
          legislatorId: selectedLegislator.id,
          legislatorName: selectedLegislator.name,
          legislatorType: selectedLegislator.type,
          legislatorParty: selectedLegislator.party,
          senderName: legMsgSenderName,
          senderEmail: legMsgSenderEmail,
          subject: legMsgSubject,
          messageContent: legMsgBody,
          sentToEmail: data.sentToEmail,
          autoReply: data.autoReply,
          mode: data.mode
        };
        await setDoc(docRef, savedPayload);

        setLegMsgResponse(data.autoReply);
        setLegMsgSentEmailAddress(data.sentToEmail);
        
        // Recarregar histórico
        loadLegislatorMessages(selectedLegislator.id);
        
        setSuccessToast(`E-mail enviado para o gabinete oficial de ${selectedLegislator.name}!`);
        setTimeout(() => setSuccessToast(null), 4000);
      } else {
        console.error("Erro na resposta da API");
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem ao parlamentar:", err);
      handleFirestoreError(err, OperationType.WRITE, "legislator_communications");
    } finally {
      setLegMsgIsSending(false);
    }
  };

  // Estados para o Simulador de Armazenamento Solar Diurno (Baterias) e Gestão de Pico
  const [hasSolarStorage, setHasSolarStorage] = useState<boolean>(true);
  const [batteryCapacity, setBatteryCapacity] = useState<number>(10); // em kWh
  const [dailyPeakUsage, setDailyPeakUsage] = useState<number>(6); // consumo em kWh das 18h às 21h
  const [solarPanelsCapacity, setSolarPanelsCapacity] = useState<number>(5); // kWp de geração solar instalada

  // Cálculos dinâmicos de impacto de economia de energia e lobby dos Data Centers das Big Techs
  const dcEnergyUsageAnnually = dataCenterDemand * 1000 * 24 * 365 * dataCenterPue; // em kWh/ano
  const dcEnergyUsageMwhAnnually = dcEnergyUsageAnnually / 1000; // em MWh/ano
  const dcCostUtility = dcEnergyUsageAnnually * utilityTariff; // Custo anual em R$ na distribuidora
  const dcCostDecentralized = dcEnergyUsageAnnually * (utilityTariff * 0.45); // Tarifa com desconto de 55% pelo excedente solar prossumidor
  const dcSavingsAnnually = dcCostUtility - dcCostDecentralized; // Economia líquida anual em R$
  const lobbyFunding = dcSavingsAnnually * 0.12; // 12% da economia anual revertida em fomento local e lobby político

  const handleSolarNegotiate = (actionType: "agro" | "icms" | "popular" | "bigtech") => {
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
    } else if (actionType === "bigtech") {
      setBigTechLobbyActive(true);
      setSolarChamberSupport(prev => Math.min(prev + 28, 100));
      setSolarSenateSupport(prev => Math.min(prev + 24, 100));
      setSolarLog(`Lobby das Big Techs ATIVADO! Com economia estimada em R$ ${(dcSavingsAnnually / 1000000).toFixed(1)}M/ano, as gigantes da tecnologia alocaram R$ ${(lobbyFunding / 1000000).toFixed(1)}M em doações regionais de infraestrutura local, centros de IA e campanhas digitais para reverter votos (+28% suporte na Câmara, +24% no Senado).`);
    }
  };

  const handleStartSolarVote = () => {
    if (solarIsVoting) return;
    setSolarIsVoting(true);
    setSolarVoteProgressStep(1);
    setSolarLog("Votação nominal iniciada na Câmara dos Deputados! Cada um dos 513 deputados federais está registrando seu voto em tempo real...");

    // Update individual deputy votes
    setTimeout(() => {
      let simVotesChamber = 0;
      
      const updatedLegislators = legislators.map(leg => {
        if (leg.type === "deputy") {
          // Calculate probability based on lobby and actions
          let prob = 30; // Base default probability
          
          if (leg.baseLobby === "Social/Clima") {
            prob = 94; // Almost always votes yes
          } else if (leg.baseLobby === "Distribuidoras") {
            prob = bigTechLobbyActive ? 35 : 4; // Bribed by distributors, hard to convince unless outbid
          } else if (leg.baseLobby === "Agronegócio") {
            const hasAgroBonus = solarChamberSupport > 55;
            prob = hasAgroBonus ? 85 : 25;
            if (bigTechLobbyActive) prob += 15;
          } else if (leg.baseLobby === "Big Techs") {
            prob = bigTechLobbyActive ? 98 : 65; // High tech lobby support
          } else if (leg.baseLobby === "Fisiológico") {
            prob = 35;
            if (solarChamberSupport > 62) prob += 20; // Government influence
            if (bigTechLobbyActive) prob += 40; // Heavy industry campaign stimulus
          }
          
          prob = Math.max(5, Math.min(98, prob));
          const roll = Math.random() * 100;
          const vote: "SIM" | "NÃO" | "ABSTENÇÃO" = roll < prob ? "SIM" : (roll > prob + 12 ? "NÃO" : "ABSTENÇÃO");
          if (vote === "SIM") simVotesChamber++;
          
          return { ...leg, vote };
        }
        return leg;
      });

      setSolarChamberVotes(simVotesChamber);
      setLegislators(updatedLegislators);

      if (simVotesChamber >= 257) {
        setSolarVoteProgressStep(2);
        setSolarLog(`APROVADO NA CÂMARA! O PL de Descentralização Solar recebeu ${simVotesChamber} votos favoráveis (mínimo 257). Enviando imediatamente ao Plenário do Senado Federal (81 senadores) para votação nominal final...`);
        
        setTimeout(() => {
          let simVotesSenate = 0;
          
          const finalLegislators = updatedLegislators.map(leg => {
            if (leg.type === "senator") {
              let prob = 25; // Base probability for conservative Senate
              
              if (leg.baseLobby === "Social/Clima") {
                prob = 90;
              } else if (leg.baseLobby === "Distribuidoras") {
                prob = bigTechLobbyActive ? 30 : 5;
              } else if (leg.baseLobby === "Agronegócio") {
                const hasAgroBonus = solarSenateSupport > 50;
                prob = hasAgroBonus ? 80 : 20;
                if (bigTechLobbyActive) prob += 15;
              } else if (leg.baseLobby === "Big Techs") {
                prob = bigTechLobbyActive ? 96 : 55;
              } else if (leg.baseLobby === "Fisiológico") {
                prob = 30;
                if (solarSenateSupport > 60) prob += 20;
                if (bigTechLobbyActive) prob += 45; // Strategic target for campaign funds
              }
              
              prob = Math.max(5, Math.min(98, prob));
              const roll = Math.random() * 100;
              const vote: "SIM" | "NÃO" | "ABSTENÇÃO" = roll < prob ? "SIM" : (roll > prob + 10 ? "NÃO" : "ABSTENÇÃO");
              if (vote === "SIM") simVotesSenate++;
              
              return { ...leg, vote };
            }
            return leg;
          });
          
          setSolarSenateVotes(simVotesSenate);
          setLegislators(finalLegislators);

          if (simVotesSenate >= 41) {
            setSolarVoteProgressStep(3);
            setSolarPLApproved(true);
            setSolarLog(`HISTÓRICO! O PL de Descentralização Energética foi APROVADO NO SENADO com ${simVotesSenate} votos favoráveis (mínimo 41)! O oligopólio e as distribuidoras foram derrotados pela aliança entre prossumidores e o Lobby das Big Techs. Pequenos consumidores agora monetizam seu excedente solar diretamente na rede para abastecer os Data Centers famintos de IA.`);
            saveSimulationState("approved", simVotesChamber, simVotesSenate, finalLegislators);
          } else {
            setSolarVoteProgressStep(4);
            setSolarLog(`REJEITADO NO SENADO! Obteve apenas ${simVotesSenate} votos favoráveis dos 41 necessários. O lobby financeiro pesado das concessionárias e distribuidoras de energia tradicionais barrou o projeto na casa federativa.`);
            saveSimulationState("rejected", simVotesChamber, simVotesSenate, finalLegislators);
          }
          setSolarIsVoting(false);
        }, 1800);

      } else {
        setSolarVoteProgressStep(4);
        setSolarLog(`REJEITADO NA CÂMARA DOS DEPUTADOS! Obteve apenas ${simVotesChamber} votos favoráveis dos 257 necessários. O oligopólio tradicional das distribuidoras prevaleceu na ausência de articulação financeira e política suficiente.`);
        setSolarIsVoting(false);
        saveSimulationState("rejected", simVotesChamber, 0, updatedLegislators);
      }
    }, 1800);
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
    setBigTechLobbyActive(false);
    setSelectedLegislator(null);
    setLegislators(prev => prev.map(l => ({ ...l, vote: "ABSTENÇÃO" })));
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

              {/* Seção Interativa: Lobby das Big Techs e Demanda por Energia de IA */}
              <div className="space-y-4 pt-5 border-t border-slate-100">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-indigo-600" />
                    Simulador de Lobby: Big Techs & Demanda de Energia de IA
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Grandes corporações de tecnologia (Big Techs) demandam volumes astronômicos de eletricidade livre de carbono para alimentar seus novos clusters de Inteligência Artificial. Elas exercem uma pressão política agressiva (lobbying) a favor da descentralização do grid para contornar o monopólio das distribuidoras tradicionais e drenar o excedente solar de pequenos geradores a preços competitivos.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Slider 1: Demanda */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-600 uppercase font-mono block">Demanda do Data Center</label>
                        <span className="text-xs font-mono font-black text-indigo-600">{dataCenterDemand} MW</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="500" 
                        step="10"
                        value={dataCenterDemand}
                        onChange={(e) => setDataCenterDemand(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-[9px] text-slate-400 block leading-tight">Escala do cluster de processamento de modelos de IA de grande porte.</span>
                    </div>

                    {/* Slider 2: PUE */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-600 uppercase font-mono block">Eficiência Energética (PUE)</label>
                        <span className="text-xs font-mono font-black text-indigo-600">{dataCenterPue.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1.05" 
                        max="1.70" 
                        step="0.05"
                        value={dataCenterPue}
                        onChange={(e) => setDataCenterPue(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-[9px] text-slate-400 block leading-tight">Power Usage Effectiveness: quanto menor, mais eficiente o resfriamento.</span>
                    </div>

                    {/* Slider 3: Tarifa */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-600 uppercase font-mono block">Tarifa Concessionária</label>
                        <span className="text-xs font-mono font-black text-indigo-600">R$ {utilityTariff.toFixed(2)}/kWh</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.50" 
                        max="1.20" 
                        step="0.05"
                        value={utilityTariff}
                        onChange={(e) => setUtilityTariff(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-[9px] text-slate-400 block leading-tight">Tarifa média corporativa praticada pelo monopólio de energia local.</span>
                    </div>
                  </div>

                  {/* Resultados em Tempo Real */}
                  <div className="border-t border-slate-200/60 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">Consumo Total Anual</span>
                      <span className="text-sm font-mono font-black text-slate-900 block">{(dcEnergyUsageMwhAnnually / 1000).toFixed(1)} GWh</span>
                      <span className="text-[9px] text-slate-400">Energia gasta em 1 ano</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">Custo Concessionária</span>
                      <span className="text-sm font-mono font-black text-slate-900 block">R$ {(dcCostUtility / 1000000).toFixed(1)}M</span>
                      <span className="text-[9px] text-slate-400">Tarifa tradicional do oligopólio</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs bg-indigo-50/20 border-indigo-100/50">
                      <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider font-mono block mb-1">Economia Projetada</span>
                      <span className="text-sm font-mono font-black text-indigo-700 block flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        R$ {(dcSavingsAnnually / 1000000).toFixed(1)}M
                      </span>
                      <span className="text-[9px] text-slate-400">Com excedente solar direto</span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs bg-amber-50/20 border-amber-100/50">
                      <span className="text-[8px] font-bold text-amber-700 uppercase tracking-wider font-mono block mb-1">Poder de Lobbying</span>
                      <span className="text-sm font-mono font-black text-amber-700 block flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5" />
                        R$ {(lobbyFunding / 1000000).toFixed(1)}M
                      </span>
                      <span className="text-[9px] text-slate-400">Fundo de campanha e incentivos</span>
                    </div>
                  </div>

                  {/* Ação de Ativação de Lobbying */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/40">
                    <div className="text-[11px] text-slate-500 max-w-md">
                      <strong>Mecanismo Corporativo:</strong> Ao reverter R$ {(lobbyFunding / 1000000).toFixed(1)}M em anúncios institucionais direcionados, incentivos tributários e doações em computadores/laboratórios nos distritos eleitorais, as Big Techs quebram as barreiras das concessionárias tradicionais, convencionando parlamentares centristas/fisiológicos e do agronegócio a apoiarem o PL da Microgeração Solar.
                    </div>

                    <button
                      type="button"
                      disabled={bigTechLobbyActive || solarPLApproved}
                      onClick={() => {
                        handleSolarNegotiate("bigtech");
                        // Rola suavemente até o simulador de votação legislativa
                        const element = document.getElementById("congresso-votacao-painel");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs font-mono transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                        bigTechLobbyActive 
                          ? "bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/15 hover:shadow-indigo-600/25 border border-indigo-700"
                      }`}
                    >
                      <Zap className={`h-4 w-4 ${bigTechLobbyActive ? "text-slate-400" : "text-amber-300 animate-pulse"}`} />
                      {bigTechLobbyActive ? "LOBBY ATIVO NO PLENÁRIO" : "ATIVAR LOBBY NO CONGRESSO"}
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Portal de Sugestões Legislativas e Propostas */}
      <LegislativePortal 
        onApprovalInfluence={(chamberDelta, senateDelta) => {
          setSolarChamberSupport(prev => Math.min(prev + chamberDelta, 100));
          setSolarSenateSupport(prev => Math.min(prev + senateDelta, 100));
        }} 
      />

      {/* Gerenciador Técnico de Rascunhos de Propostas Legislativas */}
      <LegislativeProposalManager />

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

              {/* Big Tech Lobby */}
              <button
                disabled={solarPLApproved || solarIsVoting || bigTechLobbyActive}
                onClick={() => handleSolarNegotiate("bigtech")}
                className={`w-full text-left p-3 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-start gap-2.5 ${
                  bigTechLobbyActive 
                    ? "border-cyan-500/50 bg-cyan-950/40" 
                    : "border-cyan-900/40 hover:border-cyan-850 bg-cyan-950/20 hover:bg-cyan-950/40"
                }`}
              >
                <span className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg mt-0.5 font-mono text-xs font-bold">LOBBY</span>
                <div>
                  <span className="text-xs font-bold text-cyan-300 block flex items-center gap-1.5">
                    Acionar Lobby das Big Techs & AI
                    {bigTechLobbyActive && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold animate-pulse">Ativo</span>}
                  </span>
                  <span className="text-[10px] text-cyan-100/60 leading-normal block mt-0.5">
                    As gigantes de IA financiam campanhas para que cidadãos vendam seu excedente solar de baixo custo diretamente no grid nacional, suprindo seus Data Centers sedentos por energia (+25% Câmara, +20% Senado).
                  </span>
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

        {/* Saved Simulations History Section */}
        <div className="mt-8 border border-slate-800 bg-slate-900/40 rounded-3xl p-6 text-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-5 w-5 text-indigo-400" />
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Histórico de Simulações de Votação (Firestore)</h4>
          </div>
          {savedSimulations.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-2xl">
              Nenhuma simulação anterior de votação arquivada no Firebase ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {savedSimulations.map((sim, idx) => (
                <div key={sim.id || idx} className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between gap-3 text-xs shadow-sm hover:border-slate-700/80 transition-all">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        sim.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {sim.status === "approved" ? "APROVADO" : "REJEITADO"}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">{new Date(sim.timestamp).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <strong className="text-white block mt-1.5 text-xs truncate">Plano: {sim.candidateName}</strong>
                    <span className="text-[9px] text-slate-400 font-mono block uppercase">{sim.candidateParty}</span>
                    
                    <div className="text-slate-400 text-[10px] mt-2.5 space-y-1 border-t border-slate-900 pt-2 font-mono">
                      <div className="flex justify-between">
                        <span>Câmara:</span>
                        <strong className="text-indigo-400">{sim.chamberVotes} / 513</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Senado:</span>
                        <strong className="text-purple-400">{sim.senateVotes > 0 ? `${sim.senateVotes} / 81` : "N/A"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Center:</span>
                        <strong className="text-slate-200">{sim.dataCenterDemand} MW</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Lobbying:</span>
                        <strong className={sim.bigTechLobbyActive ? "text-cyan-400" : "text-slate-500"}>
                          {sim.bigTechLobbyActive ? "Ativo" : "Inativo"}
                        </strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-850 pt-2.5 mt-1">
                    <span className="text-[8px] text-slate-500 font-mono uppercase block tracking-wider leading-none">Economia das Big Techs</span>
                    <strong className="text-emerald-400 font-mono text-xs block mt-0.5">R$ {(sim.dcSavingsAnnually / 1000000).toFixed(1)}M / ano</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📣 CENTRAL DE IMPRENSA & PRESSÃO SOCIAL: GERADOR & PUBLICADOR DE THREADS (BLUESKY & X) */}
        <div className="mt-8 border border-slate-800 bg-slate-950/65 rounded-3xl p-6 text-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-850">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono block mb-1">
                Gabinete Digital & Mobilização Pública
              </span>
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Share2 className="h-5 w-5 text-cyan-400" />
                Central de Pressão Social: Gerador & Publicador (Bluesky & Twitter)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Mobilize a opinião pública e pressione parlamentares indecisos! Gere threads personalizadas com IA focadas em cada stakeholder chave para reverter votos no Congresso e angariar suporte popular.
              </p>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300">Firestore Conectado</span>
            </div>
          </div>

          {/* Success Toast */}
          <AnimatePresence>
            {successToast && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 mb-4 font-mono shadow-sm shadow-cyan-500/10"
              >
                <Check className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                <span>{successToast}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1: CAMPAIGN PLANNER CONTROLS (Col 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Stakeholder and Tone Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Stakeholder Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Stakeholder Alvo</label>
                  <select
                    value={socialStakeholder}
                    onChange={(e: any) => setSocialStakeholder(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs rounded-xl py-2.5 px-3 text-slate-200 focus:border-cyan-500 outline-none cursor-pointer font-sans transition-all"
                  >
                    <option value="general">👥 População Geral (Fim das Bandeiras)</option>
                    <option value="bigtech">💻 Big Techs & AI Centers (Energia de IA)</option>
                    <option value="prosumer">☀️ Pequenos Prossumidores (Venda Solar)</option>
                    <option value="utility">🏢 Concessionárias de Energia (Smart Grid)</option>
                    <option value="legislator">🏛️ Congresso Nacional (Voto e Dividendos)</option>
                  </select>
                </div>

                {/* Tone Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Tom da Comunicação</label>
                  <select
                    value={socialTone}
                    onChange={(e: any) => setSocialTone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs rounded-xl py-2.5 px-3 text-slate-200 focus:border-cyan-500 outline-none cursor-pointer font-sans transition-all"
                  >
                    <option value="analytical">📈 Técnico & Analítico (Dados e PIB)</option>
                    <option value="persuasive">🔥 Persuasivo & Mobilizador (Engajamento)</option>
                    <option value="corporate">💼 Pragmático & Corporativo (CAPEX/ROI)</option>
                  </select>
                </div>

              </div>

              {/* Platform Selector Tabs */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Plataforma de Publicação</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSocialPlatform("simulated")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      socialPlatform === "simulated"
                        ? "bg-slate-950 text-white border border-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Simulado
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialPlatform("bluesky")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      socialPlatform === "bluesky"
                        ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 shadow-sm shadow-cyan-500/5"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-cyan-400">🩵</span>
                    Bluesky Real
                  </button>
                  <button
                    type="button"
                    onClick={() => setSocialPlatform("twitter")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      socialPlatform === "twitter"
                        ? "bg-white/5 text-white border border-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>🖤</span>
                    Twitter / X
                  </button>
                </div>
              </div>

              {/* Platform specific credential configurations */}
              {socialPlatform === "bluesky" && (
                <div className="bg-cyan-950/10 border border-cyan-900/30 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-cyan-300 font-sans leading-relaxed">
                      <strong>Conexão Segura ao Bluesky:</strong> Insira seu Handle (ex: <code>seunome.bsky.social</code>) e seu <strong>App Password</strong> (criado nas Configurações do Bluesky em &apos;Senhas do Aplicativo&apos;). Suas credenciais são processadas localmente de forma estritamente segura para criar a sessão AT Protocol.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-cyan-400/80 font-mono block uppercase">Bluesky Handle</span>
                      <input
                        type="text"
                        placeholder="ex: voce.bsky.social"
                        value={bskyIdentifier}
                        onChange={(e) => setBskyIdentifier(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-slate-100 outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-cyan-400/80 font-mono block uppercase">App Password</span>
                      <input
                        type="password"
                        placeholder="ex: abcd-efgh-ijkl-mnop"
                        value={bskyPassword}
                        onChange={(e) => setBskyPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-slate-100 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {socialPlatform === "twitter" && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-[10px] text-slate-300 font-sans leading-relaxed">
                      <strong>Postagem Manual Super Rápida (Intent):</strong> As APIs do Twitter restringem postagens automatizadas de terceiros sem taxas exorbitantes. 
                      Para garantir total sucesso, fornecemos botões <strong>Postar no X</strong> individuais no smartphone preview para disparar cada post em 1 clique, prontos e formatados. Alternativamente, selecione <strong>Simulado</strong> para simular e salvar a campanha diretamente no banco de dados para prestação de contas!
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={socialIsGenerating || socialIsPublishing}
                  onClick={generateSocialThread}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-55 text-white font-bold py-3 px-4 rounded-xl text-xs font-mono transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-cyan-950/20"
                >
                  <Sparkles className={`h-4 w-4 ${socialIsGenerating ? "animate-spin" : ""}`} />
                  {socialIsGenerating ? "Gerando com Gemini AI..." : "Gerar Thread com IA"}
                </button>
                <button
                  type="button"
                  disabled={socialIsGenerating || socialIsPublishing}
                  onClick={publishSocialThread}
                  className="flex-1 bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-slate-800 hover:border-slate-700 disabled:opacity-55 font-bold py-3 px-4 rounded-xl text-xs font-mono transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className={`h-4 w-4 ${socialIsPublishing ? "animate-pulse" : ""}`} />
                  {socialIsPublishing ? "Publicando..." : socialPlatform === "simulated" ? "Simular e Arquivar (Firestore)" : "Publicar Thread Real"}
                </button>
              </div>

              {/* Real-time Logger Console */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                  <span>Console de Operações de Imprensa</span>
                  <span className="text-[8px] text-slate-600">Histórico de Sessão</span>
                </div>
                <div className="bg-slate-950 border border-slate-900 rounded-2xl p-3.5 max-h-36 overflow-y-auto font-mono text-[10px] text-cyan-400/90 space-y-1.5 shadow-inner">
                  {socialLogs.map((log, index) => (
                    <div key={index} className="flex gap-2 leading-relaxed">
                      <span className="text-slate-600">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COLUMN 2: SMARTPHONE TIMELINE PREVIEW (Col 5) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              <div className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider mb-2.5 self-start">
                Preview de Linha do Tempo (Smartphone)
              </div>

              {/* Mock iPhone/Android frame */}
              <div className="w-full max-w-[340px] bg-slate-950 rounded-[40px] border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col min-h-[480px]">
                
                {/* Smartphone Notch and Status bar */}
                <div className="bg-slate-950 h-6 flex justify-between items-center px-6 text-[9px] text-slate-400 font-mono border-b border-slate-900">
                  <span>13:23</span>
                  <div className="w-16 h-3.5 bg-slate-900 rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <Battery className="h-3 w-3" />
                  </div>
                </div>

                {/* Platform Header */}
                <div className="bg-slate-950 py-2.5 px-4 border-b border-slate-900 flex justify-between items-center">
                  <span className="text-xs font-black text-white tracking-tight">
                    {socialPlatform === "bluesky" ? "🦋 Bluesky" : socialPlatform === "twitter" ? "🩵 Twitter" : "🛡️ Painel de Imprensa"}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono uppercase">Feed Oficial</span>
                </div>

                {/* Smartphone Screen Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950 scrollbar-thin">
                  {socialPosts.map((postText, index) => {
                    const candInfo = getCandidateHandle(currentCandidate.name);
                    const isOverLimit = socialPlatform === "bluesky" ? postText.length > 300 : postText.length > 280;
                    
                    return (
                      <div key={index} className="relative flex gap-2 text-xs">
                        {/* Thread line linking avatars */}
                        {index < socialPosts.length - 1 && (
                          <div className="absolute left-[13px] top-7 bottom-[-20px] w-0.5 bg-slate-800"></div>
                        )}

                        {/* Avatar */}
                        <div className="h-7 w-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sm flex-shrink-0 z-10">
                          {candInfo.avatar}
                        </div>

                        {/* Tweet box content */}
                        <div className="flex-1 space-y-1">
                          
                          {/* User info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 truncate max-w-[140px]">
                              <strong className="text-slate-100 font-bold truncate text-[11px]">{currentCandidate.name}</strong>
                              <span className="text-slate-500 text-[9px] font-mono">{candInfo.handle}</span>
                            </div>
                            <span className="text-slate-600 text-[9px] font-mono">{index + 1} de {socialPosts.length}</span>
                          </div>

                          {/* Editable Post Text Area */}
                          <textarea
                            value={postText}
                            onChange={(e) => {
                              const next = [...socialPosts];
                              next[index] = e.target.value;
                              setSocialPosts(next);
                            }}
                            rows={3}
                            className="w-full bg-slate-900/50 border border-slate-850 hover:border-slate-800 focus:border-cyan-500 rounded-xl p-2.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-sans leading-relaxed transition-all"
                          />

                          {/* Post stats & actions */}
                          <div className="flex items-center justify-between text-[10px] pt-1">
                            
                            {/* Char Counter */}
                            <span className={`font-mono text-[9px] ${isOverLimit ? "text-rose-500 font-bold" : "text-slate-500"}`}>
                              {postText.length} / {socialPlatform === "bluesky" ? 300 : 280} c.
                            </span>

                            {/* Quick tools */}
                            <div className="flex items-center gap-2 text-slate-400">
                              
                              {/* Copy tool */}
                              <button
                                type="button"
                                title="Copiar este post"
                                onClick={() => {
                                  navigator.clipboard.writeText(postText);
                                  addSocialLog(`Copiado Post ${index+1} para a área de transferência.`);
                                }}
                                className="hover:text-cyan-400 p-1 bg-slate-900 border border-slate-850 rounded-lg hover:border-slate-700 transition-all cursor-pointer"
                              >
                                <Copy className="h-3 w-3" />
                              </button>

                              {/* Manual intent launch button */}
                              <a
                                href={socialPlatform === "bluesky" 
                                  ? `https://bsky.app/intent/compose?text=${encodeURIComponent(postText)}`
                                  : `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                title="Postar manualmente via Intent"
                                className="hover:text-cyan-400 p-1 bg-slate-900 border border-slate-850 rounded-lg hover:border-slate-700 transition-all flex items-center justify-center cursor-pointer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>

                            </div>

                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* HISTÓRICO DE CAMPANHAS DE PRESSÃO (FIRESTORE DATABASE AUDIT) */}
          <div className="mt-8 pt-6 border-t border-slate-850">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4.5 w-4.5 text-cyan-400" />
              <h5 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Histórico de Campanhas Sociais (Firestore)</h5>
            </div>

            {socialCampaigns.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 font-mono border border-dashed border-slate-850 rounded-2xl">
                Nenhuma campanha social salva no banco de dados ainda. Gere e publique para salvar!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialCampaigns.map((camp, idx) => {
                  const labelStakeholder = 
                    camp.stakeholder === "bigtech" ? "Big Techs & IA" :
                    camp.stakeholder === "prosumer" ? "Prossumidores" :
                    camp.stakeholder === "utility" ? "Distribuidoras" :
                    camp.stakeholder === "legislator" ? "Congresso" :
                    "População Geral";

                  return (
                    <div key={camp.id || idx} className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between gap-3 text-xs shadow-sm hover:border-slate-800 transition-all">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            camp.realPublish ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                          }`}>
                            {camp.realPublish ? "PUBLICAÇÃO REAL" : "SIMULAÇÃO"}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">{new Date(camp.timestamp).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <strong className="text-white block truncate">Campanha: {camp.candidateName}</strong>
                        <span className="text-[9px] text-slate-400 font-mono block uppercase">Canal: {camp.platform}</span>

                        <div className="text-[10px] text-slate-400 mt-2 font-sans line-clamp-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                          {camp.posts && camp.posts[0] ? camp.posts[0] : "Sem posts cadastrados."}
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-850/60 pt-2.5 mt-1.5">
                        <span className="text-[9px] text-slate-500 font-mono uppercase">Alvo: {labelStakeholder}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (camp.posts) {
                              setSocialPosts(camp.posts);
                              setSocialStakeholder(camp.stakeholder || "general");
                              setSocialTone(camp.tone || "analytical");
                              setSocialPlatform(camp.platform || "simulated");
                              addSocialLog(`Campanha de ${camp.candidateName} carregada no smartphone para edição/envio!`);
                            }
                          }}
                          className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                        >
                          Carregar no Preview
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Seating Grid of All 513 Deputies and 81 Senators */}
        <div id="congresso-votacao-painel" className="mt-8 border border-slate-800 bg-slate-950 rounded-3xl p-6 text-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-850">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono block mb-1">
                Auditoria de Corporativismo & Pecúnia Legislativa
              </span>
              <h4 className="text-base font-black text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                Painel do Plenário: 513 Deputados e 81 Senadores
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                O voto nominal revela o incentivo financeiro de cada parlamentar. O lobby das Distribuidoras quer abstenção ou voto NÃO para proteger tarifas, enquanto as Big Techs compram votos SIM para alimentar novos Data Centers de Inteligência Artificial.
              </p>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500 block"></span>
                <span>SIM ({legislators.filter(l => l.vote === "SIM").length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-rose-500 block"></span>
                <span>NÃO ({legislators.filter(l => l.vote === "NÃO").length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-slate-600 block"></span>
                <span>ABSTENÇÃO/NEUTRO ({legislators.filter(l => l.vote === "ABSTENÇÃO").length})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Seating Charts (Col 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Chamber (513 Seats) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-indigo-300 font-mono uppercase">Câmara dos Deputados (513 Cadeiras)</span>
                  <span className="text-[10px] text-slate-500">Mínimo para aprovação: 257 SIM</span>
                </div>
                
                {/* Responsive grid of tiny seats */}
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-850/80">
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 justify-center max-w-full">
                    {legislators.filter(l => l.type === "deputy").map((dep, index) => (
                      <button
                        key={dep.id}
                        title={`${dep.name} (${dep.party}-${dep.state}) - Lobby: ${dep.baseLobby} - Voto: ${dep.vote}`}
                        onClick={() => setSelectedLegislator(dep)}
                        className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded transition-all cursor-pointer hover:ring-2 hover:ring-white/80 ${
                          dep.vote === "SIM" ? "bg-emerald-500 shadow-sm shadow-emerald-500/25" :
                          dep.vote === "NÃO" ? "bg-rose-500 shadow-sm shadow-rose-500/25" :
                          "bg-slate-700 hover:bg-slate-600"
                        } ${selectedLegislator?.id === dep.id ? "ring-2 ring-indigo-400 scale-125 z-10" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Senate (81 Seats) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-purple-300 font-mono uppercase">Senado Federal (81 Cadeiras)</span>
                  <span className="text-[10px] text-slate-500">Mínimo para aprovação: 41 SIM</span>
                </div>
                
                {/* Larger dots for senate */}
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-850/80">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                    {legislators.filter(l => l.type === "senator").map((sen) => (
                      <button
                        key={sen.id}
                        title={`${sen.name} (${sen.party}-${sen.state}) - Lobby: ${sen.baseLobby} - Voto: ${sen.vote}`}
                        onClick={() => setSelectedLegislator(sen)}
                        className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-all cursor-pointer hover:ring-2 hover:ring-white/80 ${
                          sen.vote === "SIM" ? "bg-emerald-500 shadow-sm shadow-emerald-500/25" :
                          sen.vote === "NÃO" ? "bg-rose-500 shadow-sm shadow-rose-500/25" :
                          "bg-slate-700 hover:bg-slate-600"
                        } ${selectedLegislator?.id === sen.id ? "ring-2 ring-indigo-400 scale-125 z-10" : ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Search and List Table */}
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-850/80">
                <div className="flex flex-col md:flex-row gap-3 mb-4">
                  {/* Search input */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Pesquisar por nome, partido ou UF (ex: Arthur, PT, SP)..."
                      value={legislatorSearch}
                      onChange={(e) => setLegislatorSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Dropdown Filters */}
                  <div className="flex flex-wrap gap-2">
                    {/* Casa filter */}
                    <select
                      value={legislatorFilterType}
                      onChange={(e) => setLegislatorFilterType(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs rounded-xl py-2 px-3 text-slate-300 focus:border-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="ALL">Todas as Casas</option>
                      <option value="deputy">Câmara (Deputados)</option>
                      <option value="senator">Senado (Senadores)</option>
                    </select>

                    {/* Voto filter */}
                    <select
                      value={legislatorFilterVote}
                      onChange={(e) => setLegislatorFilterVote(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs rounded-xl py-2 px-3 text-slate-300 focus:border-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="ALL">Todos os Votos</option>
                      <option value="SIM">Votou SIM</option>
                      <option value="NÃO">Votou NÃO</option>
                      <option value="ABSTENÇÃO">Abstenção / Neutro</option>
                    </select>
                  </div>
                </div>

                {/* Scrollable table of legislators */}
                <div className="max-h-64 overflow-y-auto border border-slate-850 rounded-xl bg-slate-950">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-900 sticky top-0 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3 border-b border-slate-850">Parlamentar</th>
                        <th className="p-3 border-b border-slate-850">UF</th>
                        <th className="p-3 border-b border-slate-850">Lobby Principal</th>
                        <th className="p-3 border-b border-slate-850 text-right">Voto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {legislators
                        .filter(leg => {
                          const matchesSearch = leg.name.toLowerCase().includes(legislatorSearch.toLowerCase()) || 
                                                leg.party.toLowerCase().includes(legislatorSearch.toLowerCase()) ||
                                                leg.state.toLowerCase().includes(legislatorSearch.toLowerCase());
                          const matchesType = legislatorFilterType === "ALL" || leg.type === legislatorFilterType;
                          const matchesVote = legislatorFilterVote === "ALL" || leg.vote === legislatorFilterVote;
                          return matchesSearch && matchesType && matchesVote;
                        })
                        .slice(0, 100) // Render top 100 for great performance
                        .map((leg) => (
                          <tr 
                            key={leg.id}
                            onClick={() => setSelectedLegislator(leg)}
                            className={`hover:bg-slate-900/60 transition-all cursor-pointer ${
                              selectedLegislator?.id === leg.id ? "bg-indigo-950/20" : ""
                            }`}
                          >
                            <td className="p-3">
                              <div className="font-bold text-slate-200">{leg.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{leg.party} • {leg.type === "deputy" ? "Câmara" : "Senado"}</div>
                            </td>
                            <td className="p-3 font-mono text-slate-400">{leg.state}</td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                leg.baseLobby === "Distribuidoras" ? "bg-rose-950/40 text-rose-300" :
                                leg.baseLobby === "Big Techs" ? "bg-cyan-950/40 text-cyan-300" :
                                leg.baseLobby === "Agronegócio" ? "bg-amber-950/40 text-amber-300" :
                                leg.baseLobby === "Social/Clima" ? "bg-emerald-950/40 text-emerald-300" :
                                "bg-slate-900 text-slate-400"
                              }`}>
                                {leg.baseLobby}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                                leg.vote === "SIM" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                leg.vote === "NÃO" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                                "bg-slate-850 text-slate-400 border border-slate-800"
                              }`}>
                                {leg.vote}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {legislators.filter(leg => {
                    const matchesSearch = leg.name.toLowerCase().includes(legislatorSearch.toLowerCase()) || 
                                          leg.party.toLowerCase().includes(legislatorSearch.toLowerCase()) ||
                                          leg.state.toLowerCase().includes(legislatorSearch.toLowerCase());
                    const matchesType = legislatorFilterType === "ALL" || leg.type === legislatorFilterType;
                    const matchesVote = legislatorFilterVote === "ALL" || leg.vote === legislatorFilterVote;
                    return matchesSearch && matchesType && matchesVote;
                  }).length > 100 && (
                    <div className="p-3 text-center text-[10px] text-slate-500 bg-slate-900 font-mono">
                      Exibindo os primeiros 100 parlamentares correspondentes de {legislators.filter(leg => {
                        const matchesSearch = leg.name.toLowerCase().includes(legislatorSearch.toLowerCase()) || 
                                              leg.party.toLowerCase().includes(legislatorSearch.toLowerCase()) ||
                                              leg.state.toLowerCase().includes(legislatorSearch.toLowerCase());
                        const matchesType = legislatorFilterType === "ALL" || leg.type === legislatorFilterType;
                        const matchesVote = legislatorFilterVote === "ALL" || leg.vote === legislatorFilterVote;
                        return matchesSearch && matchesType && matchesVote;
                      }).length}. Use os filtros acima para refinar.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Individual Legislator Transparency Card (Col 4) */}
            <div className="lg:col-span-4 h-full">
              {selectedLegislator ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col justify-between h-full min-h-[460px]">
                  <div>
                    {/* Header with Tabs */}
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-4">
                      <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        Parlamentar {selectedLegislator.type === "deputy" ? "Deputado" : "Senador"}
                      </span>
                      <div className="flex gap-1.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setLegMsgActiveTab("dossier")}
                          className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            legMsgActiveTab === "dossier" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Dossiê
                        </button>
                        <button
                          type="button"
                          onClick={() => setLegMsgActiveTab("message")}
                          className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            legMsgActiveTab === "message" ? "bg-slate-800 text-cyan-400" : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          Mensagem
                        </button>
                      </div>
                    </div>

                    <h5 className="font-bold text-base text-white">{selectedLegislator.name}</h5>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-bold font-mono text-slate-300">
                        {selectedLegislator.party}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-bold font-mono text-slate-300">
                        UF: {selectedLegislator.state}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-bold font-mono text-slate-300">
                        {selectedLegislator.type === "deputy" ? "Câmara" : "Senado"}
                      </span>
                    </div>

                    {legMsgActiveTab === "dossier" ? (
                      <div className="mt-5 space-y-3.5">
                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block mb-0.5 uppercase">Lobby Corporativo Dominante</span>
                          <span className={`text-xs font-bold block ${
                            selectedLegislator.baseLobby === "Distribuidoras" ? "text-rose-400" :
                            selectedLegislator.baseLobby === "Big Techs" ? "text-cyan-400" :
                            selectedLegislator.baseLobby === "Agronegócio" ? "text-amber-400" :
                            selectedLegislator.baseLobby === "Social/Clima" ? "text-emerald-400" : "text-slate-300"
                          }`}>
                            {selectedLegislator.baseLobby === "Distribuidoras" && "🔌 Concessionárias de Energia (Oligopólio)"}
                            {selectedLegislator.baseLobby === "Big Techs" && "🤖 Lobby das Big Techs & AI Data Centers"}
                            {selectedLegislator.baseLobby === "Agronegócio" && "🌾 Bancada do Agronegócio (FPA)"}
                            {selectedLegislator.baseLobby === "Social/Clima" && "🌱 Clima / Defesa do Consumidor Solar"}
                            {selectedLegislator.baseLobby === "Fisiológico" && "🏛️ Bancada Centrista / Fisiológica"}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block mb-0.5 uppercase">Estímulo Financeiro Estimado</span>
                          <span className="text-xs font-mono font-bold text-slate-200">
                            {selectedLegislator.financialSupport}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] font-mono text-slate-400 block mb-0.5 uppercase">Motivação Real do Voto</span>
                          <p className="text-xs text-slate-400 leading-relaxed mt-1">
                            {selectedLegislator.vote === "ABSTENÇÃO" && "Aguardando o início da sessão nominal no plenário do Congresso."}
                            {selectedLegislator.vote === "SIM" && (
                              selectedLegislator.baseLobby === "Big Techs" ? "Votou favoravelmente com apoio do Consórcio de IA, que deseja sugar o excedente solar para Data Centers locais de alta demanda." :
                              selectedLegislator.baseLobby === "Social/Clima" ? "Apoiou a causa cívica da microgeração para baratear a conta de luz dos eleitores de baixa renda." :
                              selectedLegislator.baseLobby === "Agronegócio" ? "Votou sim após a bancada rústica fechar acordo de isenção tributária para geração em fazendas." :
                              selectedLegislator.baseLobby === "Fisiológico" ? "Seguiu o incentivo financeiro das Big Techs que prometeram investimentos massivos de IA em seu reduto eleitoral." :
                              "Cedeu à pressão popular orgânica nas redes sociais contra o 'arco-íris tarifário' da ANEEL."
                            )}
                            {selectedLegislator.vote === "NÃO" && (
                              selectedLegislator.baseLobby === "Distribuidoras" ? "Defendeu o faturamento do oligopólio tradicional das distribuidoras convencionais para barrar geradores autônomos." :
                              "Votou contra pressionado pelas distribuidoras locais, que temem perder receita com prossumidores domésticos."
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Seu Nome</span>
                            <input
                              type="text"
                              value={legMsgSenderName}
                              onChange={(e) => setLegMsgSenderName(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-[10px] rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Seu E-mail</span>
                            <input
                              type="email"
                              value={legMsgSenderEmail}
                              onChange={(e) => setLegMsgSenderEmail(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-[10px] rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Assunto do E-mail</span>
                          <input
                            type="text"
                            value={legMsgSubject}
                            onChange={(e) => setLegMsgSubject(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-[10px] rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Mensagem Oficial</span>
                          <textarea
                            value={legMsgBody}
                            onChange={(e) => setLegMsgBody(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-800 text-[10px] rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 leading-normal"
                          />
                        </div>

                        <button
                          type="button"
                          disabled={legMsgIsSending || !legMsgBody.trim()}
                          onClick={sendLegislatorMessage}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-1.5 px-3 rounded text-[10px] font-mono transition-all disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Send className="h-3 w-3" />
                          {legMsgIsSending ? "Enviando..." : "Enviar Mensagem Oficial"}
                        </button>

                        {/* Real-time Representative reply output */}
                        {legMsgResponse && (
                          <div className="mt-3.5 bg-slate-950 border border-cyan-500/20 rounded-lg p-3 text-[10px] font-sans space-y-2 shadow-inner">
                            <div className="flex justify-between items-center text-[8px] font-mono text-cyan-400 border-b border-slate-900 pb-1.5">
                              <span>De: Chefia de Gabinete</span>
                              <span>Para: {legMsgSenderEmail}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                              {legMsgResponse}
                            </p>
                            <div className="text-[8px] font-mono text-slate-500 pt-1 border-t border-slate-900/60 text-right">
                              Enviado para: {legMsgSentEmailAddress}
                            </div>
                          </div>
                        )}

                        {/* History of communications with this particular legislator */}
                        {legMsgHistory.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-slate-800">
                            <span className="text-[8px] font-mono font-bold text-slate-400 block mb-1.5 uppercase">Mensagens Enviadas Anteriores</span>
                            <div className="space-y-2">
                              {legMsgHistory.map((hist, hidx) => (
                                <div key={hist.id || hidx} className="bg-slate-950/40 border border-slate-800 p-2 rounded text-[9px] space-y-1">
                                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                                    <span>{new Date(hist.timestamp).toLocaleDateString("pt-BR")} às {new Date(hist.timestamp).toLocaleTimeString("pt-BR")}</span>
                                    <span>Assunto: {hist.subject}</span>
                                  </div>
                                  <p className="text-slate-400 line-clamp-2 italic">&quot;{hist.messageContent}&quot;</p>
                                  {hist.autoReply && (
                                    <div className="mt-1 border-t border-slate-900 pt-1 text-slate-300">
                                      <strong className="text-[8px] text-cyan-400 block font-mono">Resposta do Gabinete:</strong>
                                      <p className="line-clamp-2 text-slate-300 mt-0.5">&quot;{hist.autoReply}&quot;</p>
                                      <button 
                                        type="button" 
                                        onClick={() => {
                                          setLegMsgResponse(hist.autoReply);
                                          setLegMsgSentEmailAddress(hist.sentToEmail);
                                          setLegMsgBody(hist.messageContent);
                                        }}
                                        className="text-[8px] font-mono text-cyan-400 hover:underline mt-0.5 block"
                                      >
                                        Ver resposta completa
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">Registro de Voto</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      selectedLegislator.vote === "SIM" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                      selectedLegislator.vote === "NÃO" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                      "bg-slate-800 text-slate-400 border border-slate-700/50"
                    }`}>
                      {selectedLegislator.vote}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[350px]">
                  <Users className="h-10 w-10 text-slate-600 mb-2.5" />
                  <h5 className="text-xs font-bold text-slate-300">Auditoria Individual</h5>
                  <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-normal">
                    Selecione qualquer parlamentar no plenário (clique em um quadrado ou círculo colorido) ou na tabela para expor seus lobbies influenciadores, incentivos e justificativa de voto.
                  </p>
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
