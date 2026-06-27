import { GraduationCap, BarChart2, Calendar, Vote, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="app-header" className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title / Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 text-white p-2.5 rounded-xl shadow-md">
            <GraduationCap className="h-6 w-6" id="header-icon-grad" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Educando o Eleitor</h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Mais dados. Menos torcida.
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Vote com indicadores, não apenas com opiniões.</p>
          </div>
        </div>

        {/* Realtime stats ticker */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 bg-slate-50/50 px-4 py-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>METAS 2045</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>IP: DINÂMICO</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 bg-slate-950 rounded-full"></span>
            <span>{timeStr} UTC</span>
          </div>
        </div>
      </div>
    </header>
  );
}
