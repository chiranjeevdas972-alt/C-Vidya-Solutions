import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Logo from "./components/Logo";
import SoftwareCarousel from "./components/SoftwareCarousel";
import ProductSuite from "./components/ProductSuite";
import InquiryForm from "./components/InquiryForm";
import AiAssistant from "./components/AiAssistant";
import ComplianceModal, { CookieConsentBanner } from "./components/ComplianceModal";
import CompliancePage from "./components/CompliancePage";
import InfoHubModal from "./components/InfoHubModal";
import { 
  Building2, 
  Target, 
  UserCheck, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Settings, 
  Sparkles, 
  Bot,
  ArrowRight,
  BookOpen,
  Wheat,
  Activity,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Search,
  GraduationCap,
  CheckCircle2,
  Send,
  X,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from "lucide-react";
import { rolesData, CATEGORIES, type CareerRole } from "./careersData";

const SLIDES = [
  {
    id: 1,
    titleLine1: "SMART SOFTWARE",
    titleLine2: "BETTER FUTURE",
    description: "Empowering businesses across India with clean, high-performance web ecosystems.",
    icon: (
      <div className="flex justify-center items-end gap-1 h-8 py-1">
        <div className="w-1.5 h-2 bg-[#42A5F5] rounded-xs" />
        <div className="w-1.5 h-3.5 bg-[#42A5F5] rounded-xs" />
        <div className="w-1.5 h-5 bg-[#42A5F5] rounded-xs" />
        <div className="w-1.5 h-7.5 bg-brand-gold-300 rounded-xs animate-pulse" />
      </div>
    )
  },
  {
    id: 2,
    titleLine1: "INNOVATING WORK",
    titleLine2: "SIMPLIFYING FLOWS",
    description: "Bespoke educational tracking databases, secure members portals, and executive custom CRM logs.",
    icon: (
      <div className="flex justify-center items-center gap-1.5 h-8 py-1 text-[#42A5F5]">
        <div className="w-2 h-2 rounded-full bg-[#42A5F5] animate-ping" />
        <div className="h-[1.5px] w-6 bg-[#42A5F5]/60" />
        <div className="w-5 h-5 rounded-md border border-[#42A5F5]/50 flex items-center justify-center font-mono text-[9px] text-[#42A5F5] font-bold">V</div>
        <div className="h-[1.5px] w-6 bg-[#42A5F5]/60" />
        <div className="w-2 h-2 rounded-full bg-[#42A5F5]" />
      </div>
    )
  },
  {
    id: 3,
    titleLine1: "SECURED INTELLIGENCE",
    titleLine2: "ON-DEMAND SHIELD",
    description: "Built-in high-performance AES encrypted database, leads security lock, and private passcode validation.",
    icon: (
      <div className="flex justify-center items-center gap-1.5 h-8 py-1 text-[#42A5F5]">
        <ShieldCheck className="w-5 h-5 text-[#42A5F5]" />
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-brand-gold-400">ENCRYPTED LOGS</span>
      </div>
    )
  },
  {
    id: 4,
    titleLine1: "LOCAL SOLUTIONS",
    titleLine2: "INDIAN INTEGRATED",
    description: "Proudly supporting municipal systems, digital offices, and local community industries in Dhanbad & region.",
    icon: (
      <div className="flex justify-center items-center gap-1.5 h-8 py-1 text-brand-gold-400">
        <div className="flex items-center gap-1 bg-[#42A5F5]/10 text-[#42A5F5] px-2 py-0.5 rounded border border-[#42A5F5]/20 text-[10px] font-mono">
          <MapPin className="w-3 h-3" /> DHS, IN
        </div>
      </div>
    )
  }
];

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceTab, setComplianceTab] = useState("privacy");
  const [hubOpen, setHubOpen] = useState(false);
  const [hubTab, setHubTab] = useState<"home" | "about" | "services" | "portfolio" | "contact" | "careers" | "blog">("home");

  // Active page routing state
  const [activePage, setActivePage] = useState<"home" | "about" | "services" | "portfolio" | "contact" | "careers" | "blog" | "privacy" | "terms" | "billing" | "refund" | "cookies" | "disclaimer" | "portability">("services");

  // Hash-change router listener for separate pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validPages = [
        "home", "about", "services", "portfolio", "contact", "careers", "blog",
        "privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"
      ];
      if (validPages.includes(hash)) {
        setActivePage(hash as any);
        if (["privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"].includes(hash)) {
          setComplianceTab(hash);
        }
      } else if (!hash) {
        setActivePage("services");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Handle initial load link

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Careers Search and Form states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyingForRole, setApplyingForRole] = useState<CareerRole | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantExperience, setApplicantExperience] = useState("Student / Intern");
  const [applicantMessage, setApplicantMessage] = useState("");
  const [applicationSubmittedSuccess, setApplicationSubmittedSuccess] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Auto-play interval for slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-brand-gold-200 selection:text-slate-900 overflow-x-clip">
      
      {/* Premium Navigation Header */}
      <Header 
        onOpenAssistant={() => setAiOpen(true)} 
        onOpenHub={(tab) => { 
          window.location.hash = tab;
          setHubTab(tab); 
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Multi-Page Render Switch Wrapper */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* 1. HOME PAGE */}
            {activePage === "home" && (
              <>
                {/* Hero / Branding Split Section (Primary viewport matching Image 1 layout) */}
                <main id="hero" className="relative pt-4 md:pt-8 lg:pt-10 pb-12 md:pb-20 lg:pb-28 bg-white overflow-hidden border-b border-slate-100">


                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      
                      {/* Left Column: Branding Content, Quick Actions */}
                      <div className="lg:col-span-7 space-y-9">
                        
                        {/* Main Branding Tag */}
                        <div className="space-y-4">
                          
                          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-5xl.5 text-brand-navy-900 tracking-tight leading-none">
                            C VIDYA <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-600 via-brand-gold-500 to-[#d69e2e]">
                              SOLUTIONS
                            </span>
                          </h1>

                          <p className="font-display font-extrabold text-sm sm:text-base tracking-widest text-[#1d2b4a] uppercase border-l-3 border-brand-gold-500 pl-3">
                            INNOVATING SOFTWARE FOR A SIMPLER FUTURE
                          </p>
                        </div>

                        {/* Interactive Highlights Bento Card */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200/60 shadow-xs space-y-4">
                          <h3 className="font-display font-extrabold text-sm text-brand-navy-950 uppercase tracking-wider">
                            Pioneering Enterprise Tech Systems
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-950 leading-relaxed font-semibold">
                            Established in 2025, we engineer high-grade multitenant SaaS suites, automated civic check-in pipelines, and advanced offline OMR evaluation models tailored specifically for municipal administrations and academic complexes.
                          </p>
                          <div className="grid grid-cols-3 gap-3 pt-2">
                            <div className="p-3 bg-white rounded-xl border border-slate-200/40 text-center">
                              <div className="font-display font-black text-brand-gold-600 text-lg sm:text-xl">150+</div>
                              <div className="text-[9px] font-mono font-black text-slate-800 uppercase">Careers</div>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200/40 text-center">
                              <div className="font-display font-black text-brand-navy-900 text-lg sm:text-xl">4</div>
                              <div className="text-[9px] font-mono font-black text-slate-800 uppercase">Core Suites</div>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200/40 text-center">
                              <div className="font-display font-black text-brand-navy-900 text-lg sm:text-xl">100%</div>
                              <div className="text-[9px] font-mono font-black text-slate-800 uppercase">SST Secure</div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Action Navigation links */}
                        <div className="flex flex-wrap gap-3.5 pt-1.5">
                          <button
                            type="button"
                            onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="flex items-center gap-2 px-5 py-3 bg-brand-navy-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all hover:shadow-md cursor-pointer border-none"
                          >
                            <span>Explore Product Suite</span>
                            <ArrowRight className="w-4 h-4 text-brand-gold-400" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setAiOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 text-xs font-bold rounded-xl transition-all hover:shadow-md cursor-pointer border-none"
                          >
                            <Bot className="w-4 h-4" />
                            <span>Consult Vidya AI Consultant</span>
                          </button>
                        </div>

                      </div>

                      {/* Right Column: Interactive Software Showcase Carousel */}
                      <div className="lg:col-span-5 relative">
                        <SoftwareCarousel />
                      </div>

                    </div>
                  </div>
                </main>

                {/* WHY CHOOSE US - Circle icon metric indicators */}
                <section className="py-16 md:py-20 bg-slate-900 text-white relative border-b border-brand-gold-500/10">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
                      <h4 className="font-mono text-xs font-bold text-brand-gold-400 uppercase tracking-widest">INTELLIGENCE ACCENTS</h4>
                      <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-wider uppercase leading-none">
                        WHY INSTITUTES CHOOSE <span className="text-[#42A5F5]">C VIDYA</span>
                      </h3>
                      <div className="w-16 h-1 bg-brand-gold-500 mx-auto rounded-full" />
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
                        Delivering the robust reliability of offline systems with the fast updates and portability of cloud infrastructure.
                      </p>
                    </div>

                    {/* Metric Indicators Row Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      
                      {/* Metric 1 */}
                      <div className="flex flex-col items-center text-center space-y-4 group">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-800 text-[#42A5F5] border-2 border-brand-gold-500/20 shadow-lg group-hover:scale-105 group-hover:border-brand-gold-500 transition-all duration-300">
                          <UserCheck className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-lg text-white uppercase tracking-wide">100% BIO SECURE</h4>
                          <p className="text-xs text-slate-400 leading-relaxed px-2">Hardware-tied biometric validation and encrypted Smart Card integration systems.</p>
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="flex flex-col items-center text-center space-y-4 group">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-800 text-[#42A5F5] border-2 border-brand-gold-500/20 shadow-lg group-hover:scale-105 group-hover:border-brand-gold-500 transition-all duration-300">
                          <Clock className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-lg text-white uppercase tracking-wide">REAL-TIME SYNC</h4>
                          <p className="text-xs text-slate-400 leading-relaxed px-2">Instant updates between local offline server terminals and cloud-hosted web databases.</p>
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="flex flex-col items-center text-center space-y-4 group">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-800 text-[#42A5F5] border-2 border-brand-gold-500/20 shadow-lg group-hover:scale-105 group-hover:border-brand-gold-500 transition-all duration-300">
                          <IndianRupee className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-lg text-white uppercase tracking-wide">AFFORDABLE SAAS</h4>
                          <p className="text-xs text-slate-400 leading-relaxed px-2">Pay-as-you-go modular billing models explicitly tailored for Indian educational centers.</p>
                        </div>
                      </div>

                      {/* Metric 4 */}
                      <div className="flex flex-col items-center text-center space-y-4 group">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-slate-800 text-[#42A5F5] border-2 border-brand-gold-500/20 shadow-lg group-hover:scale-105 group-hover:border-brand-gold-500 transition-all duration-300">
                          <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-lg text-white uppercase tracking-wide">STPI COMPLIANT</h4>
                          <p className="text-xs text-slate-400 leading-relaxed px-2">Built and certified inside Software Technology Parks of India, ensuring state-of-the-art parameters.</p>
                        </div>
                      </div>

                    </div>

                  </div>
                </section>

                {/* WHAT WE DO - Bento Grid features */}
                <section id="features" className="py-20 md:py-24 bg-white border-b border-slate-100">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      
                      {/* Left Side: Descriptive Column */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold tracking-widest uppercase border border-slate-200">
                          <Settings className="w-3.5 h-3.5" />
                          <span>FUNCTIONAL CORE SERVICES</span>
                        </div>
                        <h3 className="font-display font-black text-3xl sm:text-4xl text-brand-navy-900 tracking-wider uppercase leading-none">
                          SOFTWARE SOLUTIONS TO <br className="hidden sm:inline" />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-600 to-brand-gold-500">
                            SIMPLIFY EVERY JOB
                          </span>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-950 leading-relaxed font-semibold">
                          We develop specialized, lightweight web architectures and standalone system widgets to solve physical administrative bottlenecks.
                        </p>
                        
                        <div className="pt-2 space-y-3">
                          <div className="flex gap-3.5">
                            <div className="w-5 h-5 rounded-full bg-brand-gold-100 text-brand-gold-700 flex items-center justify-center shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-950">Multi-branch institutional ledger consolidation</span>
                          </div>
                          <div className="flex gap-3.5">
                            <div className="w-5 h-5 rounded-full bg-brand-gold-100 text-brand-gold-700 flex items-center justify-center shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-950">Offline biometric scanner synchronization</span>
                          </div>
                          <div className="flex gap-3.5">
                            <div className="w-5 h-5 rounded-full bg-brand-gold-100 text-brand-gold-700 flex items-center justify-center shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-950">Citizen e-Governance complaints processing</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Bento Grid visual panels */}
                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 hover:border-[#42A5F5]/25 transition-all space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-navy-50 text-brand-gold-600 flex items-center justify-center">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <h4 className="font-display font-extrabold text-[#111827] text-sm uppercase">01. OPAC Library Tech</h4>
                          <p className="text-xs text-slate-950 leading-relaxed font-semibold">RFID tags checkout, dynamic stock trackers, and automated fine alerts systems.</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 hover:border-[#42A5F5]/25 transition-all space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-navy-50 text-brand-gold-600 flex items-center justify-center">
                            <Activity className="w-4 h-4" />
                          </div>
                          <h4 className="font-display font-extrabold text-[#111827] text-sm uppercase">02. Fitness Ledger</h4>
                          <p className="text-xs text-slate-950 leading-relaxed font-semibold">Member check-ins maps, subscription triggers, and physical biometric scanning ledgers.</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 hover:border-[#42A5F5]/25 transition-all space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-navy-50 text-brand-gold-600 flex items-center justify-center">
                            <Wheat className="w-4 h-4" />
                          </div>
                          <h4 className="font-display font-extrabold text-[#111827] text-sm uppercase">03. Farming Tech</h4>
                          <p className="text-xs text-slate-950 leading-relaxed font-semibold">Soil indicators reports logs, direct purchase orders matrix, and tractor expense ledgers.</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 hover:border-[#42A5F5]/25 transition-all space-y-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-navy-50 text-brand-gold-600 flex items-center justify-center">
                            <HeartHandshake className="w-4 h-4" />
                          </div>
                          <h4 className="font-display font-extrabold text-[#111827] text-sm uppercase">04. Corporate CRM</h4>
                          <p className="text-xs text-slate-950 leading-relaxed font-semibold">Leads qualification pipelines, sales staff transaction maps, and automatic quote receipts.</p>
                        </div>

                      </div>

                    </div>

                  </div>
                </section>

                {/* QUOTE BLOCK BANNER - Deep slate layout with slide movement */}
                <section className="bg-brand-navy-900 border-y border-brand-gold-500/20 py-12 relative overflow-hidden text-center text-white min-h-[340px] flex items-center justify-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-gold-500/5 blur-3xl z-0 pointer-events-none" />

                  <div className="max-w-4xl mx-auto px-4 relative z-10 w-full flex flex-col justify-between items-center min-h-[220px]">
                    <div className="text-brand-gold-400 font-serif text-6xl leading-none select-none h-6 -mb-4">“</div>

                    <div className="w-full py-4 relative flex items-center justify-center overflow-hidden min-h-[140px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeSlide}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="space-y-4 w-full flex flex-col items-center justify-center"
                        >
                          <h3 className="font-display font-black text-xl sm:text-3xl lg:text-3.5xl uppercase tracking-wider text-white select-none leading-tight md:leading-snug">
                            {SLIDES[activeSlide].titleLine1} <br className="sm:hidden" />
                            <span className="text-[#42A5F5]"> {SLIDES[activeSlide].titleLine2}</span>
                          </h3>

                          <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed px-6">
                            {SLIDES[activeSlide].description}
                          </p>

                          <div className="pt-1">
                            {SLIDES[activeSlide].icon}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div className="text-brand-gold-400 font-serif text-6xl leading-none select-none h-6 -mt-2">”</div>

                    {/* Slider controls */}
                    <div className="flex items-center gap-6 mt-4 relative z-20">
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="p-1.5 rounded-full hover:bg-white/5 active:scale-90 border border-transparent hover:border-brand-gold-500/10 text-white/50 hover:text-[#42A5F5] transition-all cursor-pointer border-none bg-transparent"
                        title="Previous Slide"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex gap-2.5">
                        {SLIDES.map((slide, sIdx) => (
                          <button
                            key={slide.id}
                            type="button"
                            onClick={() => setActiveSlide(sIdx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${
                              activeSlide === sIdx 
                                ? "bg-[#42A5F5] scale-125 shadow-md shadow-brand-gold-500/20" 
                                : "bg-white/20 hover:bg-white/40"
                            }`}
                            aria-label={`Go to slide ${sIdx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="p-1.5 rounded-full hover:bg-white/5 active:scale-90 border border-transparent hover:border-brand-gold-500/10 text-white/50 hover:text-[#42A5F5] transition-all cursor-pointer border-none bg-transparent"
                        title="Next Slide"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* 2. ABOUT PAGE */}
            {activePage === "about" && (
              <div className="bg-white min-h-screen">
                {/* Header card with gradient background */}
                <div className="bg-gradient-to-r from-brand-navy-950 to-brand-navy-900 py-16 text-center text-white relative">
                  <div className="absolute inset-0 bg-radial from-brand-gold-500/5 via-transparent to-transparent opacity-50" />
                  <div className="max-w-5xl mx-auto px-4 space-y-4">
                    <h2 className="font-mono text-xs font-bold text-brand-gold-400 uppercase tracking-widest">ABOUT C VIDYA SOLUTIONS</h2>
                    <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wider text-white">
                      INNOVATING SOFTWARE FOR A <span className="text-[#42A5F5]">SIMPLER FUTURE</span>
                    </h1>
                    <div className="w-16 h-1 bg-brand-gold-500 mx-auto rounded-full" />
                    <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed">
                      Established in 2025, we design elite enterprise systems, smart civic models, and robust offline integrations to make every type of work fast and secure.
                    </p>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Extensive About and Mission */}
                    <div className="lg:col-span-7 space-y-8">
                      {/* Section: About Us */}
                      <section className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/50">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 shadow-xs border border-brand-gold-500/10">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <h2 className="font-display font-extrabold text-lg text-brand-navy-900 tracking-tight">
                            ABOUT US
                          </h2>
                        </div>
                        <div className="text-xs sm:text-sm text-black leading-relaxed font-semibold space-y-3.5">
                          <p>
                            C Vidya Solutions is a technology company established in 2025 with a vision to empower businesses through smart and efficient software solutions.
                          </p>
                          <p>
                            We provide all types of software solutions designed to simplify operations, improve productivity, and drive growth. We specialize in robust, lightning-fast React interfaces, native mobile wrappers, and solid backend systems.
                          </p>
                        </div>
                      </section>

                      {/* Section: Our Mission */}
                      <section className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/50">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 shadow-xs border border-brand-gold-500/10">
                            <Target className="w-5 h-5" />
                          </div>
                          <h2 className="font-display font-extrabold text-lg text-brand-navy-900 tracking-tight">
                            OUR MISSION
                          </h2>
                        </div>
                        <div className="text-xs sm:text-sm text-black leading-relaxed font-semibold space-y-3.5">
                          <p>
                            Our mission is to build intelligent software that makes every type of work simple, fast, and efficient.
                          </p>
                          <p>
                            We believe in technology that empowers people, saves time, and creates better opportunities for businesses and institutions of all sizes.
                          </p>
                        </div>
                      </section>

                      {/* Section: R&D Workspace STPI Sindri */}
                      <section className="space-y-4 bg-amber-500/5 p-6 rounded-2xl border border-brand-gold-500/20">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 shadow-xs border border-brand-gold-500/10">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <h2 className="font-display font-extrabold text-lg text-brand-navy-900 tracking-tight uppercase">
                            STPI Sindri R&D Center
                          </h2>
                        </div>
                        <div className="text-xs sm:text-sm text-black leading-relaxed font-semibold space-y-3.5">
                          <p>
                            Our primary research and administrative operations desk is nestled inside the <strong>STPI Branch on the esteemed BIT Sindri Campus</strong> in Dhanbad, Jharkhand.
                          </p>
                          <p>
                            This physical base fosters academic synergy, giving young developers hands-on engineering training while building civic-technology integrations, smart-card validators, and optical character evaluation models.
                          </p>
                        </div>
                      </section>
                    </div>

                    {/* Right Column: Interactive Software Showcase Carousel */}
                    <div className="lg:col-span-5 space-y-6">
                      <SoftwareCarousel />
                      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-brand-gold-500/25 space-y-4">
                        <h4 className="font-display font-extrabold text-sm uppercase text-brand-gold-400">Headquarters & Desk</h4>
                        <div className="text-xs space-y-2 text-slate-300">
                          <p><strong>HQ Desk:</strong> Surunga, Baliapur, Dhanbad, Jharkhand - 828115</p>
                          <p><strong>R&D Desk:</strong> STPI, BIT Sindri Campus, Dhanbad, Jharkhand</p>
                          <p><strong>Founder:</strong> Chiranjeev Das</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 3. SERVICES PAGE */}
            {activePage === "services" && (
              <div className="bg-white">
                <div className="bg-gradient-to-r from-brand-navy-950 to-brand-navy-900 py-16 text-center text-white relative">
                  <div className="max-w-5xl mx-auto px-4 space-y-4">
                    <h2 className="font-mono text-xs font-bold text-brand-gold-400 uppercase tracking-widest">Core Product Suite</h2>
                    <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wider text-white">
                      OUR HIGH-PERFORMANCE <span className="text-[#42A5F5]">SAAS SUITES</span>
                    </h1>
                    <div className="w-16 h-1 bg-brand-gold-500 mx-auto rounded-full" />
                    <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed">
                      Discover our elite modules constructed inside the STPI R&D center, designed to power school campuses, gymnasiums, farming hubs, and municipal portals.
                    </p>
                  </div>
                </div>
                
                {/* Embedded dynamic product suite with inline elements */}
                <ProductSuite />
              </div>
            )}

            {/* 4. PORTFOLIO PAGE */}
            {activePage === "portfolio" && (
              <div className="bg-slate-50 min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center max-w-3xl mx-auto space-y-4">
                    <h2 className="font-mono text-xs font-bold text-brand-gold-600 uppercase tracking-widest">Case Studies & Successes</h2>
                    <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-navy-900 uppercase tracking-wide">
                      PROVEN WEB ECOSYSTEMS IN ACTION
                    </h1>
                    <div className="w-16 h-1 bg-brand-gold-500 mx-auto rounded-full" />
                    <p className="text-xs sm:text-sm text-black font-semibold leading-relaxed">
                      Explore physical implementations and software solutions that are actively improving productivity for our regional partners.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Case 1 */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-4 shadow-xs hover:border-brand-gold-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy-50 text-brand-navy-900 text-[10px] font-mono font-bold uppercase border border-brand-navy-100">
                          Academic Software
                        </div>
                        <span className="text-[10px] font-mono font-bold text-brand-gold-600">STPI Certified</span>
                      </div>
                      <h3 className="font-display font-black text-lg text-brand-navy-950 uppercase tracking-wide">
                        Private Schools Automated Admissions
                      </h3>
                      <p className="text-xs sm:text-sm text-black font-semibold leading-relaxed">
                        Implemented high-fidelity OMR evaluation sheets for competitive entrance exams, integrating optical reader scripts and instant WhatsApp result delivery to parents.
                      </p>
                      <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
                        <span><strong>Client:</strong> Private School complexes</span>
                        <span><strong>Impact:</strong> 95% reduction in manual grading time</span>
                      </div>
                    </div>

                    {/* Case 2 */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-4 shadow-xs hover:border-brand-gold-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy-50 text-brand-navy-900 text-[10px] font-mono font-bold uppercase border border-brand-navy-100">
                          Fitness CRM
                        </div>
                        <span className="text-[10px] font-mono font-bold text-brand-gold-600">Real-time Sync</span>
                      </div>
                      <h3 className="font-display font-black text-lg text-brand-navy-950 uppercase tracking-wide">
                        Dhanbad Multitenant Fitness Management
                      </h3>
                      <p className="text-xs sm:text-sm text-black font-semibold leading-relaxed">
                        Integrated hardware-tied smart biometrics with clean React administrative ledgers to track members, check-ins, subscription lapses, and automated payment receipts.
                      </p>
                      <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
                        <span><strong>Client:</strong> Regional Fitness Centers</span>
                        <span><strong>Impact:</strong> Zero biometric mismatch reports</span>
                      </div>
                    </div>

                    {/* Case 3 */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-4 shadow-xs hover:border-brand-gold-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy-50 text-brand-navy-900 text-[10px] font-mono font-bold uppercase border border-brand-navy-100">
                          E-Governance Portal
                        </div>
                        <span className="text-[10px] font-mono font-bold text-brand-gold-600">IT Act Compliant</span>
                      </div>
                      <h3 className="font-display font-black text-lg text-brand-navy-950 uppercase tracking-wide">
                        Citizen Complaint Registry & Route Map
                      </h3>
                      <p className="text-xs sm:text-sm text-black font-semibold leading-relaxed">
                        Constructed scalable regional citizen-portal nodes with dynamic route logging to map civic waste complaints, assigning them automatically to Ward staff.
                      </p>
                      <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
                        <span><strong>Client:</strong> Civic Municipal Desk</span>
                        <span><strong>Impact:</strong> Faster ticket resolution timeline</span>
                      </div>
                    </div>

                    {/* Case 4 */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 space-y-4 shadow-xs hover:border-brand-gold-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navy-50 text-brand-navy-900 text-[10px] font-mono font-bold uppercase border border-brand-navy-100">
                          Agritech Systems
                        </div>
                        <span className="text-[10px] font-mono font-bold text-brand-gold-600">Eco Friendly</span>
                      </div>
                      <h3 className="font-display font-black text-lg text-brand-navy-950 uppercase tracking-wide">
                        Farming Procurement & Soil Report Logger
                      </h3>
                      <p className="text-xs sm:text-sm text-black font-semibold leading-relaxed">
                        Engineered lightweight standalone widgets to allow regional rural farmers to log soil nutrient quotients and track local crop purchase pricing in Hindi and English.
                      </p>
                      <div className="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
                        <span><strong>Client:</strong> Regional Farming Cooperatives</span>
                        <span><strong>Impact:</strong> Accessible direct-to-buyer transactions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CONTACT US PAGE */}
            {activePage === "contact" && (
              <div className="bg-white">
                <div className="bg-gradient-to-r from-brand-navy-950 to-brand-navy-900 py-16 text-center text-white relative">
                  <div className="max-w-5xl mx-auto px-4 space-y-4">
                    <h2 className="font-mono text-xs font-bold text-brand-gold-400 uppercase tracking-widest">Connect With Us</h2>
                    <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-wider text-white">
                      GET IN TOUCH <span className="text-[#42A5F5]">TODAY</span>
                    </h1>
                    <div className="w-16 h-1 bg-brand-gold-500 mx-auto rounded-full" />
                    <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed">
                      Have a query about our school software, fitness systems, library databases, or municipal portals? Send us a direct inquiry.
                    </p>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  {/* Left Column: Direct inquiry Form */}
                  <div className="lg:col-span-7">
                    <InquiryForm />
                  </div>

                  {/* Right Column: Direct details & Map placeholders */}
                  <div className="lg:col-span-5 space-y-8 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-xs">
                    <h3 className="font-display font-black text-lg text-brand-navy-950 uppercase tracking-wider pb-3 border-b border-slate-200">
                      REGIONAL OFFICE DETAILS
                    </h3>

                    <div className="space-y-6 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900 uppercase">Headquarters</p>
                          <p>Surunga, Baliapur, Dhanbad, Jharkhand - 828115</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <GraduationCap className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900 uppercase">STPI R&D Desk</p>
                          <p>STPI Desk, BIT Sindri Campus, Dhanbad, Jharkhand</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Mail className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900 uppercase">Emails</p>
                          <p>Office: <a href="mailto:cvidyasolutions@gmail.com" className="hover:text-brand-gold-600 underline">cvidyasolutions@gmail.com</a></p>
                          <p>Director: <a href="mailto:chiranjeev0058@gmail.com" className="hover:text-brand-gold-600 underline">chiranjeev0058@gmail.com</a></p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone className="w-5 h-5 text-brand-gold-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900 uppercase">Phone & Hotlines</p>
                          <p><a href="tel:8987766981" className="hover:text-brand-gold-600 underline text-base font-bold text-brand-navy-900">8987766981</a> (Technical Advisory Line)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-200/50 p-4 rounded-xl border border-slate-300/30 text-center text-xs text-slate-500 font-serif italic">
                      "Proudly serving Jharkhand and Bihar regions with indigenous software. Built to perform."
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. CAREERS PAGE */}
            {activePage === "careers" && (
              <div className="bg-white min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  
                  {/* Title Header */}
                  <div className="text-center max-w-3xl mx-auto space-y-4">
                    <h2 className="font-mono text-xs font-bold text-brand-gold-600 uppercase tracking-widest">JOIN THE STPI R&D TEAM</h2>
                    <h1 className="font-display font-black text-3xl sm:text-5xl text-brand-navy-900 uppercase tracking-wide leading-none">
                      CAREERS & OPEN POSITIONS
                    </h1>
                    <div className="w-16 h-1 bg-brand-gold-500 mx-auto rounded-full" />
                    <p className="text-xs sm:text-sm text-black font-semibold leading-relaxed font-sans">
                      Our main R&D office is nested inside the STPI branch on the BIT Sindri Campus. Browse our 150+ full-time roles, internships, and graduate trainee tracks.
                    </p>
                  </div>

                  {/* Search and Category Filter Panels */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      
                      {/* Search Bar Input */}
                      <div className="md:col-span-7 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search job titles, skills, descriptions..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 text-xs sm:text-sm rounded-xl focus:outline-none focus:border-brand-gold-500 transition-all text-slate-800"
                        />
                      </div>

                      {/* Dropdown Select category */}
                      <div className="md:col-span-5">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 text-xs sm:text-sm rounded-xl focus:outline-none focus:border-brand-gold-500 transition-all text-slate-800 font-medium"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* Filter tags summary */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
                      <div>
                        Showing <strong className="text-brand-navy-900">
                          {rolesData.filter((r) => {
                            const matchCat = selectedCategory === "All" || r.category === selectedCategory;
                            const matchQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
                            return matchCat && matchQuery;
                          }).length}
                        </strong> jobs matching your criteria.
                      </div>
                      <div className="flex gap-2">
                        {selectedCategory !== "All" && (
                          <button 
                            type="button"
                            onClick={() => setSelectedCategory("All")} 
                            className="px-2.5 py-1 bg-brand-gold-100 hover:bg-brand-gold-200 text-brand-gold-800 rounded-lg text-[10px] font-bold transition-all border-none cursor-pointer"
                          >
                            Reset Category
                          </button>
                        )}
                        {searchQuery !== "" && (
                          <button 
                            type="button"
                            onClick={() => setSearchQuery("")} 
                            className="px-2.5 py-1 bg-brand-gold-100 hover:bg-brand-gold-200 text-brand-gold-800 rounded-lg text-[10px] font-bold transition-all border-none cursor-pointer"
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Apply Form Dialog Container */}
                  <AnimatePresence>
                    {showApplyForm && applyingForRole && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#fcf8ec] border border-brand-gold-500/30 p-6 rounded-2xl space-y-5"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-brand-gold-700 bg-brand-gold-100 px-2 py-0.5 rounded uppercase">
                              APPLICATION FORM
                            </span>
                            <h3 className="font-display font-black text-lg text-brand-navy-950 uppercase mt-1">
                              Applying for: {applyingForRole.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {applyingForRole.category} • {applyingForRole.location}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setShowApplyForm(false); setApplicationSubmittedSuccess(false); }}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50 border-none bg-transparent cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {applicationSubmittedSuccess ? (
                          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                            <h4 className="font-display font-extrabold text-slate-900 text-base">Application Submitted Successfully!</h4>
                            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                              Thank you, <strong>{applicantName}</strong>! Your resume and application details for <strong>{applyingForRole.title}</strong> have been logged inside the C Vidya HR registry. We will reach out to you within 3 business days.
                            </p>
                            <button
                              type="button"
                              onClick={() => { setShowApplyForm(false); setApplicationSubmittedSuccess(false); }}
                              className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all border-none cursor-pointer"
                            >
                              Browse other jobs
                            </button>
                          </div>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!applicantName || !applicantEmail || !applicantPhone) {
                                return;
                              }
                              setApplicationSubmittedSuccess(true);
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            {/* Full Name */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-mono font-bold text-slate-600 uppercase block">Full Name *</label>
                              <input
                                type="text"
                                required
                                value={applicantName}
                                onChange={(e) => setApplicantName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-xs sm:text-sm rounded-lg focus:outline-none focus:border-brand-gold-500"
                              />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-mono font-bold text-slate-600 uppercase block">Email *</label>
                              <input
                                type="email"
                                required
                                value={applicantEmail}
                                onChange={(e) => setApplicantEmail(e.target.value)}
                                placeholder="name@domain.com"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-xs sm:text-sm rounded-lg focus:outline-none focus:border-brand-gold-500"
                              />
                            </div>

                            {/* Mobile Number */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-mono font-bold text-slate-600 uppercase block">Mobile Phone *</label>
                              <input
                                type="tel"
                                required
                                value={applicantPhone}
                                onChange={(e) => setApplicantPhone(e.target.value)}
                                placeholder="89877XXXXX"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-xs sm:text-sm rounded-lg focus:outline-none focus:border-brand-gold-500"
                              />
                            </div>

                            {/* Experience Level */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-mono font-bold text-slate-600 uppercase block">Experience *</label>
                              <select
                                value={applicantExperience}
                                onChange={(e) => setApplicantExperience(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-xs sm:text-sm rounded-lg focus:outline-none focus:border-brand-gold-500 font-medium"
                              >
                                <option value="Student / Intern">Student / Intern</option>
                                <option value="Fresher Graduate">Fresher Graduate</option>
                                <option value="Junior (1-2 years)">Junior (1-2 years)</option>
                                <option value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</option>
                                <option value="Senior (5+ years)">Senior (5+ years)</option>
                              </select>
                            </div>

                            {/* Statement / Message */}
                            <div className="md:col-span-2 space-y-1.5">
                              <label className="text-xs font-mono font-bold text-slate-600 uppercase block">Motivation Message & Resume Link</label>
                              <textarea
                                value={applicantMessage}
                                onChange={(e) => setApplicantMessage(e.target.value)}
                                placeholder="Paste your Google Drive resume link and write why you want to join our team..."
                                rows={3}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-xs sm:text-sm rounded-lg focus:outline-none focus:border-brand-gold-500"
                              />
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3.5 pt-2">
                              <button
                                type="button"
                                onClick={() => { setShowApplyForm(false); setApplicationSubmittedSuccess(false); }}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-all border-none cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="flex items-center gap-1.5 px-5 py-2 bg-brand-navy-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all shadow-sm border-none cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5 text-brand-gold-400" />
                                <span>Submit Resume Application</span>
                              </button>
                            </div>
                          </form>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Open Job list grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rolesData
                      .filter((role) => {
                        const matchCat = selectedCategory === "All" || role.category === selectedCategory;
                        const matchQuery = role.title.toLowerCase().includes(searchQuery.toLowerCase()) || role.description.toLowerCase().includes(searchQuery.toLowerCase());
                        return matchCat && matchQuery;
                      })
                      .map((role, rIdx) => (
                        <div
                          key={rIdx}
                          className="p-5 rounded-2xl bg-white border border-slate-200/70 hover:border-brand-gold-500/30 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-3.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] font-mono font-bold text-[#b7791f] bg-amber-500/10 px-2 py-0.5 rounded uppercase">
                                {role.category}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">
                                {role.type}
                              </span>
                            </div>
                            <h3 className="font-display font-extrabold text-base text-slate-900">
                              {role.title}
                            </h3>
                            <p className="text-xs text-black leading-relaxed font-bold">
                              {role.description}
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-1 text-slate-400 font-mono">
                              <MapPin className="w-3.5 h-3.5 text-brand-gold-600" />
                              <span className="truncate max-w-[120px]">{role.location}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setApplyingForRole(role);
                                setApplicantName("");
                                setApplicantEmail("");
                                setApplicantPhone("");
                                setApplicantMessage("");
                                setApplicationSubmittedSuccess(false);
                                setShowApplyForm(true);
                                window.scrollTo({ top: 320, behavior: "smooth" });
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-brand-gold-500 hover:text-slate-950 text-white text-[10px] font-bold rounded-lg transition-all border-none cursor-pointer"
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                </div>
              </div>
            )}

            {/* 7. BLOG PAGE */}
            {activePage === "blog" && (
              <div className="bg-slate-50 min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                  <div className="text-center max-w-3xl mx-auto space-y-4">
                    <h2 className="font-mono text-xs font-bold text-brand-gold-600 uppercase tracking-widest">C Vidya Tech Insights</h2>
                    <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-navy-900 uppercase tracking-wide">
                      THE VIDYA BLOG & NEWS
                    </h1>
                    <div className="w-16 h-1 bg-brand-gold-500 mx-auto rounded-full" />
                    <p className="text-xs sm:text-sm text-black font-semibold leading-relaxed">
                      Stay updated with the latest in academic SaaS modules, biometric check-in advancements, and local e-Governance updates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Article 1 */}
                    <article className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-xs hover:border-brand-gold-500/20 transition-all flex flex-col justify-between">
                      <div className="p-6 space-y-3.5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>June 28, 2026</span>
                          <span>Civic Tech</span>
                        </div>
                        <h3 className="font-display font-extrabold text-base text-slate-900 uppercase leading-snug">
                          How STPI Sindri is Driving Tech Transformation in Jharkhand
                        </h3>
                        <p className="text-xs text-black leading-relaxed font-bold">
                          An in-depth article looking at the collaboration desk at BIT Sindri Campus and how we build responsive systems for regional offices.
                        </p>
                      </div>
                      <div className="px-6 pb-6 pt-3 mt-auto border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-mono">By: Chiranjeev Das</span>
                        <span className="text-[10px] font-mono text-brand-gold-600 font-bold">Read Post</span>
                      </div>
                    </article>

                    {/* Article 2 */}
                    <article className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-xs hover:border-brand-gold-500/20 transition-all flex flex-col justify-between">
                      <div className="p-6 space-y-3.5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>May 15, 2026</span>
                          <span>OMR Engineers</span>
                        </div>
                        <h3 className="font-display font-extrabold text-base text-slate-900 uppercase leading-snug">
                          Designing Robust Offline OCR Systems for School OMR Evaluation
                        </h3>
                        <p className="text-xs text-black leading-relaxed font-bold">
                          Explore our custom optical scanner algorithms that allow private coaching networks to automatically compile offline exam statistics.
                        </p>
                      </div>
                      <div className="px-6 pb-6 pt-3 mt-auto border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-mono">By: Core R&D Wing</span>
                        <span className="text-[10px] font-mono text-brand-gold-600 font-bold">Read Post</span>
                      </div>
                    </article>

                    {/* Article 3 */}
                    <article className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-xs hover:border-brand-gold-500/20 transition-all flex flex-col justify-between">
                      <div className="p-6 space-y-3.5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>April 02, 2026</span>
                          <span>Smart Campuses</span>
                        </div>
                        <h3 className="font-display font-extrabold text-base text-slate-900 uppercase leading-snug">
                          The Power of RFID & Smart-Card Integrations on Campus
                        </h3>
                        <p className="text-xs text-black leading-relaxed font-bold">
                          Discover how our multitenant admissions modules are tie-ing hardware check-ins to parents' notification logs.
                        </p>
                      </div>
                      <div className="px-6 pb-6 pt-3 mt-auto border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-mono">By: Systems Team</span>
                        <span className="text-[10px] font-mono text-brand-gold-600 font-bold">Read Post</span>
                      </div>
                    </article>
                  </div>

                  {/* Newsletter registration box */}
                  <div className="bg-[#fcf8ec] border border-brand-gold-500/20 p-8 rounded-2xl max-w-2xl mx-auto text-center space-y-4">
                    <h3 className="font-display font-black text-lg text-brand-navy-950 uppercase">SUBSCRIBE TO THE TECH DESK UPDATE</h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                      Receive monthly updates on newly implemented STPI modules, hardware drivers, and compliance frameworks. No spam.
                    </p>
                    {newsletterSubscribed ? (
                      <div className="text-emerald-600 text-xs font-bold py-2">
                        ✓ Thank you! You have been successfully subscribed to our monthly updates.
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setNewsletterSubscribed(true);
                        }}
                        className="flex flex-col sm:flex-row gap-3.5 max-w-md mx-auto"
                      >
                        <input
                          type="email"
                          required
                          placeholder="Your email address"
                          className="flex-grow px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-gold-500"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-brand-navy-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all shrink-0 cursor-pointer border-none"
                        >
                          Subscribe Now
                        </button>
                      </form>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* 8. SEPARATE COMPLIANCE PAGES */}
            {["privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"].includes(activePage) && (
              <CompliancePage 
                initialTab={activePage as any} 
                onBackToHome={() => {
                  window.location.hash = "home";
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onTabChange={(tab) => {
                  window.location.hash = tab;
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FLOATING ACTION UTILITY: Smart AI Advisory Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          className="group flex items-center gap-2.5 px-4.5 py-3.5 bg-brand-navy-900 text-white rounded-full shadow-2xl hover:shadow-brand-gold-500/20 hover:bg-[#070e1b] border border-[#42A5F5] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer z-50 font-sans"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-brand-gold-400 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold font-mono tracking-wider">
            TALK TO VIDYA AI
          </span>
        </button>
      </div>

      {/* FLOATING DRAW-IN PANEL: Smart AI Advisory bot */}
      <AiAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />

      {/* FOOTER BLOCK: Gold wave ribbon background footer matching Image 1 base strip */}
      <footer className="bg-brand-navy-950 text-slate-300 pt-16 relative border-t-2 border-brand-gold-500">
        
        {/* Curvy background golden ribbon strip visual matching the base trim curves of Image 1 & 2 */}
        <div className="absolute top-0 right-0 w-80 h-32 opacity-10 bg-radial from-brand-gold-400 via-transparent to-transparent pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-800 pb-10">
            
            {/* Logo details Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <Logo size={54} showText={false} className="shrink-0" />
                <div>
                  <h4 className="font-display font-black text-xl md:text-2xl tracking-wider text-white">C VIDYA</h4>
                  <div className="text-xs font-mono tracking-widest text-white uppercase font-bold -mt-0.5">S O L U T I O N S</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-serif italic max-w-sm">
                "Innovating Software for a Simpler Future. Empowering local community businesses and municipal administrations in India since 2025."
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-3.5">
              <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">PRODUCT DIRECTORY</h5>
              <div className="grid grid-cols-1 gap-2 text-xs font-semibold text-slate-300">
                <button 
                  type="button" 
                  onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-brand-gold-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-slate-300"
                >
                  C Vidya Library Automation
                </button>
                <button 
                  type="button" 
                  onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-brand-gold-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-slate-300"
                >
                  C Vidya Fitness Zone Manager
                </button>
                <button 
                  type="button" 
                  onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-brand-gold-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-slate-300"
                >
                  Institutes Admission Systems
                </button>
                <button 
                  type="button" 
                  onClick={() => { setActivePage("services"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="hover:text-brand-gold-400 transition-colors text-left bg-transparent border-none p-0 cursor-pointer text-slate-300"
                >
                  E-Governance Municipal Portal
                </button>
              </div>
            </div>

            {/* Quick Contact Direct Panel Column */}
            <div className="md:col-span-4 space-y-3.5">
              <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">REGIONAL OFFICES</h5>
              <div className="text-xs space-y-3 text-slate-400 leading-relaxed font-sans">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                  <span className="flex flex-col gap-1.5 w-full">
                    <span><strong>HQ:</strong> Surunga, Baliapur, Dhanbad, Jharkhand - 828115</span>
                    <span className="border-t border-slate-800 pt-1.5"><strong>Branch & Director's Desk:</strong> STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                  <span className="flex flex-col gap-1">
                    <a href="mailto:cvidyasolutions@gmail.com" className="hover:text-brand-gold-400 transition-colors">
                      cvidyasolutions@gmail.com (Office)
                    </a>
                    <a href="mailto:chiranjeev0058@gmail.com" className="hover:text-brand-gold-400 transition-colors">
                      chiranjeev0058@gmail.com (Director/Founder: Chiranjeev Das)
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-gold-500 shrink-0" />
                  <a href="tel:+919288517027" className="hover:text-brand-gold-400 transition-colors font-medium">
                    +91 9288517027
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Intellectual property block strip with Legal and Privacy compliance center links */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-200 font-mono text-[10.5px] leading-relaxed uppercase">
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start">
              <span className="text-slate-300">© 2025 C Vidya Solutions. All rights reserved.</span>
              <span className="text-slate-400">•</span>
              <button 
                type="button"
                onClick={() => { window.location.hash = "privacy"; window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-white hover:text-brand-gold-400 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-bold"
              >
                Privacy Policy
              </button>
              <span className="text-slate-400">•</span>
              <button 
                type="button"
                onClick={() => { window.location.hash = "terms"; window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-white hover:text-brand-gold-400 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-bold"
              >
                Terms of Service
              </button>
              <span className="text-slate-400">•</span>
              <button 
                type="button"
                onClick={() => { window.location.hash = "billing"; window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-white hover:text-brand-gold-400 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-bold"
              >
                Trial & Billing
              </button>
              <span className="text-slate-400">•</span>
              <button 
                type="button"
                onClick={() => { window.location.hash = "refund"; window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-white hover:text-brand-gold-400 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-bold"
              >
                Refund & Cancellation Policy
              </button>
              <span className="text-slate-400">•</span>
              <button 
                type="button"
                onClick={() => { window.location.hash = "cookies"; window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-white hover:text-brand-gold-400 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-bold"
              >
                Cookie Policy
              </button>
              <span className="text-slate-400">•</span>
              <button 
                type="button"
                onClick={() => { window.location.hash = "disclaimer"; window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-white hover:text-brand-gold-400 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-bold"
              >
                Disclaimer
              </button>
              <span className="text-slate-400">•</span>
              <button 
                type="button"
                onClick={() => { window.location.hash = "portability"; window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="text-white hover:text-brand-gold-400 cursor-pointer transition-colors underline bg-transparent border-none p-0 font-bold"
              >
                Data Erasure
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
              {/* Social Media Links */}
              <div className="flex items-center gap-4 text-slate-300">
                <a href="https://www.youtube.com/@cvidyasolutions" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-400 transition-colors p-2 bg-brand-navy-900 rounded-full border border-slate-800 hover:border-brand-gold-500/50" title="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61591206215743" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-400 transition-colors p-2 bg-brand-navy-900 rounded-full border border-slate-800 hover:border-brand-gold-500/50" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/cvidyasolutions/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-400 transition-colors p-2 bg-brand-navy-900 rounded-full border border-slate-800 hover:border-brand-gold-500/50" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://twitter.com/CVidyaSolutions" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-400 transition-colors p-2 bg-brand-navy-900 rounded-full border border-slate-800 hover:border-brand-gold-500/50" title="Twitter / X">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com/company/cvidyasolutions" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-400 transition-colors p-2 bg-brand-navy-900 rounded-full border border-slate-800 hover:border-brand-gold-500/50" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <span className="hidden sm:inline text-slate-700">•</span>
              <button 
                type="button" 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:text-brand-gold-400 transition-colors underline bg-transparent border-none p-0 cursor-pointer text-white uppercase font-mono text-[10.5px] font-bold"
              >
                SCROLL TO TOP
              </button>
            </div>
          </div>

        </div>

      </footer>

      {/* GDPR / CCPA Cookie Consent Banner */}
      <CookieConsentBanner onManagePreferences={() => { window.location.hash = "cookies"; window.scrollTo({ top: 0, behavior: "smooth" }); }} />

      {/* Interactive Compliance Center Modal */}
      <ComplianceModal 
        isOpen={complianceOpen} 
        onClose={() => setComplianceOpen(false)} 
        initialTab={complianceTab} 
      />

      {/* Interactive Information & Feature Hub Modal */}
      <InfoHubModal 
        isOpen={hubOpen}
        onClose={() => setHubOpen(false)}
        initialTab={hubTab}
      />

    </div>
  );
}
