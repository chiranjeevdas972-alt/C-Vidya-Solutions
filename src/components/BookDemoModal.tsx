import React, { useState, useEffect } from "react";
import { 
  X, 
  Send, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { triggerSuccessFeedback, dispatchActivityPing } from "./ActivityPingsAndTour";
import CongratulationsModal, { SubmittedDemoData } from "./CongratulationsModal";

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
  onNavigate?: (path: string) => void;
}

export default function BookDemoModal({
  isOpen,
  onClose,
  defaultProduct = "General Company Inquiry",
  onNavigate
}: BookDemoModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [framework, setFramework] = useState(defaultProduct);
  const [requirements, setRequirements] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [congratulationsData, setCongratulationsData] = useState<SubmittedDemoData | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFramework(defaultProduct || "General Company Inquiry");
      setErrorMessage("");
    }
  }, [isOpen, defaultProduct]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !congratulationsData) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, congratulationsData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone === "+91" || cleanPhone === "+91 ") {
      setErrorMessage("Please enter a valid Phone Number for the demo confirmation.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid Email Address.");
      return;
    }

    if (!consent) {
      setErrorMessage("Please accept the secure storage and transmission consent.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const refId = `CVD-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const demoPayload = {
        name: fullName.trim(),
        email: email.trim(),
        phone: cleanPhone,
        service: framework,
        message: requirements.trim() || "Free Live Demo Requisition",
        timestamp: new Date().toISOString(),
        status: "pending_review",
        source: "book_free_demo_modal",
        referenceId: refId
      };

      // 1. Immediate Resilient Local Storage Backup (<1ms)
      try {
        const localLeads = JSON.parse(localStorage.getItem("cvidya_local_leads") || "[]");
        localLeads.unshift(demoPayload);
        localStorage.setItem("cvidya_local_leads", JSON.stringify(localLeads.slice(0, 50)));
      } catch (cacheErr) {
        console.warn("Local storage cache notice:", cacheErr);
      }

      // 2. Concurrently dispatch Firestore & Server API without blocking UI
      Promise.allSettled([
        addDoc(collection(db, "inquiries"), demoPayload).catch((fbErr) => {
          console.warn("Direct Firestore lead record fallback:", fbErr);
        }),
        fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim(),
            phone: cleanPhone,
            service: framework,
            message: requirements.trim() || "Free Live Demo Requisition",
            referenceId: refId
          })
        }).catch((apiErr) => {
          console.warn("Server API demo booking notice:", apiErr);
        })
      ]);

      // 3. Dispatch system feedback
      triggerSuccessFeedback({
        title: "Demo Requisition Received!",
        message: `Your booking for ${framework} has been recorded.`,
        actionLabel: "Explore Software Suites",
        actionPath: "/software/"
      });

      dispatchActivityPing({
        category: "Demo Requisition",
        message: `Live demo requested for ${framework}`,
        timestampLabel: "Just now",
        targetPath: "/software/"
      });

      // 4. Instantly show Congratulations Popup Message
      setCongratulationsData({
        name: fullName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        service: framework,
        referenceId: refId,
        requirements: requirements.trim()
      });

      // Reset form fields
      setFullName("");
      setPhone("+91 ");
      setEmail("");
      setRequirements("");
      setConsent(false);
    } catch (err: any) {
      setErrorMessage("Failed to transmit requisition. Please call our direct line +91 92885 17027.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseCongratulations = () => {
    setCongratulationsData(null);
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-demo-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs font-sans animate-fade-in overflow-y-auto"
      >
        {/* Backdrop click */}
        <div
          className="fixed inset-0 cursor-pointer"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window Container matching exact form styling from image */}
        <div className="relative bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Decorative Blue Accent */}
          <div className="h-1.5 w-full bg-blue-600" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close book demo form"
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Form Content matching exact image */}
          <div className="p-6 sm:p-9 space-y-6">
            
            <div className="pr-8">
              <h2
                id="book-demo-modal-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 uppercase leading-snug"
              >
                GET IN TOUCH
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-mono font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    YOUR FULL NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-mono font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                    PHONE NUMBER <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 8987766981"
                    className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] sm:text-xs font-mono font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                  EMAIL ADDRESS <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="next"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Specific Product Framework */}
              <div>
                <label className="block text-[10px] sm:text-xs font-mono font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                  SPECIFIC PRODUCT FRAMEWORK
                </label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm bg-white text-slate-900 font-medium border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
                >
                  <option value="General Company Inquiry">General Company Inquiry</option>
                  <option value="C Vidya Library Management">C Vidya Library Management</option>
                  <option value="C Vidya Fitness Zone">C Vidya Fitness Zone</option>
                  <option value="C Vidya Institutes Management">C Vidya Institutes Management</option>
                  <option value="C Vidya Coaching Management">C Vidya Coaching Management</option>
                  <option value="Agrifusion Agriculture SaaS">Agrifusion Agriculture SaaS</option>
                  <option value="C Vidya Jewelers Management">C Vidya Jewelers Management</option>
                  <option value="C Vidya Enterprise CRM">C Vidya Enterprise CRM</option>
                  <option value="Petrol Pump Cloud Suite">Petrol Pump Cloud Suite</option>
                  <option value="Care Plus Hospital & Healthcare ERP">Care Plus Hospital &amp; Healthcare ERP</option>
                  <option value="All-in-One PDF Tools & Converter">All-in-One PDF Tools &amp; Converter</option>
                  <option value="AI Autonomous Agents Suite">AI Autonomous Agents Suite</option>
                  <option value="Municipal/Enterprise Software Solution">Municipal/Enterprise Software Solution</option>
                </select>
              </div>

              {/* Requirements / Instructions */}
              <div>
                <label className="block text-[10px] sm:text-xs font-mono font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
                  REQUIREMENTS / INSTRUCTIONS
                </label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Tell us about your organization's workflow needs..."
                  className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400 resize-y min-h-[90px]"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 pt-1 select-none cursor-pointer group">
                <input
                  type="checkbox"
                  id="book-demo-consent-cb"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="book-demo-consent-cb"
                  className="text-xs sm:text-[11px] text-slate-600 leading-snug cursor-pointer group-hover:text-slate-900 transition-colors"
                >
                  I consent to secure database storage &amp; transmission of my details under standard encryption guidelines.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] sm:min-h-[44px] py-3.5 sm:py-3 bg-[#1D70B8] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-all text-sm sm:text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer uppercase mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "SUBMITTING..." : "SUBMIT"}</span>
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* Congratulations Popup Message */}
      <CongratulationsModal
        isOpen={Boolean(congratulationsData)}
        onClose={handleCloseCongratulations}
        data={congratulationsData}
        onNavigate={onNavigate}
      />
    </>
  );
}
