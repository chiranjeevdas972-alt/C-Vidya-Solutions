import React, { useState } from "react";
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Layers, 
  CreditCard,
  ExternalLink,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "all" | "saas" | "ai" | "pricing" | "security";
  categoryLabel: string;
  question: string;
  answer: string;
  link?: {
    text: string;
    url: string;
  };
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-overview-1",
    category: "saas",
    categoryLabel: "SaaS Product Suite",
    question: "What software products does C Vidya Solutions offer?",
    answer: "C Vidya Solutions provides an enterprise suite of 7 industry-tailored SaaS products and 4 autonomous AI agents:\n\n• C Vidya Library Management: Digital book circulation, student seat allocator, and automated fine collection.\n• C Vidya Fitness Zone: Gym membership subscriptions, biometric turnstiles, and trainer workout ledgers.\n• C Vidya Institutes Management: Multi-branch campus admissions, student ERP, fee ledger, and CBSE/ICSE gradebooks.\n• C Vidya Coaching Management: Aspirants batch scheduling, OMR mock test rank evaluator, and parent SMS broadcasts.\n• AgriFusion (FarmFresh Hub): All-in-one agribusiness software for poultry, fishery, goat farming, livestock, and POS billing.\n• C Vidya Jewelry Management: Karat weight tracking, live gold/silver bullion rates, Karigar logs, and GST billing.\n• C Vidya Enterprise CRM: B2B sales pipeline, client quotation builder, and customer engagement timelines.",
    link: {
      text: "Explore SaaS Products",
      url: "#services"
    }
  },
  {
    id: "faq-ai-1",
    category: "ai",
    categoryLabel: "Autonomous AI Agents",
    question: "What are the 4 C Vidya Autonomous AI Agents and how do they work?",
    answer: "Our Autonomous AI Agents operate 24/7 as intelligent digital workforce extensions for your business:\n\n1. AI Social Media Agent: Researches viral trends, creates high-converting copy/graphics, and auto-publishes across LinkedIn, X (Twitter), Instagram & Facebook.\n2. AI Customer Support Agent: Resolves customer inquiries in under 0.8s using custom Knowledge Base RAG, omnichannel chat (Web/WhatsApp), and smooth human handoffs.\n3. SalesFlow AI Agent: Discovers verified B2B leads, crafts hyper-personalized email/WhatsApp sequences, scores buying intent, and books calendar demos.\n4. AI Marketing for B2B SaaS: Generates top-ranking SEO articles, automates LinkedIn thought leadership, creates lead magnets, and accelerates inbound pipeline.",
    link: {
      text: "View AI Agent Demos",
      url: "#services"
    }
  },
  {
    id: "faq-demo-1",
    category: "pricing",
    categoryLabel: "Demos & Trials",
    question: "How can I request a live demo or free trial for my organization?",
    answer: "You can request a free personalized product demo in two easy ways:\n\n1. Click 'Start Instant Chat' to chat directly with our 24/7 C-Vidya AI Customer Support Agent.\n2. Scroll to the Inquiry / Contact form and submit your business name, mobile number, email, and required software.\n\nOur solutions engineering team will configure a personalized test sandbox and schedule a guided walkthrough within 24 hours."
  },
  {
    id: "faq-pricing-1",
    category: "pricing",
    categoryLabel: "Pricing & Plans",
    question: "What is the pricing model for C Vidya Solutions software?",
    answer: "We offer transparent, modular, pay-as-you-grow SaaS pricing tailored for Indian businesses, institutions, and global enterprises:\n\n• Starter Tier: Ideal for single-branch libraries, gyms, and local poultry/agribusiness shops.\n• Professional Tier: Ideal for growing coaching centers, jewelry retailers, and mid-sized institutes.\n• Enterprise Custom: Dedicated server instances, multi-branch data consolidation, custom ERP modules, and priority 24/7 SLA.\n\nEvery plan includes software updates, SSL security, cloud backups, and dedicated onboarding support."
  },
  {
    id: "faq-security-1",
    category: "security",
    categoryLabel: "Security & Cloud",
    question: "How secure is our business data and what cloud architecture is used?",
    answer: "Security and reliability are engineered into the core of C Vidya Solutions:\n\n• Edge Cloud Infrastructure: Powered by global Cloudflare Workers edge nodes for sub-50ms latency and 99.99% uptime.\n• Bank-Grade Data Protection: Built on Google Cloud and Firebase Firestore with end-to-end TLS 1.3 encryption and automated daily backups.\n• Zero-Trust Role-Based Access (RBAC): Fine-grained permission controls so administrators, staff, trainers, and accountants access only authorized data.\n• STPI Sindri Compliance: Incubated and certified under Software Technology Parks of India (STPI) standards."
  },
  {
    id: "faq-library-1",
    category: "saas",
    categoryLabel: "Library System",
    question: "Can C Vidya Library Management handle seat bookings and barcode checkouts?",
    answer: "Yes! C Vidya Library Management includes dedicated reading room seat allocation maps (fixed or rotating seats), ISBN/barcode scanning for instant book issuance and returns, automated WhatsApp overdue fee alerts, student ID pass generation, and detailed reader circulation analytics.",
    link: {
      text: "Try Library Live Demo",
      url: "https://v.cvidyasolutions.workers.dev/"
    }
  },
  {
    id: "faq-fitness-1",
    category: "saas",
    categoryLabel: "CV Fitness Zone",
    question: "How does CV Fitness Zone integrate with biometric turnstiles and gym fees?",
    answer: "CV Fitness Zone features hardware-agnostic API integration with biometric fingerprint scanners, RFID smart wristbands, and facial recognition turnstile gates. When a member's monthly or annual subscription expires, the turnstile automatically flags unpaid status and sends a polite automated renewal payment link via SMS/WhatsApp.",
    link: {
      text: "Try Gym Software Live Demo",
      url: "https://fitzone.cvidyasolutions.workers.dev/"
    }
  },
  {
    id: "faq-agri-1",
    category: "saas",
    categoryLabel: "AgriFusion",
    question: "What farming operations does AgriFusion & FarmFresh Hub support?",
    answer: "AgriFusion is an all-in-one agribusiness ERP that manages:\n\n• Poultry Farming: Broiler/layer flock cycles, mortality tracking, feed intake, and vaccination schedules.\n• Fishery & Ponds: Water quality logs (pH, dissolved oxygen), fingerling stocking, and feeding timetables.\n• Goat Farming & Livestock: Herd breeding registries, weight gains, and milk/meat records.\n• Agribusiness POS: Fast point-of-sale wholesale/retail billing, distributor orders, expense tracking, and farm profit P&L reports.",
    link: {
      text: "Explore AgriFusion Live",
      url: "https://fresh.cvidyasolutions.workers.dev/"
    }
  },
  {
    id: "faq-migration-1",
    category: "security",
    categoryLabel: "Data Migration",
    question: "Can we import our existing Excel or legacy software records into C Vidya?",
    answer: "Yes. Our onboarding specialists provide turnkey data migration assistance. We securely import your existing student lists, book catalogs, member profiles, inventory sheets, and customer records from Excel, CSV, or SQL databases with zero downtime."
  },
  {
    id: "faq-company-1",
    category: "all",
    categoryLabel: "Company & STPI",
    question: "Where is C Vidya Solutions located and who is the founder?",
    answer: "C Vidya Solutions was founded in 2025 by Chiranjeev Das with the mission of innovating software for a simpler future.\n\n• Headquarters: Surunga, Baliapur, Dhanbad, Jharkhand - 828115\n• Branch Office & Director's Desk: STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand\n• Contact Phone: 8987766981 / +91 9288517027\n• Official Email: cvidyasolutions@gmail.com / chiranjeev0058@gmail.com\n• Website: https://cvidyasolutions.com"
  }
];

