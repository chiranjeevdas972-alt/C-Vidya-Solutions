import { useState } from "react";
import { servicesData } from "../data";
import { ProductService } from "../types";
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
  Gem
} from "lucide-react";

export default function ProductSuite() {
  const [selectedId, setSelectedId] = useState<string>("library");
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
      logText = `[${timestamp}] Drone scan complete. Soil nutrients (N:P:K) detected at premium rates`;
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
          
          {/* Left Column: Interactive Product Selection List */}
          <div className="lg:col-span-5 space-y-3.5 max-h-[700px] overflow-y-auto pr-2 custom-scroll-panel">
            {servicesData.map((service) => {
              const isActive = selectedId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedId(service.id);
                    if (service.externalLink) {
                      window.open(service.externalLink, "_blank");
                    }
                  }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex gap-4 cursor-pointer relative overflow-hidden group ${
                    isActive 
                      ? "bg-white border-brand-gold-500 shadow-md ring-1 ring-brand-gold-400" 
                      : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Decorative numeric floating badge */}
                  <div className={`absolute top-2.5 right-3.5 font-mono font-black text-3xl opacity-10 select-none ${
                    isActive ? "text-brand-gold-500 scale-110" : "text-slate-400"
                  }`}>
                    {service.num}
                  </div>

                  {/* Icon housing */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isActive 
                      ? "bg-brand-navy-900 text-brand-gold-400" 
                      : "bg-slate-100 text-slate-600 group-hover:text-brand-navy-800"
                  }`}>
                    {getServiceIcon(service.id, "w-5 h-5")}
                  </div>

                  {/* Copy content */}
                  <div className="space-y-1 z-10 flex-1">
                    <h3 className="font-display font-bold text-sm tracking-wide text-brand-navy-900 group-hover:text-brand-gold-700 transition-colors flex items-center justify-between gap-1.5">
                      <span>{service.name}</span>
                      {isActive && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />}
                    </h3>
                    <p className="text-xs text-black leading-relaxed font-bold">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-1.5 flex-wrap gap-2">
                      <span className="text-[10px] font-mono text-brand-gold-600 font-bold tracking-wider">
                        {isActive ? "Launch Simulator" : "Open Tool"}
                      </span>
                      {service.externalLink && (
                        <span className="text-[10px] bg-brand-gold-500/10 text-brand-gold-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-brand-gold-400/20 group-hover:bg-brand-gold-500 group-hover:text-slate-950 transition-all duration-300">
                          Live App ↗
                        </span>
                      )}
                    </div>
                  </div>
                </button>
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
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-full text-[9px] text-[#2ebd59]">
                    <span className="w-1.5 h-1.5 bg-[#2ebd59] rounded-full animate-pulse" />
                    <span>simul_host://{selectedId}.cvidya.app</span>
                  </div>
                  <div className="w-12 h-1 bg-slate-800 rounded-full" />
                </div>

                {/* Dashboard Screen Content */}
                <div className="bg-slate-950 text-slate-100 p-4 font-sans min-h-[360px] flex flex-col justify-between">
                  
                  {/* Dashboard Header Bar */}
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-[10px] text-brand-gold-400 font-mono font-bold tracking-widest uppercase">
                        {selectedService.id.toUpperCase()} MODULE CONTROL
                      </div>
                      <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                        {getServiceIcon(selectedId, "w-4 h-4 text-brand-gold-400")}
                        <span>{selectedService.mockData.title}</span>
                      </h4>
                    </div>
                    {/* Control Quick Actions */}
                    <div className="flex items-center gap-2">
                      {selectedService.externalLink && (
                        <a 
                          href={selectedService.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 font-bold rounded text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <span>Open Live App ↗</span>
                        </a>
                      )}
                      <button 
                        onClick={() => triggerSimulationEvent(selectedId, "refresh")}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors text-slate-300"
                        title="Trigger action log"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#42A5F5]" />
                      </button>
                    </div>
                  </div>

                  {/* Grid of live values counters inside emulator */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
                    {selectedService.mockData.metrics.map((met, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="text-[9px] text-slate-400 font-mono truncate leading-none uppercase">
                          {met.label}
                        </div>
                        <div className="text-base font-black text-white mt-1.5 font-mono">
                          {met.value}
                        </div>
                        <div className={`text-[8px] font-medium font-mono mt-1 ${
                          met.isPositive ? "text-green-400" : "text-yellow-400"
                        }`}>
                          {met.change}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Middle Row with SVG charts on the fly & features panel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch my-1 flex-1">
                    
                    {/* Tiny Responsive SVG Bar Chart */}
                    <div className="md:col-span-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                      <div className="text-[10px] text-slate-400 font-mono font-bold flex justify-between">
                        <span>WEEKLY TRANSACTIONS</span>
                        <span className="text-emerald-400 font-mono font-semibold">ONLINE</span>
                      </div>
                      
                      {/* Interactive Graph SVG block */}
                      <div className="h-24 w-full flex items-end justify-between gap-1 pt-3.5 border-b border-slate-800 pb-1.5">
                        {selectedService.mockData.chartData?.map((item, i) => {
                          const maxVal = Math.max(...(selectedService.mockData.chartData?.map(d => d.value) || [100]));
                          const heightPer = maxVal ? `${(item.value / maxVal) * 100}%` : "10%";
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div 
                                className="w-full rounded-t-sm bg-gradient-to-t from-brand-gold-600 to-brand-gold-400 transition-all duration-500 hover:from-white hover:to-brand-gold-200" 
                                style={{ height: heightPer }}
                              />
                              <span className="text-[8px] text-slate-500 font-mono">{item.name}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[9px] text-slate-500 font-mono flex justify-between items-center pt-1.5 mt-auto">
                        <span>Metrics refreshed</span>
                        <span>1s ago</span>
                      </div>
                    </div>

                    {/* Service features overview checklist */}
                    <div className="md:col-span-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 space-y-1.5">
                      <div className="text-[10px] text-brand-gold-400 font-mono font-bold">
                        SYSTEM ADVANCED FEATURES
                      </div>
                      <div className="text-[10.5px] text-slate-300 space-y-1.5 overflow-y-auto max-h-[100px] custom-scroll-panel pr-1">
                        {selectedService.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3 h-3 text-brand-gold-400 shrink-0 mt-0.5" />
                            <span className="leading-tight text-slate-300">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simulator logs and action triggers container */}
                  <div className="border-t border-slate-800 pt-3.5 mt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    
                    {/* Live simulated activity console output */}
                    <div className="flex-1 space-y-1">
                      <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-brand-gold-400 rounded-full animate-ping" />
                        <span>LIVE SIM SOFTWARE LOGGER OUTPUT:</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-300 bg-black/60 p-2 rounded-md border border-slate-800 max-h-[50px] overflow-y-auto">
                        {currentLogs.map((log, i) => (
                          <div key={i} className="truncate text-brand-gold-100/90 py-0.5">
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
    </section>
  );
}
