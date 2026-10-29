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
import MobileAppPage from "./components/pages/MobileAppPage";
import AdminDashboardPage from "./components/pages/AdminDashboardPage";
import ProductDetailModal from "./components/ProductDetailModal";
import SoftwareDetailModal from "./components/SoftwareDetailModal";
import LiveSoftwareApp from "./components/LiveSoftwareApp";
import AiAssistant from "./components/AiAssistant";
import AiCallingConsolePanel from "./components/AiCallingConsolePanel";
import ComplianceModal, { CookieConsentBanner } from "./components/ComplianceModal";
import CompliancePage from "./components/CompliancePage";
import InfoHubModal from "./components/InfoHubModal";
import ArchitectureHubModal from "./components/ArchitectureHubModal";
import NetworkStatusBanner from "./components/NetworkStatusBanner";
import Logo from "./components/Logo";
import {
  ActivityPingNotification,
  SuccessFeedbackToast,
  isActivityPingsEnabled,
  setActivityPingsEnabled
} from "./components/ActivityPingsAndTour";
import { type ProductService } from "./types";
import { saasProductsData, aiAgentsData, otherServicesData } from "./data";
import { PRODUCT_SEO_DATA, CORE_PAGES_SEO } from "./seoData";

const allProducts: ProductService[] = [...saasProductsData, ...aiAgentsData, ...otherServicesData];
import { ARTICLES_DATA } from "./articleData";
import { 
  Lock, 
  X, 
  Trash2, 
  Search
} from "lucide-react";
import { collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import {
  db,
  auth,
  getAdminAuthHeaders,
  verifyAdminPasscodeWithServer,
  signInAdminWithGoogle,
  signOutAdmin,
  isAuthorizedAdminUser,
  onAuthStateChanged,
} from "./firebase";

export type RouteState =
  | { type: "page"; id: string; mode?: "demo" | "full" }
  | { type: "product"; productKey: string }
  | { type: "article"; articleSlug: string };

export function resolveRoute(pathname: string, hash: string, search: string = ""): RouteState {
  // 1. Architecture modal hash check
  if (hash.startsWith("#architecture")) {
    return { type: "page", id: "home" };
  }

  // Normalize path by stripping query strings and trailing slashes
  const pathOnly = pathname.split("?")[0].split("#")[0];
  let cleanPath = pathOnly.replace(/\/+$/, "");
  if (!cleanPath || cleanPath === "") {
    cleanPath = "/";
  }

  const fullSearch = search || (pathname.includes("?") ? pathname.slice(pathname.indexOf("?")) : (typeof window !== "undefined" ? window.location.search : ""));
  const isDemo = fullSearch.includes("mode=demo") || fullSearch.includes("demo=true") || hash.includes("demo") || cleanPath === "/book-free-demo" || cleanPath === "/book-demo";

  // 2. Handle legacy hash navigation like #about or #software/library-management
  if (hash && hash.length > 1) {
    const hashContent = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
    const corePages = [
      "home", "about", "services", "portfolio", "contact", "careers", "blog", "faq",
      "pricing", "software", "ai-agents", "mobile-app", "coming-soon", "admin", "admin-dashboard",
      "privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"
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
  if (cleanPath === "/contact" || cleanPath === "/book-free-demo" || cleanPath === "/book-demo") {
    return { type: "page", id: "contact", mode: isDemo ? "demo" : "full" };
  }
  if (cleanPath === "/careers") return { type: "page", id: "careers" };
  if (cleanPath === "/blog") return { type: "page", id: "blog" };
  if (cleanPath === "/faq") return { type: "page", id: "faq" };
  if (cleanPath === "/mobile-app") return { type: "page", id: "mobile-app" };
  if (cleanPath === "/coming-soon") return { type: "page", id: "coming-soon" };
  if (cleanPath === "/admin" || cleanPath === "/admin-dashboard") return { type: "page", id: "admin" };

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
      return resolveRoute(window.location.pathname, window.location.hash, window.location.search);
    }
    return { type: "page", id: "home" };
  });

  // Onsite Leads Admin Dialog State
  const [leadsModalOpen, setLeadsModalOpen] = useState(false);
  const [leadsPasscode, setLeadsPasscode] = useState("");
  const [leadsAuthenticated, setLeadsAuthenticated] = useState(false);
  const [leadsAuthError, setLeadsAuthError] = useState("");
  const [leadsAuthenticating, setLeadsAuthenticating] = useState(false);
  const [adminUserEmail, setAdminUserEmail] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<"leads" | "app_registrations" | "crm_report" | "ai_calling">("leads");
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [appRegistrationsList, setAppRegistrationsList] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");

  // Open live software with browser history push so Chrome Back returns to originating page & scroll position
  const openLiveSoftware = (product: ProductService, originatingPreviewProduct?: ProductService | null) => {
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    if (typeof window !== "undefined") {
      window.history.replaceState(
        {
          ...(window.history.state || {}),
          type: "page",
          scrollY: currentScrollY,
        },
        ""
      );
      window.history.pushState(
        {
          isModal: true,
          modalType: "live-software",
          productId: product.id,
          previewProductId: originatingPreviewProduct ? originatingPreviewProduct.id : (previousPreviewProduct ? previousPreviewProduct.id : null),
          scrollY: currentScrollY,
        },
        "",
        window.location.pathname + window.location.search + window.location.hash
      );
    }
    if (originatingPreviewProduct) {
      setPreviousPreviewProduct(originatingPreviewProduct);
    }
    setActiveSoftwareDetail(null);
    setSelectedProduct(null);
    setActiveLiveSoftware(product);
  };

  // Open product detail preview with browser history push
  const openSoftwareDetail = (product: ProductService) => {
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    if (typeof window !== "undefined") {
      window.history.replaceState(
        {
          ...(window.history.state || {}),
          type: "page",
          scrollY: currentScrollY,
        },
        ""
      );
      window.history.pushState(
        {
          isModal: true,
          modalType: "software-detail",
          productId: product.id,
          scrollY: currentScrollY,
        },
        "",
        window.location.pathname + window.location.search + window.location.hash
      );
    }
    setActiveLiveSoftware(null);
    setSelectedProduct(null);
    setActiveSoftwareDetail(product);
  };

  // Close handlers that respect browser history
  const closeLiveSoftware = () => {
    if (typeof window !== "undefined" && window.history.state?.isModal) {
      window.history.back();
    } else {
      setActiveLiveSoftware(null);
      if (previousPreviewProduct) {
        setActiveSoftwareDetail(previousPreviewProduct);
        setPreviousPreviewProduct(null);
      }
    }
  };

  const closeSoftwareDetail = () => {
    if (typeof window !== "undefined" && window.history.state?.isModal) {
      window.history.back();
    } else {
      setActiveSoftwareDetail(null);
      setPreviousPreviewProduct(null);
    }
  };

  const closeProductDetail = () => {
    if (typeof window !== "undefined" && window.history.state?.isModal) {
      window.history.back();
    } else {
      setSelectedProduct(null);
    }
  };

  // Scroll position tracker: updates history.state without creating history entries
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let scrollTimer: any;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (typeof window !== "undefined" && !window.history.state?.isModal) {
          window.history.replaceState(
            {
              ...(window.history.state || {}),
              type: "page",
              scrollY: window.scrollY,
            },
            ""
          );
        }
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

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

    const currentUrl = window.location.pathname + window.location.search + window.location.hash;

    // Save scroll position for origin page in history
    if (typeof window !== "undefined") {
      window.history.replaceState(
        {
          ...(window.history.state || {}),
          type: "page",
          url: currentUrl,
          scrollY: window.scrollY,
        },
        ""
      );
    }

    if (currentUrl !== urlToPush) {
      window.history.pushState({ type: "page", url: urlToPush, scrollY: 0 }, "", urlToPush);
    }

    setActiveLiveSoftware(null);
    setActiveSoftwareDetail(null);
    setSelectedProduct(null);
    setPreviousPreviewProduct(null);

    const searchPart = urlToPush.includes("?") ? urlToPush.slice(urlToPush.indexOf("?")) : "";
    const hashPart = urlToPush.includes("#") ? urlToPush.slice(urlToPush.indexOf("#")) : "";
    const pathPart = urlToPush.split("?")[0].split("#")[0];
    const newRoute = resolveRoute(pathPart, hashPart, searchPart);
    setRoute(newRoute);

    if (hashPart && hashPart.length > 1) {
      const hashId = hashPart.replace(/^#/, "");
      requestAnimationFrame(() => {
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  // HTML5 History & Popstate event listener
  useEffect(() => {
    const handleLocationChange = (event?: PopStateEvent) => {
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

      const state = event?.state || (typeof window !== "undefined" ? window.history.state : null);

      // Check if state indicates a modal or live software was opened
      if (state && state.isModal) {
        const prod = allProducts.find((p) => p.id === state.productId);
        if (prod) {
          if (state.modalType === "live-software") {
            setActiveLiveSoftware(prod);
            setActiveSoftwareDetail(null);
            setSelectedProduct(null);
            if (state.previewProductId) {
              const prev = allProducts.find((p) => p.id === state.previewProductId);
              if (prev) setPreviousPreviewProduct(prev);
            }
            return;
          } else if (state.modalType === "software-detail") {
            setActiveLiveSoftware(null);
            setActiveSoftwareDetail(prod);
            setSelectedProduct(null);
            setPreviousPreviewProduct(null);
            return;
          } else if (state.modalType === "product-detail") {
            setActiveLiveSoftware(null);
            setActiveSoftwareDetail(null);
            setSelectedProduct(prod);
            return;
          }
        }
      }

      // No modal active in popped history state: close any open software overlay/preview
      setActiveLiveSoftware(null);
      setActiveSoftwareDetail(null);
      setSelectedProduct(null);
      setPreviousPreviewProduct(null);

      const newRoute = resolveRoute(window.location.pathname, window.location.hash, window.location.search);
      setRoute(newRoute);

      if (newRoute.type === "page" && ["privacy", "terms", "billing", "refund", "cookies", "disclaimer", "portability"].includes(newRoute.id)) {
        setComplianceTab(newRoute.id);
      }

      // Exact scroll position preservation on Browser Back / Forward
      const targetScrollY = state?.scrollY;
      if (typeof targetScrollY === "number") {
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetScrollY, behavior: "instant" });
        });
      } else if (window.location.hash && window.location.hash.length > 1) {
        const hashId = window.location.hash.replace(/^#/, "");
        const targetEl = document.getElementById(hashId);
        if (targetEl) {
          requestAnimationFrame(() => {
            targetEl.scrollIntoView({ behavior: "smooth" });
          });
        }
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
      if (route.id === "contact" && route.mode === "demo") {
        return "demo";
      }
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

  // Fetch Firestore + API Leads for Admin Portal
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const mergedMap = new Map<string, any>();

      try {
        const headers = await getAdminAuthHeaders();
        const res = await fetch("/api/inquiries", { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.inquiries)) {
            data.inquiries.forEach((item: any) => {
              if (item && item.id) mergedMap.set(String(item.id), item);
            });
          }
        }
      } catch {
        // Ignore API fallback error
      }

      try {
        const querySnapshot = await getDocs(collection(db, "inquiries"));
        querySnapshot.forEach((docSnap) => {
          mergedMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
        });
      } catch (err) {
        console.warn("Error fetching Firestore inquiries:", err);
      }

      const list = Array.from(mergedMap.values());
      list.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
      setInquiriesList(list);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    setInquiriesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    try {
      const authHeaders = await getAdminAuthHeaders();
      await fetch(`/api/crm/leads/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Ignore network error
    }
    try {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
    } catch {
      // Ignore if record only exists in memory or public rules block unauthenticated update
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, "inquiries", id));
    } catch (err) {
      console.warn("Firestore delete notice:", err);
    }
    try {
      const authHeaders = await getAdminAuthHeaders();
      await fetch(`/api/inquiries/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    } catch {
      // Ignore API delete notice
    }
    setInquiriesList(prev => prev.filter(item => item.id !== id));
  };

  const fetchAppRegistrations = async () => {
    try {
      setLoadingInquiries(true);
      const querySnapshot = await getDocs(collection(db, "app_download_registrations"));
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      list.sort((a, b) => new Date(b.clientTimestamp || b.createdAt || 0).getTime() - new Date(a.clientTimestamp || a.createdAt || 0).getTime());
      setAppRegistrationsList(list);
    } catch (err) {
      console.warn("Error fetching app download registrations:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const deleteAppRegistration = async (id: string) => {
    try {
      await deleteDoc(doc(db, "app_download_registrations", id));
      setAppRegistrationsList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting app registration:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (isAuthorizedAdminUser(user)) {
        setAdminUserEmail(user?.email || null);
        setLeadsAuthenticated(true);
      } else {
        setAdminUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLeadsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadsAuthError("");
    setLeadsAuthenticating(true);
    try {
      const result = await verifyAdminPasscodeWithServer(leadsPasscode);
      if (result.authorized) {
        setLeadsAuthenticated(true);
        setLeadsPasscode("");
        fetchInquiries();
        fetchAppRegistrations();
      } else {
        setLeadsAuthError(result.message || "Invalid Passcode. Please enter authorized administrative credentials.");
      }
    } finally {
      setLeadsAuthenticating(false);
    }
  };

  const handleGoogleAdminSignIn = async () => {
    setLeadsAuthError("");
    setLeadsAuthenticating(true);
    try {
      const result = await signInAdminWithGoogle();
      if (result.authorized) {
        setAdminUserEmail(result.user?.email || null);
        setLeadsAuthenticated(true);
        fetchInquiries();
        fetchAppRegistrations();
      } else {
        setLeadsAuthError(result.message || "Google Admin Sign-In failed.");
      }
    } finally {
      setLeadsAuthenticating(false);
    }
  };

  const handleAdminSignOut = async () => {
    await signOutAdmin();
    setAdminUserEmail(null);
    setLeadsAuthenticated(false);
    setLeadsModalOpen(false);
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
        onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
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
                onSelectProduct={openSoftwareDetail}
                onOpenSoftware={openLiveSoftware}
                onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
              />
            )}

            {/* 2. SOFTWARE DIRECTORY PAGE */}
            {route.type === "page" && route.id === "software" && (
              <SoftwareDirectoryPage 
                onNavigate={navigateTo}
                onOpenLiveApp={openLiveSoftware}
                onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
              />
            )}

            {/* 3. AI AGENTS DIRECTORY PAGE */}
            {route.type === "page" && route.id === "ai-agents" && (
              <AiAgentsDirectoryPage 
                onNavigate={navigateTo}
                onOpenLiveApp={openLiveSoftware}
                onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
              />
            )}

            {/* 4. PRICING PAGE */}
            {route.type === "page" && route.id === "pricing" && (
              <PricingPage 
                onNavigate={navigateTo}
                onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
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
                onSelectProduct={openSoftwareDetail}
                onOpenSoftware={openLiveSoftware}
                onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
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
                mode={route.mode || "full"}
                onNavigate={navigateTo}
                onOpenLeadsModal={() => navigateTo("/admin")}
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

            {/* 11.05 MOBILE APP DOWNLOAD & COMING SOON PAGE */}
            {route.type === "page" && (route.id === "mobile-app" || route.id === "coming-soon") && (
              <MobileAppPage
                onNavigate={navigateTo}
                onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
                initialShowComingSoon={route.id === "coming-soon"}
              />
            )}

            {/* 11.1 DEDICATED BLOG ARTICLE PAGE */}
            {route.type === "article" && ARTICLES_DATA[route.articleSlug] && (
              <BlogArticlePage
                article={ARTICLES_DATA[route.articleSlug]}
                onNavigate={navigateTo}
                onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
              />
            )}

            {/* 12. DEDICATED PRODUCT & AI AGENT LANDING PAGES */}
            {route.type === "product" && PRODUCT_SEO_DATA[route.productKey] && activeProductData && (
              <ProductLandingPage
                seoInfo={PRODUCT_SEO_DATA[route.productKey]}
                productData={activeProductData}
                onNavigate={navigateTo}
                onOpenLiveApp={openLiveSoftware}
                onOpenConsultation={() => navigateTo("/contact/?mode=demo")}
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

            {/* 14. PRIVATE ADMIN LOGIN & DASHBOARD ROUTE (/admin) */}
            {route.type === "page" && route.id === "admin" && (
              <AdminDashboardPage onNavigate={navigateTo} />
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
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 mb-[env(safe-area-inset-bottom,0px)] mr-[env(safe-area-inset-right,0px)]">
        <button
          id="floating-ai-assistant-btn"
          type="button"
          onClick={() => setAiOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#071739] text-white rounded-full shadow-2xl hover:bg-slate-900 border border-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer font-sans"
        >
          <div className="relative">
            <Logo size={26} showText={false} className="shrink-0 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold font-mono tracking-wider uppercase pr-1">
            C Vidya AI
          </span>
        </button>
      </div>

      {/* 4b. FEATURE 03: REAL-DATA ACTIVITY PINGS + FEATURE 12: SUCCESS FEEDBACK TOAST */}
      <ActivityPingNotification onNavigate={navigateTo} />
      <SuccessFeedbackToast onNavigate={navigateTo} />

      {/* 5. PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={closeProductDetail}
          onOpenSoftware={(product) => {
            openLiveSoftware(product, selectedProduct);
          }}
          onOpenConsultation={() => {
            closeProductDetail();
            navigateTo("/contact/?mode=demo");
          }}
        />
      )}

      {/* 5b. FULL SOFTWARE & AGENT DETAIL PREVIEW VIEW WITH STEP-BY-STEP BACK BUTTON */}
      {activeSoftwareDetail && (
        <SoftwareDetailModal
          software={activeSoftwareDetail}
          onClose={closeSoftwareDetail}
          onOpenLiveApp={(product) => {
            openLiveSoftware(product, activeSoftwareDetail);
          }}
          onOpenInquiry={(_serviceTopic) => {
            closeSoftwareDetail();
            navigateTo("contact");
          }}
        />
      )}

      {/* 5c. LIVE SOFTWARE & AUTONOMOUS AGENT APPLICATION WITH STEP-BY-STEP PREVIEW NAVIGATION */}
      {activeLiveSoftware && (
        <LiveSoftwareApp
          software={activeLiveSoftware}
          onClose={closeLiveSoftware}
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
                <h3 className="text-xl font-bold text-slate-950">Administrative Authentication</h3>
                <p className="text-xs text-slate-500">
                  Sign in with an authorized C Vidya Solutions Google administrator account (`emailVerified: true`).
                </p>

                {leadsAuthError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {leadsAuthError}
                  </div>
                )}

                <button
                  type="button"
                  disabled={leadsAuthenticating}
                  onClick={handleGoogleAdminSignIn}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🔐 Sign in with Google Admin (Firebase)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLeadsModalOpen(false);
                    navigateTo("/admin");
                  }}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Open Full Admin Dashboard (/admin)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-950">Administrative Data Center &amp; CRM</h3>
                      {adminUserEmail && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                          {adminUserEmail}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleAdminSignOut}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setAdminTab("leads")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          adminTab === "leads"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        CRM Leads ({inquiriesList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminTab("app_registrations")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          adminTab === "app_registrations"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        📱 App Registrations ({appRegistrationsList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminTab("crm_report")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          adminTab === "crm_report"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        📊 Management Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminTab("ai_calling")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          adminTab === "ai_calling"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        📞 AI Calling &amp; HR Hub
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        fetchInquiries();
                        fetchAppRegistrations();
                      }}
                      disabled={loadingInquiries}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded cursor-pointer"
                    >
                      {loadingInquiries ? "Refreshing..." : "Refresh"}
                    </button>
                  </div>
                </div>

                {adminTab !== "crm_report" && adminTab !== "ai_calling" && (
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder={adminTab === "leads" ? "Filter by name, company, city, phone, or product..." : "Filter by applicant name, platform, or email..."}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden"
                    />
                  </div>
                )}

                {adminTab === "ai_calling" ? (
                  <AiCallingConsolePanel
                    leads={inquiriesList}
                    onUpdateLeadStatus={updateLeadStatus}
                    onRefreshLeads={fetchInquiries}
                  />
                ) : adminTab === "leads" ? (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {inquiriesList
                      .filter(inq => {
                        if (!leadSearch) return true;
                        const q = leadSearch.toLowerCase();
                        return (
                          (inq.name && inq.name.toLowerCase().includes(q)) ||
                          (inq.company && inq.company.toLowerCase().includes(q)) ||
                          (inq.cityCountry && inq.cityCountry.toLowerCase().includes(q)) ||
                          (inq.phone && inq.phone.toLowerCase().includes(q)) ||
                          (inq.service && inq.service.toLowerCase().includes(q)) ||
                          (inq.email && inq.email.toLowerCase().includes(q))
                        );
                      })
                      .map((item) => (
                        <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4 text-xs">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-slate-950 text-sm">{item.name}</span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono text-[10px]">{item.service || "General"}</span>
                              <select
                                value={item.status || "New"}
                                onChange={(e) => updateLeadStatus(item.id, e.target.value)}
                                aria-label={`Lead status for ${item.name}`}
                                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Demo Scheduled">Demo Scheduled</option>
                                <option value="Converted">Converted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                            <div className="text-slate-600 font-mono flex flex-wrap gap-x-4 gap-y-1">
                              <span>📞 {item.phone}</span>
                              <span>✉️ {item.email}</span>
                              {item.company && <span>🏢 {item.company}</span>}
                              {item.cityCountry && <span>📍 {item.cityCountry}</span>}
                              {item.businessType && <span>🏷️ {item.businessType}</span>}
                              <span>🕒 {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recent"}</span>
                            </div>
                            {item.followUpTask && (
                              <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                                📅 Follow-Up Task: {item.followUpTask}
                              </div>
                            )}
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
                ) : adminTab === "app_registrations" ? (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {appRegistrationsList
                      .filter(reg => {
                        if (!leadSearch) return true;
                        const q = leadSearch.toLowerCase();
                        return (
                          (reg.name && reg.name.toLowerCase().includes(q)) ||
                          (reg.phone && reg.phone.toLowerCase().includes(q)) ||
                          (reg.platform && reg.platform.toLowerCase().includes(q)) ||
                          (reg.email && reg.email.toLowerCase().includes(q))
                        );
                      })
                      .map((item) => (
                        <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-950 text-sm">{item.name}</span>
                              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                                item.platform === "android" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                              }`}>
                                {item.platform === "android" ? "🤖 Android" : "🍎 iOS"}
                              </span>
                            </div>
                            <div className="text-slate-600 font-mono flex flex-wrap gap-x-4 gap-y-1">
                              <span>📞 {item.phone}</span>
                              <span>✉️ {item.email}</span>
                              <span>🕒 {item.clientTimestamp ? new Date(item.clientTimestamp).toLocaleString() : "Recent"}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 pt-0.5">
                              <span>ID: {item.id}</span>
                              <span>• Consent: {item.privacyConsent ? "Verified" : "None"}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteAppRegistration(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                    {appRegistrationsList.length === 0 && !loadingInquiries && (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No mobile app download registrations stored yet.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="text-[10px] font-mono uppercase text-slate-500">Total CRM Leads</div>
                        <div className="text-xl font-bold text-slate-950 mt-0.5">{inquiriesList.length}</div>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="text-[10px] font-mono uppercase text-blue-700">Qualified / Demo</div>
                        <div className="text-xl font-bold text-blue-950 mt-0.5">
                          {inquiriesList.filter(i => i.status === "Qualified" || i.status === "Demo Scheduled").length}
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="text-[10px] font-mono uppercase text-amber-700">Follow-Up Tasks</div>
                        <div className="text-xl font-bold text-amber-950 mt-0.5">
                          {inquiriesList.filter(i => Boolean(i.followUpTask || (i.message && i.message.includes("Follow-Up:")))).length}
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="text-[10px] font-mono uppercase text-emerald-700">App Downloads</div>
                        <div className="text-xl font-bold text-emerald-950 mt-0.5">{appRegistrationsList.length}</div>
                      </div>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-slate-900">Verified Product Portfolio Summary</div>
                      <p className="text-slate-600 leading-relaxed">
                        {saasProductsData.length} Enterprise SaaS Products • {aiAgentsData.length} Autonomous AI Agent Systems • {otherServicesData.length} Engineering &amp; Cloud Services. All metrics above are computed directly from actual stored records in Firestore and the CRM database.
                      </p>
                    </div>
                  </div>
                )}
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