interface FAQSectionProps {
  onOpenChatbot?: () => void;
  onOpenInquiry?: (productName?: string) => void;
}

export default function FAQSection({ onOpenChatbot, onOpenInquiry }: FAQSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "saas" | "ai" | "pricing" | "security">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // ALL FAQ items are closed/hidden by default on load as requested
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQ_DATA.forEach(item => { allOpen[item.id] = true; });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const filteredFaqs = FAQ_DATA.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query) ||
      item.categoryLabel.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white text-slate-900 border-t border-slate-200/80 relative overflow-hidden">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#42A5F5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold-50 border border-brand-gold-200/60 text-brand-gold-700 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>KNOWLEDGE HUB & FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-4.5xl text-brand-navy-950 tracking-tight uppercase leading-none">
            FREQUENTLY ASKED{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold-600 via-brand-gold-500 to-[#d69e2e]">
              QUESTIONS
            </span>
          </h2>

          <div className="w-20 h-1 bg-brand-gold-500 mx-auto rounded-full" />

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Click on any question below to view detailed answers regarding our 7 SaaS product platforms, 4 autonomous AI agents, cloud security, and onboarding.
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="space-y-4 mb-10">
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword (e.g., Library, Gym, AI Agents, Pricing, Cloudflare, STPI)..."
              className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Questions", icon: <Layers className="w-3.5 h-3.5" /> },
                { id: "saas", label: "SaaS Products (7)", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
                { id: "ai", label: "Autonomous AI Agents (4)", icon: <Sparkles className="w-3.5 h-3.5 text-[#42A5F5]" /> },
                { id: "pricing", label: "Pricing & Demos", icon: <CreditCard className="w-3.5 h-3.5" /> },
                { id: "security", label: "Cloud & Security", icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? "bg-brand-navy-900 text-white border-brand-navy-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Expand / Collapse All */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-xs font-bold text-slate-500 hover:text-brand-navy-900 px-2.5 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Expand all
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={collapseAll}
                className="text-xs font-bold text-slate-500 hover:text-brand-navy-900 px-2.5 py-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Collapse all
              </button>
            </div>
          </div>
        </div>

        {/* Accordion FAQ List - Hidden by default until clicked */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold-50 text-brand-gold-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-display font-black text-lg text-slate-900">No questions found matching "{searchQuery}"</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Try searching for another keyword or ask our 24/7 AI Customer Support Assistant directly!
              </p>
              {onOpenChatbot && (
                <button
                  onClick={onOpenChatbot}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask C-Vidya AI Support Agent</span>
                </button>
              )}
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-200 border ${
                    isOpen 
                      ? "bg-white border-brand-gold-500/50 shadow-md ring-1 ring-brand-gold-500/20" 
                      : "bg-white hover:bg-slate-50/70 border-slate-200 shadow-2xs hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold-500 rounded-2xl"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wide">
                          #{String(index + 1).padStart(2, "0")} • {faq.categoryLabel}
                        </span>
                      </div>
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`p-2.5 rounded-xl transition-transform duration-200 shrink-0 ${
                      isOpen ? "bg-brand-gold-500 text-slate-950 rotate-180" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}>
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-sm text-slate-700 leading-relaxed border-t border-slate-100 space-y-4">
                      <div className="whitespace-pre-line font-normal text-slate-700 text-xs sm:text-sm">
                        {faq.answer}
                      </div>

                      {faq.link && (
                        <div className="pt-2">
                          <a
                            href={faq.link.url}
                            target={faq.link.url.startsWith("http") ? "_blank" : "_self"}
                            rel={faq.link.url.startsWith("http") ? "noopener noreferrer" : ""}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold-700 hover:text-brand-gold-900 bg-brand-gold-50 hover:bg-brand-gold-100 px-3 py-1.5 rounded-lg transition-colors border border-brand-gold-200/60"
                          >
                            <span>{faq.link.text}</span>
                            {faq.link.url.startsWith("http") ? (
                              <ExternalLink className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowRight className="w-3.5 h-3.5" />
                            )}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Contact / AI Chatbot Callout Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-slate-900 text-white shadow-xl border border-brand-gold-500/20 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-gold-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center justify-center md:justify-start gap-2 text-brand-gold-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Sparkles className="w-4 h-4" />
                <span>HAVE A SPECIFIC CUSTOM QUESTION?</span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide uppercase leading-tight">
                Ask the C Vidya AI Customer Support Agent in Real-Time
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Our 24/7 AI Assistant is trained on our complete software catalog, API architectures, pricing structures, and live client dashboards.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              {onOpenChatbot && (
                <button
                  type="button"
                  onClick={onOpenChatbot}
                  className="flex items-center gap-2 px-5 py-3 bg-brand-gold-500 hover:bg-brand-gold-400 text-slate-950 font-display font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer border-none"
                >
                  <Bot className="w-4 h-4" />
                  <span>Start Instant Chat</span>
                </button>
              )}
              {onOpenInquiry && (
                <button
                  type="button"
                  onClick={() => onOpenInquiry()}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wide rounded-xl transition-all border border-white/20 cursor-pointer"
                >
                  <span>Request Custom Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
