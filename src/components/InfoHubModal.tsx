import { useState, useEffect } from "react";
import { 
  X, BookOpen, Briefcase, FileText, PhoneCall, Award, Users, MapPin, 
  ChevronRight, Calendar, ArrowUpRight, GraduationCap, Building2, CheckCircle2, ShieldCheck, Mail, Send, Search, Check
} from "lucide-react";
import { rolesData, CATEGORIES, type CareerRole } from "../careersData";
import InquiryForm from "./InquiryForm";

interface InfoHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: "home" | "about" | "services" | "portfolio" | "contact" | "careers" | "blog";
}

export default function InfoHubModal({ isOpen, onClose, initialTab }: InfoHubModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [jobApplied, setJobApplied] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // New interactive job search & application states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyingForRole, setApplyingForRole] = useState<CareerRole | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantExperience, setApplicantExperience] = useState("Student / Intern");
  const [applicantMessage, setApplicantMessage] = useState("");
  const [applicationSubmittedSuccess, setApplicationSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setJobApplied("");
      setNewsletterSubscribed(false);
      setSearchQuery("");
      setSelectedCategory("All");
      setShowApplyForm(false);
      setApplyingForRole(null);
      setApplicantName("");
      setApplicantEmail("");
      setApplicantPhone("");
      setApplicantExperience("Student / Intern");
      setApplicantMessage("");
      setApplicationSubmittedSuccess(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs = [
    { id: "home", label: "Home Overview" },
    { id: "services", label: "Services Suite" },
    { id: "portfolio", label: "Portfolio & Case Studies" },
    { id: "contact", label: "Contact with Us" },
    { id: "careers", label: "Careers & Internships" },
    { id: "blog", label: "C Vidya Blog" },
  ] as const;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("cvidyasolutions@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent dark background */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
      />

      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 font-sans animate-fade-in">
        
        {/* Modal Premium Header */}
        <div className="bg-brand-navy-900 px-6 py-4.5 border-b border-brand-gold-500 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-gold-500/10 text-brand-gold-400 flex items-center justify-center border border-brand-gold-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm tracking-wider text-slate-100 uppercase">
                C Vidya Solution • Feature Hub
              </h3>
              <p className="text-[10px] font-mono text-brand-gold-400 leading-none mt-0.5 uppercase">
                Explore our full digital software ecosystem
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 active:scale-95 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs for the Hub */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-100 shrink-0 text-xs font-bold text-slate-800 font-mono tracking-wide">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id 
                  ? "border-brand-gold-500 bg-white text-brand-navy-900 font-extrabold" 
                  : "border-transparent hover:bg-slate-200 text-slate-700 hover:text-brand-navy-950"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Dynamic Body Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs md:text-sm leading-relaxed flex-1">
          
          {/* TAB: HOME OVERVIEW */}
          {activeTab === "home" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 bg-gradient-to-r from-brand-navy-950 to-brand-navy-900 text-white rounded-2xl border border-brand-gold-500/20 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <span className="font-mono text-[9px] text-brand-gold-400 uppercase font-black tracking-widest block mb-1">
                    ESTD 2025 • REGISTERED & OPERATIONAL
                  </span>
                  <h4 className="font-display font-black text-lg md:text-xl text-slate-100 leading-tight mb-2">
                    Powering Institutional Excellence & Civic Smart Infrastructure
                  </h4>
                  <p className="text-[12px] text-slate-300 leading-relaxed">
                    C Vidya Solution is a leading SaaS provider developing robust, secure enterprise and educational web suites. Rooted in Dhanbad, Jharkhand, with our STPI Branch at BIT Sindri Campus, we empower libraries, schools, coaching institutes, municipal bodies, and clubs with state-of-the-art automated systems.
                  </p>
                </div>
                {/* Visual book background effect */}
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 font-mono text-[120px] font-black select-none pointer-events-none">
                  CV
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-200 bg-slate-100 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold-100 flex items-center justify-center text-brand-gold-800">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-brand-navy-900 text-xs uppercase tracking-wide">STPI Research Branch</h5>
                  <p className="text-[12px] text-black leading-normal font-bold">
                    Located at STPI Sindri inside the BIT Sindri Campus, our development facility works directly on next-generation educational technologies.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 bg-slate-100 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold-100 flex items-center justify-center text-brand-gold-800">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-brand-navy-900 text-xs uppercase tracking-wide">Safe & Secure Stack</h5>
                  <p className="text-[12px] text-black leading-normal font-bold">
                    Fully compliant with CCPA, GDPR guidelines and the IT Act 2000. All inquiry forms and admin backends are guarded against cyber injection vectors.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 bg-slate-100 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold-100 flex items-center justify-center text-brand-gold-800">
                    <Users className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-brand-navy-900 text-xs uppercase tracking-wide">Founder-led Direction</h5>
                  <p className="text-[12px] text-black leading-normal font-bold">
                    Headed by Director and Founder Chiranjeev Das, bringing dedicated technology engineering and local operational excellence to Jharkhand.
                  </p>
                </div>
              </div>

              <div className="p-4.5 bg-slate-50/50 rounded-xl border border-slate-100">
                <h5 className="font-bold text-slate-800 text-xs mb-2 uppercase tracking-wide">Key Platform Capabilities:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11.5px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Real-time Biometric Integration Systems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automated SMS/WhatsApp Billing & Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Structured e-Governance Citizen Registrars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>OMR Offline Grading Mock Sheet Processors</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SERVICES SUITE */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm uppercase mb-1">
                  C Vidya Integrated Product Suite (01 - 08)
                </h4>
                <p className="text-xs text-slate-700 font-semibold mb-4">
                  Explore complete technical specs of our modular enterprise modules.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-brand-gold-600 font-bold">MODULE 01 & 03</span>
                    <span className="text-[10.5px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">Ready</span>
                  </div>
                  <h5 className="font-bold text-brand-navy-900 text-xs">C Vidya Library & Institutes</h5>
                  <p className="text-[12px] text-black leading-relaxed font-bold">
                    Facilitates automated barcode scanners, student catalog check-outs, WhatsApp notification alerts, term average tracking, downloadable academic ledgers, CBSE score compilations, and parent dashboards.
                  </p>
                </div>

                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-brand-gold-600 font-bold">MODULE 02 & 08</span>
                    <span className="text-[10.5px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">Ready</span>
                  </div>
                  <h5 className="font-bold text-brand-navy-900 text-xs">C Vidya Fitness Zone & Club Management</h5>
                  <p className="text-[12px] text-black leading-relaxed font-bold">
                    Provides biometric turnstile gateways, facial scanner check-ins, custom member dietary cards, membership pass renewals, facility managers, court bookings, and societies registers.
                  </p>
                </div>

                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-brand-gold-600 font-bold">MODULE 04 & 05</span>
                    <span className="text-[10.5px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">Ready</span>
                  </div>
                  <h5 className="font-bold text-brand-navy-900 text-xs">C Vidya Coaching Suite & CRM</h5>
                  <p className="text-[12px] text-black leading-relaxed font-bold">
                    Features offline OMR grading scanners, automatic absent parent alerts, active batch schedulers, custom sales funnel boards, pre-formatted invoices, and telecom dialer logs.
                  </p>
                </div>

                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-brand-gold-600 font-bold">MODULE 06 & 07</span>
                    <span className="text-[10.5px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase">In Production</span>
                  </div>
                  <h5 className="font-bold text-brand-navy-900 text-xs">Municipal System & Smart Farming</h5>
                  <p className="text-[12px] text-black leading-relaxed font-bold">
                    Handles online grievance registers (roads, waste management), citizen certificate issuing (birth, death, marriage), property tax registers, IoT soil telemetry registers, and storage log allocators.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO & CASE STUDIES */}
          {activeTab === "portfolio" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm uppercase mb-1">
                  Real-World Case Studies & Operational Portfolio
                </h4>
                <p className="text-xs text-black font-extrabold mb-4">
                  Review how our software systems perform in live institutional settings.
                </p>
              </div>

              <div className="space-y-5">
                {/* Case 1 */}
                <div className="p-5 border border-slate-200 bg-slate-100 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy-900 text-brand-gold-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="font-bold text-brand-navy-900 text-sm uppercase tracking-wide">1. Dhanbad Central Library Digitalization</h5>
                      <span className="text-[10px] font-mono font-bold bg-brand-gold-100 text-brand-gold-900 px-2 py-0.5 rounded">Success Story</span>
                    </div>
                    <p className="text-[12px] text-black font-bold">
                      <strong>The Challenge:</strong> Tracking 25,000+ volumes, 1,200 active student reading cards, and manual receipt registries resulted in severe record loss and overdue book delays.
                    </p>
                    <p className="text-[12px] text-black font-black">
                      <strong>Our Solution:</strong> Integrated C Vidya Library suite with custom ISBN barcode readers, automatic daily WhatsApp alerts to students, and biometric check-ins. Reduced book loss to 0% within 4 months.
                    </p>
                  </div>
                </div>

                {/* Case 2 */}
                <div className="p-5 border border-slate-200 bg-slate-100 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy-900 text-brand-gold-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="font-bold text-brand-navy-900 text-sm uppercase tracking-wide">2. STPI Sindri Academic Testing Hub</h5>
                      <span className="text-[10px] font-mono font-bold bg-brand-gold-100 text-brand-gold-900 px-2 py-0.5 rounded">Lab Deployment</span>
                    </div>
                    <p className="text-[12px] text-black font-bold">
                      <strong>The Challenge:</strong> High school and IIT-JEE aspirants' mock test sheets took up to 6 days to manually evaluate, hindering prompt student feedback cycles.
                    </p>
                    <p className="text-[12px] text-black font-black">
                      <strong>Our Solution:</strong> Set up a centralized OMR mockup scanner in the server room, utilizing C Vidya Coaching's image processing scripts. Mock scorecards and state ranks are now automatically broadcast via SMS within 4 hours.
                    </p>
                  </div>
                </div>

                {/* Case 3 */}
                <div className="p-5 border border-slate-200 bg-slate-100 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy-900 text-brand-gold-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="font-bold text-brand-navy-900 text-sm uppercase tracking-wide">3. local Civic body E-Governance portal</h5>
                      <span className="text-[10px] font-mono font-bold bg-brand-gold-100 text-brand-gold-900 px-2 py-0.5 rounded">Pilot Program</span>
                    </div>
                    <p className="text-[12px] text-black font-bold">
                      <strong>The Challenge:</strong> Citizens traveling long distances to municipal headquarters in Dhanbad district to file basic pothole, leak, and waste grievances.
                    </p>
                    <p className="text-[12px] text-black font-black">
                      <strong>Our Solution:</strong> Implemented the C Vidya Municipal smart e-Grievance dashboard. Citizens pin coordinates and upload photos; tickets are instantly assigned to ward crews with GPS logs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACT US CHANNELS */}
          {activeTab === "contact" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm uppercase mb-1">
                  Contact with Us & Official Communication Channels
                </h4>
                <p className="text-xs text-slate-700 font-semibold mb-4">
                  Connect with our management team and regional branches directly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 border border-slate-200 bg-slate-100 rounded-2xl space-y-4">
                  <h5 className="font-bold text-brand-navy-900 text-xs uppercase tracking-wide border-b border-slate-200/60 pb-2">
                    Official Head Office (Dhanbad)
                  </h5>
                  <div className="space-y-2.5 text-xs text-slate-900">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-brand-gold-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>HQ Address:</strong>
                        <p className="text-slate-900 font-semibold">Surunga, Baliapur, Dhanbad, Jharkhand - 828115</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-brand-gold-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>R&D Branch Address:</strong>
                        <p className="text-slate-900 font-semibold">STPI Sindri, BIT Sindri Campus, Dhanbad, Jharkhand</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-4">
                  <h5 className="font-bold text-brand-navy-900 text-xs uppercase tracking-wide border-b border-slate-200/60 pb-2">
                    Direct Team Lines & Emails
                  </h5>
                  <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
                      <div>
                        <span className="text-[10px] text-slate-700 block font-mono font-bold">PRIMARY HOTLINE</span>
                        <strong className="text-slate-950 font-black">+91 8987766981</strong>
                      </div>
                      <a href="tel:8987766981" className="p-2 bg-brand-navy-100 text-brand-navy-950 rounded-lg hover:bg-brand-navy-200 transition-colors">
                        <PhoneCall className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg">
                      <div>
                        <span className="text-[10px] text-slate-700 block font-mono font-bold">SUPPORT EMAIL</span>
                        <strong className="text-slate-950 font-black">cvidyasolutions@gmail.com</strong>
                      </div>
                      <button 
                        onClick={handleCopyEmail}
                        className="p-2 bg-brand-navy-100 text-brand-navy-950 rounded-lg hover:bg-brand-navy-200 transition-colors cursor-pointer text-[10px] font-bold"
                      >
                        {copiedEmail ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <div className="p-2 bg-amber-50 border border-amber-200/50 rounded-lg text-[11px] text-amber-800 leading-normal">
                      <strong>Director Contact Desk:</strong> Chiranjeev Das (<span className="font-mono">chiranjeev0058@gmail.com</span>). Callback requests typically receive active routing review within 24 business hours.
                    </div>
                  </div>
                </div>
              </div>

              {/* Seamlessly integrated Callback form */}
              <div className="border-t border-slate-200/60 pt-6">
                <InquiryForm isModal={true} />
              </div>
            </div>
          )}

          {/* TAB: CAREERS & INTERNSHIPS */}
          {activeTab === "careers" && (
            <div className="space-y-6 animate-fade-in text-slate-700">
              {/* Header Banner */}
              <div className="p-5 bg-brand-navy-950 text-white rounded-2xl border border-brand-gold-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] text-brand-gold-400 font-mono font-bold block uppercase tracking-widest mb-1">
                    C Vidya Solutions • STPI Campus R&D
                  </span>
                  <h4 className="font-display font-extrabold text-sm uppercase text-brand-gold-400 mb-1">
                    Careers & Student Internships Hub
                  </h4>
                  <p className="text-xs text-slate-300">
                    Explore high-growth career paths and pre-placement certified internship opportunities at our STPI Sindri Campus technology wing.
                  </p>
                </div>
              </div>

              {/* Application Form Overlay/Section */}
              {showApplyForm && applyingForRole ? (
                <div className="p-5 border border-brand-gold-500/30 bg-amber-50/40 rounded-2xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-brand-gold-500/20 pb-3">
                    <div>
                      <span className="text-[10px] text-brand-gold-600 font-mono font-bold block uppercase">Applying for:</span>
                      <h5 className="font-bold text-brand-navy-900 text-sm">{applyingForRole.title}</h5>
                      <span className="text-[10px] text-slate-500">{applyingForRole.category} • {applyingForRole.location}</span>
                    </div>
                    <button 
                      onClick={() => { setShowApplyForm(false); setApplicationSubmittedSuccess(false); }}
                      className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer border-none bg-transparent"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {applicationSubmittedSuccess ? (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold">Application Registered Successfully!</p>
                          <p className="text-[11.5px] leading-relaxed">
                            Thank you, <strong>{applicantName}</strong>. Your profile for the <strong>{applyingForRole.title}</strong> role has been securely queued in our tracking pipeline.
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-white border border-green-100 rounded-lg text-[11px] leading-relaxed text-slate-600">
                        <strong>Next Step:</strong> To expedite your selection review by Chiranjeev Das, please email your official CV and cover letter to <span className="font-mono font-bold text-brand-navy-900">cvidyasolutions@gmail.com</span> with the subject line <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">"Job Application: {applyingForRole.title} - {applicantName}"</span>.
                      </div>
                      <button 
                        onClick={() => { setShowApplyForm(false); setApplicationSubmittedSuccess(false); }}
                        className="w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-xs transition-colors cursor-pointer border-none"
                      >
                        Return to Career Directory
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!applicantName || !applicantEmail || !applicantPhone) {
                          alert("Please fill in your name, email, and contact number.");
                          return;
                        }
                        setApplicationSubmittedSuccess(true);
                        setJobApplied(applyingForRole.title);
                      }}
                      className="space-y-3.5 text-xs"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-800 font-black mb-1">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="John Doe"
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-gold-500 text-xs bg-white text-slate-950 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-800 font-black mb-1">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            placeholder="johndoe@example.com"
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-gold-500 text-xs bg-white text-slate-950 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-800 font-black mb-1">Mobile Contact *</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="e.g. +91 9876543210"
                            value={applicantPhone}
                            onChange={(e) => setApplicantPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-gold-500 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-800 font-black mb-1">Experience Level</label>
                          <select 
                            value={applicantExperience}
                            onChange={(e) => setApplicantExperience(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-gold-500 bg-white text-xs text-slate-950 font-bold"
                          >
                            <option value="Student / Intern">Student / Intern Candidate</option>
                            <option value="Fresher (Graduated)">Fresher (Graduated)</option>
                            <option value="1-2 Years Experience">1-2 Years Professional Experience</option>
                            <option value="3+ Years Experience">3+ Years Professional Experience</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-800 font-black mb-1">Brief Statement of Purpose</label>
                        <textarea 
                          rows={3}
                          placeholder="Tell us why you are interested in joining C Vidya Solutions..."
                          value={applicantMessage}
                          onChange={(e) => setApplicantMessage(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-brand-gold-500 text-xs bg-white text-slate-950 font-bold"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2.5 bg-brand-navy-900 text-white font-bold rounded-lg hover:bg-slate-950 text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm border-none"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Application for Review</span>
                      </button>
                    </form>
                  )}
                </div>
              ) : null}

              {/* Interactive Search & Filter Panel */}
              {!showApplyForm && (
                <div className="space-y-4">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search career tracks, technical stacks, or titles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand-gold-500 bg-white"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer bg-transparent border-none"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Horizontal Scrollable Category Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                          selectedCategory === cat 
                            ? "bg-brand-navy-900 border-brand-navy-900 text-white shadow-sm font-black" 
                            : "bg-white border-slate-300 text-slate-800 hover:border-brand-gold-500/40 font-bold"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Filtered Count indicator */}
                  <div className="flex items-center justify-between text-[11px] text-slate-800 font-mono font-bold">
                    <span>
                      SHOWING {rolesData.filter(role => {
                        const matchesCategory = selectedCategory === "All" || role.category === selectedCategory;
                        const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                              role.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                              role.category.toLowerCase().includes(searchQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                      }).length} OF {rolesData.length} OPEN RECRUITMENTS
                    </span>
                    <span>STPI branch Sindri • Dhanbad</span>
                  </div>

                  {/* Job List Directory Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                    {rolesData.filter(role => {
                      const matchesCategory = selectedCategory === "All" || role.category === selectedCategory;
                      const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            role.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            role.category.toLowerCase().includes(searchQuery.toLowerCase());
                      return matchesCategory && matchesSearch;
                    }).length === 0 ? (
                      <div className="col-span-2 text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-bold">No careers found matching "{searchQuery}"</p>
                        <p className="text-[10px] text-slate-400">Try selecting "All" categories or search with a different keyword.</p>
                      </div>
                    ) : (
                      rolesData.filter(role => {
                        const matchesCategory = selectedCategory === "All" || role.category === selectedCategory;
                        const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                              role.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                              role.category.toLowerCase().includes(searchQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                      }).map((role, idx) => (
                        <div 
                          key={idx} 
                          className="p-4 border border-slate-100 hover:border-brand-gold-500/30 bg-white rounded-xl shadow-sm hover:shadow transition-all flex flex-col justify-between space-y-3.5 group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9.5px] font-mono font-bold text-brand-gold-600 bg-brand-gold-50 px-2 py-0.5 rounded-md uppercase">
                                {role.category}
                              </span>
                              <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md ${
                                role.type === "Internship" 
                                  ? "bg-purple-50 text-purple-700" 
                                  : role.type === "Graduate Program" 
                                  ? "bg-amber-50 text-amber-700" 
                                  : "bg-emerald-50 text-emerald-700"
                              }`}>
                                {role.type}
                              </span>
                            </div>
                            <h5 className="font-bold text-brand-navy-900 text-[12.5px] group-hover:text-brand-gold-600 transition-colors">
                              {role.title}
                            </h5>
                            <p className="text-[12px] text-black leading-snug font-bold">
                              {role.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-[10.5px]">
                            <span className="text-slate-800 font-extrabold font-mono flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-800 shrink-0" />
                              <span>{role.location}</span>
                            </span>
                            <button 
                              onClick={() => {
                                setApplyingForRole(role);
                                setApplicantName("");
                                setApplicantEmail("");
                                setApplicantPhone("");
                                setApplicantMessage("");
                                setApplicationSubmittedSuccess(false);
                                setShowApplyForm(true);
                              }}
                              className="px-3.5 py-1.5 bg-brand-navy-50 text-brand-navy-900 hover:bg-brand-gold-500 hover:text-slate-900 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 border-none"
                            >
                              <span>Apply</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* General Disclaimer Card */}
              <div className="p-3.5 bg-brand-navy-50 border border-brand-navy-100 rounded-xl text-[11px] leading-relaxed text-brand-navy-900 flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-brand-navy-800 shrink-0 mt-0.5" />
                <div>
                  <strong>STPI Sindri Campus On-Site Requirements:</strong> Technical developers, interns, and analysts operate natively inside our research labs. Remote options are configured solely for pre-approved regional client system setups. For generic careers or trainee queries, write directly to <span className="font-mono font-bold">cvidyasolutions@gmail.com</span>.
                </div>
              </div>
            </div>
          )}

          {/* TAB: C VIDYA BLOG */}
          {activeTab === "blog" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-display font-extrabold text-brand-navy-900 text-sm uppercase mb-1">
                  C Vidya Solutions Academic & SaaS Blog
                </h4>
                <p className="text-xs text-black font-bold mb-4">
                  Expert insights on educational technology trends, digital libraries, and security.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Article 1 */}
                <article className="p-5 border border-slate-200 bg-slate-100 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-brand-gold-600 font-bold uppercase">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>June 24, 2026</span>
                    </div>
                    <h5 className="font-bold text-brand-navy-900 text-sm leading-snug">
                      Transforming Regional School Management with Biometric Guarding
                    </h5>
                    <p className="text-[12.5px] text-black leading-relaxed font-bold">
                      Manual ledger attendance in schools creates tracking gaps. We explore how facial scans and RFID gates linked to automated SMS pipelines boost student attendance tracking to 99%.
                    </p>
                  </div>
                  <button 
                    onClick={() => alert("Enjoy this article summary! Our complete newsletter with deep architecture graphs is sent to subscribed demo inquiry emails.")}
                    className="text-brand-navy-900 text-xs font-bold flex items-center gap-1 hover:text-brand-gold-600 transition-colors mt-2 self-start cursor-pointer"
                  >
                    <span>Read Article Summary</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </article>

                {/* Article 2 */}
                <article className="p-5 border border-slate-200 bg-slate-100 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-brand-gold-600 font-bold uppercase">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>May 18, 2026</span>
                    </div>
                    <h5 className="font-bold text-brand-navy-900 text-sm leading-snug">
                      The Automated Library: Safeguarding Regional Academic Inventories
                    </h5>
                    <p className="text-[12.5px] text-black leading-relaxed font-bold">
                      Lost reference books cost institutions heavily. Implementing ISBN scanning with timed SMS reminders creates automated circulation systems that protect your institutional investments.
                    </p>
                  </div>
                  <button 
                    onClick={() => alert("Enjoy this article summary! Our complete newsletter with deep architecture graphs is sent to subscribed demo inquiry emails.")}
                    className="text-brand-navy-900 text-xs font-bold flex items-center gap-1 hover:text-brand-gold-600 transition-colors mt-2 self-start cursor-pointer"
                  >
                    <span>Read Article Summary</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </article>
              </div>

              {/* Newsletter subscribe banner */}
              <div className="p-5 bg-slate-100 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-brand-navy-900 text-xs uppercase tracking-wide">Subscribe to C Vidya's Engineering News</h5>
                  <p className="text-[12px] text-black font-bold mt-0.5">Stay updated on our SaaS releases and regional deployment logs.</p>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                  <button
                    onClick={() => setNewsletterSubscribed(true)}
                    disabled={newsletterSubscribed}
                    className="w-full sm:w-auto px-4 py-2 bg-brand-navy-900 text-white rounded-xl text-xs font-bold hover:bg-slate-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-brand-gold-400" />
                    <span>{newsletterSubscribed ? "Subscribed Successfully!" : "Subscribe with Demo Email"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-between items-center shrink-0 text-slate-800 font-mono text-[10px] font-bold">
          <span>C VIDYA SOLUTION FEATURE CENTER</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer border border-slate-300"
          >
            Close Details Hub
          </button>
        </div>

      </div>
    </div>
  );
}
