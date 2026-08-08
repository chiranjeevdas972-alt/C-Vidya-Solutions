import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import libraryImg from "../assets/images/library_software_dashboard_1784909434916.jpg";
import coachingImg from "../assets/images/coaching_software_dashboard_1784909470078.jpg";
import fitnessImg from "../assets/images/fitness_software_dashboard_1784909454777.jpg";
import crmImg from "../assets/images/crm_software_dashboard_1784909507564.jpg";
import institutesImg from "../assets/images/institutes_software_dashboard_1784909550776.jpg";
import agrifusionImg from "../assets/images/agrifusion_software_dashboard_1784909491641.jpg";
import municipalImg from "../assets/images/municipal_software_dashboard_1784909536257.jpg";
import jewelryImg from "../assets/images/jewelry_software_dashboard_1784909522921.jpg";

import {
  BookOpen,
  GraduationCap,
  Activity,
  Users,
  Building2,
  Wheat,
  Landmark,
  Gem,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ExternalLink,
  Layers,
  LayoutDashboard,
  UserPlus,
  BarChart3,
  Receipt,
  QrCode,
  Sparkles,
  PhoneCall,
  Bot
} from "lucide-react";

export interface SoftwareProduct {
  id: string;
  name: string;
  category: string;
  badge: string; // e.g., "Cloud-Based Software"
  icon: React.ElementType;
  image: string;
  link?: string;
  description: string;
  modules: {
    title: string;
    badge: string;
    icon: React.ElementType;
    image: string;
    description: string;
  }[];
}

