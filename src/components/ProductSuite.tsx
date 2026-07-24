import { useState } from "react";
import { servicesData } from "../data";
import { ProductService } from "../types";
import SoftwareDetailModal from "./SoftwareDetailModal";
import { 
  Laptop, 
  BookOpen, 
  Flame, 
  GraduationCap, 
  Award, 
  Briefcase, 
  ShieldAlert, 
  Sprout, 
  Users,
  CheckCircle,
  Activity,
  Plus,
  RefreshCw,
  Bell,
  Gem,
  Sparkles,
  ExternalLink,
  Info
} from "lucide-react";

export default function ProductSuite() {
  const [selectedId, setSelectedId] = useState<string>("library");
  const [modalSoftware, setModalSoftware] = useState<ProductService | null>(null);
  const [interactiveLogs, setInteractiveLogs] = useState<Record<string, string[]>>({});
  const [simulateValueAddition, setSimulateValueAddition] = useState<number>(0);

  const selectedService = servicesData.find(s => s.id === selectedId) || servicesData[0];

  const getServiceIcon = (id: string, css: string) => {
    switch (id) {
      case "library": return <BookOpen className={css} />;
      case "fitness": return <Flame className={css} />;
      case "institutes": return <GraduationCap className={css} />;
      case "coaching": return <Award className={css} />;
      case "crm": return <Briefcase className={css} />;
      case "municipal": return <ShieldAlert className={css} />;
      case "farming": return <Sprout className={css} />;
      case "members": return <Gem className={css} />;
      default: return <Laptop className={css} />;
    }
  };

  // Helper to add fake interactive events on live emulator
  const triggerSimulationEvent = (serviceId: string, actionName: string) => {
    const timestamp = new Date().toLocaleTimeString();
    let logText = "";

    if (serviceId === "library") {
      const readers = ["Ajeet Pal", "Rashmi Sen", "Nikhil Kumar", "Vidya Dhar"];
      const randomReader = readers[Math.floor(Math.random() * readers.length)];
      logText = `[${timestamp}] Standard check-out issued for '${randomReader}' (due in 14 days)`;
    } else if (serviceId === "fitness") {
      const members = ["John Doe", "Anya Banerjee", "Karan Johar", "Sheetal Shah"];
      const randomMember = members[Math.floor(Math.random() * members.length)];
      logText = `[${timestamp}] Turnstile Swiped: ${randomMember} checked in. Health check optimal`;
    } else if (serviceId === "institutes") {
      logText = `[${timestamp}] Academic ledger audited: Recieved transaction token and exported invoice #C-902`;
    } else if (serviceId === "coaching") {
      logText = `[${timestamp}] Broadcasted instant progress SMS alert to 48 active batch parents`;
    } else if (serviceId === "crm") {
      logText = `[${timestamp}] Dynamic Lead Qualification score calculated and updated to HIGH priority`;
    } else if (serviceId === "municipal") {
      logText = `[${timestamp}] Citizen complaint ticket delegated to inspector squad (SLA: 24 hrs)`;
    } else if (serviceId === "farming") {
      logText = `[${timestamp}] AgriFusion POS & Livestock telemetry synced: Poultry & Fishery records verified`;
    } else if (serviceId === "members") {
      logText = `[${timestamp}] Daily gold bullion rates updated. 24K Pure Gold locked at ₹72,500/10g`;
    }

    setInteractiveLogs(prev => ({
      ...prev,
      [serviceId]: [logText, ...(prev[serviceId] || [])].slice(0, 5)
    }));
    setSimulateValueAddition(prev => prev + 1);
  };

  const currentLogs = interactiveLogs[selectedId] || selectedService.mockData.recentActivity;

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="h-[2px] w-8 bg-brand-gold-500" />
            <span className="text-sm font-bold font-mono text-brand-gold-600 tracking-widest uppercase">OUR SERVICES</span>
            <span className="h-[2px] w-8 bg-brand-gold-500" />
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy-900 tracking-tight leading-none">
            C VIDYA INTEGRATED PRODUCT SUITE
          </h2>
          <p className="mt-4 text-base text-black leading-relaxed font-semibold">
            We offer a wide range of integrated software solutions to manage and simplify your business operations. Select a module below to launch the **Live Dashboard Emulator Sandbox**.
          </p>
        </div>

        {/* Major Grid layout - 8 Service selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Product Selection List - All software visible without internal scroll */}
          <div className="lg:col-span-5 space-y-3.5 pr-2">
            {servicesData.map((service) => {
              const isActive = selectedId === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedId(service.id);
                    setModalSoftware(service);
                  }}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all flex flex-col sm:flex-row gap-3.5 cursor-pointer relative overflow-hidden group ${
                    isActive 
                      ? "bg-white border-brand-gold-500 shadow-md ring-1 ring-brand-gold-400" 
                      : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Software number badge - high contrast black highlight */}
                  <div className={`absolute top-2.5 right-3.5 font-mono font-black text-xs px-2.5 py-1 rounded-md shadow-sm border select-none z-10 ${
                    isActive 
                      ? "bg-slate-950 text-brand-gold-400 border-brand-gold-500" 
                      : "bg-slate-950 text-white border-slate-900"
                  }`}>
                    {service.num}
                  </div>

                  {/* Software Image & Icon Badge */}
                  <div className="relative shrink-0 w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 group-hover:border-brand-gold-400/50 transition-colors">
                    {service.imageUrl ? (
                      <img 
                        src={service.imageUrl} 
                        alt={service.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 font-mono text-xs">
                        {service.num}
                      </div>
                    )}
                    {/* Icon housing badge overlay */}
                    <div className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-lg flex items-center justify-center shadow-md backdrop-blur-md ${
                      isActive 
                        ? "bg-brand-navy-900 text-brand-gold-400 border border-brand-gold-500/40" 
                        : "bg-slate-900/80 text-brand-gold-300 border border-slate-700/60"
                    }`}>
                      {getServiceIcon(service.id, "w-3.5 h-3.5")}
                    </div>
                  </div>

                  {/* Copy content */}
                  <div className="space-y-1 z-10 flex-1 min-w-0">
                    <h3 className="font-display font-bold text-sm tracking-wide text-brand-navy-900 group-hover:text-brand-gold-700 transition-colors flex items-center justify-between gap-1.5">
                      <span className="truncate">{service.name}</span>
                      {isActive && <span className="w-2 h-2 bg-green-500 rounded-full animate-ping shrink-0" />}
                    </h3>
                    {service.tagline && (
                      <p className="text-[11px] font-extrabold text-brand-gold-600 leading-snug line-clamp-1">
                        {service.tagline}
                      </p>
                    )}
                    {service.subhead && (
                      <p className="text-[10px] font-bold text-emerald-700 italic line-clamp-1">
                        {service.subhead}
                      </p>
                    )}
                    <p className="text-xs text-black leading-relaxed font-bold line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                      <span className="text-[10px] font-mono text-brand-gold-600 font-bold tracking-wider flex items-center gap-1">
                        <Info className="w-3 h-3 text-brand-gold-500" />
                        <span>View Software Details</span>
                      </span>
                      {service.externalLink && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(service.externalLink, "_blank");
                          }}
                          className="text-[10px] bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 border border-brand-gold-400 shadow-sm transition-all cursor-pointer"
                        >
                          Click Here ↗
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Laptop & Screen Mockup */}
          <div className="lg:col-span-7">
            <div className="relative">
              
              {/* Heading for Simulator */}
              <div className="flex justify-between items-center mb-3.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#d69e2e] animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-500">
                    INTERACTIVE HARDWARE LIVE EMULATOR
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold-600 font-mono">
                  <span>Engine v2026.13</span>
                  <span className="h-2 w-2 bg-green-500 rounded-full" />
                </div>
              </div>

              {/* Laptop Physical Chassis Housing */}
              <div className="bg-slate-900 border-4 border-slate-700/80 rounded-2xl shadow-2xl p-2.5 overflow-hidden ring-1 ring-slate-800">
                
                {/* Virtual Camera / Screen top bezel */}
                <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-800 text-[10px] text-slate-500 font-mono">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-[9px] text-[#257a3e]">
                    <span className="w-1.5 h-1.5 bg-[#257a3e] rounded-full animate-pulse" />
                    <span>simul_host://{selectedId}.cvidya.app</span>
                  </div>
                  <div className="w-12 h-1 bg-slate-800 rounded-full" />
                </div>

                {/* Dashboard Screen Content */}
                <div className="bg-white text-slate-900 p-4 font-sans min-h-[360px] flex flex-col justify-between border border-slate-100">
                  
                  {/* Dashboard Header Bar */}
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div>
                      <div className="text-[10px] text-brand-gold-600 font-mono font-bold tracking-widest uppercase">
                        {selectedService.id.toUpperCase()} MODULE CONTROL
                      </div>
                      <h4 className="text-sm font-bold tracking-tight text-brand-navy-950 flex items-center gap-1.5">
                        {getServiceIcon(selectedId, "w-4 h-4 text-brand-gold-600")}
                        <span>{selectedService.mockData.title}</span>
                      </h4>
                    </div>
                    {/* Control Quick Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalSoftware(selectedService)}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 text-brand-gold-400 font-bold rounded text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-brand-gold-500/30"
                      >
                        <Info className="w-3 h-3 text-brand-gold-400" />
                        <span>Full Details</span>
                      </button>
                      {selectedService.externalLink && (
                        <a 
                          href={selectedService.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-extrabold rounded text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <span>Click Here ↗</span>
                        </a>
                      )}
                      <button 
                        onClick={() => triggerSimulationEvent(selectedId, "refresh")}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-slate-600"
                        title="Trigger action log"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-brand-gold-600" />
                      </button>
                    </div>
                  </div>

                  {/* Active Software Screenshot Visual Banner */}
                  {selectedService.imageUrl && (
                    <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden border border-slate-200/80 my-2 shadow-inner group">
                      <img 
                        src={selectedService.imageUrl} 
                        alt={selectedService.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                        <div className="flex items-center justify-between w-full text-white text-[10px] font-mono font-bold">
                          <span className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                            {getServiceIcon(selectedService.id, "w-3 h-3 text-brand-gold-400")} {selectedService.name}
                          </span>
                          <span className="text-brand-gold-300">Software View Live</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grid of live values counters inside emulator */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
                    {selectedService.mockData.metrics.map((met, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="text-[9px] text-slate-500 font-mono truncate leading-none uppercase">
                          {met.label}
                        </div>
                        <div className="text-base font-black text-brand-navy-950 mt-1.5 font-mono">
                          {met.value}
                        </div>
                        <div className={`text-[8px] font-bold font-mono mt-1 ${
                          met.isPositive ? "text-emerald-600" : "text-amber-600"
                        }`}>
                          {met.change}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Middle Row with SVG charts on the fly & features panel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch my-1 flex-1">
                    
                    {/* Tiny Responsive SVG Bar Chart */}
                    <div className="md:col-span-6 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div className="text-[10px] text-slate-500 font-mono font-bold flex justify-between">
                        <span>WEEKLY TRANSACTIONS</span>
                        <span className="text-emerald-600 font-mono font-bold">ONLINE</span>
                      </div>
                      
                      {/* Interactive Graph SVG block */}
                      <div className="h-24 w-full flex items-end justify-between gap-1 pt-3.5 border-b border-slate-200 pb-1.5">
                        {selectedService.mockData.chartData?.map((item, i) => {
                          const maxVal = Math.max(...(selectedService.mockData.chartData?.map(d => d.value) || [100]));
                          const heightPer = maxVal ? `${(item.value / maxVal) * 100}%` : "10%";
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div 
                                className="w-full rounded-t-sm bg-gradient-to-t from-brand-gold-500 to-brand-gold-400 transition-all duration-500 hover:from-brand-navy-900 hover:to-brand-gold-500" 
                                style={{ height: heightPer }}
                              />
                              <span className="text-[8px] text-slate-500 font-mono">{item.name}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[9px] text-slate-400 font-mono flex justify-between items-center pt-1.5 mt-auto">
                        <span>Metrics refreshed</span>
                        <span>1s ago</span>
                      </div>
                    </div>

                    {/* Service features overview checklist */}
                    <div className="md:col-span-6 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="text-[10px] text-brand-gold-600 font-mono font-bold">
                        SYSTEM ADVANCED FEATURES
                      </div>
                      <div className="text-[10.5px] text-slate-700 space-y-1.5 overflow-y-auto max-h-[100px] custom-scroll-panel pr-1">
                        {selectedService.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3 h-3 text-brand-gold-500 shrink-0 mt-0.5" />
                            <span className="leading-tight text-slate-800 font-semibold">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simulator logs and action triggers container */}
                  <div className="border-t border-slate-200 pt-3.5 mt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    
                    {/* Live simulated activity console output */}
                    <div className="flex-1 space-y-1">
                      <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-brand-gold-500 rounded-full animate-ping" />
                        <span>LIVE SIM SOFTWARE LOGGER OUTPUT:</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-200 max-h-[50px] overflow-y-auto">
                        {currentLogs.map((log, i) => (
                          <div key={i} className="truncate text-brand-gold-600 font-bold py-0.5">
                            ⚡ {log}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive push action triggers */}
                    <div className="shrink-0 flex flex-col gap-1.5">
                      <button
                        onClick={() => triggerSimulationEvent(selectedId, "action")}
                        className="flex items-center justify-center gap-1.5 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs leading-none transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Simulate Event</span>
                      </button>
                      <span className="text-[8px] font-mono text-slate-500 text-center uppercase">
                        Injected triggers: {simulateValueAddition}
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* Laptop physical hinge stand overlay */}
              <div className="relative h-4 w-40 bg-slate-800 mx-auto rounded-b-xl border-x-4 border-b-4 border-slate-700 shadow-xl z-20" />
              <div className="relative h-2.5 w-48 bg-slate-600/80 mx-auto rounded-b-2xl border-x-2 border-b-2 border-slate-700 shadow-md z-10" />

            </div>
          </div>

        </div>

      </div>

      {/* Software Landing Detail Modal */}
      <SoftwareDetailModal 
        software={modalSoftware} 
        onClose={() => setModalSoftware(null)} 
      />
    </section>
  );
}
