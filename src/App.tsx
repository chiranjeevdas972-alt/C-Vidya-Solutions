import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/pages/HomePage";
import AboutPage from "./components/pages/AboutPage";
import ServicesPage from "./components/pages/ServicesPage";
import PortfolioPage from "./components/pages/PortfolioPage";
import ContactPage from "./components/pages/ContactPage";
import CareersPage from "./components/pages/CareersPage";
import FAQPage from "./components/pages/FAQPage";
import BlogPage from "./components/pages/BlogPage";
import SoftwareDirectoryPage from "./components/pages/SoftwareDirectoryPage";
import AiAgentsDirectoryPage from "./components/pages/AiAgentsDirectoryPage";
import PricingPage from "./components/pages/PricingPage";
import ProductLandingPage from "./components/pages/ProductLandingPage";
import BlogArticlePage from "./components/pages/BlogArticlePage";
import ProductDetailModal from "./components/ProductDetailModal";
import SoftwareDetailModal from "./components/SoftwareDetailModal";
import LiveSoftwareApp from "./components/LiveSoftwareApp";
import AiAssistant from "./components/AiAssistant";
import ComplianceModal, { CookieConsentBanner } from "./components/ComplianceModal";
import CompliancePage from "./components/CompliancePage";
import InfoHubModal from "./components/InfoHubModal";
import ArchitectureHubModal from "./components/ArchitectureHubModal";
import NetworkStatusBanner from "./components/NetworkStatusBanner";
import Logo from "./components/Logo";
import { type ProductService } from "./types";
import { saasProductsData, aiAgentsData } from "./data";
import { PRODUCT_SEO_DATA, CORE_PAGES_SEO } from "./seoData";
import { ARTICLES_DATA } from "./articleData";
import { 
  Lock, 
  X, 
  Trash2, 
  Search
} from "lucide-react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export type RouteState =
  | { type: "page"; id: string }
  | { type: "product"; productKey: string }
  | { type: "article"; articleSlug: string };