// All Software Products
export const SOFTWARE_PRODUCTS: SoftwareProduct[] = [
  {
    id: "library",
    name: "C Vidya Library Management",
    category: "Academic & Campus Tech",
    badge: "Cloud-Based Software",
    icon: BookOpen,
    image: libraryImg,
    link: "https://v.cvidyasolutions.workers.dev/",
    description: "Cloud-based circulation, barcode ISBN scanners, and digital member logs.",
    modules: [
      {
        title: "01. Admin Dashboard & Circulation",
        badge: "Barcode & ISBN",
        icon: LayoutDashboard,
        image: libraryImg,
        description: "Real-time book issue tracking, circulation stats, and barcode ISBN scanners."
      },
      {
        title: "02. Member & Student Registration",
        badge: "Digital Pass ID",
        icon: UserPlus,
        image: libraryImg,
        description: "Student profiles, borrowing history, QR pass cards, and catalog management."
      },
      {
        title: "03. Fee Collection & Due Analytics",
        badge: "Payment Receipts",
        icon: BarChart3,
        image: libraryImg,
        description: "Automated late fee calculator, SMS/WhatsApp receipts, and data analytics."
      }
    ]
  },
  {
    id: "coaching",
    name: "C Vidya Coaching Management",
    category: "EdTech & Learning",
    badge: "Cloud-Based Software",
    icon: GraduationCap,
    image: coachingImg,
    link: "https://coaching.cvidyasolutions.workers.dev/",
    description: "OMR test evaluation, batch attendance, fee receipts, and parent alerts.",
    modules: [
      {
        title: "01. Student & Course Dashboard",
        badge: "Performance Portal",
        icon: LayoutDashboard,
        image: coachingImg,
        description: "Class schedule, syllabus tracking, attendance graphs, and batch metrics."
      },
      {
        title: "02. Student & Batch Registration",
        badge: "Admissions Entry",
        icon: UserPlus,
        image: coachingImg,
        description: "Batch allocation, parent contacts, ID card generator, and documents."
      },
      {
        title: "03. Fee Collection & OMR Evaluation",
        badge: "OMR MCQ Scanner",
        icon: Receipt,
        image: coachingImg,
        description: "Instant 120 sheets/min OMR grading, installment receipts, and scorecards."
      }
    ]
  },
  {
    id: "fitness",
    name: "C Vidya Fitness & Access",
    category: "Gym & Access Control",
    badge: "Cloud-Based Software",
    icon: Activity,
    image: fitnessImg,
    link: "https://fitzone.cvidyasolutions.workers.dev/",
    description: "Biometric turnstile relays, facial access, and member subscription billing.",
    modules: [
      {
        title: "01. Gym Admin Dashboard",
        badge: "Active Members",
        icon: LayoutDashboard,
        image: fitnessImg,
        description: "Live turnstile check-ins, active memberships, and trainer schedules."
      },
      {
        title: "02. Member Registration & Gate Pass",
        badge: "Biometric & QR Pass",
        icon: QrCode,
        image: fitnessImg,
        description: "Facial recognition relay setup, member profiles, and mobile QR access."
      },
      {
        title: "03. Fee Collection & Renewal Alerts",
        badge: "Dues & Analytics",
        icon: BarChart3,
        image: fitnessImg,
        description: "Membership renewals, auto-expiry alerts, payment receipts, and revenue."
      }
    ]
  },
  {
    id: "crm",
    name: "C Vidya CRM System",
    category: "Enterprise Sales",
    badge: "Cloud-Based Software",
    icon: Users,
    image: crmImg,
    link: "https://crm.cvidyasolutions.workers.dev/",
    description: "Sales funnel optimization, dialer logs, lead stages, and client records.",
    modules: [
      {
        title: "01. Sales Funnel Dashboard",
        badge: "Lead Pipeline",
        icon: LayoutDashboard,
        image: crmImg,
        description: "Conversion metrics, deal stages, team targets, and active lead pipelines."
      },
      {
        title: "02. Lead Registration & Contact Logs",
        badge: "Dialer Sync",
        icon: PhoneCall,
        image: crmImg,
        description: "Instant call logs, inquiry capture, client notes, and follow-up reminders."
      },
      {
        title: "03. Revenue & Performance Analytics",
        badge: "Forecast Matrix",
        icon: BarChart3,
        image: crmImg,
        description: "Monthly revenue reports, agent performance, and closed deals ledger."
      }
    ]
  },
  {
    id: "institutes",
    name: "C Vidya Campus & School",
    category: "Campus Management",
    badge: "Campus ERP",
    icon: Building2,
    image: institutesImg,
    description: "CBSE compliance, multi-campus ledger, board marksheets, and bus tracking.",
    modules: [
      {
        title: "01. Campus Control Dashboard",
        badge: "Institutional Portal",
        icon: LayoutDashboard,
        image: institutesImg,
        description: "Multi-branch overview, attendance statistics, and academic calendars."
      },
      {
        title: "02. Student Admission & Transport",
        badge: "Registration Ledger",
        icon: UserPlus,
        image: institutesImg,
        description: "Admission registry, class sections, bus routes, and faculty allocation."
      },
      {
        title: "03. Tuition Fee & Exam Analytics",
        badge: "CBSE Marksheets",
        icon: Receipt,
        image: institutesImg,
        description: "Fee counter receipts, automated dues, report cards, and board marksheets."
      }
    ]
  },
  {
    id: "agrifusion",
    name: "AgriFusion Farming Tech",
    category: "Agribusiness & Farm",
    badge: "Cloud-Based Software",
    icon: Wheat,
    image: agrifusionImg,
    link: "https://fresh.cvidyasolutions.workers.dev/",
    description: "Poultry, granary sensor telemetry, livestock, and POS billing analytics.",
    modules: [
      {
        title: "01. Farm Operations Dashboard",
        badge: "Livestock & Yield",
        icon: LayoutDashboard,
        image: agrifusionImg,
        description: "Granary temperature telemetry, livestock count, and harvest analytics."
      },
      {
        title: "02. Feed & Crop Batch Registration",
        badge: "Inventory Entry",
        icon: UserPlus,
        image: agrifusionImg,
        description: "Batch tracking, feed distribution logs, supplier management, and stock."
      },
      {
        title: "03. POS Billing & Revenue Ledger",
        badge: "Financial Analytics",
        icon: BarChart3,
        image: agrifusionImg,
        description: "Market distribution POS receipts, daily sales, and profit margin reports."
      }
    ]
  },
  {
    id: "ai-support",
    name: "C Vidya AI Customer Support SaaS",
    category: "AI & Customer Tech",
    badge: "Cloud-Based Software",
    icon: Bot,
    image: crmImg,
    link: "https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/",
    description: "24/7 AI automated customer support SaaS, smart inquiry resolution, and knowledge base RAG.",
    modules: [
      {
        title: "01. AI Support Desk & Chat Bot",
        badge: "24/7 Instant AI",
        icon: LayoutDashboard,
        image: crmImg,
        description: "Automated inquiry resolution, intent recognition, and multi-channel chat."
      },
      {
        title: "02. Knowledge Base & RAG Sync",
        badge: "Smart Indexing",
        icon: UserPlus,
        image: crmImg,
        description: "Sync documentation, FAQs, and product manuals for instant accurate AI answers."
      },
      {
        title: "03. Ticket Escalation & CSAT",
        badge: "Analytics Console",
        icon: Receipt,
        image: crmImg,
        description: "SLA monitoring, human agent handover queue, and real-time satisfaction metrics."
      }
    ]
  },
  {
    id: "jewelry",
    name: "Retail & Jewelry POS",
    category: "Retail & Commerce",
    badge: "Cloud-Based Software",
    icon: Gem,
    image: jewelryImg,
    description: "Gold & silver rate integration, item barcoding, and GST tax invoicing.",
    modules: [
      {
        title: "01. Gold Rate & POS Terminal",
        badge: "Live Rate Billing",
        icon: LayoutDashboard,
        image: jewelryImg,
        description: "Daily metal rate sync, fast checkout terminal, and making charge calculator."
      },
      {
        title: "02. Item Barcoding & Stock Entry",
        badge: "Vault Tagging",
        icon: UserPlus,
        image: jewelryImg,
        description: "Tag barcoding, ornament purity certification, and vault inventory logs."
      },
      {
        title: "03. GST Tax Invoicing & Analytics",
        badge: "Sales Receipts",
        icon: Receipt,
        image: jewelryImg,
        description: "Thermal tax receipts, old gold exchange ledger, and daily profit reports."
      }
    ]
  }
];

