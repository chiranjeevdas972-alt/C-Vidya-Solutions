import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProductService } from "../types";
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ArrowRight,
  BookOpen, 
  Flame, 
  GraduationCap, 
  Award, 
  Briefcase, 
  ShieldAlert, 
  Sprout, 
  Gem,
  Laptop,
  Activity,
  PhoneCall
} from "lucide-react";

interface SoftwareDetailModalProps {
  software: ProductService | null;
  onClose: () => void;
  onOpenInquiry?: (softwareName?: string) => void;
}

export default function SoftwareDetailModal({ software, onClose, onOpenInquiry }: SoftwareDetailModalProps) {
  // Lock body scroll and attach ESC listener when opened
  useEffect(() => {
    if (software) {
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
  }, [software, onClose]);

  if (!software) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case "library": return <BookOpen className="w-8 h-8 text-brand-gold-400" />;
      case "fitness": return <Flame className="w-8 h-8 text-brand-gold-400" />;
      case "institutes": return <GraduationCap className="w-8 h-8 text-brand-gold-400" />;
      case "coaching": return <Award className="w-8 h-8 text-brand-gold-400" />;
      case "crm": return <Briefcase className="w-8 h-8 text-brand-gold-400" />;
      case "ai-social": return <Sparkles className="w-8 h-8 text-[#42A5F5]" />;
      case "ai-support": case "municipal": return <Sparkles className="w-8 h-8 text-brand-gold-400" />;
      case "ai-admissions": return <GraduationCap className="w-8 h-8 text-[#42A5F5]" />;
      case "ai-library": return <BookOpen className="w-8 h-8 text-[#42A5F5]" />;
      case "ai-farm": return <Sprout className="w-8 h-8 text-[#42A5F5]" />;
      case "ai-salesflow": case "ai-sales": case "ai-marketing": return <Zap className="w-8 h-8 text-[#42A5F5]" />;
      case "ai-fitness": return <Activity className="w-8 h-8 text-[#42A5F5]" />;
      case "ai-omr": return <ShieldCheck className="w-8 h-8 text-[#42A5F5]" />;
      case "farming": return <Sprout className="w-8 h-8 text-brand-gold-400" />;
      case "members": return <Gem className="w-8 h-8 text-brand-gold-400" />;
      default: return <Laptop className="w-8 h-8 text-brand-gold-400" />;
    }
  };

  const handleInquiry = () => {
    onClose();
    if (onOpenInquiry) {
      onOpenInquiry(software.name);
    } else {
      const inquiryElem = document.getElementById("inquiry") || document.getElementById("contact");
      if (inquiryElem) {
        inquiryElem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key={software.id}
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="fixed inset-0 z-50 w-full h-full min-h-screen bg-slate-50 overflow-y-auto flex flex-col"
      >
        {/* Sticky Top Full Page Header */}
        <div className="sticky top-0 z-30 bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-slate-900 text-white shadow-xl border-b border-brand-gold-500/30 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/15"
            >
              <ArrowRight className="w-4 h-4 rotate-180 text-brand-gold-400" />
              <span>Back to All Software</span>
            </button>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-xs text-brand-gold-400 font-bold">
                SOFTWARE MODULE #{software.num}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-slate-300 font-semibold">{software.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {software.externalLink && (
              <a
                href={software.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Live App ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close page"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Full Page Hero & Content Body */}
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 md:p-10 space-y-10">
          
          {/* Top Main Hero Section */}
          <div className="bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-brand-gold-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-gold-400 bg-brand-gold-500/15 px-3 py-1 rounded-lg border border-brand-gold-500/30">
                    Software Module #{software.num}
                  </span>
                  {software.externalLink && (
                    <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/15 px-3 py-1 rounded-lg border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Platform Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold-500/20 border border-brand-gold-500/40 flex items-center justify-center shrink-0 shadow-lg">
                    {getIcon(software.id)}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {software.name}
                    </h1>
                    <p className="text-xs sm:text-sm font-mono font-bold text-brand-gold-400 uppercase tracking-wider mt-1">
                      {software.tagline}
                    </p>
                  </div>
                </div>

                {software.subhead && (
                  <p className="text-sm font-bold text-emerald-300 italic bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/50 inline-block">
                    {software.subhead}
                  </p>
                )}

                <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                  {software.description}
                </p>

                <div className="flex items-center gap-3 pt-2 flex-wrap">
                  {software.externalLink && (
                    <a
                      href={software.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer group"
                    >
                      <span>Click Here To Open Full Platform ↗</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  <button
                    onClick={handleInquiry}
                    className="px-6 py-3.5 bg-white text-brand-navy-950 hover:bg-slate-100 font-extrabold rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-brand-navy-900" />
                    <span>Get Pricing & On-Site Setup</span>
                  </button>
                </div>
              </div>

              {/* Quick Summary Card */}
              <div className="w-full lg:w-80 bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl space-y-4 shrink-0 shadow-xl">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  MODULE SPECS AT A GLANCE
                </h3>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Deployment</span>
                    <span className="font-bold text-white">Cloud + Local Node</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Security</span>
                    <span className="font-bold text-emerald-400">256-Bit SSL Encrypted</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Database</span>
                    <span className="font-bold text-brand-gold-400">PostgreSQL / Cloud</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hardware Sync</span>
                    <span className="font-bold text-white">Turnstiles & Scanners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Screen Software Screenshot Gallery */}
          {software.imageUrl && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-extrabold text-brand-navy-950 flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-brand-gold-600" />
                  Full High-Resolution Software Dashboard Preview
                </h2>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">
                  Official UI Interface
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-950 group">
                <img 
                  src={software.imageUrl} 
                  alt={`${software.name} Official Dashboard`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[580px] object-cover object-top group-hover:scale-101 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="flex items-center justify-between w-full text-white text-xs sm:text-sm font-mono font-bold">
                    <span className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-700 backdrop-blur-md">
                      {software.name} Core Dashboard
                    </span>
                    <span className="text-brand-gold-400 bg-brand-navy-950/90 px-4 py-2 rounded-xl border border-brand-gold-500/30">
                      Click Here to Access Live App ↗
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Features & System Capabilities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy-950 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Zap className="w-6 h-6 text-brand-gold-600" />
              Comprehensive Features & Operational Workflows
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {software.features.map((feature, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-brand-gold-400 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-900 leading-snug block">
                      {feature}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Fully automated & integrated with real-time alert logs.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry & Live Metrics Section */}
          {software.mockData && (
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-gold-400">
                    REAL-TIME SYSTEM METRICS & PERFORMANCE
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {software.mockData.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-bold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>Live Operational Status</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {software.mockData.metrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-1">
                    <div className="text-xs text-slate-400 font-mono font-semibold">{m.label}</div>
                    <div className="text-xl sm:text-2xl font-black text-brand-gold-400">{m.value}</div>
                    <div className="text-xs text-emerald-400 font-medium">{m.change}</div>
                  </div>
                ))}
              </div>

              {/* Activity Logs */}
              {software.mockData.recentActivity && software.mockData.recentActivity.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Recent System Activity Logs
                  </span>
                  <div className="space-y-2">
                    {software.mockData.recentActivity.map((act, i) => (
                      <div key={i} className="text-xs sm:text-sm font-mono text-slate-300 flex items-center gap-2 p-2 rounded bg-slate-950/50 border border-slate-800">
                        <span className="text-brand-gold-400 font-bold">›</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-900 space-y-2 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-amber-600" />
              <h3 className="text-sm font-extrabold uppercase text-amber-950">Offline + Cloud Auto-Sync</h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Works seamlessly during internet outages, queuing records locally and syncing securely once connectivity restores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-900 space-y-2 shadow-sm">
              <Zap className="w-7 h-7 text-emerald-600" />
              <h3 className="text-sm font-extrabold uppercase text-emerald-950">WhatsApp & Biometrics</h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Direct integration with turnstile gate hardware, facial recognition readers, and instant WhatsApp parent alerts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-slate-900 space-y-2 shadow-sm">
              <Layers className="w-7 h-7 text-blue-600" />
              <h3 className="text-sm font-extrabold uppercase text-blue-950">On-Site Engineering Support</h3>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Complete hardware installation, staff training, and 24x7 local support directly from C Vidya Solutions in Dhanbad.
              </p>
            </div>
          </div>

          {/* Bottom Full Page CTA Footer Banner */}
          <div className="p-8 sm:p-10 bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-slate-900 text-white rounded-3xl border border-brand-gold-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-xs font-bold text-brand-gold-400 uppercase tracking-widest">
                C VIDYA ENTERPRISE DEPLOYMENT
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Interested in deploying {software.name}?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Our local engineering team will guide you through custom feature configuration, data migration, and hardware setup.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
              {software.externalLink && (
                <a
                  href={software.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Live Platform ↗</span>
                </a>
              )}
              <button
                onClick={handleInquiry}
                className="px-6 py-3.5 bg-white text-brand-navy-950 font-extrabold rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg hover:bg-slate-100 cursor-pointer"
              >
                <span>Contact Sales</span>
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
