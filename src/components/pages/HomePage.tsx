import React from "react";
import { 
  ArrowRight, 
  BookOpen, 
  Dumbbell, 
  Building2, 
  GraduationCap, 
  Sprout, 
  Gem, 
  Users, 
  Bot, 
  MessageSquare, 
  Headphones, 
  TrendingUp, 
  Megaphone, 
  ShieldCheck, 
  Cloud, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Flame,
  Activity,
  FileText,
  Briefcase,
  Layers,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import Logo from "../Logo";
import SeoHead from "../SeoHead";
import { CORE_PAGES_SEO, PRODUCT_SEO_DATA } from "../../seoData";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectProduct?: (product: any) => void;
  onOpenSoftware?: (product: any) => void;
  onOpenConsultation?: () => void;
}

export default function HomePage({ onNavigate, onSelectProduct: _onSelectProduct, onOpenSoftware: _onOpenSoftware, onOpenConsultation: _onOpenConsultation }: HomePageProps) {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 0. SEO DYNAMIC HEAD & STRUCTURED DATA */}
      <SeoHead
        title={CORE_PAGES_SEO.home.title}
        description={CORE_PAGES_SEO.home.description}
        canonicalUrl={CORE_PAGES_SEO.home.canonical}
      />
      
      {/* 1. HERO SECTION: COMPANY & VALUE PROPOSITION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-blue-50/40 via-white to-white" aria-labelledby="hero-heading">
        {/* Soft background ambient blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">

              {/* Headline */}
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.12]">
                C Vidya Solutions:{" "}
                <span className="text-blue-600">Cloud Business Software</span>{" "}
                &amp; Autonomous{" "}
                <span className="text-blue-600">AI Agents</span>.
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Architecting modern digital infrastructure. Explore 10 flagship multi-tenant SaaS software suites for campus, retail, and commercial operations, alongside 4 specialized autonomous AI agents delivering 24/7 business execution.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="/software/"
                  onClick={(e) => handleLink(e, "/software/")}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-all hover:gap-3 cursor-pointer"
                >
                  <span>Explore Software Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="/ai-agents/"
                  onClick={(e) => handleLink(e, "/ai-agents/")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  <span>Discover AI Agents</span>
                </a>

                <a
                  href="/portfolio/"
                  onClick={(e) => handleLink(e, "/portfolio/")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-md border border-slate-300 shadow-xs transition-colors cursor-pointer"
                >
                  <span>View Case Studies</span>
                </a>
              </div>

            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white border border-blue-200/80 rounded-2xl p-10 shadow-xl shadow-blue-500/5 flex flex-col items-center justify-center min-h-[380px]">
                
                {/* Central Brand Illustration */}
                <div className="flex flex-col items-center text-center space-y-4 my-6">
                  <div className="w-28 h-28 flex items-center justify-center">
                    <Logo size={100} showText={false} iconOnly />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-black tracking-widest text-slate-900 font-display">
                      C VIDYA
                    </div>
                    <div className="text-xs font-mono tracking-widest text-slate-500 font-bold uppercase">
                      — SOLUTIONS —
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Engineering high-reliability cloud software, multitenant SaaS suites, and verified AI agent automation.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE SOLUTIONS & DUAL ENGINE SECTION */}
      <section className="py-20 bg-slate-50/70 border-y border-slate-200/60" aria-labelledby="solutions-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 id="solutions-heading" className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              C Vidya Core Solutions &amp; Automation Engines
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Empowering institutions and commercial enterprises through dedicated software suites and autonomous 24/7 AI agents.
            </p>
          </div>

          {/* Dual Engine Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Card 1: Software Solutions (SaaS) */}
            <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-blue-600 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-6">
                {/* Card Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Database className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                      C Vidya Software Solutions
                    </h2>
                  </div>
                  <a
                    href="/software/"
                    onClick={(e) => handleLink(e, "/software/")}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Crawlable List of 10 SaaS Products */}
                <nav className="space-y-3 pt-2" aria-label="C Vidya Software Solutions">
                  
                  <a 
                    href="/software/library-management/"
                    onClick={(e) => handleLink(e, "/software/library-management/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya Library Management Software
                      </h3>
                      <p className="text-xs text-slate-500">Automated book circulation, barcode ISBN laser scanning, and study seat reservations.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/fitness-zone/"
                    onClick={(e) => handleLink(e, "/software/fitness-zone/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Dumbbell className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya Fitness Zone Management Software
                      </h3>
                      <p className="text-xs text-slate-500">Gym member subscription billing, biometric turnstile gates, and trainer rosters.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/institutes-management/"
                    onClick={(e) => handleLink(e, "/software/institutes-management/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya Institutes Management ERP
                      </h3>
                      <p className="text-xs text-slate-500">Multi-branch school administration, admissions pipeline, fee ledgers, and gradebooks.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/coaching-management/"
                    onClick={(e) => handleLink(e, "/software/coaching-management/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Activity className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya Coaching Management Software
                      </h3>
                      <p className="text-xs text-slate-500">Batch schedules, test series analytics, and automated parent report cards.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/enterprise-crm/"
                    onClick={(e) => handleLink(e, "/software/enterprise-crm/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Users className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya Enterprise CRM Software
                      </h3>
                      <p className="text-xs text-slate-500">Multi-stage sales pipelines, partner coordination, and customer relationship tracking.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/petrol-pump-management/"
                    onClick={(e) => handleLink(e, "/software/petrol-pump-management/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Flame className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya Petrol Pump Fuel Management Suite
                      </h3>
                      <p className="text-xs text-slate-500">Dispenser meter reconciliation, underground dip tank stock, and shift settlement.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/agriculture-management/"
                    onClick={(e) => handleLink(e, "/software/agriculture-management/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Sprout className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya AgriFusion Agribusiness Software
                      </h3>
                      <p className="text-xs text-slate-500">Crop planting cycles, livestock healthcare ledgers, and farm harvest inventory.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/jewellers-management/"
                    onClick={(e) => handleLink(e, "/software/jewellers-management/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Gem className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya Jewellers Management Software
                      </h3>
                      <p className="text-xs text-slate-500">Precious metals inventory, RFID barcode tags, hallmarking, and daily rate billing.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/healthcare-management/"
                    onClick={(e) => handleLink(e, "/software/healthcare-management/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Activity className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya Care Plus Healthcare Management System
                      </h3>
                      <p className="text-xs text-slate-500">Hospital OPD/IPD queues, electronic health records, and pharmacy point of sale.</p>
                    </div>
                  </a>

                  <a 
                    href="/software/pdf-media-tools/"
                    onClick={(e) => handleLink(e, "/software/pdf-media-tools/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">
                        C Vidya PDF &amp; Media Tools SaaS
                      </h3>
                      <p className="text-xs text-slate-500">Client-side PDF merging, document compression, and format conversion automation.</p>
                    </div>
                  </a>

                </nav>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-slate-100 mt-6">
                <a
                  href="/software/"
                  onClick={(e) => handleLink(e, "/software/")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>Browse All 10 Software Products</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 2: AI Autonomous Agents */}
            <div className="bg-[#071739] text-white rounded-xl border border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-blue-500/50 transition-colors">
              <div className="space-y-6">
                {/* Card Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      C Vidya Autonomous AI Agents
                    </h2>
                  </div>
                  <a
                    href="/ai-agents/"
                    onClick={(e) => handleLink(e, "/ai-agents/")}
                    className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>All Agents</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Crawlable List of 4 AI Agents */}
                <nav className="space-y-6 pt-2" aria-label="C Vidya Autonomous AI Agents">
                  
                  <a 
                    href="/ai-agents/customer-support/"
                    onClick={(e) => handleLink(e, "/ai-agents/customer-support/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-900/60 transition-colors block"
                  >
                    <Headphones className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                        C Vidya AI Customer Support Agent
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">24/7 autonomous sub-second RAG support with verified enterprise knowledge retrieval.</p>
                    </div>
                  </a>

                  <a 
                    href="/ai-agents/sales-flow/"
                    onClick={(e) => handleLink(e, "/ai-agents/sales-flow/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-900/60 transition-colors block"
                  >
                    <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                        C Vidya SalesFlow AI Outbound Agent
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Autonomous SDR agent automating multi-channel lead follow-ups and calendar bookings.</p>
                    </div>
                  </a>

                  <a 
                    href="/ai-agents/social-media/"
                    onClick={(e) => handleLink(e, "/ai-agents/social-media/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-900/60 transition-colors block"
                  >
                    <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                        C Vidya AI Social Media Marketing Agent
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Continuous editorial scheduling, trending hashtag analytics, and cross-channel distribution.</p>
                    </div>
                  </a>

                  <a 
                    href="/ai-agents/b2b-marketing/"
                    onClick={(e) => handleLink(e, "/ai-agents/b2b-marketing/")}
                    className="flex items-start gap-3.5 group p-2 rounded-lg hover:bg-slate-900/60 transition-colors block"
                  >
                    <Megaphone className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors text-sm">
                        C Vidya B2B SaaS Growth Marketing AI
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Autonomous inbound demand generation, semantic SEO research, and ROI attribution.</p>
                    </div>
                  </a>

                </nav>
              </div>

              {/* Action */}
              <div className="pt-6 border-t border-slate-800 mt-6">
                <a
                  href="/ai-agents/"
                  onClick={(e) => handleLink(e, "/ai-agents/")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Explore Autonomous AI Agents</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ARCHITECTURAL EXPERTISE & SERVICES SECTION */}
      <section className="py-20 bg-white" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 id="services-heading" className="text-3xl font-bold tracking-tight text-slate-950">
                Architectural Expertise &amp; Technology Consulting
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Delivering robust, scalable solutions across the entire technology stack with precision engineering.
              </p>
            </div>

            <a
              href="/services/"
              onClick={(e) => handleLink(e, "/services/")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors self-start md:self-auto"
            >
              <span>View all enterprise services</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Grid Layout */}
          <div className="space-y-6">
            
            {/* Top Row: 2 Big Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Large Card: Cloud Infrastructure Migration */}
              <div className="lg:col-span-8 bg-white border border-slate-200 border-t-4 border-t-blue-600 rounded-xl p-8 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950">
                    Cloud Infrastructure &amp; Multi-Tenant SaaS Migration
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base max-w-2xl">
                    Seamless transition of monolithic legacy systems to distributed, cloud-native microservices architectures ensuring high availability and zero operational downtime.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-medium">Cloudflare Workers</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-medium">Google Cloud Platform</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-medium">Firebase Firestore</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-medium">Kubernetes</span>
                </div>
              </div>

              {/* Right Dark Card: Zero-Trust Security */}
              <div className="lg:col-span-4 bg-[#071739] text-white rounded-xl p-8 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Zero-Trust Security &amp; Compliance
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Enterprise-grade cryptographic access control, role-based database rules, and audit trails conforming with DPDP Act, GDPR, and ISO standards.
                  </p>
                </div>

                <div className="pt-6">
                  <a 
                    href="/services/"
                    onClick={(e) => handleLink(e, "/services/")}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors inline-flex"
                    aria-label="View security services"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Row: 3 Modular Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Data Lake Architecture */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <Database className="w-6 h-6 text-slate-800" />
                  <h4 className="text-lg font-bold text-slate-950">Data Architecture &amp; ERP Ledgers</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Centralized ledgers ensuring auditability for fee collections, member subscriptions, fuel dip tanks, and precious retail items.
                  </p>
                </div>
              </div>

              {/* AI Integration Services */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <Cpu className="w-6 h-6 text-slate-800" />
                  <h4 className="text-lg font-bold text-slate-950">Enterprise AI RAG Integration</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Deploying verified retrieval-augmented models into production pipelines with strict guardrails and prompt-injection defense.
                  </p>
                </div>
              </div>

              {/* Stat Card: 150+ Enterprise Deployments */}
              <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <div className="text-4xl sm:text-5xl font-black text-blue-600 font-mono tracking-tight">
                  150+
                </div>
                <div className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase mt-2">
                  ENTERPRISE DEPLOYMENTS
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. INDUSTRIES SERVED SECTION */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80" aria-labelledby="industries-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 id="industries-heading" className="text-2xl sm:text-3xl font-bold text-slate-950">
              Specialized Industries Served
            </h2>
            <p className="text-sm text-slate-600">
              C Vidya Solutions architects domain-tailored software workflows across diverse commercial and academic sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Academic & Campus", desc: "Schools & Colleges", link: "/software/institutes-management/" },
              { title: "Gym & Fitness", desc: "Clubs & Studios", link: "/software/fitness-zone/" },
              { title: "Public & Reading Libraries", desc: "Study Centers", link: "/software/library-management/" },
              { title: "Fuel Retail", desc: "Petrol Stations", link: "/software/petrol-pump-management/" },
              { title: "Jewellery & Luxury", desc: "Retail & Wholesalers", link: "/software/jewellers-management/" },
              { title: "Healthcare & Clinical", desc: "Hospitals & OPD", link: "/software/healthcare-management/" }
            ].map((ind, i) => (
              <a
                key={i}
                href={ind.link}
                onClick={(e) => handleLink(e, ind.link)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all text-center group"
              >
                <div className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
                  {ind.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {ind.desc}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ABOUT COMPANY SUMMARY BANNER */}
      <section className="py-16 bg-white border-t border-slate-200" aria-labelledby="about-summary-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-[#071739] rounded-2xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 max-w-2xl">
              <div className="text-xs font-mono font-bold tracking-widest text-blue-300 uppercase">
                ENGINEERING HEADQUARTERS &amp; R&amp;D
              </div>
              <h2 id="about-summary-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
                About C Vidya Solutions
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Founded by Chiranjeev Das, C Vidya Solutions is dedicated to delivering transparent, high-performance software engineering. Headquartered in Dhanbad, Jharkhand, our labs partner with businesses across India and internationally.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href="/about/"
                onClick={(e) => handleLink(e, "/about/")}
                className="px-6 py-3 bg-white text-slate-950 font-semibold rounded-lg hover:bg-slate-100 transition-colors text-sm"
              >
                Read Company History
              </a>
              <a
                href="/contact/"
                onClick={(e) => handleLink(e, "/contact/")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Contact Director Desk
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

