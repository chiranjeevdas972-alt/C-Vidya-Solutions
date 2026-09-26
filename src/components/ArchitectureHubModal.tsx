import React, { useState } from "react";
import { 
  X, 
  FileText, 
  Layers, 
  GitBranch, 
  Palette, 
  Database, 
  CheckSquare, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Key, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Code2, 
  Smartphone, 
  Server, 
  Cloud, 
  Globe, 
  Sparkles, 
  CreditCard, 
  Bell, 
  Settings, 
  UserCheck, 
  Home, 
  FolderGit2, 
  ListPlus, 
  Bot,
  RefreshCw,
  Search
} from "lucide-react";

interface ArchitectureHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "prd" | "trd" | "flow" | "uiux" | "schema" | "plan";
  onTriggerSessionExpired?: () => void;
}

export default function ArchitectureHubModal({
  isOpen,
  onClose,
  initialTab = "prd",
  onTriggerSessionExpired
}: ArchitectureHubModalProps) {
  const [activeTab, setActiveTab] = useState<"prd" | "trd" | "flow" | "uiux" | "schema" | "plan">(initialTab);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // App Flow Interactive Journey state (10 Screens from diagram)
  const [currentJourneyStep, setCurrentJourneyStep] = useState<number>(1);
  const [authMode, setAuthMode] = useState<"new" | "returning">("new");
  const [taskInput, setTaskInput] = useState<string>("Deploy Municipal Water SCADA Node");
  const [selectedPlanTier, setSelectedPlanTier] = useState<"starter" | "business" | "enterprise">("business");
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  // DB Schema Active Entity Tab
  const [selectedEntity, setSelectedEntity] = useState<string>("inquiries");

  // Implementation Plan Filter
  const [planFilter, setPlanFilter] = useState<"all" | "completed" | "in-progress">("all");

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const navTabs = [
    { id: "prd", label: "1. PRD: Features", icon: FileText, desc: "What it does & core capabilities" },
    { id: "trd", label: "2. TRD: Tech & APIs", icon: Layers, desc: "Tech stacks & API specifications" },
    { id: "flow", label: "3. App Flow: Journey", icon: GitBranch, desc: "10-screen user journey & navigation" },
    { id: "uiux", label: "4. UI/UX: Design", icon: Palette, desc: "Typography scales & color swatches" },
    { id: "schema", label: "5. DB Schema & ERD", icon: Database, desc: "Tables, collections & relations" },
    { id: "plan", label: "6. Build Plan", icon: CheckSquare, desc: "Implementation order & verification" },
  ] as const;

  // 10 Key screens defined in the screenshot
  const journeyScreens = [
    { 
      step: 1, 
      id: "welcome", 
      title: "1. Welcome / Onboarding", 
      subtitle: "First Touchpoint", 
      icon: Home,
      desc: "User lands on C Vidya Solutions portal. Value propositions displayed with clear CTA to explore products or sign in."
    },
    { 
      step: 2, 
      id: "auth", 
      title: "2. Sign Up / Login", 
      subtitle: "Identity Gate", 
      icon: UserCheck,
      desc: "Smart authentication switch: New user routes to onboarding questionnaire; returning user signs into enterprise console."
    },
    { 
      step: 3, 
      id: "dashboard", 
      title: "3. Dashboard", 
      subtitle: "Operational Hub", 
      icon: Cpu,
      desc: "Central business cockpit displaying active SaaS subscriptions, telemetry health, lead pipeline metrics, and system notices."
    },
    { 
      step: 4, 
      id: "project_detail", 
      title: "4. Project / Product Detail", 
      subtitle: "Deep-Dive View", 
      icon: FolderGit2,
      desc: "Detailed architectural breakdown of selected SaaS suites (Fitness Zone, Library Cloud, CRM) with live sandbox launchers."
    },
    { 
      step: 5, 
      id: "create_task", 
      title: "5. Create New Task / Quote", 
      subtitle: "Work Requisition", 
      icon: ListPlus,
      desc: "Interactive requisition builder for deployment tasks, SLA custom orders, callback leads, and technical consults."
    },
    { 
      step: 6, 
      id: "ai_assistant", 
      title: "6. AI Assistant", 
      subtitle: "Autonomous Logic", 
      icon: Bot,
      desc: "Embedded Gemini-powered conversational agent assisting with pricing, technical compatibility, and rapid RFP answers."
    },
    { 
      step: 7, 
      id: "notifications", 
      title: "7. Notifications", 
      subtitle: "Real-time Pulse", 
      icon: Bell,
      desc: "Live stream of application events: callback assigned, quotation generated, software release updates, and SLA alerts."
    },
    { 
      step: 8, 
      id: "settings", 
      title: "8. Settings", 
      subtitle: "Governance & Profile", 
      icon: Settings,
      desc: "Enterprise organization configuration, API tokens, RBAC member management, data portability exports, and dark theme."
    },
    { 
      step: 9, 
      id: "payment", 
      title: "9. Payment / Upgrade", 
      subtitle: "Monetization Gateway", 
      icon: CreditCard,
      desc: "Tiered SaaS subscription checkout with GST invoice calculation, instant sandbox provisioning, and payment ledger."
    },
    { 
      step: 10, 
      id: "success", 
      title: "10. Success / Confirmation", 
      subtitle: "State Finalization", 
      icon: CheckCircle2,
      desc: "Transaction finalized. License keys dispatched, audit log saved to Firestore, and direct return to business console."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" 
      />

      <div className="relative bg-white w-full max-w-7xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[960px] border border-slate-200 font-sans z-10 animate-fade-in text-slate-900">
        
        {/* Header Bar */}
        <div className="bg-[#071739] px-4 sm:px-6 py-3.5 border-b border-blue-900/60 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm sm:text-base tracking-tight text-white">
                  C Vidya Solutions • Architecture &amp; Engineering Center
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                  6 Core Pillars Verified
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 leading-none mt-0.5">
                Official PRD, TRD, 10-Screen App Flow, UI/UX System, DB Schema, and Build Plan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {navTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">

          {/* ========================================================================= */}
          {/* 1. PRD (PRODUCT REQUIREMENTS DOCUMENT)                                    */}
          {/* ========================================================================= */}
          {activeTab === "prd" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                      Document Type: PRD v2.4 (Approved)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Product Requirements Document: C Vidya Solutions Enterprise Suite
                    </h2>
                  </div>
                  <button
                    onClick={() => handleCopy("C Vidya Solutions Enterprise PRD v2.4 - Full spec available at https://cvidyasolutions.com", "prd-copy")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copiedToken === "prd-copy" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken === "prd-copy" ? "Copied" : "Copy Spec"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-1">Company &amp; Mission</span>
                    <p className="text-slate-600 leading-relaxed">
                      C Vidya Solutions is a software house headquartered in Dhanbad, Jharkhand, pioneering multi-tenant SaaS systems, civic automation pipelines, and autonomous AI agents.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-1">Target Personas</span>
                    <p className="text-slate-600 leading-relaxed">
                      Academic Administrators, Gym &amp; Fitness Center Owners, Public Municipal Authorities, Cooperative Credit Managers, and Enterprise Operations Leads.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-1">SLA &amp; Compliance Target</span>
                    <p className="text-slate-600 leading-relaxed">
                      99.95% Availability, Sub-100ms client interactions, ISO 27001 zero-trust data segregation, and DPDP/GDPR user data portability compliance.
                    </p>
                  </div>
                </div>
              </div>

              {/* 7 SaaS Products & 4 AI Agents Feature Matrix */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span>Flagship SaaS Product Suite: Core Functional Requirements</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "1. C Vidya Fitness Zone",
                      type: "Gym & Health Club ERP",
                      features: ["Live interactive dashboard", "Member lifecycle & package tier selector", "Supplement shop with stock counters", "Biometric card scanner simulator", "GST invoice generation"]
                    },
                    {
                      name: "2. C Vidya Library Management",
                      type: "Circulation & ISBN Catalog",
                      features: ["Real-time barcode circulation", "Overdue fine recalculator", "Student ledger reconciliation", "Digital book catalog with search", "Self-checkout kiosk workflow"]
                    },
                    {
                      name: "3. Institutes & Coaching Portals",
                      type: "Academic ERP Suite",
                      features: ["Batch scheduler & student admission register", "Automated fee reminders via SMS/WhatsApp", "OMR bubble examination grading", "Report card generation", "Faculty attendance"]
                    },
                    {
                      name: "4. Enterprise CRM Suite",
                      type: "Pipeline & Lead Automation",
                      features: ["Multi-stage visual pipeline", "Callback queue & automated routing", "Call log timeline & transcript capture", "Conversion velocity metrics", "Team permissions"]
                    },
                    {
                      name: "5. AgriFusion Agribusiness",
                      type: "Farming & Mandi Logistics",
                      features: ["Crop inventory & cold storage ledger", "Mandi market live price scraper", "Farmer payment settlement batches", "Yield forecasting models", "Weather risk radar"]
                    },
                    {
                      name: "6. Municipal Civic Governance",
                      type: "Public Service Automation",
                      features: ["Citizen grievance ticket tracker", "Water supply SCADA sensor feeds", "Property tax self-assessment portal", "Ward-level resolution metrics", "Civic alerts"]
                    },
                    {
                      name: "7. Autonomous AI Agents Suite",
                      type: "Enterprise Intelligence",
                      features: ["CivicBot: Multilingual WhatsApp assistant", "LegalAI: Contract risk auditor", "OMR FastGrade: Camera bubble processor", "SupportSphere: 24/7 client triage"]
                    }
                  ].map((p, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">{p.type}</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {p.features.map((f, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. TRD (TECHNICAL REQUIREMENTS DOCUMENT)                                  */}
          {/* ========================================================================= */}
          {activeTab === "trd" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Architecture Overview */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                      Document Type: TRD v2.4 (Technical Architecture)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Technical Architecture, Tech Stack &amp; API Contracts
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>Frontend Client</span>
                    </div>
                    <p className="text-slate-600">React 19, TypeScript 5.8, Tailwind CSS v4, Motion, Lucide Icons, Vite 6 SPA bundling.</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <Server className="w-4 h-4 text-indigo-600" />
                      <span>Backend Gateway</span>
                    </div>
                    <p className="text-slate-600">Node.js Express Server with tsx execution, JSON 15MB payload buffers for PDF resumes.</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <Cloud className="w-4 h-4 text-emerald-600" />
                      <span>Persistence &amp; Auth</span>
                    </div>
                    <p className="text-slate-600">Google Cloud Firestore Enterprise Edition, Firebase Auth singleton, Zero-Trust rules.</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span>AI Inference Layer</span>
                    </div>
                    <p className="text-slate-600">@google/genai SDK server-side proxy route with fallback domain-knowledge engine.</p>
                  </div>
                </div>
              </div>

              {/* API Endpoints & Request/Response Contracts */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span>Production REST API Contracts &amp; Data Payloads</span>
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  {/* Endpoint 1 */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">POST</span>
                        <span className="font-bold text-slate-800">/api/chat</span>
                        <span className="text-[11px] text-slate-500 font-sans">Autonomous AI consultation inquiry</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Rate Limit: 60 req/min</span>
                    </div>
                    <div className="p-4 bg-slate-900 text-slate-200 space-y-2 text-[11px]">
                      <div className="text-slate-400">// Request Payload:</div>
                      <pre className="text-emerald-400">{JSON.stringify({ message: "What are the features of C Vidya Library SaaS?", history: [] }, null, 2)}</pre>
                      <div className="text-slate-400">// Response (200 OK):</div>
                      <pre className="text-blue-300">{JSON.stringify({ text: "C Vidya Library Management provides automated circulation, barcode scanner integration, overdue fine ledgers, and student card records.", model: "gemini-2.5-flash" }, null, 2)}</pre>
                    </div>
                  </div>

                  {/* Endpoint 2 */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">POST</span>
                        <span className="font-bold text-slate-800">/api/inquiries</span>
                        <span className="text-[11px] text-slate-500 font-sans">Enterprise callback request</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Validation: Strict regex</span>
                    </div>
                    <div className="p-4 bg-slate-900 text-slate-200 space-y-2 text-[11px]">
                      <div className="text-slate-400">// Request Payload:</div>
                      <pre className="text-emerald-400">{JSON.stringify({ name: "Rajesh Sharma", email: "rajesh@school.org", phone: "+91 98765 43210", service: "institutes", message: "Need coaching ERP demo for 1200 students" }, null, 2)}</pre>
                      <div className="text-slate-400">// Response (201 Created):</div>
                      <pre className="text-blue-300">{JSON.stringify({ success: true, inquiryId: "inq_98f7a210", savedToFirestore: true, message: "Inquiry logged successfully" }, null, 2)}</pre>
                    </div>
                  </div>

                  {/* Endpoint 3 */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">GET</span>
                        <span className="font-bold text-slate-800">/api/health</span>
                        <span className="text-[11px] text-slate-500 font-sans">System runtime diagnostics</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Public Check</span>
                    </div>
                    <div className="p-4 bg-slate-900 text-slate-200 space-y-2 text-[11px]">
                      <div className="text-slate-400">// Response (200 OK):</div>
                      <pre className="text-blue-300">{JSON.stringify({ status: "healthy", timestamp: new Date().toISOString(), database: "online", activeMicroApps: 2 }, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. APP FLOW & 10-SCREEN INTERACTIVE USER JOURNEY (FROM IMAGE)             */}
          {/* ========================================================================= */}
          {activeTab === "flow" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                      Document Type: App Flow &amp; User Journey Map
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      10 Key Screens, Navigation Rules, Primary Actions &amp; Edge Cases
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Direct architectural implementation of the blueprint: Welcome → Auth → Dashboard → Project Detail → Task → AI Assistant → Notifications → Settings → Payment → Success.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulatedOffline(!simulatedOffline)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        simulatedOffline 
                          ? "bg-amber-500 text-white border-amber-600" 
                          : "border-slate-300 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <WifiOff className="w-3.5 h-3.5" />
                      <span>{simulatedOffline ? "Offline Active" : "Test 'No Internet'"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("CV_TRIGGER_SESSION_EXPIRED"));
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Test 'Session Expired'</span>
                    </button>
                  </div>
                </div>

                {/* 10 Screen Visual Journey Selector Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 pt-2">
                  {journeyScreens.map((s) => {
                    const isSelected = currentJourneyStep === s.step;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => setCurrentJourneyStep(s.step)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-20 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-mono font-bold ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                            #{s.step}
                          </span>
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                        </div>
                        <div className="font-bold text-[11px] leading-tight line-clamp-2">
                          {s.title.split(". ")[1]}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Screen Preview Container */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold">
                        {currentJourneyStep}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-100">
                          {journeyScreens[currentJourneyStep - 1].title}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {journeyScreens[currentJourneyStep - 1].subtitle} • {journeyScreens[currentJourneyStep - 1].desc}
                        </p>
                      </div>
                    </div>

                    {/* Step Controls (Back / Next) */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentJourneyStep === 1}
                        onClick={() => setCurrentJourneyStep(prev => Math.max(1, prev - 1))}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-slate-300 cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        disabled={currentJourneyStep === 10}
                        onClick={() => setCurrentJourneyStep(prev => Math.min(10, prev + 1))}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-white cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Interactive Simulator for Selected Step */}
                  <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 text-xs text-slate-300 min-h-[160px] flex flex-col justify-center">
                    {currentJourneyStep === 1 && (
                      <div className="space-y-3 text-center py-2 max-w-lg mx-auto">
                        <div className="text-blue-400 font-mono text-[10px] uppercase font-bold tracking-widest">
                          STEP 1: WELCOME &amp; ONBOARDING
                        </div>
                        <h5 className="text-base font-bold text-white">
                          Empowering Institutes, Gyms, and Municipalities With Modern Software
                        </h5>
                        <p className="text-slate-400 text-xs">
                          Choose your organizational profile to personalize dashboard previews and security models.
                        </p>
                        <div className="flex justify-center gap-3 pt-2">
                          <button 
                            onClick={() => setCurrentJourneyStep(2)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold cursor-pointer"
                          >
                            Primary Action: [A] Get Started
                          </button>
                        </div>
                      </div>
                    )}

                    {currentJourneyStep === 2 && (
                      <div className="space-y-3 max-w-md mx-auto py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 font-mono text-[10px] uppercase font-bold">
                            STEP 2: SIGN UP / LOGIN (AUTH FLOW)
                          </span>
                          <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                            <button
                              onClick={() => setAuthMode("new")}
                              className={`px-2 py-0.5 rounded ${authMode === "new" ? "bg-blue-600 text-white" : "text-slate-400"}`}
                            >
                              New User
                            </button>
                            <button
                              onClick={() => setAuthMode("returning")}
                              className={`px-2 py-0.5 rounded ${authMode === "returning" ? "bg-blue-600 text-white" : "text-slate-400"}`}
                            >
                              Returning User
                            </button>
                          </div>
                        </div>

                        {authMode === "new" ? (
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                            <p className="text-emerald-400 font-semibold text-xs">➔ User is New → Route: Onboarding Wizard</p>
                            <input 
                              type="text" 
                              placeholder="Organization Name (e.g. DPS Dhanbad)" 
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" 
                              defaultValue="C Vidya Academy"
                            />
                            <button 
                              onClick={() => setCurrentJourneyStep(3)}
                              className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded cursor-pointer"
                            >
                              Complete Onboarding →
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                            <p className="text-blue-400 font-semibold text-xs">➔ User is Returning → Route: Direct Sign In</p>
                            <input 
                              type="email" 
                              placeholder="chiranjeevdas972@gmail.com" 
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white" 
                              defaultValue="chiranjeevdas972@gmail.com"
                            />
                            <button 
                              onClick={() => setCurrentJourneyStep(3)}
                              className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded cursor-pointer"
                            >
                              Authenticate &amp; Launch Console →
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {currentJourneyStep === 3 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 font-mono text-[10px] uppercase font-bold">
                            STEP 3: DASHBOARD (DASH DETAIL)
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400">Active Subscriptions</div>
                            <div className="text-xl font-bold text-white mt-1">3 Suites</div>
                            <div className="text-[10px] text-blue-400 mt-0.5">Fitness, Library, CRM</div>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400">Total Leads Ingested</div>
                            <div className="text-xl font-bold text-white mt-1">128 Enquiries</div>
                            <div className="text-[10px] text-emerald-400 mt-0.5">+14% this week</div>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-400">System Security Health</div>
                            <div className="text-xl font-bold text-emerald-400 mt-1">100% ABAC</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Zero-Trust Rules Active</div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={() => setCurrentJourneyStep(4)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Open Project → View Details
                          </button>
                        </div>
                      </div>
                    )}

                    {currentJourneyStep === 4 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 font-mono text-[10px] uppercase font-bold">
                            STEP 4: PROJECT / PRODUCT DETAIL (VIEW DETAILS)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                            Active Spec: C Vidya Fitness Zone
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Viewing architecture and live runtime for C Vidya Fitness Zone. High-availability container with embedded React Router, biometric card registration, and supplement shop inventory.
                        </p>
                        <div className="flex gap-2">
                          <a 
                            href="/software/fitness/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            <span>Open Live Micro-App Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button 
                            onClick={() => setCurrentJourneyStep(5)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Tap Project → Task Flow →
                          </button>
                        </div>
                      </div>
                    )}

                    {currentJourneyStep === 5 && (
                      <div className="space-y-3 max-w-lg mx-auto">
                        <span className="text-blue-400 font-mono text-[10px] uppercase font-bold block">
                          STEP 5: CREATE NEW TASK / QUOTATION
                        </span>
                        <div className="space-y-2">
                          <label className="text-[11px] text-slate-300">Requisition / Task Title</label>
                          <input 
                            type="text" 
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white" 
                          />
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[10px] text-slate-500 font-mono">Navigation Rules: Cancel / Reset, Submit / Save</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setTaskInput("")}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-xs cursor-pointer"
                            >
                              Reset
                            </button>
                            <button 
                              onClick={() => setCurrentJourneyStep(6)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer"
                            >
                              Primary Action: [B] Create Task
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentJourneyStep === 6 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 font-mono text-[10px] uppercase font-bold">
                            STEP 6: AI ASSISTANT (ASK → GET AI SUGGESTIONS)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                            Model: Gemini-2.5-Flash
                          </span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                          <div className="text-slate-400 font-mono text-[10px]">Prompt Request:</div>
                          <div className="text-white">&ldquo;How can I integrate biometric fingerprint punch records with student fee dues in C Vidya School ERP?&rdquo;</div>
                          <div className="text-slate-400 font-mono text-[10px] pt-1">AI Recommendation:</div>
                          <div className="text-emerald-300">&ldquo;Use the Biometric SCADA sync adapter on port 4370. Dues are linked dynamically via student UID and can trigger automatic parent notifications upon gate entry.&rdquo;</div>
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={() => setCurrentJourneyStep(7)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Receive Notifications Flow →
                          </button>
                        </div>
                      </div>
                    )}

                    {currentJourneyStep === 7 && (
                      <div className="space-y-3">
                        <span className="text-blue-400 font-mono text-[10px] uppercase font-bold block">
                          STEP 7: NOTIFICATIONS (STAY UPDATED IN REAL TIME)
                        </span>
                        <div className="space-y-2">
                          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>Inquiry #892 received: Dhanbad Public School requested 1000 OMR sheets.</span>
                            </div>
                            <span className="text-[10px] text-slate-500">2 min ago</span>
                          </div>
                          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-400" />
                              <span>Fitness Zone v2.4 released with updated GST invoice template.</span>
                            </div>
                            <span className="text-[10px] text-slate-500">1 hour ago</span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={() => setCurrentJourneyStep(8)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Configure Settings →
                          </button>
                        </div>
                      </div>
                    )}

                    {currentJourneyStep === 8 && (
                      <div className="space-y-3 max-w-md mx-auto">
                        <span className="text-blue-400 font-mono text-[10px] uppercase font-bold block">
                          STEP 8: SETTINGS (MANAGE PROFILE &amp; PREFERENCES)
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500">Primary Region</div>
                            <div className="font-semibold text-white">Asia-South (Mumbai)</div>
                          </div>
                          <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500">Audit Logging</div>
                            <div className="font-semibold text-emerald-400">Strict (GDPR Compliant)</div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={() => setCurrentJourneyStep(9)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Upgrade / Payment →
                          </button>
                        </div>
                      </div>
                    )}

                    {currentJourneyStep === 9 && (
                      <div className="space-y-3">
                        <span className="text-blue-400 font-mono text-[10px] uppercase font-bold block">
                          STEP 9: PAYMENT / UPGRADE (UPGRADE → PAYMENT FLOW)
                        </span>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {[
                            { id: "starter", name: "Starter", price: "₹2,499/mo", desc: "Single institute or gym" },
                            { id: "business", name: "Business Pro", price: "₹7,999/mo", desc: "Up to 5 campuses + AI" },
                            { id: "enterprise", name: "Enterprise", price: "Custom Quote", desc: "Municipal & state Gov" }
                          ].map((tier) => (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={() => setSelectedPlanTier(tier.id as any)}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                selectedPlanTier === tier.id 
                                  ? "bg-blue-600/30 border-blue-400 text-white ring-1 ring-blue-400" 
                                  : "bg-slate-900 border-slate-800 text-slate-300"
                              }`}
                            >
                              <div className="font-bold text-sm">{tier.name}</div>
                              <div className="text-xs text-blue-400 font-mono mt-0.5">{tier.price}</div>
                              <div className="text-[10px] text-slate-400 mt-1">{tier.desc}</div>
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={() => setCurrentJourneyStep(10)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Primary Action: [C] Save / Submit Payment →
                          </button>
                        </div>
                      </div>
                    )}

                    {currentJourneyStep === 10 && (
                      <div className="space-y-3 text-center py-2 max-w-lg mx-auto">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                          <Check className="w-5 h-5" />
                        </div>
                        <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-widest block">
                          STEP 10: SUCCESS / CONFIRMATION (SAVE → BUSINESS STORE)
                        </span>
                        <h5 className="text-base font-bold text-white">
                          Order Provisioned Successfully!
                        </h5>
                        <p className="text-slate-400 text-xs">
                          License token generated: <code className="text-blue-300 font-mono bg-slate-900 px-1 py-0.5 rounded">CV-PRO-2026-X992</code>. Software suite activated and synced with Firestore audit logs.
                        </p>
                        <div className="flex justify-center gap-2 pt-1">
                          <button 
                            onClick={() => setCurrentJourneyStep(3)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Return to Dashboard
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Core Pages, Navigation Rules, Primary Actions, Edge Cases Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1 text-xs">CORE PAGES</span>
                    <ul className="text-slate-600 space-y-1 text-[11px]">
                      <li>• 10 Key Defined Screens</li>
                      <li>• Logical Flow &amp; Linear Path</li>
                      <li>• Clear Visual Hierarchy</li>
                      <li>• Responsive Viewports</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1 text-xs">NAVIGATION RULES</span>
                    <ul className="text-slate-600 space-y-1 text-[11px]">
                      <li>• <strong>Back / Next:</strong> Preserves state</li>
                      <li>• <strong>Cancel / Reset:</strong> Clean teardown</li>
                      <li>• <strong>Submit / Save:</strong> Atomic commit</li>
                      <li>• <strong>History Stack:</strong> Popstate guards</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1 text-xs">PRIMARY ACTIONS</span>
                    <ul className="text-slate-600 space-y-1 text-[11px]">
                      <li>• <strong>[A] Get Started:</strong> Onboarding trigger</li>
                      <li>• <strong>[B] Create:</strong> Requisition / Task</li>
                      <li>• <strong>[C] Save / Submit:</strong> Checkout &amp; Leads</li>
                      <li>• <strong>Instant Feedback:</strong> Micro-spinners</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1 text-xs">EDGE CASES</span>
                    <ul className="text-slate-600 space-y-1 text-[11px]">
                      <li>• <strong>No Internet:</strong> Offline banner + retry</li>
                      <li>• <strong>Session Expired:</strong> Heartbeat guard</li>
                      <li>• <strong>Payload Overflow:</strong> 15MB ceiling</li>
                      <li>• <strong>Dirty Form Guard:</strong> Unsaved warn</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. UI/UX: FONTS, COLORS & DESIGN SYSTEM                                  */}
          {/* ========================================================================= */}
          {activeTab === "uiux" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                    Document Type: UI/UX Design System Specification
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Design Tokens: Typography Scale, Palette Swatches &amp; Primitives
                  </h2>
                </div>

                {/* Typography Scale */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Typography Families &amp; Scales
                  </h3>
                  <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-200">
                      <div>
                        <div className="text-xl font-bold text-slate-900 font-display">Display &amp; Headline: Inter / Syne (700 Bold)</div>
                        <div className="text-[11px] text-slate-500 font-mono">Used for primary value propositions, hero headlines, and module titles.</div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">text-xl to text-5xl</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-200">
                      <div>
                        <div className="text-sm text-slate-700 font-sans">Body &amp; Paragraph: Inter (400 Regular / 500 Medium)</div>
                        <div className="text-[11px] text-slate-500 font-mono">Optimized for high legibility across dense dashboard data tables and long documentation.</div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">text-xs to text-sm</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                      <div>
                        <div className="text-xs text-blue-700 font-mono font-bold">Code &amp; Numbers: JetBrains Mono / ui-monospace</div>
                        <div className="text-[11px] text-slate-500 font-mono">Strictly applied to API payloads, timestamps, ID tokens, and financial ledgers.</div>
                      </div>
                      <span className="text-xs font-mono text-slate-400">font-mono text-[10px] to text-xs</span>
                    </div>
                  </div>
                </div>

                {/* Color Palette Swatches with 1-Click Copy */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Color Palette Swatches (Click to copy Hex)
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">WCAG AAA Contrast Ratio Compliant</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { name: "Brand Blue", hex: "#0B57D0", role: "Primary CTA / Brand Core", textWhite: true },
                      { name: "Navy 900", hex: "#071739", role: "Header & Corporate Base", textWhite: true },
                      { name: "Accent Gold", hex: "#E5A93C", role: "Badges & Highlights", textWhite: false },
                      { name: "Surface 950", hex: "#020617", role: "Dark Canvas & Code View", textWhite: true },
                      { name: "Success Green", hex: "#10B981", role: "Operational Status OK", textWhite: true },
                      { name: "Danger Rose", hex: "#EF4444", role: "Security Alerts & Errors", textWhite: true }
                    ].map((swatch, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCopy(swatch.hex, `color-${idx}`)}
                        className="rounded-xl border border-slate-200 overflow-hidden text-left shadow-xs hover:scale-105 transition-all cursor-pointer group"
                      >
                        <div 
                          className="h-16 flex items-center justify-center p-2 font-mono text-xs font-bold transition-all"
                          style={{ backgroundColor: swatch.hex, color: swatch.textWhite ? "#ffffff" : "#0f172a" }}
                        >
                          {copiedToken === `color-${idx}` ? (
                            <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[10px] text-white">
                              <Check className="w-3 h-3" /> Copied
                            </span>
                          ) : (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">
                              Copy {swatch.hex}
                            </span>
                          )}
                        </div>
                        <div className="p-2.5 bg-white text-[11px]">
                          <div className="font-bold text-slate-900">{swatch.name}</div>
                          <div className="font-mono text-slate-500 text-[10px]">{swatch.hex}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5 truncate">{swatch.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Component Primitives Playground */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Component Primitives Preview
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Buttons</span>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-semibold shadow-xs">Primary</button>
                        <button className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded-md text-xs font-semibold">Secondary</button>
                        <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md text-xs font-medium">Ghost</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Status Badges</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Active</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">Pending</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">Audited</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Input Fields</span>
                      <input 
                        type="text" 
                        readOnly 
                        defaultValue="Standard Input" 
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. DB SCHEMA & RELATIONS (TABLES, SCHEMAS + ERD)                          */}
          {/* ========================================================================= */}
          {activeTab === "schema" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                      Document Type: DB Schema &amp; ERD Architecture
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Entity-Relationship Diagram, Collection Schemas &amp; Security Mappings
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Complete data models synchronized with <code className="font-mono text-blue-600">firebase-blueprint.json</code> and <code className="font-mono text-blue-600">firestore.rules</code>.
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(JSON.stringify({
                      entities: ["inquiries", "job_applications", "users", "subscriptions", "audit_logs"]
                    }, null, 2), "schema-copy")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copiedToken === "schema-copy" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken === "schema-copy" ? "Copied" : "Copy ERD Blueprint"}</span>
                  </button>
                </div>

                {/* Entity Selector Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
                  {[
                    { id: "inquiries", label: "inquiries (Firestore)" },
                    { id: "job_applications", label: "job_applications (Firestore)" },
                    { id: "users", label: "users (ABAC Identity)" },
                    { id: "subscriptions", label: "subscriptions (SaaS Licenses)" },
                    { id: "audit_logs", label: "audit_logs (Compliance)" }
                  ].map((ent) => (
                    <button
                      key={ent.id}
                      type="button"
                      onClick={() => setSelectedEntity(ent.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 ${
                        selectedEntity === ent.id
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {ent.label}
                    </button>
                  ))}
                </div>

                {/* Schema Detail View */}
                <div className="bg-slate-900 rounded-xl p-5 text-white font-mono text-xs overflow-x-auto">
                  {selectedEntity === "inquiries" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                        <span>COLLECTION: /inquiries/&#123;inquiryId&#125;</span>
                        <span className="text-emerald-400">Rules: allow create if isValidInquiry(), allow read if true</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div><span className="text-purple-400">id</span>: <span className="text-emerald-400">string</span> (unique doc ID)</div>
                        <div><span className="text-purple-400">name</span>: <span className="text-emerald-400">string</span> [1..150 chars] <span className="text-amber-400">*required</span></div>
                        <div><span className="text-purple-400">email</span>: <span className="text-emerald-400">string</span> [email regex, 1..200 chars] <span className="text-amber-400">*required</span></div>
                        <div><span className="text-purple-400">phone</span>: <span className="text-emerald-400">string</span> [1..50 chars] <span className="text-amber-400">*required</span></div>
                        <div><span className="text-purple-400">service</span>: <span className="text-emerald-400">string</span> enum: [&apos;fitness&apos;, &apos;library&apos;, &apos;institutes&apos;, &apos;crm&apos;, &apos;agrifusion&apos;, &apos;municipal&apos;, &apos;ai_agent&apos;]</div>
                        <div><span className="text-purple-400">message</span>: <span className="text-emerald-400">string</span> [max 3000 chars]</div>
                        <div><span className="text-purple-400">timestamp</span>: <span className="text-emerald-400">string (ISO 8601)</span></div>
                        <div><span className="text-purple-400">status</span>: <span className="text-emerald-400">string</span> enum: [&apos;new&apos;, &apos;contacted&apos;, &apos;converted&apos;, &apos;closed&apos;]</div>
                      </div>
                    </div>
                  )}

                  {selectedEntity === "job_applications" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                        <span>COLLECTION: /job_applications/&#123;jobApplicationId&#125;</span>
                        <span className="text-emerald-400">Rules: allow create if isValidApplication(), 15MB PDF buffer</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div><span className="text-purple-400">id</span>: <span className="text-emerald-400">string</span> (unique doc ID)</div>
                        <div><span className="text-purple-400">name</span>: <span className="text-emerald-400">string</span> [1..150 chars] <span className="text-amber-400">*required</span></div>
                        <div><span className="text-purple-400">email</span>: <span className="text-emerald-400">string</span> [email regex] <span className="text-amber-400">*required</span></div>
                        <div><span className="text-purple-400">phone</span>: <span className="text-emerald-400">string</span> [1..50 chars] <span className="text-amber-400">*required</span></div>
                        <div><span className="text-purple-400">jobTitle</span>: <span className="text-emerald-400">string</span> [1..200 chars] <span className="text-amber-400">*required</span></div>
                        <div><span className="text-purple-400">experience</span>: <span className="text-emerald-400">string</span> (&apos;Student/Intern&apos;, &apos;Fresher&apos;, &apos;Junior&apos;, &apos;Senior&apos;)</div>
                        <div><span className="text-purple-400">resumeFileName</span>: <span className="text-emerald-400">string</span> (e.g. &apos;resume.pdf&apos;)</div>
                        <div><span className="text-purple-400">resumeData</span>: <span className="text-emerald-400">string</span> (Base64 payload)</div>
                      </div>
                    </div>
                  )}

                  {selectedEntity === "users" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                        <span>COLLECTION: /users/&#123;userId&#125;</span>
                        <span className="text-indigo-400">ABAC Pattern: read if request.auth.uid == userId || isAdmin()</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div><span className="text-purple-400">uid</span>: <span className="text-emerald-400">string</span> (Firebase Auth UID)</div>
                        <div><span className="text-purple-400">email</span>: <span className="text-emerald-400">string</span> (verified email)</div>
                        <div><span className="text-purple-400">role</span>: <span className="text-emerald-400">string</span> enum: [&apos;admin&apos;, &apos;client&apos;, &apos;developer&apos;] (immutable by client)</div>
                        <div><span className="text-purple-400">company</span>: <span className="text-emerald-400">string</span></div>
                        <div><span className="text-purple-400">createdAt</span>: <span className="text-emerald-400">timestamp</span> (request.time)</div>
                      </div>
                    </div>
                  )}

                  {selectedEntity === "subscriptions" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                        <span>COLLECTION: /subscriptions/&#123;subscriptionId&#125;</span>
                        <span className="text-indigo-400">Relational mapping to users.uid</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div><span className="text-purple-400">id</span>: <span className="text-emerald-400">string</span></div>
                        <div><span className="text-purple-400">userId</span>: <span className="text-emerald-400">string</span> (foreign key -&gt; users.uid)</div>
                        <div><span className="text-purple-400">productId</span>: <span className="text-emerald-400">string</span> (&apos;fitness&apos;, &apos;library&apos;, &apos;crm&apos;)</div>
                        <div><span className="text-purple-400">tier</span>: <span className="text-emerald-400">string</span> enum: [&apos;starter&apos;, &apos;business&apos;, &apos;enterprise&apos;]</div>
                        <div><span className="text-purple-400">status</span>: <span className="text-emerald-400">string</span> enum: [&apos;active&apos;, &apos;past_due&apos;, &apos;canceled&apos;]</div>
                        <div><span className="text-purple-400">licenseKey</span>: <span className="text-emerald-400">string</span></div>
                      </div>
                    </div>
                  )}

                  {selectedEntity === "audit_logs" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                        <span>COLLECTION: /audit_logs/&#123;logId&#125;</span>
                        <span className="text-amber-400">Append-Only Immutable Ledger (create only, delete/update denied)</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div><span className="text-purple-400">id</span>: <span className="text-emerald-400">string</span></div>
                        <div><span className="text-purple-400">action</span>: <span className="text-emerald-400">string</span> (e.g. &apos;USER_LOGIN&apos;, &apos;LEAD_INGEST&apos;, &apos;EXPORT_PORTABILITY&apos;)</div>
                        <div><span className="text-purple-400">userId</span>: <span className="text-emerald-400">string</span> (optional)</div>
                        <div><span className="text-purple-400">ipAddress</span>: <span className="text-emerald-400">string</span> (masked)</div>
                        <div><span className="text-purple-400">timestamp</span>: <span className="text-emerald-400">timestamp</span> (request.time)</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Relational Mapping Visual Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase font-mono tracking-wider">
                    Relational Linkage &amp; Data Integrity Rules
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-0.5">users → subscriptions</strong>
                      <span>1:N relationship. One client account can hold active software licenses for multiple SaaS suites simultaneously.</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-0.5">inquiries → accounts</strong>
                      <span>When an onsite inquiry transitions to &apos;converted&apos;, a corresponding client user profile is dynamically provisioned.</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-0.5">subscriptions → audit_logs</strong>
                      <span>Every license issuance, renewal, or plan upgrade generates an immutable audit log entry.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. IMPLEMENTATION PLAN (BUILD ORDER & VERIFICATION)                        */}
          {/* ========================================================================= */}
          {activeTab === "plan" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                      Document Type: Implementation Plan &amp; Build Order
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Phased Build Order, Milestones &amp; QA Verification Gates
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                    <button
                      onClick={() => setPlanFilter("all")}
                      className={`px-2.5 py-1 rounded-md transition-colors ${planFilter === "all" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600"}`}
                    >
                      All Phases
                    </button>
                    <button
                      onClick={() => setPlanFilter("completed")}
                      className={`px-2.5 py-1 rounded-md transition-colors ${planFilter === "completed" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600"}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                {/* Phases Timeline */}
                <div className="space-y-4">
                  {[
                    {
                      phase: "Phase 1: Core Foundation & Security Baseline",
                      status: "Completed",
                      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      items: [
                        "Vite 6 + Express server integration running with tsx",
                        "Firebase Firestore Enterprise singleton connection initialized",
                        "Zero-Trust firestore.rules and firebase-blueprint.json schema validation",
                        "SEO metadata, OpenGraph tags, schema.org JSON-LD structure"
                      ]
                    },
                    {
                      phase: "Phase 2: Product Suite & Sandboxed Modules",
                      status: "Completed",
                      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      items: [
                        "C Vidya Fitness Zone standalone micro-app integration under /software/fitness",
                        "C Vidya Library Automation standalone micro-app integration under /software/library",
                        "Dynamic router base path resolution and parent-iframe communication channel",
                        "7 Flagship SaaS modal previews and technical specification drawers"
                      ]
                    },
                    {
                      phase: "Phase 3: Conversational Intelligence & Enterprise Leads",
                      status: "Completed",
                      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      items: [
                        "Autonomous AI Assistant proxy route (/api/chat) backed by Gemini 2.5 Flash",
                        "Inquiry capture system with Firestore write + in-memory resilient fallback",
                        "Career job application portal with 15MB base64 resume attachment buffer",
                        "Onsite leads management dialog with passkey authentication"
                      ]
                    },
                    {
                      phase: "Phase 4: Architecture & Engineering Blueprint Center",
                      status: "Completed",
                      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      items: [
                        "Interactive 6-document architecture center (PRD, TRD, App Flow, UI/UX, DB, Plan)",
                        "10-screen user journey simulator matching production navigation rules",
                        "Interactive UI/UX design system tokens with one-click hex copy",
                        "Entity-Relationship Diagram (ERD) schema explorer with JSON/SQL interoperability"
                      ]
                    },
                    {
                      phase: "Phase 5: Edge Resilience, Multi-tenancy & Verification",
                      status: "Completed",
                      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      items: [
                        "Real-time offline / No-Internet edge case detector with automatic retry",
                        "Session expiration security heartbeat guard and token refresh simulation",
                        "Strict optimizeDeps Vite pre-bundling configuration for instant cold starts",
                        "Production build compile verification (tsc --noEmit & vite build)"
                      ]
                    }
                  ].map((p, pIdx) => (
                    <div key={pIdx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <h4 className="font-bold text-sm text-slate-900">{p.phase}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${p.badgeColor}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {p.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">System Status: All 6 Architectural Pillars Operational</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Close Architecture Center
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
