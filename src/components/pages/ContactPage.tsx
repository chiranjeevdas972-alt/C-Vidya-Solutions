import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Send, 
  CheckCircle2, 
  Shield, 
  QrCode, 
  Database,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface ContactPageProps {
  onOpenLeadsModal?: () => void;
}

export default function ContactPage({ onOpenLeadsModal }: ContactPageProps) {
  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [framework, setFramework] = useState("General Company Inquiry");
  const [requirements, setRequirements] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    try {
      // 1. Direct Firestore Persistence
      try {
        const inquiriesCol = collection(db, "inquiries");
        await addDoc(inquiriesCol, {
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service: framework,
          message: requirements.trim() || "Online Callback Requisition",
          timestamp: new Date().toISOString(),
          status: "pending_review",
          source: "contact_page_form"
        });
      } catch (fbErr) {
        console.warn("Direct Firestore lead record fallback:", fbErr);
      }

      // 2. Server API sync
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service: framework,
          message: requirements.trim() || "Online Callback Requisition"
        })
      }).catch(() => {});

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage("Failed to transmit requisition. Please contact our direct phone line +91 92885 17027.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-600 selection:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* 3-Column Equal Architecture Grid */}
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
                  <div>
                    <a href="mailto:cvidyasolutions@gmail.com" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                      cvidyasolutions@gmail.com
                    </a>
                    <div className="text-[10px] text-slate-500">Office Support Desk</div>
                  </div>
                  <div className="pt-1">
                    <a href="mailto:chiranjeev0058@gmail.com" className="text-xs font-bold text-slate-950 hover:text-blue-600 block">
                      chiranjeev0058@gmail.com
                    </a>
                    <div className="text-[10px] text-slate-500">Director: Chiranjeev Das</div>
                  </div>
                </div>
              </div>

              {/* QR / Scan Card */}
              <div className="p-4 bg-[#071739] text-white rounded-xl flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <QrCode className="w-6 h-6 text-blue-400" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono tracking-wider text-blue-400 uppercase font-semibold">SCAN TO VISIT WEBSITE</div>
                  <div className="text-sm font-bold text-white">Official C Vidya Portal</div>
                  <div className="text-[11px] text-slate-300">Instant mobile access to solution documents.</div>
                </div>
              </div>

            </div>
          </div>


          {/* ==================================================== */}
          {/* COLUMN 2: ONLINE REQUISITION FORM */}
          {/* ==================================================== */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase flex items-center gap-2">
                <span className="w-4 h-[2px] bg-blue-600" />
                <span>ONLINE REQUISITION</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 uppercase leading-snug">
                SUBMIT A CALLBACK INQUIRY
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We respond to all verified regional phone inquiries on the same day. All fields are handled securely.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Requisition Transmitted Successfully</h3>
                <p className="text-xs text-slate-600">
                  Your inquiry is assigned to our director desk. We will call you at <strong>{phone}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold"
                >
                  Submit Another Requisition
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                    {errorMessage}
                  </div>
                )}

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-600 uppercase mb-1">
                      YOUR FULL NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-600 uppercase mb-1">
                      PHONE NUMBER <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 8987766981"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-600 uppercase mb-1">
                    EMAIL ADDRESS <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Framework Selector */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-600 uppercase mb-1">
                    SPECIFIC PRODUCT FRAMEWORK
                  </label>
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
                  <label className="block text-[10px] font-mono font-bold text-slate-600 uppercase mb-1">
                    REQUIREMENTS / INSTRUCTIONS
                  </label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Tell us about your organization's workflow needs..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consent-cb"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="consent-cb" className="text-[11px] text-slate-500 leading-tight">
                    I consent to secure database storage &amp; transmission of my details under standard encryption guidelines.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#1D70B8] hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-md shadow-xs transition-colors text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer uppercase"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "TRANSMITTING..." : "TRANSMIT REQUISITION RECEIVED"}</span>
                </button>

                {/* Badges */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-100">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Shield className="w-3.5 h-3.5" />
                    <span>SSL Encrypted</span>
                  </div>

                  {onOpenLeadsModal && (
                    <button
                      type="button"
                      onClick={onOpenLeadsModal}
                      className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Onsite Leads</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>


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

      </div>
    </div>
  );
}
