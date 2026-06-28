import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Settings, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  FileCode, 
  User, 
  Calendar, 
  Hash, 
  AlignLeft, 
  Download, 
  RefreshCw,
  Scale,
  Compass,
  CheckCircle2,
  AlertCircle,
  Brain,
  Database,
  Search,
  Award,
  Zap,
  BookOpen,
  ArrowUpRight,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Definição dos tipos de documentos legislativos suportados
export type ProposalType = "PLO" | "PEC" | "REQ" | "EMD" | "PDL";

export interface LegislativeTemplate {
  type: ProposalType;
  label: string;
  badgeColor: string;
  badgeBg: string;
  borderColor: string;
  defaultTitle: string;
  defaultEmenta: string;
  defaultJustificativa: string;
  structure: (fields: {
    number: string;
    year: string;
    author: string;
    title: string;
    ementa: string;
    articles: string[];
    justificativa: string;
  }) => string;
}

const TEMPLATES: Record<ProposalType, LegislativeTemplate> = {
  PLO: {
    type: "PLO",
    label: "Projeto de Lei Ordinária (PLO)",
    badgeColor: "text-blue-700",
    badgeBg: "bg-blue-50 border-blue-100",
    borderColor: "border-blue-200",
    defaultTitle: "Lei Geral do Consumidor Solar e Armazenamento de LFP",
    defaultEmenta: "Dispõe sobre o direito de microgeradores residenciais de armazenarem excedente energético em baterias locais de fosfato de ferro-lítio (LFP) e realizarem a venda simplificada de sua produção descentralizada.",
    defaultJustificativa: "A presente lei ordinária visa dotar o consumidor de soberania sobre a energia por ele mesmo produzida, reduzindo a dependência de bandeiras tarifárias e o poder de monopólio das distribuidoras tradicionais.",
    structure: (f) => `PROJETO DE LEI ORDINÁRIA Nº ${f.number || "____"} DE ${f.year || "2026"}

(Do Sr./Sra. Deputado(a) / Proponente: ${f.author || "________________"})

${f.ementa || "Dispõe sobre o marco regulatório da energia distribuída."}

O Congresso Nacional decreta:

${f.articles.map((art, idx) => `Art. ${idx + 1}º ${art}`).join("\n\n")}

Art. ${f.articles.length + 1}º Esta Lei entra em vigor na data de sua publicação.

Sala das Sessões, ${new Date().toLocaleDateString("pt-BR")}.

--------------------------------------------------
JUSTIFICATIVA
--------------------------------------------------
${f.justificativa}

---
**Assinatura GOS3 de Integridade Regulatória:**
- Projeto: SELIX IA Legislative Tool
- Status: Pronto para Protocolo Geral`
  },
  PEC: {
    type: "PEC",
    label: "Proposta de Emenda à Constituição (PEC)",
    badgeColor: "text-purple-700",
    badgeBg: "bg-purple-50 border-purple-100",
    borderColor: "border-purple-200",
    defaultTitle: "PEC da Garantia do Acesso à Energia Limpa e Conectividade de IA",
    defaultEmenta: "Altera o art. 5º da Constituição Federal para incluir a segurança de abastecimento energético renovável e a conectividade digital de alta velocidade entre os direitos fundamentais do cidadão.",
    defaultJustificativa: "A revolução da Inteligência Artificial e a necessidade de descarbonização estrutural do PIB exigem proteção constitucional para garantir que o cidadão e a indústria de inovação tenham acesso ininterrupto a insumos elétricos e digitais modernos.",
    structure: (f) => `PROPOSTA DE EMENDA À CONSTITUIÇÃO Nº ${f.number || "____"} DE ${f.year || "2026"}

As Mesas da Câmara dos Deputados e do Senado Federal, nos termos do art. 60 da Constituição Federal, promulgam a seguinte Emenda ao texto constitucional:

Art. 1º O art. 5º da Constituição Federal passa a vigorar acrescido do seguinte inciso:

"Art. 5º ...
LXXX - é garantido a todos, como direito fundamental essencial ao desenvolvimento humano e tecnológico, o acesso à energia elétrica proveniente de fontes limpas e renováveis, bem como à infraestrutura de conectividade digital de alta velocidade e inteligência de dados." (NR)

Art. 2º Esta Emenda Constitucional entra em vigor na data de sua publicação.

Sala das Sessões, ${new Date().toLocaleDateString("pt-BR")}.

--------------------------------------------------
JUSTIFICATIVA
--------------------------------------------------
${f.justificativa}

---
**Assinatura GOS3 de Integridade Regulatória:**
- Projeto: SELIX IA Legislative Tool
- Status: PEC Formulada (Requer assinatura de 1/3 do Parlamento)`
  },
  REQ: {
    type: "REQ",
    label: "Requerimento Parlamentar de Audiência Pública (REQ)",
    badgeColor: "text-amber-700",
    badgeBg: "bg-amber-50 border-amber-100",
    borderColor: "border-amber-200",
    defaultTitle: "Audiência de Impacto das Big Techs no Equilíbrio do Grid Nacional",
    defaultEmenta: "Requer a realização de audiência pública na Comissão de Minas e Energia para debater as contrapartidas e investimentos de grandes provedores de Data Center em infraestrutura de transmissão elétrica.",
    defaultJustificativa: "A rápida instalação de infraestrutura computacional de IA consome volumes imensos de energia (visando o teto de 20.000 kWh/hab). É imperioso debater a justa divisão de investimentos no grid entre as corporações de tecnologia e as geradoras locais.",
    structure: (f) => `REQUERIMENTO DE AUDIÊNCIA PÚBLICA Nº ${f.number || "____"} DE ${f.year || "2026"}

Senhor(a) Presidente da Comissão de Minas e Energia,

Requeiro, nos termos regimentais, a convocação de Audiência Pública para debater o tema: "${f.title}".

Para tanto, sugere-se a convite dos seguintes especialistas e stakeholders:
1. Representante do Consórcio Nacional de Big Techs de IA;
2. Engenheiros eletricistas especialistas em modelagem de redes de transmissão;
3. Representante das associações de microgeradores e prossumidores de energia distribuída;
4. Diretores de Planejamento Energético do Ministério correspondente.

Sala das Comissões, ${new Date().toLocaleDateString("pt-BR")}.

${f.author || "________________"}
Deputado(a) / Proponente Autor

--------------------------------------------------
JUSTIFICATIVA
--------------------------------------------------
${f.justificativa}

---
**Assinatura GOS3 de Integridade Regulatória:**
- Projeto: SELIX IA Legislative Tool
- Status: Requerimento Formalizado`
  },
  EMD: {
    type: "EMD",
    label: "Emenda Modificativa de Projeto de Lei (EMD)",
    badgeColor: "text-emerald-700",
    badgeBg: "bg-emerald-50 border-emerald-100",
    borderColor: "border-emerald-200",
    defaultTitle: "Emenda sobre Transparência na Criptografia de Medidores Inteligentes",
    defaultEmenta: "Apresenta emenda ao projeto de lei sob análise, alterando o artigo de fiscalização para assegurar privacidade absoluta sobre os dados de rotina dos medidores domésticos de prossumidores.",
    defaultJustificativa: "Evitar que grandes concessionárias de energia comercializem ou utilizem de forma abusiva os dados de hábitos e de presença residencial dos cidadãos coletados pelos relógios conectados inteligentes.",
    structure: (f) => `EMENDA MODIFICATIVA Nº ${f.number || "____"} AO PROJETO DE LEI Nº ${f.year || "2026"}

Apresentamos a seguinte emenda modificativa ao texto sob análise:

Modifique-se o Art. 5º do referido Projeto de Lei, o qual passa a ter a seguinte redação:

"Art. 5º Todos os relógios medidores inteligentes de microgeração solar deverão utilizar criptografia ponta a ponta, sendo de propriedade exclusiva do consumidor o controle sobre as estatísticas de uso doméstico e rotina, cuja cessão a terceiros requer autorização expressa em conformidade com as diretrizes gerais de proteção de dados." (NR)

Sala das Sessões, ${new Date().toLocaleDateString("pt-BR")}.

${f.author || "________________"}
Autor(a) da Emenda

--------------------------------------------------
JUSTIFICATIVA
--------------------------------------------------
${f.justificativa}

---
**Assinatura GOS3 de Integridade Regulatória:**
- Projeto: SELIX IA Legislative Tool
- Status: Emenda de Plenário Pronta`
  },
  PDL: {
    type: "PDL",
    label: "Projeto de Decreto Legislativo (PDL)",
    badgeColor: "text-rose-700",
    badgeBg: "bg-rose-50 border-rose-100",
    borderColor: "border-rose-200",
    defaultTitle: "PDL de Sustação das Penalidades da ANEEL para Painéis Solares",
    defaultEmenta: "Susta os efeitos de dispositivos de resoluções de órgãos agenciadores reguladores que instituem a cobrança abusiva de encargos sobre energia limpa excedente comercializada.",
    defaultJustificativa: "As agências reguladoras extrapolaram de suas prerrogativas executivas ao impor taxas e restrições retroativas sobre geradores residenciais distribuídos, ferindo o princípio do direito adquirido e o pacto de descarbonização nacional.",
    structure: (f) => `PROJETO DE DECRETO LEGISLATIVO Nº ${f.number || "____"} DE ${f.year || "2026"}

O Congresso Nacional decreta:

Art. 1º Ficam sustados, com fulcro no art. 49, inciso V, da Constituição Federal, os efeitos dos dispositivos da Resolução de Regulação que impõem encargos de tráfego sobre a compensação física de microgeração de eletricidade residencial.

Art. 2º Este Decreto Legislativo entra em vigor na data de sua publicação.

Sala das Sessões, ${new Date().toLocaleDateString("pt-BR")}.

${f.author || "________________"}
Deputado(a) / Proponente Autor

--------------------------------------------------
JUSTIFICATIVA
--------------------------------------------------
${f.justificativa}

---
**Assinatura GOS3 de Integridade Regulatória:**
- Projeto: SELIX IA Legislative Tool
- Status: PDL Preparado`
  }
};

