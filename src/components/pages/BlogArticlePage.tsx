import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  ChevronDown, 
  Share2, 
  CheckCircle2, 
  Tag, 
  Sparkles,
  ExternalLink,
  BookOpen
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
  onNavigate,
  onOpenConsultation
}: BlogArticlePageProps) {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-mono font-bold uppercase rounded-md border border-blue-200">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {article.date}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans border-l-4 border-blue-600 pl-4 py-1 italic bg-blue-50/40 rounded-r-md">
            {article.summary}
          </p>

          {/* Author Byline & Social Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
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

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs cursor-pointer"
              title="Share article URL"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copied ? "Link Copied!" : "Share Link"}</span>
            </button>
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

          {/* Related Product Spotlight Box */}
          {article.relatedProductName && article.relatedProductPath && (
            <div className="my-8 p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Related Solution Spotlight</span>
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                Explore {article.relatedProductName}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Experience full automation, multi-branch cloud sync, and instant live demo access engineered by C Vidya Solutions.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate(article.relatedProductPath!)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>View Product Overview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onOpenConsultation && (
                  <button
                    onClick={onOpenConsultation}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Request Live Demo</span>
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>
            </div>
          )}

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
