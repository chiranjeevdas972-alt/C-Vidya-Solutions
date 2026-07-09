import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  GraduationCap, 
  Activity, 
  Users, 
  Building2, 
  Wheat, 
  Bot, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Clock,
  PhoneCall,
  Flame,
  Maximize2
} from "lucide-react";

interface SoftwareItem {
  id: number;
  name: string;
  shortName: string;
  icon: any;
  tagline: string;
  description: string;
  badge: string;
  metrics: { label: string; value: string; isGood?: boolean }[];
  accentColor: string;
  externalLink?: string;
}

export default function SoftwareCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const softwares: SoftwareItem[] = [
    {
      id: 0,
      name: "C VIDYA LIBRARY MANAGEMENT SYSTEM",
      shortName: "Library System",
      icon: BookOpen,
      tagline: "ISBN Tracking & Automated WhatsApp Circulation",
      description: "Complete institutional ledger with digital barcode scanners, auto SMS warnings, CBSE score matching, and catalog check-outs.",
      badge: "Institutional Module",
      accentColor: "from-brand-gold-500 to-amber-500",
      externalLink: "https://v.cvidyasolutions.workers.dev/",
      metrics: [
        { label: "Book Catalog Capacity", value: "50,000+" },
        { label: "WhatsApp Alert Latency", value: "< 2.4s" },
        { label: "Lost Volume Rate", value: "0% (Secured)" }
      ]
    },
    {
      id: 1,
      name: "C VIDYA COACHING MANAGEMENT SYSTEM",
      shortName: "Coaching Suite",
      icon: GraduationCap,
      tagline: "OMR Grading Scanner & Attendance Broadcaster",
      description: "Advanced image processing engine evaluating MCQ OMR answer sheets instantly. Sends real-time scorecard links to parents automatically.",
      badge: "Academic Operations",
      accentColor: "from-brand-gold-500 to-yellow-500",
      metrics: [
        { label: "OMR Scan Speed", value: "120 sheets/min" },
        { label: "Parent Notification Rate", value: "100%" },
        { label: "Active Test Batches", value: "32+" }
      ]
    },
    {
      id: 2,
      name: "C VIDYA FITNESS ZONE",
      shortName: "Fitness Zone",
      icon: Activity,
      tagline: "Biometric Turnstile Gates & Facial Check-Ins",
      description: "Full club management system integrated with physical gate relays, digital QR passes, automated diet planners, and membership logs.",
      badge: "Facility Hardware",
      accentColor: "from-amber-400 to-brand-gold-500",
      externalLink: "https://fitzone.cvidyasolutions.workers.dev/",
      metrics: [
        { label: "Face Recognition Speed", value: "0.18s" },
        { label: "Member Portal Logins", value: "1,400+" },
        { label: "Relay Gate Reliability", value: "99.99%" }
      ]
    },
    {
      id: 3,
      name: "C VIDYA CRM",
      shortName: "CRM Sales Suite",
      icon: Users,
      tagline: "Lead Funnel Optimization & Dialer Logs",
      description: "Intelligent customer pipeline tracker for academic institutions and franchises. Log callbacks, record requirements, and compile billing.",
      badge: "Enterprise SaaS",
      accentColor: "from-brand-gold-400 to-yellow-600",
      externalLink: "https://crm.cvidyasolutions.workers.dev/",
      metrics: [
        { label: "Lead Pipeline Load", value: "10,000/sec" },
        { label: "Avg Sales Conversion Boost", value: "+42%" },
        { label: "Secure Callback Records", value: "Fully Encrypted" }
      ]
    },
    {
      id: 4,
      name: "C VIDYA INSTITUTES MANAGEMENT SYSTEM",
      shortName: "Institutes ERP",
      icon: Building2,
      tagline: "Multi-Campus Administration Ledger ERP",
      description: "Unified enterprise platform matching board grades, tracking payroll ledgers, scheduling buses via GPS, and consolidating CBSE compliance.",
      badge: "Unified Campus ERP",
      accentColor: "from-amber-500 to-brand-gold-600",
      metrics: [
        { label: "Affiliated Campus Blocks", value: "12+ Blocks" },
        { label: "Unified Database Ledger", value: "PostgreSQL Secure" },
        { label: "Compliance Processing", value: "CBSE Standardized" }
      ]
    },
    {
      id: 5,
      name: "C VIDYA FARMING MANAGEMENT SYSTEM",
      shortName: "Smart Farming",
      icon: Wheat,
      tagline: "IoT Soil Telemetry & Granary Logs",
      description: "Agricultural tracking systems reading N-P-K soil indicators, mapping storage humidity, and optimizing supply chain log distribution.",
      badge: "Agricultural IoT",
      accentColor: "from-brand-gold-500 to-emerald-500",
      metrics: [
        { label: "IoT Telemetry Ping", value: "Live Stream" },
        { label: "Soil Analysis Time", value: "Instantaneous" },
        { label: "Granary Storage Monitor", value: "Active RFID" }
      ]
    },
    {
      id: 6,
      name: "C VIDYA AI AUTOMATION",
      shortName: "AI Automation",
      icon: Bot,
      tagline: "Cognitive AI Agents & Report Auto-Compilers",
      description: "Custom server-side AI engines processing parent reports, auto-assigning student counseling pathways, and drafting smart municipal briefs.",
      badge: "Deep AI Integration",
      accentColor: "from-brand-gold-400 via-yellow-500 to-amber-500",
      metrics: [
        { label: "AI Engine Latency", value: "150ms Response" },
        { label: "Auto Report Compilers", value: "Fully Generative" },
        { label: "Workflow Pipelines", value: "14 Live Systems" }
      ]
    }
  ];

  // 3-second automatic slide transition
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % softwares.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPlaying, softwares.length]);

  const activeSoftware = softwares[activeIndex];
  const IconComponent = activeSoftware.icon;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-brand-navy-900/15 bg-brand-navy-950 p-1">
      {/* Absolute Decorative Golden Grid Overlays */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-brand-gold-500/20 pointer-events-none z-0" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-brand-gold-500/10 pointer-events-none z-0" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-brand-gold-500/10 pointer-events-none z-0" />

      {/* Main Glass Screen Frame */}
      <div className="relative z-10 bg-gradient-to-b from-brand-navy-900/95 to-brand-navy-950/98 rounded-2xl p-4 md:p-6 flex flex-col justify-between min-h-[520px] md:min-h-[580px] select-none">
        
        {/* Upper Status Ribbon */}
        <div className="flex justify-between items-center pb-3.5 border-b border-brand-navy-800/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold-500"></span>
            </span>
            <span className="font-mono text-[9px] text-brand-gold-300 font-bold uppercase tracking-wider">
              C VIDYA SUITE PLATFORM INTERACTIVE PREVIEW
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
            <Database className="w-3 h-3 text-brand-gold-500/80" />
            <span className="font-bold">LIVE METRICS</span>
          </div>
        </div>

        {/* Middle Screen Section: Left Content, Right Dashboard Visualization */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 py-4 flex-1 items-stretch">
          
          {/* Active Product Profile Info (Left side of container) */}
          <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Module Pill & Counter */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-brand-gold-500/15 border border-brand-gold-500/30 text-brand-gold-400 font-mono text-[9.5px] font-bold uppercase">
                  {activeSoftware.badge}
                </span>
                <span className="font-mono text-[10.5px] text-brand-gold-400 font-black">
                  [ 0{activeIndex + 1} / 0{softwares.length} ]
                </span>
              </div>

              {/* Title & Tagline with AnimatePresence */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-gold-100 flex items-center justify-center text-brand-gold-800 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {activeSoftware.externalLink ? (
                      <a 
                        href={activeSoftware.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display font-extrabold text-base md:text-[17px] text-[#42A5F5] hover:text-brand-gold-400 hover:underline tracking-tight leading-tight flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{activeSoftware.name}</span>
                        <span className="text-[9px] bg-brand-gold-500/25 text-brand-gold-300 px-2 py-0.5 rounded-full uppercase font-mono font-bold leading-none select-none">Live ↗</span>
                      </a>
                    ) : (
                      <h3 className="font-display font-extrabold text-base md:text-[17px] text-[#42A5F5] tracking-tight leading-tight">
                        {activeSoftware.name}
                      </h3>
                    )}
                  </div>
                  
                  <p className="font-sans font-bold text-[11.5px] text-brand-gold-300 uppercase tracking-wide">
                    {activeSoftware.tagline}
                  </p>
                  
                  <p className="text-[12px] text-slate-300 leading-relaxed font-normal">
                    {activeSoftware.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Metrics List Block */}
            <div className="bg-brand-navy-950/70 p-3 rounded-xl border border-brand-gold-500/10 space-y-2.5 backdrop-blur-sm">
              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                Enterprise Benchmark Capabilities
              </div>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2"
                >
                  {activeSoftware.metrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 text-[11px] font-medium">{m.label}</span>
                      <span className="font-mono font-bold text-brand-gold-400">{m.value}</span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Simulated Dashboard Graphic (Right side of container) */}
          <div className="xl:col-span-7 relative flex items-center justify-center min-h-[220px] md:min-h-[270px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.96, rotateY: 3 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.96, rotateY: -3 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full bg-brand-navy-900 rounded-xl border border-brand-gold-500/20 overflow-hidden flex flex-col shadow-inner select-none relative"
              >
                {/* Simulated Glass Highlight Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent pointer-events-none z-20" />

                {/* Dashboard Header Bar */}
                <div className="bg-slate-950/80 px-3 py-2 border-b border-brand-navy-800 flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
                    {activeSoftware.externalLink ? (
                      <a 
                        href={activeSoftware.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[9.5px] text-brand-gold-400 hover:text-brand-gold-200 hover:underline font-bold ml-1.5 bg-brand-navy-950 px-2 py-0.5 rounded border border-brand-gold-500/30 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>Open Live Platform ↗</span>
                      </a>
                    ) : (
                      <span className="font-mono text-[9px] text-slate-400 font-semibold ml-1.5 bg-brand-navy-950/80 px-1.5 py-0.5 rounded border border-brand-navy-800">
                        https://admin.cvidya.in/portal
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="font-mono text-[9px] text-slate-400 font-bold">10:00 AM SECURE</span>
                  </div>
                </div>

                {/* Simulated Dashboard Content Area */}
                <div className="p-3.5 flex-1 flex flex-col justify-between text-xs space-y-3 bg-[#0c1424]">
                  
                  {/* Dashboard Header Status Widgets */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-brand-navy-950/80 p-2 rounded-lg border border-brand-navy-800 flex flex-col">
                      <span className="text-[8px] text-slate-400 font-mono font-semibold uppercase">SECURE DATABASE</span>
                      <span className="text-[11px] font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Postgres
                      </span>
                    </div>
                    <div className="bg-brand-navy-950/80 p-2 rounded-lg border border-brand-navy-800 flex flex-col">
                      <span className="text-[8px] text-slate-400 font-mono font-semibold uppercase">API STATUS</span>
                      <span className="text-[11px] font-bold text-[#42A5F5] mt-0.5 flex items-center gap-1 animate-pulse">
                        <Cpu className="w-3 h-3 text-[#42A5F5]" /> Online
                      </span>
                    </div>
                    <div className="bg-brand-navy-950/80 p-2 rounded-lg border border-brand-navy-800 flex flex-col">
                      <span className="text-[8px] text-slate-400 font-mono font-semibold uppercase">ENCRYPTION SHIELD</span>
                      <span className="text-[11px] font-bold text-emerald-400 mt-0.5">TLS 1.3 Active</span>
                    </div>
                  </div>

                  {/* CUSTOM GRAPHICS ACCORDING TO EACH ACTIVE SOFTWARE */}
                  <div className="flex-1 min-h-[140px] bg-brand-navy-950/50 rounded-lg border border-brand-navy-800/60 p-3 flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Software 0: LIBRARY */}
                    {activeIndex === 0 && (
                      <div className="h-full flex flex-col justify-between space-y-2.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#42A5F5]" />
                            <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                              Recent Checked-out ISBN Register
                            </span>
                          </div>
                          <span className="text-[8.5px] font-mono text-[#42A5F5] bg-[#42A5F5]/10 px-1.5 py-0.5 rounded font-black">
                            WHATSAPP COMPLIANT
                          </span>
                        </div>

                        {/* Simulated Checkout lists */}
                        <div className="space-y-1.5 text-[10.5px]">
                          <div className="flex items-center justify-between p-1.5 bg-brand-navy-950 border-l-2 border-[#42A5F5] rounded">
                            <span className="text-slate-300 font-medium">1. "Wings of Fire" - Checked out by Amit R.</span>
                            <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">SMS Broadcasted</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 bg-brand-navy-950 border-l-2 border-emerald-500 rounded">
                            <span className="text-slate-300 font-medium">2. "HC Verma Vol 1" - Returned by Priya S.</span>
                            <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">Inventory Updated</span>
                          </div>
                          <div className="flex items-center justify-between p-1.5 bg-brand-navy-950 border-l-2 border-[#42A5F5] rounded">
                            <span className="text-slate-300 font-medium">3. "CBSE Grade 10 Ledger" - PDF Downloaded</span>
                            <span className="font-mono text-[9px] text-[#42A5F5] font-bold uppercase">Passcode Verified</span>
                          </div>
                        </div>

                        {/* Bottom graph metric bar */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[9.5px] text-slate-400 font-mono">CIRCULATION RATIO:</span>
                          <div className="flex-1 h-2 bg-brand-navy-950 rounded-full overflow-hidden flex">
                            <div className="bg-[#42A5F5] w-[75%]" />
                            <div className="bg-emerald-500 w-[25%]" />
                          </div>
                          <span className="text-[9.5px] text-brand-gold-300 font-mono font-bold">75/25</span>
                        </div>
                      </div>
                    )}

                    {/* Software 1: COACHING */}
                    {activeIndex === 1 && (
                      <div className="h-full flex flex-col justify-between space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-[#42A5F5]" />
                            <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                              Active OMR Sheet Image Processor
                            </span>
                          </div>
                          <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-black">
                            99.9% ACCURACY
                          </span>
                        </div>

                        {/* Radar scanner simulation */}
                        <div className="relative p-2 bg-slate-950 rounded-lg border border-brand-navy-800 flex items-center justify-between gap-3 overflow-hidden">
                          <div className="absolute inset-y-0 left-0 w-2.5 bg-[#42A5F5]/20 animate-pulse" />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                            </div>
                            <div className="text-left">
                              <div className="font-mono text-[10px] font-bold text-slate-200">OMR_BATCH_0284.JPG</div>
                              <div className="text-[9px] text-slate-400 leading-none">Evaluating marks block coordinates...</div>
                            </div>
                          </div>
                          <div className="text-right font-mono text-[10px] text-emerald-400 font-bold shrink-0">
                            PROCESSED OK
                          </div>
                        </div>

                        {/* Automated parent broadcast ticker */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-300 bg-brand-navy-950 p-1.5 rounded">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>SMS Broadcast: 142 Scorecards sent to Parent WhatsApp lines automatically</span>
                        </div>
                      </div>
                    )}

                    {/* Software 2: FITNESS ZONE */}
                    {activeIndex === 2 && (
                      <div className="h-full flex flex-col justify-between space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-[#42A5F5]" />
                            <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                              Biometric Turnstile Gateway Status
                            </span>
                          </div>
                          <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-black">
                            ONLINE
                          </span>
                        </div>

                        {/* Camera Recognition Face frame mockup */}
                        <div className="grid grid-cols-12 gap-2.5 items-center bg-slate-950 p-2.5 rounded-lg border border-brand-navy-800">
                          {/* Left Avatar preview simulating face recognized */}
                          <div className="col-span-3 aspect-square rounded-md bg-brand-gold-500/15 border border-brand-gold-500/30 flex items-center justify-center text-[#42A5F5] relative overflow-hidden">
                            <Users className="w-6 h-6 text-[#42A5F5]" />
                            <div className="absolute inset-0 border border-emerald-500/40 animate-pulse" />
                          </div>
                          
                          {/* Right matched credentials metadata */}
                          <div className="col-span-9 text-left space-y-0.5 text-[10.5px]">
                            <div className="font-bold text-slate-200">MEMBER: CHIRANJEEV DAS</div>
                            <div className="text-slate-400 text-[9.5px]">ID: C-VFY-9923 | PASS: ACTIVE</div>
                            <div className="text-emerald-400 text-[9.5px] font-bold font-mono">AUTHENTICATION MATCHED (RELAY TRIGGERED)</div>
                          </div>
                        </div>

                        {/* Diet details log shortcut */}
                        <div className="text-[9.5px] font-mono text-slate-400 flex justify-between items-center bg-brand-navy-950/70 p-1 rounded px-2">
                          <span>DIETARY CALORIES TARGET: 2,400 kcal</span>
                          <span className="text-brand-gold-400">CARD INDEXED</span>
                        </div>
                      </div>
                    )}

                    {/* Software 3: CRM */}
                    {activeIndex === 3 && (
                      <div className="h-full flex flex-col justify-between space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#42A5F5]" />
                            <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                              Sales Callback Funnel Matrix
                            </span>
                          </div>
                          <span className="text-[8.5px] font-mono text-[#42A5F5] bg-[#42A5F5]/10 px-1.5 py-0.5 rounded font-black">
                            CRM CONSOLIDATED
                          </span>
                        </div>

                        {/* Compact Kanban Columns */}
                        <div className="grid grid-cols-3 gap-2 text-[9px] text-center">
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-brand-navy-800 space-y-1">
                            <span className="font-bold text-slate-400 uppercase tracking-wider">NEW CALLS</span>
                            <div className="p-1 bg-brand-navy-900 border-l border-[#42A5F5] rounded text-left text-slate-300 font-bold leading-none">
                              R. Singh (DHS)
                            </div>
                          </div>
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-[#42A5F5]/30 space-y-1">
                            <span className="font-bold text-brand-gold-400 uppercase tracking-wider">DEMO SCHEDULED</span>
                            <div className="p-1 bg-brand-navy-900 border-l border-[#42A5F5] rounded text-left text-slate-300 font-bold leading-none animate-pulse">
                              St. Xavier’s Lib
                            </div>
                          </div>
                          <div className="bg-slate-950 p-1.5 rounded-lg border border-emerald-500/20 space-y-1">
                            <span className="font-bold text-emerald-400 uppercase tracking-wider">CLOSED WON</span>
                            <div className="p-1 bg-emerald-950/30 border-l border-emerald-500 rounded text-left text-emerald-300 font-bold leading-none">
                              Dhanbad Cent
                            </div>
                          </div>
                        </div>

                        {/* Dialing hotline indicator status */}
                        <div className="flex justify-between items-center text-[10px] text-slate-300 bg-brand-navy-950/90 p-1.5 rounded border border-brand-navy-800">
                          <div className="flex items-center gap-1">
                            <PhoneCall className="w-3 h-3 text-[#42A5F5]" />
                            <span>Quick Dialer: +91 8987766981</span>
                          </div>
                          <span className="text-emerald-400 font-mono text-[9px] font-bold">READY TO CALLBACK</span>
                        </div>
                      </div>
                    )}

                    {/* Software 4: INSTITUTES ERP */}
                    {activeIndex === 4 && (
                      <div className="h-full flex flex-col justify-between space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#42A5F5]" />
                            <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                              Multi-Campus Institution Registry
                            </span>
                          </div>
                          <span className="text-[8.5px] font-mono text-[#42A5F5] bg-[#42A5F5]/10 px-1.5 py-0.5 rounded font-black">
                            CBSE COMPLIANT
                          </span>
                        </div>

                        {/* CBSE Score card compiler overview */}
                        <div className="p-2 bg-slate-950 rounded-lg border border-brand-navy-800 space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono uppercase">
                            <span>CLASS SEGMENT</span>
                            <span>TERM AVERAGE</span>
                            <span>WHATSAPP Broadcaster</span>
                          </div>
                          
                          <div className="flex justify-between items-center font-bold text-[10.5px]">
                            <span className="text-slate-300">Grade X Board (A)</span>
                            <span className="text-[#42A5F5]">94.2% Passed</span>
                            <span className="text-emerald-400 font-mono text-[9px]">142 Delivered</span>
                          </div>

                          <div className="flex justify-between items-center font-bold text-[10.5px]">
                            <span className="text-slate-300">Grade XII Board (B)</span>
                            <span className="text-slate-200">91.5% Passed</span>
                            <span className="text-emerald-400 font-mono text-[9px]">98 Delivered</span>
                          </div>
                        </div>

                        {/* Bus track indicator */}
                        <div className="flex justify-between items-center text-[9.5px] text-slate-400 bg-brand-navy-950 p-1 rounded">
                          <span>CAMPUS ATTENDANCE OVERALL: 98.4%</span>
                          <span className="text-emerald-400 font-mono font-bold">LEDGER IN BALANCE</span>
                        </div>
                      </div>
                    )}

                    {/* Software 5: SMART FARMING */}
                    {activeIndex === 5 && (
                      <div className="h-full flex flex-col justify-between space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <Wheat className="w-3.5 h-3.5 text-[#42A5F5]" />
                            <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                              IoT Soil Telemetry & Granary Status
                            </span>
                          </div>
                          <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-black">
                            ACTIVE SENSORS
                          </span>
                        </div>

                        {/* Telemetry Sensor dials mockup */}
                        <div className="grid grid-cols-3 gap-2.5 text-center">
                          <div className="bg-slate-950 p-2 rounded-lg border border-brand-navy-800">
                            <span className="text-[8px] text-slate-400 font-mono block uppercase">SOIL PH</span>
                            <span className="text-xs font-black text-slate-200 block mt-0.5">6.8 pH</span>
                            <span className="text-[8px] text-emerald-400 font-mono block">OPTIMAL</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-lg border border-[#42A5F5]/20">
                            <span className="text-[8px] text-slate-400 font-mono block uppercase">MOISTURE</span>
                            <span className="text-xs font-black text-[#42A5F5] block mt-0.5">42.5 %</span>
                            <span className="text-[8px] text-brand-gold-400 font-mono block">STABLE</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-lg border border-brand-navy-800 flex flex-col">
                            <span className="text-[8px] text-slate-400 font-mono block uppercase">N-P-K LEVEL</span>
                            <span className="text-xs font-black text-slate-200 block mt-0.5">42 mg</span>
                            <span className="text-[8px] text-emerald-400 font-mono block">BALANCED</span>
                          </div>
                        </div>

                        {/* Irrigation feedback */}
                        <div className="flex justify-between items-center text-[10px] text-slate-300 bg-brand-navy-950/80 p-1.5 rounded border border-brand-navy-800">
                          <span>Auto Irrigation Water Valve status:</span>
                          <span className="text-emerald-400 font-mono text-[9px] font-bold animate-pulse">STANDBY / OK</span>
                        </div>
                      </div>
                    )}

                    {/* Software 6: AI AUTOMATION */}
                    {activeIndex === 6 && (
                      <div className="h-full flex flex-col justify-between space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <Bot className="w-3.5 h-3.5 text-[#42A5F5]" />
                            <span className="font-mono text-[10px] font-bold text-slate-200 uppercase tracking-wide">
                              Server AI Agent Cognitive Terminal
                            </span>
                          </div>
                          <span className="text-[8.5px] font-mono text-[#42A5F5] bg-[#42A5F5]/10 px-1.5 py-0.5 rounded font-black">
                            LLM ACTIVE
                          </span>
                        </div>

                        {/* AI Terminal console dialogue mockup */}
                        <div className="p-2.5 bg-slate-950 rounded-lg border border-brand-navy-800 text-[10.5px] font-mono space-y-2 text-left">
                          <div className="flex items-start gap-1.5">
                            <span className="text-[#42A5F5] font-black shrink-0">&gt;</span>
                            <span className="text-slate-300">Compile CBSE scores & dispatch SMS class logs.</span>
                          </div>
                          <div className="flex items-start gap-1.5 leading-normal">
                            <span className="text-emerald-400 font-black shrink-0">cv-ai:</span>
                            <span className="text-slate-400 font-medium">Processing student averages... 142 reports matched. Broadcast queue loaded successfully.</span>
                          </div>
                        </div>

                        {/* Model usage details */}
                        <div className="flex justify-between items-center text-[9.5px] text-slate-400 bg-brand-navy-950 p-1 rounded font-mono">
                          <span>LATENCY RATE: 150ms</span>
                          <span className="text-[#42A5F5] font-bold">14 WORKFLOW PLUGS OK</span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Lower Navigation Dots and Selector Pills */}
        <div className="pt-3 border-t border-brand-navy-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Slider manual pills */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {softwares.map((sw, index) => {
              const SwIcon = sw.icon;
              const isSelected = activeIndex === index;
              return (
                <button
                  key={sw.id}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    setIsPlaying(false); // Pause auto-rotation when user manually interacts
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-mono font-bold transition-all border cursor-pointer ${
                    isSelected 
                      ? "bg-brand-gold-500 text-slate-950 border-brand-gold-400 font-black scale-102 shadow-md shadow-brand-gold-500/10" 
                      : "bg-brand-navy-900/60 text-slate-300 border-brand-navy-800 hover:border-brand-gold-500/30 hover:text-white"
                  }`}
                >
                  <SwIcon className="w-3 h-3 shrink-0" />
                  <span className="hidden sm:inline">{sw.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Autoplay toggle switch */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400 hover:text-white bg-brand-navy-900 border border-brand-navy-800 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            <span>{isPlaying ? "PAUSE ROTATION" : "RESUME ROTATION"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
