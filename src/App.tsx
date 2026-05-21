import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import SkyscraperMockup from "./components/SkyscraperMockup";
import ProductSuite from "./components/ProductSuite";
import InquiryForm from "./components/InquiryForm";
import AiAssistant from "./components/AiAssistant";
import { 
  Building2, 
  Target, 
  UserCheck, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  Headphones, 
  Settings, 
  Sparkles, 
  MessageSquare,
  Bot,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  BookOpen,
  Wheat,
  Activity,
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const SLIDES = [
  {
    id: 1,
    titleLine1: "SMART SOFTWARE",
    titleLine2: "BETTER FUTURE",
    description: "Empowering businesses across India with clean, high-performance web ecosystems.",
    icon: (
      <div className="flex justify-center items-end gap-1 h-8 py-1">
        <div className="w-1.5 h-2 bg-[#f4cf5c] rounded-xs" />
        <div className="w-1.5 h-3.5 bg-[#f4cf5c] rounded-xs" />
        <div className="w-1.5 h-5 bg-[#f4cf5c] rounded-xs" />
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
      <div className="flex justify-center items-center gap-1.5 h-8 py-1">
        <div className="w-2 h-2 rounded-full bg-[#f4cf5c] animate-ping" />
        <div className="h-[1.5px] w-6 bg-[#f4cf5c]/60" />
        <div className="w-5 h-5 rounded-md border border-[#f4cf5c]/50 flex items-center justify-center font-mono text-[9px] text-[#f4cf5c] font-bold">V</div>
        <div className="h-[1.5px] w-6 bg-[#f4cf5c]/60" />
        <div className="w-2 h-2 rounded-full bg-[#f4cf5c]" />
      </div>
    )
  },
  {
    id: 3,
    titleLine1: "SECURED INTELLIGENCE",
    titleLine2: "ON-DEMAND SHIELD",
    description: "Built-in high-performance AES encrypted database, leads security lock, and private passcode validation.",
    icon: (
      <div className="flex justify-center items-center gap-1.5 h-8 py-1 text-[#f4cf5c]">
        <ShieldCheck className="w-5 h-5 text-[#f4cf5c]" />
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
        <div className="flex items-center gap-1 bg-[#f4cf5c]/10 text-[#f4cf5c] px-2 py-0.5 rounded border border-[#f4cf5c]/20 text-[10px] font-mono">
          <MapPin className="w-3 h-3" /> DHS, IN
        </div>
      </div>
    )
  }
];

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-brand-gold-200 selection:text-slate-900 overflow-x-hidden">
      
      {/* Premium Navigation Header */}
      <Header onOpenAssistant={() => setAiOpen(true)} />

      {/* Hero / Branding Split Section (Primary viewport matching Image 1 layout) */}
      <main id="hero" className="relative py-12 md:py-20 lg:py-28 bg-white overflow-hidden border-b border-slate-100">
        
        {/* Decorative Golden curvy ambient vector lines (mimicking the golden curves in Image 1 top-left) */}
        <div className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full bg-radial from-brand-gold-100/40 via-transparent to-transparent -translate-x-1/3 -translate-y-1/3 pointer-events-none select-none z-0" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border-2 border-brand-gold-500/10 pointer-events-none z-0" />
        <div className="absolute -top-24 -left-20 w-[450px] h-[450px] rounded-full border border-brand-gold-500/5 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Branding Content, About Us & Mission */}
            <div className="lg:col-span-7 space-y-9">
              
              {/* Main Branding Tag */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold-100/60 border border-brand-gold-500/20 text-xs font-mono font-bold text-brand-gold-700 uppercase tracking-widest animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EMPOWERING DIGITAL TRANSFORMATION</span>
                </div>
                
                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-5xl.5 text-brand-navy-900 tracking-tight leading-none">
                  C VIDYA <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-600 via-brand-gold-500 to-[#d69e2e]">
                    SOLUTION
                  </span>
                </h1>

                <p className="font-display font-extrabold text-sm sm:text-base tracking-widest text-[#1d2b4a] uppercase border-l-3 border-brand-gold-500 pl-3">
                  INNOVATING SOFTWARE FOR A SIMPLER FUTURE
                </p>
              </div>

              {/* SECTION: ABOUT US */}
              <section id="about" className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 shadow-xs border border-brand-gold-500/10">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <h2 className="font-display font-extrabold text-base sm:text-lg text-brand-navy-900 tracking-tight">
                    ABOUT US
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal space-y-2.5">
                  <p>
                    C Vidya Solution is a technology company established in 2025 with a vision to empower businesses through smart and efficient software solutions.
                  </p>
                  <p>
                    We provide all types of software solutions designed to simplify operations, improve productivity and drive growth.
                  </p>
                </div>
              </section>

              {/* SECTION: OUR MISSION */}
              <section id="mission" className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 shadow-xs border border-brand-gold-500/10">
                    <Target className="w-4.5 h-4.5" />
                  </div>
                  <h2 className="font-display font-extrabold text-base sm:text-lg text-brand-navy-900 tracking-tight">
                    OUR MISSION
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal space-y-2.5">
                  <p>
                    Our mission is to build intelligent software that makes every type of work simple, fast and efficient.
                  </p>
                  <p>
                    We believe in technology that empowers people, saves time and creates better opportunities for businesses of all sizes.
                  </p>
                </div>
              </section>

              {/* Quick Action Navigation links */}
              <div className="flex flex-wrap gap-3.5 pt-1.5">
                <a
                  href="#services"
                  className="flex items-center gap-2 px-5 py-3 bg-brand-navy-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all hover:shadow-md cursor-pointer"
                >
                  <span>Explore Product Suite</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold-400" />
                </a>
                <button
                  onClick={() => setAiOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 text-xs font-bold rounded-xl transition-all hover:shadow-md cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Consult Vidya AI Consultant</span>
                </button>
              </div>

            </div>

            {/* Right Column: Physical glass skyscraper mockup mimicking image logo board */}
            <div className="lg:col-span-5 relative">
              <SkyscraperMockup />
            </div>

          </div>
        </div>
      </main>

      {/* WHY CHOOSE US - Circle icon metric indicators (Row section matching Image 1 indicators) */}
      <section className="py-16 md:py-20 bg-slate-900 text-white relative border-b border-brand-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-gold-500 rounded-full animate-pulse" />
              <span>WHY CHOOSE US</span>
              <span className="w-2.5 h-2.5 bg-brand-gold-500 rounded-full animate-pulse" />
            </h2>
            <div className="h-0.5 w-16 bg-[#d69e2e] mx-auto mt-2.5" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 justify-center text-center">
            
            {/* Indicator 1 */}
            <div className="group flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-gold-500/10 hover:bg-brand-gold-500 hover:text-slate-950 text-brand-gold-400 border border-brand-gold-500/30 transition-all scale-100 group-hover:scale-105 duration-300">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-wide text-white">User Friendly</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-widest">Minimalist UI</p>
              </div>
            </div>

            {/* Indicator 2 */}
            <div className="group flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-gold-500/10 hover:bg-brand-gold-500 hover:text-slate-950 text-brand-gold-400 border border-brand-gold-500/30 transition-all scale-100 group-hover:scale-105 duration-300">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-wide text-white">Time Saving</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-widest">Rapid Actions</p>
              </div>
            </div>

            {/* Indicator 3 */}
            <div className="group flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-gold-500/10 hover:bg-brand-gold-500 hover:text-slate-950 text-brand-gold-400 border border-brand-gold-500/30 transition-all scale-100 group-hover:scale-105 duration-300">
                <IndianRupee className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-wide text-white">Cost Effective</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-widest">Maximum ROI</p>
              </div>
            </div>

            {/* Indicator 4 */}
            <div className="group flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-gold-500/10 hover:bg-brand-gold-500 hover:text-slate-950 text-brand-gold-400 border border-brand-gold-500/30 transition-all scale-100 group-hover:scale-105 duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-wide text-white">Secure & Reliable</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-widest">Bank-Level TLS</p>
              </div>
            </div>

            {/* Indicator 5 */}
            <div className="group flex flex-col items-center gap-3 col-span-2 md:col-span-1">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-brand-gold-500/10 hover:bg-brand-gold-500 hover:text-slate-950 text-brand-gold-400 border border-brand-gold-500/30 transition-all scale-100 group-hover:scale-105 duration-300">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-wide text-white">Dedicated Support</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-widest">24x7 Hotlines</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* WHAT WE DO - Core Industries block (Grid layout section matching Image 1 bottom) */}
      <section className="py-20 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Box: Gear icon and explanation details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-brand-gold-500 to-[#d69e2e] text-slate-950 shadow-md">
                  <Settings className="w-5.5 h-5.5 animate-spin-slow" />
                </div>
                <h2 className="font-display font-black text-2.5xl text-brand-navy-900 tracking-tight uppercase leading-none">
                  WHAT WE DO
                </h2>
              </div>
              
              <div className="text-sm text-slate-600 leading-relaxed font-normal space-y-4">
                <p>
                  We develop and deliver powerful software solutions for a wide range of industries including Education, Fitness, Libraries, Coaching, CRM, Municipal, Farming, Membership and more.
                </p>
                <p>
                  Our goal is to provide smart, reliable and easy-to-use software that helps businesses grow and succeed.
                </p>
              </div>

              {/* Grid indices representing our targeted industries */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono font-bold text-brand-navy-900">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-gold-500" />
                  <span>Academic Gates</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-gold-500" />
                  <span>Public Works Tech</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-gold-500" />
                  <span>Aspirants SMS CRM</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-gold-500" />
                  <span>IoT Agri-Telemetry</span>
                </div>
              </div>

            </div>

            {/* Right Box: Elegant Grid illustrating high priority target areas with mini icons */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 hover:border-[#f4cf5c]/25 transition-all space-y-2">
                <div className="w-8 h-8 rounded-lg bg-brand-navy-50 text-brand-gold-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-display font-extrabold text-[#111827] text-sm uppercase">01. Academic Ledgers</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Integrated books tracking systems, automatic dues notifications, and student membership databases.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 hover:border-[#f4cf5c]/25 transition-all space-y-2">
                <div className="w-8 h-8 rounded-lg bg-brand-navy-50 text-brand-gold-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="font-display font-extrabold text-[#111827] text-sm uppercase">02. Fitness & Gyms</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Turnstile check-ins tracking integrations, workout diary planners, and billing cards logs.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 hover:border-[#f4cf5c]/25 transition-all space-y-2">
                <div className="w-8 h-8 rounded-lg bg-brand-navy-50 text-brand-gold-600 flex items-center justify-center">
                  <Wheat className="w-4 h-4" />
                </div>
                <h4 className="font-display font-extrabold text-[#111827] text-sm uppercase">03. Farming Tech</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Soil indicators reports logs, direct purchase orders matrix, and tractor expense ledgers.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 hover:border-[#f4cf5c]/25 transition-all space-y-2">
                <div className="w-8 h-8 rounded-lg bg-brand-navy-50 text-brand-gold-600 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="font-display font-extrabold text-[#111827] text-sm uppercase">04. Corporate CRM</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Leads qualification pipelines, sales staff transaction maps, and automatic quote receipts.</p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* QUOTE BLOCK BANNER - Deep slate layout with elegant slide movement */}
      <section className="bg-brand-navy-900 border-y border-brand-gold-500/20 py-12 relative overflow-hidden text-center text-white min-h-[340px] flex items-center justify-center">
        
        {/* Subtle glowing center gold circle background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-gold-500/5 blur-3xl z-0 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 w-full flex flex-col justify-between items-center min-h-[220px]">
          {/* Double Yellow Quote Icon top */}
          <div className="text-brand-gold-400 font-serif text-6xl leading-none select-none h-6 -mb-4">
            “
          </div>

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
                  <span className="text-[#f4cf5c]"> {SLIDES[activeSlide].titleLine2}</span>
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed px-6">
                  {SLIDES[activeSlide].description}
                </p>

                {/* Micro icon/accent step element representation */}
                <div className="pt-1">
                  {SLIDES[activeSlide].icon}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-brand-gold-400 font-serif text-6xl leading-none select-none h-6 -mt-2">
            ”
          </div>

          {/* Slider controls and indicators */}
          <div className="flex items-center gap-6 mt-4 relative z-20">
            <button
              onClick={handlePrevSlide}
              className="p-1.5 rounded-full hover:bg-white/5 active:scale-90 border border-transparent hover:border-brand-gold-500/10 text-white/50 hover:text-[#f4cf5c] transition-all cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination dots indicator */}
            <div className="flex gap-2.5">
              {SLIDES.map((slide, sIdx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(sIdx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === sIdx 
                      ? "bg-[#f4cf5c] scale-125 shadow-md shadow-brand-gold-500/20" 
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${sIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              className="p-1.5 rounded-full hover:bg-white/5 active:scale-90 border border-transparent hover:border-brand-gold-500/10 text-white/50 hover:text-[#f4cf5c] transition-all cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* OUR SERVICES: 01 to 08 products with Interactive Laptop Emulator */}
      <ProductSuite />

      {/* CONTACT US: inquiries capture, QR details, map block */}
      <InquiryForm />

      {/* FLOATING ACTION UTILITY: Smart AI Advisory Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setAiOpen(true)}
          className="group flex items-center gap-2.5 px-4.5 py-3.5 bg-brand-navy-900 text-white rounded-full shadow-2xl hover:shadow-brand-gold-500/20 hover:bg-[#070e1b] border border-[#f4cf5c] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer z-50 font-sans"
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
                <div className="w-10 h-10 flex items-center justify-center bg-brand-navy-900 border border-brand-gold-500 rounded-full">
                  <svg viewBox="0 0 100 100" className="w-6 h-6 fill-[#f4cf5c]">
                    <path d="M20,25 C20,25 45,15 50,22 C55,15 80,25 80,25 L80,75 C80,75 55,65 50,70 C45,65 20,75 20,75 Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display font-black text-lg tracking-wider text-[#f5d77f]">C VIDYA</h4>
                  <div className="text-[10px] font-mono tracking-widest text-[#d69e2e] uppercase font-bold -mt-0.5">S O L U T I O N</div>
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
                <a href="#services" className="hover:text-brand-gold-400 transition-colors">C Vidya Library Automation</a>
                <a href="#services" className="hover:text-brand-gold-400 transition-colors">C Vidya Fitness Zone Manager</a>
                <a href="#services" className="hover:text-brand-gold-400 transition-colors">Institutes Admission Systems</a>
                <a href="#services" className="hover:text-brand-gold-400 transition-colors">E-Governance Municipal Portal</a>
              </div>
            </div>

            {/* Quick Contact Direct Panel Column */}
            <div className="md:col-span-4 space-y-3.5">
              <h5 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">REGIONAL OFFICES</h5>
              <div className="text-xs space-y-3 text-slate-400 leading-relaxed font-sans">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                  <span className="flex flex-col gap-1.5 w-full">
                    <span><strong>HQ:</strong> Surunga, Baliapur, Dhanbad, Jharkhand - 828115</span>
                    <span className="border-t border-slate-800 pt-1.5"><strong>Branch / officer Desk:</strong> STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand</span>
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                  <span className="flex flex-col gap-1">
                    <a href="mailto:cvidya32@gmail.com" className="hover:text-brand-gold-400 transition-colors">
                      cvidya32@gmail.com (Office)
                    </a>
                    <a href="mailto:chiranjeev0058@gmail.com" className="hover:text-brand-gold-400 transition-colors">
                      chiranjeev0058@gmail.com (Officer)
                    </a>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-gold-500 shrink-0" />
                  <a href="tel:8987766981" className="hover:text-brand-gold-400 transition-colors font-medium">
                    8987766981
                  </a>
                </p>
              </div>
            </div>

          </div>

          {/* Intellectual property block strip */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 font-mono text-[10px] leading-none uppercase">
            <div>
              © 2025 C Vidya Solution. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>DESIGNED UNDER THE METALLIC GOLD CONSTRAINTS</span>
              <span>•</span>
              <a href="#hero" className="hover:text-brand-gold-400 transition-colors underline">SCROLL TO TOP</a>
            </div>
          </div>

        </div>

      </footer>

    </div>
  );
}
