import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  Users, 
  Workflow, 
  TrendingUp, 
  HelpCircle
} from "lucide-react";
import Breadcrumb from "../Breadcrumb";
import SeoHead from "../SeoHead";
import { ProductSeoInfo, PRODUCT_SEO_DATA } from "../../seoData";
import { ProductService } from "../../types";

interface ProductLandingPageProps {
  seoInfo: ProductSeoInfo;
  productData: ProductService;
  onNavigate: (path: string) => void;
  onOpenLiveApp?: (product: ProductService) => void;
  onOpenConsultation?: () => void;
}

export default function ProductLandingPage({
  seoInfo,
  productData,
  onNavigate,
  onOpenLiveApp,
  onOpenConsultation
}: ProductLandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Generate Related Products list (pick 3 other items)
  const relatedProducts = Object.values(PRODUCT_SEO_DATA)
    .filter(item => item.id !== seoInfo.id && item.type === seoInfo.type)
    .slice(0, 3);

  // Structured Data JSON-LD
  const schemaGraph = [
    {
      "@context": "https://schema.org",
      "@type": seoInfo.schemaType,
      "name": seoInfo.h1Title,
      "alternateName": productData.name,
      "description": seoInfo.metaDescription,
      "url": seoInfo.canonicalUrl,
      "applicationCategory": seoInfo.applicationCategory,
      "operatingSystem": seoInfo.operatingSystem,
      "provider": {
        "@type": "Organization",
        "name": "C Vidya Solutions",
        "url": "https://cvidyasolutions.com"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/OnlineOnly"
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
          "name": seoInfo.type === "software" ? "Software" : "AI Agents",
          "item": seoInfo.type === "software" ? "https://cvidyasolutions.com/software/" : "https://cvidyasolutions.com/ai-agents/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": seoInfo.breadcrumbName,
          "item": seoInfo.canonicalUrl
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": seoInfo.faqs.map(faq => ({
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
        title={seoInfo.metaTitle}
        description={seoInfo.metaDescription}
        canonicalUrl={seoInfo.canonicalUrl}
        ogImage={productData.imageUrl || "https://cvidyasolutions.com/og-image.png"}
        jsonLd={schemaGraph}
      />

      {/* Top Header Bar with Instant Back Navigation */}
      <div className="bg-[#071739] text-white px-4 sm:px-8 py-3 flex items-center border-b border-blue-900/50 shadow-md">
        <button
          type="button"
          onClick={() => onNavigate(seoInfo.type === "software" ? "/software/" : "/ai-agents/")}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 hover:bg-blue-500 active:scale-90 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer border border-white/20 shrink-0"
          title={`Back to ${seoInfo.type === "software" ? "Software" : "AI Agents"} Landing Page`}
          aria-label={`Back to ${seoInfo.type === "software" ? "Software" : "AI Agents"} Landing Page`}
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5] rotate-180" />
        </button>
        <span className="ml-3.5 text-xs sm:text-sm font-bold font-mono tracking-wider text-slate-200 uppercase truncate">
          {seoInfo.breadcrumbName}
        </span>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <Breadcrumb 
          items={[
            { 
              name: seoInfo.type === "software" ? "Software" : "AI Agents", 
              url: seoInfo.type === "software" ? "/software/" : "/ai-agents/" 
            },
            { name: seoInfo.breadcrumbName, url: seoInfo.urlPath }
          ]} 
          onNavigate={onNavigate}
        />
      </div>

      {/* 1. HERO SECTION */}
      <header className="bg-white border-b border-slate-200 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
              {seoInfo.h1Title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {productData.description}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {productData.externalLink && (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenLiveApp) {
                      onOpenLiveApp(productData);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  title={`Launch live demo of ${productData.name}`}
                >
                  <span>Launch Live Software Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (onOpenConsultation) {
                    onOpenConsultation();
                  } else {
                    onNavigate("/contact/");
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 rounded-xl text-sm font-semibold border border-slate-300 transition-all cursor-pointer"
              >
                <span>Book Architecture Consultation</span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Hero Visual / Metric Preview */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 rounded-3xl border border-slate-800 shadow-2xl text-white space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-blue-400 font-bold uppercase">
                    SYSTEM DASHBOARD PREVIEW
                  </span>
                  <div className="font-bold text-base text-white mt-0.5">{productData.mockData.title}</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" title="System Live" />
              </div>

              {/* High-level metrics */}
              <div className="grid grid-cols-2 gap-3">
                {productData.mockData.metrics.slice(0, 4).map((metric, mIdx) => (
                  <div key={mIdx} className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl">
                    <div className="text-[11px] text-slate-400 truncate">{metric.label}</div>
                    <div className="text-lg font-black text-white mt-1">{metric.value}</div>
                    {metric.change && (
                      <div className={`text-[10px] mt-0.5 font-medium ${metric.isPositive ? "text-emerald-400" : "text-amber-400"}`}>
                        {metric.change}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Product Screenshot / Graphic Preview */}
              {productData.imageUrl && (
                <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-inner">
                  <img
                    src={productData.imageUrl}
                    alt={`${seoInfo.h1Title} - Product User Interface Screenshot and Dashboard`}
                    className="w-full h-44 object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* 2. CORE FEATURES SECTION */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Comprehensive Capabilities Built for Real Operations
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Engineered to replace fragmented manual registers, offline spreadsheets, and legacy desktop software with a secure cloud ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {productData.features.map((feature, fIdx) => (
            <div 
              key={fIdx} 
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-950">
                  {feature.split(" - ")[0]}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {feature.includes(" - ") ? feature.split(" - ")[1] : feature}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BUSINESS PROBLEMS SOLVED & QUANTIFIED BENEFITS */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
                <TrendingUp className="w-4 h-4" />
                <span>MEASURABLE BUSINESS IMPACT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
                Solving Operational Bottlenecks Across Your Organization
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every feature in {seoInfo.breadcrumbName} directly targets systemic operational hurdles, driving down administrative overhead and maximizing compliance.
              </p>

              <div className="space-y-4 pt-2">
                {seoInfo.problemsSolved.map((item, pIdx) => (
                  <div key={pIdx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                    <div className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>Challenge: {item.problem}</span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium pl-3 border-l-2 border-emerald-500">
                      <strong>Solution:</strong> {item.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seoInfo.benefits.map((benefit, bIdx) => (
                <div 
                  key={bIdx} 
                  className={`p-6 rounded-2xl border shadow-sm space-y-2 ${
                    bIdx === 0 
                      ? "sm:col-span-2 bg-gradient-to-br from-blue-900 to-indigo-950 text-white border-blue-800" 
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <div className={`text-3xl sm:text-4xl font-black ${bIdx === 0 ? "text-blue-300" : "text-blue-600"}`}>
                    {benefit.metric}
                  </div>
                  <h3 className="text-sm font-bold tracking-tight">
                    {benefit.label}
                  </h3>
                  <p className={`text-xs leading-relaxed ${bIdx === 0 ? "text-blue-100" : "text-slate-600"}`}>
                    {benefit.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. TARGET USERS & IDEAL AUDIENCE */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
            <Users className="w-4 h-4" />
            <span>WHO THIS IS BUILT FOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Tailored for Dedicated Roles &amp; Operational Profiles
          </h2>
          <p className="text-sm text-slate-600">
            Purpose-built workflows calibrated to the exact demands of organizational leadership, frontline staff, and end consumers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seoInfo.targetUsers.map((user, uIdx) => (
            <div key={uIdx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                {uIdx + 1}
              </div>
              <h3 className="text-base font-bold text-slate-950">
                {user.role}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {user.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRODUCT WORKFLOW */}
      <section className="py-14 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
              <Workflow className="w-4 h-4" />
              <span>STEP-BY-STEP WORKFLOW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How {seoInfo.breadcrumbName} Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Rapid zero-friction deployment with guided onboarding and automated daily execution cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seoInfo.workflow.map((item, wIdx) => (
              <div key={wIdx} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
                <span className="text-3xl font-mono font-black text-blue-500/40">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GENUINE FAQ SECTION (ACCORDION) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Questions About {seoInfo.breadcrumbName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear, honest technical answers regarding licensing, hardware compatibility, and deployment.
          </p>
        </div>

        <div className="space-y-3">
          {seoInfo.faqs.map((faq, fIdx) => {
            const isOpen = openFaqIndex === fIdx;
            return (
              <div 
                key={fIdx} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. RELATED PRODUCTS INTERNAL LINKING CLUSTER */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Explore Related {seoInfo.type === "software" ? "Software Solutions" : "Autonomous AI Agents"}
              </h2>
              <p className="text-xs text-slate-500">
                C Vidya Solutions provides an interconnected modular cloud architecture.
              </p>
            </div>

            <a
              href={seoInfo.type === "software" ? "/software/" : "/ai-agents/"}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(seoInfo.type === "software" ? "/software/" : "/ai-agents/");
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
            >
              <span>View Full {seoInfo.type === "software" ? "Software Directory" : "AI Agent Suite"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedProducts.map((rel) => (
              <a
                key={rel.id}
                href={rel.urlPath}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(rel.urlPath);
                }}
                className="group block p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <div className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                  {rel.category}
                </div>
                <h3 className="font-bold text-sm text-slate-950 mt-1 group-hover:text-blue-600 transition-colors">
                  {rel.h1Title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                  {rel.metaDescription}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-3 group-hover:translate-x-1 transition-transform">
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BOTTOM ENTERPRISE CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Modernize With {seoInfo.breadcrumbName}?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Schedule a personalized technical demonstration with our engineering architects or deploy on your infrastructure with our enterprise onboarding SLA.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenConsultation) {
                  onOpenConsultation();
                } else {
                  onNavigate("/contact/");
                }
              }}
              className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 active:scale-95 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Request Enterprise Quotation
            </button>

            {productData.externalLink && (
              <button
                type="button"
                onClick={() => {
                  if (onOpenLiveApp) {
                    onOpenLiveApp(productData);
                  }
                }}
                className="px-6 py-3.5 bg-blue-800/80 hover:bg-blue-800 text-white active:scale-95 rounded-xl text-sm font-semibold border border-blue-400/40 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Launch Cloud Sandbox</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>
            )}
          </div>
        </div>
      </section>
    </article>
  );
}