// Software Auto-Rotate Groups (3 products per step)
// FIRST group: Library, Coaching, Fitness as requested!
const ROTATE_GROUPS = [
  [SOFTWARE_PRODUCTS[0], SOFTWARE_PRODUCTS[1], SOFTWARE_PRODUCTS[2]], // Library, Coaching, Fitness
  [SOFTWARE_PRODUCTS[3], SOFTWARE_PRODUCTS[4], SOFTWARE_PRODUCTS[5]], // CRM, Institutes, AgriFusion
  [SOFTWARE_PRODUCTS[6], SOFTWARE_PRODUCTS[7], SOFTWARE_PRODUCTS[0]]  // Municipal, Jewelry, Library
];

export default function SoftwareHeroBanner() {
  const [activeTab, setActiveTab] = useState<"auto" | string>("auto"); // "auto" for auto-rotator, or specific software id
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const TIMER_DURATION_MS = 3000; // 3 seconds timer

  // Auto-switch timer when in "auto" mode
  useEffect(() => {
    if (activeTab !== "auto" || isPaused) return;

    setProgress(0);
    const stepTime = 50;
    const totalSteps = TIMER_DURATION_MS / stepTime;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      setProgress((step / totalSteps) * 100);
      if (step >= totalSteps) {
        clearInterval(intervalRef.current!);
        setCurrentGroupIndex((prev) => (prev + 1) % ROTATE_GROUPS.length);
      }
    }, stepTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentGroupIndex, isPaused, activeTab]);

  const selectedProduct = SOFTWARE_PRODUCTS.find((p) => p.id === activeTab);

  const handleNextGroup = () => {
    setCurrentGroupIndex((prev) => (prev + 1) % ROTATE_GROUPS.length);
    setProgress(0);
  };

  const handlePrevGroup = () => {
    setCurrentGroupIndex((prev) => (prev - 1 + ROTATE_GROUPS.length) % ROTATE_GROUPS.length);
    setProgress(0);
  };

  return (
    <div 
      className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:p-4 text-white shadow-xl overflow-hidden relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Header Navigation Row */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-2.5 w-2.5 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold text-brand-gold-400 truncate uppercase tracking-wider">
            {activeTab === "auto"
              ? ""
              : selectedProduct?.name}
          </span>
        </div>

        {/* Auto-Rotate Controls if in Auto Mode */}
        {activeTab === "auto" ? (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              {ROTATE_GROUPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentGroupIndex(idx);
                    setProgress(0);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentGroupIndex
                      ? "w-6 bg-brand-gold-500"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                  title={`Group ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-0.5 ml-1 bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={handlePrevGroup}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Previous Products"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 hover:bg-slate-700 rounded text-brand-gold-400 transition-colors cursor-pointer"
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleNextGroup}
                className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Next Products"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setActiveTab("auto");
              setProgress(0);
            }}
            className="text-[10px] font-mono font-bold text-brand-gold-400 hover:text-brand-gold-300 bg-brand-navy-900 border border-brand-gold-500/30 px-2 py-0.5 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
          >
            <span>🔄 Auto-Rotate All</span>
          </button>
        )}
      </div>

      {/* 3-Second Visual Progress Bar (only active when in auto-rotate) */}
      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-75 ease-linear ${
            activeTab === "auto"
              ? "bg-gradient-to-r from-brand-gold-500 via-yellow-400 to-amber-500"
              : "bg-brand-gold-500/40"
          }`}
          style={{ width: activeTab === "auto" ? `${progress}%` : "100%" }}
        />
      </div>

      {/* MAIN DISPLAY AREA: Either Auto-Rotating 3 Products OR 3 Feature Modules for Selected Product */}
      <AnimatePresence mode="wait">
        {activeTab === "auto" ? (
          /* Auto-Rotate Mode: Displays 3 Software Products (Starting with Library, Coaching, Fitness!) */
          <motion.div
            key={`auto-${currentGroupIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3"
          >
            {ROTATE_GROUPS[currentGroupIndex].map((prod) => {
              const IconComp = prod.icon;
              return (
                <div
                  key={prod.id}
                  onClick={() => setActiveTab(prod.id)}
                  className="bg-slate-950/90 border border-slate-800 hover:border-brand-gold-500/80 rounded-xl p-3 transition-all hover:scale-[1.01] flex flex-col justify-between space-y-2.5 group/card relative overflow-hidden shadow-sm cursor-pointer"
                >
                  {/* Big Icon Logo */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold-500/25 via-amber-500/15 to-brand-navy-900 border border-brand-gold-500/40 flex items-center justify-center text-brand-gold-400 shrink-0 shadow-xs group-hover/card:scale-105 transition-transform">
                        <IconComp className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight truncate leading-snug">
                          {prod.name}
                        </h4>
                        <p className="text-[9.5px] font-mono text-brand-gold-400 font-medium truncate">
                          {prod.category}
                        </p>
                      </div>
                    </div>

                    <span className="text-[8px] font-mono font-black uppercase bg-brand-navy-900 text-brand-gold-400 px-1.5 py-0.5 rounded-md border border-brand-gold-500/30 shrink-0">
                      {prod.badge}
                    </span>
                  </div>

                  {/* Software Image Preview */}
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-16/9 sm:aspect-4/3 group-hover/card:border-brand-gold-500/40 transition-colors">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover object-top filter brightness-95 group-hover/card:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                    
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9.5px] font-mono text-slate-200">
                      <span className="bg-slate-950/90 px-2 py-0.5 rounded border border-slate-700 text-brand-gold-300 font-bold">
                        Click to view 3 pages
                      </span>
                      {prod.link && (
                        <a
                          href={prod.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5 shadow-md"
                          title="Demo"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-300 leading-snug line-clamp-2 font-normal">
                    {prod.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        ) : (
          /* Specific Product Mode: Displays 3 Dedicated Feature Pages/Modules for Selected Software */
          <motion.div
            key={`product-${selectedProduct?.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Top Product Banner info */}
            <div className="bg-brand-navy-950/80 border border-brand-gold-500/30 p-2.5 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {selectedProduct && (
                  <div className="w-9 h-9 rounded-lg bg-brand-gold-500/20 border border-brand-gold-500/40 flex items-center justify-center text-brand-gold-400 shrink-0">
                    <selectedProduct.icon className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-display font-extrabold text-sm text-white leading-tight">
                    {selectedProduct?.name} — 3 Core Module Views
                  </h3>
                  <p className="text-[11px] text-slate-300 font-sans">
                    {selectedProduct?.description}
                  </p>
                </div>
              </div>

              {selectedProduct?.link && (
                <a
                  href={selectedProduct.link}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 px-3 py-1.5 rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* 3 Pages / Modules Grid for Selected Software */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {selectedProduct?.modules.map((mod, idx) => {
                const ModIcon = mod.icon;
                return (
                  <div
                    key={idx}
                    className="bg-slate-950/90 border border-slate-800 hover:border-brand-gold-500/60 rounded-xl p-3 flex flex-col justify-between space-y-2.5 group/mod"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-brand-navy-900 border border-brand-gold-500/30 flex items-center justify-center text-brand-gold-400 shrink-0">
                          <ModIcon className="w-4 h-4" />
                        </div>
                        <h5 className="text-xs font-bold text-white tracking-tight leading-tight truncate">
                          {mod.title}
                        </h5>
                      </div>
                      <span className="text-[8px] font-mono font-bold text-brand-gold-400 bg-brand-gold-500/10 px-1.5 py-0.5 rounded border border-brand-gold-500/20 shrink-0">
                        {mod.badge}
                      </span>
                    </div>

                    <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-16/9 sm:aspect-4/3">
                      <img
                        src={mod.image}
                        alt={mod.title}
                        className="w-full h-full object-cover object-top filter brightness-95 group-hover/mod:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-75" />
                      <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-brand-gold-300 font-bold bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                        Page {idx + 1} View
                      </div>
                    </div>

                    <p className="text-[10.5px] text-slate-300 leading-snug font-normal">
                      {mod.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Software Selector Bar (Shows First 3: Library, Coaching, Fitness & then all software) */}
      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-brand-gold-400" />
          <span>SELECT SOFTWARE:</span>
        </span>

        {/* Auto-Rotate Tab Button */}
        <button
          onClick={() => {
            setActiveTab("auto");
            setProgress(0);
          }}
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
            activeTab === "auto"
              ? "bg-brand-gold-500/20 border-brand-gold-500 text-brand-gold-400 font-extrabold shadow-sm ring-1 ring-brand-gold-500/40"
              : "bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white font-medium"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-gold-400" />
          <span className="text-xs whitespace-nowrap">All Software (3s Auto)</span>
        </button>

        {/* All Individual Software Tabs (Starts with Library, Coaching, Fitness) */}
        {SOFTWARE_PRODUCTS.map((prod) => {
          const ProdIcon = prod.icon;
          const isActive = activeTab === prod.id;
          return (
            <button
              key={prod.id}
              onClick={() => setActiveTab(prod.id)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-gold-500/20 border-brand-gold-500 text-brand-gold-400 font-extrabold shadow-sm ring-1 ring-brand-gold-500/40"
                  : "bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-medium"
              }`}
            >
              <ProdIcon className={`w-3.5 h-3.5 ${isActive ? "text-brand-gold-400" : "text-slate-400"}`} />
              <span className="text-xs whitespace-nowrap">
                {prod.name.replace("C Vidya ", "")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
