import React, { useState, useMemo } from "react";
import { 
  FileText, 
  Send, 
  Share2, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Building2, 
  Sparkles, 
  Megaphone, 
  UserCheck, 
  ArrowRight,
  Scale,
  RotateCcw,
  Users,
  Briefcase,
  Layers,
  FileCode,
  CheckSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Definição dos Modelos de Proposta
export interface ProposalModel {
  id: string;
  name: string;
  category: "sugestao" | "projeto" | "requerimento" | "emenda";
  description: string;
  template: string;
}

const PROPOSAL_MODELS: ProposalModel[] = [
  {
    id: "sugestao_cidada",
    name: "Formulário de Encaminhamento de Sugestão",
    category: "sugestao",
    description: "Sugestão legislativa apresentada por cidadãos, associações ou entidades de classe via Comissão de Legislação Participativa (CLP).",
    template: `SUGESTÃO LEGISLATIVA Nº ___ DE 2026

À Comissão de Legislação Participativa da Câmara dos Deputados

Assunto: Sugestão para fomento da microgeração distribuída de energia solar e direito de livre transição de excedente energético.

Proponente: Consórcio Nacional de Prossumidores e Usuários de Energia Solar

TEXTO SUGERIDO:
Art. 1º Esta lei regula o direito do cidadão e de pequenas empresas de gerarem energia renovável, armazenarem em baterias locais de fosfato de ferro-lítio (LFP) e negociarem diretamente seu excedente energético com terceiros ou redes industriais de processamento de dados (Data Centers), sem a incidência de tarifas de pedágio ou restrições das concessionárias locais de energia.

Art. 2º Fica instituída a tarifa flat de trânsito energético interestadual para microgeradores residenciais, extinguindo o sistema de bandeiras tarifárias para autoprodutores verdes.

Art. 3º As concessionárias de distribuição de energia são obrigadas a realizar a homologação simplificada de novos painéis em até 5 dias úteis, sob pena de multa diária.

JUSTIFICATIVA:
A presente sugestão visa democratizar o acesso à matriz energética nacional, descentralizando a produção de eletricidade e combatendo o oligopólio das distribuidoras tradicionais. Com a expansão do consumo por Data Centers e inteligência artificial de alta escala, o livre comércio de excedentes incentiva o investimento privado doméstico, barateia a conta do cidadão e aumenta a segurança do grid.`
  },
  {
    id: "pl_ordinaria",
    name: "Projeto de Lei Ordinária (PL)",
    category: "projeto",
    description: "Iniciativa padrão de deputados ou senadores para legislar sobre normas ordinárias do sistema tarifário e de microgeração.",
    template: `PROJETO DE LEI ORDINÁRIA Nº ___ DE 2026

(Do Sr./Sra. Deputado/Senador)

Institui o Marco Regulatório da Livre Transição Energética e dá outras providências.

O Congresso Nacional decreta:

Art. 1º Fica assegurada a livre negociação de excedente de energia elétrica proveniente de micro e minigeração distribuída por pessoas físicas e jurídicas no âmbito do Sistema Interligado Nacional (SIN).

Art. 2º Proíbe-se a imposição de encargos de distribuição (fio B) ou adicionais de bandeiras tarifárias sobre o volume de energia limpa compensado ou transacionado de forma direta.

Art. 3º Esta lei entra em vigor na data de sua publicação.

JUSTIFICATIVA:
Este projeto promove a descentralização sustentável e a liberdade de escolha do consumidor, incentivando investimentos em painéis solares e barateando custos operacionais corporativos e residenciais.`
  },
  {
    id: "pl_complementar",
    name: "Projeto de Lei Complementar (PLP)",
    category: "projeto",
    description: "Projeto que exige quórum qualificado (maioria absoluta) para alterar regras tributárias nacionais de energia e federação.",
    template: `PROJETO DE LEI COMPLEMENTAR Nº ___ DE 2026

Regulamenta o parágrafo único do art. 155 da Constituição para vedar a cobrança de ICMS sobre a circulação física de excedente energético residencial.

O Congresso Nacional decreta:

Art. 1º Esta Lei Complementar estabelece normas gerais relativas às garantias de não-tributação sobre a transmissão de energia solar distribuída.

Art. 2º Fica isenta do Imposto sobre Circulação de Mercadorias e Serviços (ICMS) a transmissão física do excedente de energia elétrica injetada na rede de distribuição por microgerador residencial até o limite de 10.000 kWh/mês.

Art. 3º Os Estados pactuarão compensações por meio de incentivos em infraestrutura de transmissão de alta tensão.

JUSTIFICATIVA:
A unificação tributária impede o estrangulamento fiscal dos estados ao mesmo tempo em que blinda os prossumidores da bitributação de energia limpa gerada localmente.`
  },
  {
    id: "decreto_legislativo",
    name: "Projeto de Decreto Legislativo (PDL)",
    category: "projeto",
    description: "Proposta para sustar ou rever atos e resoluções normativas excessivas da ANEEL que oneram o prossumidor.",
    template: `PROJETO DE DECRETO LEGISLATIVO Nº ___ DE 2026

Susta os efeitos da Resolução Normativa nº XXX da Agência Nacional de Energia Elétrica (ANEEL), que restringe o desconto tarifário para microgeradores solares.

O Congresso Nacional decreta:

Art. 1º Ficam sustados os efeitos da Resolução Normativa nº XXX da ANEEL, que restabelece cobranças tributárias adicionais sobre a rede de microgeração.

Art. 2º Este decreto legislativo entra em vigor na data de sua publicação.

JUSTIFICATIVA:
A ANEEL exorbitou de seu poder regulamentar ao onerar retroativamente contratos de energia solar distribuída vigentes, violando a segurança jurídica dos investimentos.`
  },
  {
    id: "resolucao",
    name: "Projeto de Resolução (PR)",
    category: "projeto",
    description: "Regula o funcionamento interno de comissões temáticas de acompanhamento energético no Congresso.",
    template: `PROJETO DE RESOLUÇÃO Nº ___ DE 2026

Cria a Comissão Especial de Acompanhamento da Transição Energética e Eficiência Tecnológica de Inteligência Artificial na Câmara dos Deputados.

A Câmara dos Deputados resolve:

Art. 1º Fica criada a Comissão Especial destinada a analisar e sugerir diretrizes para o suprimento de energia renovável aos Data Centers de IA e infraestrutura crítica.

JUSTIFICATIVA:
A explosão tecnológica exige uma resposta rápida do legislativo para alinhar segurança energética, geração solar descentralizada e atração de investimentos globais.`
  },
  {
    id: "audiencia_publica",
    name: "Requerimento de Audiência Pública",
    category: "requerimento",
    description: "Requer debate aberto e transparente entre o lobby de Big Techs, distribuidoras convencionais e a sociedade civil.",
    template: `REQUERIMENTO DE AUDIÊNCIA PÚBLICA

Requer a realização de Audiência Pública para debater os impactos tributários e de rede do PL do Excedente Energético.

Senhor Presidente da Comissão de Minas e Energia,

Requeiro a convocação de audiência pública com a presença de representantes da ABRADEE (distribuidoras), do Consórcio de Big Techs de IA, de associações de energia solar e de especialistas acadêmicos em engenharia elétrica.

JUSTIFICATIVA:
O debate multipartidário assegura que os limites técnicos e econômicos da rede sejam pactuados de forma transparente, mitigando resistências corporativas.`
  },
  {
    id: "depoimento",
    name: "Requerimento de Depoimento",
    category: "requerimento",
    description: "Solicita o depoimento formal de técnicos reguladores para explicar os atrasos em homologações solares.",
    template: `REQUERIMENTO DE DEPOIMENTO

Requer o depoimento do Diretor-Geral da ANEEL para prestar esclarecimentos sobre atrasos sistemáticos na homologação de conexões distribuídas residenciais.

Senhor Presidente,

Solicitamos o depoimento técnico da autoridade reguladora para elucidar as denúncias de lobby protelatório por concessionárias de distribuição.

JUSTIFICATIVA:
Garantir a transparência administrativa nas agências reguladoras é essencial para coibir comportamentos anticoncorrenciais no mercado de energia.`
  },
  {
    id: "convocacao",
    name: "Requerimento de Convocação",
    category: "requerimento",
    description: "Convocação formal de Ministro de Estado para prestar contas sobre a segurança de transmissão contra apagões.",
    template: `REQUERIMENTO DE CONVOCAÇÃO

Convoca o Ministro de Estado de Minas e Energia para prestar informações sobre o plano de contingência para as linhas de transmissão e expansão de baterias de LFP.

Senhor Presidente,

Com fulcro no art. 50 da Constituição Federal, convoco o titular da pasta para detalhar a estratégia nacional de redundância elétrica.

JUSTIFICATIVA:
A modernização da infraestrutura do grid é prioritária para absorver o fluxo intermitente da geração solar distribuída sem causar colapsos térmicos na rede de alta tensão.`
  },
  {
    id: "informacao",
    name: "Requerimento de Informação",
    category: "requerimento",
    description: "Exige o envio imediato de dados oficiais de perdas comerciais e subsídios fornecidos ao cartel de energia convencional.",
    template: `REQUERIMENTO DE INFORMAÇÃO

Exige do Ministério de Minas e Energia o detalhamento de subsídios concedidos ao setor termoelétrico fóssil nos últimos 5 anos.

Excelentíssimo Senhor Presidente da Mesa,

Requeiro informações sobre os montantes fiscais destinados à queima de carvão e óleo diesel para acionamento de termoelétricas.

JUSTIFICATIVA:
A sociedade civil necessita contrastar as barreiras impostas à microgeração limpa contra os massivos incentivos concedidos à geração suja e ineficiente.`
  },
  {
    id: "indicacao",
    name: "Requerimento de Indicação",
    category: "requerimento",
    description: "Sugere ao Executivo a implementação imediata de isenção de impostos de importação sobre células de LFP.",
    template: `REQUERIMENTO DE INDICAÇÃO Nº ___ DE 2026

Sugere ao Poder Executivo, por intermédio do Ministério da Fazenda, a redução a zero da alíquota do Imposto de Importação sobre acumuladores de bateria de fosfato de ferro-lítio (LFP).

Senhor Presidente,

Indico ao Poder Executivo que adote medidas de incentivo tributário aduaneiro para baterias de armazenamento residencial de energia.

JUSTIFICATIVA:
O armazenamento doméstico estabiliza a flutuação diária do grid, reduzindo a dependência de usinas térmicas caras e poluentes nos horários de pico.`
  },
  {
    id: "emenda_geral",
    name: "Emendas a projetos de lei em geral",
    category: "emenda",
    description: "Emenda modificativa para resguardar a soberania e direito à privacidade de dados nos relógios inteligentes dos prossumidores.",
    template: `EMENDA MODIFICATIVA AO PL DO EXCEDENTE ENERGÉTICO

Modifica o Art. 5º do PL sob análise.

Onde se lê:
"Art. 5º Os medidores inteligentes registrarão todo tráfego de dados e preferências de consumo de forma centralizada."

Leia-se:
"Art. 5º Os medidores inteligentes criptografarão ponta a ponta todos os dados de consumo de energia, sendo vedada a comercialização de relatórios individuais sem autorização expressa do consumidor."

JUSTIFICATIVA:
Preservar o direito constitucional à privacidade e impedir que grandes monopólios de dados monitorem de forma invasiva a rotina diária das residências.`
  }
];

interface LegislativePortalProps {
  onApprovalInfluence?: (chamberDelta: number, senateDelta: number) => void;
}

interface StakeholderData {
  role: string;
  color: string;
  message: string;
  value: string;
}

export default function LegislativePortal({ onApprovalInfluence }: LegislativePortalProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>("sugestao_cidada");
  const [proposalTitle, setProposalTitle] = useState<string>("Marco Regulatório do Consumidor Solar e Livre Transição");
  const [proponent, setProponent] = useState<string>("Consórcio Nacional de Prossumidores");
  const [draftContent, setDraftContent] = useState<string>(PROPOSAL_MODELS[0].template);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Estados da simulação legislativa
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStep, setSubmissionStep] = useState<number>(0); // 0: idle, 1: protocol, 2: CLP eval, 3: approved CLP -> conversion, 4: distributed to congress floors
  const [clpVoteResult, setClpVoteResult] = useState<{ sim: number; nao: number } | null>(null);
  const [finalBillNumber, setFinalBillNumber] = useState<string>("");

  const selectedModel = useMemo(() => {
    return PROPOSAL_MODELS.find(m => m.id === selectedModelId) || PROPOSAL_MODELS[0];
  }, [selectedModelId]);

  const handleSelectModel = (id: string) => {
    setSelectedModelId(id);
    const model = PROPOSAL_MODELS.find(m => m.id === id);
    if (model) {
      setDraftContent(model.template);
      // Extrai um título apropriado baseado no modelo
      setProposalTitle(model.name);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftContent);
    setIsCopied(true);
    triggerToast("Texto copiado para a área de transferência!");
    setTimeout(() => setIsCopied(false), 3000);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 4000);
  };

  // Simulação interativa de submissão ao congresso
  const handleStartSubmission = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionStep(1);
    
    // Etapa 1: Protocolização (1.5 segundos)
    setTimeout(() => {
      setSubmissionStep(2);
      
      // Etapa 2: Avaliação técnica na CLP (Comissão de Legislação Participativa)
      // Como o usuário submeteu uma proposta cívica, ela realisticamente precisa passar pela CLP antes de virar PL
      setTimeout(() => {
        const simVotes = Math.floor(Math.random() * 12) + 18; // 18 a 29
        const naoVotes = 34 - simVotes;
        setClpVoteResult({ sim: simVotes, nao: naoVotes });
        setSubmissionStep(3);

        // Etapa 3: Conversão em Projeto de Lei oficial
        setTimeout(() => {
          const randomPlNum = Math.floor(Math.random() * 9000) + 1000;
          setFinalBillNumber(`PL nº ${randomPlNum}/2026`);
          setSubmissionStep(4);
          
          // Aplica influência de suporte no Congresso principal
          if (onApprovalInfluence) {
            // Um projeto bem redigido gera mobilização social e melhora a articulação
            onApprovalInfluence(8, 6);
          }

          setIsSubmitting(false);
          triggerToast("Proposta submetida com sucesso ao Plenário do Congresso!");
        }, 3000);

      }, 3000);

    }, 1500);
  };

  const handleResetSimulation = () => {
    setSubmissionStep(0);
    setClpVoteResult(null);
    setFinalBillNumber("");
    setIsSubmitting(false);
  };

  // Geração de Mensagens customizadas para Stakeholders e Lobby
  const stakeholderAnalysis: Record<string, StakeholderData> = useMemo(() => {
    return {
      prosumer: {
        role: "Prossumidores e Cidadãos",
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        message: `📢 *ATENÇÃO PROSSUMIDOR:* Está em tramitação o projeto "${proposalTitle}". Chega de tarifas absurdas de distribuição! Esse projeto de lei garante nosso direito constitucional de vender o excedente solar de forma direta, sem intermediários. Junte-se ao lobby popular e pressione seu deputado! #DiretoSolar #EnergiaLivre`,
        value: "Proporciona soberania de consumo e geração de receita extra com a monetização do excedente limpo de energia, livrando-o da dependência tarifária."
      },
      bigtech: {
        role: "Big Techs e Consórcio de Data Centers",
        color: "text-indigo-600 bg-indigo-50 border-indigo-100",
        message: `👔 *INFORME CORPORATIVO:* A tramitação da proposta regulatória "${proposalTitle}" viabiliza contratos diretos de compra de energia limpa de microgeradores locais de vizinhança. Isso reduz nossa dependência da malha central e diminui o PUE de resfriamento. Apoiar financeiramente esta regulação otimiza nossos custos de energia de IA.`,
        value: "Garante abundância de energia limpa descentralizada a preços altamente previsíveis para suprir a demanda massiva das infraestruturas de Inteligência Artificial."
      },
      distributors: {
        role: "Cartel de Concessionárias e Distribuidoras",
        color: "text-rose-600 bg-rose-50 border-rose-100",
        message: `⚠️ *MEMORANDO DE RISCO:* O avanço da proposta "${proposalTitle}" representa um risco severo para as receitas reguladas das concessionárias tradicionais (Abradee). É vital pautar emendas exigindo taxas de uso do sistema térmico compensatório e limitar o trânsito livre de excedentes nos horários de pico sob alegação de estabilidade física do grid.`,
        value: "Inicialmente resistem à perda do oligopólio, mas podem apoiar mediante a introdução de emendas de taxas de suporte de infraestrutura do sistema de transmissão distribuído."
      },
      congress: {
        role: "Bancadas Partidárias e Líderes do Congresso",
        color: "text-amber-600 bg-amber-50 border-amber-100",
        message: `🏛️ *APELO PARLAMENTAR:* Apoiar o projeto "${proposalTitle}" é sinalizar ao eleitorado das grandes regiões metropolitanas o compromisso com a desoneração da conta de luz e com o avanço tecnológico sustentável. É uma pauta apartidária de altíssimo ganho reputacional e convergência econômica.`,
        value: "Alinhamento com demandas populares por tarifas reduzidas e atração de polos industriais de semicondutores e data centers para os seus distritos eleitorais."
      }
    };
  }, [proposalTitle]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm mt-8" id="portal-legislativo">
      
      {/* Header do Portal */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider font-mono block mb-1">
            Portal de Proposição de Projetos de Lei
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="h-6 w-6 text-indigo-600" />
            Central de Sugestões e Articulação de Lobbies
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Redija, edite e simule o encaminhamento de propostas legislativas. Veja os caminhos constitucionais do projeto de lei até o Plenário do Congresso Nacional.
          </p>
        </div>

        {/* Action Button to copy/share */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer border border-slate-200/60"
            title="Copiar rascunho completo"
          >
            {isCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
            {isCopied ? "Copiado!" : "Compartilhar Proposta"}
          </button>
        </div>
      </div>

      {/* Grid: Editor Left (7/12) and Simulation/Stakeholders Right (5/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Coluna Esquerda: Seletor de Modelos e Editor de Rascunho */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
              Selecione o Modelo de Proposta Legislativa ({PROPOSAL_MODELS.length})
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => handleSelectModel(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
            >
              {PROPOSAL_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.category.toUpperCase()} • {model.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-medium">
              💡 <strong>Descrição técnica:</strong> {selectedModel.description}
            </p>
          </div>

          {/* Form Fields for Suggestion Customization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">Título do Projeto</label>
              <input
                type="text"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder="Ex: Marco do Excedente Solar..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1">Proponente Principal</label>
              <input
                type="text"
                value={proponent}
                onChange={(e) => setProponent(e.target.value)}
                placeholder="Ex: Confederação Nacional..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Editor Textarea */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-slate-200 rounded-t-2xl border-b border-slate-800 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                Rascunho de Redação Legislativa (.md)
              </span>
              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold text-[9px]">
                {selectedModel.category}
              </span>
            </div>
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="w-full min-h-[380px] bg-slate-950 text-slate-100 p-4 rounded-b-2xl border-x border-b border-slate-900 focus:outline-none text-xs font-mono leading-relaxed resize-y custom-scrollbar"
              spellCheck="false"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleStartSubmission}
              disabled={isSubmitting || submissionStep > 0}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                isSubmitting || submissionStep > 0
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 border border-indigo-700"
              }`}
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Tramitando Proposta..." : submissionStep > 0 ? "Enviado ao Congresso" : "Submeter Proposta à Mesa do Congresso"}
            </button>
          </div>

        </div>

        {/* Coluna Direita: Fluxo Legislativo & Stakeholders */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* 1. Simulador de Fluxo Constitucional */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/50">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-indigo-600" />
                Rito Constitucional de Sugestão Popular
              </h4>
              {submissionStep > 0 && (
                <button
                  onClick={handleResetSimulation}
                  className="p-1 rounded hover:bg-slate-200/60 text-slate-500 cursor-pointer text-[10px] font-bold flex items-center gap-1 border border-slate-200"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reiniciar
                </button>
              )}
            </div>

            {submissionStep === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <HelpCircle className="h-8 w-8 mx-auto opacity-30 mb-2 text-slate-500" />
                <span className="text-xs font-bold block text-slate-700">Fluxo Legislativo Inativo</span>
                <p className="text-[10px] text-slate-500 max-w-[240px] mx-auto mt-1 leading-normal">
                  Uma sugestão enviada por cidadãos não entra direto como Projeto de Lei (PL) tradicional. Ela precisa ser aprovada por uma comissão especial para então tramitar no Congresso. Clique em <strong>Submeter</strong> para ver o rito!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Step 1: Protocol */}
                <div className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                      submissionStep >= 1 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      1
                    </div>
                    <div className={`w-0.5 h-10 ${submissionStep >= 2 ? "bg-indigo-600" : "bg-slate-200"}`}></div>
                  </div>
                  <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900 font-bold">Protocolo na Mesa Diretora</strong>
                    <span className="text-[10px] text-slate-500 block">Cadastrado como Sugestão Legislativa (SUG nº {2026}/{Math.floor(Math.random() * 80) + 120})</span>
                    {submissionStep === 1 && (
                      <span className="text-[10px] font-bold text-indigo-600 mt-1 block animate-pulse">Registrando protocolo...</span>
                    )}
                  </div>
                </div>

                {/* Step 2: CLP Evaluation */}
                <div className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                      submissionStep >= 2 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      2
                    </div>
                    <div className={`w-0.5 h-10 ${submissionStep >= 3 ? "bg-indigo-600" : "bg-slate-200"}`}></div>
                  </div>
                  <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900 font-bold">Avaliação pela CLP (Comissão)</strong>
                    <span className="text-[10px] text-slate-500 block">Análise de admissibilidade e relevância social por 34 deputados relatores.</span>
                    {submissionStep === 2 && (
                      <span className="text-[10px] font-bold text-indigo-600 mt-1 block animate-pulse">Relator apresentando voto favorável...</span>
                    )}
                    {submissionStep >= 3 && clpVoteResult && (
                      <div className="mt-1.5 flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] px-2 py-1 rounded border border-emerald-100 font-bold">
                        <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                        Aprovado na Comissão: {clpVoteResult.sim} SIM contra {clpVoteResult.nao} NÃO!
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3: Conversion and Official Bill */}
                <div className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                      submissionStep >= 3 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}>
                      3
                    </div>
                    <div className={`w-0.5 h-10 ${submissionStep >= 4 ? "bg-indigo-600" : "bg-slate-200"}`}></div>
                  </div>
                  <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900 font-bold">Conversão em Projeto de Lei (PL)</strong>
                    <span className="text-[10px] text-slate-500 block">Por ter sido aprovada na CLP, a sugestão se torna oficialmente um projeto da comissão.</span>
                    {submissionStep === 3 && (
                      <span className="text-[10px] font-bold text-indigo-600 mt-1 block animate-pulse">Redigindo autógrafo do projeto...</span>
                    )}
                    {submissionStep >= 4 && finalBillNumber && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                        <FileText className="h-3.5 w-3.5" />
                        Código Oficial: {finalBillNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 4: Congress Distribution */}
                <div className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                      submissionStep >= 4 ? "bg-emerald-600 text-white animate-pulse" : "bg-slate-200 text-slate-500"
                    }`}>
                      ✓
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900 font-bold">Distribuição aos Plenários do Congresso</strong>
                    <span className="text-[10px] text-slate-500 block">Encaminhado para votação nominal dos 513 deputados e 81 senadores para aprovação terminativa.</span>
                    {submissionStep === 4 && (
                      <div className="mt-2 p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-[10px] text-emerald-800 leading-normal">
                        🎉 <strong>Sucesso!</strong> A mobilização social da sua proposta impulsionou a articulação cívica no Congresso! <br />
                        <span className="font-bold">+8% de apoio na Câmara de Deputados</span> e <span className="font-bold">+6% no Senado Federal</span> acumulados nas votações!
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* 2. Stakeholder Communications & Lobby Impact Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Megaphone className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
              Direcionamento de Stakeholders & Valor do Lobby
            </h4>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Mensagens táticas para mobilização social e econômica de cada facção para pressionar a tramitação em prol de seu projeto:
            </p>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(stakeholderAnalysis).map(([key, data]) => (
                <div key={key} className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{data.role}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${data.color}`}>
                      Lobby Ativo
                    </span>
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100 font-mono text-[10px] text-slate-700 whitespace-pre-line leading-relaxed">
                    {data.message}
                  </div>

                  {/* Value Add */}
                  <div className="text-[10px] text-slate-500 mt-1 leading-normal">
                    <strong>Valor Agregado ao Lobby:</strong> {data.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Container de Toast Flutuante Local */}
      {showToast && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs py-2.5 px-4 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 max-w-sm pointer-events-auto">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="font-medium">{showToast}</span>
        </div>
      )}

    </div>
  );
}
