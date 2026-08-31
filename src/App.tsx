import React, { useState, useEffect } from "react";
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
import ProductDetailModal from "./components/ProductDetailModal";
import AiAssistant from "./components/AiAssistant";
import ComplianceModal, { CookieConsentBanner } from "./components/ComplianceModal";
import CompliancePage from "./components/CompliancePage";
import InfoHubModal from "./components/InfoHubModal";
import Logo from "./components/Logo";
import { type ProductService } from "./types";
import { saasProductsData, aiAgentsData } from "./data";
import { 
  Lock, 
  X, 
  Trash2, 
  Database, 
  Download, 
  Search, 
  Filter,
  CheckCircle2
} from "lucide-react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [aiOpen, setAiOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceTab, setComplianceTab] = useState("privacy");
  const [selectedProduct, setSelectedProduct] = useState<ProductService | null>(null);

  // Active page routing state
  const [activePage, setActivePage] = useState<
    "home" | "about" | "services" | "portfolio" | "contact" | "careers" | "blog" | "faq" | 
    "privacy" | "terms" | "billing" | "refund" | "cookies" | "disclaimer" | "portability"
  >("home");

  // Onsite Leads Admin Dialog State
  const [leadsModalOpen, setLeadsModalOpen] = useState(false);
  const [leadsPasscode, setLeadsPasscode] = useState("");
  const [leadsAuthenticated, setLeadsAuthenticated] = useState(false);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");

  // Hash-change router listener for separate pages & Dynamic SEO updater
  useEffect(() => {
    const pageMetaMap: Record<string, { title: string; description: string }> = {
      home: {
        title: "C Vidya Solutions - Architecting the Digital Future",
        description: "Enterprise software solutions, multitenant SaaS platforms, autonomous AI agents, and technology consulting."
      },
      about: {
        title: "About Us - C Vidya Solutions",
        description: "Learn about C Vidya Solutions' mission, leadership team, and history of engineering execution."
      },
      services: {
        title: "Services & SaaS Products - C Vidya Solutions",
        description: "Explore 7 flagship SaaS products, 4 autonomous AI agents, and comprehensive professional technology consulting."
      },
      portfolio: {
        title: "Portfolio & Case Studies - C Vidya Solutions",
        description: "High-fidelity business solutions and architectural case studies across FinTech, Data Analytics, and Cloud Infrastructure."
      },
      contact: {
        title: "Contact Us & Regional Offices - C Vidya Solutions",
        description: "Connect with our director desk, schedule a callback requisition, or visit our regional R&D headquarters."
      },
      careers: {
        title: "Careers & Open Positions - C Vidya Solutions",
        description: "Build the future of enterprise tech. Explore open opportunities across engineering, AI R&D, and product design."
      },
      faq: {
        title: "Frequently Asked Questions - C Vidya Solutions",
        description: "Answers to common questions regarding our SaaS suites, cloud integration timelines, SLA commitments, and support."
      },
      blog: {
        title: "Industry Insights & Company News - C Vidya Solutions",
        description: "Articles on cloud-native architecture, zero-trust security frameworks, and enterprise automation."
      },
      privacy: {
        title: "Privacy Policy - C Vidya Solutions",
        description: "Official Privacy Policy of C Vidya Solutions in compliance with DPDP Act, GDPR, and CCPA."
      },
      terms: {
        title: "Terms of Service - C Vidya Solutions",
        description: "Master subscription terms and service level agreements of C Vidya Solutions."
      },
      billing: {
        title: "Billing & Invoicing Terms - C Vidya Solutions",
        description: "GST invoicing, payment schedules, and subscription terms for C Vidya software."
      },
      refund: {
        title: "Refund & Cancellation Policy - C Vidya Solutions",
        description: "Review our 14-day satisfaction refund policy and service cancellation guidelines."
      },
      cookies: {
        title: "Cookie Policy - C Vidya Solutions",
        description: "Learn how C Vidya Solutions protects user browsing privacy and manages cookie consent."
      },
      disclaimer: {
        title: "Legal Disclaimer - C Vidya Solutions",
        description: "Official legal disclaimer and intellectual property notices."
      },
      portability: {
        title: "Data Portability - C Vidya Solutions",
        description: "Export records and database ledgers under GDPR Article 15 and international portability standards."
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validPages = [
        "home", "about", "services", "portfolio", "contact", "careers", "blog", "faq",
        "privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"
      ];
      let target = "home";
      if (hash && validPages.includes(hash)) {
        target = hash;
      }
      
      setActivePage(target as any);
      if (["privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"].includes(target)) {
        setComplianceTab(target);
      }

      // Update SEO Head dynamically
      const meta = pageMetaMap[target] || pageMetaMap.home;
      document.title = meta.title;
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) {
        descTag.setAttribute("content", meta.description);
      }
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      if (canonicalTag) {
        canonicalTag.setAttribute("href", `https://cvidyasolutions.com${target === "home" ? "" : "#" + target}`);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch Firestore Leads for Admin Portal
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const querySnapshot = await getDocs(collection(db, "inquiries"));
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort newest first
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
    // Default passcodes
    if (leadsPasscode === "9288517027" || leadsPasscode === "8987766981" || leadsPasscode === "admin123" || leadsPasscode === "cvidya2026") {
      setLeadsAuthenticated(true);
      fetchInquiries();
    } else {
      alert("Invalid Passcode. Please enter authorized administrative passcode.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans overflow-x-clip">
      
      {/* 1. TOP HEADER & NAVIGATION */}
      <Header 
        activePage={activePage}
        onOpenAssistant={() => setAiOpen(true)} 
        onOpenHub={(tab) => navigateTo(tab)}
        onOpenConsultation={() => navigateTo("contact")}
      />

      {/* 2. MAIN PAGE ROUTER SWITCH */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1. HOME PAGE */}
            {activePage === "home" && (
              <HomePage 
                onNavigate={navigateTo}
                onSelectProduct={(product) => setSelectedProduct(product)}
                onOpenConsultation={() => navigateTo("contact")}
              />
            )}

            {/* 2. ABOUT PAGE */}
            {activePage === "about" && (
              <AboutPage 
                onNavigate={navigateTo}
              />
            )}

            {/* 3. SERVICES PAGE */}
            {activePage === "services" && (
              <ServicesPage 
                onSelectProduct={(product) => setSelectedProduct(product)}
                onOpenConsultation={() => navigateTo("contact")}
              />
            )}

            {/* 4. PORTFOLIO PAGE */}
            {activePage === "portfolio" && (
              <PortfolioPage 
                onNavigate={navigateTo}
              />
            )}

            {/* 5. CONTACT US PAGE */}
            {activePage === "contact" && (
              <ContactPage 
                onOpenLeadsModal={() => setLeadsModalOpen(true)}
              />
            )}

            {/* 6. CAREERS PAGE */}
            {activePage === "careers" && (
              <CareersPage 
                onNavigate={navigateTo}
              />
            )}

            {/* 7. FAQ PAGE */}
            {activePage === "faq" && (
              <FAQPage 
                onNavigateContact={() => navigateTo("contact")}
                onOpenAssistant={() => setAiOpen(true)}
              />
            )}

            {/* 8. BLOG PAGE */}
            {activePage === "blog" && (
              <BlogPage 
                onNavigate={navigateTo}
              />
            )}

            {/* 9. SEPARATE COMPLIANCE / LEGAL PAGES */}
            {["privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"].includes(activePage) && (
              <CompliancePage 
                initialTab={activePage as any} 
                onBackToHome={() => navigateTo("home")}
                onTabChange={(tab) => navigateTo(tab)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. FOOTER */}
      <Footer onNavigate={navigateTo} />

      {/* 4. FLOATING AI ASSISTANT TRIGGER */}
      <div className="fixed bottom-6 right-6 z-40">
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
            AI Assistant
          </span>
        </button>
      </div>

      {/* 5. PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenConsultation={() => {
            setSelectedProduct(null);
            navigateTo("contact");
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

    </div>
  );
}
