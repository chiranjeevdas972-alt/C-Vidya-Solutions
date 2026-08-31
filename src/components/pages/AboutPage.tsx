import { useState } from "react";
import { 
  Rocket, 
  Shield, 
  Cpu, 
  Gauge, 
  Briefcase, 
  Code2, 
  Network, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="pt-8 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#F0F5FA] border border-blue-100/60 rounded-3xl p-8 sm:p-14 text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight">
            Architecting the Future of{" "}
            <span className="text-blue-600 relative inline-block">
              Business Logic
              <span className="absolute bottom-1 left-0 w-full h-[3px] bg-blue-500/40 rounded-full" />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We are a collective of engineers, strategists, and problem-solvers dedicated to transforming complex enterprise challenges into elegant, scalable digital solutions. Our foundation is built on uncompromising technical precision and institutional trust.
          </p>
        </div>
      </section>


      {/* 2. OUR STORY & MISSION */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Heading with Blue Bar Accent */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-[3px] bg-blue-600 rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
            Our Story &amp; Mission
          </h2>
        </div>

        <div className="space-y-6">
          
          {/* Top Row: The Mission + Core Tenets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* The Mission (White Card) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950">
                The Mission
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                To empower global enterprises with high-fidelity, data-driven software architecture that accelerates operational efficiency and drives sustainable growth. We believe in engineering solutions that don't just solve today's problems, but anticipate tomorrow's challenges.
              </p>
            </div>

            {/* Core Tenets (Dark Navy Card) */}
            <div className="lg:col-span-4 bg-[#071739] text-white rounded-xl p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Core Tenets
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-200">Technical Precision</span>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-200">Institutional Trust</span>
                </div>

                <div className="flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-200">Modern Efficiency</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Timeline: A Legacy of Execution */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-950 mb-8">
              A Legacy of Execution
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              
              {/* Item 1: 2018 */}
              <div className="space-y-2 border-l-2 md:border-l-0 md:border-t-2 border-blue-600 pl-4 md:pl-0 md:pt-4 relative">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>2018</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">Foundation</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Established as a specialized consultancy focusing on core infrastructure modernization.
                </p>
              </div>

              {/* Item 2: 2021 */}
              <div className="space-y-2 border-l-2 md:border-l-0 md:border-t-2 border-blue-600 pl-4 md:pl-0 md:pt-4 relative">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>2021</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">Expansion</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Scaled operations globally, launching our proprietary data analytics practice.
                </p>
              </div>

              {/* Item 3: PRESENT */}
              <div className="space-y-2 border-l-2 md:border-l-0 md:border-t-2 border-blue-600 pl-4 md:pl-0 md:pt-4 relative">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>PRESENT</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">Innovation</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Leading the industry with AI-driven architectural solutions and continuous delivery.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* 3. LEADERSHIP & EXPERTISE */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Heading with Accent */}
        <div className="space-y-2 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[3px] bg-blue-600 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
              Leadership &amp; Expertise
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base">
            Guided by industry veterans committed to delivering strategic value and technological excellence.
          </p>
        </div>

        {/* 3 Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Executive 1: Sarah Jenkins */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              {/* Photo */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <img 
                  src="/assets/images/executive_sarah_jenkins_1788168567379.jpg" 
                  alt="Sarah Jenkins"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-slate-800 flex items-center justify-center shadow-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>

              {/* Text */}
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-950">Sarah Jenkins</h3>
                <div className="text-[11px] font-mono font-bold tracking-widest text-blue-600 uppercase">
                  CHIEF EXECUTIVE OFFICER
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  With over 15 years in enterprise software, Sarah drives the strategic vision of C Vidya, ensuring alignment between technological innovation and client value.
                </p>
              </div>
            </div>
          </div>

          {/* Executive 2: Marcus Chen */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              {/* Photo */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <img 
                  src="/assets/images/executive_marcus_chen_1788168582340.jpg" 
                  alt="Marcus Chen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-slate-800 flex items-center justify-center shadow-xs">
                  <Code2 className="w-4 h-4" />
                </div>
              </div>

              {/* Text */}
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-950">Marcus Chen</h3>
                <div className="text-[11px] font-mono font-bold tracking-widest text-blue-600 uppercase">
                  CHIEF TECHNOLOGY OFFICER
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  Marcus architected our core deployment pipelines and leads the R&amp;D division. He specializes in scalable microservices and distributed cloud infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* Executive 3: Elena Rodriguez */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div>
              {/* Photo */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <img 
                  src="/assets/images/executive_elena_rodriguez_1788168596538.jpg" 
                  alt="Elena Rodriguez"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs text-slate-800 flex items-center justify-center shadow-xs">
                  <Network className="w-4 h-4" />
                </div>
              </div>

              {/* Text */}
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-950">Elena Rodriguez</h3>
                <div className="text-[11px] font-mono font-bold tracking-widest text-blue-600 uppercase">
                  HEAD OF OPERATIONS
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  Elena ensures flawless execution across all client engagements. Her rigorous delivery methodologies guarantee projects are on-time and enterprise-ready.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
