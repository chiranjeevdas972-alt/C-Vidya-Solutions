import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  PhoneOff,
  Calendar,
  UserCheck,
  BarChart3,
  Clock,
  Volume2,
  Users,
  Send,
  AlertTriangle,
} from "lucide-react";
import type {
  AiOutboundCallRecord,
  DemoBookingRecord,
  HumanHandoffTicket,
  HrSalesMember,
} from "../types";
import {
  fetchCallHistoryAndAnalytics,
  triggerAiOutboundCall,
  stopActiveAiCallAudio,
  createDemoBooking,
  escalateToHumanAgent,
  getDefaultHrSalesTeam,
} from "../services/aiCallingService";
import { getAdminAuthHeaders } from "../firebase";

interface AiCallingConsolePanelProps {
  leads: any[];
  onUpdateLeadStatus: (id: string, newStatus: string) => void;
  onRefreshLeads: () => void;
}

export default function AiCallingConsolePanel({
  leads,
  onUpdateLeadStatus,
  onRefreshLeads,
}: AiCallingConsolePanelProps) {
  const [subTab, setSubTab] = useState<
    "dialer" | "demos" | "analytics" | "hr_sales" | "handoff"
  >("dialer");

  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [customLeadName, setCustomLeadName] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [customProduct, setCustomProduct] = useState("C Vidya Library Management System");
  const [voiceGender, setVoiceGender] = useState<"female" | "male">("female");
  const [language, setLanguage] = useState<"en" | "hi" | "hinglish">("hinglish");
  const [customObjective, setCustomObjective] = useState("");

  const [callState, setCallState] = useState<"idle" | "ringing" | "speaking" | "completed">("idle");
  const [activeCallRecord, setActiveCallRecord] = useState<AiOutboundCallRecord | null>(null);

  const [callLogs, setCallLogs] = useState<AiOutboundCallRecord[]>([]);
  const [demoBookings, setDemoBookings] = useState<DemoBookingRecord[]>([]);
  const [handoffTickets, setHandoffTickets] = useState<HumanHandoffTicket[]>([]);
  const [hrSalesTeam, setHrSalesTeam] = useState<HrSalesMember[]>(getDefaultHrSalesTeam());
  const [jobApplicationsCount, setJobApplicationsCount] = useState<number>(0);

  // Demo booking form state
  const [demoDate, setDemoDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split("T")[0];
  });
  const [demoTime, setDemoTime] = useState("11:30 AM IST");
  const [demoEmail, setDemoEmail] = useState("client@company.com");

  // Human handoff form state
  const [handoffReason, setHandoffReason] = useState(
    "Enterprise multi-branch custom SLA & pricing negotiation requested"
  );
  const [handoffPriority, setHandoffPriority] = useState<"High" | "Urgent" | "Normal">("High");

  useEffect(() => {
    let mounted = true;
    fetchCallHistoryAndAnalytics().then((data) => {
      if (!mounted) return;
      setCallLogs(data.calls);
      setDemoBookings(data.demos);
      setHandoffTickets(data.handoffs);
      setHrSalesTeam(data.hrSalesTeam);
    });

    getAdminAuthHeaders()
      .then((headers) => fetch("/api/hr-sales/overview", { headers }))
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (mounted && d) {
          if (typeof d.totalJobApplications === "number") {
            setJobApplicationsCount(d.totalJobApplications);
          }
          if (Array.isArray(d.hrSalesTeam) && d.hrSalesTeam.length > 0) {
            setHrSalesTeam(d.hrSalesTeam);
          }
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  useEffect(() => {
    if (selectedLead) {
      setCustomLeadName(selectedLead.name || "");
      setCustomPhone(selectedLead.phone || "");
      setCustomCompany(selectedLead.company || "");
      setCustomProduct(selectedLead.service || "C Vidya Enterprise CRM");
      setDemoEmail(selectedLead.email || "client@company.com");
    }
  }, [selectedLeadId]);

  const handleStartOutboundCall = async () => {
    const targetName = customLeadName.trim() || selectedLead?.name || "Valued Prospect";
    const targetPhone = customPhone.trim() || selectedLead?.phone || "+91 92885 17027";
    const targetProduct = customProduct.trim() || selectedLead?.service || "C Vidya SaaS Suite";

    setCallState("ringing");
    const record = await triggerAiOutboundCall({
      leadId: selectedLead?.id || `lead_${Date.now()}`,
      leadName: targetName,
      phone: targetPhone,
      company: customCompany.trim() || selectedLead?.company || "Enterprise Prospect",
      productOfInterest: targetProduct,
      voiceGender,
      language,
      customObjective: customObjective.trim() || undefined,
      speakAudio: true,
      onStatusChange: (st) => setCallState(st),
    });

    setActiveCallRecord(record);
    setCallLogs((prev) => [record, ...prev.filter((c) => c.id !== record.id)]);

    if (selectedLead?.id) {
      onUpdateLeadStatus(selectedLead.id, "Contacted");
    }
  };

  const handleStopCall = () => {
    stopActiveAiCallAudio();
    setCallState("completed");
  };

  const handleScheduleDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetName = customLeadName.trim() || selectedLead?.name || "Enterprise Client";
    const targetPhone = customPhone.trim() || selectedLead?.phone || "+91 92885 17027";

    const booking = await createDemoBooking({
      leadId: selectedLead?.id,
      name: targetName,
      company: customCompany.trim() || selectedLead?.company || "Business Organization",
      email: demoEmail.trim() || "client@company.com",
      phone: targetPhone,
      product: customProduct,
      preferredDate: demoDate,
      preferredTime: demoTime,
      language,
    });

    setDemoBookings((prev) => [booking, ...prev]);
    if (selectedLead?.id) {
      onUpdateLeadStatus(selectedLead.id, "Demo Scheduled");
    }
    onRefreshLeads();
  };

  const handleEscalateHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetName = customLeadName.trim() || selectedLead?.name || "Enterprise Prospect";
    const targetPhone = customPhone.trim() || selectedLead?.phone || "+91 92885 17027";

    const ticket = await escalateToHumanAgent({
      callId: activeCallRecord?.id,
      leadId: selectedLead?.id,
      customerName: targetName,
      phone: targetPhone,
      language,
      product: customProduct,
      reason: handoffReason,
      priority: handoffPriority,
    });

    setHandoffTickets((prev) => [ticket, ...prev]);
    if (selectedLead?.id) {
      onUpdateLeadStatus(selectedLead.id, "Qualified");
    }
  };

  const totalCalls = callLogs.length;
  const avgDuration =
    totalCalls > 0
      ? Math.round(callLogs.reduce((acc, c) => acc + (c.durationSeconds || 25), 0) / totalCalls)
      : 0;

  return (
    <div className="space-y-4 text-xs">
      {/* Sub-navigation bar for Modules C through I */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl">
        <button
          type="button"
          onClick={() => setSubTab("dialer")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            subTab === "dialer"
              ? "bg-[#071739] text-white shadow-xs"
              : "text-slate-600 hover:bg-white"
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          AI Outbound Calling &amp; Voice
        </button>
        <button
          type="button"
          onClick={() => setSubTab("demos")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            subTab === "demos"
              ? "bg-[#071739] text-white shadow-xs"
              : "text-slate-600 hover:bg-white"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Demo Booking &amp; Follow-Up ({demoBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("analytics")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            subTab === "analytics"
              ? "bg-[#071739] text-white shadow-xs"
              : "text-slate-600 hover:bg-white"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Call History &amp; Analytics ({totalCalls})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("hr_sales")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            subTab === "hr_sales"
              ? "bg-[#071739] text-white shadow-xs"
              : "text-slate-600 hover:bg-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          HR &amp; Sales Team
        </button>
        <button
          type="button"
          onClick={() => setSubTab("handoff")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            subTab === "handoff"
              ? "bg-[#071739] text-white shadow-xs"
              : "text-slate-600 hover:bg-white"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Human Handoff ({handoffTickets.length})
        </button>
      </div>

      {/* 1. AI OUTBOUND CALLING + VOICE & LANGUAGE SELECTION */}
      {subTab === "dialer" && (
        <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-bold text-slate-950 text-sm">
                Autonomous AI Outbound Calling Agent
              </h4>
              <p className="text-slate-500 text-[11px]">
                Select an existing CRM lead or enter a prospect number to launch a real-human voice call in English, Hindi, or Hinglish.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                aria-label="AI Calling Voice Gender"
                value={voiceGender}
                onChange={(e) => setVoiceGender(e.target.value as "female" | "male")}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 cursor-pointer"
              >
                <option value="female">Female Voice (Ananya)</option>
                <option value="male">Male Voice (Aarav)</option>
              </select>
              <select
                aria-label="AI Calling Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "hinglish")}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 cursor-pointer"
              >
                <option value="hinglish">Hinglish (IN)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Select CRM Lead (Optional)
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="">-- Custom / Manual Prospect --</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.phone}) — {l.service || "General"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Target Product / Solution
              </label>
              <input
                type="text"
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                placeholder="e.g. C Vidya Library Management"
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Prospect Name
              </label>
              <input
                type="text"
                value={customLeadName}
                onChange={(e) => setCustomLeadName(e.target.value)}
                placeholder="Enter contact name"
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Phone / WhatsApp Number
              </label>
              <input
                type="text"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              Custom Call Follow-Up Note / Objective (Optional)
            </label>
            <input
              type="text"
              value={customObjective}
              onChange={(e) => setCustomObjective(e.target.value)}
              placeholder="e.g. Confirm tomorrow 11:30 AM live demo & biometric hardware requirements"
              className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleStartOutboundCall}
              disabled={callState === "speaking"}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              {callState === "speaking"
                ? "AI Agent Speaking Live..."
                : "Start AI Outbound Call"}
            </button>
            {callState === "speaking" && (
              <button
                type="button"
                onClick={handleStopCall}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                End Call Audio
              </button>
            )}
          </div>

          {activeCallRecord && (
            <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  {activeCallRecord.assignedRep} • {activeCallRecord.language.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] font-bold">
                  {callState === "speaking" ? "LIVE AUDIO" : activeCallRecord.callStatus}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{activeCallRecord.script}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. DEMO BOOKING & AUTOMATIC FOLLOW-UP */}
      {subTab === "demos" && (
        <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-950 text-sm">
            1-on-1 Demo Booking &amp; Automatic Follow-Up Cadence
          </h4>
          <form onSubmit={handleScheduleDemo} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              required
              value={customLeadName}
              onChange={(e) => setCustomLeadName(e.target.value)}
              placeholder="Client Name"
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
            <input
              type="text"
              required
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder="Mobile / WhatsApp"
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
            <input
              type="email"
              required
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
              placeholder="Client Email"
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
            <input
              type="date"
              required
              value={demoDate}
              onChange={(e) => setDemoDate(e.target.value)}
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
            <input
              type="text"
              required
              value={demoTime}
              onChange={(e) => setDemoTime(e.target.value)}
              placeholder="Preferred Time (e.g. 11:30 AM)"
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Book Demo &amp; Auto Follow-Up
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto pt-2">
            {demoBookings.map((d) => (
              <div
                key={d.id}
                className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {d.name} • <span className="text-blue-700">{d.product}</span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    📅 {d.preferredDate} at {d.preferredTime} • 📞 {d.phone}
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">
                  {d.status}
                </span>
              </div>
            ))}
            {demoBookings.length === 0 && (
              <div className="text-center py-4 text-slate-400">
                No scheduled demo slots yet. Book a demo above to trigger automatic follow-up.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CALL HISTORY & ANALYTICS */}
      {subTab === "analytics" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] font-mono uppercase text-slate-500">Total AI Calls</div>
              <div className="text-xl font-bold text-slate-950 mt-0.5">{totalCalls}</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-[10px] font-mono uppercase text-emerald-700">Avg Duration</div>
              <div className="text-xl font-bold text-emerald-950 mt-0.5">{avgDuration}s</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-[10px] font-mono uppercase text-blue-700">Demos Booked</div>
              <div className="text-xl font-bold text-blue-950 mt-0.5">{demoBookings.length}</div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-[10px] font-mono uppercase text-amber-700">Human Handoffs</div>
              <div className="text-xl font-bold text-amber-950 mt-0.5">{handoffTickets.length}</div>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {callLogs.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">
                    {c.leadName} ({c.phone}) — {c.productOfInterest}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] font-bold">
                    {c.voiceGender.toUpperCase()} • {c.language.toUpperCase()} • {c.durationSeconds}s
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{c.script}</p>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {new Date(c.createdAt).toLocaleString()} • {c.outcome}
                </div>
              </div>
            ))}
            {callLogs.length === 0 && (
              <div className="text-center py-6 text-slate-400">
                No outbound AI calls logged yet. Launch a call from the AI Outbound Calling tab.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. HR & SALES MANAGEMENT */}
      {subTab === "hr_sales" && (
        <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-950 text-sm">
                HR &amp; Sales Pipeline Allocation
              </h4>
              <p className="text-slate-500 text-[11px]">
                Active Sales SDRs, Technical Architects, and STPI Sindri HR recruitment pipeline ({jobApplicationsCount} candidate applications).
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {hrSalesTeam.map((member) => (
              <div
                key={member.id}
                className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-slate-900">{member.name}</div>
                  <div className="text-slate-500 text-[11px]">
                    {member.role} • {member.department}
                  </div>
                  <div className="text-slate-600 font-mono text-[10px] mt-1">
                    📞 {member.phone} • Leads: {member.assignedLeadsCount}
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HUMAN HANDOFF ESCALATION */}
      {subTab === "handoff" && (
        <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h4 className="font-bold text-slate-950 text-sm flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Instant Human Handoff &amp; Senior Desk Escalation
          </h4>
          <form onSubmit={handleEscalateHandoff} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              required
              value={customLeadName}
              onChange={(e) => setCustomLeadName(e.target.value)}
              placeholder="Customer Name"
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
            <input
              type="text"
              required
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder="Customer Phone"
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
            <select
              value={handoffPriority}
              onChange={(e) => setHandoffPriority(e.target.value as "High" | "Urgent" | "Normal")}
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg font-bold"
            >
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent SLA</option>
              <option value="Normal">Standard</option>
            </select>
            <input
              type="text"
              required
              value={handoffReason}
              onChange={(e) => setHandoffReason(e.target.value)}
              placeholder="Reason for human handoff..."
              className="sm:col-span-2 px-2.5 py-2 bg-white border border-slate-200 rounded-lg"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
            >
              Escalate to Human Executive
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
            {handoffTickets.map((t) => (
              <div
                key={t.id}
                className="p-3 bg-white border border-amber-200 rounded-lg flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {t.customerName} ({t.phone}) • {t.product}
                  </div>
                  <div className="text-slate-600 text-[11px]">{t.reason}</div>
                  <div className="text-slate-400 font-mono text-[10px]">
                    Assigned: {t.assignedAgent}
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px]">
                  {t.priority} • {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