function resolveRoute(pathname: string, hash: string): RouteState {
  // 1. Architecture modal hash check
  if (hash.startsWith("#architecture")) {
    return { type: "page", id: "home" };
  }

  // Normalize path by stripping trailing slashes
  let cleanPath = pathname.replace(/\/+$/, "");
  if (!cleanPath || cleanPath === "") {
    cleanPath = "/";
  }

  // 2. Handle legacy hash navigation like #about or #software/library-management
  if (hash && hash.length > 1) {
    const hashContent = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
    const corePages = [
      "home", "about", "services", "portfolio", "contact", "careers", "blog", "faq",
      "pricing", "software", "ai-agents", "privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"
    ];
    if (corePages.includes(hashContent)) {
      cleanPath = hashContent === "home" ? "/" : `/${hashContent}`;
    }
  }

  // 3. Match against dedicated product landing pages
  const matchedProduct = Object.values(PRODUCT_SEO_DATA).find(p => {
    const pUrlClean = p.urlPath.replace(/\/+$/, "");
    return pUrlClean === cleanPath || 
      (p.type === "software" && cleanPath === `/software/${p.slug}`) ||
      (p.type === "ai-agent" && cleanPath === `/ai-agents/${p.slug}`);
  });

  if (matchedProduct) {
    return { type: "product", productKey: matchedProduct.id };
  }

  // 4. Match against dedicated blog articles
  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace(/^\/blog\//, "").replace(/\/+$/, "");
    if (ARTICLES_DATA[slug]) {
      return { type: "article", articleSlug: slug };
    }
  }
  if (cleanPath.startsWith("/resources/blog/")) {
    const slug = cleanPath.replace(/^\/resources\/blog\//, "").replace(/\/+$/, "");
    if (ARTICLES_DATA[slug]) {
      return { type: "article", articleSlug: slug };
    }
  }

  // 4. Match against directory and core pages
  if (cleanPath === "/" || cleanPath === "") return { type: "page", id: "home" };
  if (cleanPath === "/software") return { type: "page", id: "software" };
  if (cleanPath === "/ai-agents") return { type: "page", id: "ai-agents" };
  if (cleanPath === "/pricing") return { type: "page", id: "pricing" };
  if (cleanPath === "/about") return { type: "page", id: "about" };
  if (cleanPath === "/services") return { type: "page", id: "services" };
  if (cleanPath === "/portfolio") return { type: "page", id: "portfolio" };
  if (cleanPath === "/contact") return { type: "page", id: "contact" };
  if (cleanPath === "/careers") return { type: "page", id: "careers" };
  if (cleanPath === "/blog") return { type: "page", id: "blog" };
  if (cleanPath === "/faq") return { type: "page", id: "faq" };

  const compliancePages = ["privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"];
  for (const cp of compliancePages) {
    if (cleanPath === `/${cp}`) {
      return { type: "page", id: cp };
    }
  }

  return { type: "page", id: "home" };
}

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceTab, setComplianceTab] = useState("privacy");
  const [selectedProduct, setSelectedProduct] = useState<ProductService | null>(null);
  const [activeSoftwareDetail, setActiveSoftwareDetail] = useState<ProductService | null>(null);
  const [activeLiveSoftware, setActiveLiveSoftware] = useState<ProductService | null>(null);
  const [previousPreviewProduct, setPreviousPreviewProduct] = useState<ProductService | null>(null);
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const [architectureTab, setArchitectureTab] = useState<"prd" | "trd" | "flow" | "uiux" | "schema" | "plan">("prd");

  // Router State
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window !== "undefined") {
      return resolveRoute(window.location.pathname, window.location.hash);
    }
    return { type: "page", id: "home" };
  });

  // Onsite Leads Admin Dialog State
  const [leadsModalOpen, setLeadsModalOpen] = useState(false);
  const [leadsPasscode, setLeadsPasscode] = useState("");
  const [leadsAuthenticated, setLeadsAuthenticated] = useState(false);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");

  // Navigation controller with HTML5 History & URL normalization
  const navigateTo = (target: string) => {
    // 1. Architecture modal shortcut
    if (target.startsWith("#architecture") || target.startsWith("architecture")) {
      const subTab = target.split("-")[1] as any;
      if (["prd", "trd", "flow", "uiux", "schema", "plan"].includes(subTab)) {
        setArchitectureTab(subTab);
      } else {
        setArchitectureTab("prd");
      }
      setArchitectureOpen(true);
      return;
    }

    let urlToPush = target;
    // Normalize simple page names like "services" to "/services/"
    if (!target.startsWith("/")) {
      if (target === "home") {
        urlToPush = "/";
      } else {
        urlToPush = `/${target}/`;
      }
    }
    // Ensure trailing slash for directory style URLs
    if (!urlToPush.endsWith("/") && !urlToPush.includes(".") && !urlToPush.includes("#") && !urlToPush.includes("?")) {
      urlToPush += "/";
    }

    if (window.location.pathname !== urlToPush) {
      window.history.pushState(null, "", urlToPush);
    }
    const newRoute = resolveRoute(urlToPush, "");
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // HTML5 History & Popstate event listener
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#architecture")) {
        const subTab = hash.split("-")[1] as any;
        if (["prd", "trd", "flow", "uiux", "schema", "plan"].includes(subTab)) {
          setArchitectureTab(subTab);
        } else {
          setArchitectureTab("prd");
        }
        setArchitectureOpen(true);
        return;
      }

      const newRoute = resolveRoute(window.location.pathname, window.location.hash);
      setRoute(newRoute);
      setActiveLiveSoftware(null);
      setActiveSoftwareDetail(null);
      setSelectedProduct(null);

      if (newRoute.type === "page" && ["privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"].includes(newRoute.id)) {
        setComplianceTab(newRoute.id);
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // Compute active navigation tab for Header styling
  const headerActivePage = useMemo(() => {
    if (route.type === "page") {
      return route.id;
    }
    if (route.type === "product") {
      const p = PRODUCT_SEO_DATA[route.productKey];
      return p?.type === "software" ? "software" : "ai-agents";
    }
    if (route.type === "article") {
      return "blog";
    }
    return "home";
  }, [route]);

  // Fetch Firestore Leads for Admin Portal
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const querySnapshot = await getDocs(collection(db, "inquiries"));
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      list.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
      setInquiriesList(list);
    } catch (err) {
      console.warn("Error fetching inquiries:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, "inquiries", id));
      setInquiriesList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    }
  };

  const handleLeadsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadsPasscode === "9288517027" || leadsPasscode === "8987766981" || leadsPasscode === "admin123" || leadsPasscode === "cvidya2026") {
      setLeadsAuthenticated(true);
      fetchInquiries();
    } else {
      alert("Invalid Passcode. Please enter authorized administrative passcode.");
    }
  };

  // Find product data from dataset
  const activeProductData = useMemo<ProductService | null>(() => {
    if (route.type !== "product") return null;
    const allProducts = [...saasProductsData, ...aiAgentsData];
    const found = allProducts.find(p => p.id === route.productKey);
    if (found) return found;
    const seo = PRODUCT_SEO_DATA[route.productKey];
    return {
      id: route.productKey,
      num: "01",
      name: seo?.h1Title || "Product",
      tagline: seo?.category || "Software Suite",
      description: seo?.metaDescription || "",
      features: seo?.secondaryKeywords || [],
      mockData: {
        title: seo?.h1Title || "Dashboard Overview",
        metrics: [],
        recentActivity: []
      }
    };
  }, [route]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans overflow-x-clip">
      
      {/* 0. GLOBAL REAL-TIME NETWORK & EDGE CASE STATUS */}
      <NetworkStatusBanner />

      {/* 1. TOP HEADER & NAVIGATION */}
      <Header 
        activePage={headerActivePage}
        onOpenAssistant={() => setAiOpen(true)} 
        onOpenHub={(path) => navigateTo(path)}
        onOpenConsultation={() => navigateTo("/contact/")}
        onOpenArchitecture={() => {
          setArchitectureTab("prd");
          setArchitectureOpen(true);
        }}
      />

      {/* 2. MAIN PAGE ROUTER SWITCH */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.type === "product" ? `product-${route.productKey}` : `page-${route.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1. HOME PAGE */}
            {route.type === "page" && route.id === "home" && (
              <HomePage 
                onNavigate={navigateTo}
                onSelectProduct={(product) => setActiveSoftwareDetail(product)}
                onOpenSoftware={(product) => setActiveLiveSoftware(product)}
                onOpenConsultation={() => navigateTo("/contact/")}
              />
            )}

            {/* 2. SOFTWARE DIRECTORY PAGE */}
            {route.type === "page" && route.id === "software" && (
              <SoftwareDirectoryPage 
                onNavigate={navigateTo}
                onOpenLiveApp={(product) => setActiveLiveSoftware(product)}
                onOpenConsultation={() => navigateTo("/contact/")}
              />
            )}

            {/* 3. AI AGENTS DIRECTORY PAGE */}
            {route.type === "page" && route.id === "ai-agents" && (
              <AiAgentsDirectoryPage 
                onNavigate={navigateTo}
                onOpenLiveApp={(product) => setActiveLiveSoftware(product)}
                onOpenConsultation={() => navigateTo("/contact/")}
              />
            )}

            {/* 4. PRICING PAGE */}
            {route.type === "page" && route.id === "pricing" && (
              <PricingPage 
                onNavigate={navigateTo}
                onOpenConsultation={() => navigateTo("/contact/")}
              />
            )}

            {/* 5. ABOUT PAGE */}
            {route.type === "page" && route.id === "about" && (
              <AboutPage 
                onNavigate={navigateTo}
              />
            )}

            {/* 6. SERVICES PAGE */}
            {route.type === "page" && route.id === "services" && (
              <ServicesPage 
                onSelectProduct={(product) => setActiveSoftwareDetail(product)}
                onOpenSoftware={(product) => setActiveLiveSoftware(product)}
                onOpenConsultation={() => navigateTo("/contact/")}
              />
            )}

            {/* 7. PORTFOLIO PAGE */}
            {route.type === "page" && route.id === "portfolio" && (
              <PortfolioPage 
                onNavigate={navigateTo}
              />
            )}

            {/* 8. CONTACT US PAGE */}
            {route.type === "page" && route.id === "contact" && (
              <ContactPage 
                onOpenLeadsModal={() => setLeadsModalOpen(true)}
              />
            )}

            {/* 9. CAREERS PAGE */}
            {route.type === "page" && route.id === "careers" && (
              <CareersPage 
                onNavigate={navigateTo}
              />
            )}

            {/* 10. FAQ PAGE */}
            {route.type === "page" && route.id === "faq" && (
              <FAQPage 
                onNavigateContact={() => navigateTo("/contact/")}
                onOpenAssistant={() => setAiOpen(true)}
              />
            )}

            {/* 11. BLOG PAGE */}
            {route.type === "page" && route.id === "blog" && (
              <BlogPage 
                onNavigate={navigateTo}
              />
            )}

            {/* 11.1 DEDICATED BLOG ARTICLE PAGE */}
            {route.type === "article" && ARTICLES_DATA[route.articleSlug] && (
              <BlogArticlePage
                article={ARTICLES_DATA[route.articleSlug]}
                onNavigate={navigateTo}
                onOpenConsultation={() => navigateTo("/contact/")}
              />
            )}

            {/* 12. DEDICATED PRODUCT & AI AGENT LANDING PAGES */}
            {route.type === "product" && PRODUCT_SEO_DATA[route.productKey] && activeProductData && (
              <ProductLandingPage
                seoInfo={PRODUCT_SEO_DATA[route.productKey]}
                productData={activeProductData}
                onNavigate={navigateTo}
                onOpenLiveApp={(product) => setActiveLiveSoftware(product)}
                onOpenConsultation={() => navigateTo("/contact/")}
              />
            )}

            {/* 13. SEPARATE COMPLIANCE / LEGAL PAGES */}
            {route.type === "page" && ["privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"].includes(route.id) && (
              <CompliancePage 
                initialTab={route.id as any} 
                onBackToHome={() => navigateTo("/")}
                onTabChange={(tab) => navigateTo(`/${tab}/`)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. FOOTER */}
      <Footer 
        onNavigate={navigateTo} 
        onOpenArchitecture={(tab) => {
          setArchitectureTab(tab || "prd");
          setArchitectureOpen(true);
        }}
      />

      {/* 4. FLOATING AI ASSISTANT TRIGGER */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-[#071739] text-white rounded-full shadow-2xl hover:bg-slate-900 border border-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-sans"
        >
          <div className="relative">
            <Logo size={28} showText={false} className="shrink-0 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold font-mono tracking-wider uppercase pr-1">
            C Vidya AI
          </span>
        </button>
      </div>

      {/* 5. PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenSoftware={(product) => {
            setPreviousPreviewProduct(selectedProduct);
            setSelectedProduct(null);
            setActiveLiveSoftware(product);
          }}
          onOpenConsultation={() => {
            setSelectedProduct(null);
            navigateTo("contact");
          }}
        />
      )}

      {/* 5b. FULL SOFTWARE & AGENT DETAIL VIEW WITH BACK BUTTON */}
      {activeSoftwareDetail && (
        <SoftwareDetailModal
          software={activeSoftwareDetail}
          onClose={() => {
            setActiveSoftwareDetail(null);
            setPreviousPreviewProduct(null);
          }}
          onOpenLiveApp={(product) => {
            setPreviousPreviewProduct(activeSoftwareDetail);
            setActiveSoftwareDetail(null);
            setActiveLiveSoftware(product);
          }}
          onOpenInquiry={(serviceTopic) => {
            setActiveSoftwareDetail(null);
            setPreviousPreviewProduct(null);
            navigateTo("contact");
          }}
        />
      )}

      {/* 5c. LIVE SOFTWARE & AUTONOMOUS AGENT APPLICATION WITH DIRECT BACK NAVIGATION */}
      {activeLiveSoftware && (
        <LiveSoftwareApp
          software={activeLiveSoftware}
          onClose={() => {
            const previewToRestore = previousPreviewProduct || activeLiveSoftware;
            setActiveLiveSoftware(null);
            setPreviousPreviewProduct(null);
            if (previewToRestore) {
              setActiveSoftwareDetail(previewToRestore);
            }
          }}
        />
      )}

      {/* 6. ONSITE LEADS ADMIN MODAL */}
      {leadsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setLeadsModalOpen(false); setLeadsAuthenticated(false); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!leadsAuthenticated ? (
              <div className="text-center py-8 space-y-4 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">Administrative Passcode</h3>
                <p className="text-xs text-slate-500">
                  Enter director passcode to view real-time customer callback requisitions stored in Firestore.
                </p>

                <form onSubmit={handleLeadsLogin} className="space-y-3 pt-2">
                  <input
                    type="password"
                    required
                    value={leadsPasscode}
                    onChange={(e) => setLeadsPasscode(e.target.value)}
                    placeholder="Enter Security Code"
                    className="w-full px-3.5 py-2.5 text-center text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Unlock Leads Ledger
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">Firestore Requisitions Ledger</h3>
                    <p className="text-xs text-slate-500 font-mono">Live customer callback requests and inquiries</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchInquiries}
                      disabled={loadingInquiries}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer"
                    >
                      {loadingInquiries ? "Refreshing..." : "Refresh"}
                    </button>
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                      {inquiriesList.length} Leads
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Filter by name, phone, or service..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {inquiriesList
                    .filter(inq => {
                      if (!leadSearch) return true;
                      const q = leadSearch.toLowerCase();
                      return (
                        (inq.name && inq.name.toLowerCase().includes(q)) ||
                        (inq.phone && inq.phone.toLowerCase().includes(q)) ||
                        (inq.service && inq.service.toLowerCase().includes(q)) ||
                        (inq.email && inq.email.toLowerCase().includes(q))
                      );
                    })
                    .map((item) => (
                      <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-950 text-sm">{item.name}</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono text-[10px]">{item.service || "General"}</span>
                          </div>
                          <div className="text-slate-600 font-mono flex flex-wrap gap-x-4 gap-y-1">
                            <span>📞 {item.phone}</span>
                            <span>✉️ {item.email}</span>
                            <span>🕒 {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recent"}</span>
                          </div>
                          {item.message && (
                            <p className="text-slate-700 pt-1 font-sans bg-white p-2 rounded border border-slate-100">
                              &ldquo;{item.message}&rdquo;
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => deleteInquiry(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                  {inquiriesList.length === 0 && !loadingInquiries && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No customer inquiries stored yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. GDPR / CCPA COOKIE CONSENT */}
      <CookieConsentBanner onManagePreferences={() => navigateTo("cookies")} />

      {/* 8. AI ASSISTANT MODAL */}
      <AiAssistant 
        isOpen={aiOpen} 
        onClose={() => setAiOpen(false)} 
      />



      {/* 9. ARCHITECTURE & SPECIFICATIONS CENTER (6 PILLARS) */}
      <ArchitectureHubModal
        isOpen={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
        initialTab={architectureTab}
      />

    </div>
  );
}
