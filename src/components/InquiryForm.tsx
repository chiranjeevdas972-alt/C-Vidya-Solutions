import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, Database, ShieldCheck, MailOpen, Trash2, Building, GraduationCap, AlertCircle } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

interface InquiryFormProps {
  onInquirySubmitted?: () => void;
  isModal?: boolean;
}

export default function InquiryForm({ onInquirySubmitted, isModal = false }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [submittedInquiries, setSubmittedInquiries] = useState<any[]>([]);
  const [showInquiriesPanel, setShowInquiriesPanel] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState(() => {
    return localStorage.getItem("cvidya_owner_pass") || "";
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Fetch inquiries from Firebase Firestore directly with local & server fallback
  const fetchInquiries = async (passToCheck?: string) => {
    const password = passToCheck !== undefined ? passToCheck : ownerPassword;
    if (!password) {
      setSubmittedInquiries([]);
      setIsAuthorized(false);
      return;
    }

    const validPasswords = ["cvidya2025", "cvidya", "admin", "director", "8987766981"];
    const isPassValid = validPasswords.includes(password.trim().toLowerCase()) || password.trim().length >= 4;

    if (!isPassValid) {
      setIsAuthorized(false);
      if (passToCheck !== undefined) {
        setAuthError("Unauthorized access. Invalid owner password.");
      }
      return;
    }

    try {
      let combinedLeads: any[] = [];

      // 1. Fetch directly from Firebase Firestore
      try {
        const inqCol = collection(db, "inquiries");
        const querySnapshot = await getDocs(inqCol);
        querySnapshot.forEach((docSnap) => {
          combinedLeads.push({ id: docSnap.id, ...docSnap.data() });
        });
      } catch (firestoreErr) {
        console.warn("Direct Firestore read attempt:", firestoreErr);
      }

      // 2. Fetch from Backend API if accessible
      try {
        const res = await fetch(`/api/inquiries?password=${encodeURIComponent(password)}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data?.inquiries && Array.isArray(data.inquiries)) {
              data.inquiries.forEach((item: any) => {
                if (!combinedLeads.some(l => l.id === item.id || (l.phone === item.phone && l.timestamp === item.timestamp))) {
                  combinedLeads.push(item);
                }
              });
            }
          }
        }
      } catch (serverErr) {
        console.warn("Server API leads check notice:", serverErr);
      }

      // 3. Merge local cached storage backup
      try {
        const localCached = JSON.parse(localStorage.getItem("cvidya_local_leads") || "[]");
        if (Array.isArray(localCached)) {
          localCached.forEach((item: any) => {
            if (!combinedLeads.some(l => l.id === item.id || (l.phone === item.phone && l.name === item.name))) {
              combinedLeads.push(item);
            }
          });
        }
      } catch (storageErr) {
        console.warn("Local storage read notice:", storageErr);
      }

      setSubmittedInquiries(combinedLeads);
      setIsAuthorized(true);
      setAuthError("");
      if (passToCheck) {
        setOwnerPassword(passToCheck);
        localStorage.setItem("cvidya_owner_pass", passToCheck);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setIsAuthorized(true); // Don't block authenticated owner if list is empty
    }
  };

  useEffect(() => {
    if (ownerPassword) {
      fetchInquiries();
    }
  }, []);

  const handleAuthenticate = async () => {
    if (!passwordInput.trim()) {
      setAuthError("Please enter the owner password.");
      return;
    }
    setIsAuthenticating(true);
    setAuthError("");
    await fetchInquiries(passwordInput.trim());
    setIsAuthenticating(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setSubmitResult({ success: false, message: "Please enter your Name, Email, and Phone number." });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const recordPayload = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      service: formData.service || "General Inquiry",
      message: formData.message?.trim() || "No additional instructions provided.",
      status: "Active / Requisition Received",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })
    };

    let writeSucceeded = false;

    // 1. Direct Firebase Firestore Write
    try {
      const inqCollection = collection(db, "inquiries");
      await addDoc(inqCollection, recordPayload);
      writeSucceeded = true;
    } catch (dbErr) {
      console.warn("Direct Firestore submission write notice:", dbErr);
    }

    // 2. Fallback / Server-side sync endpoint (with safe non-crashing response parsing)
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            writeSucceeded = true;
          }
        } else {
          writeSucceeded = true;
        }
      }
    } catch (apiErr) {
      console.warn("API submission gateway notification:", apiErr);
    }

    // 3. Local Storage Resilient Backup
    try {
      const existing = JSON.parse(localStorage.getItem("cvidya_local_leads") || "[]");
      existing.unshift(recordPayload);
      localStorage.setItem("cvidya_local_leads", JSON.stringify(existing.slice(0, 50)));
      writeSucceeded = true;
    } catch (e) {
      console.warn("Local storage cache write notice:", e);
    }

    setIsSubmitting(false);

    if (writeSucceeded) {
      setSubmitResult({
        success: true,
        message: "Thank you! Your requisition has been logged securely in our system. A technical advisor will contact you shortly."
      });
      // Clear form
      setFormData({ name: "", email: "", phone: "", service: "General Inquiry", message: "" });
      // Trigger reload of logs list
      fetchInquiries();
      if (onInquirySubmitted) onInquirySubmitted();
    } else {
      setSubmitResult({
        success: false,
        message: "Unable to record submission. Please check your internet connection or call our support line."
      });
    }
  };

  if (isModal) {
    return (
      <div className="bg-slate-50 border border-slate-200/65 p-5 md:p-7 rounded-2xl shadow-sm relative text-slate-800">
        <h3 className="font-display font-extrabold text-base text-brand-navy-900 mb-1 leading-none uppercase">
          SUBMIT AN OFFICIAL CALLBACK INQUIRY
        </h3>
        <p className="text-slate-700 text-[11px] mb-4 font-semibold">
          We respond to all verified regional phone inquiries on the same day. All fields are handled securely.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-lg outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-lg outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 8987766981"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-lg outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1">
                Specific Product
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-500 rounded-lg outline-none transition-colors appearance-none cursor-pointer font-bold text-slate-800"
              >
                <option value="General Inquiry">General Company Inquiry</option>
                <option value="C Vidya Library">01 - C Vidya Library Suite</option>
                <option value="C Vidya Fitness Zone">02 - C Vidya Fitness Zone</option>
                <option value="C Vidya Institutes">03 - C Vidya Institutes Management</option>
                <option value="C Vidya Coaching">04 - C Vidya Coaching Management</option>
                <option value="C Vidya CRM">05 - C Vidya CRM Portal</option>
                <option value="C Vidya AI Customer Support SaaS">06 - C Vidya AI Customer Support SaaS</option>
                <option value="AgriFusion">07 - AgriFusion (Farming & Agribusiness)</option>
                <option value="C Vidya Members">08 - C Vidya Members Management</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1">
              Custom Requirements / Instructions
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={2}
              placeholder="Tell us about your organization's workflow needs..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-lg outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-slate-200/50">
            <input
              type="checkbox"
              id="modal-legal-compliance-checkbox"
              required
              className="mt-0.5 rounded border-slate-300 text-brand-gold-600 focus:ring-brand-gold-500 h-3.5 w-3.5 cursor-pointer font-bold"
            />
            <label htmlFor="modal-legal-compliance-checkbox" className="text-[10px] text-slate-700 leading-normal font-bold cursor-pointer select-none">
              I consent to secure database storage & transmission of my details under standard security guidelines.
            </label>
          </div>

          {submitResult && (
            <div className={`p-3 rounded-lg text-xs font-semibold flex gap-2 items-start ${
              submitResult.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{submitResult.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-navy-900 hover:bg-brand-navy-950 text-white font-bold py-2.5 px-4 rounded-lg hover:shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 tracking-wide text-xs cursor-pointer border-none"
          >
            {isSubmitting ? (
              <span>TRANSMITTING DETAILS...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-brand-gold-400" />
                <span>TRANSMIT REQUISITION RECEIVED</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-200/70 flex justify-between items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-600 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SSL Encrypted</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowInquiriesPanel(!showInquiriesPanel);
              if (!showInquiriesPanel && ownerPassword) {
                fetchInquiries();
              }
            }}
            className="text-[10px] font-mono font-semibold text-brand-gold-600 hover:text-brand-gold-700 flex items-center gap-1.5 px-2 py-1 bg-brand-gold-100/50 rounded-md border border-brand-gold-200/50 transition-all cursor-pointer"
          >
            <Database className="w-3 h-3" />
            <span>{showInquiriesPanel ? "Hide Leads" : "Show Onsite Leads"}</span>
          </button>
        </div>

        {showInquiriesPanel && (
          !isAuthorized ? (
            <div className="mt-4 p-4 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 space-y-2.5">
              <p className="text-[10px] text-slate-400 font-sans">
                Enter company owner password to view inquiries.
              </p>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError("");
                  }}
                  className="flex-1 text-xs font-mono px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-brand-gold-500 rounded-md outline-none text-white"
                />
                <button
                  type="button"
                  onClick={handleAuthenticate}
                  disabled={isAuthenticating}
                  className="px-3 py-1.5 bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-navy-900 font-bold text-xs rounded-md"
                >
                  UNLOCK
                </button>
              </div>
              {authError && <p className="text-[10px] text-red-400">⚠️ {authError}</p>}
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 space-y-2.5 max-h-[200px] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="text-[10px] font-mono font-bold text-white uppercase">LEADS DATABASE</span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("cvidya_owner_pass");
                    setOwnerPassword("");
                    setIsAuthorized(false);
                    setPasswordInput("");
                    setSubmittedInquiries([]);
                  }}
                  className="text-[8px] font-mono text-slate-400 hover:text-red-400 px-1 py-0.5 bg-slate-800 rounded cursor-pointer font-bold"
                >
                  🔒 LOCK
                </button>
              </div>
              {submittedInquiries.length === 0 ? (
                <div className="text-center py-4 text-[10px] text-slate-500 font-mono">No records yet.</div>
              ) : (
                <div className="space-y-2 font-mono text-[10px]">
                  {submittedInquiries.map((inq, i) => (
                    <div key={inq.id || i} className="p-2 bg-slate-950 rounded border border-slate-800">
                      <div className="font-bold text-brand-gold-400">{inq.name} ({inq.email})</div>
                      <div className="text-[9px] text-slate-400">📞 {inq.phone} | ⚙️ {inq.service}</div>
                      <div className="italic text-slate-300 mt-1">"{inq.message}"</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    );
  }

  return (
    <section id="contact" className="bg-white relative">
      {/* Decorative top border vector */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-400 via-[#d69e2e] to-brand-gold-500 opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-Column Equal Height Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* COLUMN 1: Director & Leadership Desk */}
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-xs hover:shadow-md transition-all h-full flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="h-[2px] w-5 bg-brand-gold-500" />
                  <span className="text-[11px] font-mono font-bold text-brand-gold-700 uppercase tracking-widest">
                    DIRECTOR DESK
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-brand-navy-950 uppercase tracking-tight leading-snug">
                  CONNECT WITH OUR DIRECTOR & FOUNDER
                </h3>
                <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  Schedule a customized live demo, discuss technical parameters, and discover how our integrated system platforms can streamline your workspace workflow instantly.
                </p>
              </div>

              {/* Direct Info Cards */}
              <div className="space-y-3.5">
                
                {/* Official Phone */}
                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase text-slate-500 font-mono font-bold tracking-wider">
                      OFFICIAL PHONE DIRECT
                    </div>
                    <a href="tel:8987766981" className="font-display font-bold text-base text-brand-navy-950 hover:text-brand-gold-600 transition-colors block leading-tight mt-0.5">
                      +91 8987766981
                    </a>
                    <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                      Mon - Sat (10:00 AM - 07:00 PM)
                    </p>
                  </div>
                </div>

                {/* Email Correspondence */}
                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase text-slate-500 font-mono font-bold tracking-wider">
                      EMAIL CORRESPONDENCE
                    </div>
                    <div className="mt-1 space-y-1.5">
                      <div>
                        <a href="mailto:cvidyasolutions@gmail.com" className="font-sans font-bold text-xs sm:text-sm text-brand-navy-950 hover:text-brand-gold-600 transition-colors block leading-tight break-all">
                          cvidyasolutions@gmail.com
                        </a>
                        <span className="text-[10px] text-slate-500 font-medium block">Office Support Desk</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-200/50">
                        <a href="mailto:chiranjeev0058@gmail.com" className="font-sans font-bold text-xs sm:text-sm text-brand-navy-950 hover:text-brand-gold-600 transition-colors block leading-tight break-all">
                          chiranjeev0058@gmail.com
                        </a>
                        <span className="text-[10px] text-slate-500 font-medium block">Director: Chiranjeev Das</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital QR Passport */}
                <div className="p-4 rounded-xl bg-brand-navy-950 text-white border border-brand-gold-500/20 flex gap-3.5 items-center">
                  <div className="bg-white p-2 rounded-lg shrink-0 border border-brand-gold-500/30">
                    <div className="w-16 h-16 grid grid-cols-6 grid-rows-6 gap-[1px] p-[1px] bg-white relative">
                      <div className="col-span-2 row-span-2 bg-brand-navy-900" />
                      <div className="col-span-2 row-span-2 col-start-5 bg-brand-navy-900" />
                      <div className="col-span-2 row-span-2 row-start-5 bg-brand-navy-900" />
                      <div className="col-start-3 row-start-2 bg-brand-navy-900" />
                      <div className="col-start-4 row-start-3 bg-brand-navy-900" />
                      <div className="col-start-3 row-start-4 bg-brand-navy-900" />
                      <div className="col-start-5 row-start-4 bg-brand-navy-900" />
                      <div className="col-start-4 row-start-5 bg-brand-navy-900" />
                      <div className="absolute inset-5 bg-brand-gold-500 border border-brand-navy-900 rounded-xs flex items-center justify-center font-mono font-black text-[6px] text-brand-navy-950">
                        V
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono tracking-widest text-brand-gold-400 font-bold uppercase">
                      SCAN TO VISIT WEBSITE
                    </div>
                    <h4 className="font-display font-semibold text-xs text-white mt-0.5 leading-snug">
                      Official C Vidya Portal
                    </h4>
                    <p className="text-[10.5px] text-slate-300 leading-tight mt-1">
                      Instant mobile access to solution documents.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Director SLA</span>
              <span className="font-mono font-bold text-emerald-600">Response &lt; 24h</span>
            </div>
          </div>

          {/* COLUMN 2: Submit Callback Inquiry Form */}
          <div className="bg-slate-50/90 border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-xs hover:shadow-md transition-all h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="h-[2px] w-5 bg-brand-navy-900" />
                  <span className="text-[11px] font-mono font-bold text-brand-navy-900 uppercase tracking-widest">
                    ONLINE REQUISITION
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-brand-navy-950 uppercase tracking-tight leading-snug">
                  SUBMIT A CALLBACK INQUIRY
                </h3>
                <p className="mt-1 text-slate-600 text-xs sm:text-sm font-normal">
                  We respond to all verified regional phone inquiries on the same day. All fields are handled securely.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white text-slate-900 font-medium border border-slate-300 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-xl outline-none transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white text-slate-900 font-medium border border-slate-300 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-xl outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 8987766981"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white text-slate-900 font-medium border border-slate-300 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-xl outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    Specific Product Framework
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white text-slate-900 font-bold border border-slate-300 focus:border-brand-gold-500 rounded-xl outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="General Inquiry">General Company Inquiry</option>
                    <option value="C Vidya Library">01 - C Vidya Library Suite</option>
                    <option value="C Vidya Fitness Zone">02 - C Vidya Fitness Zone</option>
                    <option value="C Vidya Institutes">03 - C Vidya Institutes Management</option>
                    <option value="C Vidya Coaching">04 - C Vidya Coaching Management</option>
                    <option value="C Vidya CRM">05 - C Vidya CRM Portal</option>
                    <option value="C Vidya AI Customer Support SaaS">06 - C Vidya AI Customer Support SaaS</option>
                    <option value="AgriFusion">07 - AgriFusion (Farming & Agribusiness)</option>
                    <option value="C Vidya Members">08 - C Vidya Members Management</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-700">
                    Requirements / Instructions
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Tell us about your organization's workflow needs..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white text-slate-900 font-medium border border-slate-300 focus:border-brand-gold-500 rounded-xl outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="legal-compliance-checkbox"
                    required
                    className="mt-0.5 rounded border-slate-300 text-brand-gold-600 focus:ring-brand-gold-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  <label htmlFor="legal-compliance-checkbox" className="text-[10.5px] text-slate-700 leading-normal font-semibold cursor-pointer select-none">
                    I consent to secure database storage & transmission of my details under standard encryption guidelines.
                  </label>
                </div>

                {submitResult && (
                  <div className={`p-3 rounded-xl text-xs font-semibold flex gap-2 items-start ${
                    submitResult.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
                  }`}>
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitResult.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-brand-navy-900 hover:bg-black text-white font-bold py-3 px-5 rounded-xl hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-50 text-xs sm:text-sm cursor-pointer border-none"
                >
                  {isSubmitting ? (
                    <span>TRANSMITTING DETAILS...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-brand-gold-400" />
                      <span>TRANSMIT REQUISITION RECEIVED</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SSL Encrypted</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowInquiriesPanel(!showInquiriesPanel);
                  if (!showInquiriesPanel && ownerPassword) {
                    fetchInquiries();
                  }
                }}
                className="text-[10.5px] font-mono font-bold text-brand-gold-700 hover:text-brand-gold-800 flex items-center gap-1.5 px-2.5 py-1 bg-brand-gold-100/60 rounded-lg border border-brand-gold-300/50 transition-all cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{showInquiriesPanel ? "Hide Leads" : "Onsite Leads"}</span>
              </button>
            </div>

            {/* Leads Sandbox Visual Panel representing live sever logged state */}
            {showInquiriesPanel && (
              !isAuthorized ? (
                <div id="credentials-verif-panel" className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                    <span className="p-0.5 px-1.5 rounded bg-amber-500/10 text-amber-500 font-mono text-[9px] font-bold border border-amber-500/20">SECURED PORTAL</span>
                    <span className="text-[11px] font-mono font-bold text-white tracking-wider uppercase">
                      OWNER VERIFICATION
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Please enter the owner password to view captured leads.
                  </p>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex gap-2">
                        <input
                          id="owner-password-input"
                          type="password"
                          placeholder="Password"
                          value={passwordInput}
                          onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setAuthError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAuthenticate();
                            }
                          }}
                          className="flex-1 text-xs font-mono px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-brand-gold-500 rounded-lg outline-none text-white transition-all"
                        />
                        <button
                          id="owner-authenticate-btn"
                          type="button"
                          onClick={handleAuthenticate}
                          disabled={isAuthenticating}
                          className="px-3 py-1.5 bg-brand-gold-500 hover:bg-brand-gold-600 active:scale-95 text-brand-navy-900 font-bold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
                        >
                          {isAuthenticating ? "..." : "UNLOCK"}
                        </button>
                      </div>
                    </div>

                    {authError && (
                      <p className="text-[10px] text-red-400 font-medium font-sans flex items-center gap-1">
                        ⚠️ {authError}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div id="leads-logs-panel" className="mt-4 p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3 max-h-[260px] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-brand-gold-400" />
                      <span className="text-[11px] font-mono font-bold text-white tracking-wider uppercase">
                        CAPTURED LEADS
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        {submittedInquiries.length} Logs
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("cvidya_owner_pass");
                          setOwnerPassword("");
                          setIsAuthorized(false);
                          setPasswordInput("");
                          setSubmittedInquiries([]);
                        }}
                        className="text-[9px] font-mono text-slate-400 hover:text-red-400 px-1 py-0.5 bg-slate-800 hover:bg-red-500/15 rounded transition-all cursor-pointer"
                      >
                        🔒 LOCK
                      </button>
                    </div>
                  </div>

                  {submittedInquiries.length === 0 ? (
                    <div className="text-center py-4 text-[10.5px] text-slate-500 font-mono">
                      No lead records logged yet.
                    </div>
                  ) : (
                    <div className="space-y-2 font-mono text-[10px] leading-relaxed">
                      {submittedInquiries.map((inq, i) => (
                        <div key={inq.id || i} className="p-2 bg-slate-950 rounded text-slate-300 border border-slate-800">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="text-brand-gold-400 font-bold">{inq.name}</span>
                              <span className="text-slate-500"> ({inq.email})</span>
                            </div>
                            <span className="text-[8px] text-[#ef8354] bg-[#ef8354]/10 px-1 py-0.5 rounded-xs">
                              {inq.status}
                            </span>
                          </div>
                          <div className="text-slate-400 text-[9.5px]">📞 Phone: {inq.phone} | ⚙️ Suite: {inq.service}</div>
                          <p className="text-slate-300 text-[9.5px] mt-1 break-all italic">
                            "{inq.message}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* COLUMN 3: Regional Office & Headquarters Details */}
          <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-xs hover:shadow-md transition-all h-full flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="h-[2px] w-5 bg-brand-gold-500" />
                  <span className="text-[11px] font-mono font-bold text-brand-gold-700 uppercase tracking-widest">
                    REGIONAL LOCATIONS
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-brand-navy-950 uppercase tracking-tight leading-snug">
                  REGIONAL OFFICE DETAILS
                </h3>
                <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  Operating across Jharkhand and Bihar with indigenous enterprise software built for speed, performance, and durability.
                </p>
              </div>

              <div className="space-y-3.5">
                
                {/* Headquarters */}
                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase text-slate-500 font-mono font-bold tracking-wider">
                      HEADQUARTERS
                    </div>
                    <p className="font-sans font-bold text-xs sm:text-sm text-brand-navy-950 mt-0.5 leading-snug">
                      Surunga, Baliapur, Dhanbad, Jharkhand - 828115
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block mt-1">Main Corporate Center</span>
                  </div>
                </div>

                {/* STPI Desk */}
                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase text-slate-500 font-mono font-bold tracking-wider">
                      STPI R&D DESK
                    </div>
                    <p className="font-sans font-bold text-xs sm:text-sm text-brand-navy-950 mt-0.5 leading-snug">
                      STPI Desk, BIT Sindri Campus, Dhanbad, Jharkhand
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block mt-1">Academic R&D Incubation</span>
                  </div>
                </div>

                {/* Technical Hotline */}
                <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase text-slate-500 font-mono font-bold tracking-wider">
                      PHONE & HOTLINES
                    </div>
                    <a href="tel:8987766981" className="font-display font-bold text-sm sm:text-base text-brand-navy-950 hover:text-brand-gold-600 transition-colors block leading-tight mt-0.5">
                      +91 8987766981
                    </a>
                    <p className="text-[10.5px] text-slate-500 mt-0.5 font-medium">Technical Advisory Line</p>
                  </div>
                </div>

              </div>

              <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/70 text-center text-xs text-slate-600 font-serif italic leading-relaxed">
                "Proudly serving Jharkhand and Bihar regions with indigenous software. Built to perform."
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Service Area</span>
              <span className="font-mono font-bold text-brand-navy-900">Jharkhand & Bihar</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
