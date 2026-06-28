import { useState, useMemo, useEffect, useRef } from "react";
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
  VolumeX,
  FileDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";

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

  // Sistema de Notificações em Tempo Real do Manifesto de Metas
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "warning" | "error" | "info"; title: string; message: string }[]>([]);
  const previousScoresRef = useRef<{ [key: string]: number }>({});

  const addToast = (type: "success" | "warning" | "error" | "info", title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Configuração de Estilos e Paleta de Cores
      const primaryColor = [15, 23, 42]; // Slate-900 (#0f172a)
      const secondaryColor = [71, 85, 105]; // Slate-600 (#475569)
      const accentColor = [5, 150, 105]; // Emerald-600 (#059669)
      const warningColor = [217, 119, 6]; // Amber-600 (#d97706)
      const dangerColor = [225, 29, 72]; // Rose-600 (#e11d48)
      
      // Cabeçalho da página
      doc.setFillColor(15, 23, 42); // Fundo Slate-900 para o banner superior
      doc.rect(0, 0, 210, 38, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("SELIX IA - FRAMEWORK DE DECISÃO RACIONAL", 14, 16);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Relatório Analítico de Políticas Públicas e Simulação de Metas", 14, 23);
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 14, 29);

      // Marca de autenticidade no canto direito do cabeçalho
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(52, 211, 153); // Emerald-400
      doc.text("GOS3 APPROVED", 150, 18);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text("Integridade Estatística e Científica", 150, 24);

      // --- Seção 1: Resumo Macroeconômico ---
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("1. Resumo Macroeconômico & Diretriz Ativa", 14, 48);
      
      // Linha separadora
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.setLineWidth(0.5);
      doc.line(14, 51, 196, 51);

      // Grid de Informações
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Índice de Racionalidade Geral:", 14, 58);
      doc.setFont("helvetica", "normal");
      doc.text(`${politicalIndex} / 100`, 75, 58);

      doc.setFont("helvetica", "bold");
      doc.text("Diretriz Ideológica Ativa:", 14, 64);
      doc.setFont("helvetica", "normal");
      doc.text(
        selectedIdeology === "custom" 
          ? "Customizado (Ajuste Manual Livre)" 
          : selectedIdeology === "republicanos" 
            ? "Republicanos (Livre Mercado & Solvência)" 
            : "Democratas (Bem-estar Social & Transição)", 
        75, 64
      );

      doc.setFont("helvetica", "bold");
      doc.text("Cenário de Simulação:", 14, 70);
      doc.setFont("helvetica", "normal");
      doc.text(`${currentScenario.name} (${effectiveGrowthRate}% a.a.)`, 75, 70);

      doc.setFont("helvetica", "bold");
      doc.text("Projeção PIB per capita 2045:", 14, 76);
      doc.setFont("helvetica", "normal");
      doc.text(`${projectedPib2045} (Meta do Manifesto: US$ 130.000)`, 75, 76);

      doc.setFont("helvetica", "bold");
      doc.text("Tempo estimado até o Alvo:", 14, 82);
      doc.setFont("helvetica", "normal");
      doc.text(`${yearsToTarget}`, 75, 82);

      // Caixa cinza de descrição de diretriz
      doc.setFillColor(248, 250, 252); // Slate-50
      doc.rect(14, 88, 182, 18, "F");
      doc.setDrawColor(241, 245, 249); // Slate-100
      doc.rect(14, 88, 182, 18, "D");
      
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105); // Slate-600
      const desc = selectedIdeology === "custom" 
        ? "Premissa analítica em que pesos e prioridades das metas governamentais foram ajustados manualmente de forma customizada."
        : IDEOLOGY_PRESETS[selectedIdeology].description;
      const splitDesc = doc.splitTextToSize(desc, 174);
      doc.text(splitDesc, 18, 93);

      // --- Seção 2: Tabela de Indicadores e Pesos ---
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("2. Desempenho e Pesos dos Indicadores de Políticas Públicas", 14, 116);
      doc.line(14, 119, 196, 119);

      // Cabeçalho da Tabela
      doc.setFillColor(241, 245, 249); // Slate-100
      doc.rect(14, 123, 182, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text("Indicador Estratégico", 16, 128);
      doc.text("Peso", 70, 128);
      doc.text("Score", 90, 128);
      doc.text("Projeção Atual", 115, 128);
      doc.text("Meta Alvo", 160, 128);

      let currentY = 136;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      
      indicators.forEach((ind) => {
        let currentProjVal = ind.metricCurrent;
        if (ind.id === "economy") {
          const val = 9500 + (ind.score / 100) * (130000 - 9500);
          currentProjVal = `US$ ${Math.round(val).toLocaleString("pt-BR")}`;
        } else if (ind.id === "education") {
          const val = 415 + (ind.score / 100) * (520 - 415);
          currentProjVal = `${Math.round(val)}`;
        } else if (ind.id === "health") {
          const val = 76.2 + (ind.score / 100) * (83.5 - 76.2);
          currentProjVal = `${val.toFixed(1)} anos`;
        } else if (ind.id === "security") {
          const val = 19.8 - (ind.score / 100) * (19.8 - 4.5);
          currentProjVal = `${val.toFixed(1)} /100k hab`;
        } else if (ind.id === "infrastructure") {
          const val = 2300 + (ind.score / 100) * (20000 - 2300);
          currentProjVal = `${Math.round(val).toLocaleString("pt-BR")} kWh`;
        } else if (ind.id === "technology") {
          const val = 1.2 + (ind.score / 100) * (3.5 - 1.2);
          currentProjVal = `${val.toFixed(2)}%`;
        } else if (ind.id === "state_efficiency") {
          const val = 64 - (ind.score / 100) * (64 - 15);
          currentProjVal = `${Math.round(val)}/100`;
        } else if (ind.id === "fiscal") {
          const val = 78.5 - (ind.score / 100) * (78.5 - 50.0);
          currentProjVal = `${val.toFixed(1)}%`;
        } else if (ind.id === "monetary") {
          const val = 10.50 - (ind.score / 100) * (10.50 - 9.00);
          currentProjVal = `${val.toFixed(2)}%`;
        } else if (ind.id === "environment") {
          const val = 0.22 - (ind.score / 100) * (0.22 - 0.05);
          currentProjVal = `${val.toFixed(2)} kg`;
        } else if (ind.id === "foreign_trade") {
          const val = 11.5 - (ind.score / 100) * (11.5 - 4.0);
          currentProjVal = `${val.toFixed(1)}%`;
        }

        doc.setTextColor(15, 23, 42);
        doc.text(ind.name, 16, currentY);
        doc.text(`${ind.weight}%`, 70, currentY);
        
        if (ind.score >= 80) doc.setTextColor(5, 150, 105);
        else if (ind.score < 50) doc.setTextColor(225, 29, 72);
        else doc.setTextColor(217, 119, 6);

        doc.setFont("helvetica", "bold");
        doc.text(`${ind.score}/100`, 90, currentY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);

        doc.text(currentProjVal, 115, currentY);
        doc.text(ind.metricTarget, 160, currentY);

        doc.setDrawColor(241, 245, 249);
        doc.line(14, currentY + 2, 196, currentY + 2);
        
        currentY += 8;
      });

      doc.addPage();

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("SELIX IA — MONITOR DE ALERTAS E METAS DO MANIFESTO", 14, 10);

      // --- Seção 3: Alertas Ativos e Conquistas do Manifesto ---
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("3. Alertas de Políticas Públicas & Metas do Manifesto", 14, 30);
      doc.line(14, 33, 196, 33);

      let alertY = 42;
      
      if (activeAlertsAndAchievements.length === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, alertY, 182, 15, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(71, 85, 105);
        doc.text("Nenhum alerta crítico ou desvio estatístico de metas ativo neste cenário.", 20, alertY + 9);
        alertY += 25;
      } else {
        doc.setFontSize(9);
        activeAlertsAndAchievements.forEach((alert) => {
          if (alert.type === "success") {
            doc.setFillColor(236, 253, 245);
            doc.setDrawColor(167, 243, 208);
          } else if (alert.type === "danger") {
            doc.setFillColor(254, 242, 242);
            doc.setDrawColor(254, 205, 205);
          } else {
            doc.setFillColor(255, 251, 235);
            doc.setDrawColor(253, 230, 138);
          }
          
          doc.rect(14, alertY, 182, 18, "F");
          doc.rect(14, alertY, 182, 18, "D");

          doc.setFont("helvetica", "bold");
          if (alert.type === "success") {
            doc.setTextColor(5, 150, 105);
            doc.text("[META CONQUISTADA]", 18, alertY + 5);
          } else {
            doc.setTextColor(225, 29, 72);
            doc.text("[ALERTA CRÍTICO]", 18, alertY + 5);
          }

          doc.setFont("helvetica", "bold");
          doc.setTextColor(15, 23, 42);
          doc.text(alert.title, 60, alertY + 5);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          
          const alertMsg = doc.splitTextToSize(alert.message, 174);
          doc.text(alertMsg, 18, alertY + 10);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`Projeção: ${alert.metricValue}`, 145, alertY + 5);
          doc.setFont("helvetica", "normal");
          doc.text(`Alvo: ${alert.metricTarget}`, 145, alertY + 11);

          alertY += 22;
          doc.setFontSize(9);
        });
      }

      // --- Seção 4: Articulação Legislativa ---
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("4. Consonância de Articulação Legislativa", 14, alertY + 5);
      doc.line(14, alertY + 8, 196, alertY + 8);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("Projeto de Lei do Excedente Energético:", 14, alertY + 15);
      doc.setFont("helvetica", "normal");
      doc.text(surplusPLApproved ? "APROVADO E SANCIONADO" : "EM TRAMITAÇÃO / REJEITADO", 85, alertY + 15);

      doc.setFont("helvetica", "bold");
      doc.text("Suporte na Câmara dos Deputados:", 14, alertY + 21);
      doc.setFont("helvetica", "normal");
      doc.text(`${chamberSupport}% de apoio estimado`, 85, alertY + 21);

      doc.setFont("helvetica", "bold");
      doc.text("Suporte no Senado Federal:", 14, alertY + 27);
      doc.setFont("helvetica", "normal");
      doc.text(`${senateSupport}% de apoio estimado`, 85, alertY + 27);

      doc.setFillColor(248, 250, 252);
      doc.rect(14, alertY + 33, 182, 14, "F");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("O suporte legislativo determina a taxa de conversão dos investimentos em resultados reais nas metas do manifesto.", 18, alertY + 41);

      // --- Assinatura GOS3 e Termos de Integridade ---
      const signatureY = alertY + 60;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, signatureY, 196, signatureY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text("ASSINATURA DE INTEGRIDADE ESTATÍSTICA GOS3", 14, signatureY + 6);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Este relatório consolida de forma fidedigna as simulações do Framework de Decisão Racional 2026.", 14, signatureY + 12);
      doc.text("Os limites de caracter, rate limits de API e a consistência das simulações seguem a arquitetura de autoridade do manifesto.", 14, signatureY + 16);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(5, 150, 105);
      doc.text("CÓDIGO DE AUTORIDADE GOS3: OK-2026-VERIFIED", 14, signatureY + 25);

      doc.save(`selix-ia-relatorio-${selectedIdeology}-${new Date().toISOString().split('T')[0]}.pdf`);
      addToast("success", "📄 PDF Exportado com Sucesso", "O relatório consolidado de metas e indicadores foi salvo na sua pasta de downloads.");
    } catch (err: any) {
      console.error(err);
      addToast("error", "❌ Erro ao exportar PDF", "Houve um erro inesperado ao gerar o documento de simulação.");
    }
  };

  // Monitor dinâmico de metas e alertas
  useEffect(() => {
    const isFirstRun = Object.keys(previousScoresRef.current).length === 0;
    const currentScores: { [key: string]: number } = {};

    indicators.forEach(ind => {
      currentScores[ind.id] = ind.score;

      if (!isFirstRun) {
        const prevScore = previousScoresRef.current[ind.id];
        const newScore = ind.score;

        if (prevScore !== undefined && prevScore !== newScore) {
          if (ind.id === "economy") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: Crescimento Sustentável", "PIB per capita projetado em US$ 100.000+! Caminho para a riqueza nacional consolidado.");
            } else if (newScore < 45 && prevScore >= 45) {
              addToast("error", "⚠️ Alerta de Renda Média: Crescimento Baixo", "O crescimento do PIB é insuficiente para superar a armadilha de renda média histórica.");
            }
          }
          if (ind.id === "education") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: Educação Top 20 PISA", "Média PISA projetada acima de 500 pontos, aproximando o país dos líderes de inovação.");
            } else if (newScore < 50 && prevScore >= 50) {
              addToast("error", "⚠️ Alerta de Educação Básica Crítica", "Média do PISA projetada abaixo de 440 pontos, comprometendo o capital de inovação futuro.");
            }
          }
          if (ind.id === "health") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: Longevidade Ativa SUS", "Expectativa de vida média projeta-se acima de 80 anos devido à digitalização e prevenção do SUS.");
            } else if (newScore < 50 && prevScore >= 50) {
              addToast("error", "⚠️ Alerta de Ineficiência de Saúde Pública", "Aumento no tempo de exames e gargalos de atendimento asfixiam a expectativa de vida.");
            }
          }
          if (ind.id === "security") {
            if (newScore >= 75 && prevScore < 75) {
              addToast("success", "🏆 Meta Atingida: Ordem e Tolerância Zero", "Taxa de homicídios reduzida com sucesso abaixo do limite crítico de 10 por 100k hab!");
            } else if (newScore < 45 && prevScore >= 45) {
              addToast("error", "⚠️ Alerta de Segurança Pública Crítica", "Taxa de homicídios projetada acima do limite de 15/100k hab. Violência sistêmica ativa.");
            }
          }
          if (ind.id === "infrastructure") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: Matriz de Energia Triplicada", "Capacidade industrial atinge 15.000+ kWh/hab com a aprovação do PL de energia solar.");
            } else if (newScore < 50 && prevScore >= 50) {
              addToast("error", "⚠️ Alerta de Apagão de Infraestrutura", "Falta de investimentos em linhas de transmissão asfixia o avanço logístico multimodal.");
            }
          }
          if (ind.id === "technology") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: Polo Semicondutores & IA", "Investimento de P&D supera o limite estratégico nacional do manifesto de 2.5% do PIB anual.");
            } else if (newScore < 45 && prevScore >= 45) {
              addToast("warning", "⚠️ Alerta de Estagnação Tecnológica", "Baixo registro de patentes e fuga de talentos mantêm o país na dependência tecnológica externa.");
            }
          }
          if (ind.id === "state_efficiency") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: Estado 100% Digital", "Índice de burocracia atinge padrão OCDE de desregulamentação de abertura de negócios.");
            } else if (newScore < 45 && prevScore >= 45) {
              addToast("warning", "⚠️ Alerta de Burocracia Excessiva", "Excesso de cartórios, atrasos em contratos e ineficiência oneram o ambiente produtivo.");
            }
          }
          if (ind.id === "fiscal") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: Solvência Fiscal Plena", "Relação Dívida Bruta/PIB entra em declínio sustentado para patamar de segurança (<60%).");
            } else if (newScore < 45 && prevScore >= 45) {
              addToast("error", "⚠️ Alerta de Insolvência e Risco País", "Dívida Bruta/PIB ultrapassa o limite prudencial de 75%! Risco iminente de inflação.");
            }
          }
          if (ind.id === "monetary") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: SELIC Estável de 1 Dígito", "Expectativa de inflação ancorada permite juros estruturais competitivos de um dígito.");
            } else if (newScore < 45 && prevScore >= 45) {
              addToast("error", "⚠️ Alerta Monetário: Juros Asfixiantes", "SELIC mantida em dois dígitos por desancoragem fiscal encarece o custo do crédito.");
            }
          }
          if (ind.id === "environment") {
            if (newScore >= 80 && prevScore < 80) {
              addToast("success", "🏆 Meta Atingida: Descarbonização Histórica", "Emissões abaixo de 0.10 kg CO2/PIB abrem as portas de fundos internacionais de títulos verdes.");
            } else if (newScore < 50 && prevScore >= 50) {
              addToast("warning", "⚠️ Alerta de Degradação Ecológica", "Aumento de queimadas e desmatamento ilegal geram retaliação comercial global.");
            }
          }
          if (ind.id === "foreign_trade") {
            if (newScore >= 75 && prevScore < 75) {
              addToast("success", "🏆 Meta Atingida: Abertura e Comércio Livre", "Tarifa média de importação competitiva de 4% estimula inserção nas cadeias globais de valor.");
            } else if (newScore < 45 && prevScore >= 45) {
              addToast("warning", "⚠️ Alerta de Protecionismo e Isolamento", "Altas tarifas aduaneiras encarecem componentes digitais e isolam a indústria local.");
            }
          }
        }
      }
    });

    previousScoresRef.current = currentScores;
  }, [indicators]);

  // Alertas e Conquistas Ativos do Manifesto calculados sob demanda
  const activeAlertsAndAchievements = useMemo(() => {
    const list: {
      id: string;
      indicatorId: string;
      type: "success" | "danger" | "warning";
      title: string;
      message: string;
      metricValue: string;
      metricTarget: string;
    }[] = [];

    indicators.forEach(ind => {
      let metricValueStr = ind.metricCurrent;

      if (ind.id === "economy") {
        const val = 9500 + (ind.score / 100) * (130000 - 9500);
        metricValueStr = `US$ ${Math.round(val).toLocaleString("pt-BR")}`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Crescimento Sustentável Excepcional",
            message: "PIB per capita projetado em patamar de riqueza nacional, quebrando a armadilha de renda média de longo prazo.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 45) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "danger",
            title: "Armadilha de Renda Média Ativa",
            message: "A taxa de investimento estrutural é insuficiente para elevar a produtividade per capita nacional rumo às economias líderes.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "education") {
        const val = 415 + (ind.score / 100) * (520 - 415);
        metricValueStr = `${Math.round(val)}`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Ensino de Fronteira e PISA Top 20",
            message: "Média geral do PISA projetada em níveis avançados de proficiência em matemática, ciências e leitura pública.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 50) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "danger",
            title: "Déficit Crítico de Capital Humano",
            message: "Média PISA na zona de exclusão educacional, limitando a competitividade e produtividade real do trabalho futuro.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "health") {
        const val = 76.2 + (ind.score / 100) * (83.5 - 76.2);
        metricValueStr = `${val.toFixed(1)} anos`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Modernização da Atenção Básica de Saúde",
            message: "Expectativa de vida média se projeta em níveis excelentes com a eliminação total de filas de exames via prontuário digital.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 50) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "danger",
            title: "Ineficiência Preventiva e Filas de Espera",
            message: "Tempo de espera elevado na atenção especializada asfixia a longevidade ativa do cidadão comum.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "security") {
        const val = 19.8 - (ind.score / 100) * (19.8 - 4.5);
        metricValueStr = `${val.toFixed(1)} /100k hab`;
        if (ind.score >= 75) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Ordem Pública e Territorial Restaurada",
            message: "Taxa de crimes violentos intencionais reduzida abaixo do limite do manifesto de 10 homicídios por 100 mil habitantes.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 45) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "danger",
            title: "Gargalo Crítico de Segurança Pública",
            message: "Taxa de homicídios ultrapassa o limite máximo aceitável de 15/100k hab. Alta presença de crime organizado.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "infrastructure") {
        const val = 2300 + (ind.score / 100) * (20000 - 2300);
        metricValueStr = `${Math.round(val).toLocaleString("pt-BR")} kWh`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Matriz Elétrica Descarbonizada e Expansiva",
            message: "Abastecimento energético industrial garantido com geração de energia limpa de alta escala per capita.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 50) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "danger",
            title: "Gargalo Estrutural de Oferta Energética",
            message: "A capacidade elétrica instalada limita a expansão industrial e induz risco de racionamento tarifário.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "technology") {
        const val = 1.2 + (ind.score / 100) * (3.5 - 1.2);
        metricValueStr = `${val.toFixed(2)}%`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Fronteira de Pesquisa Semicondutores & IA",
            message: "Investimento em P&D supera o limite estratégico nacional do manifesto de 2.5% do PIB anual.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 45) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "warning",
            title: "Isolamento e Estagnação Tecnológica",
            message: "Baixa taxa de depósitos de patentes e fomento científico deixa o país atrás na revolução digital.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "state_efficiency") {
        const val = 64 - (ind.score / 100) * (64 - 15);
        metricValueStr = `${Math.round(val)}/100`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Estado Desregulamentado e Desburocratizado",
            message: "Processos governamentais e de abertura de negócios simplificados atingem o nível de eficiência da OCDE.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 45) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "warning",
            title: "Burocracia Estatal Sufocante",
            message: "Atrasos no sistema de execuções de contratos e trâmites analógicos excessivos elevam o custo de transação.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "fiscal") {
        const val = 78.5 - (ind.score / 100) * (78.5 - 50.0);
        metricValueStr = `${val.toFixed(1)}%`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Solvência e Responsabilidade Fiscal Plena",
            message: "Dívida Bruta/PIB na zona de segurança prudencial, reduzindo a desancoragem inflacionária.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 45) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "danger",
            title: "Risco de Incompetência e Ruína Fiscal",
            message: "Relação Dívida Bruta/PIB ultrapassa o limite prudencial de segurança do manifesto de 75%. Pressão de juros ativa.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "monetary") {
        const val = 10.50 - (ind.score / 100) * (10.50 - 9.00);
        metricValueStr = `${val.toFixed(2)}%`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Ancoragem de Juros de Um Dígito",
            message: "Expectativas de inflação ancoradas permitem spread competitivo e custo de financiamento barato.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 45) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "danger",
            title: "Juros Estruturais em Dois Dígitos",
            message: "Custo do capital elevado asfixia a viabilidade de crédito corporativo industrial e infraestrutural.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "environment") {
        const val = 0.22 - (ind.score / 100) * (0.22 - 0.05);
        metricValueStr = `${val.toFixed(2)} kg`;
        if (ind.score >= 80) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Liderança Ecológica Global e Títulos Verdes",
            message: "Nível de emissões de CO2 reduzido a patamares históricos, atraindo investimentos climáticos massivos.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 50) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "warning",
            title: "Alerta de Desmatamento e Degradação Verde",
            message: "Desvio na trajetória de descarbonização do PIB impõe risco de penalização e barreira comercial na UE.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
      else if (ind.id === "foreign_trade") {
        const val = 11.5 - (ind.score / 100) * (11.5 - 4.0);
        metricValueStr = `${val.toFixed(1)}%`;
        if (ind.score >= 75) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "success",
            title: "Abertura de Mercados e Fluxo de Insumos",
            message: "Tarifas médias competitivas integram o ecossistema produtivo local às cadeias de valor internacionais.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        } else if (ind.score < 45) {
          list.push({
            id: ind.id,
            indicatorId: ind.id,
            type: "warning",
            title: "Protecionismo Alfandegário Sufocante",
            message: "Taxação excessiva isola as fábricas de insumos digitais globais de alta tecnologia e eleva custos domésticos.",
            metricValue: metricValueStr,
            metricTarget: ind.metricTarget
          });
        }
      }
    });

    return list;
  }, [indicators]);

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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="h-5 w-5 text-slate-950" />
              Diretriz Ideológica de Políticas Públicas
            </h3>
            <p className="text-xs text-slate-500">Veja como premissas doutrinárias alteram pesos e resultados de metas governamentais</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-full sm:w-auto">
              <button
                onClick={() => handleIdeologyChange("republicanos")}
                className={`flex-1 sm:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedIdeology === "republicanos"
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🇧🇷 Republicanos
              </button>
              <button
                onClick={() => handleIdeologyChange("democratas")}
                className={`flex-1 sm:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedIdeology === "democratas"
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🇧🇷 Democratas
              </button>
              <button
                onClick={() => handleIdeologyChange("custom")}
                className={`flex-1 sm:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedIdeology === "custom"
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                ⚙️ Customizado
              </button>
            </div>

            <button
              onClick={exportToPDF}
              className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all cursor-pointer border border-slate-800"
            >
              <FileDown className="h-4 w-4 text-emerald-400" />
              Exportar PDF
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

      {/* Manifesto de Metas & Alertas de Políticas Públicas */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-slate-950 animate-pulse" />
              Monitor de Metas do Manifesto e Alertas Críticos
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhamento de violações de limites e metas conquistadas do manifesto de políticas públicas (Zipf, Pareto e RAG integrados)
            </p>
          </div>
          
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold border border-emerald-100/50">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {activeAlertsAndAchievements.filter(a => a.type === "success").length} Metas Conquistadas
            </span>
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs px-3 py-1 rounded-full font-bold border border-rose-100/50">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              {activeAlertsAndAchievements.filter(a => a.type === "danger").length} Alertas Críticos
            </span>
          </div>
        </div>

        {activeAlertsAndAchievements.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Todos os indicadores estão na zona de estabilidade normal de transição.</p>
            <p className="text-[11px] text-slate-400 mt-1">Ajuste o Cenário ou as Diretrizes Ideológicas para estressar ou otimizar as políticas públicas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {activeAlertsAndAchievements.map((item) => (
              <div 
                key={item.id} 
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all hover:shadow-sm ${
                  item.type === "success" 
                    ? "bg-emerald-50/20 border-emerald-100 text-slate-800" 
                    : item.type === "danger" 
                      ? "bg-rose-50/20 border-rose-100 text-slate-800" 
                      : "bg-amber-50/20 border-amber-100 text-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      item.type === "success" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : item.type === "danger" 
                          ? "bg-rose-100 text-rose-800" 
                          : "bg-amber-100 text-amber-800"
                    }`}>
                      {item.type === "success" ? "🏆 META ALCANÇADA" : "⚠️ ALERTA CRÍTICO"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Alvo: {item.metricTarget}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">{item.message}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Projeção:</span>
                  <strong className={`font-mono text-xs ${
                    item.type === "success" 
                      ? "text-emerald-600 font-bold" 
                      : item.type === "danger" 
                        ? "text-rose-600 font-bold" 
                        : "text-amber-600 font-bold"
                  }`}>
                    {item.metricValue}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* Container de Toasts Flutuantes */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-xl shadow-lg border text-white flex gap-3 relative overflow-hidden pointer-events-auto ${
                toast.type === "success" 
                  ? "bg-slate-900/95 border-emerald-500/30 text-emerald-100" 
                  : toast.type === "error" 
                    ? "bg-slate-900/95 border-rose-500/30 text-rose-100" 
                    : toast.type === "warning"
                      ? "bg-slate-900/95 border-amber-500/30 text-amber-100"
                      : "bg-slate-900/95 border-blue-500/30 text-blue-100"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : toast.type === "error" ? (
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                ) : (
                  <HelpCircle className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xs text-white">{toast.title}</h4>
                <p className="text-[11px] mt-1 text-slate-300 leading-normal">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold self-start"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>

    </div>
  );
}
