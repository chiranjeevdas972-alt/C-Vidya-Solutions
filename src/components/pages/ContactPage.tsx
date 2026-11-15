import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Send, 
  CheckCircle2, 
  Database,
  ExternalLink, 
  GraduationCap 
} from "lucide-react";
import SeoHead from "../SeoHead";
import { CORE_PAGES_SEO } from "../../seoData";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { triggerSuccessFeedback, dispatchActivityPing } from "../ActivityPingsAndTour";
import CongratulationsModal, { SubmittedDemoData } from "../CongratulationsModal";

interface ContactPageProps {
  onOpenLeadsModal?: () => void;
  mode?: "demo" | "full";
  onNavigate?: (path: string) => void;
}

export default function ContactPage({ onOpenLeadsModal, mode = "full", onNavigate }: ContactPageProps) {
  const isDemoMode = mode === "demo" || (typeof window !== "undefined" && (new URLSearchParams(window.location.search).get("mode") === "demo" || window.location.hash.includes("demo")));
  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [framework, setFramework] = useState("General Company Inquiry");
  const [requirements, setRequirements] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [congratulationsData, setCongratulationsData] = useState<SubmittedDemoData | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlService = new URLSearchParams(window.location.search).get("service");
      if (urlService) {
        setFramework(decodeURIComponent(urlService));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMessage("Please fill in your Full Name, Phone Number, and Email Address.");
      return;
    }

    if (!consent) {
      setErrorMessage("Please accept the secure storage and transmission consent.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const refId = `CVD-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    const submittedName = fullName.trim();
    const submittedPhone = phone.trim();
    const submittedEmail = email.trim();
    const submittedService = framework;
    const submittedReqs = requirements.trim();

    try {
      // 1. Immediate Local storage resilient backup (<1ms)
      try {
        const localLeads = JSON.parse(localStorage.getItem("cvidya_local_leads") || "[]");
        localLeads.unshift({
          id: refId,
          name: submittedName,
          email: submittedEmail,
          phone: submittedPhone,
          service: submittedService,
          message: submittedReqs,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem("cvidya_local_leads", JSON.stringify(localLeads.slice(0, 50)));
      } catch (_) {}

      // 2. Concurrently dispatch Firestore & Server API without UI blocking
      Promise.allSettled([
        addDoc(collection(db, "inquiries"), {
          name: submittedName,
          email: submittedEmail,
          phone: submittedPhone,
          service: submittedService,
          message: submittedReqs || "Online Callback / Demo Requisition",
          timestamp: new Date().toISOString(),
          status: "pending_review",
          source: isDemoMode ? "demo_mode_form" : "contact_page_form",
          referenceId: refId
        }).catch((fbErr) => {
          console.warn("Direct Firestore lead record fallback:", fbErr);
        }),
        fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: submittedName,
            email: submittedEmail,
            phone: submittedPhone,
            service: submittedService,
            message: submittedReqs || "Online Callback / Demo Requisition",
            referenceId: refId
          })
        }).catch(() => {})
      ]);

      // Trigger Congratulations Popup Message
      setCongratulationsData({
        name: submittedName,
        phone: submittedPhone,
        email: submittedEmail,
        service: submittedService,
        referenceId: refId,
        requirements: submittedReqs
      });
      setSubmitted(true);

      setFullName("");
      setPhone("+91 ");
      setEmail("");
      setFramework("General Company Inquiry");
      setRequirements("");
      setConsent(false);

      triggerSuccessFeedback({
        title: "Requisition Recorded!",
        message: `Your booking for ${submittedService} has been saved. Reference: ${refId}`,
        actionLabel: "Explore Software Suites",
        actionPath: "/software/"
      });
      dispatchActivityPing({
        category: "Demo Requisition",
        message: `Enquiry recorded for ${submittedService}`,
        timestampLabel: "Just now",
        targetPath: "/software/"
      });
    } catch (err: any) {
      setErrorMessage("Failed to transmit requisition. Please contact our direct phone line +91 92885 17027.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormCard = (isStandalone = false) => (
    <div className={`bg-white border border-slate-200/90 ${isStandalone ? "p-5 sm:p-8 md:p-10 shadow-md sm:shadow-xl rounded-2xl sm:rounded-3xl" : "p-5 sm:p-7 md:p-8 shadow-xs rounded-2xl"} space-y-5 sm:space-y-6 w-full transition-all`}>
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-950 uppercase leading-snug">
          GET IN TOUCH
        </h2>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Requisition Transmitted Successfully</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Your inquiry is assigned to our director desk. We will call you at <strong>{phone}</strong> shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Submit Another Requisition
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Name & Phone */}
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

          {/* Email */}
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

          {/* Framework Selector */}
          <div>
            <label className="block text-[10px] sm:text-xs font-mono font-bold text-slate-600 uppercase mb-1.5 tracking-wider">
              SPECIFIC PRODUCT FRAMEWORK
            </label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all cursor-pointer"
            >
              <option value="General Company Inquiry">General Company Inquiry</option>
              <option value="C Vidya Library Management">C Vidya Library Management</option>
              <option value="C Vidya Fitness Zone">C Vidya Fitness Zone</option>
              <option value="C Vidya Institutes Management">C Vidya Institutes Management</option>
              <option value="C Vidya Coaching Management">C Vidya Coaching Management</option>
              <option value="Agrifusion Agriculture SaaS">Agrifusion Agriculture SaaS</option>
              <option value="C Vidya Jewelers Management">C Vidya Jewelers Management</option>
              <option value="C Vidya Enterprise CRM">C Vidya Enterprise CRM</option>
              <option value="AI Autonomous Agents Suite">AI Autonomous Agents Suite</option>
              <option value="Municipal/Enterprise Software Solution">Municipal/Enterprise Software Solution</option>
            </select>
          </div>

          {/* Requirements */}
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
              id="consent-cb"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-4 h-4 mt-0.5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="consent-cb" className="text-xs sm:text-[11px] text-slate-600 leading-snug cursor-pointer group-hover:text-slate-900 transition-colors">
              I consent to secure database storage &amp; transmission of my details under standard encryption guidelines.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[48px] sm:min-h-[44px] py-3.5 sm:py-3 bg-[#1D70B8] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-all text-sm sm:text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? "SUBMITTING..." : "SUBMIT"}</span>
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className={`w-full bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-600 selection:text-white ${isDemoMode ? "min-h-[calc(100dvh-70px)] flex flex-col justify-center py-6 sm:py-10 md:py-14" : "py-8 sm:py-12"} px-3 sm:px-6 lg:px-8 pb-[max(2rem,env(safe-area-inset-bottom,2rem))]`}>
      <SeoHead
        title={CORE_PAGES_SEO.contact.title}
        description={CORE_PAGES_SEO.contact.description}
        canonicalUrl={CORE_PAGES_SEO.contact.canonical}
        ogType="website"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact C Vidya Solutions",
          "url": "https://cvidyasolutions.com/contact/",
          "description": CORE_PAGES_SEO.contact.description,
          "mainEntity": {
            "@type": "Organization",
            "name": "C Vidya Solutions",
            "url": "https://cvidyasolutions.com",
            "telephone": "+91-9288517027",
            "email": "info@cvidyasolutions.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Surunga, Baliapur",
              "addressLocality": "Dhanbad",
              "addressRegion": "Jharkhand",
              "postalCode": "828115",
              "addressCountry": "IN"
            }
          }
        }}
      />
      <div className={isDemoMode ? "w-full max-w-xl md:max-w-2xl mx-auto" : "max-w-7xl mx-auto"}>
        {isDemoMode ? (
          /* Book Free Demo Mode: ONLY Get In Touch Section */
          <div className="w-full">
            {renderFormCard(true)}
          </div>
        ) : (
          /* Contact Us Page: All Details (Director Desk, Get In Touch, Regional Locations) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ==================================================== */}
            {/* COLUMN 1: DIRECTOR DESK */}
            {/* ==================================================== */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-blue-600" />
                  <span>DIRECTOR DESK</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 uppercase leading-snug">
                  CONNECT WITH OUR DIRECTOR &amp; FOUNDER
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Schedule a customized live demo, discuss technical parameters, and discover how our integrated system platforms can streamline your workspace workflow instantly.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                
                {/* Phone Direct */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">OFFICIAL PHONE DIRECT</div>
                    <a href="tel:+919288517027" className="text-sm font-bold text-slate-950 hover:text-blue-600 block">
                      +91 92885 17027
                    </a>
                    <div className="text-[11px] text-slate-500">Mon - Sat (10:00 AM - 07:00 PM)</div>
                  </div>
                </div>

                {/* Email Correspondence */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">EMAIL CORRESPONDENCE</div>
                    <div className="space-y-2">
                      <div>
                        <a href="mailto:info@cvidyasolutions.com" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                          info@cvidyasolutions.com
                        </a>
                        <div className="text-[10px] text-slate-500">General Corporate Information</div>
                      </div>
                      <div>
                        <a href="mailto:sales@cvidyasolutions.com" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                          sales@cvidyasolutions.com
                        </a>
                        <div className="text-[10px] text-slate-500">Enterprise Sales &amp; Live Demos</div>
                      </div>
                      <div>
                        <a href="mailto:contact@cvidyasolutions.com" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                          contact@cvidyasolutions.com
                        </a>
                        <div className="text-[10px] text-slate-500">Client Relations &amp; Inquiries</div>
                      </div>
                      <div>
                        <a href="mailto:support@cvidyasolutions.com" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                          support@cvidyasolutions.com
                        </a>
                        <div className="text-[10px] text-slate-500">Technical Support &amp; SLA Desk</div>
                      </div>
                      <div>
                        <a href="mailto:careers@cvidyasolutions.com" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                          careers@cvidyasolutions.com
                        </a>
                        <div className="text-[10px] text-slate-500">Engineering Careers &amp; HR</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/70">
                      <a href="mailto:chiranjeev0058@gmail.com" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                        chiranjeev0058@gmail.com
                      </a>
                      <div className="text-[10px] text-slate-500">Director: Chiranjeev Das</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Database Icon Button at bottom-left corner of Director Desk */}
              {onOpenLeadsModal && (
                <div className="pt-1 flex justify-start">
                  <button
                    type="button"
                    onClick={onOpenLeadsModal}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                    title="Database"
                    aria-label="Database"
                  >
                    <Database className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* ==================================================== */}
            {/* COLUMN 2: GET IN TOUCH FORM */}
            {/* ==================================================== */}
            {renderFormCard(false)}


          {/* ==================================================== */}
          {/* COLUMN 3: REGIONAL LOCATIONS */}
          {/* ==================================================== */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase flex items-center gap-2">
                <span className="w-4 h-[2px] bg-blue-600" />
                <span>REGIONAL LOCATIONS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 uppercase leading-snug">
                REGIONAL OFFICE DETAILS
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Operating across Jharkhand and Bihar with indigenous enterprise software built for speed, performance, and durability.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              
              {/* Headquarters */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">HEADQUARTERS</div>
                  <div className="text-xs font-bold text-slate-950">
                    Surunga, Baliapur, Dhanbad, Jharkhand - 828115
                  </div>
                  <div className="text-[10px] text-slate-500">Main Corporate Center</div>
                </div>
              </div>

              {/* STPI Desk */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">STPI R&amp;D DESK</div>
                  <div className="text-xs font-bold text-slate-950">
                    STPI Desk, BIT Sindri Campus, Dhanbad, Jharkhand
                  </div>
                  <div className="text-[10px] text-slate-500">Academic R&amp;D Incubation</div>
                </div>
              </div>

              {/* Phone & Hotlines */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">PHONE &amp; HOTLINES</div>
                  <a href="tel:+918987766981" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                    +91 8987766981
                  </a>
                  <div className="text-[10px] text-slate-500">Technical Advisory Line</div>
                </div>
              </div>

            </div>

            {/* Regional Quote */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 italic">
                &ldquo;Proudly serving Jharkhand and Bihar regions with indigenous software. Built to perform.&rdquo;
              </p>
            </div>

          </div>

        </div>
        )}

      </div>

      {/* Congratulations Popup Message */}
      <CongratulationsModal
        isOpen={Boolean(congratulationsData)}
        onClose={() => setCongratulationsData(null)}
        data={congratulationsData}
        onNavigate={onNavigate}
      />
    </div>
  );
}
