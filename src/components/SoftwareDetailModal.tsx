import React, { useState, useEffect, useRef } from "react";
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
  Sprout, 
  Gem,
  Laptop,
  Activity,
  Server,
  Radio,
  Clock,
  HardDrive,
  MessageSquare,
  Users,
  Wrench,
  Headphones,
  Check,
  ChevronRight
} from "lucide-react";

interface SoftwareDetailModalProps {
  software: ProductService | null;
  onClose: () => void;
  onOpenInquiry?: (softwareName?: string) => void;
}

type DetailPageType = "offline-sync" | "whatsapp-biometrics" | "onsite-support" | null;

export default function SoftwareDetailModal({ software, onClose, onOpenInquiry }: SoftwareDetailModalProps) {
  const [activeDetailPage, setActiveDetailPage] = useState<DetailPageType>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top whenever software or subpage changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [software, activeDetailPage]);

  // Lock body scroll and attach ESC listener when opened
  useEffect(() => {
    if (software) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (activeDetailPage) {
            setActiveDetailPage(null);
          } else {
            onClose();
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [software, activeDetailPage, onClose]);

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

  const handleInquiry = (serviceTopic?: string) => {
    onClose();
    if (onOpenInquiry) {
      onOpenInquiry(serviceTopic || software.name);
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
        ref={containerRef}
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
              onClick={() => {
                if (activeDetailPage) {
                  setActiveDetailPage(null);
                } else {
                  onClose();
                }
              }}
              className="flex items-center gap-2.5 px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wide transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer border-none"
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-slate-950 stroke-[3]" />
              <span>{activeDetailPage ? "Back to Software" : "Back"}</span>
            </button>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-xs text-brand-gold-400 font-bold">
                SOFTWARE MODULE #{software.num}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-slate-300 font-semibold">
                {activeDetailPage 
                  ? activeDetailPage === "offline-sync" 
                    ? "Offline + Cloud Auto-Sync Architecture" 
                    : activeDetailPage === "whatsapp-biometrics"
                    ? "WhatsApp & Biometrics Integration"
                    : "On-Site Engineering Support"
                  : software.name
                }
              </span>
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
                <span>Click here ↗</span>
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

        {/* ------------------------------------------------------------- */}
        {/* SUBPAGE 1: OFFLINE + CLOUD AUTO-SYNC ARCHITECTURE */}
        {/* ------------------------------------------------------------- */}
        {activeDetailPage === "offline-sync" && (
          <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 md:p-10 space-y-8 animate-fadeIn">
            {/* Header Hero */}
            <div className="bg-gradient-to-br from-amber-950 via-slate-950 to-brand-navy-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-amber-500/30 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Zero-Downtime Resilience Engine</span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight uppercase">
                  Offline + Cloud Auto-Sync Architecture
                </h1>
                <p className="text-sm sm:text-base text-slate-200 font-medium max-w-3xl leading-relaxed">
                  Engineered specifically for Indian conditions where internet connectivity can be intermittent. Your front-desk counter, barcode checkout, admission entry, and turnstile gates continue processing operations without internet delay.
                </p>
              </div>
            </div>

            {/* Deep Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <HardDrive className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Local SQLite & IndexedDB Cache</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All active student records, book catalogs, gym check-ins, and POS invoices are stored in an encrypted local database. Transactions complete in under 20 milliseconds with zero server latency.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Automatic Conflict-Free Sync</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As soon as internet connectivity is detected, our background worker synchronizes offline event queues directly to Google Cloud Firestore with zero data overwrites or duplicate entries.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Edge Node Replication</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Synchronized records are distributed across Cloudflare global edge nodes, giving administrators multi-branch live visibility from any smartphone or tablet anywhere.
                </p>
              </div>
            </div>

            {/* Architecture Details Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-display font-black text-lg text-slate-900 uppercase">
                Technical Highlights & Recovery Guarantees
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "72+ Hours Continuous Offline Queueing Capacity",
                  "Atomic Transaction Rollbacks on Power Failure",
                  "256-Bit AES Encrypted Local Storage",
                  "Automated Differential Cloud Synchronization",
                  "Zero Network Hang or Frozen Screen UI",
                  "Automatic Daily Cloud Snapshot Backups"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                    <span className="text-xs font-bold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <div>
                <h4 className="font-display font-extrabold text-sm text-slate-900 uppercase">Need Offline Deployment for {software.name}?</h4>
                <p className="text-xs text-slate-600">Our local engineering team configures local hardware caching and cloud sync for your facility.</p>
              </div>
              <button
                onClick={() => handleInquiry(`Offline Sync Setup for ${software.name}`)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
              >
                Inquire Setup
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUBPAGE 2: WHATSAPP & BIOMETRICS INTEGRATION */}
        {/* ------------------------------------------------------------- */}
        {activeDetailPage === "whatsapp-biometrics" && (
          <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 md:p-10 space-y-8 animate-fadeIn">
            {/* Header Hero */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-950 to-brand-navy-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-500/30 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase">
                  <Zap className="w-4 h-4" />
                  <span>Hardware & Omnichannel Broadcast Engine</span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight uppercase">
                  WhatsApp & Biometrics Integration
                </h1>
                <p className="text-sm sm:text-base text-slate-200 font-medium max-w-3xl leading-relaxed">
                  Eliminate manual roll calls and payment follow-up calls. Directly link attendance turnstiles, biometric scanners, and RFID smart cards to official Meta WhatsApp Business API pipelines.
                </p>
              </div>
            </div>

            {/* Deep Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Turnstiles & RFID Hardware</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seamlessly connects with tripod turnstiles, optical flap barriers, biometric fingerprint readers, and RFID wristbands. Gate unlocks in 0.3s for verified active memberships.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Instant WhatsApp Parent/Member Alerts</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parents receive immediate WhatsApp notifications when a student enters or exits campus. Gym members receive automatic overdue fee reminders with one-click UPI payment links.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Automated Fee Enforcement</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When a subscription expires, turnstile gates automatically lock access and guide the member to the payment counter, reducing unpaid fee revenue leakage to zero.
                </p>
              </div>
            </div>

            {/* Architecture Details Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-display font-black text-lg text-slate-900 uppercase">
                Supported Hardware & Messaging Protocols
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Official Meta Verified WhatsApp Business API",
                  "Hikvision, ZKTeco, and ESSL Biometric Device Sync",
                  "RFID Wristbands, NFC Cards, & QR Digital Passes",
                  "Automated Absentee Parent Notification Broadcasts",
                  "Digital Fee Invoices with Instant UPI QR Pay",
                  "Real-Time Floor Occupancy & Peak Heatmap Tracking"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                    <span className="text-xs font-bold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <div>
                <h4 className="font-display font-extrabold text-sm text-slate-900 uppercase">Configure Hardware & WhatsApp for {software.name}</h4>
                <p className="text-xs text-slate-600">We provide turnkey hardware integration, on-site turnstile wiring, and WhatsApp API registration.</p>
              </div>
              <button
                onClick={() => handleInquiry(`WhatsApp & Biometrics Setup for ${software.name}`)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
              >
                Request Hardware Setup
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SUBPAGE 3: ON-SITE ENGINEERING SUPPORT */}
        {/* ------------------------------------------------------------- */}
        {activeDetailPage === "onsite-support" && (
          <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 md:p-10 space-y-8 animate-fadeIn">
            {/* Header Hero */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-950 to-brand-navy-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-blue-500/30 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-mono font-bold uppercase">
                  <Layers className="w-4 h-4" />
                  <span>STPI Sindri Local Field Support</span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight uppercase">
                  On-Site Engineering Support
                </h1>
                <p className="text-sm sm:text-base text-slate-200 font-medium max-w-3xl leading-relaxed">
                  Unlike remote-only software vendors, C Vidya Solutions deploys certified field engineers directly to your campus, gym, clinic, or farm in Dhanbad, Sindri, Baliapur, and across Jharkhand.
                </p>
              </div>
            </div>

            {/* Deep Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Complete Hardware Deployment</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our team handles end-to-end installation of biometric machines, barcode scanners, turnstile gates, thermal receipt printers, and local LAN servers.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Dedicated Staff Training</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We provide 1-on-1 practical training for librarians, front-desk receptionists, trainers, and accountants so your entire staff is confident using the system from Day 1.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900">24x7 Local Dhanbad Helpline</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct phone access to our STPI Sindri development lab with rapid on-site technician dispatch for hardware servicing and system maintenance.
                </p>
              </div>
            </div>

            {/* Architecture Details Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-display font-black text-lg text-slate-900 uppercase">
                On-Site SLA & Service Guarantees
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "On-Premises Hardware Mounting & Network Cabling",
                  "Full Historical Data Migration from Old Excel / Ledgers",
                  "Staff Hindi/English Operational Handbooks Included",
                  "Same-Day Physical Technician Visit for Urgent Faults",
                  "Quarterly Preventative Health Audits & Updates",
                  "Incubated & Certified at STPI Sindri, BIT Sindri Campus"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 stroke-[3]" />
                    <span className="text-xs font-bold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
              <div>
                <h4 className="font-display font-extrabold text-sm text-slate-900 uppercase">Schedule On-Site Consultation for {software.name}</h4>
                <p className="text-xs text-slate-600">Call our direct engineering desk at 8987766981 / +91 9288517027.</p>
              </div>
              <button
                onClick={() => handleInquiry(`On-Site Engineering Support for ${software.name}`)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
              >
                Book Field Engineer
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MAIN SOFTWARE OVERVIEW PAGE (When no subpage is active) */}
        {/* ------------------------------------------------------------- */}
        {!activeDetailPage && (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 md:p-10 space-y-10">
            
            {/* Top Main Hero Section */}
            <div className="bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-brand-gold-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand-gold-500/20 border border-brand-gold-500/40 flex items-center justify-center shrink-0 shadow-lg">
                      {getIcon(software.id)}
                    </div>
                    <div>
                      <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight uppercase">
                        {software.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-bold text-brand-gold-400 uppercase tracking-wider">
                          {software.categoryType === "ai-agent" ? "Autonomous AI Agent Engine" : "Enterprise SaaS Architecture"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                    {software.description}
                  </p>
                </div>

                {/* Quick Summary Card */}
                <div className="w-full lg:w-80 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-3 shrink-0">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-300">
                    Module Specs at a Glance
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-400">Deployment</span>
                      <span className="text-white font-bold">Cloud + Local Node</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-400">Security</span>
                      <span className="text-emerald-400 font-bold">256-Bit SSL Encrypted</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-400">Database</span>
                      <span className="text-brand-gold-400 font-bold">PostgreSQL / Cloud</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hardware Sync</span>
                      <span className="text-white font-bold">Turnstiles & Scanners</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Resolution Dashboard Preview Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xl text-slate-900 uppercase flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-brand-gold-600" />
                  <span>Full High-Resolution Software Dashboard Preview</span>
                </h3>
                <span className="text-xs font-mono text-slate-500 font-bold bg-slate-200 px-3 py-1 rounded-full">
                  Official UI Interface
                </span>
              </div>

              <div className="rounded-3xl overflow-hidden border-2 border-slate-300/80 shadow-2xl bg-slate-900 group relative">
                <img
                  src={software.imageUrl || "/og-image.png"}
                  alt={`${software.name} Full UI Interface Preview`}
                  className="w-full h-auto object-cover object-top max-h-[700px] hover:scale-[1.01] transition-transform duration-500"
                  loading="eager"
                />
              </div>
            </div>

            {/* Core Modules & Full Feature Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Feature Highlights */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-gold-500/10 text-brand-gold-600">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 uppercase">
                      Core Enterprise Capabilities
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Standard built-in modules included in this deployment</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {software.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-navy-900/10 text-brand-navy-950">
                    <Layers className="w-6 h-6 text-brand-navy-950" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 uppercase">
                      Architecture & Compliance Specs
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Cloud security & performance certifications</p>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Edge Cloud Latency</span>
                    <p className="text-slate-900 font-bold font-sans">
                      &lt;50ms response times hosted across Cloudflare global edge clusters.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Data Security & Encryption</span>
                    <p className="text-slate-900 font-bold font-sans">
                      AES-256 at rest, TLS 1.3 in transit with zero-trust database rule segmentation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Hardware Integrations</span>
                    <p className="text-slate-900 font-bold font-sans">
                      USB/Bluetooth Barcode Readers, ZKTeco/Hikvision Biometric Gates, POS Thermal Printers.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Compliance & Support</span>
                    <p className="text-slate-900 font-bold font-sans">
                      Certified under STPI Sindri (BIT Sindri Campus) guidelines with 24/7 incident SLA.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Key Advantages Grid - CLICKABLE CARDS TO OPEN DETAILED PAGES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* CARD 1: Offline + Cloud Auto-Sync */}
              <button
                type="button"
                onClick={() => setActiveDetailPage("offline-sync")}
                className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/20 text-slate-900 space-y-2 shadow-sm text-left transition-all cursor-pointer group hover:scale-[1.02] active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck className="w-7 h-7 text-amber-600 group-hover:scale-110 transition-transform" />
                  <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-sm font-extrabold uppercase text-amber-950 flex items-center gap-1.5">
                  <span>Offline + Cloud Auto-Sync</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Works seamlessly during internet outages, queuing records locally and syncing securely once connectivity restores.
                </p>
                <div className="pt-2 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <span>Click to view architecture details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* CARD 2: WhatsApp & Biometrics */}
              <button
                type="button"
                onClick={() => setActiveDetailPage("whatsapp-biometrics")}
                className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/20 text-slate-900 space-y-2 shadow-sm text-left transition-all cursor-pointer group hover:scale-[1.02] active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <Zap className="w-7 h-7 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-sm font-extrabold uppercase text-emerald-950 flex items-center gap-1.5">
                  <span>WhatsApp & Biometrics</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Direct integration with turnstile gate hardware, facial recognition readers, and instant WhatsApp parent alerts.
                </p>
                <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Click to view hardware integration</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* CARD 3: On-Site Engineering Support */}
              <button
                type="button"
                onClick={() => setActiveDetailPage("onsite-support")}
                className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/20 text-slate-900 space-y-2 shadow-sm text-left transition-all cursor-pointer group hover:scale-[1.02] active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <Layers className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
                  <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-sm font-extrabold uppercase text-blue-950 flex items-center gap-1.5">
                  <span>On-Site Engineering Support</span>
                </h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Complete hardware installation, staff training, and 24x7 local support directly from C Vidya Solutions in Dhanbad.
                </p>
                <div className="pt-2 text-[11px] font-bold text-blue-700 flex items-center gap-1">
                  <span>Click to view field engineering support</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>

          </div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
