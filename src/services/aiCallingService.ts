import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db, getAdminAuthHeaders } from "../firebase";
import type {
  AiOutboundCallRecord,
  DemoBookingRecord,
  HumanHandoffTicket,
  HrSalesMember,
} from "../types";
import { ttsService } from "./ttsService";

const LOCAL_CALL_LOGS_KEY = "cvidya_ai_call_logs_v1";
const LOCAL_DEMO_BOOKINGS_KEY = "cvidya_demo_bookings_v1";
const LOCAL_HANDOFF_TICKETS_KEY = "cvidya_handoff_tickets_v1";

export function generateOutboundCallScript(params: {
  leadName: string;
  company?: string;
  product: string;
  voiceGender: "female" | "male";
  language: "en" | "hi" | "hinglish";
  customObjective?: string;
}): string {
  const { leadName, company, product, voiceGender, language, customObjective } = params;
  const repName = voiceGender === "male" ? "Aarav" : "Ananya";
  const verbHinglish = voiceGender === "male" ? "bol raha hoon" : "bol rahi hoon";
  const helpHinglish = voiceGender === "male" ? "karunga" : "karungi";
  const verbHindi = voiceGender === "male" ? "बोल रहा हूँ" : "बोल रही हूँ";
  const helpHindi = voiceGender === "male" ? "करूँगा" : "करूँगी";
  const orgMention = company && company !== "Not Specified" ? ` (${company})` : "";

  if (language === "hi") {
    return `नमस्ते ${leadName} जी${orgMention}! मैं ${repName}, C Vidya Solutions से ${verbHindi}। आपने हमारे ${product} के बारे में जानकारी या डेमो के लिए संपर्क किया था। ${
      customObjective
        ? `${customObjective} `
        : `क्या यह बात करने का सही समय है? मैं आपके बिज़नेस के लिए 15 मिनट का लाइव डेमो और फ्री ट्रायल सेटअप करने में आपकी पूरी मदद ${helpHindi}।`
    } अगर आप चाहें तो मैं अभी कॉल को हमारे सीनियर डायरेक्टर डेस्क (+91 92885 17027) से भी जोड़ ${
      voiceGender === "male" ? "सकता हूँ" : "सकती हूँ"
    }।`;
  }

  if (language === "hinglish") {
    return `Namaste ${leadName} ji${orgMention}! Main ${repName}, C Vidya Solutions se ${verbHinglish}. Aapne hamare ${product} ke baare mein inquiry ki thi. ${
      customObjective
        ? `${customObjective} `
        : `Kya abhi baat karne ka sahi samay hai? Main aapke business workflow ke hisaab se 15-minute ka personalized live demo aur free trial schedule karne me aapki madad ${helpHinglish}.`
    } Agar aap chahein toh main abhi aapko hamare senior specialist (+91 92885 17027) se bhi connect kar ${
      voiceGender === "male" ? "sakta hoon" : "sakti hoon"
    }.`;
  }

  return `Hello ${leadName}${orgMention}! This is ${repName} calling from C Vidya Solutions regarding your interest in ${product}. ${
    customObjective
      ? `${customObjective} `
      : `Is this a convenient time for a quick two-minute chat? I would love to help set up your personalized live demo and free trial.`
  } If you have specific architecture or pricing questions right now, I can also transfer this call directly to our senior specialist desk at +91 92885 17027.`;
}

function readLocalList<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalList<T>(key: string, list: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(list.slice(0, 150)));
  } catch {
    // Ignore storage quota issues
  }
}

