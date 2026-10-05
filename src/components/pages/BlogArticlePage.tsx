import { useState } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronDown, 
  CheckCircle2, 
  Tag 
} from "lucide-react";
import Breadcrumb from "../Breadcrumb";
import SeoHead from "../SeoHead";
import { ArticleSeoInfo } from "../../articleData";

interface BlogArticlePageProps {
  article: ArticleSeoInfo;
  onNavigate: (path: string) => void;
  onOpenConsultation?: () => void;
}

export default function BlogArticlePage({
  article,
  onNavigate
}: BlogArticlePageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const schemaGraph = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.metaDescription,
      "image": article.image || "https://cvidyasolutions.com/og-image.png",
      "author": {
        "@type": "Person",
        "name": article.author.name,
        "jobTitle": article.author.role
      },
      "publisher": {
        "@type": "Organization",
        "name": "C Vidya Solutions",
        "url": "https://cvidyasolutions.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cvidyasolutions.com/logo.png"
        }
      },
      "datePublished": article.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": article.canonicalUrl
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://cvidyasolutions.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://cvidyasolutions.com/blog/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": article.canonicalUrl
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  ];

  return (
    <article className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-blue-600 selection:text-white">
      {/* Dynamic SEO Meta & Head */}
      <SeoHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonicalUrl={article.canonicalUrl}
        ogType="article"
        ogImage={article.image || "https://cvidyasolutions.com/og-image.png"}
        keywords={article.tags}
        jsonLd={schemaGraph}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <Breadcrumb 
          items={[
            { name: "Blog", url: "/blog/" },
            { name: article.title, url: article.urlPath }
          ]} 
          onNavigate={onNavigate}
        />
      </div>

      {/* Hero / Article Header */}
      <header className="bg-white border-b border-slate-200 py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans border-l-4 border-blue-600 pl-4 py-1 italic bg-blue-50/40 rounded-r-md">
            {article.summary}
          </p>

          {/* Author Byline */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold font-mono text-sm shadow-xs">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-950 font-sans">
                {article.author.name}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {article.author.role}
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          
          {/* Article Structured Content */}
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:text-slate-700 prose-li:text-slate-700 font-sans whitespace-pre-line">
            {article.content}
          </div>

          {/* Frequently Asked Questions */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {article.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-100/60 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-mono text-slate-500 mr-2">TOPICS:</span>
              {article.tags.map((tag, i) => (
                <span 
                  key={i}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-mono rounded-md border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate("/blog/")}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Resources</span>
            </button>
            <button
              onClick={() => onNavigate("/software/")}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <span>Explore All Software</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </article>
  );
}
