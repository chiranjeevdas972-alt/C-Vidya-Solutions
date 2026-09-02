import React, { useState } from "react";
import { 
  BookOpen, 
  Dumbbell, 
  Building2, 
  GraduationCap, 
  Sprout, 
  Gem, 
  Users, 
  MessageSquare, 
  Headphones, 
  TrendingUp, 
  Megaphone, 
  Cpu, 
  Compass, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock
} from "lucide-react";
import { saasProductsData, aiAgentsData } from "../../data";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface ServicesPageProps {
  onSelectProduct: (product: any) => void;
  onOpenSoftware?: (product: any) => void;
  onOpenConsultation?: () => void;
}

export default function ServicesPage({ onSelectProduct, onOpenSoftware, onOpenConsultation }: ServicesPageProps) {
  // Consultation Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("SaaS Products Demo");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setFormError("Please fill in your email and message.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      // 1. Direct Firestore Persistence
      try {
        const inquiriesCol = collection(db, "inquiries");
        await addDoc(inquiriesCol, {
          name: `${firstName} ${lastName}`.trim() || "Consultation Request",
          email: email.trim(),
          phone: "Consultation Form",
          service: `Consultation: ${interest}`,
          message: message.trim(),
          timestamp: new Date().toISOString(),
          status: "pending_review"
        });
      } catch (fbErr) {
        console.warn("Direct Firestore error, falling back to API:", fbErr);
      }

      // 2. Server API fallback
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim() || "Consultation Request",
          email: email.trim(),
          phone: "+91 (Consultation)",
          service: `Consultation: ${interest}`,
          message: message.trim()
        })
      }).catch(() => {});

      setSubmitted(true);
    } catch (err: any) {
      setFormError("Unable to submit right now. Please email directly at consulting@cvidyasolutions.com");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Architecting the Digital Future.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          We deliver comprehensive technology consulting, strategic business planning, and end-to-end digital transformation services designed to elevate enterprise operations and secure a competitive edge in a rapidly evolving market. Explore our innovative SaaS products and autonomous AI agents.
        </p>
      </section>


      {/* 2. OUR SAAS PRODUCTS SECTION */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-950 mb-8">
          Our SaaS Products
        </h2>

        {/* 2-Column Grid of 7 Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Library Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-950 tracking-wide">
                  C VIDYA LIBRARY MANAGEMENT
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Automated Book Issue &amp; Return, Membership Tracking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                onClick={() => onSelectProduct(saasProductsData[0])}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View more
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (onOpenSoftware) {
                    onOpenSoftware(saasProductsData[0]);
                  } else {
                    onSelectProduct(saasProductsData[0]);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* 2. Fitness Zone */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-950 tracking-wide">
                  C VIDYA FITNESS ZONE
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Comprehensive Gym Plan &amp; Member Tracking System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                onClick={() => onSelectProduct(saasProductsData[1])}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View more
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (onOpenSoftware) {
                    onOpenSoftware(saasProductsData[1]);
                  } else {
                    onSelectProduct(saasProductsData[1]);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* 3. Institutes Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-950 tracking-wide">
                  C VIDYA INSTITUTES MANAGEMENT
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Multi-Branch Campus Administration &amp; Brand Power Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                onClick={() => onSelectProduct(saasProductsData[2])}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View more
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (onOpenSoftware) {
                    onOpenSoftware(saasProductsData[2]);
                  } else {
                    onSelectProduct(saasProductsData[2]);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* 4. Coaching Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-950 tracking-wide">
                  C VIDYA COACHING MANAGEMENT
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Supervise Test Analysis &amp; Automated Result Generation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                onClick={() => onSelectProduct(saasProductsData[3])}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View more
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (onOpenSoftware) {
                    onOpenSoftware(saasProductsData[3]);
                  } else {
                    onSelectProduct(saasProductsData[3]);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* 5. Agrifusion */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-lime-100/70 text-lime-700 flex items-center justify-center shrink-0">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-950 tracking-wide">
                  AGRIFUSION
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  All-In-One Farming, Livestock &amp; Agriculture Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                onClick={() => onSelectProduct(saasProductsData[4])}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View more
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (onOpenSoftware) {
                    onOpenSoftware(saasProductsData[4]);
                  } else {
                    onSelectProduct(saasProductsData[4]);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* 6. Jewelers Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0">
                <Gem className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-950 tracking-wide">
                  C VIDYA JEWELERS MANAGEMENT
                </h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Precious Inventory Tracking &amp; Daily Profit Billing System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                onClick={() => onSelectProduct(saasProductsData[5])}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View more
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (onOpenSoftware) {
                    onOpenSoftware(saasProductsData[5]);
                  } else {
                    onSelectProduct(saasProductsData[5]);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* 7. Enterprise CRM */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-sm transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-slate-950 tracking-wide">
                  C VIDYA ENTERPRISE CRM
                </h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Manage Sales, Partners &amp; Leads Across All Modules
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                onClick={() => onSelectProduct(saasProductsData[6])}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                View more
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (onOpenSoftware) {
                    onOpenSoftware(saasProductsData[6]);
                  } else {
                    onSelectProduct(saasProductsData[6]);
                  }
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* 3. C VIDYA AI AGENTS SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-950 mb-8">
          C Vidya AI Agents
        </h2>

        {/* 2-Column Grid of 4 Dark Navy Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Agent 1 */}
          <div 
            onClick={() => onSelectProduct(aiAgentsData[0])}
            className="bg-[#071739] text-white rounded-xl p-6 shadow-sm hover:border-blue-500/50 border border-slate-800 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/20 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-blue-400 transition-colors">
                  C VIDYA AI SOCIAL MEDIA AGENT
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automate posts, engage audience &amp; grow your brand 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(aiAgentsData[0]);
                }}
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                View more
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSoftware) {
                    onOpenSoftware(aiAgentsData[0]);
                  } else {
                    onSelectProduct(aiAgentsData[0]);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* Agent 2 */}
          <div 
            onClick={() => onSelectProduct(aiAgentsData[1])}
            className="bg-[#071739] text-white rounded-xl p-6 shadow-sm hover:border-blue-500/50 border border-slate-800 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/20 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-blue-400 transition-colors">
                  C VIDYA AI CUSTOMER SUPPORT AGENT
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Smart replies, instant support &amp; happy customers always
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(aiAgentsData[1]);
                }}
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                View more
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSoftware) {
                    onOpenSoftware(aiAgentsData[1]);
                  } else {
                    onSelectProduct(aiAgentsData[1]);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* Agent 3 */}
          <div 
            onClick={() => onSelectProduct(aiAgentsData[2])}
            className="bg-[#071739] text-white rounded-xl p-6 shadow-sm hover:border-blue-500/50 border border-slate-800 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/20 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-blue-400 transition-colors">
                  C VIDYA BUSINESS SALES FLOW AI AGENT
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate leads, follow-ups &amp; close more deals seamlessly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(aiAgentsData[2]);
                }}
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                View more
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSoftware) {
                    onOpenSoftware(aiAgentsData[2]);
                  } else {
                    onSelectProduct(aiAgentsData[2]);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

          {/* Agent 4 */}
          <div 
            onClick={() => onSelectProduct(aiAgentsData[3])}
            className="bg-[#071739] text-white rounded-xl p-6 shadow-sm hover:border-blue-500/50 border border-slate-800 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/20 text-blue-400 flex items-center justify-center shrink-0 mt-1">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-blue-400 transition-colors">
                  C VIDYA AI MARKETING FOR B2B SAAS COMPANIES AI AGENT
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Data-driven campaigns, more reach, more conversions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(aiAgentsData[3]);
                }}
                className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                View more
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSoftware) {
                    onOpenSoftware(aiAgentsData[3]);
                  } else {
                    onSelectProduct(aiAgentsData[3]);
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer whitespace-nowrap"
              >
                Click here
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* 4. PROFESSIONAL CONSULTING SERVICES */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-950 mb-8">
          Professional Consulting Services
        </h2>

        <div className="space-y-6">
          
          {/* Top Row: Technology Consulting + Side Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Large Card: Technology Consulting */}
            <div className="lg:col-span-8 bg-white border border-slate-200 border-t-4 border-t-blue-600 rounded-xl p-8 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">
                  Technology Consulting
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Navigate the complexities of modern IT infrastructure. Our consulting services provide deep architectural assessments, technology stack modernization, and scalable system design to align your technical capabilities with core business objectives.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Enterprise Architecture Design</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Cloud Migration Strategies</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>IT Infrastructure Optimization</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Business Strategy & Digital Transformation */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Business Strategy */}
              <div className="bg-white border border-slate-200 border-t-2 border-t-blue-600 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Business Strategy</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Data-driven strategic planning to identify new revenue streams, optimize operational efficiency, and position your enterprise for sustainable growth.
                  </p>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={onOpenConsultation}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Digital Transformation */}
              <div className="bg-white border border-slate-200 border-t-2 border-t-blue-600 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Digital Transformation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Holistic integration of digital technology into all areas of business, fundamentally changing how you operate and deliver value to customers.
                  </p>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={onOpenConsultation}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Row: Data Analytics + Cybersecurity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Data Analytics */}
            <div className="bg-white border border-slate-200 border-t-2 border-t-blue-600 rounded-xl p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-950">Data Analytics</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transform raw data into actionable intelligence. We build robust data pipelines and visualization dashboards for informed decision-making.
                </p>
              </div>
              <div className="pt-4">
                <button 
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cybersecurity Solutions */}
            <div className="bg-white border border-slate-200 border-t-2 border-t-blue-600 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-slate-950">Cybersecurity Solutions</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                  Protect your digital assets with enterprise-grade security frameworks. From vulnerability assessments to zero-trust architecture implementation.
                </p>
                <div className="pt-1">
                  <button 
                    onClick={onOpenConsultation}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Graphic Icon Box */}
              <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 shrink-0 self-center">
                <ShieldCheck className="w-10 h-10 text-blue-500/80" />
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 5. REQUEST A CONSULTATION SECTION */}
      <section className="pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#071739] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Request a Consultation
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ready to accelerate your digital initiatives? Connect with our advisory team to discuss how C Vidya Solutions can engineer success for your organization.
              </p>

              <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Global Headquarters, Tech District</span>
                </div>
                <div className="flex items-center gap-3">
                  <Headphones className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href="mailto:consulting@cvidyasolutions.com" className="hover:text-blue-400 underline">
                    consulting@cvidyasolutions.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7">
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-lg">
                {submitted ? (
                  <div className="text-center py-10 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-950">Consultation Request Received</h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Our senior engineering advisor will reach out to you within 24 hours at <strong>{email}</strong>.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold"
                    >
                      Send Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleConsultationSubmit} className="space-y-4">
                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono font-medium text-slate-500 uppercase mb-1">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono font-medium text-slate-500 uppercase mb-1">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-medium text-slate-500 uppercase mb-1">Corporate Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-medium text-slate-500 uppercase mb-1">Area of Interest</label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SaaS Products Demo">SaaS Products Demo</option>
                        <option value="AI Agents Suite">AI Agents Suite</option>
                        <option value="Enterprise Technology Consulting">Enterprise Technology Consulting</option>
                        <option value="Cloud Migration & DevOps">Cloud Migration &amp; DevOps</option>
                        <option value="Custom Software Architecture">Custom Software Architecture</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-medium text-slate-500 uppercase mb-1">Message</label>
                      <textarea
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your project requirements..."
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-md shadow-sm transition-colors text-sm cursor-pointer"
                    >
                      {submitting ? "Submitting Request..." : "Submit Request"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
