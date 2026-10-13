import React, { useState, useMemo } from "react";
import { 
  Smartphone, 
  Search,
  BookOpen,
  Dumbbell,
  GraduationCap,
  Users,
  Building2,
  Wheat,
  Gem,
  Fuel,
  FileText,
  HeartPulse,
  Bot,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import SeoHead from "../SeoHead";
import Breadcrumb from "../Breadcrumb";
import AppDownloadRegistrationForm from "../AppDownloadRegistrationForm";
import { saasProductsData, aiAgentsData } from "../../data";
import { ProductService } from "../../types";

interface MobileAppPageProps {
  onNavigate: (path: string) => void;
  onOpenConsultation?: () => void;
  initialShowComingSoon?: boolean;
}

// Icon mapper for SaaS products & AI Agents
function getProductIcon(id: string) {
  const cleanId = id.toLowerCase();
  if (cleanId.includes("library")) return BookOpen;
  if (cleanId.includes("fitness") || cleanId.includes("fitzone")) return Dumbbell;
  if (cleanId.includes("institute")) return GraduationCap;
  if (cleanId.includes("coaching")) return Users;
  if (cleanId.includes("crm")) return Building2;
  if (cleanId.includes("municipal")) return Building2;
  if (cleanId.includes("farming") || cleanId.includes("agrifusion")) return Wheat;
  if (cleanId.includes("member") || cleanId.includes("jewelry")) return Gem;
  if (cleanId.includes("petrol") || cleanId.includes("fuel")) return Fuel;
  if (cleanId.includes("pdf") || cleanId.includes("media")) return FileText;
  if (cleanId.includes("care") || cleanId.includes("health")) return HeartPulse;
  if (cleanId.includes("social")) return TrendingUp;
  if (cleanId.includes("support")) return Bot;
  if (cleanId.includes("sales")) return Target;
  if (cleanId.includes("marketing")) return Sparkles;
  return Smartphone;
}

export default function MobileAppPage({
  onNavigate,
  onOpenConsultation,
  initialShowComingSoon = false
}: MobileAppPageProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<"android" | "ios">("android");
  const [searchQuery, setSearchQuery] = useState("");

  // When a user clicks any app, open the Coming Soon page for that app
  const [selectedComingSoonProduct, setSelectedComingSoonProduct] = useState<ProductService | null>(() => {
    if (initialShowComingSoon) {
      return saasProductsData[0] || null;
    }
    return null;
  });

  // All 14 SaaS Products and AI Agents
  const allItems: ProductService[] = useMemo(() => {
    return [...saasProductsData, ...aiAgentsData];
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems;
    const q = searchQuery.toLowerCase();
    return allItems.filter(item => item.name.toLowerCase().includes(q));
  }, [allItems, searchQuery]);

  const handleOpenComingSoon = (product: ProductService) => {
    setSelectedComingSoonProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAppsList = () => {
    setSelectedComingSoonProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const schemaJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": selectedComingSoonProduct ? `${selectedComingSoonProduct.name} Mobile App` : "C Vidya Mobile Workspace",
      "operatingSystem": "Android, iOS",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "publisher": {
        "@type": "Organization",
        "name": "C Vidya Solutions",
        "url": "https://cvidyasolutions.com"
      },
      "description": `Official C Vidya Solutions mobile application for ${selectedComingSoonProduct ? selectedComingSoonProduct.name : "all 14 software suites and AI agents"} on Android and iOS.`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cvidyasolutions.com/" },
        { "@type": "ListItem", "position": 2, "name": "Mobile App", "item": "https://cvidyasolutions.com/mobile-app/" }
      ]
    }
  ];

  return (
    <article className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-amber-400 selection:text-slate-950">
      
      {/* 0. DYNAMIC SEO HEAD */}
      <SeoHead
        title={
          selectedComingSoonProduct 
            ? `${selectedComingSoonProduct.name} | Coming Soon on Android & iOS` 
            : "Download C Vidya Mobile App | Official Android & iOS App Registration"
        }
        description={
          selectedComingSoonProduct
            ? `Coming soon page for ${selectedComingSoonProduct.name} mobile application on Android and iOS.`
            : "Download the official C Vidya Solutions Mobile Application for Android & iOS. Explore all 14 SaaS products and autonomous AI agents."
        }
        canonicalUrl="https://cvidyasolutions.com/mobile-app/"
        ogImage="https://cvidyasolutions.com/og-image.png"
        ogType="website"
        jsonLd={schemaJsonLd}
      />

      {/* 1. BREADCRUMB NAVIGATION */}
      <div className="bg-white border-b border-slate-200">
        <Breadcrumb 
          items={[
            { name: "Mobile App", url: "/mobile-app/" },
            ...(selectedComingSoonProduct ? [{ name: `${selectedComingSoonProduct.name} (Coming Soon)`, url: "/mobile-app/#coming-soon" }] : [])
          ]} 
          onNavigate={onNavigate} 
        />
      </div>

      {/* ========================================================================= */}
      {/* VIEW A: COMPLETELY WHITE PAGE, WHITE YELLOW COMING SOON PAGE              */}
      {/* (Big size and normal size show the coming soon page)                     */}
      {/* ========================================================================= */}
      {selectedComingSoonProduct ? (
        <section className="min-h-screen bg-white text-slate-900 animate-fadeIn">
          {/* Top Back Navigation Bar */}
          <div className="border-b border-amber-200/60 bg-amber-50/40 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-16 z-30 backdrop-blur-md">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackToAppsList}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 hover:text-amber-950 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                title="Back to Apps List"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* White & Yellow Coming Soon Display */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center space-y-6">
            
            {/* BIG SIZE: COMING SOON ON MOBILE */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-950 tracking-tight leading-none uppercase">
              COMING SOON ON MOBILE
            </h1>

            {/* NORMAL SIZE: APP NAME */}
            <div className="space-y-2 pt-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-600 sm:text-slate-900 tracking-tight">
                {selectedComingSoonProduct.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Official Android &amp; iOS Mobile Application
              </p>
            </div>

            {/* Platform Badges: Only Android and iOS */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                Android
              </span>
              <span className="px-4 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono">
                iOS
              </span>
            </div>

            {/* Direct App Registration Form on White Card */}
            <div className="pt-6 max-w-3xl mx-auto text-left">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-950">
                    Get {selectedComingSoonProduct.name} Mobile Early Access
                  </h3>
                </div>

                <AppDownloadRegistrationForm 
                  selectedPlatform={selectedPlatform}
                  onPlatformChange={setSelectedPlatform}
                  onNavigatePrivacy={() => onNavigate("/privacy/")}
                  onNavigateTerms={() => onNavigate("/terms/")}
                />
              </div>
            </div>

          </div>
        </section>
      ) : (
        /* ========================================================================= */
        /* VIEW B: ALL 14 APPS LIST WITH ONLY NAME, ANDROID, IOS & ARROW DIRECTION    */
        /* (Cloud SaaS, Active, description, Cloud Sync, and Select & View REMOVED)  */
        /* ========================================================================= */
        <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
          
          {/* Filter Tabs & Search Bar */}
          {/* Search Bar */}
          <div className="flex items-center justify-end border-b border-slate-200 pb-5">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by app name..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 14 Apps Grid: Only Name, Android, iOS and Arrow Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const ProductIcon = getProductIcon(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenComingSoon(item)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-lg transition-all p-5 flex items-center justify-between gap-4 cursor-pointer group"
                >
                  {/* Left: Icon, Name and Android/iOS Tags */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors flex items-center justify-center shrink-0">
                      <ProductIcon className="w-6 h-6" />
                    </div>

                    <div className="min-w-0 space-y-1.5">
                      <h3 className="font-extrabold text-base text-slate-950 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      
                      {/* Only Android & iOS Tags */}
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Android
                        </span>
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          iOS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Only Arrow Direction */}
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-amber-400 text-slate-600 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-all shadow-2xs group-hover:translate-x-1">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Search State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <Smartphone className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No software found matching "{searchQuery}"</h3>
              <p className="text-xs text-slate-500">Try adjusting your search terms.</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700"
              >
                Clear Search
              </button>
            </div>
          )}

        </section>
      )}

    </article>
  );
}
