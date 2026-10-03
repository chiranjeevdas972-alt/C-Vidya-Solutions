import React from "react";
import { 
  Bot, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Headphones, 
  TrendingUp, 
  Target
} from "lucide-react";
import Breadcrumb from "../Breadcrumb";
import SeoHead from "../SeoHead";
import { CORE_PAGES_SEO, PRODUCT_SEO_DATA } from "../../seoData";
import { aiAgentsData } from "../../data";
import { ProductService } from "../../types";

interface AiAgentsDirectoryPageProps {
  onNavigate: (path: string) => void;
  onOpenLiveApp?: (product: ProductService) => void;
  onOpenConsultation?: () => void;
}

export default function AiAgentsDirectoryPage({
  onNavigate,
  onOpenLiveApp,
  onOpenConsultation
}: AiAgentsDirectoryPageProps) {
  const agentItems = Object.values(PRODUCT_SEO_DATA).filter(p => p.type === "ai-agent");

  const getAgentIcon = (id: string) => {
    switch (id) {
      case "ai-social": return <Share2 className="w-5 h-5 text-indigo-600" />;
      case "ai-support": return <Headphones className="w-5 h-5 text-blue-600" />;
      case "ai-salesflow": return <Target className="w-5 h-5 text-emerald-600" />;
      case "ai-marketing": return <TrendingUp className="w-5 h-5 text-purple-600" />;
      default: return <Bot className="w-5 h-5 text-blue-600" />;
    }
  };

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": CORE_PAGES_SEO.aiAgentsDirectory.title,
    "description": CORE_PAGES_SEO.aiAgentsDirectory.description,
    "url": CORE_PAGES_SEO.aiAgentsDirectory.canonical,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": agentItems.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": item.h1Title,
        "url": item.canonicalUrl
      }))
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-blue-600 selection:text-white">
      <SeoHead
        title={CORE_PAGES_SEO.aiAgentsDirectory.title}
        description={CORE_PAGES_SEO.aiAgentsDirectory.description}
        canonicalUrl={CORE_PAGES_SEO.aiAgentsDirectory.canonical}
        jsonLd={schemaJsonLd}
      />

      <div className="bg-white border-b border-slate-200">
        <Breadcrumb items={[{ name: "AI Agents", url: "/ai-agents/" }]} onNavigate={onNavigate} />
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            {CORE_PAGES_SEO.aiAgentsDirectory.h1}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Deploy specialized, autonomous AI agents engineered to execute continuous commercial workflows: viral social media growth, 24/7 sub-second customer support RAG, outbound B2B sales prospecting, and organic inbound SaaS demand generation.
          </p>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agentItems.map((item) => {
            const rawAgent = aiAgentsData.find(a => a.id === item.id) || aiAgentsData[0];
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      {getAgentIcon(item.id)}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                      <a 
                        href={item.urlPath}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(item.urlPath);
                        }}
                      >
                        {item.h1Title}
                      </a>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                      {item.metaDescription}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={item.urlPath}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.urlPath);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  {rawAgent.externalLink && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenLiveApp) {
                          onOpenLiveApp(rawAgent);
                        } else if (rawAgent.externalLink) {
                          window.open(rawAgent.externalLink, "_blank");
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors text-center whitespace-nowrap"
                      title={`Open live agent workspace for ${rawAgent.name}`}
                    >
                      Click here
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enterprise Consultation Strip */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Need an Autonomous AI Agent Tailored to Your Proprietary Data?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Our AI engineering specialists build custom RAG pipelines, fine-tune domain-specific agents, and integrate with your private cloud infrastructure under strict zero-data-retention security protocols.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenConsultation) {
                  onOpenConsultation();
                } else {
                  onNavigate("/contact/");
                }
              }}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              Consult With Our AI Architects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
