import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CoreServiceItem } from "../data";
import { 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  Code2, 
  Globe, 
  Receipt, 
  Server, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  PhoneCall,
  Check
} from "lucide-react";

interface CoreServiceDetailModalProps {
  service: CoreServiceItem | null;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

export default function CoreServiceDetailModal({
  service,
  onClose,
  onOpenConsultation
}: CoreServiceDetailModalProps) {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [service, onClose]);

  if (!service) return null;

  const renderIcon = () => {
    switch (service.iconType) {
      case "software":
        return <Code2 className="w-8 h-8 text-blue-400" />;
      case "web":
        return <Globe className="w-8 h-8 text-indigo-400" />;
      case "accounting":
        return <Receipt className="w-8 h-8 text-emerald-400" />;
      case "it":
        return <Server className="w-8 h-8 text-cyan-400" />;
      default:
        return <Cpu className="w-8 h-8 text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={service.id}
        initial={{ opacity: 0, scale: 0.99, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.99, y: 8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed inset-0 z-50 w-full h-full min-h-screen bg-slate-50 overflow-y-auto flex flex-col"
      >
        {/* Top Sticky Full-Page Header with Safe-Area Support */}
        <div className="sticky top-0 z-30 bg-[#071739] text-white shadow-xl border-b border-blue-900/50 px-3 sm:px-6 md:px-8 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))] pl-[max(0.75rem,env(safe-area-inset-left,0.75rem))] pr-[max(0.75rem,env(safe-area-inset-right,0.75rem))] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer border border-white/20 shrink-0"
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight truncate">
                {service.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full-Page Content Scroll Container */}
        <div className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8 animate-fadeIn">
          
          {/* Banner Overview Hero */}
          <div className="bg-gradient-to-br from-slate-900 via-[#071739] to-blue-950 text-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-blue-900/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-3.5 max-w-2xl min-w-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
                    {renderIcon()}
                  </div>
                </div>
                <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight break-words">
                  {service.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-blue-200 font-medium leading-relaxed">
                  {service.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                  {service.longDescription}
                </p>
              </div>

              {/* Highlights 2x2 / 1x4 adaptive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 shrink-0 w-full lg:w-auto lg:min-w-[280px]">
                {service.highlights.map((h, idx) => (
                  <div key={idx} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono font-medium tracking-wide">{h.label}</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1 break-words">{h.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Features & Functions */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Core Features &amp; Functional Capabilities
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              {service.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-400/60 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Architectural Capabilities */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Enterprise Capabilities &amp; Architecture
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {service.capabilities.map((cap, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200 shadow-xs space-y-2 hover:shadow-md transition-shadow">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-950 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    <span>{cap.title}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack & Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900 text-white space-y-3.5 shadow-md">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                <span>Production Technology Stack</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {service.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-800 text-slate-200 rounded-lg text-[11px] sm:text-xs font-mono font-medium border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-blue-50/80 border border-blue-200/60 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Turnkey Deliverables</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                {service.deliverables.map((del, idx) => (
                  <li key={idx} className="flex items-start sm:items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
                    <span className="leading-snug">{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Sticky Bottom Actions Bar with Safe-Area Support */}
        <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 sm:px-6 md:px-8 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] pl-[max(0.75rem,env(safe-area-inset-left,0.75rem))] pr-[max(0.75rem,env(safe-area-inset-right,0.75rem))] flex items-center justify-end shadow-lg">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <a
              href="tel:+919288517027"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 92885 17027</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenConsultation) {
                  onOpenConsultation();
                } else {
                  const el = document.getElementById("inquiry") || document.getElementById("contact");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>Explore Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
