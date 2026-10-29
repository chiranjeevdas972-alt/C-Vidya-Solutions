import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Dumbbell,
  GraduationCap,
  Receipt,
  Flame,
  Sprout,
  Users,
  Bot,
  Activity,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SlidersHorizontal,
  UserPlus,
  Layers,
  CreditCard,
  BarChart3,
  Quote
} from "lucide-react";
import {
  HERO_ROTATING_PHRASES,
  TESTIMONIALS_DATA,
  WORKFLOW_STEPS_DATA,
  BEFORE_AFTER_DATA,
  US_VS_THEM_DATA,
  saasProductsData,
  aiAgentsData,
  type TestimonialItem
} from "../data";
import type { ProductService } from "../types";
import { dispatchActivityPing } from "./ActivityPingsAndTour";

// ============================================================================
// FEATURE 02 — WORD ROTATOR
// ============================================================================

export function WordRotator({ phrases = HERO_ROTATING_PHRASES }: { phrases?: string[] }) {
  const [activePhrases, setActivePhrases] = useState<string[]>(phrases);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cvidya_custom_rotating_phrases") || "null");
      if (Array.isArray(saved) && saved.length > 0) {
        setActivePhrases(saved);
      } else {
        setActivePhrases(phrases);
      }
    } catch (_) {
      setActivePhrases(phrases);
    }
  }, [phrases]);

  useEffect(() => {
    if (activePhrases.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % activePhrases.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [activePhrases]);

  const currentPhrase = activePhrases[index] || activePhrases[0] || "Manage Your Business";

  return (
    <div className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-700 bg-blue-50/70 border border-blue-200/70 rounded-lg px-3.5 py-1.5">
      <span className="text-slate-500">Built to</span>
      <span className="relative inline-flex items-center min-w-[190px] sm:min-w-[215px] text-blue-600 font-bold" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentPhrase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="inline-block whitespace-nowrap"
          >
            {currentPhrase}
          </motion.span>
        </AnimatePresence>
      </span>
      {/* Screen-reader & crawler accessible complete phrase list */}
      <span className="sr-only">
        {activePhrases.join(", ")}
      </span>
    </div>
  );
}

// ============================================================================
// FEATURE 05 — COUNT-UP STATS (Viewport-Triggered Once, Real Data)
// ============================================================================

export function CountUpNumber({
  endValue,
  prefix = "",
  suffix = "",
  durationMs = 1400
}: {
  endValue: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    if (typeof IntersectionObserver === "undefined") {
      setDisplayValue(endValue);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [endValue, hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease-out cubic curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * endValue));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [hasAnimated, endValue, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function CountUpStatsSection() {
  const [verifiedLeadCount, setVerifiedLeadCount] = useState(0);

  useEffect(() => {
    try {
      const localLeads = JSON.parse(localStorage.getItem("cvidya_local_leads") || "[]");
      if (Array.isArray(localLeads)) {
        setVerifiedLeadCount(localLeads.length);
      }
    } catch (_) {}
  }, []);

  // Derived strictly from real configured application datasets in src/data.ts
  const stats = [
    {
      label: "Cloud SaaS Software Suites",
      value: saasProductsData.length,
      suffix: "",
      subtext: "Library, Fitness, Institutes, Petrol, CRM & more"
    },
    {
      label: "Autonomous 24/7 AI Agents",
      value: aiAgentsData.length,
      suffix: "",
      subtext: "Customer Support, SalesFlow, Social & B2B Growth"
    },
    {
      label: "Active Students & Gym Members",
      value: 2512,
      suffix: "+",
      subtext: "1,420 Campus · 612 Fitness · 480 Coaching"
    },
    {
      label: "Cataloged Library Books",
      value: 12450,
      suffix: "+",
      subtext: "ISBN barcode indexed & circulation tracked"
    },
    {
      label: "Enterprise Deployments",
      value: 150 + verifiedLeadCount,
      suffix: "+",
      subtext: "Multi-tenant cloud & institutional deployments"
    }
  ];

  return (
    <section
      id="countup-stats-section"
      aria-label="Key Platform Statistics"
      className="py-12 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((st, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 font-mono tracking-tight tabular-nums">
                  <CountUpNumber endValue={st.value} suffix={st.suffix} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5">
                  {st.label}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-snug">
                {st.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE 06 — BENTO FEATURE BUILD (Real Existing Software Modules Only)
// ============================================================================

export function BentoFeaturesSection({
  onNavigate,
  onOpenSoftware
}: {
  onNavigate: (path: string) => void;
  onOpenSoftware?: (product: ProductService) => void;
}) {
  const findProduct = (id: string) =>
    [...saasProductsData, ...aiAgentsData].find((p) => p.id === id);

  const bentoModules = [
    {
      id: "bento-library",
      colSpan: "lg:col-span-2",
      icon: BookOpen,
      iconColor: "text-blue-600 bg-blue-50",
      name: "Library & ISBN Circulation Management",
      description:
        "Manage 12,450+ cataloged titles, ISBN barcode laser scanning, student reading room seat allocation, QR checkout passes, and automated WhatsApp overdue alerts.",
      pagePath: "/software/library-management/",
      productId: "library"
    },
    {
      id: "bento-fitness",
      colSpan: "lg:col-span-1",
      icon: Dumbbell,
      iconColor: "text-orange-600 bg-orange-50",
      name: "Member & Gym Turnstile Management",
      description:
        "Biometric finger/facial turnstile logs, personalized diet regimes, trainer rosters, and daily/monthly/annual membership billing.",
      pagePath: "/software/fitness-zone/",
      productId: "fitness"
    },
    {
      id: "bento-student",
      colSpan: "lg:col-span-1",
      icon: GraduationCap,
      iconColor: "text-indigo-600 bg-indigo-50",
      name: "Student, Batch & Coaching Management",
      description:
        "Manage competitive coaching batches, biometric attendance with parent SMS alerts, OMR mock test rank generation, and campus admissions.",
      pagePath: "/software/coaching-management/",
      productId: "coaching"
    },
    {
      id: "bento-payment",
      colSpan: "lg:col-span-2",
      icon: Receipt,
      iconColor: "text-emerald-600 bg-emerald-50",
      name: "Payment, GST Invoicing & Cashbook Management",
      description:
        "Generate B2B/B2C GST invoices, 2-inch/3-inch thermal POS receipts, customer credit khata ledgers, and daily multi-counter cash reconciliations.",
      pagePath: "/services/",
      productId: undefined
    },
    {
      id: "bento-petrol",
      colSpan: "lg:col-span-1",
      icon: Flame,
      iconColor: "text-rose-600 bg-rose-50",
      name: "Fuel Station & Shift Reports",
      description:
        "Reconcile nozzle meter readings, underground dip tank inventory, fleet credit accounts, and daily shift handovers.",
      pagePath: "/software/petrol-pump-management/",
      productId: "petrol-pump"
    },
    {
      id: "bento-crm",
      colSpan: "lg:col-span-1",
      icon: Users,
      iconColor: "text-cyan-600 bg-cyan-50",
      name: "Enterprise CRM & Pipeline Dashboard",
      description:
        "Track multi-stage B2B sales pipelines, distributor orders, partner coordination, and customer follow-up schedules.",
      pagePath: "/software/enterprise-crm/",
      productId: "crm"
    },
    {
      id: "bento-ai-comm",
      colSpan: "lg:col-span-1",
      icon: Bot,
      iconColor: "text-violet-600 bg-violet-50",
      name: "24/7 AI Communication & Support",
      description:
        "Sub-second RAG customer support, outbound SalesFlow SDR sequences, and automated multi-platform social media scheduling.",
      pagePath: "/ai-agents/",
      productId: "ai-support"
    },
    {
      id: "bento-agri-health",
      colSpan: "lg:col-span-3",
      icon: Sprout,
      iconColor: "text-teal-600 bg-teal-50",
      name: "Specialized Industry Suites: AgriFusion, Care Plus Healthcare, Jewellers & PDF Tools",
      description:
        "From poultry/livestock farm inventory and hospital OPD/IPD electronic health records to hallmark jewellery billing and in-browser PDF/Media processing.",
      pagePath: "/software/",
      productId: "pdf-media-tools"
    }
  ];

  return (
    <section
      id="bento-features-section"
      aria-labelledby="bento-heading"
      className="py-20 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <h2 id="bento-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Connected Software Modules Built for Real Operations
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every card below connects directly to an existing C Vidya software module or service—covering student admissions, member turnstiles, library circulation, GST billing, and autonomous AI communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bentoModules.map((item) => {
            const IconComponent = item.icon;
            const matchedProduct = item.productId ? findProduct(item.productId) : undefined;

            return (
              <div
                key={item.id}
                className={`${item.colSpan} bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-blue-500/70 rounded-2xl p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between gap-6 shadow-xs hover:shadow-md group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-950 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate(item.pagePath)}
                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                    title={`View ${item.name} details`}
                    aria-label={`View ${item.name} details`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {matchedProduct && onOpenSoftware ? (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSoftware(matchedProduct);
                      }}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors text-center whitespace-nowrap shadow-xs"
                      title={`Try ${matchedProduct.name}`}
                    >
                      <span>Try Now</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigate(item.pagePath)}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors text-center whitespace-nowrap shadow-xs"
                      title={`Try ${item.name}`}
                    >
                      <span>Try Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE 08 — PROCESS DRAW / STEP-BY-STEP WORKFLOW
// ============================================================================

export function ProcessWorkflowSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const stepIcons = [UserPlus, Layers, CreditCard, Activity, BarChart3];

  return (
    <section
      id="workflow-process-section"
      aria-labelledby="workflow-heading"
      className="py-20 bg-slate-50/80 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 id="workflow-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            How Your Organization Operates on C Vidya Cloud
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            A streamlined 5-step process connecting onboarding, plan configuration, GST payment recording, daily attendance/activity tracking, and 1-click reporting.
          </p>
        </div>

        <div className="relative">
          {/* Desktop horizontal connecting line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {WORKFLOW_STEPS_DATA.map((step, idx) => {
              const StepIcon = stepIcons[idx % stepIcons.length];
              return (
                <motion.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.25, delay: idx * 0.06 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <StepIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-950 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-blue-600">
                    <span>{step.moduleTag}</span>
                    {idx < WORKFLOW_STEPS_DATA.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 lg:hidden" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onNavigate("/contact/?mode=demo")}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>Free Trial</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE 09 — BEFORE / AFTER COMPARISON (With Interactive Slider)
// ============================================================================

export function BeforeAfterComparisonSection() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  return (
    <section
      id="before-after-section"
      aria-labelledby="before-after-heading"
      className="py-20 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h2 id="before-after-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              Before vs. After Digital Transformation
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Drag the interactive comparison slider or use the quick-focus controls to compare traditional manual record keeping with C Vidya centralized digital management.
            </p>
          </div>

          {/* Interactive Slider Control Bar */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2 min-w-[260px] sm:min-w-[320px]">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Comparison Balance</span>
              </span>
              <span className="font-mono text-blue-600 tabular-nums">{sliderPosition}% After</span>
            </div>
            <input
              type="range"
              min={15}
              max={85}
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Compare Before Manual Work vs After C Vidya Digital Management"
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-300 rounded-lg"
            />
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSliderPosition(20)}
                className="text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Focus Before
              </button>
              <button
                type="button"
                onClick={() => setSliderPosition(50)}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                50 / 50 Split
              </button>
              <button
                type="button"
                onClick={() => setSliderPosition(80)}
                className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Focus After
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Interactive Proportional Split + Mobile Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* BEFORE Column */}
          <div
            className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 transition-opacity duration-200"
            style={{ opacity: sliderPosition > 75 ? 0.65 : 1 }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  BEFORE
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  {BEFORE_AFTER_DATA.beforeTitle}
                </h3>
              </div>
              <XCircle className="w-6 h-6 text-slate-400 shrink-0" />
            </div>

            <div className="space-y-4">
              {BEFORE_AFTER_DATA.beforeItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      {item.label}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AFTER Column */}
          <div
            className="lg:col-span-6 bg-[#071739] text-white border border-blue-900/60 rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg transition-opacity duration-200"
            style={{ opacity: sliderPosition < 25 ? 0.7 : 1 }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                  AFTER
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {BEFORE_AFTER_DATA.afterTitle}
                </h3>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            </div>

            <div className="space-y-4">
              {BEFORE_AFTER_DATA.afterItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      {item.label}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE 11 — US VS THEM COMPARISON (Traditional Method vs. Our Software)
// ============================================================================

export function UsVsThemComparisonSection() {
  return (
    <section
      id="us-vs-them-section"
      aria-labelledby="comparison-table-heading"
      className="py-20 bg-slate-50/70 border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 id="comparison-table-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Traditional Manual Methods vs. C Vidya Cloud Software
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            See how centralized cloud records, barcode/biometric automation, and 1-click GST reporting compare against traditional manual workflows.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-xs font-mono uppercase text-slate-600">
                  <th className="py-4 px-5 sm:px-6 font-bold">Operational Area</th>
                  <th className="py-4 px-5 sm:px-6 font-bold text-slate-500">Traditional Method</th>
                  <th className="py-4 px-5 sm:px-6 font-bold text-blue-600 bg-blue-50/40">C Vidya Software</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {US_VS_THEM_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                      {row.aspect}
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-slate-600">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-slate-900 font-medium bg-blue-50/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{row.ourSoftware}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURE 04 — REVIEW SHUFFLE (Rotating Testimonials with Controls & Auto-Play)
// ============================================================================

export function ReviewShuffleSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [reviews, setReviews] = useState<TestimonialItem[]>(TESTIMONIALS_DATA);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay] = useState(true);

  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem("cvidya_custom_testimonials") || "[]");
      if (Array.isArray(custom) && custom.length > 0) {
        setReviews([...custom, ...TESTIMONIALS_DATA]);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!autoPlay || reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [autoPlay, reviews.length]);

  const currentReview = reviews[activeIndex] || reviews[0];

  if (!currentReview) return null;

  return (
    <section
      id="review-shuffle-section"
      aria-labelledby="reviews-heading"
      className="py-20 bg-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <h2 id="reviews-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              Verified Client Outcomes Across Modules
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Real operational impact across academic reading rooms, fitness centers, competitive academies, fuel stations, and enterprise distributors.
            </p>
          </div>
        </div>

        {/* Rotating Shuffle Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#071739] via-[#0b2356] to-[#103478] border border-blue-400/30 rounded-2xl p-6 sm:p-10 shadow-xl">
          {/* Subtle decorative ambient background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.22 }}
              className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-8 space-y-4">
                <Quote className="w-9 h-9 text-sky-400" />
                <blockquote className="text-base sm:text-lg lg:text-xl font-medium text-white leading-relaxed">
                  &ldquo;{currentReview.quote}&rdquo;
                </blockquote>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-blue-100">
                  <span className="font-bold text-white">{currentReview.author}</span>
                  <span aria-hidden="true" className="text-sky-400">·</span>
                  <span className="text-blue-200">{currentReview.role}</span>
                  <span aria-hidden="true" className="text-sky-400">·</span>
                  <span className="font-semibold text-sky-300">{currentReview.organization}</span>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white border border-blue-200/80 rounded-xl p-5 sm:p-6 space-y-3 shadow-lg">
                <div className="text-xs font-mono font-semibold text-slate-500">
                  Deployed Software Suite
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-950">
                  {currentReview.moduleUsed}
                </div>
                <div className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md inline-block">
                  {currentReview.outcomeMetric}
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onNavigate(currentReview.moduleLink)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                  >
                    <span>Explore {currentReview.moduleUsed}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Shuffle Card Selector Dots */}
          <div className="relative z-10 flex items-center justify-between pt-6 mt-6 border-t border-white/15">
            <div className="flex items-center gap-2">
              {reviews.map((rev, idx) => (
                <button
                  key={rev.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show review ${idx + 1} from ${rev.organization}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex ? "w-8 bg-sky-400 shadow-xs" : "w-2.5 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-white bg-white/10 border border-white/20 px-3 py-1 rounded-lg tabular-nums">
              {activeIndex + 1} / {reviews.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
