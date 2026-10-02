import React, { useState } from "react";
import { 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Headphones
} from "lucide-react";
import Breadcrumb from "../Breadcrumb";
import SeoHead from "../SeoHead";
import { CORE_PAGES_SEO } from "../../seoData";

interface PricingPageProps {
  onNavigate: (path: string) => void;
  onOpenConsultation?: () => void;
}

export default function PricingPage({ onNavigate, onOpenConsultation }: PricingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const pricingTiers = [
    {
      name: "Starter / Single Branch",
      badge: "Single Location",
      tagline: "Designed for single-branch libraries, local fitness studios, small clinics, and individual farms.",
      price: "Modular",
      period: "per module / billed annually",
      popular: false,
      features: [
        "Single-branch database deployment",
        "Up to 1,000 active member/student records",
        "Essential POS billing & thermal receipt generation",
        "Automated WhatsApp & SMS notifications",
        "Standard email technical support",
        "Zero-lockin data exports (CSV / Excel)"
      ],
      cta: "Inquire Starter Tier"
    },
    {
      name: "Growth / Professional",
      badge: "Most Popular",
      tagline: "Built for multi-batch coaching centers, high-traffic fuel stations, jewelry retailers, and clinics.",
      price: "Custom Growth",
      period: "based on operational volume",
      popular: true,
      features: [
        "Multi-counter & multi-batch capacity",
        "Biometric turnstile / hardware scanner integration",
        "Automated GST invoicing & tax ledgers",
        "Omnichannel AI Customer Support agent widget",
        "Daily shift reconciliation & stock variance audits",
        "Priority 24/7 SLA technical support"
      ],
      cta: "Schedule Professional Demo"
    },
    {
      name: "Enterprise Custom",
      badge: "Multi-Campus & Chains",
      tagline: "Tailored for multi-branch academic campuses, hospital chains, and dedicated enterprise pipelines.",
      price: "Tailored SLA",
      period: "custom multi-tenant deployment",
      popular: false,
      features: [
        "Unlimited branch sites & centralized super-admin",
        "Dedicated private cloud or edge node deployment",
        "Custom ERP schema & proprietary workflow modules",
        "Autonomous AI SalesFlow & Marketing Agent suite",
        "Enterprise SSO & biometric turnstile relay clusters",
        "Dedicated Technical Account Manager & 99.9% SLA"
      ],
      cta: "Request Enterprise Consultation"
    }
  ];

  const pricingFaqs = [
    {
      question: "How does C Vidya Solutions calculate SaaS pricing?",
      answer: "Our software is priced on a modular basis according to your active operational volume (such as student count, gym active subscriptions, fuel dispenser nozzles, or branch locations). This ensures single-branch operations pay only for what they use, while enterprises receive volume economies."
    },
    {
      question: "Are there setup fees or hidden hardware integration charges?",
      answer: "No hidden fees. Initial deployment includes cloud environment setup, staff training, and data migration assistance. If you require physical turnstile relay or biometric hardware integration, our engineers provide standardized protocol specifications."
    },
    {
      question: "Do you provide official GST invoices?",
      answer: "Yes, all C Vidya Solutions invoices are 100% GST-compliant corporate tax invoices with your company's registered GSTIN number."
    },
    {
      question: "Can we upgrade or downgrade our subscription plan later?",
      answer: "Yes, our multitenant cloud architecture allows dynamic scaling. You can add new branches, modules, or autonomous AI agents at any time with prorated adjustments."
    }
  ];

  const schemaJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": CORE_PAGES_SEO.pricing.title,
      "description": CORE_PAGES_SEO.pricing.description,
      "url": CORE_PAGES_SEO.pricing.canonical
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cvidyasolutions.com/" },
        { "@type": "ListItem", "position": 2, "name": "Pricing", "item": CORE_PAGES_SEO.pricing.canonical }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": pricingFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-blue-600 selection:text-white">
      <SeoHead
        title={CORE_PAGES_SEO.pricing.title}
        description={CORE_PAGES_SEO.pricing.description}
        canonicalUrl={CORE_PAGES_SEO.pricing.canonical}
        jsonLd={schemaJsonLd}
      />

      <div className="bg-white border-b border-slate-200">
        <Breadcrumb items={[{ name: "Pricing", url: "/pricing/" }]} onNavigate={onNavigate} />
      </div>

      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            {CORE_PAGES_SEO.pricing.h1}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Modular software suites and autonomous AI automation tailored to your operational scale. No arbitrary lock-ins or bloated contracts.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                tier.popular
                  ? "bg-white border-2 border-blue-600 shadow-xl ring-4 ring-blue-600/10"
                  : "bg-white border border-slate-200 shadow-xs hover:shadow-md"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  {tier.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                    {tier.name}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-2">
                    {tier.price}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {tier.period}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                  {tier.tagline}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    INCLUDED CAPABILITIES:
                  </div>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenConsultation) {
                      onOpenConsultation();
                    } else {
                      onNavigate("/contact/");
                    }
                  }}
                  className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                    tier.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 shadow-md"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="py-10 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-950">100% Data Sovereignty</h2>
              <p className="text-xs text-slate-500 mt-0.5">Export ledgers and records anytime without vendor lock-in.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-950">Zero Infrastructure Overhead</h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated backups, SSL certificates, and cloud scaling included.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-950">Direct Engineering Support</h2>
              <p className="text-xs text-slate-500 mt-0.5">Technical onboarding with senior software architects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>PRICING FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Frequently Asked Billing Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Clear guidelines on quotations, billing frequency, and enterprise multi-campus deployments.
          </p>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, fIdx) => {
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

      {/* Internal Navigation Links */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
          <a href="/software/" onClick={(e) => { e.preventDefault(); onNavigate("/software/"); }} className="hover:text-blue-600 flex items-center gap-1">
            <span>Explore All Software Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <span className="text-slate-300">•</span>
          <a href="/ai-agents/" onClick={(e) => { e.preventDefault(); onNavigate("/ai-agents/"); }} className="hover:text-blue-600 flex items-center gap-1">
            <span>Explore Autonomous AI Agents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <span className="text-slate-300">•</span>
          <a href="/contact/" onClick={(e) => { e.preventDefault(); onNavigate("/contact/"); }} className="hover:text-blue-600 flex items-center gap-1">
            <span>Get a Custom Quotation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
