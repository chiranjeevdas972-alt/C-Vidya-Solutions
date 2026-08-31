import { useState } from "react";
import { 
  ArrowRight, 
  Calendar, 
  Tag, 
  X, 
  Clock, 
  Share2, 
  CheckCircle2 
} from "lucide-react";

interface BlogPageProps {
  onNavigate?: (page: string) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const mainArticle = {
    id: "cloud-native",
    category: "Technology",
    date: "Oct 24, 2024",
    readTime: "6 min read",
    title: "The Future of Enterprise Architecture in a Cloud-Native World",
    summary: "Exploring how modern enterprises are restructuring their IT foundations to leverage microservices and distributed cloud environments for unprecedented scale.",
    image: "/assets/images/blog_boardroom_tech_1788168683246.jpg",
    content: `
      Enterprise systems are rapidly transitioning from monolithic, hard-to-maintain codebases to cloud-native microservices topologies. In this architectural breakdown, we analyze how distributed event sourcing, idempotent API gateways, and automated CI/CD pipelines enable Fortune 500 enterprises to deploy updates 200x faster with zero scheduled downtime.

      ### Key Takeaways:
      - **Decoupled Workloads:** Isolating database boundaries prevents cascading outage vectors.
      - **Edge Telemetry:** Modern observability stacks allow predictive alerting before end-users experience degradation.
      - **Zero-Trust IAM:** Cryptographic token verification at every hop eliminates perimeter vulnerability.
    `
  };

  const rightTopArticle = {
    id: "global-expansion",
    category: "Company News",
    date: "Sep 15, 2024",
    readTime: "4 min read",
    title: "C Vidya Solutions Expands Global Operations",
    summary: "Announcing new delivery centers and expanded enterprise consulting partnerships across North America, Europe, and Asia-Pacific.",
    content: `
      C Vidya Solutions is pleased to announce our latest milestone in global expansion. With over 150 enterprise implementations completed, our new international delivery pods will provide round-the-clock technical architecture and AI agent deployment capabilities.
    `
  };

  const rightBottomArticle = {
    id: "zero-trust",
    category: "Security",
    date: "Aug 29, 2024",
    readTime: "5 min read",
    title: "Zero-Trust Architectures Explained",
    summary: "Why traditional perimeter security fails in multi-cloud environments, and how mutual TLS (mTLS) with continuous verification safeguards sensitive business logic.",
    image: "/assets/images/datacenter_server_room_1788168670156.jpg",
    content: `
      Zero-trust is not a single product; it is an architectural mindset. By assuming breach and verifying every transaction explicitly with ephemeral credentials and least-privilege role boundaries, enterprises eliminate internal lateral movement risks.
    `
  };

  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Industry Insights &amp;{" "}
          <span className="text-blue-600">Company News</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Stay updated with the latest trends in technology, professional services, and our corporate milestones.
        </p>
      </section>


      {/* 2. FEATURED ARTICLES GRID */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Left Featured Card */}
          <div 
            onClick={() => setSelectedArticle(mainArticle)}
            className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group cursor-pointer flex flex-col justify-between"
          >
            {/* Top Boardroom Image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-950">
              <img 
                src={mainArticle.image} 
                alt={mainArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Bottom Content */}
            <div className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded font-semibold">
                  {mainArticle.category}
                </span>
                <span>{mainArticle.date}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">
                {mainArticle.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {mainArticle.summary}
              </p>
            </div>
          </div>


          {/* Right Column: 2 Stacked Cards */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            
            {/* Right Top: Company News Card (White bordered card) */}
            <div 
              onClick={() => setSelectedArticle(rightTopArticle)}
              className="bg-white border border-blue-200 rounded-2xl p-8 shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between min-h-[220px]"
            >
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-mono font-medium">
                  {rightTopArticle.category}
                </span>

                <h3 className="text-xl font-bold text-slate-950 leading-snug">
                  {rightTopArticle.title}
                </h3>
              </div>

              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Right Bottom: Security / Zero-Trust Card (with image) */}
            <div 
              onClick={() => setSelectedArticle(rightBottomArticle)}
              className="relative rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-end p-8 text-white min-h-[220px] group border border-slate-800 bg-slate-950"
            >
              <img 
                src={rightBottomArticle.image} 
                alt={rightBottomArticle.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />

              <div className="space-y-2 relative z-10">
                <span className="inline-block px-2.5 py-0.5 bg-amber-500/90 text-white rounded text-[11px] font-mono font-bold">
                  {rightBottomArticle.category}
                </span>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {rightBottomArticle.title}
                </h3>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 group-hover:text-white pt-2">
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded font-semibold">
                  {selectedArticle.category}
                </span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950">{selectedArticle.title}</h2>
            </div>

            {selectedArticle.image && (
              <div className="rounded-xl overflow-hidden max-h-64">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-slate prose-sm text-slate-700 leading-relaxed space-y-4">
              <p className="font-medium text-slate-900">{selectedArticle.summary}</p>
              <p className="whitespace-pre-line text-xs sm:text-sm">{selectedArticle.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
