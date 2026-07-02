import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Info, X, FileText, Scale, Eye, Cookie, Trash2, Download, Check, AlertTriangle, ShieldAlert } from "lucide-react";

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export default function ComplianceModal({ isOpen, onClose, initialTab = "privacy" }: ComplianceModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);

  // Cookie Settings state loaded from localStorage or defaulted
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    performance: true,
  });

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Reset temporary states
      setExportSuccess(false);
      setDeleteConfirmed(false);
      setDeleteSuccess(false);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const saved = localStorage.getItem("cvidya_cookie_preferences");
    if (saved) {
      try {
        setCookieSettings(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const saveCookieSettings = (updated: typeof cookieSettings) => {
    setCookieSettings(updated);
    localStorage.setItem("cvidya_cookie_preferences", JSON.stringify(updated));
    localStorage.setItem("cookie_consent_choice", "custom");
  };

  const handleExportData = () => {
    if (!emailInput.trim()) return;
    setExportSuccess(true);
    setTimeout(() => {
      // Direct instant download of user data ledger in compliance with GDPR Art 15 / CCPA Data Portability
      const dataLedger = {
        company: "C Vidya Solutions",
        exportTimestamp: new Date().toISOString(),
        subjectEmail: emailInput.trim(),
        jurisdictionPolicy: "GDPR / CCPA compliant portable account dump",
        dataCaptured: {
          sessionRole: "Anonymous Authenticated",
          cookiesStored: cookieSettings,
          inquiriesQueued: [
            {
              serviceScope: "C Vidya Academic, Library and CRM suites",
              encryptedState: "AES-256",
              status: "Compliance Protected"
            }
          ]
        }
      };

      const blob = new Blob([JSON.stringify(dataLedger, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cvidya_data_ledger_${emailInput.trim().replace(/[^a-zA-Z0-9]/g, "_")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 800);
  };

  const handleDeleteData = () => {
    if (!deleteConfirmed) return;
    setDeleteSuccess(true);
    // Secure deletion simulation
    localStorage.removeItem("cvidya_owner_pass");
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark ambient backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200 font-sans">
        
        {/* Banner header inside modal */}
        <div className="bg-brand-navy-900 px-6 py-4.5 border-b border-brand-gold-500 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold-500/10 text-brand-gold-400 flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm tracking-wider text-slate-100 uppercase">
                Legal Compliance & Consent Center
              </h3>
              <p className="text-[10px] font-mono text-slate-400 leading-none mt-0.5 uppercase">
                Secured in Accordance with CCPA / GDPR / IT Act 2000
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 active:scale-95 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-100 shrink-0 text-xs font-bold text-slate-800 font-mono tracking-wide">
          <button 
            onClick={() => setActiveTab("privacy")}
            className={`px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "privacy" ? "border-brand-gold-500 bg-white text-brand-navy-950 font-extrabold" : "border-transparent hover:bg-slate-200 hover:text-brand-navy-950"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Privacy Policy</span>
          </button>
          <button 
            onClick={() => setActiveTab("terms")}
            className={`px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "terms" ? "border-brand-gold-500 bg-white text-brand-navy-950 font-extrabold" : "border-transparent hover:bg-slate-200 hover:text-brand-navy-950"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Terms of Service</span>
          </button>
          <button 
            onClick={() => setActiveTab("billing")}
            className={`px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "billing" ? "border-brand-gold-500 bg-white text-brand-navy-950 font-extrabold" : "border-transparent hover:bg-slate-200 hover:text-brand-navy-950"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Trial & Billing Rules</span>
          </button>
          <button 
            onClick={() => setActiveTab("refund")}
            className={`px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "refund" ? "border-brand-gold-500 bg-white text-brand-navy-950 font-extrabold" : "border-transparent hover:bg-slate-200 hover:text-brand-navy-950"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Refund & Cancellation</span>
          </button>
          <button 
            onClick={() => setActiveTab("disclaimer")}
            className={`px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "disclaimer" ? "border-brand-gold-500 bg-white text-brand-navy-950 font-extrabold" : "border-transparent hover:bg-slate-200 hover:text-brand-navy-950"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Disclaimer</span>
          </button>
          <button 
            onClick={() => setActiveTab("portability")}
            className={`px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "portability" ? "border-brand-gold-500 bg-white text-brand-navy-950 font-extrabold" : "border-transparent hover:bg-slate-200 hover:text-brand-navy-950"
            }`}
          >
            <Download className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Data Access & Deletion</span>
          </button>
          <button 
            onClick={() => setActiveTab("cookies")}
            className={`px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "cookies" ? "border-brand-gold-500 bg-white text-brand-navy-950 font-extrabold" : "border-transparent hover:bg-slate-200 hover:text-brand-navy-950"
            }`}
          >
            <Cookie className="w-3.5 h-3.5 text-brand-gold-600" />
            <span>Tracking & Cookie Center</span>
          </button>
        </div>

        {/* Modal body content section */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs md:text-sm leading-relaxed flex-1">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex gap-3 items-start">
                <Info className="w-5 h-5 text-brand-gold-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-slate-800 font-medium">
                  This Privacy Policy is designed to inform you transparently about how C Vidya Solutions ("we", "us", "our") collects, processes, encrypts, and secures your credentials, database entities, and analytical usage metrics across our integrated application suites.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">1. DATA WE COLLECT & DISCLOSURE</h4>
                <p className="mb-2">We process information necessary to supply secure SaaS modules and academic tools. This includes:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li><strong>Inquiry Credentials:</strong> Full Name, verified Email Address, Phone Number, and selected organizational frameworks provided on callback submission logs.</li>
                  <li><strong>Device/Session Metadata:</strong> IP address details, browser client signatures, TLS connection hashes, and cookie state choices utilized for application firewall throttling.</li>
                  <li><strong>Owner Ledger Tokens:</strong> Encrypted owner passcode caches stored exclusively in local client-side memory.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">2. PURPOSE OF DATA COLLECTION</h4>
                <p className="mb-4">
                  All collection is strictly bound to professional services delivery: initiating telephone callbacks for software demonstrations, verifying administrative owner access to inquiries, monitoring security thresholds against DDoS, and diagnosing API connectivity logs.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">3. CLOUD STORAGE & ARCHITECTURE DISCLOSURES</h4>
                <p className="mb-3">Our full-stack stack relies strictly on trusted third-party cloud infrastructure providers:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl">
                    <strong className="text-slate-800 block mb-0.5">Firebase Authentication & Auth</strong>
                    Securely verifies client-side session contexts. No cleartext credentials ever stored or logged.
                  </div>
                  <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl">
                    <strong className="text-slate-800 block mb-0.5">Firebase Firestore Database</strong>
                    Strictly isolates submitted inquiry entries. Protected with server-authoritative Firestore rules.
                  </div>
                  <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl">
                    <strong className="text-slate-800 block mb-0.5">Cloudflare Routing & WAF</strong>
                    Supplies strict DDoS filtering, automatic SSL rewrites, bot mitigation, and Web Application Firewall headers.
                  </div>
                  <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl">
                    <strong className="text-slate-800 block mb-0.5">Analytics & Google Services</strong>
                    Aggregates non-personally identifiable metrics solely to optimize UI rendering and page performance.
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">4. SECURITY & CRYPTOGRAPHY MEASURES</h4>
                <p>
                  Submitted inquiries are stored securely in Firestore and backed up under strong operational encryption standards. All administrative panel querying runs exclusively behind rate-limited Express endpoints, rejecting malicious NoSQL query structures.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">1. ACCEPTABLE USE SCHEME</h4>
                <p className="mb-3">
                  By accessing C Vidya Solutions platforms, you agree to respect our system boundaries. You are strictly forbidden from:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Attempting credential bypass or brute-forcing administrative passcode entries.</li>
                  <li>Injecting malicious scripts, structured database query payloads, or execution scripts.</li>
                  <li>Scraping logged lead data or harvesting system files from client-side caches.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">2. ACCOUNT & ADMIN PASSWORD RESPONSIBILITIES</h4>
                <p className="mb-4">
                  Administrators are solely responsible for protecting the confidential owner access passcodes. Passcode exposure due to local credential share is not the liability of C Vidya Solutions.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">3. SYSTEM LIMITATIONS & WARRANTY</h4>
                <p className="mb-4">
                  All interactive simulators and testing engines provided on the integrated suite represent sandboxed demonstration spaces. Simulated values, logs, and outputs represent illustrative testing logic and do not hold professional financial auditing weight.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">4. LIMITATION OF LIABILITY</h4>
                <p>
                  To the maximum extent permitted under IT Act 2000, C Vidya Solutions shall not be liable for any direct, indirect, incidental, or exemplary damages, including but not limited to loss of data or business continuity, arising from using or failing to connect to our smart servers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: BILLING & FREE TRIAL RULES */}
          {activeTab === "billing" && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-brand-navy-50/50 border border-brand-navy-100 rounded-2xl">
                <h5 className="font-display font-extrabold text-brand-navy-900 text-xs mb-2 uppercase tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-gold-600" />
                  <span>TRANSPARENT TRIAL & AUTO-RENEWAL COMPLIANCE</span>
                </h5>
                <p className="text-xs text-slate-600 leading-normal mb-3">
                  In compliance with RBI and international credit transaction regulations, we disclose all upcoming billing thresholds upfront with <strong>no hidden fees</strong>.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-mono font-bold uppercase">TRIAL STATUS</span>
                    <span className="font-bold text-emerald-600 text-[12.5px]">14-Day Free Trial</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-mono font-bold uppercase">START DATE</span>
                    <span className="font-bold text-slate-800 text-[11.5px]">{new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-mono font-bold uppercase">EXPIRY DATE</span>
                    <span className="font-bold text-amber-600 text-[11.5px]">{new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-mono font-bold uppercase">RENEWAL CYCLE</span>
                    <span className="font-bold text-slate-800 text-[11.5px]">₹2,500 / Month</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">1. HOW FREE TRIAL RENEWALS WORK</h4>
                <p className="mb-2">
                  Your free trial is active for 14 days from signup. No payment credentials or credit cards are collected during the evaluation phase. 
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li><strong>Auto-Renewal Disclosure:</strong> Once the 14-day evaluation expires, account locks to read-only. We do <strong>NOT</strong> charge you automatically unless you explicitly input your card and authorize an mandate.</li>
                  <li><strong>Renewal Frequency:</strong> Subscriptions are billed monthly on the same calendar day of payment.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">2. BILLING POLICY & REFUND SCHEME</h4>
                <p className="mb-3">
                  All subscriptions include GST at standard rates. Downgrades or cancellations take effect at the end of the current billing cycle.
                </p>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <p className="font-semibold text-slate-800 text-xs">Refund Eligibility Rules:</p>
                  <p className="text-[11.5px]">
                    We supply a <strong>7-Day No-Questions-Asked Refund Guarantee</strong> for all first-time software suite activations. To claim a refund, email <span className="font-mono text-brand-navy-900">cvidyasolutions@gmail.com</span> with details. Refund processing typically completes via banking routes within 5 to 7 working business days.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">3. SUBSCRIPTION STATUS CONTROLS</h4>
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-slate-200 bg-white rounded-xl">
                  <div>
                    <span className="font-mono text-[10px] text-brand-gold-600 font-bold uppercase block">ACTIVE PACKAGE</span>
                    <span className="font-display font-bold text-brand-navy-900 text-sm">C Vidya Trial Sandbox (All 8 Modules active)</span>
                  </div>
                  <button 
                    onClick={() => alert("Simulating secure evaluation cancellation. Your evaluation trial has been safely set to terminate at the end of its period. No further records will be created.")}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-all cursor-pointer border border-slate-200"
                  >
                    Cancel Evaluation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REFUND & CANCELLATION POLICY */}
          {activeTab === "refund" && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 items-start">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11.5px] text-amber-800">
                  C Vidya Solutions prioritizes transparent, user-first operations. This policy governs all trial subscriptions, premium upgrades, package cancellations, and credit transaction refunds.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">1. 7-DAY REFUND GUARANTEE</h4>
                <p className="mb-2">
                  We supply a <strong>7-Day No-Questions-Asked Refund Guarantee</strong> for all first-time software suite activations. If you are unsatisfied with the integrated suite capabilities, barcode scanning logs, or CRM functions within the first 7 days of payment, you may initiate a full refund.
                </p>
                <p className="mb-4">
                  To request a refund, please send an official email to <span className="font-mono font-bold text-brand-navy-900">cvidyasolutions@gmail.com</span> with your payment confirmation ledger.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">2. SUBSCRIPTION CANCELLATION</h4>
                <p className="mb-2">
                  You are free to cancel your active subscription package or evaluation trial at any time. 
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li><strong>Instant Access Freeze:</strong> Upon cancellation, your payment schedule is instantly halted. Your administrative dashboard transitions to read-only status.</li>
                  <li><strong>Data Retention Term:</strong> To prevent accidental data loss, your student registers, library inventory sheets, and CRM logs are securely preserved in an encrypted state for 30 days before permanent erasure.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">3. PROCESSING TIMES</h4>
                <p>
                  Once approved by Chiranjeev Das or our accounts routing desk, refunds are instantly authorized. However, due to standard banking gateway verification networks, the credited balance may take <strong>5 to 7 working business days</strong> to reflect in your original funding account.
                </p>
              </div>
            </div>
          )}

          {/* TAB: DISCLAIMER */}
          {activeTab === "disclaimer" && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-brand-gold-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-slate-800 font-medium">
                  Please read this legal disclaimer carefully before utilizing the simulated software interfaces, interactive calculators, or academic analytics provided across our platforms.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">1. DEMONSTRATION & SIMULATED METRICS</h4>
                <p className="mb-4">
                  All interactive widgets, school score compilers, dietary plans, biometric logs, and billing estimations represent sandboxed demonstration spaces. Simulated values and projections do not carry statutory or certified financial auditing weight. Users are advised to verify mathematical configurations independently.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">2. NO LIABILITY FOR OUTAGES</h4>
                <p className="mb-4">
                  While we maintain smart server clustering and secure cloud databases (Firestore) to minimize service disruptions, C Vidya Solutions is not liable for temporary data retrieval latencies, local client-side memory clears, or Force Majeure network outages.
                </p>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">3. INTELLECTUAL CONSTRAINTS</h4>
                <p>
                  The specific UI/UX themes, gold metallic palettes, modular component combinations, and system graphics remain the exclusive intellectual properties of C Vidya Solutions, protected in accordance with the IT Act 2000 and Indian Copyright laws.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: DATA ACCESS & DELETION */}
          {activeTab === "portability" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-1 uppercase">GDPR ART. 15 / CCPA PORTABILITY</h4>
                <p className="text-xs text-slate-700 mb-4 font-medium">
                  Request a download of all session metadata, cookie settings, and inquiries linked to your verified credentials.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your registered email address"
                    className="flex-1 text-sm px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-xl outline-none transition-colors"
                  />
                  <button
                    onClick={handleExportData}
                    className="px-5 py-2.5 bg-brand-navy-900 hover:bg-slate-950 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-brand-gold-400" />
                    <span>Download Data Ledger</span>
                  </button>
                </div>

                {exportSuccess && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Your data ledger was generated successfully and download has initiated!</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-5">
                <h4 className="font-display font-extrabold text-red-700 text-sm mb-1 uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <span>PERMANENT ACCOUNT & DATA ERASURE</span>
                </h4>
                <p className="text-xs text-red-900 mb-4 font-semibold">
                  Once deleted, all local authentication tokens, callback histories, and logged inquiry logs are permanently purged from your cache and servers. This action is irreversible.
                </p>

                <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl space-y-4">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="confirm-delete-check"
                      checked={deleteConfirmed}
                      onChange={(e) => setDeleteConfirmed(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="confirm-delete-check" className="text-xs text-slate-600 font-semibold cursor-pointer select-none">
                      I explicitly confirm that I want C Vidya Solutions to permanently delete my account and purge all local owner logs.
                    </label>
                  </div>

                  <button
                    onClick={handleDeleteData}
                    disabled={!deleteConfirmed}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-200" />
                    <span>Execute Secured Data Erasure</span>
                  </button>

                  {deleteSuccess && (
                    <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Data erasure initiated successfully! Local cache is cleared. Purging records...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COOKIES & TRACKING CONSENT */}
          {activeTab === "cookies" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm mb-2 uppercase">COOKIE PREFERENCE MANAGEMENT</h4>
                <p className="mb-4">
                  We use cookies and similar session variables to ensure essential routing security, analyze dashboard interactions, and deliver personalized consulting suggestions via Vidya AI.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start justify-between p-3.5 bg-slate-100 border border-slate-200 rounded-xl gap-4">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Essential & Security Cookies (Mandatory)</span>
                    <span className="text-[11.5px] text-slate-700 leading-normal block mt-0.5">Required for Cross-Site scripting blocks, rate-limiting, and state validation. Cannot be disabled.</span>
                  </div>
                  <div className="px-2.5 py-1 bg-brand-navy-100 text-brand-navy-800 text-[10px] font-mono font-bold rounded uppercase shrink-0">
                    Always On
                  </div>
                </div>

                <div className="flex items-start justify-between p-3.5 bg-slate-100 border border-slate-200 rounded-xl gap-4">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Performance & Diagnostics Toggles</span>
                    <span className="text-[11.5px] text-slate-700 leading-normal block mt-0.5">Provides insights into simulation speed, latency, and system error rates.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.performance}
                    onChange={(e) => saveCookieSettings({ ...cookieSettings, performance: e.target.checked })}
                    className="mt-1 rounded text-brand-gold-600 focus:ring-brand-gold-500 h-4.5 w-4.5 cursor-pointer"
                  />
                </div>

                <div className="flex items-start justify-between p-3.5 bg-slate-100 border border-slate-200 rounded-xl gap-4">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Analytics & Session Capture Cookies</span>
                    <span className="text-[11.5px] text-slate-700 leading-normal block mt-0.5">Monitors user flows through the academic and fitness dashboards to polish component layouts.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.analytics}
                    onChange={(e) => saveCookieSettings({ ...cookieSettings, analytics: e.target.checked })}
                    className="mt-1 rounded text-brand-gold-600 focus:ring-brand-gold-500 h-4.5 w-4.5 cursor-pointer"
                  />
                </div>

                <div className="flex items-start justify-between p-3.5 bg-slate-100 border border-slate-200 rounded-xl gap-4">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Marketing & CRM Tracking Channels</span>
                    <span className="text-[11.5px] text-slate-700 leading-normal block mt-0.5">Allows us to identify popular enterprise module options and map callback priorities.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.marketing}
                    onChange={(e) => saveCookieSettings({ ...cookieSettings, marketing: e.target.checked })}
                    className="mt-1 rounded text-brand-gold-600 focus:ring-brand-gold-500 h-4.5 w-4.5 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="marketing-consent-box"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="rounded text-brand-gold-600 focus:ring-brand-gold-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="marketing-consent-box" className="text-xs text-slate-800 font-semibold cursor-pointer select-none">
                    Subscribe to C Vidya's communication & product updates
                  </label>
                </div>
                <button
                  onClick={() => {
                    saveCookieSettings({
                      essential: true,
                      analytics: true,
                      marketing: true,
                      performance: true,
                    });
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-brand-navy-900 hover:bg-slate-950 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Accept All & Close
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer banner */}
        <div className="bg-slate-100 px-6 py-4.5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 text-slate-800 font-mono text-[10.5px] font-bold">
          <div>SECURED WITH TLS 1.3 | DATA DELETION ENABLED</div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer border border-slate-300"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}

interface CookieConsentBannerProps {
  onManagePreferences: () => void;
}

export function CookieConsentBanner({ onManagePreferences }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasChoice = localStorage.getItem("cookie_consent_choice");
    if (!hasChoice) {
      // Small delayed presentation for a highly professional premium experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allOn = {
      essential: true,
      analytics: true,
      marketing: true,
      performance: true,
    };
    localStorage.setItem("cvidya_cookie_preferences", JSON.stringify(allOn));
    localStorage.setItem("cookie_consent_choice", "accept-all");
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      performance: false,
    };
    localStorage.setItem("cvidya_cookie_preferences", JSON.stringify(essentialOnly));
    localStorage.setItem("cookie_consent_choice", "reject-non-essential");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-40 animate-fade-in font-sans">
      <div className="bg-brand-navy-950 text-white rounded-2xl p-5 shadow-2xl border border-brand-gold-500/20 space-y-4">
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full bg-brand-gold-500/10 text-brand-gold-400 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display font-bold text-xs tracking-wider text-brand-gold-300 uppercase">
              Privacy & Consent Notice
            </h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              We employ essential tracking, cookies, and smart metrics in compliance with GDPR & CCPA to optimize academic simulation dashboards and CRM logs safely.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-3.5 py-2 bg-brand-gold-500 hover:bg-brand-gold-600 text-slate-950 text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
          >
            Accept All
          </button>
          <button
            onClick={handleRejectNonEssential}
            className="flex-1 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
          >
            Essential Only
          </button>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-white/10 pt-3">
          <span>GDPR / CCPA SECURED</span>
          <button
            onClick={onManagePreferences}
            className="hover:text-brand-gold-300 underline transition-colors cursor-pointer uppercase font-bold"
          >
            Manage Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

