import React, { useState, useEffect, useMemo, useRef } from "react";
import { ProductService } from "../types";
import institutesImg from "../assets/images/institutes_software_dashboard_1784909550776.jpg";
import institutesComingSoonImg from "../assets/images/institutes_coming_soon_1789758787152.jpg";
import { 
  ArrowRight, 
  X, 
  RefreshCw, 
  Maximize2, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Send,
  MessageSquare,
  TrendingUp,
  Headphones,
  Megaphone,
  CheckCircle2,
  ExternalLink,
  Clock,
  Building2,
  GraduationCap,
  CreditCard,
  Bus,
  Smartphone,
  Calendar,
  Bell
} from "lucide-react";

interface LiveSoftwareAppProps {
  software: ProductService | null;
  onClose: () => void;
  onOpenDetails?: () => void;
}

export default function LiveSoftwareApp({ software, onClose, onOpenDetails }: LiveSoftwareAppProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "console">("live");

  // Track navigation depth inside the software iframe
  const [hasNavigatedInside, setHasNavigatedInside] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>("landing");
  const [iframeKey, setIframeKey] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Coming Soon state for institutes
  const [activePictureIndex, setActivePictureIndex] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);

  // Simulation states for interactive backup
  const [userInput, setUserInput] = useState("");
  const [simLogs, setSimLogs] = useState<Array<{ sender: "user" | "agent"; text: string; time: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const isInstitutes = useMemo(() => {
    if (!software) return false;
    return software.id === "institutes" || software.name.toLowerCase().includes("institute");
  }, [software]);

  // Use embedded static application suite for petrol-pump and pdf-media-tools to work universally on local dev, AI Studio, and deployed production servers
  const effectiveIframeSrc = useMemo(() => {
    if (!software?.externalLink) return "";
    if (software.id === "petrol-pump" || software.externalLink.includes("c-vidya-cloud-petrol-pump")) {
      return "/software/petrol-pump/index.html";
    }
    if (software.id === "pdf-media-tools" || software.id === "pdf-tools" || software.externalLink.includes("c-vidya-pdf-saas-tools")) {
      return "/software/pdf-media-tools/index.html";
    }
    return software.externalLink;
  }, [software]);

  useEffect(() => {
    if (software) {
      document.body.style.overflow = "hidden";
      setIframeLoaded(false);
      setIframeError(false);
      setHasNavigatedInside(false);
      setCurrentRoute("landing");
      setIframeKey((k) => k + 1);

      // Seed initial simulation log
      if (software.id === "ai-social") {
        setSimLogs([
          { sender: "agent", text: "Welcome to C Vidya AI Social Media Agent. Connecting to LinkedIn, X, Instagram & Facebook. Ready to generate viral posts & automate multi-channel campaigns.", time: "Just now" }
        ]);
      } else if (software.id === "ai-support") {
        setSimLogs([
          { sender: "agent", text: "C Vidya AI Customer Support Agent is active. 24/7 Neural RAG knowledge base connected. How can I assist you or your customers today?", time: "Just now" }
        ]);
      } else if (software.id === "ai-salesflow") {
        setSimLogs([
          { sender: "agent", text: "C Vidya SalesFlow AI Agent initialized. Prospecting verified B2B leads & generating high-converting multi-touch sales sequences.", time: "Just now" }
        ]);
      } else if (software.id === "ai-marketing") {
        setSimLogs([
          { sender: "agent", text: "C Vidya B2B SaaS Growth & Marketing AI Agent is live. Inbound demand generation, SEO topic clustering & multi-channel ROI tracker active.", time: "Just now" }
        ]);
      } else {
        setSimLogs([
          { sender: "agent", text: `Connected to ${software.name} live production environment. All cloud nodes and local caching are operational.`, time: "Just now" }
        ]);
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [software, onClose]);

  // Listen to postMessage navigation bridge from embedded software
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.type === "CV_ROUTE_CHANGED") {
        const path = event.data.pathname || "";
        if (path === "/" || path === "/home" || path === "" || path.endsWith("index.html")) {
          setHasNavigatedInside(false);
          setCurrentRoute("landing");
        } else {
          setHasNavigatedInside(true);
          if (path.includes("login")) setCurrentRoute("login");
          else if (path.includes("dashboard")) setCurrentRoute("dashboard");
          else setCurrentRoute(path.replace(/^\//, ""));
        }
      } else if (event.data.type === "CV_EXIT_SOFTWARE") {
        onClose();
      }
    };

    // When the user clicks into the iframe, register that interaction
    const handleWindowBlur = () => {
      // User focused inside the iframe
      setHasNavigatedInside(true);
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [onClose]);

  if (!software) return null;

  // Navigate iframe directly to the Software's own Landing Page
  const goToSoftwareLanding = () => {
    try {
      iframeRef.current?.contentWindow?.postMessage({ type: "CV_GO_HOME" }, "*");
      iframeRef.current?.contentWindow?.postMessage({ type: "CV_NAVIGATE", path: "/" }, "*");
    } catch (e) {}

    try {
      if (iframeRef.current?.contentWindow?.location) {
        iframeRef.current.contentWindow.location.href = effectiveIframeSrc;
      }
    } catch (e) {}

    // Reload clean root landing URL
    setIframeKey((prev) => prev + 1);
    setHasNavigatedInside(false);
    setCurrentRoute("landing");
    setIframeLoaded(false);
    setIframeError(false);
  };

  // Smart Back Handler:
  // 1. If user is inside software (login/dashboard/subpages): navigate back to Software Landing Page!
  // 2. If user is already on Software Landing Page: return to C Vidya Solutions portal!
  const handleBack = () => {
    if (isInstitutes) {
      onClose();
      return;
    }

    if (hasNavigatedInside || currentRoute !== "landing") {
      // Try iframe history back first if supported
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: "CV_GO_BACK" }, "*");
        if (iframeRef.current?.contentWindow?.history && iframeRef.current.contentWindow.history.length > 1) {
          iframeRef.current.contentWindow.history.back();
          setHasNavigatedInside(false);
          setCurrentRoute("landing");
          return;
        }
      } catch (e) {
        // Cross-origin: history is restricted
      }

      // Seamlessly navigate back to the software's root landing page
      goToSoftwareLanding();
    } else {
      // User is already on the software's landing page, return to C Vidya Solutions landing page
      onClose();
    }
  };

  const handleReloadSoftware = () => {
    setIframeKey((prev) => prev + 1);
    setIframeLoaded(false);
    setIframeError(false);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setIsWaitlistSubmitted(true);
  };

  const institutesGallery = [
    {
      src: institutesComingSoonImg,
      badge: "Campus Operations Master Preview",
      title: "Interactive Campus ERP & Student Analytics Hub",
      desc: "Centralized intelligence portal covering multi-branch enrollments, smart automated fee collections, real-time bus GPS telemetry, and biometric attendance logs."
    },
    {
      src: institutesImg,
      badge: "Academic Ledger & Gradebook",
      title: "Automated CBSE / ICSE Exam & Report Card Generator",
      desc: "Instant digital gradebook reconciliation, automated homework diaries, faculty assignment matrix, and instant parent WhatsApp status notifications."
    }
  ];

  const handleSimulateAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    const query = userInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setSimLogs((prev) => [...prev, { sender: "user", text: query, time: timeNow }]);
    setUserInput("");
    setIsProcessing(true);

    setTimeout(() => {
      let reply = "";
      if (software.id === "ai-social") {
        reply = `✨ Generated viral post for LinkedIn & X: "🚀 Excited to announce our new automated workflow! Here are 3 key takeaways that doubled our team efficiency: 1️⃣ Zero manual latency 2️⃣ Multi-channel auto-scheduling 3️⃣ Real-time engagement analytics. #Growth #AI #Automation"`;
      } else if (software.id === "ai-support") {
        reply = `🤖 Neural RAG resolved query with 99.4% confidence: "Your subscription details and active seats have been verified. Invoices are dispatched to your registered billing email."`;
      } else if (software.id === "ai-salesflow") {
        reply = `🎯 SalesFlow AI identified 14 verified B2B decision makers matching "${query}". Auto-generated customized outreach sequence & booked follow-up cadences.`;
      } else if (software.id === "ai-marketing") {
        reply = `📊 B2B Marketing Agent launched high-intent organic campaign. SEO cluster built for "${query}" with projected 3.4x inbound MQL growth.`;
      } else {
        reply = `✅ ${software.name} processed transaction for "${query}". Cloud sync logged with zero conflict.`;
      }

      setSimLogs((prev) => [...prev, { sender: "agent", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden animate-fadeIn">
      {/* Top Application Header Bar with Clean Back Button and Title */}
      <header className="h-16 bg-[#071739] border-b border-blue-900/60 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-lg z-30">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Main Back Icon Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-all shadow-md cursor-pointer border-none"
            title="Back"
          >
            <ArrowRight className="w-4 h-4 rotate-180 text-white stroke-[2.5]" />
            <span>Back</span>
          </button>

          <span className="font-bold text-xs sm:text-sm md:text-base text-white tracking-wide truncate max-w-xs sm:max-w-md md:max-w-xl">
            {software.name}
          </span>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Close Software Viewer Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close software view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Software Canvas Area */}
      <main className="flex-1 w-full h-[calc(100vh-64px)] relative bg-slate-950 overflow-y-auto flex flex-col">
        {isInstitutes ? (
          /* Advanced High-Fidelity Coming Soon UI with Pictures & Feature Roadmap */
          <div className="w-full flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* Top Announcement Banner */}
            <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto pt-2">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-amber-500/15 border-2 border-amber-400/60 text-amber-300 text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/15 backdrop-blur-md">
                <span className="relative flex h-3.5 w-3.5 sm:h-5 sm:w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-5 sm:w-5 bg-amber-400" />
                </span>
                <span>COMING SOON</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-tight">
                C Vidya Institutes Management
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                The modern cloud ERP engineered for schools, colleges, and multi-campus academies. 
                Manage admissions, automated fee cashbooks, biometric attendance, and student report cards seamlessly.
              </p>

              {/* Progress Tracker */}
              <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg mt-2">
                <div className="flex justify-between items-center text-xs text-slate-300 font-semibold mb-2">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deployment Status: Phase 3 Beta</span>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">88% Ready</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full w-[88%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                  <span>Architecture Validated</span>
                  <span>Campus Field Tests</span>
                  <span>Public Ingress</span>
                </div>
              </div>
            </div>

            {/* Pictures Showcase Section */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                    Official Software Architecture Gallery
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {institutesGallery[activePictureIndex].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                    {institutesGallery[activePictureIndex].desc}
                  </p>
                </div>

                {/* Picture Selector Tabs */}
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-center">
                  {institutesGallery.map((pic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePictureIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activePictureIndex === idx
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span>Preview {idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Featured Image with Frame & Highlights */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
                <img
                  src={institutesGallery[activePictureIndex].src}
                  alt={institutesGallery[activePictureIndex].title}
                  className="w-full h-auto max-h-[520px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />

                {/* Image Overlay Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-white shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{institutesGallery[activePictureIndex].badge}</span>
                </div>

                <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-mono text-emerald-400 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>High-Fidelity ERP Mockup</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {institutesGallery.map((pic, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePictureIndex(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      activePictureIndex === idx
                        ? "bg-blue-950/40 border-blue-500/80 shadow-md ring-1 ring-blue-500/40"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                    }`}
                  >
                    <img
                      src={pic.src}
                      alt={pic.title}
                      className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-lg shrink-0 border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{pic.title}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{pic.desc}</div>
                      <span className="text-[10px] font-mono text-blue-400 font-semibold mt-1 inline-block">
                        Click to view preview
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Modules Bento Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span>Built-in Modules Available on Launch</span>
                </h3>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  Enterprise-Grade Multi-Tenant Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Student Admissions &amp; CRM</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Online registration forms, entrance exam allotments, verification checklists, and auto-generated student enrollment IDs.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Automated Fees &amp; Cashbooks</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Term billing schedules, UPI/card payment gateway, penalty calculations, and instant WhatsApp receipt dispatch.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Biometric &amp; RFID Attendance</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Hardware turnstile integrations, teacher attendance, period timetables, and automated SMS alerts to guardians for absent students.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Exams &amp; Gradebook Engine</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    CBSE, ICSE, and state-board compliant report cards, hall tickets, teacher grading portals, and rank list generators.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-3">
                    <Bus className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Live GPS School Bus Tracking</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Real-time vehicle map telemetry, driver roster management, geo-fence boarding alerts, and fuel consumption logs.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-3">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Parent &amp; Faculty Mobile Portal</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Dedicated mobile app for digital homework submission, event calendars, report downloads, and direct teacher queries.
                  </p>
                </div>
              </div>
            </div>

            {/* VIP Early Access Priority Form */}
            <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-900/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Exclusive Early Access Sandbox</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Get Notified When Institute Management Launches
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join 120+ educational institutions on the VIP waitlist to receive a complimentary 30-day campus trial and priority onboarding.
                </p>
              </div>

              <div className="w-full md:w-auto shrink-0 max-w-md">
                {isWaitlistSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">You're on the VIP waitlist!</p>
                      <p className="text-xs text-emerald-300 mt-0.5">We will notify your institute as soon as the live portal opens.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="School / College or Email..."
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 min-w-[240px]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <span>Join Waitlist</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Bottom Return Action */}
            <div className="flex justify-center pb-8 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all border border-slate-700 cursor-pointer shadow-lg"
              >
                <ArrowRight className="w-4 h-4 rotate-180 text-blue-400" />
                <span>Return to C Vidya Solutions Products</span>
              </button>
            </div>

          </div>
        ) : activeTab === "live" && software.externalLink ? (
          <div className="w-full h-full relative flex flex-col">
            {/* Loading Indicator */}
            {!iframeLoaded && !iframeError && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-10">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-xs text-slate-400 font-mono">Loading {software.name} environment...</p>
              </div>
            )}

            {/* Error / Fallback Card */}
            {iframeError && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="max-w-md space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
                    <ExternalLink className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Live Application Ready</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This cloud software suite is hosted on a secure production worker environment.
                  </p>
                  <a
                    href={software.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                  >
                    <span>Launch {software.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Embedded Live Web Application with Full OAuth & Credential Permissions */}
            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={effectiveIframeSrc}
              title={software.name}
              onLoad={() => setIframeLoaded(true)}
              onError={() => {
                setIframeLoaded(true);
                setIframeError(true);
              }}
              allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; display-capture; encrypted-media; fullscreen; geolocation; gyroscope; identity-credentials-get; microphone; payment; picture-in-picture; publickey-credentials-get; storage-access; web-share;"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-top-navigation-by-user-activation allow-storage-access-by-user-activation"
              className="w-full flex-1 border-none bg-slate-950"
            />
          </div>
        ) : (
          /* High Fidelity Interactive Simulator Console */
          <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 sm:p-6 overflow-hidden">
            <div className="bg-slate-900 border border-blue-900/40 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
              {/* Console Header */}
              <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2 font-semibold">
                    {software.id}-agent-daemon: active-session
                  </span>
                </div>
                <span className="text-xs font-mono text-blue-400 font-bold">
                  {software.categoryType === "ai-agent" ? "Autonomous AI Agent Engine" : "Cloud Platform"}
                </span>
              </div>

              {/* Console Logs / Dialogue */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/60 font-sans">
                {simLogs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${log.sender === "user" ? "items-end" : "items-start"} space-y-1`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{log.sender === "user" ? "You (Client Admin)" : software.name}</span>
                      <span>•</span>
                      <span>{log.time}</span>
                    </div>
                    <div 
                      className={`max-w-2xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        log.sender === "user" 
                          ? "bg-blue-600 text-white rounded-br-none" 
                          : "bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none shadow-md"
                      }`}
                    >
                      {log.text}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-mono animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Agent reasoning &amp; orchestrating live tasks...</span>
                  </div>
                )}
              </div>

              {/* Console Command Input Bar */}
              <form onSubmit={handleSimulateAction} className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={
                    software.id === "ai-social" 
                      ? "Enter topic, campaign goal, or target audience (e.g., 'SaaS growth tips for Twitter')..." 
                      : software.id === "ai-support" 
                      ? "Ask any customer support inquiry or policy question..." 
                      : software.id === "ai-salesflow"
                      ? "Enter target B2B sector or company size (e.g., 'Logistics CTOs in India')..."
                      : software.id === "ai-marketing"
                      ? "Enter marketing initiative or SEO keyword cluster..."
                      : "Type a command or test query..."
                  }
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim() || isProcessing}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Execute</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
