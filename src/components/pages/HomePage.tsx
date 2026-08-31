import { useState } from "react";
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
  ExternalLink
} from "lucide-react";
import Logo from "../Logo";
import { saasProductsData, aiAgentsData } from "../../data";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectProduct?: (product: any) => void;
  onOpenConsultation?: () => void;
}

export default function HomePage({ onNavigate, onSelectProduct, onOpenConsultation }: HomePageProps) {
  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-blue-50/40 via-white to-white">
        {/* Soft background ambient blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.12]">
                Intelligent{" "}
                <span className="text-blue-600">SaaS Products</span>{" "}
                &amp; Autonomous{" "}
                <span className="text-blue-600">AI Agents</span>.
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                One Platform. Endless Possibilities. Choose between our core SaaS Products for comprehensive enterprise management, or explore our AI Agent Suite for 24/7 autonomous intelligence.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="home-explore-solutions-btn"
                  onClick={() => onNavigate("services")}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-all hover:gap-3 cursor-pointer"
                >
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="home-view-case-studies-btn"
                  onClick={() => onNavigate("portfolio")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-md border border-slate-300 shadow-xs transition-colors cursor-pointer"
                >
                  View Case Studies
                </button>
              </div>

              {/* Social Proof */}
              <div className="pt-8 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-mono">
                <span className="tracking-wider uppercase font-semibold text-slate-400">TRUSTED BY INDUSTRY LEADERS</span>
                <div className="flex items-center gap-6 font-bold tracking-wider text-slate-600 text-sm">
                  <span>ACME CORP</span>
                  <span>GLOBEX</span>
                  <span>Initech</span>
                </div>
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
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 2. OUR CORE PILLARS SECTION */}
      <section className="py-20 bg-slate-50/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              Our Core Pillars
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Empowering businesses with technology, automation, and intelligence through our dual-engine approach.
            </p>
          </div>

          {/* Dual Engine Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Card 1: Software Solutions (SaaS) */}
            <div className="bg-white rounded-xl border border-slate-200 border-t-4 border-t-blue-600 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-6">
                {/* Card Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950">
                    Software Solutions (SaaS)
                  </h3>
                </div>

                {/* List of 7 SaaS Products */}
                <div className="space-y-4 pt-2">
                  
                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Library Management</div>
                      <div className="text-xs text-slate-500">Automated Book Issue &amp; Return, Membership Tracking</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <Dumbbell className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Fitness Zone</div>
                      <div className="text-xs text-slate-500">Comprehensive Gym Plan &amp; Member Tracking System</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Institutes Management</div>
                      <div className="text-xs text-slate-500">Multi-Branch Campus Administration &amp; Brand Power Portal</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <GraduationCap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Coaching Management</div>
                      <div className="text-xs text-slate-500">Supervise Test Analysis &amp; Automated Result Generation</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <Sprout className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Agrifusion</div>
                      <div className="text-xs text-slate-500">All-In-One Farming, Livestock &amp; Agriculture Management</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <Gem className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Jewelers Management</div>
                      <div className="text-xs text-slate-500">Precious Inventory Tracking &amp; Daily Profit Billing System</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Enterprise CRM</div>
                      <div className="text-xs text-slate-500">Manage Sales, Partners &amp; Leads Across All Modules</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action */}
              <div className="pt-8 border-t border-slate-100 mt-6">
                <button
                  onClick={() => onNavigate("services")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <span>Explore SaaS Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: AI Autonomous Agents */}
            <div className="bg-[#071739] text-white rounded-xl border border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-blue-500/50 transition-colors">
              <div className="space-y-6">
                {/* Card Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    AI Autonomous Agents
                  </h3>
                </div>

                {/* List of 4 AI Agents */}
                <div className="space-y-6 pt-2">
                  
                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <MessageSquare className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">Social Media AI Agent</div>
                      <div className="text-xs text-slate-400 leading-relaxed">Automate posts, engage audience &amp; grow your brand 24/7</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <Headphones className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">Customer Support AI Agent</div>
                      <div className="text-xs text-slate-400 leading-relaxed">Smart replies, instant support &amp; happy customers always</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <TrendingUp className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">Business Sales Flow AI Agent</div>
                      <div className="text-xs text-slate-400 leading-relaxed">Generate leads, follow-ups &amp; close more deals seamlessly</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 group cursor-pointer" onClick={() => onNavigate("services")}>
                    <Megaphone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">Marketing for B2B SaaS AI Agent</div>
                      <div className="text-xs text-slate-400 leading-relaxed">Data-driven campaigns, more reach, more conversions</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action */}
              <div className="pt-8 border-t border-slate-800 mt-6">
                <button
                  onClick={() => onNavigate("services")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <span>Explore AI Agents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3. ARCHITECTURAL EXPERTISE SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Architectural Expertise
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Delivering robust, scalable solutions across the entire technology stack with precision engineering.
              </p>
            </div>

            <button
              onClick={() => onNavigate("services")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer self-start md:self-auto"
            >
              <span>View all capabilities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
                    Cloud Infrastructure Migration
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base max-w-2xl">
                    Seamless transition of monolithic legacy systems to distributed, cloud-native microservices architectures ensuring high availability.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-medium">AWS</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-medium">Azure</span>
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
                    Zero-Trust Security
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Enterprise-grade cryptographic implementation and continuous vulnerability assessment protocols.
                  </p>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => onNavigate("services")}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Row: 3 Modular Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Data Lake Architecture */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <Database className="w-6 h-6 text-slate-800" />
                  <h4 className="text-lg font-bold text-slate-950">Data Lake Architecture</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Centralized repositories allowing storage of structured and unstructured data at massive scale.
                  </p>
                </div>
              </div>

              {/* AI Integration Services */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <Cpu className="w-6 h-6 text-slate-800" />
                  <h4 className="text-lg font-bold text-slate-950">AI Integration Services</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Deploying machine learning models into production environments with robust CI/CD pipelines.
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

    </div>
  );
}
