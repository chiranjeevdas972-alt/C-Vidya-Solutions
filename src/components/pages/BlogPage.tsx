import { useState } from "react";
import { X } from "lucide-react";
import SeoHead from "../SeoHead";
import { CORE_PAGES_SEO } from "../../seoData";
import { ARTICLES_DATA, ArticleSeoInfo } from "../../articleData";

interface BlogPageProps {
  onNavigate?: (page: string) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const allArticlesList = Object.values(ARTICLES_DATA);

  const categories = [
    "All",
    "Library & Education",
    "AI Automation",
    "SaaS & Cloud",
    "Security & Architecture"
  ];

  const filteredArticles = activeCategory === "All"
    ? allArticlesList
    : allArticlesList.filter(a => a.category === activeCategory);

  const handleArticleClick = (article: ArticleSeoInfo) => {
    if (onNavigate) {
      onNavigate(`/blog/${article.slug}/`);
    } else {
      setSelectedArticle(article);
    }
  };

  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Dynamic SEO Head */}
      <SeoHead
        title={CORE_PAGES_SEO.blog.title}
        description={CORE_PAGES_SEO.blog.description}
        canonicalUrl={CORE_PAGES_SEO.blog.canonical}
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "C Vidya Solutions Engineering & Insights Blog",
          "url": "https://cvidyasolutions.com/blog/",
          "description": CORE_PAGES_SEO.blog.description,
          "publisher": {
            "@type": "Organization",
            "name": "C Vidya Solutions",
            "url": "https://cvidyasolutions.com"
          }
        }}
      />

      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-950">
          Industry Insights &amp;{" "}
          <span className="text-blue-600">Topical Guides</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Deep-dive technical articles, campus automation frameworks, AI agent architectures, and enterprise cloud blueprints by C Vidya Solutions.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2. FEATURED ARTICLES GRID */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div 
              key={article.id}
              onClick={() => handleArticleClick(article)}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-pointer flex flex-col justify-between"
            >
              {/* Image banner - Completely clean without any overlay content on top */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fallback Article Reader Modal if onNavigate is not passed */}
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
              <h2 className="text-2xl font-bold text-slate-950">{selectedArticle.title}</h2>
            </div>

            {selectedArticle.image && (
              <div className="rounded-xl overflow-hidden max-h-64">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-slate prose-sm text-slate-700 leading-relaxed space-y-4">
              <p className="font-medium text-slate-900">{selectedArticle.summary}</p>
              <div className="whitespace-pre-line text-xs sm:text-sm">{selectedArticle.content}</div>
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
