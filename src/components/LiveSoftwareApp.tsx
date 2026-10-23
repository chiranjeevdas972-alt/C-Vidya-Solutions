import React, { useState, useEffect, useMemo, useRef } from "react";
import { ProductService } from "../types";
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

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface LiveSoftwareAppProps {
  software: ProductService | null;
  onClose: () => void;
}

export default function LiveSoftwareApp({ software, onClose }: LiveSoftwareAppProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const [iframeKey, setIframeKey] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isInstitutes = 
    software?.id?.toLowerCase() === "institutes" || 
    software?.id?.toLowerCase() === "institutes-management" ||
    software?.id?.toLowerCase()?.includes("institute") || 
    software?.name?.toLowerCase()?.includes("institute");

  // State for Institutes Early Access Beta waitlist registration
  const [instituteLeadName, setInstituteLeadName] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [instituteEmail, setInstituteEmail] = useState("");
  const [institutePhone, setInstitutePhone] = useState("");
  const [instituteStudents, setInstituteStudents] = useState("250 - 1,000 students");
  const [instituteSubmitted, setInstituteSubmitted] = useState(false);
  const [instituteSubmitting, setInstituteSubmitting] = useState(false);

  const handleInstituteNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutePhone && !instituteEmail) return;
    setInstituteSubmitting(true);
    try {
      try {
        const inquiriesCol = collection(db, "inquiries");
        await addDoc(inquiriesCol, {
          name: instituteLeadName.trim() || instituteName.trim() || "Institute Administrator",
          email: instituteEmail.trim() || "institutes-early-access@cvidya.com",
          phone: institutePhone.trim(),
          service: "C Vidya Institutes Management (Coming Soon Early Access)",
          message: `Institution: ${instituteName.trim()} | Size: ${instituteStudents} | Early access request`,
          timestamp: new Date().toISOString(),
          status: "pending_review"
        });
      } catch (fbErr) {
        console.warn("Firestore save fallback:", fbErr);
      }
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: instituteLeadName.trim() || instituteName.trim() || "Institute Administrator",
          email: instituteEmail.trim() || "institutes-early-access@cvidya.com",
          phone: institutePhone.trim(),
          service: "C Vidya Institutes Management (Coming Soon Early Access)",
          message: `Institution: ${instituteName.trim()} | Size: ${instituteStudents} | Early access request`
        })
      }).catch(() => {});
      setInstituteSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setInstituteSubmitting(false);
    }
  };

  // Direct local routes for full SaaS apps (Library, Fitness, Petrol Pump, PDF Tools), ensuring seamless same-origin step-by-step navigation
  const effectiveIframeSrc = useMemo(() => {
    if (!software?.externalLink) return "";
    const id = software.id.toLowerCase();
    if (id === "library" || software.externalLink.includes("v.cvidyasolutions") || software.externalLink.includes("library")) {
      return "/software/library/index.html";
    }
    if (id === "fitness" || software.externalLink.includes("fitzone") || software.externalLink.includes("fitness")) {
      return "/software/fitness/index.html";
    }
    if (id === "petrol-pump" || software.externalLink.includes("c-vidya-cloud-petrol-pump") || software.externalLink.includes("petrol")) {
      return "/software/petrol-pump/index.html";
    }
    if (id === "pdf-media-tools" || id === "pdf-tools" || software.externalLink.includes("c-vidya-pdf-saas-tools") || software.externalLink.includes("pdf")) {
      return "/software/pdf-tools/index.html";
    }
    if (id === "farming" || id === "agrifusion" || software.externalLink.includes("fresh.cvidyasolutions")) {
      return "https://fresh.cvidyasolutions.workers.dev/";
    }
    // For all AI agents and other SaaS products, load live software link
    return software.externalLink;
  }, [software]);

  useEffect(() => {
    if (software) {
      document.body.style.overflow = "hidden";
      // Open immediately with zero artificial delay
      const id = software.id.toLowerCase();
      const isLocal = id === "library" || id === "fitness" || id === "petrol-pump" || id === "pdf-media-tools" || id === "pdf-tools";
      setIframeLoaded(isLocal);
      setIframeError(false);
      setIframeKey((k) => k + 1);

      // Instant reveal timer in 100ms max for remote links so the software canvas is always active
      const fastRevealTimer = setTimeout(() => {
        setIframeLoaded(true);
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(fastRevealTimer);
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
      id === "library" ||
      id === "fitness" ||
      id === "petrol-pump" ||
      id === "pdf-media-tools" ||
      id === "pdf-tools"
    );
  }, [software]);



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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9990] w-full h-full h-[100dvh] w-screen max-w-full bg-slate-950 text-white flex flex-col overflow-hidden animate-fadeIn">
      {/* Main Software Canvas Area: Full Screen */}
      <main className="flex-1 w-full h-full relative bg-slate-950 flex flex-col min-h-0 min-w-0 overflow-hidden">
        {isInstitutes ? (
          /* ================================================================= */
          /* DEDICATED FULL-SCREEN COMING SOON PAGE FOR C VIDYA INSTITUTES    */
          /* ================================================================= */
          <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-[#061024] via-slate-950 to-slate-950 text-white flex flex-col items-center justify-start p-4 sm:p-8 animate-fadeIn">
            {/* Top Bar */}
            <div className="w-full max-w-5xl flex items-center justify-between pb-6 border-b border-blue-900/40 mb-8 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-sm sm:text-base text-white tracking-wide">
                    C VIDYA INSTITUTES MANAGEMENT
                  </h2>
                </div>
              </div>
            </div>

            {/* Main Coming Soon Presentation */}
            <div className="w-full max-w-4xl space-y-8 text-center pb-16">
              
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold font-mono tracking-wider uppercase shadow-lg shadow-amber-500/10">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>COMING SOON</span>
              </div>

              {/* Big Title & Description */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  C VIDYA INSTITUTES MANAGEMENT
                </h1>
                <p className="text-base sm:text-xl text-blue-200/90 font-medium max-w-2xl mx-auto">
                  All-in-One Multi-Branch Campus Administration, Student Admissions &amp; Smart Fee Portal
                </p>
                <p className="text-xs sm:text-sm text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Our comprehensive Institutional ERP suite is currently in final QA testing and multi-campus sync optimization. It is scheduled for release following complete security auditing.
                </p>
              </div>

              {/* Planned Module Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left pt-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Admissions CRM</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">End-to-end student counseling pipeline, digital document verification, and seat locking.</p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Fee Cashbooks &amp; Ledgers</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Multi-term fee collection, automated WhatsApp receipts, and instant daily bank reconciliation.</p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">CBSE/ICSE Gradebook</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Standard marksheet compilation, automated report cards, and academic ranking analytics.</p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                    <Bus className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">GPS School Bus Tracking</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Live vehicle telemetry, route optimization, driver rosters, and parent arrival notifications.</p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Parent Portal &amp; Alerts</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Real-time attendance logs, homework feeds, and official circular broadcasts on mobile.</p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-blue-500/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">Multi-Campus Governance</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Centralized director dashboard with branch-level P&amp;L, staff rosters, and compliance audits.</p>
                </div>
              </div>

              {/* Early Access Waitlist Form */}
              <div className="pt-4 max-w-xl mx-auto text-left">
                <div className="bg-white/5 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-5">
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-lg sm:text-xl text-white">
                      Register for Early Beta Access
                    </h3>
                    <p className="text-xs text-slate-300">
                      Be among the first schools and colleges to deploy C Vidya Institutes Management with dedicated onboarding.
                    </p>
                  </div>

                  {instituteSubmitted ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2 animate-fadeIn">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <p className="text-sm font-bold text-emerald-300">You are registered for Early Access!</p>
                      <p className="text-xs text-slate-300">Our engineering desk will contact you with deployment details as soon as beta slots open.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleInstituteNotifySubmit} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. St. Xavier's Academy"
                            value={instituteName}
                            onChange={(e) => setInstituteName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Principal / Director"
                            value={instituteLeadName}
                            onChange={(e) => setInstituteLeadName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / WhatsApp Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +91 98765 43210"
                            value={institutePhone}
                            onChange={(e) => setInstitutePhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address</label>
                          <input
                            type="email"
                            placeholder="contact@school.edu.in"
                            value={instituteEmail}
                            onChange={(e) => setInstituteEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Student Enrollment Scale</label>
                        <select
                          value={instituteStudents}
                          onChange={(e) => setInstituteStudents(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="Under 250 students">Under 250 students</option>
                          <option value="250 - 1,000 students">250 - 1,000 students</option>
                          <option value="1,000 - 3,000 students">1,000 - 3,000 students</option>
                          <option value="3,000+ students (Multi-branch campus)">3,000+ students (Multi-branch campus)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={instituteSubmitting}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {instituteSubmitting ? "Submitting Registration..." : "Request Priority Early Access"}
                      </button>
                    </form>
                  )}
                </div>
              </div>



            </div>
          </div>
        ) : software?.externalLink ? (
          <div className="w-full h-full relative flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
            {/* Non-blocking top progress bar while frame streams */}
            {!iframeLoaded && !iframeError && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/20 z-20 overflow-hidden pointer-events-none">
                <div className="h-full bg-blue-500 animate-pulse w-full" />
              </div>
            )}

            {/* Error / Fallback Card */}
            {iframeError && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="max-w-md space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Live Application Loading Notice</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Connecting to {software.name} environment. Click below to reload or return to the website.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleReloadSoftware}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reload Application</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Preview Page</span>
                    </button>
                  </div>
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
              <h3 className="text-xl font-bold text-white">{software?.name}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {software?.description}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Preview Page</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
