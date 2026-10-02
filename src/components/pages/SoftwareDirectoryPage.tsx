import React, { useState } from "react";
import { 
  Layers, 
  ArrowRight, 
  ExternalLink, 
  Building2, 
  Dumbbell, 
  BookOpen, 
  GraduationCap, 
  Sprout, 
  Fuel, 
  Gem, 
  FileText, 
  Activity, 
  Search
} from "lucide-react";
import Breadcrumb from "../Breadcrumb";
import SeoHead from "../SeoHead";
import { CORE_PAGES_SEO, PRODUCT_SEO_DATA } from "../../seoData";
import { saasProductsData } from "../../data";
import { ProductService } from "../../types";

interface SoftwareDirectoryPageProps {
  onNavigate: (path: string) => void;
  onOpenLiveApp?: (product: ProductService) => void;
  onOpenConsultation?: () => void;
}

export default function SoftwareDirectoryPage({
  onNavigate,
  onOpenLiveApp,
  onOpenConsultation
}: SoftwareDirectoryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const softwareItems = Object.values(PRODUCT_SEO_DATA).filter(p => p.type === "software");

  // Icon mapping
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "library": return <BookOpen className="w-5 h-5 text-blue-600" />;
      case "fitness": return <Dumbbell className="w-5 h-5 text-orange-600" />;
      case "institutes": return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case "coaching": return <Activity className="w-5 h-5 text-purple-600" />;
      case "farming": return <Sprout className="w-5 h-5 text-emerald-600" />;
      case "members": return <Gem className="w-5 h-5 text-amber-600" />;
      case "crm": return <Building2 className="w-5 h-5 text-cyan-600" />;
      case "petrol-pump": return <Fuel className="w-5 h-5 text-rose-600" />;
      case "care-plus": return <Activity className="w-5 h-5 text-teal-600" />;
      case "pdf-media-tools": return <FileText className="w-5 h-5 text-violet-600" />;
      default: return <Layers className="w-5 h-5 text-blue-600" />;
    }
  };

  const categories = [
    { id: "all", label: "All Software Products" },
    { id: "Academic", label: "Academic & Campus" },
    { id: "Fitness", label: "Fitness & Gym" },
    { id: "Enterprise", label: "Enterprise & CRM" },
    { id: "Agribusiness", label: "Agribusiness & Farm" },
    { id: "Energy", label: "Energy & Fuel Station" },
    { id: "Healthcare", label: "Healthcare & Clinical" },
    { id: "Utilities", label: "Document & Media" }
  ];

  const filteredItems = softwareItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = searchQuery.trim() === "" || 
      item.h1Title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.metaDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": CORE_PAGES_SEO.softwareDirectory.title,
    "description": CORE_PAGES_SEO.softwareDirectory.description,
    "url": CORE_PAGES_SEO.softwareDirectory.canonical,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": softwareItems.map((item, idx) => ({
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
        title={CORE_PAGES_SEO.softwareDirectory.title}
        description={CORE_PAGES_SEO.softwareDirectory.description}
        canonicalUrl={CORE_PAGES_SEO.softwareDirectory.canonical}
        jsonLd={schemaJsonLd}
      />

      <div className="bg-white border-b border-slate-200">
        <Breadcrumb items={[{ name: "Software", url: "/software/" }]} onNavigate={onNavigate} />
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            {CORE_PAGES_SEO.softwareDirectory.h1}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Discover modern, cloud-native enterprise software designed to eliminate operational friction across educational institutions, health clubs, fuel retail stations, precious jewelers, and commercial agribusinesses.
          </p>

          {/* Search bar & filter pills */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search software products, modules, keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const rawProduct = saasProductsData.find(p => p.id === item.id) || saasProductsData[0];
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.id)}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                      {item.category.split(" ")[0]}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
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
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-3">
                      {item.metaDescription}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
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

                  {rawProduct.externalLink && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenLiveApp) {
                          onOpenLiveApp(rawProduct);
                        } else if (rawProduct.externalLink) {
                          window.open(rawProduct.externalLink, "_blank");
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title={`Launch live demo of ${rawProduct.name}`}
                    >
                      <span>Click here</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-800">No software products match your search.</div>
            <p className="text-xs text-slate-500">Try adjusting your keyword filter or view all products.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Directory Footer CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Need a Custom Software Solution?</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Our engineering team architects tailored cloud platforms, edge integrations, and dedicated enterprise pipelines for complex organizational needs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenConsultation) {
                onOpenConsultation();
              } else {
                onNavigate("/contact/");
              }
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors cursor-pointer shadow-md"
          >
            Schedule Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
