import { useState } from "react";
import { 
  Search, 
  Info, 
  Wrench, 
  Cpu, 
  Gauge, 
  ChevronDown, 
  MessageSquare, 
  ArrowRight,
  Headphones
} from "lucide-react";

interface FAQPageProps {
  onNavigateContact?: () => void;
  onOpenAssistant?: () => void;
}

export default function FAQPage({ onNavigateContact, onOpenAssistant }: FAQPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "gen-1": true,
    "gen-2": false,
    "gen-3": false,
    "tech-1": true,
    "tech-2": false,
    "serv-1": true,
    "sup-1": true
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = [
    {
      category: "General Information",
      categoryId: "general",
      items: [
        {
          id: "gen-1",
          question: "What core services does C Vidya Solutions provide?",
          answer: "We provide end-to-end enterprise software solutions, including our proprietary SaaS Suite (Library, Fitness, Institutes, Coaching, Agrifusion, Jewelry, CRM), Autonomous AI Agent Systems, and custom Cloud Architecture & Digital Transformation consulting."
        },
        {
          id: "gen-2",
          question: "What industries do you primarily serve?",
          answer: "We serve Education & Academic Campuses, Fitness & Hospitality, Agriculture & Farming Enterprises, Retail & Bullion/Jewelry, Financial Technology (FinTech), Healthcare, and Municipal / Government Institutions across India and global markets."
        },
        {
          id: "gen-3",
          question: "Where are you located?",
          answer: "Our corporate headquarters and primary engineering center is in Surunga, Baliapur, Dhanbad, Jharkhand (828115), with an Academic R&D Incubation facility at the STPI Desk, BIT Sindri Campus, Dhanbad."
        }
      ]
    },
    {
      category: "Technical Integration",
      categoryId: "tech",
      items: [
        {
          id: "tech-1",
          question: "How long does a typical system integration take?",
          answer: "Turnkey deployments of our pre-built SaaS modules typically take 2 to 5 business days. Custom enterprise infrastructure migrations and bespoke AI agent orchestration pipelines typically span 3 to 6 weeks with zero downtime guarantees."
        },
        {
          id: "tech-2",
          question: "Do you support legacy system migration?",
          answer: "Yes. Our engineering division specializes in zero-downtime blue/green database synchronization, legacy mainframe/monolith decomposition, and automated ETL data ingestion into modern cloud-native microservices."
        }
      ]
    },
    {
      category: "Services & Solutions",
      categoryId: "services",
      items: [
        {
          id: "serv-1",
          question: "Can SaaS products be customized for our specific institution?",
          answer: "Yes! All C Vidya SaaS platforms support modular custom extensions, custom role hierarchies, localized report templates, and dedicated tenant isolation."
        },
        {
          id: "serv-2",
          question: "How do your AI Autonomous Agents integrate with existing CRMs?",
          answer: "Our AI Agents interface directly via REST webhooks, GraphQL, WhatsApp Business API, and automated database sync connectors to operate 24/7 without manual intervention."
        }
      ]
    },
    {
      category: "Support & Billing",
      categoryId: "support",
      items: [
        {
          id: "sup-1",
          question: "What SLA guarantees and support channels do you offer?",
          answer: "We provide 99.999% uptime SLA commitments for enterprise tiers, with 24/7 technical hotline access, dedicated Slack/WhatsApp bridge channels, and on-site engineering support."
        }
      ]
    }
  ];

  // Filtered sections based on active category and search
  const filteredSections = faqData.filter(section => {
    if (activeCategory === "All") return true;
    if (activeCategory === "general" && section.categoryId === "general") return true;
    if (activeCategory === "services" && section.categoryId === "services") return true;
    if (activeCategory === "tech" && section.categoryId === "tech") return true;
    if (activeCategory === "support" && section.categoryId === "support") return true;
    return false;
  }).map(section => {
    if (!searchQuery) return section;
    const q = searchQuery.toLowerCase();
    const matchingItems = section.items.filter(
      item => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    );
    return { ...section, items: matchingItems };
  }).filter(section => section.items.length > 0);

  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950">
          How can we help you today?
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Find answers to common questions about our services, integration processes, and support offerings.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>
      </section>


      {/* 2. MAIN LAYOUT: CATEGORIES SIDEBAR + ACCORDIONS */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Categories Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-500 uppercase px-2">
              Categories
            </h3>

            <div className="space-y-1">
              
              {/* General */}
              <button
                onClick={() => setActiveCategory(activeCategory === "general" ? "All" : "general")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                  activeCategory === "general"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Info className="w-4 h-4 text-slate-500" />
                <span>General</span>
              </button>

              {/* Services & Solutions */}
              <button
                onClick={() => setActiveCategory(activeCategory === "services" ? "All" : "services")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                  activeCategory === "services"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Wrench className="w-4 h-4 text-slate-500" />
                <span>Services &amp; Solutions</span>
              </button>

              {/* Technical Integration */}
              <button
                onClick={() => setActiveCategory(activeCategory === "tech" ? "All" : "tech")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                  activeCategory === "tech"
                    ? "bg-blue-100/80 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Technical Integration</span>
              </button>

              {/* Support & Billing */}
              <button
                onClick={() => setActiveCategory(activeCategory === "support" ? "All" : "support")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left cursor-pointer ${
                  activeCategory === "support"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Gauge className="w-4 h-4 text-slate-500" />
                <span>Support &amp; Billing</span>
              </button>

            </div>
          </div>


          {/* Right Column: Accordions */}
          <div className="lg:col-span-8 space-y-8">
            
            {filteredSections.map((section) => (
              <div key={section.categoryId} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-950">
                  {section.category}
                </h3>

                <div className="space-y-3">
                  {section.items.map((item) => {
                    const isOpen = !!openItems[item.id];
                    return (
                      <div 
                        key={item.id}
                        className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs transition-colors"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 hover:text-blue-600 text-sm sm:text-base cursor-pointer gap-4"
                        >
                          <span>{item.question}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredSections.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-sm text-slate-500">No matching questions found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}

          </div>

        </div>
      </section>


      {/* 3. BOTTOM CTA BANNER: STILL CAN'T FIND WHAT YOU'RE LOOKING FOR? */}
      <section className="pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#071739] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-6 relative overflow-hidden">
          
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Still can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Our technical support team is available 24/7 to assist you with complex queries and custom solution designs.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateContact || onOpenAssistant}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-all hover:gap-3 cursor-pointer text-sm"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
