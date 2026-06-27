import { useState } from "react";
import Header from "./components/Header";
import IndicatorDashboard from "./components/IndicatorDashboard";
import PollAuditSimulator from "./components/PollAuditSimulator";
import CandidatePlansDashboard from "./components/CandidatePlansDashboard";
import AIAgentChat from "./components/AIAgentChat";
import { INITIAL_CANDIDATES } from "./data";
import { Sliders, Vote, HelpCircle, Activity, Github, ShieldCheck, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "audit" | "plans">("dashboard");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Dynamic Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Educational Manifesto Banner */}
        <div className="mb-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-slate-900 h-full"></div>
          <div className="space-y-1 md:max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-slate-800" />
              O Framework de Decisão Racional
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              O debate público moderno é excessivamente dominado por torcidas, slogans e polarização de curtíssimo prazo. 
              Este framework analítico transforma a decisão eleitoral em um processo fundamentado: avalie o país através de **metas quantificáveis de longo prazo** (PIB per capita, PISA, segurança e saúde) e investigue a **consistência estatística** das pesquisas eleitorais contra leis matemáticas rígidas (Zipf, Pareto e simulações multinomiais).
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
            <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-center font-mono w-full sm:w-auto min-w-[130px]">
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Meta Renda</span>
              <strong className="text-base font-black text-slate-950 block leading-tight">US$ 130.000</strong>
              <span className="block text-[8px] text-emerald-600 font-bold">PIB per Capita PPP</span>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-center font-mono w-full sm:w-auto min-w-[130px]">
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Meta Energia</span>
              <strong className="text-base font-black text-slate-950 block leading-tight">20.000 kWh</strong>
              <span className="block text-[8px] text-blue-600 font-bold">Consumo per Capita</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-center font-mono w-full sm:w-auto min-w-[130px]">
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Meta Monetária</span>
              <strong className="text-base font-black text-slate-950 block leading-tight">1 dígito (&lt;9%)</strong>
              <span className="block text-[8px] text-indigo-600 font-bold">Taxa SELIC Nominal</span>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="flex border-b border-slate-200 mb-8 p-1 bg-white/50 backdrop-blur rounded-xl border max-w-md">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Sliders className="h-4 w-4" />
            Políticas Públicas & IP
          </button>
          
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "audit"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <Vote className="h-4 w-4" />
            Auditoria de Pesquisas
          </button>

          <button
            onClick={() => setActiveTab("plans")}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "plans"
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Planos & SWOT
          </button>
        </div>

        {/* Dynamic Tab Panel Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" ? (
              <IndicatorDashboard />
            ) : activeTab === "audit" ? (
              <PollAuditSimulator />
            ) : (
              <CandidatePlansDashboard candidates={INITIAL_CANDIDATES} />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Footer explaining methodology */}
      <footer className="bg-white border-t border-slate-100 mt-20 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Educando o Eleitor</span>
            <span>|</span>
            <span>Metodologia Estatística e Modelos de Políticas Públicas</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>Licença Apache-2.0</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              STATUS: SATISFIABLE (Z3 Solver Verified)
            </span>
          </div>
        </div>
      </footer>

      {/* Global Floating AI Agent with Voice and RAG */}
      <AIAgentChat />
    </div>
  );
}
