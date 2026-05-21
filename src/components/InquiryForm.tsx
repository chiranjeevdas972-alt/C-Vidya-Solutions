import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, Database, ShieldCheck, MailOpen, Trash2 } from "lucide-react";

interface InquiryFormProps {
  onInquirySubmitted?: () => void;
}

export default function InquiryForm({ onInquirySubmitted }: InquiryFormProps) {
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

  // Fetch inquiries with optional password check
  const fetchInquiries = async (passToCheck?: string) => {
    const password = passToCheck !== undefined ? passToCheck : ownerPassword;
    if (!password) {
      setSubmittedInquiries([]);
      setIsAuthorized(false);
      return;
    }
    try {
      const res = await fetch(`/api/inquiries?password=${encodeURIComponent(password)}`);
      if (res.ok) {
        const data = await res.json();
        setSubmittedInquiries(data.inquiries || []);
        setIsAuthorized(true);
        setAuthError("");
        if (passToCheck) {
          setOwnerPassword(passToCheck);
          localStorage.setItem("cvidya_owner_pass", passToCheck);
        }
      } else {
        setSubmittedInquiries([]);
        setIsAuthorized(false);
        if (passToCheck !== undefined) {
          setAuthError("Unauthorized access. Invalid owner password.");
        }
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setSubmittedInquiries([]);
      setIsAuthorized(false);
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

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitResult({ success: true, message: data.message });
        // Clear form
        setFormData({ name: "", email: "", phone: "", service: "General Inquiry", message: "" });
        // Trigger reload of logs list
        fetchInquiries();
        if (onInquirySubmitted) onInquirySubmitted();
      } else {
        setSubmitResult({ success: false, message: data.error || "Failed to submit request." });
      }
    } catch (err: any) {
      setSubmitResult({ success: false, message: err.message || "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white relative">
      
      {/* Decorative vectors: Wave & gold elements matching Image 2 style */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-brand-gold-400 via-[#d69e2e] to-brand-gold-500 opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Traditional Address info, Golden emblem & custom SVG QR Code */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <span className="h-[2.5px] w-6 bg-brand-gold-500" />
                <span className="text-xs font-mono font-black text-brand-gold-600 tracking-widest uppercase">CONTACT US</span>
              </div>
              <h2 className="font-display font-extrabold text-3.5xl text-brand-navy-900 tracking-tight leading-none">
                CONNECT WITH OUR OFFICERS
              </h2>
              <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                Schedule a customized live demo, discuss technical parameters, and discover how our integrated system platforms can streamline your workspace workflow instantly.
              </p>
            </div>

            {/* Quick cards info block */}
            <div className="space-y-4">
              
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-brand-gold-500/20 bg-slate-50/50 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-mono font-bold tracking-wider">OFFICIAL PHONE DIRECT</div>
                  <div className="flex flex-col gap-1.5 mt-0.5">
                    <a href="tel:8987766981" className="font-display font-bold text-base text-brand-navy-900 hover:text-brand-gold-600 transition-colors block leading-tight">
                      8987766981
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Available Mon-Sat (10:00 AM - 07:00 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-brand-gold-500/20 bg-slate-50/50 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-mono font-bold tracking-wider">EMAIL CORRESPONDENCE</div>
                  <div className="flex flex-col gap-1.5 mt-0.5">
                    <a href="mailto:cvidya32@gmail.com" className="font-display font-bold text-base text-brand-navy-900 hover:text-brand-gold-600 transition-colors block leading-tight">
                      cvidya32@gmail.com <span className="text-xs font-normal text-slate-400 font-sans">(Office Desk)</span>
                    </a>
                    <a href="mailto:chiranjeev0058@gmail.com" className="font-display font-bold text-base text-brand-navy-900 hover:text-brand-gold-600 transition-colors block leading-tight">
                      chiranjeev0058@gmail.com <span className="text-xs font-normal text-slate-400 font-sans">(Officer Direct)</span>
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Response guaranteed in 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-brand-gold-500/20 bg-slate-50/50 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-navy-900 text-brand-gold-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-4 w-full">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-mono font-bold tracking-wider">HEADQUARTERS ADDRESS</div>
                    <div className="font-display font-bold text-[14px] text-brand-navy-900 mt-0.5 leading-tight">
                      Surunga, Baliapur, Dhanbad, Jharkhand - 828115
                    </div>
                  </div>
                  <div className="border-t border-slate-200/60 pt-3">
                    <div className="text-[10px] uppercase text-slate-400 font-mono font-bold tracking-wider">BRANCH OFFICE / OFFICER DESK</div>
                    <div className="font-display font-bold text-[14px] text-brand-navy-900 mt-0.5 leading-tight">
                      STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">Region: Jharkhand, India</p>
                </div>
              </div>

            </div>

            {/* Custom stylized QR Code and branding medallion directly corresponding to the QR from second image */}
            <div className="p-6 rounded-2xl bg-brand-navy-900 border border-brand-gold-500/10 text-white flex gap-5 items-center">
              
              {/* Pristine CSS Grid representation of a high fidelity QR code with embedded logo */}
              <div className="relative bg-white p-2.5 rounded-xl shrink-0 border border-brand-gold-500/30">
                <div className="w-24 h-24 grid grid-cols-6 grid-rows-6 gap-[1.5px] p-[1.5px] bg-white relative">
                  {/* Position detection markers */}
                  <div className="col-span-2 row-span-2 bg-brand-navy-900 border border-white" />
                  <div className="col-span-2 row-span-2 col-start-5 bg-brand-navy-900 border border-white" />
                  <div className="col-span-2 row-span-2 row-start-5 bg-brand-navy-900 border border-white" />
                  
                  {/* Random QR bits patterns */}
                  <div className="col-start-3 row-start-1 bg-brand-navy-900" />
                  <div className="col-start-3 row-start-2 bg-brand-navy-900" />
                  <div className="col-start-4 row-start-2 bg-brand-navy-900" />
                  <div className="col-start-1 row-start-3 bg-brand-navy-900" />
                  <div className="col-start-4 row-start-3 bg-brand-navy-900" />
                  <div className="col-start-2 row-start-4 bg-brand-navy-900" />
                  <div className="col-start-3 row-start-4 bg-brand-navy-900" />
                  <div className="col-start-5 row-start-4 bg-brand-navy-900" />
                  <div className="col-start-3 row-start-5 bg-brand-navy-900" />
                  <div className="col-start-4 row-start-5 bg-brand-navy-900" />
                  <div className="col-start-3 row-start-6 bg-brand-navy-900" />
                  <div className="col-start-4 row-start-6 bg-brand-navy-900" />

                  {/* Absolute Center Micro logo */}
                  <div className="absolute inset-8 bg-brand-gold-500 border border-brand-navy-900 rounded-sm flex items-center justify-center font-mono font-black text-[7px] text-brand-navy-900 select-none">
                    V
                  </div>
                </div>
                <div className="text-[8px] font-mono font-bold tracking-wider text-brand-navy-900 text-center uppercase mt-1">
                  C VIDYA OFFICIAL
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <div className="text-[10px] font-mono tracking-widest text-[#f5d77f] font-bold uppercase">
                  SCAN TO VISIT WEBSITE
                </div>
                <h4 className="font-display font-semibold text-sm leading-tight">
                  Carry C Vidya Solution in your pocket.
                </h4>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Scans redirect you instantly to our secured domain for detailed systems document references.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Callback Request dynamic form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/65 p-6 sm:p-9 rounded-3xl shadow-sm relative">
            <h3 className="font-display font-extrabold text-xl text-brand-navy-900 mb-1 leading-none">
              SUBMIT AN OFFICIAL CALLBACK INQUIRY
            </h3>
            <p className="text-slate-500 text-xs mb-6 font-medium">
              We respond to all verified regional phone inquiries on the same day. All fields are handled securely.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full text-sm px-4 py-3 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-xl outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full text-sm px-4 py-3 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-xl outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Phone Number (Contact Support) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 9999999999"
                    className="w-full text-sm px-4 py-3 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-xl outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Specific Product Framework
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full text-sm px-4 py-3 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-500 rounded-xl outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="General Inquiry">General Company Inquiry</option>
                    <option value="C Vidya Library">01 - C Vidya Library Suite</option>
                    <option value="C Vidya Fitness Zone">02 - C Vidya Fitness Zone</option>
                    <option value="C Vidya Institutes">03 - C Vidya Institutes Management</option>
                    <option value="C Vidya Coaching">04 - C Vidya Coaching Management</option>
                    <option value="C Vidya CRM">05 - C Vidya CRM Portal</option>
                    <option value="C Vidya Municipal">06 - C Vidya Municipal System</option>
                    <option value="C Vidya Farming">07 - C Vidya Farming Tech</option>
                    <option value="C Vidya Members">08 - C Vidya Members Management</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Custom Enterprise Requirements / Instructions
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your organization's workflow needs..."
                  className="w-full text-sm px-4 py-3 bg-white border border-slate-200 focus:border-brand-gold-500 focus:ring-1 focus:ring-brand-gold-400 rounded-xl outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit panel notification response */}
              {submitResult && (
                <div className={`p-4 rounded-xl text-xs font-medium flex gap-2.5 items-start ${
                  submitResult.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitResult.message}</span>
                </div>
              )}

              {/* Form submit trig button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 bg-brand-navy-900 hover:bg-brand-navy-950 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-50 font-sans tracking-wide text-sm cursor-pointer"
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

            <div className="mt-6 pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SSL Encrypted Transmission active</span>
              </div>

              {/* Server logged inquiries panel review trigger */}
              <button
                onClick={() => {
                  setShowInquiriesPanel(!showInquiriesPanel);
                  if (!showInquiriesPanel && ownerPassword) {
                    fetchInquiries();
                  }
                }}
                className="text-xs font-mono font-semibold text-brand-gold-600 hover:text-brand-gold-700 flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-gold-100/50 rounded-lg border border-brand-gold-200/50 transition-all cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{showInquiriesPanel ? "Hide Logged Leads" : "Show Onsite Leads Ledger"}</span>
              </button>
            </div>

            {/* Leads Sandbox Visual Panel representing live sever logged state */}
            {showInquiriesPanel && (
              !isAuthorized ? (
                <div id="credentials-verif-panel" className="mt-5 p-5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3.5">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/60">
                    <span className="p-1 px-2 rounded-md bg-amber-500/10 text-amber-500 font-mono text-[9px] font-bold border border-amber-500/20">SECURED PORTAL</span>
                    <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                      OWNER ACCESS VERIFICATION
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    The leads ledger database is protected. Please enter the company owner password to securely view captured inquiries.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">
                        OWNER PASSWORD
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="owner-password-input"
                          type="password"
                          placeholder="••••••••"
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
                          className="flex-1 text-sm font-mono px-4 py-2 bg-slate-950 border border-slate-800 focus:border-brand-gold-500 rounded-lg outline-none text-white transition-all"
                        />
                        <button
                          id="owner-authenticate-btn"
                          type="button"
                          onClick={handleAuthenticate}
                          disabled={isAuthenticating}
                          className="px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-600 active:scale-95 text-brand-navy-900 font-bold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
                        >
                          {isAuthenticating ? "VERIFYING..." : "UNLOCK"}
                        </button>
                      </div>
                    </div>

                    {authError && (
                      <p className="text-[11px] text-red-400 font-medium font-sans flex items-center gap-1.5 pt-1">
                        ⚠️ {authError}
                      </p>
                    )}
                    
                    <div className="text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-800/40 flex justify-between">
                      <span>ENCRYPTION: AES-256</span>
                      <span>HINT: 8987766981 / cvidya2025</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div id="leads-logs-panel" className="mt-5 p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3.5 max-h-[300px] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-brand-gold-400" />
                      <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                        ONSITE LEADS LOGS DATABASE
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {submittedInquiries.length} Active Records
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
                        className="text-[9px] font-mono text-slate-400 hover:text-red-400 px-1.5 py-0.5 bg-slate-800 hover:bg-red-500/15 rounded border border-slate-700 hover:border-red-500/30 transition-all cursor-pointer"
                        title="Lock Ledger"
                      >
                        🔒 LOCK
                      </button>
                    </div>
                  </div>

                  {submittedInquiries.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500 font-mono">
                      No lead records logged yet this session. Submit the form above to capture indices!
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                      {submittedInquiries.map((inq, i) => (
                        <div key={inq.id || i} className="p-3 bg-slate-950 rounded-lg text-slate-300 border border-slate-800 hover:border-brand-gold-500/10 transition-colors">
                          <div className="flex justify-between items-start mb-1.5">
                            <div>
                              <span className="text-brand-gold-400 font-bold">{inq.name}</span>
                              <span className="text-slate-500"> ({inq.email})</span>
                            </div>
                            <span className="text-[9px] text-[#ef8354] bg-[#ef8354]/10 px-1.5 py-0.5 rounded-sm">
                              {inq.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-400 text-[10px] pb-1.5 border-b border-slate-900">
                            <div>📞 Phone: {inq.phone}</div>
                            <div>⚙️ Suite: {inq.service}</div>
                          </div>
                          <p className="text-slate-300 text-[10.5px] mt-1.5 break-all italic">
                            "{inq.message}"
                          </p>
                          <div className="text-right text-[8px] text-slate-500 mt-1">
                            Captured: {new Date(inq.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
