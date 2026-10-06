import React, { useState, useEffect, useMemo, useRef } from "react";
import { ProductService } from "../types";
import institutesImg from "../assets/images/institutes_software_dashboard_1784909550776.jpg";
import institutesComingSoonImg from "../assets/images/institutes_coming_soon_1789758787152.jpg";
import { 
  ArrowLeft,
  ArrowRight, 
  X, 
  RefreshCw, 
  Sparkles, 
  TrendingUp,
  Headphones,
  Megaphone,
  CheckCircle2,
  ExternalLink,
  Clock,
  Building2,
  GraduationCap,
  CreditCard,
  Bus,
  Smartphone,
  Calendar,
  Bell,
  Dumbbell,
  BookOpen,
  Award,
  Sprout,
  Gem,
  Target,
  Fuel,
  HeartPulse,
  FileText,
  BarChart3
} from "lucide-react";

interface LiveSoftwareAppProps {
  software: ProductService | null;
  onClose: () => void;
}

export default function LiveSoftwareApp({ software, onClose }: LiveSoftwareAppProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const [iframeKey, setIframeKey] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Coming Soon state for institutes
  const [activePictureIndex, setActivePictureIndex] = useState(0);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlistSubmitted, setIsWaitlistSubmitted] = useState(false);

  const isInstitutes = useMemo(() => {
    if (!software) return false;
    return software.id === "institutes" || software.name.toLowerCase().includes("institute");
  }, [software]);

  // Use direct live worker URLs for all cloud SaaS apps and AI agents, enabling full native Google OAuth and dashboard access
  const effectiveIframeSrc = useMemo(() => {
    if (!software?.externalLink) return "";
    const id = software.id.toLowerCase();
    if (id === "library" || software.externalLink.includes("v.cvidyasolutions")) {
      return "https://v.cvidyasolutions.workers.dev/";
    }
    if (id === "fitness" || software.externalLink.includes("fitzone")) {
      return "https://fitzone.cvidyasolutions.workers.dev/";
    }
    if (id === "farming" || id === "agrifusion" || software.externalLink.includes("fresh.cvidyasolutions")) {
      return "https://fresh.cvidyasolutions.workers.dev/";
    }
    if (id === "petrol-pump" || software.externalLink.includes("c-vidya-cloud-petrol-pump")) {
      return "/software/petrol-pump/index.html";
    }
    if (id === "pdf-media-tools" || id === "pdf-tools" || software.externalLink.includes("c-vidya-pdf-saas-tools")) {
      return "/software/pdf-media-tools/index.html";
    }
    // For all AI agents and other SaaS products, load live software worker link directly without proxy
    return software.externalLink;
  }, [software]);

  useEffect(() => {
    if (software) {
      document.body.style.overflow = "hidden";
      setIframeLoaded(false);
      setIframeError(false);
      setIframeKey((k) => k + 1);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [software, onClose]);

  // Track iframe navigation state and route depth
  const navigationDepthRef = useRef(0);
  const lastRecordedPathRef = useRef("");
  const [canGoBackState, setCanGoBackState] = useState(false);

  useEffect(() => {
    navigationDepthRef.current = 0;
    lastRecordedPathRef.current = "";
    setCanGoBackState(false);
  }, [software]);

  // Listen to exit message bridge and route changes from embedded software with strict schema validation
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;
      const allowedTypes = ["CV_CLOSE_PORTAL", "CV_GO_TO_PREVIEW", "CV_EXIT_SOFTWARE", "CV_ROUTE_CHANGED"];
      if (!allowedTypes.includes(event.data.type)) return;

      if (
        event.data.type === "CV_CLOSE_PORTAL" || 
        event.data.type === "CV_GO_TO_PREVIEW" || 
        event.data.type === "CV_EXIT_SOFTWARE"
      ) {
        onClose();
      } else if (event.data.type === "CV_ROUTE_CHANGED") {
        const { pathname, isRoot, canGoBack } = event.data;
        if (typeof pathname === "string") {
          const cleanPath = pathname.replace(/\/+$/, "").slice(0, 500) || "/";
          if (lastRecordedPathRef.current && lastRecordedPathRef.current !== cleanPath) {
            navigationDepthRef.current += 1;
          }
          lastRecordedPathRef.current = cleanPath;
        }
        setCanGoBackState(Boolean(canGoBack || isRoot === false));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onClose]);

  const isLocalSuite = useMemo(() => {
    if (!software) return false;
    const id = software.id.toLowerCase();
    return (
      id === "petrol-pump" ||
      id === "pdf-media-tools" ||
      id === "pdf-tools"
    );
  }, [software]);

  const lastBackClickRef = useRef<number>(0);

  const handleBack = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastBackClickRef.current;
    lastBackClickRef.current = now;

    // 1. If coming-soon overlay (Institutes) or no iframe available, close directly and return to preview page
    if (isInstitutes || !iframeRef.current?.contentWindow) {
      onClose();
      return;
    }

    // 2. For local suites (Library, Fitness, Petrol Pump, PDF Tools), support step-by-step backward navigation
    if (isLocalSuite) {
      // If user is already on the landing page, or if back was clicked twice in quick succession (< 450ms):
      // close immediately and return to the preview page!
      if (!canGoBackState || timeSinceLastClick < 450) {
        onClose();
        return;
      }

      try {
        iframeRef.current.contentWindow.postMessage({ type: "CV_GO_BACK" }, "*");
      } catch (e) {
        onClose();
      }
      return;
    }

    // 3. For all other live cloud software & AI Agents (Coaching, Agrifusion, Jewelry, CRM, Care Plus, AI Social, AI Support, SalesFlow, Marketing):
    // Directly close and return to the preview / services page!
    try {
      iframeRef.current.contentWindow.postMessage({ type: "CV_GO_BACK" }, "*");
    } catch (e) {}
    onClose();
  };

  // Define dynamic metadata, branding colors, typography and navigation features for every software
  interface SoftwareConfig {
    shortName: string;
    icon: React.ElementType;
    badgeBg: string;
    badgeShadow: string;
    backBtnBg: string;
    backBtnHover: string;
    titleGradient: string;
    navHoverText: string;
    primaryBtnBg: string;
    primaryBtnHover: string;
    primaryBtnLabel: string;
    headerBg: string;
    headerBorder: string;
    navLinks: Array<{ label: string; target: string }>;
  }

  const getSoftwareConfig = (sw: ProductService | null): SoftwareConfig => {
    if (!sw) {
      return {
        shortName: "C Vidya Software",
        icon: Sparkles,
        badgeBg: "bg-blue-600",
        badgeShadow: "shadow-blue-600/30",
        backBtnBg: "bg-blue-600",
        backBtnHover: "hover:bg-blue-500",
        titleGradient: "from-white via-blue-200 to-white",
        navHoverText: "hover:text-blue-400",
        primaryBtnBg: "bg-blue-600",
        primaryBtnHover: "hover:bg-blue-500",
        primaryBtnLabel: "Get Started",
        headerBg: "bg-[#071739]",
        headerBorder: "border-blue-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Features", target: "#features" },
          { label: "Overview", target: "#overview" },
          { label: "Pricing", target: "#pricing" },
          { label: "Connect", target: "#connect" },
          { label: "About", target: "#about" }
        ]
      };
    }

    const id = sw.id.toLowerCase();
    const name = sw.name.toLowerCase();

    // 1. Fitness Zone
    if (id === "fitness" || id.includes("fit") || name.includes("fitness")) {
      return {
        shortName: "C Vidya Fitness Zone",
        icon: Dumbbell,
        badgeBg: "bg-blue-600",
        badgeShadow: "shadow-blue-600/30",
        backBtnBg: "bg-blue-600",
        backBtnHover: "hover:bg-blue-500",
        titleGradient: "from-white via-blue-200 to-white",
        navHoverText: "hover:text-blue-400",
        primaryBtnBg: "bg-blue-600",
        primaryBtnHover: "hover:bg-blue-500",
        primaryBtnLabel: "Get Started",
        headerBg: "bg-white",
        headerBorder: "border-slate-200",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Features", target: "#features" },
          { label: "Shop", target: "#shop" },
          { label: "Tips", target: "#tips" },
          { label: "Price", target: "#pricing" },
          { label: "Connect", target: "#partner-inquiry" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 2. Petrol Pump Suite
    if (id === "petrol-pump" || id.includes("petrol") || id.includes("fuel") || name.includes("petrol")) {
      return {
        shortName: "Vidya Petrol Pump Suite",
        icon: Fuel,
        badgeBg: "bg-orange-600",
        badgeShadow: "shadow-orange-600/30",
        backBtnBg: "bg-orange-600",
        backBtnHover: "hover:bg-orange-500",
        titleGradient: "from-white via-orange-200 to-white",
        navHoverText: "hover:text-orange-400",
        primaryBtnBg: "bg-orange-600",
        primaryBtnHover: "hover:bg-orange-500",
        primaryBtnLabel: "Shift Console",
        headerBg: "bg-[#140802]",
        headerBorder: "border-orange-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Dispensers", target: "#dispensers" },
          { label: "Dip Tanks", target: "#tanks" },
          { label: "Shift Settlement", target: "#shifts" },
          { label: "Fleet Ledger", target: "#fleet" },
          { label: "GST Billing", target: "#billing" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 3. Library Management
    if (id === "library" || id.includes("book") || name.includes("library")) {
      return {
        shortName: "C Vidya Library Management",
        icon: BookOpen,
        badgeBg: "bg-emerald-600",
        badgeShadow: "shadow-emerald-600/30",
        backBtnBg: "bg-emerald-600",
        backBtnHover: "hover:bg-emerald-500",
        titleGradient: "from-white via-emerald-200 to-white",
        navHoverText: "hover:text-emerald-400",
        primaryBtnBg: "bg-emerald-600",
        primaryBtnHover: "hover:bg-emerald-500",
        primaryBtnLabel: "Access Catalog",
        headerBg: "bg-[#03130a]",
        headerBorder: "border-emerald-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Catalog", target: "#catalog" },
          { label: "Members", target: "#members" },
          { label: "Circulation", target: "#circulation" },
          { label: "QR Passes", target: "#passes" },
          { label: "Overdue", target: "#overdue" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 4. Institutes Management
    if (id === "institutes" || id.includes("institute") || id.includes("school") || name.includes("institute")) {
      return {
        shortName: "C Vidya Institutes Management",
        icon: GraduationCap,
        badgeBg: "bg-blue-600",
        badgeShadow: "shadow-blue-600/30",
        backBtnBg: "bg-blue-600",
        backBtnHover: "hover:bg-blue-500",
        titleGradient: "from-white via-blue-200 to-white",
        navHoverText: "hover:text-blue-400",
        primaryBtnBg: "bg-blue-600",
        primaryBtnHover: "hover:bg-blue-500",
        primaryBtnLabel: "Join Waitlist",
        headerBg: "bg-[#071329]",
        headerBorder: "border-blue-900/60",
        navLinks: [
          { label: "Overview", target: "#overview" },
          { label: "Admissions", target: "#admissions" },
          { label: "Fees Ledger", target: "#fees" },
          { label: "Gradebook", target: "#gradebook" },
          { label: "Bus GPS", target: "#bus" },
          { label: "Parent Portal", target: "#parents" },
          { label: "Roadmap", target: "#roadmap" }
        ]
      };
    }

    // 5. Coaching Management
    if (id === "coaching" || id.includes("coach") || id.includes("academy") || name.includes("coaching")) {
      return {
        shortName: "C Vidya Coaching Management",
        icon: Award,
        badgeBg: "bg-purple-600",
        badgeShadow: "shadow-purple-600/30",
        backBtnBg: "bg-purple-600",
        backBtnHover: "hover:bg-purple-500",
        titleGradient: "from-white via-purple-200 to-white",
        navHoverText: "hover:text-purple-400",
        primaryBtnBg: "bg-purple-600",
        primaryBtnHover: "hover:bg-purple-500",
        primaryBtnLabel: "Enrollment Demo",
        headerBg: "bg-[#0f051a]",
        headerBorder: "border-purple-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Batches", target: "#batches" },
          { label: "Students", target: "#students" },
          { label: "OMR Mock Tests", target: "#omr" },
          { label: "SMS Broadcasts", target: "#sms" },
          { label: "Timetables", target: "#schedules" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 6. AgriFusion (Farming)
    if (id === "farming" || id.includes("agri") || id.includes("farm") || name.includes("agri")) {
      return {
        shortName: "AgriFusion Platform",
        icon: Sprout,
        badgeBg: "bg-green-600",
        badgeShadow: "shadow-green-600/30",
        backBtnBg: "bg-green-600",
        backBtnHover: "hover:bg-green-500",
        titleGradient: "from-white via-green-200 to-white",
        navHoverText: "hover:text-green-400",
        primaryBtnBg: "bg-green-600",
        primaryBtnHover: "hover:bg-green-500",
        primaryBtnLabel: "Launch Farm ERP",
        headerBg: "bg-[#051409]",
        headerBorder: "border-green-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Livestock", target: "#livestock" },
          { label: "Fishery Ponds", target: "#fishery" },
          { label: "POS Billing", target: "#pos" },
          { label: "Feed Inventory", target: "#inventory" },
          { label: "Soil IoT", target: "#iot" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 7. Jewelry Management
    if (id === "members" || id.includes("jewel") || id.includes("gold") || name.includes("jewelry")) {
      return {
        shortName: "C Vidya Jewelry Management",
        icon: Gem,
        badgeBg: "bg-amber-600",
        badgeShadow: "shadow-amber-600/30",
        backBtnBg: "bg-amber-600",
        backBtnHover: "hover:bg-amber-500",
        titleGradient: "from-white via-amber-200 to-white",
        navHoverText: "hover:text-amber-400",
        primaryBtnBg: "bg-amber-600",
        primaryBtnHover: "hover:bg-amber-500",
        primaryBtnLabel: "Access Ledger",
        headerBg: "bg-[#160e02]",
        headerBorder: "border-amber-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Bullion Rates", target: "#rates" },
          { label: "Inventory Weight", target: "#inventory" },
          { label: "Karigar Orders", target: "#karigar" },
          { label: "GST Invoicing", target: "#gst" },
          { label: "Catalog", target: "#catalog" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 8. Enterprise CRM
    if (id === "crm" || id.includes("crm") || name.includes("crm")) {
      return {
        shortName: "C Vidya Enterprise CRM",
        icon: Target,
        badgeBg: "bg-cyan-600",
        badgeShadow: "shadow-cyan-600/30",
        backBtnBg: "bg-cyan-600",
        backBtnHover: "hover:bg-cyan-500",
        titleGradient: "from-white via-cyan-200 to-white",
        navHoverText: "hover:text-cyan-400",
        primaryBtnBg: "bg-cyan-600",
        primaryBtnHover: "hover:bg-cyan-500",
        primaryBtnLabel: "Start Free Trial",
        headerBg: "bg-[#041217]",
        headerBorder: "border-cyan-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Pipeline", target: "#pipeline" },
          { label: "Leads", target: "#leads" },
          { label: "Deals Funnel", target: "#deals" },
          { label: "VoIP Logs", target: "#voip" },
          { label: "Quotes", target: "#quotes" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 9. Care Plus Healthcare
    if (id === "care-plus" || id.includes("health") || id.includes("care") || name.includes("healthcare") || name.includes("care")) {
      return {
        shortName: "Care Plus Healthcare",
        icon: HeartPulse,
        badgeBg: "bg-rose-600",
        badgeShadow: "shadow-rose-600/30",
        backBtnBg: "bg-rose-600",
        backBtnHover: "hover:bg-rose-500",
        titleGradient: "from-white via-rose-200 to-white",
        navHoverText: "hover:text-rose-400",
        primaryBtnBg: "bg-rose-600",
        primaryBtnHover: "hover:bg-rose-500",
        primaryBtnLabel: "Patient Desk",
        headerBg: "bg-[#120407]",
        headerBorder: "border-rose-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "OPD/IPD", target: "#opd" },
          { label: "Doctor Roster", target: "#doctors" },
          { label: "EHR Prescriptions", target: "#ehr" },
          { label: "Pharmacy POS", target: "#pharmacy" },
          { label: "Lab Diagnostic", target: "#lab" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 10. PDF & Media Tools
    if (id === "pdf-media-tools" || id === "pdf-tools" || id.includes("pdf") || name.includes("pdf")) {
      return {
        shortName: "C Vidya PDF & Media Tools",
        icon: FileText,
        badgeBg: "bg-indigo-600",
        badgeShadow: "shadow-indigo-600/30",
        backBtnBg: "bg-indigo-600",
        backBtnHover: "hover:bg-indigo-500",
        titleGradient: "from-white via-indigo-200 to-white",
        navHoverText: "hover:text-indigo-400",
        primaryBtnBg: "bg-indigo-600",
        primaryBtnHover: "hover:bg-indigo-500",
        primaryBtnLabel: "Launch Web Tools",
        headerBg: "bg-[#080a18]",
        headerBorder: "border-indigo-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Merge PDF", target: "#merge" },
          { label: "Compress", target: "#compress" },
          { label: "OCR Scanner", target: "#ocr" },
          { label: "Watermark", target: "#watermark" },
          { label: "Media Convert", target: "#convert" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 11. AI Social Media Agent
    if (id === "ai-social" || id.includes("social") || name.includes("social")) {
      return {
        shortName: "C Vidya AI Social Agent",
        icon: Megaphone,
        badgeBg: "bg-fuchsia-600",
        badgeShadow: "shadow-fuchsia-600/30",
        backBtnBg: "bg-fuchsia-600",
        backBtnHover: "hover:bg-fuchsia-500",
        titleGradient: "from-white via-fuchsia-200 to-white",
        navHoverText: "hover:text-fuchsia-400",
        primaryBtnBg: "bg-fuchsia-600",
        primaryBtnHover: "hover:bg-fuchsia-500",
        primaryBtnLabel: "Launch AI Agent",
        headerBg: "bg-[#140416]",
        headerBorder: "border-fuchsia-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Content Studio", target: "#studio" },
          { label: "Multi-Post", target: "#post" },
          { label: "Viral Trends", target: "#trends" },
          { label: "Auto DMs", target: "#dms" },
          { label: "Analytics", target: "#analytics" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 12. AI Support Agent
    if (id === "ai-support" || id.includes("support") || name.includes("support")) {
      return {
        shortName: "C Vidya AI Support Agent",
        icon: Headphones,
        badgeBg: "bg-sky-600",
        badgeShadow: "shadow-sky-600/30",
        backBtnBg: "bg-sky-600",
        backBtnHover: "hover:bg-sky-500",
        titleGradient: "from-white via-sky-200 to-white",
        navHoverText: "hover:text-sky-400",
        primaryBtnBg: "bg-sky-600",
        primaryBtnHover: "hover:bg-sky-500",
        primaryBtnLabel: "Start AI Session",
        headerBg: "bg-[#04121d]",
        headerBorder: "border-sky-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "Neural RAG", target: "#rag" },
          { label: "Live Queue", target: "#queue" },
          { label: "Knowledge Base", target: "#kb" },
          { label: "Omnichannel", target: "#omnichannel" },
          { label: "CSAT Scores", target: "#csat" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 13. AI SalesFlow Agent
    if (id === "ai-salesflow" || id.includes("salesflow") || name.includes("salesflow")) {
      return {
        shortName: "C Vidya SalesFlow AI",
        icon: TrendingUp,
        badgeBg: "bg-emerald-600",
        badgeShadow: "shadow-emerald-600/30",
        backBtnBg: "bg-emerald-600",
        backBtnHover: "hover:bg-emerald-500",
        titleGradient: "from-white via-emerald-200 to-white",
        navHoverText: "hover:text-emerald-400",
        primaryBtnBg: "bg-emerald-600",
        primaryBtnHover: "hover:bg-emerald-500",
        primaryBtnLabel: "Run Sales SDR",
        headerBg: "bg-[#03140b]",
        headerBorder: "border-emerald-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "B2B Leads", target: "#leads" },
          { label: "Sequences", target: "#sequences" },
          { label: "Intent Score", target: "#intent" },
          { label: "Book Demos", target: "#demos" },
          { label: "CRM Sync", target: "#crm" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // 14. AI Marketing Agent
    if (id === "ai-marketing" || id.includes("market") || name.includes("marketing")) {
      return {
        shortName: "C Vidya AI Marketing",
        icon: Sparkles,
        badgeBg: "bg-violet-600",
        badgeShadow: "shadow-violet-600/30",
        backBtnBg: "bg-violet-600",
        backBtnHover: "hover:bg-violet-500",
        titleGradient: "from-white via-violet-200 to-white",
        navHoverText: "hover:text-violet-400",
        primaryBtnBg: "bg-violet-600",
        primaryBtnHover: "hover:bg-violet-500",
        primaryBtnLabel: "Growth Engine",
        headerBg: "bg-[#0d051c]",
        headerBorder: "border-violet-900/60",
        navLinks: [
          { label: "Home", target: "/" },
          { label: "SEO Clusters", target: "#seo" },
          { label: "Inbound Funnels", target: "#funnels" },
          { label: "Campaigns", target: "#campaigns" },
          { label: "A/B Copy", target: "#copy" },
          { label: "CAC Metrics", target: "#metrics" },
          { label: "About", target: "#about" }
        ]
      };
    }

    // Default configuration for any other software or service
    return {
      shortName: sw.name,
      icon: Sparkles,
      badgeBg: "bg-blue-600",
      badgeShadow: "shadow-blue-600/30",
      backBtnBg: "bg-blue-600",
      backBtnHover: "hover:bg-blue-500",
      titleGradient: "from-white via-blue-200 to-white",
      navHoverText: "hover:text-blue-400",
      primaryBtnBg: "bg-blue-600",
      primaryBtnHover: "hover:bg-blue-500",
      primaryBtnLabel: "Get Started",
      headerBg: "bg-[#071739]",
      headerBorder: "border-blue-900/60",
      navLinks: [
        { label: "Home", target: "/" },
        { label: "Features", target: "#features" },
        { label: "Overview", target: "#overview" },
        { label: "Pricing", target: "#pricing" },
        { label: "Connect", target: "#connect" },
        { label: "About", target: "#about" }
      ]
    };
  };

  const currentConfig = useMemo(() => getSoftwareConfig(software), [software]);
  const BrandIcon = currentConfig.icon;

  const handleReloadSoftware = () => {
    setIframeKey((prev) => prev + 1);
    setIframeLoaded(false);
    setIframeError(false);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setIsWaitlistSubmitted(true);
  };

  const institutesGallery = [
    {
      src: institutesComingSoonImg,
      badge: "Campus Operations Master Preview",
      title: "Interactive Campus ERP & Student Analytics Hub",
      desc: "Centralized intelligence portal covering multi-branch enrollments, smart automated fee collections, real-time bus GPS telemetry, and biometric attendance logs."
    },
    {
      src: institutesImg,
      badge: "Academic Ledger & Gradebook",
      title: "Automated CBSE / ICSE Exam & Report Card Generator",
      desc: "Instant digital gradebook reconciliation, automated homework diaries, faculty assignment matrix, and instant parent WhatsApp status notifications."
    }
  ];

  return (
    <div className="fixed inset-0 z-[9990] w-full h-full h-[100dvh] w-screen max-w-full bg-slate-950 text-white flex flex-col overflow-hidden animate-fadeIn">
      {/* Auto-Adjusting Sleek Arrow Back Button (Icon Only - Instant Step-by-Step Back Navigation) */}
      <div className="fixed top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 md:top-4 md:left-4 z-[9999] pointer-events-auto">
        <button
          type="button"
          onClick={handleBack}
          className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 ${currentConfig.backBtnBg} ${currentConfig.backBtnHover} active:scale-90 text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-xl hover:shadow-2xl cursor-pointer border border-white/25 shrink-0 backdrop-blur-md hover:scale-105`}
          title="Back to Preview Page"
          aria-label="Back to Preview Page"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
        </button>
      </div>

      {/* Auto-Adjusting Sleek Close Button (Icon Only - Responsive Corner Placement) */}
      <div className="fixed top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 md:top-4 md:right-4 z-[9999] pointer-events-auto">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 text-white bg-slate-900/90 hover:bg-slate-800 active:scale-90 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shadow-xl hover:shadow-2xl cursor-pointer border border-white/25 shrink-0 backdrop-blur-md hover:scale-105"
          title="Close software view"
          aria-label="Close software view"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Main Software Canvas Area: Full Screen with No Second Header */}
      <main className={`flex-1 w-full h-full relative bg-slate-950 flex flex-col min-h-0 min-w-0 ${isInstitutes ? "overflow-y-auto" : "overflow-hidden"}`}>
        {isInstitutes ? (
          /* Advanced High-Fidelity Coming Soon UI with Pictures & Feature Roadmap */
          <div className="w-full flex-1 pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* Top Announcement Banner */}
            <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto pt-2">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-amber-500/15 border-2 border-amber-400/60 text-amber-300 text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/15 backdrop-blur-md">
                <span className="relative flex h-3.5 w-3.5 sm:h-5 sm:w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-5 sm:w-5 bg-amber-400" />
                </span>
                <span>COMING SOON</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-tight">
                C Vidya Institutes Management
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                The modern cloud ERP engineered for schools, colleges, and multi-campus academies. 
                Manage admissions, automated fee cashbooks, biometric attendance, and student report cards seamlessly.
              </p>

              {/* Progress Tracker */}
              <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg mt-2">
                <div className="flex justify-between items-center text-xs text-slate-300 font-semibold mb-2">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deployment Status: Phase 3 Beta</span>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">88% Ready</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full w-[88%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                  <span>Architecture Validated</span>
                  <span>Campus Field Tests</span>
                  <span>Public Ingress</span>
                </div>
              </div>
            </div>

            {/* Pictures Showcase Section */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                    Official Software Architecture Gallery
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {institutesGallery[activePictureIndex].title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                    {institutesGallery[activePictureIndex].desc}
                  </p>
                </div>

                {/* Picture Selector Tabs */}
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-center">
                  {institutesGallery.map((pic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePictureIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activePictureIndex === idx
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span>Preview {idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Featured Image with Frame & Highlights */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
                <img
                  src={institutesGallery[activePictureIndex].src}
                  alt={institutesGallery[activePictureIndex].title}
                  className="w-full h-auto max-h-[520px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />

                {/* Image Overlay Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-white shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{institutesGallery[activePictureIndex].badge}</span>
                </div>

                <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-mono text-emerald-400 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>High-Fidelity ERP Mockup</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {institutesGallery.map((pic, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePictureIndex(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                      activePictureIndex === idx
                        ? "bg-blue-950/40 border-blue-500/80 shadow-md ring-1 ring-blue-500/40"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                    }`}
                  >
                    <img
                      src={pic.src}
                      alt={pic.title}
                      className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-lg shrink-0 border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{pic.title}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{pic.desc}</div>
                      <span className="text-[10px] font-mono text-blue-400 font-semibold mt-1 inline-block">
                        Click to view preview
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Modules Bento Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span>Built-in Modules Available on Launch</span>
                </h3>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  Enterprise-Grade Multi-Tenant Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Student Admissions &amp; CRM</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Online registration forms, entrance exam allotments, verification checklists, and auto-generated student enrollment IDs.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Automated Fees &amp; Cashbooks</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Term billing schedules, UPI/card payment gateway, penalty calculations, and instant WhatsApp receipt dispatch.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Biometric &amp; RFID Attendance</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Hardware turnstile integrations, teacher attendance, period timetables, and automated SMS alerts to guardians for absent students.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Exams &amp; Gradebook Engine</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    CBSE, ICSE, and state-board compliant report cards, hall tickets, teacher grading portals, and rank list generators.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-3">
                    <Bus className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Live GPS School Bus Tracking</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Real-time vehicle map telemetry, driver roster management, geo-fence boarding alerts, and fuel consumption logs.
                  </p>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-3">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Parent &amp; Faculty Mobile Portal</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Dedicated mobile app for digital homework submission, event calendars, report downloads, and direct teacher queries.
                  </p>
                </div>
              </div>
            </div>

            {/* VIP Early Access Priority Form */}
            <div id="vip-waitlist-section" className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-900/50 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Exclusive Early Access Sandbox</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Get Notified When Institute Management Launches
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join 120+ educational institutions on the VIP waitlist to receive a complimentary 30-day campus trial and priority onboarding.
                </p>
              </div>

              <div className="w-full md:w-auto shrink-0 max-w-md">
                {isWaitlistSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">You're on the VIP waitlist!</p>
                      <p className="text-xs text-emerald-300 mt-0.5">We will notify your institute as soon as the live portal opens.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="School / College or Email..."
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 min-w-[240px]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
                    >
                      <span>Join Waitlist</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Bottom Return Action */}
            <div className="flex justify-center pb-8 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all border border-slate-700 cursor-pointer shadow-lg"
              >
                <ArrowRight className="w-4 h-4 rotate-180 text-blue-400" />
                <span>Return to C Vidya Solutions Products</span>
              </button>
            </div>

          </div>
        ) : software.externalLink ? (
          <div className="w-full h-full relative flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
            {/* Loading Indicator */}
            {!iframeLoaded && !iframeError && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-10">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-xs text-slate-400 font-mono">Loading {software.name} environment...</p>
              </div>
            )}

            {/* Error / Fallback Card */}
            {iframeError && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="max-w-md space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
                    <ExternalLink className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Live Application Ready</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This cloud software suite is hosted on a secure production worker environment.
                  </p>
                  <a
                    href={software.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                  >
                    <span>Launch {software.name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Embedded Live Web Application with Full Mobile & Desktop Responsive Support */}
            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={effectiveIframeSrc}
              title={software.name}
              onLoad={() => setIframeLoaded(true)}
              onError={() => {
                setIframeLoaded(true);
                setIframeError(true);
              }}
              allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; display-capture; encrypted-media; fullscreen; geolocation; gyroscope; identity-credentials-get; microphone; payment; picture-in-picture; publickey-credentials-get; storage-access; web-share; browsing-topics;"
              className="w-full h-full flex-1 border-none bg-slate-950 min-h-0 min-w-0 block"
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          </div>
        ) : (
          /* Clean Production Fallback when externalLink is absent or loading */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-4">
              <div className={`w-16 h-16 rounded-2xl ${currentConfig.badgeBg} flex items-center justify-center mx-auto shadow-lg ${currentConfig.badgeShadow}`}>
                <BrandIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{software.name}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {software.description}
              </p>
              {software.externalLink ? (
                <a
                  href={software.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 ${currentConfig.primaryBtnBg} ${currentConfig.primaryBtnHover} text-white rounded-xl text-xs font-bold shadow-lg transition-all`}
                >
                  <span>Launch {software.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Products</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
