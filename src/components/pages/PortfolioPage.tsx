import { useState } from "react";
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
  Sparkles
} from "lucide-react";

interface PortfolioPageProps {
  onNavigate?: (page: string) => void;
}

export default function PortfolioPage({ onNavigate }: PortfolioPageProps) {
  const [activeFilter, setActiveFilter] = useState<"All Projects" | "FinTech" | "Data Analytics" | "Cloud Infrastructure" | "AI Agents" | "SaaS Suite">("All Projects");
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

  const filteredProjects = activeFilter === "All Projects"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-24">
      
      {/* 1. HERO SECTION */}
      <section className="pt-10 sm:pt-14 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950">
          Engineering Impact &amp; <span className="text-blue-600">Proof of Value</span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Explore a curated selection of our high-fidelity enterprise software architectures, SaaS deployments, and autonomous AI systems delivered with institutional trust.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-6">
          {(["All Projects", "FinTech", "Data Analytics", "Cloud Infrastructure", "AI Agents", "SaaS Suite"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeFilter === filter
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200/80"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* 2. CASE STUDIES GRID - HIGH CONTRAST & FULLY RESPONSIVE */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Hero Layout (First 3 Projects) */}
        {activeFilter === "All Projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
            
            {/* Main Featured Card: Global Payments Consolidation */}
            <div 
              onClick={() => setSelectedCase(projects[0])}
              className="lg:col-span-7 min-h-[420px] sm:min-h-[460px] relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer border border-slate-800 flex flex-col justify-end p-6 sm:p-8 md:p-10 text-white bg-slate-950 transition-all hover:border-blue-500/70"
            >
              {/* Background Photo */}
              <img 
                src={projects[0].bgImage} 
                alt={projects[0].title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              {/* Solid Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />

              <div className="space-y-3.5 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-mono font-bold tracking-wider uppercase">
                    {projects[0].badge}
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-medium">Production Architecture</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  {projects[0].title}
                </h3>

                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-xl leading-relaxed">
                  {projects[0].description}
                </p>

                {/* Micro Metric Bar */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 max-w-lg">
                  {projects[0].stats.map((s, idx) => (
                    <div key={idx} className="bg-slate-900/80 backdrop-blur-xs rounded-lg p-2 border border-slate-700/50">
                      <div className="text-[10px] font-mono uppercase text-slate-400">{s.label}</div>
                      <div className="text-xs sm:text-sm font-bold font-mono text-blue-400">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-400 pt-1 group-hover:text-blue-300 transition-colors">
                  <span>View Technical Blueprint &amp; Telemetry</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Right Column: 2 Stacked Cards */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              
              {/* Top Right Card: Predictive Retail Engine */}
              <div 
                onClick={() => setSelectedCase(projects[1])}
                className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-slate-200 flex flex-col justify-between p-6 sm:p-7 min-h-[220px] text-slate-950 bg-white transition-all hover:border-blue-500/60"
              >
                {/* Subtle Visual Background */}
                <img 
                  src={projects[1].bgImage} 
                  alt={projects[1].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/60" />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-mono font-bold">
                    {projects[1].badge}
                  </span>
                </div>

                <div className="relative z-10 space-y-2 pt-4">
                  <h3 className="text-xl font-bold text-slate-950 group-hover:text-emerald-700 transition-colors leading-snug">
                    {projects[1].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {projects[1].description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <span>Forecast Accuracy: 96.8%</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                      <span>Read Case</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Right Card: Enterprise Cloud Migration */}
              <div 
                onClick={() => setSelectedCase(projects[2])}
                className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-slate-800 flex flex-col justify-end p-6 sm:p-7 min-h-[220px] text-white bg-slate-950 transition-all hover:border-indigo-500/70"
              >
                <img 
                  src={projects[2].bgImage} 
                  alt={projects[2].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between pb-1">
                    <span className="px-2.5 py-1 bg-indigo-600/60 text-indigo-200 border border-indigo-400/40 rounded text-xs font-mono font-bold">
                      {projects[2].badge}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {projects[2].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {projects[2].description}
                  </p>
                  <div className="text-[11px] font-mono text-indigo-300 font-semibold pt-1">
                    ✓ 500+ Apps Migrated • Zero Downtime
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Dynamic Multi-Card Grid for All & Filtered Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeFilter === "All Projects" ? projects.slice(3) : filteredProjects).map((project) => (
            <div 
              key={project.id}
              onClick={() => setSelectedCase(project)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Visual Header */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img 
                    src={project.bgImage} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded text-xs font-mono font-bold tracking-wider ${project.badgeColor}`}>
                      {project.badge}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-950 group-hover:text-blue-600 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Card Footer / Stats */}
              <div className="p-6 pt-0 space-y-4">
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  {project.stats.map((s, idx) => (
                    <div key={idx}>
                      <div className="text-[10px] font-mono text-slate-400 uppercase truncate">{s.label}</div>
                      <div className="text-xs font-bold text-slate-900 font-mono mt-0.5 truncate">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-blue-600 pt-2 border-t border-slate-100">
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

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

