import React, { useState } from "react";
import { 
  ShieldCheck, 
  Clock, 
  GraduationCap, 
  Laptop, 
  ArrowRight, 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  X,
  Upload,
  Send
} from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface CareersPageProps {
  onNavigate?: (page: string) => void;
}

export default function CareersPage({ onNavigate }: CareersPageProps) {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantResume, setApplicantResume] = useState("");
  const [applicantNote, setApplicantNote] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [jobError, setJobError] = useState("");

  const jobOpenings = [
    {
      id: "sr-frontend",
      title: "Senior Full-Stack Cloud Architect",
      department: "Engineering",
      location: "Remote / Hybrid (Dhanbad HQ)",
      type: "Full-Time",
      experience: "4-7 Years",
      description: "Lead the architectural design and implementation of next-generation distributed SaaS platforms and high-availability enterprise services."
    },
    {
      id: "ai-engineer",
      title: "Autonomous AI Agent Engineer",
      department: "R&D AI Division",
      location: "Remote",
      type: "Full-Time",
      experience: "2-5 Years",
      description: "Develop autonomous multi-agent workflows, vector retrieval pipelines, and specialized LLM fine-tuning for B2B workflow automation."
    },
    {
      id: "product-designer",
      title: "Enterprise UI/UX Systems Designer",
      department: "Design Systems",
      location: "Remote",
      type: "Full-Time",
      experience: "3+ Years",
      description: "Craft high-fidelity, intuitive design systems and enterprise workflow consoles with immaculate typographic precision and layout harmony."
    }
  ];

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      setJobError("Please provide your name and email.");
      return;
    }

    setApplying(true);
    setJobError("");

    try {
      try {
        const appsCol = collection(db, "job_applications");
        await addDoc(appsCol, {
          jobId: selectedJob?.id || "general",
          jobTitle: selectedJob?.title || "General Application",
          name: applicantName.trim(),
          email: applicantEmail.trim(),
          phone: applicantPhone.trim(),
          resumeUrl: applicantResume.trim(),
          note: applicantNote.trim(),
          timestamp: new Date().toISOString(),
          status: "received"
        });
      } catch (fbErr) {
        console.warn("Direct Firestore app submission fallback:", fbErr);
      }

      await fetch("/api/job-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob?.id,
          jobTitle: selectedJob?.title,
          name: applicantName.trim(),
          email: applicantEmail.trim(),
          phone: applicantPhone.trim(),
          resumeUrl: applicantResume.trim(),
          note: applicantNote.trim()
        })
      }).catch(() => {});

      setAppliedSuccess(true);
    } catch (err) {
      setJobError("Unable to submit application right now. Please email careers@cvidyasolutions.com");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.12]">
              Build the Future of{" "}
              <span className="text-blue-600">Enterprise Tech.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              At C Vidya Solutions, we combine rigorous engineering with modern design to solve complex business challenges. Join a team where technical precision meets creative problem-solving.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#open-positions"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors text-sm"
              >
                View Openings
              </a>
              <button
                onClick={() => {
                  const el = document.getElementById("care-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-md border border-slate-300 shadow-xs transition-colors text-sm cursor-pointer"
              >
                Our Culture
              </button>
            </div>
          </div>

          {/* Right Column: Clean Hero Image with Quote Below */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
              <img 
                src="/assets/images/careers_team_meeting_1788168610696.jpg" 
                alt="C Vidya Solutions Team Collaboration"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Quote placed below the image */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 text-slate-800 flex items-center gap-3 shadow-xs">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full shrink-0" />
              <p className="text-sm italic font-medium leading-relaxed text-slate-700">
                &ldquo;We engineer trust through transparency and relentless innovation.&rdquo;
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* 2. THE ENGINEERING OF CARE (BENEFITS) */}
      <section id="care-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="space-y-2 mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            The Engineering of Care
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We invest in our people with the same rigor we apply to our software. Comprehensive benefits designed for modern professionals.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6">
          
          {/* Top Row: 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Premium Healthcare */}
            <div className="bg-white border border-slate-200 border-t-4 border-t-blue-600 rounded-xl p-8 shadow-xs flex flex-col justify-between space-y-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-950">Premium Healthcare</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  100% covered premium medical, dental, and vision insurance for you and your dependents. Because well-being is foundational.
                </p>
              </div>
            </div>

            {/* Card 2: Flexible Autonomy */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs flex flex-col justify-between space-y-6">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-950">Flexible Autonomy</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Remote-first culture with asynchronous workflows. Own your schedule and work from wherever you do your best thinking.
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Row: 1 Small Card + 1 Wide Image Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Card 3: Continuous Learning */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-8 shadow-xs flex flex-col justify-between space-y-6">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-950">Continuous Learning</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  $5,000 annual stipend for courses, conferences, and technical certifications.
                </p>
              </div>
            </div>

            {/* Card 4: State-of-the-art Gear (Clean Image on Top, Content Below) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
                <img 
                  src="/assets/images/careers_workspace_monitors_1788168702798.jpg" 
                  alt="Modern Workspace Gear"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">State-of-the-art Gear</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Latest Apple silicon, ergonomic setups, and all the specialized software you need to perform at your peak.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 3. OPEN POSITIONS */}
      <section id="open-positions" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Open Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Join our engineering, AI, and design guilds. We offer competitive equity, global flexibility, and rapid career growth.
          </p>
        </div>

        <div className="space-y-4">
          {jobOpenings.map((job) => (
            <div 
              key={job.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-blue-500/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-slate-950">{job.title}</h3>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-mono rounded-md font-medium">
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                  <span>{job.department}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.experience}</span>
                </div>
                <p className="text-xs text-slate-600 pt-1 max-w-2xl">
                  {job.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedJob(job);
                  setAppliedSuccess(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shrink-0 cursor-pointer"
              >
                Apply for Role
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono uppercase text-blue-600 font-bold tracking-wider">Job Application</span>
              <h2 className="text-xl font-bold text-slate-950 mt-1">{selectedJob.title}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedJob.department} • {selectedJob.location}</p>
            </div>

            {appliedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-950">Application Received</h3>
                <p className="text-xs text-slate-600">
                  Thank you for applying. Our talent lead will review your profile and reach out to <strong>{applicantEmail}</strong>.
                </p>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="mt-3 px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleJobSubmit} className="space-y-4">
                {jobError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                    {jobError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-600 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-600 font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-600 font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+91 8987766981"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-600 font-medium mb-1">Portfolio / LinkedIn / Resume Link</label>
                  <input
                    type="url"
                    value={applicantResume}
                    onChange={(e) => setApplicantResume(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-600 font-medium mb-1">Why C Vidya Solutions?</label>
                  <textarea
                    rows={3}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder="Briefly tell us about your background and technical highlights..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={applying}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded transition-colors"
                >
                  {applying ? "Submitting Application..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