export async function fetchCallHistoryAndAnalytics(adminToken?: string): Promise<{
  calls: AiOutboundCallRecord[];
  demos: DemoBookingRecord[];
  handoffs: HumanHandoffTicket[];
  hrSalesTeam: HrSalesMember[];
}> {
  const localCalls = readLocalList<AiOutboundCallRecord>(LOCAL_CALL_LOGS_KEY, []);
  const localDemos = readLocalList<DemoBookingRecord>(LOCAL_DEMO_BOOKINGS_KEY, []);
  const localHandoffs = readLocalList<HumanHandoffTicket>(LOCAL_HANDOFF_TICKETS_KEY, []);

  const mergedCalls: AiOutboundCallRecord[] = [...localCalls];
  const mergedDemos: DemoBookingRecord[] = [...localDemos];
  const mergedHandoffs: HumanHandoffTicket[] = [...localHandoffs];

  // 1. Read from Firestore directly when signed in as an authorized Firebase Admin
  try {
    const callSnap = await getDocs(collection(db, "call_logs"));
    callSnap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      const id = data.id || data.callId || docSnap.id;
      if (!mergedCalls.some((c) => c.id === id)) {
        mergedCalls.push({
          id,
          leadId: data.leadId || id,
          leadName: data.leadName || "Enterprise Prospect",
          phone: data.phone || "+91 92885 17027",
          company: data.company || data.companyName || "Enterprise Prospect",
          productOfInterest: data.productOfInterest || data.productInterest || "C Vidya SaaS Suite",
          voiceGender: data.voiceGender === "male" ? "male" : "female",
          language: data.language === "hi" || data.language === "en" ? data.language : "hinglish",
          callStatus: data.callStatus || "Completed",
          durationSeconds: typeof data.durationSeconds === "number" ? data.durationSeconds : 28,
          script: data.script || data.summary || "",
          outcome: data.outcome || "Connected",
          assignedRep: data.assignedRep || "Ananya (C Vidya Female AI Voice)",
          createdAt: data.createdAt || data.timestamp || new Date().toISOString(),
        });
      }
    });
  } catch {
    // Firestore read requires Firebase Admin Auth; falls back to authenticated API below
  }

  try {
    const demoSnap = await getDocs(collection(db, "demo_bookings"));
    demoSnap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      const id = data.id || data.bookingId || docSnap.id;
      if (!mergedDemos.some((d) => d.id === id)) {
        mergedDemos.push({
          id,
          leadId: data.leadId || id,
          name: data.name || data.leadName || "Enterprise Client",
          company: data.company || data.companyName || "Business Prospect",
          email: data.email || "client@company.com",
          phone: data.phone || "+91 92885 17027",
          product: data.product || "C Vidya SaaS Suite",
          preferredDate: data.preferredDate || new Date().toISOString().split("T")[0],
          preferredTime: data.preferredTime || data.preferredTimeSlot || "11:30 AM IST",
          language: data.language === "hi" || data.language === "en" ? data.language : "hinglish",
          status: data.status || "Scheduled",
          createdAt: data.createdAt || new Date().toISOString(),
        });
      }
    });
  } catch {
    // Fallback to authenticated API below
  }

  try {
    const handoffSnap = await getDocs(collection(db, "handoff_tickets"));
    handoffSnap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      const id = data.id || data.ticketId || docSnap.id;
      if (!mergedHandoffs.some((h) => h.id === id)) {
        mergedHandoffs.push({
          id,
          callId: data.callId,
          leadId: data.leadId,
          customerName: data.customerName || data.leadName || "Enterprise Prospect",
          phone: data.phone || "+91 92885 17027",
          language: data.language === "hi" || data.language === "en" ? data.language : "hinglish",
          product: data.product || "C Vidya Enterprise Suite",
          reason: data.reason || "Requested direct consultation",
          assignedAgent: data.assignedAgent || "Chiranjeev Das / Senior Desk (+91 92885 17027)",
          priority: data.priority || "High",
          status: data.status || "Assigned",
          timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
        });
      }
    });
  } catch {
    // Fallback to authenticated API below
  }

  // 2. Fetch from Backend API using authenticated admin headers
  try {
    const headers = await getAdminAuthHeaders();
    if (adminToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${adminToken}`;
      headers["X-Admin-Passcode"] = adminToken;
    }
    const res = await fetch("/api/calling/history", { headers });
    if (res.ok) {
      const data = await res.json();
      (data.calls || []).forEach((c: AiOutboundCallRecord) => {
        if (!mergedCalls.some((x) => x.id === c.id)) mergedCalls.push(c);
      });
      (data.demos || []).forEach((d: DemoBookingRecord) => {
        if (!mergedDemos.some((x) => x.id === d.id)) mergedDemos.push(d);
      });
      (data.handoffs || []).forEach((h: HumanHandoffTicket) => {
        if (!mergedHandoffs.some((x) => x.id === h.id)) mergedHandoffs.push(h);
      });

      return {
        calls: mergedCalls,
        demos: mergedDemos,
        handoffs: mergedHandoffs,
        hrSalesTeam: data.hrSalesTeam || getDefaultHrSalesTeam(),
      };
    }
  } catch {
    // Offline fallback
  }

  return {
    calls: mergedCalls,
    demos: mergedDemos,
    handoffs: mergedHandoffs,
    hrSalesTeam: getDefaultHrSalesTeam(),
  };
}

export function getDefaultHrSalesTeam(): HrSalesMember[] {
  return [
    {
      id: "rep_chiranjeev",
      name: "Chiranjeev Das",
      role: "Technical Architect",
      department: "Engineering",
      phone: "+91 92885 17027",
      email: "chiranjeev0058@gmail.com",
      assignedLeadsCount: 14,
      activeCallsCount: 1,
      status: "Available",
    },
    {
      id: "rep_ananya",
      name: "Ananya Sharma (AI + Sales Desk)",
      role: "Sales Executive",
      department: "Sales",
      phone: "+91 92885 17027",
      email: "cvidyasolutions@gmail.com",
      assignedLeadsCount: 28,
      activeCallsCount: 2,
      status: "Available",
    },
    {
      id: "rep_aarav",
      name: "Aarav Verma (Enterprise SDR)",
      role: "Customer Success",
      department: "Sales",
      phone: "+91 89877 66981",
      email: "cvidyasolutions@gmail.com",
      assignedLeadsCount: 19,
      activeCallsCount: 0,
      status: "Available",
    },
    {
      id: "rep_hr_desk",
      name: "STPI Sindri Recruitment Desk",
      role: "HR Specialist",
      department: "HR",
      phone: "+91 92885 17027",
      email: "cvidyasolutions@gmail.com",
      assignedLeadsCount: 9,
      activeCallsCount: 0,
      status: "Available",
    },
  ];
}

export async function triggerAiOutboundCall(params: {
  leadId: string;
  leadName: string;
  phone: string;
  company?: string;
  productOfInterest: string;
  voiceGender: "female" | "male";
  language: "en" | "hi" | "hinglish";
  customObjective?: string;
  speakAudio?: boolean;
  onStatusChange?: (status: "ringing" | "speaking" | "completed") => void;
}): Promise<AiOutboundCallRecord> {
  const script = generateOutboundCallScript({
    leadName: params.leadName,
    company: params.company,
    product: params.productOfInterest,
    voiceGender: params.voiceGender,
    language: params.language,
    customObjective: params.customObjective,
  });

  const nowIso = new Date().toISOString();
  const callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const record: AiOutboundCallRecord = {
    id: callId,
    leadId: params.leadId,
    leadName: params.leadName,
    phone: params.phone,
    company: params.company || "Enterprise Prospect",
    productOfInterest: params.productOfInterest || "C Vidya SaaS Suite",
    voiceGender: params.voiceGender,
    language: params.language,
    callStatus: "Completed",
    durationSeconds: Math.max(18, Math.min(95, Math.round(script.length / 11))),
    script,
    outcome: "Connected — Product Walkthrough & Follow-Up Logged",
    assignedRep:
      params.voiceGender === "male"
        ? "Aarav (C Vidya Male AI Voice)"
        : "Ananya (C Vidya Female AI Voice)",
    createdAt: nowIso,
  };

  // 1. Persist directly to Firestore `call_logs` collection
  try {
    await setDoc(doc(db, "call_logs", callId), {
      ...record,
      callId,
      direction: "Outbound",
      timestamp: nowIso,
    });
  } catch {
    // Fallback to backend + local cache
  }

  // 2. Persist via authenticated Backend API
  try {
    const authHeaders = await getAdminAuthHeaders();
    const res = await fetch("/api/calling/outbound", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        ...record,
        callId,
        direction: "Outbound",
        customObjective: params.customObjective,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.call) {
        Object.assign(record, data.call);
      }
    }
  } catch {
    // Offline fallback
  }

  const existing = readLocalList<AiOutboundCallRecord>(LOCAL_CALL_LOGS_KEY, []);
  writeLocalList(LOCAL_CALL_LOGS_KEY, [record, ...existing]);

  if (params.speakAudio !== false) {
    params.onStatusChange?.("speaking");
    const preferredLocale: "hi-IN" | "en-IN" = params.language === "hi" ? "hi-IN" : "en-IN";
    ttsService.speak(
      record.script,
      preferredLocale,
      {
        onStart: () => params.onStatusChange?.("speaking"),
        onEnd: () => params.onStatusChange?.("completed"),
        onError: () => params.onStatusChange?.("completed"),
      },
      params.voiceGender
    );
  } else {
    params.onStatusChange?.("completed");
  }

  return record;
}

export function stopActiveAiCallAudio(): void {
  ttsService.stop();
}

export async function createDemoBooking(params: {
  leadId?: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  product: string;
  preferredDate: string;
  preferredTime: string;
  language: "en" | "hi" | "hinglish";
}): Promise<DemoBookingRecord> {
  const bookingId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const createdAt = new Date().toISOString();
  const booking: DemoBookingRecord = {
    id: bookingId,
    leadId: params.leadId,
    name: params.name,
    company: params.company || "Business Prospect",
    email: params.email,
    phone: params.phone,
    product: params.product,
    preferredDate: params.preferredDate,
    preferredTime: params.preferredTime,
    language: params.language,
    status: "Scheduled",
    createdAt,
  };

  // 1. Persist directly to Firestore `demo_bookings` collection
  try {
    await setDoc(doc(db, "demo_bookings", bookingId), {
      ...booking,
      bookingId,
      leadName: params.name,
      preferredTimeSlot: params.preferredTime,
    });
  } catch {
    // Fallback to backend + local cache
  }

  // 2. Persist via authenticated Backend API
  try {
    const authHeaders = await getAdminAuthHeaders();
    const res = await fetch("/api/calling/demo-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(booking),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.booking) {
        Object.assign(booking, data.booking);
      }
    }
  } catch {
    // Offline fallback
  }

  const existing = readLocalList<DemoBookingRecord>(LOCAL_DEMO_BOOKINGS_KEY, []);
  writeLocalList(LOCAL_DEMO_BOOKINGS_KEY, [booking, ...existing]);
  return booking;
}

export async function escalateToHumanAgent(params: {
  callId?: string;
  leadId?: string;
  customerName: string;
  phone: string;
  language: "en" | "hi" | "hinglish";
  product: string;
  reason: string;
  priority?: "High" | "Urgent" | "Normal";
}): Promise<HumanHandoffTicket> {
  const ticketId = `handoff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const createdAt = new Date().toISOString();
  const ticket: HumanHandoffTicket = {
    id: ticketId,
    callId: params.callId,
    leadId: params.leadId,
    customerName: params.customerName,
    phone: params.phone,
    language: params.language,
    product: params.product,
    reason: params.reason,
    assignedAgent: "Chiranjeev Das / Senior Desk (+91 92885 17027)",
    priority: params.priority || "High",
    status: "Assigned",
    timestamp: createdAt,
  };

  // 1. Persist directly to Firestore `handoff_tickets` collection
  try {
    const urgency =
      params.priority === "Urgent"
        ? "Immediate"
        : params.priority === "Normal"
        ? "Normal"
        : "High";
    await setDoc(doc(db, "handoff_tickets", ticketId), {
      ...ticket,
      ticketId,
      leadName: params.customerName,
      urgency,
      targetDepartment: "Sales",
      status: "Open",
      createdAt,
    });
  } catch {
    // Fallback to backend + local cache
  }

  // 2. Persist via authenticated Backend API
  try {
    const authHeaders = await getAdminAuthHeaders();
    const res = await fetch("/api/calling/handoff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(ticket),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.ticket) {
        Object.assign(ticket, data.ticket);
      }
    }
  } catch {
    // Offline fallback
  }

  const existing = readLocalList<HumanHandoffTicket>(LOCAL_HANDOFF_TICKETS_KEY, []);
  writeLocalList(LOCAL_HANDOFF_TICKETS_KEY, [ticket, ...existing]);
  return ticket;
}

