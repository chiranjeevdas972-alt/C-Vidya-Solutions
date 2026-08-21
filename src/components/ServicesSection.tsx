import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { saasProductsData, aiAgentsData } from "../data";
import { ProductService } from "../types";
import SoftwareDetailModal from "./SoftwareDetailModal";
import { 
  Laptop, 
  BookOpen, 
  Flame, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Sprout, 
  Gem, 
  Sparkles, 
  Bot, 
  Cpu, 
  ExternalLink, 
  CheckCircle2, 
  Activity, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  Layers, 
  Zap, 
  Info,
  ScanLine,
  TrendingUp,
  BarChart3,
  MessageSquare,
  ChevronRight,
  RotateCw,
  X,
  Megaphone
} from "lucide-react";

interface ServicesSectionProps {
  id?: string;
  onOpenInquiry?: (softwareName?: string) => void;
}

export default function ServicesSection({ id = "services-suite", onOpenInquiry }: ServicesSectionProps) {
  // Primary category tab: 'saas' for C Vidya Solutions SaaS Products, 'ai-agent' for C Vidya AI Agents
  const [activeCategory, setActiveCategory] = useState<"saas" | "ai-agent">("saas");
  
  // Selected product within each category
  const [selectedSaasId, setSelectedSaasId] = useState<string>("library");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("ai-social");
  
  // Modal state for full detail view
  const [modalSoftware, setModalSoftware] = useState<ProductService | null>(null);

  // Live in-app software viewer with dedicated top 'Back to Website' bar
  const [liveAppViewing, setLiveAppViewing] = useState<ProductService | null>(null);
  const [frameLoading, setFrameLoading] = useState<boolean>(true);
  const [frameKey, setFrameKey] = useState<number>(0);

  // Interactive sandbox logs
  const [interactiveLogs, setInteractiveLogs] = useState<Record<string, string[]>>({});
  const [simulatedScore, setSimulatedScore] = useState<number>(0);

  const currentProducts = activeCategory === "saas" ? saasProductsData : aiAgentsData;
  const currentSelectedId = activeCategory === "saas" ? selectedSaasId : selectedAgentId;
  const selectedService = currentProducts.find(p => p.id === currentSelectedId) || currentProducts[0];

  // Helper icon retriever
  const getProductIcon = (productId: string, cssClass: string) => {
    switch (productId) {
      // SaaS products
      case "library": return <BookOpen className={cssClass} />;
      case "fitness": return <Flame className={cssClass} />;
      case "institutes": return <GraduationCap className={cssClass} />;
      case "coaching": return <Award className={cssClass} />;
      case "farming": return <Sprout className={cssClass} />;
      case "members": return <Gem className={cssClass} />;
      case "crm": return <Briefcase className={cssClass} />;
      
      // AI Agent products
      case "ai-social": return <Sparkles className={cssClass} />;
      case "ai-support": return <Bot className={cssClass} />;
      case "ai-salesflow": case "ai-sales": return <TrendingUp className={cssClass} />;
      case "ai-marketing": return <Megaphone className={cssClass} />;
      default: return <Cpu className={cssClass} />;
    }
  };

  // Handler to open live software with back-to-website navigation
  const handleOpenSoftware = (product: ProductService) => {
    if (product.externalLink) {
      setLiveAppViewing(product);
      setFrameLoading(true);
    } else {
      setModalSoftware(product);
    }
  };

  // Simulation handler for live sandbox actions
  const triggerSimulationAction = (serviceId: string, actionTitle: string) => {
    const timestamp = new Date().toLocaleTimeString();
    let logMessage = "";

    if (serviceId === "library") {
      logMessage = `[${timestamp}] Barcode Scanner: Book 'Clean Architecture' checked out to Student #LIB-884`;
    } else if (serviceId === "fitness") {
      logMessage = `[${timestamp}] Turnstile Gate: Biometric RFID verified for Member #FIT-302 (Floor pass active)`;
    } else if (serviceId === "institutes") {
      logMessage = `[${timestamp}] ERP Cashbook: Term fee receipt ₹24,000 compiled and synced with Ledger`;
    } else if (serviceId === "coaching") {
      logMessage = `[${timestamp}] Batch Alert: Automated WhatsApp progress card dispatched to 48 parents`;
    } else if (serviceId === "farming") {
      logMessage = `[${timestamp}] AgriFusion POS: Agro-feed sales invoice #AG-9102 logged. Flock temp at 24.2°C`;
    } else if (serviceId === "members") {
      logMessage = `[${timestamp}] Bullion Rate Feed: 24K Pure Gold locked at ₹72,500/10g across all billing counters`;
    } else if (serviceId === "crm") {
      logMessage = `[${timestamp}] Lead Pipeline: Deal 'Apex Logistics' moved to Proposal Sent (Win Prob: 85%)`;
    } else if (serviceId === "ai-social") {
      logMessage = `[${timestamp}] AI Social Agent: Viral campaign published to LinkedIn & X. Ingested 340 engagement signals`;
    } else if (serviceId === "ai-support") {
      logMessage = `[${timestamp}] AI Neural Agent: Query #CS-9102 resolved in 0.6s via Knowledge Base RAG`;
    } else if (serviceId === "ai-salesflow" || serviceId === "ai-sales") {
      logMessage = `[${timestamp}] SalesFlow AI: Qualified Enterprise lead. Booked demo on calendar & synced CRM`;
    } else if (serviceId === "ai-marketing") {
      logMessage = `[${timestamp}] AI Marketing: SEO cluster published & automated LinkedIn campaign dispatched`;
    } else if (serviceId === "ai-admissions") {
      logMessage = `[${timestamp}] AI Admissions Agent: Candidate matched with B.Tech CSE (Campus tour booked for Sat)`;
    } else if (serviceId === "ai-library") {
      logMessage = `[${timestamp}] AI Library Agent: Semantic search retrieved 4 Discrete Math references & generated summary`;
    } else if (serviceId === "ai-farm") {
      logMessage = `[${timestamp}] AI Agro Agent: Leaf scan diagnosed early blight. Organic bio-fungicide recipe dispatched`;
    } else if (serviceId === "ai-fitness") {
      logMessage = `[${timestamp}] AI Fitness Coach: 4-week Hypertrophy & Protein macro card compiled for Member #419`;
    } else if (serviceId === "ai-omr") {
      logMessage = `[${timestamp}] AI OMR Agent: Evaluated 450 Physics answer sheets in 84s. Dispatched WhatsApp cards`;
    } else {
      logMessage = `[${timestamp}] Autonomous Task: Action '${actionTitle}' executed successfully with zero latency`;
    }

    setInteractiveLogs(prev => ({
      ...prev,
      [serviceId]: [logMessage, ...(prev[serviceId] || [])].slice(0, 5)
    }));
    setSimulatedScore(prev => prev + 1);
  };

  const currentLogs = interactiveLogs[selectedService.id] || selectedService.mockData.recentActivity;

  return (
    <section id={id} className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200 relative overflow-hidden">
      
      {/* Background subtle radial glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#42A5F5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-900 text-brand-gold-400 text-xs font-mono font-bold tracking-widest uppercase shadow-xs border border-brand-gold-500/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold-400 animate-pulse" />
            <span>C VIDYA COMPLETE SERVICES SUITE</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-brand-navy-950 tracking-tight uppercase leading-none">
            INTELLIGENT SAAS PRODUCTS & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-600 via-[#d69e2e] to-[#42A5F5]">
              AUTONOMOUS AI AGENTS
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-700 font-semibold leading-relaxed max-w-2xl mx-auto">
            Choose between our core <strong>C Vidya Solutions SaaS Products</strong> for comprehensive enterprise management, or explore our <strong>C Vidya AI Agent Suite</strong> for 24/7 autonomous intelligence.
          </p>
        </div>

        {/* DUAL CATEGORY SWITCHER / TABS (Both sides separate and clickable) */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="p-1.5 bg-slate-200/80 rounded-2xl flex flex-col sm:flex-row gap-2 border border-slate-300 shadow-inner">
            
            {/* Tab 1: C Vidya Solutions SaaS Products */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("saas");
              }}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-display font-extrabold text-xs sm:text-sm tracking-wide transition-all cursor-pointer border-none ${
                activeCategory === "saas"
                  ? "bg-brand-navy-950 text-white shadow-lg shadow-brand-navy-950/20 ring-1 ring-brand-gold-500/50"
                  : "bg-transparent text-slate-700 hover:text-brand-navy-950 hover:bg-white/60"
              }`}
            >
              <Laptop className={`w-4 h-4 sm:w-5 sm:h-5 ${activeCategory === "saas" ? "text-brand-gold-400" : "text-slate-500"}`} />
              <div className="text-left">
                <div className="uppercase">C Vidya Solutions SaaS Products</div>
                <div className={`text-[10px] font-mono font-normal tracking-normal ${activeCategory === "saas" ? "text-brand-gold-300" : "text-slate-500"}`}>
                  7 Core Cloud Enterprise Systems
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ml-auto ${
                activeCategory === "saas" ? "bg-brand-gold-500 text-slate-950" : "bg-slate-300 text-slate-700"
              }`}>
                {saasProductsData.length} SaaS
              </span>
            </button>

            {/* Tab 2: C Vidya AI Agents (AI Software as a SaaS) */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory("ai-agent");
              }}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-display font-extrabold text-xs sm:text-sm tracking-wide transition-all cursor-pointer border-none ${
                activeCategory === "ai-agent"
                  ? "bg-brand-navy-950 text-white shadow-lg shadow-brand-navy-950/20 ring-1 ring-[#42A5F5]/50"
                  : "bg-transparent text-slate-700 hover:text-brand-navy-950 hover:bg-white/60"
              }`}
            >
              <Bot className={`w-4 h-4 sm:w-5 sm:h-5 ${activeCategory === "ai-agent" ? "text-[#42A5F5]" : "text-slate-500"}`} />
              <div className="text-left">
                <div className="uppercase">C Vidya AI Agents (AI SaaS)</div>
                <div className={`text-[10px] font-mono font-normal tracking-normal ${activeCategory === "ai-agent" ? "text-[#42A5F5]" : "text-slate-500"}`}>
                  {aiAgentsData.length} Autonomous AI Agents
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ml-auto ${
                activeCategory === "ai-agent" ? "bg-[#42A5F5] text-slate-950" : "bg-slate-300 text-slate-700"
              }`}>
                {aiAgentsData.length} Agents
              </span>
            </button>

          </div>
        </div>

        {/* MAIN PRODUCT EXPLORER GRID: Left List of All Items, Right Interactive Live Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: All Products / Agents in a clean interactive list */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
              <span>Select {activeCategory === "saas" ? "SaaS Product" : "AI Agent"}</span>
            </div>

            {currentProducts.map((product) => {
              const isSelected = selectedService.id === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (activeCategory === "saas") {
                      setSelectedSaasId(product.id);
                    } else {
                      setSelectedAgentId(product.id);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? activeCategory === "saas"
                        ? "bg-white border-brand-gold-500 shadow-md ring-2 ring-brand-gold-400/40"
                        : "bg-white border-[#42A5F5] shadow-md ring-2 ring-[#42A5F5]/40"
                      : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Selected Indicator Bar */}
                  {isSelected && (
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                      activeCategory === "saas" ? "bg-brand-gold-500" : "bg-[#42A5F5]"
                    }`} />
                  )}

                  <div className="flex items-start gap-3.5 pl-1">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? activeCategory === "saas"
                          ? "bg-brand-navy-950 text-brand-gold-400 shadow-sm"
                          : "bg-brand-navy-950 text-[#42A5F5] shadow-sm"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {getProductIcon(product.id, "w-5 h-5")}
                    </div>

                    {/* Information block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          #{product.num}
                        </span>
                      </div>

                      <h4 className="font-display font-extrabold text-sm sm:text-base text-brand-navy-950 tracking-tight truncate mt-0.5 group-hover:text-brand-gold-600 transition-colors">
                        {product.name}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 font-medium">
                        {product.tagline}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-400 font-mono text-[10px]">
                          {product.features.length} Features Included
                        </span>
                        
                        {product.externalLink ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSoftware(product);
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                              activeCategory === "saas"
                                ? "bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 border-brand-gold-600/30"
                                : "bg-[#42A5F5] hover:bg-blue-600 text-white border-blue-500/40"
                            }`}
                            title={`Open ${product.name}`}
                          >
                            <span>Click here</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Emulator / Neural Sandbox Console */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-6">
              
              {/* Main Preview Card */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                
                {/* Console Top Bar */}
                <div className="bg-brand-navy-950 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-brand-gold-500/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      activeCategory === "saas" ? "bg-brand-gold-500 text-slate-950" : "bg-[#42A5F5] text-slate-950"
                    }`}>
                      {getProductIcon(selectedService.id, "w-5 h-5")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-brand-gold-400 uppercase">
                          {activeCategory === "saas" ? "LIVE SAAS DASHBOARD" : "AUTONOMOUS AI CONSOLE"}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-white leading-tight uppercase">
                        {selectedService.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalSoftware(selectedService)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-brand-gold-400" />
                      <span>See more</span>
                    </button>

                    {selectedService.externalLink && (
                      <button
                        type="button"
                        onClick={() => handleOpenSoftware(selectedService)}
                        className="px-3.5 py-1.5 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer border-none"
                      >
                        <span>Click here</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Dashboard Metrics Grid */}
                <div className="p-5 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                      Live Telemetry & Metrics
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      ● Active Production Instance
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedService.mockData.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 block truncate">
                          {metric.label}
                        </span>
                        <div className="font-display font-black text-lg sm:text-xl text-brand-navy-950">
                          {metric.value}
                        </div>
                        {metric.change && (
                          <div className={`text-[10px] font-bold truncate ${
                            metric.isPositive !== false ? "text-emerald-600" : "text-amber-600"
                          }`}>
                            {metric.change}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Simulator Trigger Toolbar */}
                <div className="p-5 border-b border-slate-100 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-brand-gold-600" />
                      <span>Simulate Live Action / Workflow</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Events Run: {simulatedScore}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => triggerSimulationAction(selectedService.id, "Primary Process Action")}
                      className="px-3.5 py-2 bg-brand-navy-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-none shadow-xs"
                    >
                      <Zap className="w-3 h-3 text-brand-gold-400" />
                      <span>Trigger Real-time Event</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => triggerSimulationAction(selectedService.id, "Sync Cloud Database")}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
                    >
                      <Activity className="w-3 h-3 text-brand-gold-600" />
                      <span>Sync Remote State</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenInquiry) {
                          onOpenInquiry(selectedService.name);
                        } else {
                          const inqElem = document.getElementById("inquiry") || document.getElementById("contact");
                          inqElem?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-amber-200 ml-auto"
                    >
                      <MessageSquare className="w-3 h-3 text-amber-700" />
                      <span>Request Demo</span>
                    </button>
                  </div>
                </div>

                {/* Terminal Activity Log & Features List */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50/50">
                  
                  {/* Features List */}
                  <div className="space-y-2.5">
                    <h5 className="font-display font-extrabold text-xs text-brand-navy-900 uppercase tracking-wide">
                      Core Modules & Capabilities
                    </h5>
                    <ul className="space-y-2">
                      {selectedService.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-slate-700 flex items-start gap-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real-time Log Stream */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-display font-extrabold text-xs text-brand-navy-900 uppercase tracking-wide">
                        Live Event Stream
                      </h5>
                      <span className="text-[9px] font-mono text-slate-400">AES-256 Encrypted</span>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1.5 h-44 overflow-y-auto border border-slate-800">
                      {currentLogs.map((log, lIdx) => (
                        <div key={lIdx} className="text-slate-300 border-l-2 border-brand-gold-500 pl-2 leading-relaxed">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer specs button */}
                <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-semibold">
                    STPI Sindri Verified Architecture • Multi-Tenant Scale Ready
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalSoftware(selectedService)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-gold-600 hover:text-brand-gold-700 cursor-pointer border-none bg-transparent"
                  >
                    <span>View Comprehensive Architecture Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* FULL SCREEN LIVE SOFTWARE VIEWER WITH DEDICATED 'BACK TO WEBSITE & SERVICES' TOP BAR */}
      <AnimatePresence>
        {liveAppViewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
          >
            {/* Top Navigation Bar with Clear Back Button */}
            <div className="h-14 bg-brand-navy-950 text-white px-4 sm:px-6 flex items-center justify-between border-b border-brand-gold-500/30 shrink-0 shadow-xl z-10">
              
              {/* Back Button with Arrow */}
              <button
                type="button"
                onClick={() => {
                  setLiveAppViewing(null);
                  setTimeout(() => {
                    const elem = document.getElementById(id) || document.getElementById("services");
                    elem?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="flex items-center gap-2.5 px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 rounded-xl font-display font-black text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer border-none"
              >
                <ArrowLeft className="w-5 h-5 text-slate-950 stroke-[3]" />
                <span className="tracking-wide">Back</span>
              </button>

              {/* Center App Name */}
              <div className="flex items-center">
                <span className="font-display font-black text-xs sm:text-sm uppercase text-white tracking-wide">
                  {liveAppViewing.name}
                </span>
              </div>

              {/* Right Close Button */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setLiveAppViewing(null)}
                  className="p-2 bg-white/10 hover:bg-red-500/30 text-white hover:text-red-300 rounded-lg text-xs font-bold transition-all cursor-pointer border-none"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Live App Frame & Loader */}
            <div className="flex-1 relative bg-slate-900 w-full h-full overflow-hidden">
              {frameLoading && (
                <div className="absolute inset-0 z-10 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold-500/10 border border-brand-gold-500/30 flex items-center justify-center mb-4 text-brand-gold-400 animate-spin">
                    <RotateCw className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-black text-lg text-white uppercase tracking-wider">
                    Loading {liveAppViewing.name}
                  </h4>
                </div>
              )}

              <iframe
                key={frameKey}
                src={liveAppViewing.externalLink}
                title={liveAppViewing.name}
                onLoad={() => setFrameLoading(false)}
                className="w-full h-full border-none bg-white"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Detailed Documentation Modal */}
      <SoftwareDetailModal
        software={modalSoftware}
        onClose={() => setModalSoftware(null)}
        onOpenInquiry={onOpenInquiry}
      />
    </section>
  );
}