export default function LegislativeProposalManager() {
  const [selectedType, setSelectedType] = useState<ProposalType>("PLO");
  const [proposalNumber, setProposalNumber] = useState<string>("");
  const [proposalYear, setProposalYear] = useState<string>("2026");
  const [author, setAuthor] = useState<string>("Consórcio de Prossumidores e Big Techs");
  
  // Dynamic fields
  const [title, setTitle] = useState<string>("");
  const [ementa, setEmenta] = useState<string>("");
  const [justificativa, setJustificativa] = useState<string>("");
  
  // List of articles
  const [articles, setArticles] = useState<string[]>([
    "Fica garantida a livre comercialização de excedente energético gerado em sistemas de microgeração solar residencial.",
    "Proíbe-se a imposição de quaisquer encargos discriminatórios sobre a distribuição física de energia limpa produzida de forma independente.",
    "As baterias estacionárias e sistemas de LFP domésticos integrados terão isenção total de impostos de importação e ICMS de circulação."
  ]);
  const [newArticleText, setNewArticleText] = useState<string>("");

  // States for e-Cidadania Analysis & RAG Calibration
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"ecidadania" | "rag">("ecidadania");
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [alignmentScore, setAlignmentScore] = useState<number>(74);
  const [calibrationLogs, setCalibrationLogs] = useState<string[]>([]);

  // Simulated aligned e-Cidadania Ideas Database (Brazilian Senate)
  const [ecidadaniaIdeas] = useState([
    {
      id: "Ideia 124.582",
      title: "Isenção total de impostos para baterias de armazenamento solar residencial e comercial",
      votes: 14230,
      status: "Em Apoio",
      sentiment: "Altamente Positivo",
      relevance: "Forte impacto na isenção tributária de LFP doméstica"
    },
    {
      id: "Ideia 139.102",
      title: "Permissão de venda livre de excedente solar descentralizado diretamente entre vizinhos (Grid Local)",
      votes: 21504,
      status: "Enviado à CDH (Comissão)",
      sentiment: "Crítico",
      relevance: "Gerou o Rito de Sugestão Legislativa (SUG) para venda livre"
    },
    {
      id: "Ideia 110.420",
      title: "Proibição de taxas retroativas sobre microgeração solar distribuída (Anulação da Taxação do Sol)",
      votes: 38112,
      status: "Transformado em PL / Lei 14.300",
      sentiment: "Consensual",
      relevance: "Marco Legal da GD. Base de imunidade contra taxas retroativas"
    },
    {
      id: "Ideia 115.309",
      title: "Criação do Marco de Data Centers Verdes integrados a cooperativas solares comunitárias",
      votes: 8410,
      status: "Em Apoio",
      sentiment: "Inovador",
      relevance: "Apoia o teto de 20.000 kWh/hab para Inteligência Artificial"
    }
  ]);

  const handleRunCalibration = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    setCalibrationProgress(0);
    setCalibrationLogs([]);
    
    const logs = [
      "🤖 Iniciando Calibrador RAG Legislativo GOS3...",
      "🔍 Recuperando Ideias Populares no e-Cidadania (110.420, 139.102)...",
      "📚 Analisando precedentes do Marco Legal da GD (Lei nº 14.300/2022) e Resoluções ANEEL...",
      "⚖️ Verificando compatibilidade constitucional (Prerrogativa Federal de Energia - CF, Art. 22, IV)...",
      "✍️ Ajustando sintaxe em conformidade com o Manual de Redação da Presidência...",
      "✨ Incorporando Salvaguardas Regulatórias no rascunho de forma harmônica!"
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logs.length) {
        setCalibrationLogs(prev => [...prev, logs[currentStep]]);
        setCalibrationProgress(Math.floor(((currentStep + 1) / logs.length) * 100));
        currentStep++;
      } else {
        clearInterval(interval);
        setIsCalibrating(false);
        setIsCalibrated(true);
        setAlignmentScore(96);
        
        // Append a calibrated article for absolute legal safety
        const calibratedClause = "Fica assegurado que os microgeradores dotados de armazenamento local de LFP operam sob imunidade de cobrança de encargos de tráfego físico de rede até a amortização integral dos ativos de transição.";
        if (!articles.includes(calibratedClause)) {
          setArticles(prev => [...prev, calibratedClause]);
        }
        triggerToast("RAG Fine-Tuning completo! Cláusula de Salvaguarda adicionada com sucesso.");
      }
    }, 900);
  };

  const [generatedText, setGeneratedText] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEditingRaw, setIsEditingRaw] = useState<boolean>(false);
  const [rawText, setRawText] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize fields with templates
  useEffect(() => {
    const template = TEMPLATES[selectedType];
    setTitle(template.defaultTitle);
    setEmenta(template.defaultEmenta);
    setJustificativa(template.defaultJustificativa);
    
    // Default proposal number
    const randomNum = Math.floor(Math.random() * 800) + 100;
    setProposalNumber(randomNum.toString());
  }, [selectedType]);

  // Regenerate draft output when inputs change
  useEffect(() => {
    const template = TEMPLATES[selectedType];
    const generated = template.structure({
      number: proposalNumber,
      year: proposalYear,
      author,
      title,
      ementa,
      articles,
      justificativa
    });
    setGeneratedText(generated);
    setRawText(generated);
  }, [selectedType, proposalNumber, proposalYear, author, title, ementa, articles, justificativa]);

  const handleAddArticle = () => {
    if (!newArticleText.trim()) return;
    setArticles([...articles, newArticleText.trim()]);
    setNewArticleText("");
    triggerToast("Artigo adicionado com sucesso!");
  };

  const handleRemoveArticle = (index: number) => {
    if (articles.length <= 1) {
      triggerToast("O projeto deve conter ao menos um artigo principal.");
      return;
    }
    setArticles(articles.filter((_, idx) => idx !== index));
    triggerToast("Artigo removido!");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = () => {
    const textToCopy = isEditingRaw ? rawText : generatedText;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    triggerToast("Texto legislativo copiado com sucesso!");
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleDownload = () => {
    const textToSave = isEditingRaw ? rawText : generatedText;
    const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proposta_${selectedType.toLowerCase()}_${proposalNumber}_${proposalYear}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast("Arquivo baixado com sucesso!");
  };

  const handleResetToTemplate = () => {
    const template = TEMPLATES[selectedType];
    setTitle(template.defaultTitle);
    setEmenta(template.defaultEmenta);
    setJustificativa(template.defaultJustificativa);
    setArticles([
      "Fica garantida a livre comercialização de excedente energético gerado em sistemas de microgeração solar residencial.",
      "Proíbe-se a imposição de quaisquer encargos discriminatórios sobre a distribuição física de energia limpa produzida de forma independente.",
      "As baterias estacionárias e sistemas de LFP domésticos integrados terão isenção total de impostos de importação e ICMS de circulação."
    ]);
    setIsEditingRaw(false);
    triggerToast("Campos resetados para o padrão do template!");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm mt-8" id="proposal-manager-dashboard">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider font-mono block mb-1">
            Novo Assistente do Framework Racional
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="h-6 w-6 text-indigo-600" />
            Legislative Proposal Manager
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Selecione o instrumento jurídico correto, ajuste parâmetros e construa rascunhos parlamentares formais formatados para embasamento de lobbies de interesse público.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleResetToTemplate}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold py-2 px-3 rounded-xl transition-all border border-slate-200/60 cursor-pointer"
            title="Resetar campos"
          >
            <RefreshCw className="h-4 w-4" />
            Limpar Parâmetros
          </button>
        </div>
      </div>

      {/* Grid: Form Left (5/12) & Draft Output Right (7/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coluna Esquerda: Formulário e Configuração */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Seletor de Tipo */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
              1. Tipo de Instrumento Legislativo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(TEMPLATES).map((tmpl) => (
                <button
                  key={tmpl.type}
                  onClick={() => setSelectedType(tmpl.type)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedType === tmpl.type
                      ? "bg-slate-950 text-white border-slate-950 shadow-md shadow-slate-950/10"
                      : "bg-white text-slate-800 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border mb-2 inline-block ${
                    selectedType === tmpl.type
                      ? "bg-slate-800 border-slate-700 text-slate-200"
                      : `${tmpl.badgeBg} ${tmpl.badgeColor}`
                  }`}>
                    {tmpl.type}
                  </span>
                  <span className="text-xs font-bold leading-tight block">{tmpl.label.split(" (")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dados de Metadados Básicos */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-slate-200/50 pb-1.5">
              2. Metadados do Protocolo
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 font-mono block mb-1">Número</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={proposalNumber}
                    onChange={(e) => setProposalNumber(e.target.value)}
                    placeholder="Ex: 145"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 font-mono block mb-1">Ano Legislativo</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={proposalYear}
                    onChange={(e) => setProposalYear(e.target.value)}
                    placeholder="Ex: 2026"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 font-mono block mb-1">Proponente</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Autor do projeto"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Título e Justificativa Básica */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 font-mono block mb-1">Título do Projeto</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome do projeto de lei..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 font-mono block mb-1">Ementa / Texto de Abertura</label>
                <textarea
                  value={ementa}
                  onChange={(e) => setEmenta(e.target.value)}
                  rows={2}
                  placeholder="Texto oficial que resume a lei..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-slate-400 leading-normal"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 font-mono block mb-1">Fundamentação e Justificativa</label>
                <textarea
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  rows={3}
                  placeholder="Por que esta proposta é relevante?"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-slate-400 leading-normal"
                />
              </div>
            </div>

          </div>

          {/* Seção 3: Construção Dinâmica de Artigos */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block border-b border-slate-200/50 pb-1.5 mb-3">
              3. Redação dos Artigos do Projeto ({articles.length})
            </span>

            <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
              {articles.map((art, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-white p-2.5 rounded-xl border border-slate-100 text-xs">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    Art. {idx + 1}º
                  </span>
                  <p className="flex-1 text-slate-700 leading-relaxed text-[11px]">{art}</p>
                  <button
                    onClick={() => handleRemoveArticle(idx)}
                    className="text-slate-400 hover:text-red-500 text-xs font-bold font-mono px-1 cursor-pointer"
                    title="Excluir este artigo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add Article Inline */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newArticleText}
                onChange={(e) => setNewArticleText(e.target.value)}
                placeholder="Redija o texto de mais um artigo..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
              <button
                onClick={handleAddArticle}
                className="bg-slate-950 text-white rounded-xl px-3 py-2 text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

        </div>

        {/* Coluna Direita: Preview e Gerenciamento do Rascunho */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          <div className="flex-1 flex flex-col border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm">
            
            {/* Top Bar of Editor */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white text-xs font-mono">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-indigo-400" />
                <span className="font-bold">DOCUMENTO FORMAL GERADO</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditingRaw(!isEditingRaw)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                    isEditingRaw 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {isEditingRaw ? "✓ Modo Livre" : "✏️ Editar Livre"}
                </button>
              </div>
            </div>

            {/* Main Draft Area */}
            {isEditingRaw ? (
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full h-full min-h-[460px] bg-slate-950 text-slate-100 p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none custom-scrollbar"
                spellCheck="false"
              />
            ) : (
              <div className="w-full h-full min-h-[460px] bg-slate-950 text-slate-100 p-5 font-mono text-xs leading-relaxed overflow-y-auto custom-scrollbar select-text">
                {generatedText.split("\n").map((line, idx) => {
                  if (line.startsWith("PROJETO") || line.startsWith("PROPOSTA") || line.startsWith("REQUERIMENTO") || line.startsWith("EMENDA")) {
                    return <h1 key={idx} className="text-sm font-bold text-indigo-400 mt-2 mb-4 border-b border-indigo-950/40 pb-1.5">{line}</h1>;
                  }
                  if (line.startsWith("---") || line.startsWith("-----------------")) {
                    return <div key={idx} className="border-t border-slate-800 my-4"></div>;
                  }
                  if (line.startsWith("JUSTIFICATIVA")) {
                    return <h3 key={idx} className="text-xs font-bold text-white uppercase tracking-wider mb-2">{line}</h3>;
                  }
                  if (line.startsWith("Art.")) {
                    return <p key={idx} className="my-2.5 text-slate-200"><strong className="text-white">{line.split(" ")[0]} {line.split(" ")[1]}</strong> {line.split(" ").slice(2).join(" ")}</p>;
                  }
                  return <p key={idx} className="my-1 text-slate-300 min-h-[1.25rem]">{line}</p>;
                })}
              </div>
            )}

            {/* Bottom Bar Controls */}
            <div className="bg-slate-50 border-t border-slate-100 px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5" />
                Soberania e Métricas Alinhadas ao GOS3
              </span>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {isCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {isCopied ? "Copiado!" : "Copiar Texto"}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all cursor-pointer border border-slate-800"
                >
                  <Download className="h-4 w-4 text-indigo-400" />
                  Salvar (.TXT)
                </button>
              </div>
            </div>

          </div>

          {/* Estudo e-Cidadania & Otimizador RAG / Fine-Tuning */}
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-850 p-5 lg:p-6 shadow-xl space-y-5" id="study-rag-tuning-panel">
            
            {/* Header com os botões de Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-0.5">
                  Estudo de Admissibilidade & Alinhamento
                </span>
                <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-indigo-400" />
                  RAG & e-Cidadania Alignment Study
                </h4>
              </div>
              
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  onClick={() => setActiveAnalysisTab("ecidadania")}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeAnalysisTab === "ecidadania"
                      ? "bg-slate-800 text-white shadow"
                      : "text-slate-400 hover:text-slate-250"
                  }`}
                >
                  <Search className="h-3 w-3" />
                  e-Cidadania
                </button>
                <button
                  onClick={() => setActiveAnalysisTab("rag")}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeAnalysisTab === "rag"
                      ? "bg-slate-800 text-white shadow"
                      : "text-slate-400 hover:text-slate-250"
                  }`}
                >
                  <Zap className="h-3 w-3 text-yellow-400" />
                  Otimizador RAG
                </button>
              </div>
            </div>

            {/* TAB 1: e-Cidadania Aligned Ideas */}
            {activeAnalysisTab === "ecidadania" && (
              <div className="space-y-4">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Pesquisa de ideias legislativas populares ativas ou convertidas em lei no portal <strong>e-Cidadania do Senado Federal</strong>. Nossas propostas possuem forte aderência com as maiores demandas de voto popular da história do portal:
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {ecidadaniaIdeas.map((idea) => (
                    <div key={idea.id} className="bg-slate-950 rounded-xl border border-slate-850 p-3 hover:border-slate-800 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-[9px] font-mono font-bold bg-slate-900 border border-slate-850 text-indigo-300 px-1.5 py-0.5 rounded">
                          {idea.id}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          idea.status.includes("PL") 
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60" 
                            : "bg-slate-900 text-slate-300 border border-slate-850"
                        }`}>
                          {idea.status}
                        </span>
                      </div>
                      <h5 className="text-[11px] font-bold text-white leading-snug">{idea.title}</h5>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-900 flex items-center justify-between gap-2 text-[9px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Award className="h-3 w-3 text-amber-500" />
                          <strong>{idea.votes.toLocaleString()}</strong> apoios
                        </span>
                        <span className="text-indigo-400 truncate max-w-[190px]">
                          {idea.relevance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 rounded-xl p-3 border border-slate-850 text-[11px] text-slate-300 flex gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Conclusão do Estudo:</strong> Ideias de energia distribuída que tocam na proibição de taxas retroativas (como a SUG que influenciou a Lei 14.300) têm <strong>3x mais chances</strong> de engajamento popular e admissão parlamentar célere.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: RAG Fine-Tuning Simulator */}
            {activeAnalysisTab === "rag" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                  <div>
                    <span className="text-[10px] font-mono text-slate-450 block">Score de Admissibilidade</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className={`text-xl font-black ${isCalibrated ? "text-emerald-400" : "text-amber-500"}`}>
                        {alignmentScore}%
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {isCalibrated ? "Altamente Admissível (Risco Mínimo)" : "Admissibilidade Moderada (Risco de Veto CCJ)"}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRunCalibration}
                    disabled={isCalibrating}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCalibrating
                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                        : isCalibrated
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15"
                    }`}
                  >
                    {isCalibrating ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Ajustando...
                      </>
                    ) : isCalibrated ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-white" />
                        Calibrado!
                      </>
                    ) : (
                      <>
                        <Zap className="h-3 w-3 text-yellow-300" />
                        Calibrar RAG
                      </>
                    )}
                  </button>
                </div>

                {/* Progress bar */}
                {isCalibrating && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                      <span>Indexando bases constitucionais...</span>
                      <span>{calibrationProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${calibrationProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Calibration Logs */}
                <div className="bg-slate-950 rounded-xl border border-slate-850 p-3 font-mono text-[9px] text-slate-300 space-y-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
                  {calibrationLogs.length === 0 ? (
                    <p className="text-slate-500 italic text-center py-2">Nenhum log de fine-tuning executado ainda. Clique em &apos;Calibrar RAG&apos; para sincronizar com precedentes aprovados.</p>
                  ) : (
                    calibrationLogs.map((log, idx) => (
                      <p key={idx} className="leading-relaxed">{log}</p>
                    ))
                  )}
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-slate-850/50 flex gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Análise de Risco Regulatório:</strong>
                    <p className="mt-0.5 text-slate-400 text-[10px]">
                      {isCalibrated 
                        ? "Sucesso: O fine-tuning adicionou uma Cláusula de Salvaguarda Federativa invocando o art. 22, IV da CF/88, impedindo questionamentos de bitributação ou usurpação de competência da União."
                        : "Alerta: O rascunho atual carece de salvaguardas explícitas contra decretos executivos estaduais de ICMS. Execute a calibração RAG para gerar o texto corretivo."}
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Floating local toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs py-2.5 px-4 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 max-w-sm pointer-events-auto">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
