import { useState, useMemo } from "react";
import { 
  ArrowRight, 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Database, 
  Cpu, 
  Bot, 
  Building2, 
  Sparkles,
  Search
} from "lucide-react";
import SeoHead from "../SeoHead";
import { CORE_PAGES_SEO } from "../../seoData";

interface PortfolioPageProps {
  onNavigate?: (page: string) => void;
}

export default function PortfolioPage({ onNavigate }: PortfolioPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  const projects = [
    {
      id: "fintech",
      category: "FinTech",
      title: "Global Payments Consolidation",
      description: "Streamlined a fragmented legacy payment infrastructure into a unified, highly available cloud-native platform, processing $2B+ annually with 99.999% uptime.",
      bgImage: "/assets/images/portfolio_fintech_dash_1788168637880.jpg",
      badge: "FinTech",
      badgeColor: "bg-blue-600 text-white",
      stats: [
        { label: "Annual Volume", value: "$2.4 Billion" },
        { label: "Uptime SLA", value: "99.999%" },
        { label: "Latency", value: "< 45ms global" }
      ],
      details: "Our engineering team unified 14 distributed payment gateways into a single idempotent microservices mesh deployed across multi-region Kubernetes clusters with zero scheduled downtime.",
      technologies: ["Node.js", "Kubernetes", "PostgreSQL", "Kafka", "mTLS"]
    },
    {
      id: "retail",
      category: "Data Analytics",
      title: "Predictive Retail Engine",
      description: "Implemented machine learning neural models to forecast inventory needs, reducing waste and optimizing supply chain logistics.",
      bgImage: "/assets/images/predictive_ai_network_1788168655936.jpg",
      badge: "Data Analytics",
      badgeColor: "bg-emerald-600 text-white",
      stats: [
        { label: "Waste Reduction", value: "-34%" },
        { label: "Forecast Accuracy", value: "96.8%" },
        { label: "SKUs Tracked", value: "1.2 Million" }
      ],
      details: "Deployed real-time neural forecasting algorithms ingesting point-of-sale data, weather forecasts, and supplier latency telemetry to dynamically balance warehouse stock.",
      technologies: ["Python", "TensorFlow", "FastAPI", "ClickHouse", "Redis"]
    },
    {
      id: "cloud",
      category: "Cloud Infrastructure",
      title: "Enterprise Cloud Migration",
      description: "Zero-downtime transition of 500+ legacy applications to a modern microservices architecture with automated CI/CD pipelines and blue-green deployments.",
      bgImage: "/assets/images/datacenter_server_room_1788168670156.jpg",
      badge: "Cloud Infrastructure",
      badgeColor: "bg-indigo-600 text-white",
      stats: [
        { label: "Apps Migrated", value: "500+" },
        { label: "Downtime Recorded", value: "0.00s" },
        { label: "Cost Savings", value: "42% YoY" }
      ],
      details: "Engineered a zero-downtime blue/green migration strategy orchestrating containerized workloads, automated database synchronization, and zero-trust IAM security.",
      technologies: ["Terraform", "AWS / Azure", "Docker", "Istio Service Mesh", "Datadog"]
    },
    {
      id: "ai-agents",
      category: "AI Agents",
      title: "Autonomous Sales & Support Intelligence",
      description: "Multi-agent LLM orchestration deployed across customer channels to automate ticket triage, lead qualification, and dynamic B2B contract onboarding.",
      bgImage: "/assets/images/crm_software_dashboard_1784909507564.jpg",
      badge: "AI Agents",
      badgeColor: "bg-purple-600 text-white",
      stats: [
        { label: "Resolution Speed", value: "12x Faster" },
        { label: "Qualified Leads", value: "+185%" },
        { label: "Human Escalation", value: "< 4.2%" }
      ],
      details: "Configured stateful LangGraph agents with vector RAG pipelines to autonomously draft quotes, schedule demos, and verify customer KYC parameters in real-time.",
      technologies: ["Gemini 2.5", "LangGraph", "Vector DB", "WebSockets", "OAuth2"]
    },
    {
      id: "smart-city",
      category: "SaaS Suite",
      title: "Municipal & Smart Governance Portal",
      description: "Cloud-native governance suite powering citizen grievance resolution, municipal tax invoicing, and city asset tracking for over 450,000 citizens.",
      bgImage: "/assets/images/municipal_software_dashboard_1784909536257.jpg",
      badge: "SaaS Suite",
      badgeColor: "bg-cyan-600 text-white",
      stats: [
        { label: "Citizen Reach", value: "450K+" },
        { label: "Processing Speed", value: "< 24 Hours" },
        { label: "Tax Collection", value: "+38% YoY" }
      ],
      details: "Built an auditable, role-based governance backbone with integrated SMS alerts, secure payment gateways, and GIS geospatial asset mapping.",
      technologies: ["React", "PostgreSQL", "GIS Mapping", "Payment Gateway", "Docker"]
    },
    {
      id: "agrifusion",
      category: "SaaS Suite",
      title: "Agrifusion Supply Chain Optimization",
      description: "Integrated farm-to-table livestock, crop monitoring, and daily wholesale grain auction marketplace supporting 25+ regional producer hubs.",
      bgImage: "/assets/images/agrifusion_software_dashboard_1784909491641.jpg",
      badge: "SaaS Suite",
      badgeColor: "bg-emerald-700 text-white",
      stats: [
        { label: "Producer Hubs", value: "25+ Hubs" },
        { label: "Spoilage Cut", value: "-28%" },
        { label: "Farmer Income", value: "+22%" }
      ],
      details: "Delivered low-bandwidth mobile-friendly agricultural dashboards with offline synchronization and real-time mandi rate updates.",
      technologies: ["PWA", "Offline Sync", "Node.js", "Redis", "Cloud Run"]
    }
  ];

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q)) ||
      p.details.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-24">
      <SeoHead
        title={CORE_PAGES_SEO.portfolio.title}
        description={CORE_PAGES_SEO.portfolio.description}
        canonicalUrl={CORE_PAGES_SEO.portfolio.canonical}
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "C Vidya Solutions Engineering Portfolio",
          "url": "https://cvidyasolutions.com/portfolio/",
          "description": CORE_PAGES_SEO.portfolio.description,
          "provider": {
            "@type": "Organization",
            "name": "C Vidya Solutions",
            "url": "https://cvidyasolutions.com"
          }
        }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="pt-10 sm:pt-14 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950">
          Engineering Impact &amp; <span className="text-blue-600">Proof of Value</span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Explore a curated selection of our high-fidelity enterprise software architectures, SaaS deployments, and autonomous AI systems delivered with institutional trust.
        </p>

        {/* Search Engine Bar */}
        <div className="pt-6 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, architectures, technologies..."
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. CASE STUDIES GRID - CLEAN IMAGE ON TOP, CONTENT ON BOTTOM */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => setSelectedCase(project)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Visual Header - Clean Unobscured Image */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-950">
                  <img 
                    src={project.bgImage} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded text-xs font-mono font-bold tracking-wider ${project.badgeColor} shadow-xs`}>
                      {project.badge}
                    </span>
                  </div>
                </div>

                {/* Content Body on Bottom Side of Image */}
                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950 group-hover:text-blue-600 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Action: Retain arrow directions icon button to open details */}
              <div className="p-6 sm:p-7 pt-0 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCase(project);
                  }}
                  className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer group-hover:scale-105 active:scale-95"
                  title="View Case Details"
                  aria-label="View Case Details"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-800">No projects match "{searchQuery}"</div>
            <p className="text-xs text-slate-500">Try adjusting your search terms or keywords.</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* Case Study Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto border border-slate-100">
            <button 
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header Image */}
            <div className="relative h-44 sm:h-56 w-full rounded-xl overflow-hidden bg-slate-950">
              <img 
                src={selectedCase.bgImage} 
                alt={selectedCase.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold mb-1.5 ${selectedCase.badgeColor}`}>
                  {selectedCase.badge}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">{selectedCase.title}</h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {selectedCase.description}
            </p>

            {/* Key Outcomes / Metrics */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Quantifiable Outcomes</h4>
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                {selectedCase.stats.map((s: any, idx: number) => (
                  <div key={idx}>
                    <div className="text-[10px] sm:text-xs font-mono uppercase text-slate-500">{s.label}</div>
                    <div className="text-sm sm:text-lg font-bold text-blue-600 font-mono mt-0.5">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Execution */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Architecture &amp; Execution</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                {selectedCase.details}
              </p>
            </div>

            {/* Technologies */}
            {selectedCase.technologies && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Technologies Deployed</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.technologies.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedCase(null);
                  if (onNavigate) onNavigate("contact");
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Inquire Similar Solution
              </button>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

