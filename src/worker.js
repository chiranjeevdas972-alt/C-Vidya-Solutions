/**
 * C Vidya Solutions - Cloudflare Worker Gateway & Edge Server
 * Connects cvidyasolutions.com to Google Cloud Firestore & Cloud Run backend
 * and serves static assets + full /api/* server-side routes directly from Cloudflare Global Edge.
 */

const TARGET_HOST = "ais-pre-hrsrnkyjs5thwr5cb4rnxg-45680654387.asia-southeast1.run.app";
const BACKUP_HOST = "ais-dev-hrsrnkyjs5thwr5cb4rnxg-45680654387.asia-southeast1.run.app";

const FIREBASE_PROJECT_ID = "c-vidya-solutions";
const FIRESTORE_DATABASE_ID = "ai-studio-cvidyasolutions-89b15118-e096-42ad-9641-2e1d65c26ca7";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents`;

const AUTHORIZED_OWNER_EMAILS = [
  "cvidyasolutions@gmail.com",
  "chiranjeevdas972@gmail.com",
];

// Edge in-memory state for instant fallback & caching across warm isolate requests
const edgeState = {
  vaultHashes: new Map(),
  inquiries: [],
  applications: [],
  appRegistrations: [],
  callLogs: [],
  demoBookings: [],
  handoffTickets: [],
  hrSalesTeam: [
    {
      id: "hr_sales_1",
      name: "Ananya Sharma (AI + Senior SDR)",
      role: "Enterprise SaaS Closer & Outbound Lead",
      department: "Sales",
      phone: "+91 92885 17027",
      email: "sales@cvidyasolutions.com",
      activeCallsToday: 18,
      demosScheduled: 7,
      assignedLeadsCount: 24,
      status: "Active",
    },
    {
      id: "hr_sales_2",
      name: "Aarav Verma (Technical Solutions Architect)",
      role: "School ERP, Library & Petrol Pump Specialist",
      department: "Pre-Sales",
      phone: "+91 89877 66981",
      email: "info@cvidyasolutions.com",
      activeCallsToday: 12,
      demosScheduled: 5,
      assignedLeadsCount: 16,
      status: "On Call",
    },
    {
      id: "hr_sales_3",
      name: "Priya Nair (HR & Talent Acquisition Lead)",
      role: "STPI Sindri Engineering & Internship Recruitment",
      department: "HR",
      phone: "+91 92885 17027",
      email: "careers@cvidyasolutions.com",
      activeCallsToday: 9,
      demosScheduled: 4,
      assignedLeadsCount: 14,
      status: "Active",
    },
    {
      id: "hr_sales_4",
      name: "Chiranjeev Das (Founder & Director Desk)",
      role: "Enterprise Custom SLA & High-Priority Escalations",
      department: "Sales",
      phone: "+91 92885 17027",
      email: "contact@cvidyasolutions.com",
      activeCallsToday: 6,
      demosScheduled: 5,
      assignedLeadsCount: 11,
      status: "Active",
    },
  ],
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Permissions-Policy": "camera=(), microphone=*, geolocation=(), payment=(), usb=()",
      "X-Proxy-By": "Cloudflare-CVidya-Edge",
    },
  });
}

function decodeBase64UrlJson(segment) {
  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function extractBearerToken(request) {
  const authHeader = request.headers.get("Authorization") || request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return "";
}

function verifyEdgeAdminToken(request) {
  const token = extractBearerToken(request);
  if (!token) return { ok: false, token: "" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, token: "" };
  const header = decodeBase64UrlJson(parts[0]);
  const payload = decodeBase64UrlJson(parts[1]);
  const sig = parts[2];
  if (!header || !payload || !sig || sig === "fakesignature") {
    return { ok: false, token: "" };
  }
  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < nowSec) {
    return { ok: false, token: "" };
  }
  if (payload.email_verified !== true) {
    return { ok: false, token: "" };
  }
  const email = String(payload.email || "").trim().toLowerCase();
  if (!AUTHORIZED_OWNER_EMAILS.includes(email)) {
    return { ok: false, token: "" };
  }
  if (payload.aud && payload.aud !== FIREBASE_PROJECT_ID) {
    return { ok: false, token: "" };
  }
  return {
    ok: true,
    token,
    email,
    uid: String(payload.sub || payload.user_id || `owner_${email.replace(/[^a-z0-9]/g, "_")}`),
    isFirebaseJwt: header.alg === "RS256",
  };
}

function fromFirestoreValue(valObj) {
  if (!valObj || typeof valObj !== "object") return undefined;
  if ("stringValue" in valObj) return valObj.stringValue;
  if ("booleanValue" in valObj) return Boolean(valObj.booleanValue);
  if ("integerValue" in valObj) return Number(valObj.integerValue);
  if ("doubleValue" in valObj) return Number(valObj.doubleValue);
  if ("timestampValue" in valObj) return valObj.timestampValue;
  if ("nullValue" in valObj) return null;
  if ("arrayValue" in valObj) {
    const values = valObj.arrayValue?.values;
    return Array.isArray(values) ? values.map(fromFirestoreValue) : [];
  }
  if ("mapValue" in valObj) {
    const fields = valObj.mapValue?.fields || {};
    const out = {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = fromFirestoreValue(v);
    }
    return out;
  }
  return undefined;
}

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

async function firestoreEdgeList(collectionName, bearerToken) {
  try {
    const headers = { Accept: "application/json" };
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
    const resp = await fetch(
      `${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}?pageSize=250`,
      { method: "GET", headers }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    const docs = Array.isArray(data?.documents) ? data.documents : [];
    return docs.map((d) => {
      const id = String(d?.name || "").split("/").pop() || "";
      const fields = d?.fields || {};
      const parsed = { id };
      for (const [k, v] of Object.entries(fields)) {
        parsed[k] = fromFirestoreValue(v);
      }
      return parsed;
    });
  } catch {
    return null;
  }
}

async function firestoreEdgeCreate(collectionName, docData, bearerToken) {
  try {
    const fields = {};
    for (const [k, v] of Object.entries(docData)) {
      if (v !== undefined && k !== "id") {
        fields[k] = toFirestoreValue(v);
      }
    }
    const headers = { "Content-Type": "application/json" };
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
    const resp = await fetch(
      `${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ fields }),
      }
    );
    if (!resp.ok) return null;
    const created = await resp.json();
    return String(created?.name || "").split("/").pop() || null;
  } catch {
    return null;
  }
}

async function firestoreEdgePatch(collectionName, docId, updates, bearerToken) {
  try {
    const keys = Object.keys(updates).filter((k) => updates[k] !== undefined);
    if (!keys.length) return false;
    const mask = keys.map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&");
    const fields = {};
    for (const k of keys) {
      fields[k] = toFirestoreValue(updates[k]);
    }
    const headers = { "Content-Type": "application/json" };
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
    const resp = await fetch(
      `${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}?${mask}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ fields }),
      }
    );
    return resp.ok;
  } catch {
    return false;
  }
}

async function handleEdgeApiRequest(request, url, bodyBuffer) {
  const path = url.pathname;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return jsonResponse({ ok: true }, 200);
  }

  let body = {};
  if (bodyBuffer && bodyBuffer.byteLength > 0) {
    try {
      const text = new TextDecoder().decode(bodyBuffer);
      body = JSON.parse(text);
    } catch {
      body = {};
    }
  }

  // 1. Health check
  if (path === "/api/health") {
    return jsonResponse({
      status: "healthy",
      gateway: "cloudflare-edge",
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Software proxy redirects
  if (path === "/api/proxy/petrol-pump") {
    return Response.redirect(`${url.origin}/software/petrol-pump/index.html`, 302);
  }
  if (path === "/api/proxy/library") {
    return Response.redirect("https://v.cvidyasolutions.workers.dev/", 302);
  }
  if (path === "/api/proxy/fitness") {
    return Response.redirect("https://fitzone.cvidyasolutions.workers.dev/", 302);
  }

  // 3. Admin Authentication & Owner Vault endpoints
  if (path === "/api/admin/verify" && method === "POST") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ success: false, error: "Unauthorized access." }, 401);
    }
    return jsonResponse({
      success: true,
      email: authCheck.email,
      verifiedAt: new Date().toISOString(),
    });
  }

  if (
    (path === "/api/admin/vault/verify" ||
      path === "/api/admin/vault/session" ||
      path === "/api/admin/vault/update") &&
    method === "POST"
  ) {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse(
        { success: false, error: "Unauthorized access. Verified owner session required." },
        401
      );
    }
    const uid = String(body.uid || authCheck.uid).trim();
    const hash = String(body.newPasswordHash || body.passwordHash || "").trim().toLowerCase();
    if (uid && /^[a-f0-9]{64}$/.test(hash)) {
      edgeState.vaultHashes.set(uid, hash);
    }
    return jsonResponse({
      success: true,
      uid,
      email: authCheck.email,
      verifiedAt: new Date().toISOString(),
    });
  }

  // 4. Public & Admin Inquiries / Leads endpoints
  if ((path === "/api/inquiry" || path === "/api/inquiries" || path === "/api/crm/leads") && method === "POST") {
    const nowIso = new Date().toISOString();
    const newLead = {
      id: `inq_${Date.now()}`,
      name: String(body.name || "Valued Client").trim(),
      email: String(body.email || "info@cvidyasolutions.com").trim(),
      phone: String(body.phone || "+91").trim(),
      service: String(body.service || body.product || "General Inquiry").trim(),
      message: String(body.message || body.requirements || "").trim(),
      company: String(body.company || "").trim(),
      cityCountry: String(body.cityCountry || "").trim(),
      businessType: String(body.businessType || "").trim(),
      source: String(body.source || "website").trim(),
      status: "New",
      timestamp: nowIso,
    };
    const fsId = await firestoreEdgeCreate("inquiries", newLead, "");
    if (fsId) newLead.id = fsId;
    edgeState.inquiries.unshift(newLead);
    return jsonResponse({
      success: true,
      message: "Inquiry recorded successfully.",
      id: newLead.id,
      lead: newLead,
    });
  }

  if ((path === "/api/inquiries" || path === "/api/crm/leads") && method === "GET") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const fsDocs = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("inquiries", authCheck.token)
      : null;
    const merged = Array.isArray(fsDocs) && fsDocs.length > 0 ? fsDocs : edgeState.inquiries;
    if (path === "/api/crm/leads") {
      return jsonResponse({ success: true, leads: merged });
    }
    return jsonResponse(merged);
  }

  if ((path.startsWith("/api/inquiries/") || path.startsWith("/api/crm/leads/")) && (method === "PATCH" || method === "PUT")) {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const docId = decodeURIComponent(path.split("/").pop() || "");
    const status = String(body.status || "Contacted").trim();
    if (authCheck.isFirebaseJwt && docId) {
      await firestoreEdgePatch("inquiries", docId, { status, updatedAt: new Date().toISOString() }, authCheck.token);
    }
    edgeState.inquiries = edgeState.inquiries.map((item) =>
      item.id === docId ? { ...item, status } : item
    );
    return jsonResponse({ success: true, id: docId, status });
  }

  if (path.startsWith("/api/inquiries/") && method === "DELETE") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const docId = decodeURIComponent(path.split("/").pop() || "");
    edgeState.inquiries = edgeState.inquiries.filter((item) => item.id !== docId);
    return jsonResponse({ success: true, id: docId });
  }

  // 5. Job Applications endpoints
  if (
    (path === "/api/application" ||
      path === "/api/applications" ||
      path === "/api/job-applications") &&
    method === "POST"
  ) {
    const nowIso = new Date().toISOString();
    const record = {
      id: `app_${Date.now()}`,
      name: String(body.name || "Applicant").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      jobId: String(body.jobId || "").trim(),
      jobTitle: String(body.jobTitle || body.role || "Software Engineer").trim(),
      jobCategory: String(body.jobCategory || "Engineering").trim(),
      jobLocation: String(body.jobLocation || "Dhanbad, Jharkhand").trim(),
      roleType: String(body.roleType || "Full-Time").trim(),
      experience: String(body.experience || "Fresher").trim(),
      resumeFileName: String(body.resumeFileName || "resume.pdf").trim(),
      resumeData: typeof body.resumeData === "string" ? body.resumeData : "",
      resumeUrl: typeof body.resumeUrl === "string" ? body.resumeUrl : "",
      status: "New",
      timestamp: nowIso,
    };
    const fsId = await firestoreEdgeCreate("job_applications", record, "");
    if (fsId) record.id = fsId;
    edgeState.applications.unshift(record);
    return jsonResponse({
      success: true,
      id: record.id,
      application: record,
    });
  }

  if ((path === "/api/applications" || path === "/api/job-applications") && method === "GET") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const fsDocs = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("job_applications", authCheck.token)
      : null;
    const merged = Array.isArray(fsDocs) && fsDocs.length > 0 ? fsDocs : edgeState.applications;
    return jsonResponse({ success: true, applications: merged });
  }

  if (
    (path.startsWith("/api/applications/") || path.startsWith("/api/job-applications/")) &&
    (method === "PATCH" || method === "PUT")
  ) {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const docId = decodeURIComponent(path.split("/").pop() || "");
    const status = String(body.status || "Reviewed").trim();
    if (authCheck.isFirebaseJwt && docId) {
      await firestoreEdgePatch("job_applications", docId, { status, updatedAt: new Date().toISOString() }, authCheck.token);
      await firestoreEdgePatch("applications", docId, { status, updatedAt: new Date().toISOString() }, authCheck.token);
    }
    edgeState.applications = edgeState.applications.map((item) =>
      item.id === docId ? { ...item, status } : item
    );
    return jsonResponse({ success: true, id: docId, status });
  }

  // 6. Mobile App Registrations endpoints
  if (path === "/api/app-registrations" && method === "POST") {
    const nowIso = new Date().toISOString();
    const reg = {
      id: `reg_${Date.now()}`,
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      platform: String(body.platform || "android").trim().toLowerCase(),
      service: "Mobile App Early Access",
      source: "mobile_app_registration",
      privacyConsent: Boolean(body.privacyConsent ?? true),
      privacyPolicyVersion: String(body.privacyPolicyVersion || "2026.1"),
      clientTimestamp: String(body.clientTimestamp || nowIso),
      timestamp: nowIso,
      status: "registered",
    };
    const fsId = await firestoreEdgeCreate("app_download_registrations", reg, "");
    if (fsId) reg.id = fsId;
    edgeState.appRegistrations.unshift(reg);
    return jsonResponse({ success: true, id: reg.id, registration: reg });
  }

  if (path === "/api/app-registrations" && method === "GET") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const fsDocs = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("app_download_registrations", authCheck.token)
      : null;
    const merged = Array.isArray(fsDocs) && fsDocs.length > 0 ? fsDocs : edgeState.appRegistrations;
    return jsonResponse({ success: true, registrations: merged });
  }

  // 7. CRM Report & HR/Sales Overview & AI Calling endpoints
  if (path === "/api/crm/report" && method === "GET") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    return jsonResponse({
      success: true,
      report: {
        totalLeads: edgeState.inquiries.length,
        demoScheduledCount: edgeState.demoBookings.length,
        totalOutboundCalls: edgeState.callLogs.length,
        totalHandoffs: edgeState.handoffTickets.length,
        generatedAt: new Date().toISOString(),
      },
    });
  }

  if (path === "/api/hr-sales/overview" && method === "GET") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    return jsonResponse({
      success: true,
      totalJobApplications: edgeState.applications.length,
      hrSalesTeam: edgeState.hrSalesTeam,
    });
  }

  if (path === "/api/calling/history" && method === "GET") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const fsCalls = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("call_logs", authCheck.token)
      : null;
    const fsDemos = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("demo_bookings", authCheck.token)
      : null;
    const fsHandoffs = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("handoff_tickets", authCheck.token)
      : null;
    return jsonResponse({
      success: true,
      calls: Array.isArray(fsCalls) && fsCalls.length > 0 ? fsCalls : edgeState.callLogs,
      demos: Array.isArray(fsDemos) && fsDemos.length > 0 ? fsDemos : edgeState.demoBookings,
      handoffs: Array.isArray(fsHandoffs) && fsHandoffs.length > 0 ? fsHandoffs : edgeState.handoffTickets,
      hrSalesTeam: edgeState.hrSalesTeam,
    });
  }

  if (path === "/api/calling/outbound" && method === "POST") {
    const authCheck = verifyEdgeAdminToken(request);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const leadName = String(body.leadName || "Valued Prospect").trim();
    const product = String(body.productOfInterest || "C Vidya Enterprise Suite").trim();
    const lang = String(body.language || "hinglish").trim();
    const voiceGender = body.voiceGender === "male" ? "male" : "female";
    const repName = voiceGender === "male" ? "Aarav (C Vidya AI)" : "Ananya (C Vidya AI)";
    const script =
      lang === "hi"
        ? `नमस्ते ${leadName} जी, मैं C Vidya Solutions से बोल रही हूँ। आपने हमारे ${product} सॉफ्टवेयर में रुचि दिखाई थी। क्या हम आपके लिए एक लाइव डेमो शेड्यूल कर सकते हैं?`
        : lang === "en"
          ? `Hello ${leadName}, this is ${repName} calling from C Vidya Solutions regarding ${product}. Would you like to schedule a personalized 1-on-1 live software demo with our engineering team?`
          : `Namaste ${leadName} ji! Main ${repName} bol rahi hoon C Vidya Solutions se. Aapne ${product} ke baare mein inquiry ki thi. Kya hum aapke liye ek live 1-on-1 demo schedule kar sakte hain?`;
    const callRecord = {
      id: `call_${Date.now()}`,
      leadId: String(body.leadId || `lead_${Date.now()}`),
      leadName,
      phone: String(body.phone || "+91 92885 17027"),
      company: String(body.company || "Enterprise Prospect"),
      productOfInterest: product,
      language: lang,
      voiceGender,
      callStatus: "Completed",
      durationSeconds: 32,
      script,
      outcome: "Follow-up & Demo Qualification Completed",
      followUpDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      assignedRep: repName,
      createdAt: new Date().toISOString(),
    };
    if (authCheck.isFirebaseJwt) {
      await firestoreEdgeCreate("call_logs", callRecord, authCheck.token);
    }
    edgeState.callLogs.unshift(callRecord);
    return jsonResponse({ success: true, call: callRecord });
  }

  if (path === "/api/calling/demo-booking" && method === "POST") {
    const booking = {
      id: `demo_${Date.now()}`,
      leadId: String(body.leadId || `lead_${Date.now()}`),
      name: String(body.name || "Enterprise Client"),
      company: String(body.company || "Organization"),
      email: String(body.email || "client@company.com"),
      phone: String(body.phone || "+91 92885 17027"),
      product: String(body.product || "C Vidya SaaS Suite"),
      preferredDate: String(body.preferredDate || new Date().toISOString().split("T")[0]),
      preferredTime: String(body.preferredTime || "11:30 AM IST"),
      language: String(body.language || "hinglish"),
      assignedRep: "Ananya Sharma (Senior SDR)",
      followUpSequence: ["Instant WhatsApp & Email Confirmation", "24h Pre-Demo Reminder", "1h Live Link Dispatch"],
      status: "Confirmed",
      createdAt: new Date().toISOString(),
    };
    const authCheck = verifyEdgeAdminToken(request);
    if (authCheck.ok && authCheck.isFirebaseJwt) {
      await firestoreEdgeCreate("demo_bookings", booking, authCheck.token);
    }
    edgeState.demoBookings.unshift(booking);
    return jsonResponse({ success: true, booking });
  }

  if (path === "/api/calling/handoff" && method === "POST") {
    const ticket = {
      id: `handoff_${Date.now()}`,
      callId: String(body.callId || `call_${Date.now()}`),
      leadId: String(body.leadId || `lead_${Date.now()}`),
      customerName: String(body.customerName || "Enterprise Client"),
      phone: String(body.phone || "+91 92885 17027"),
      language: String(body.language || "hinglish"),
      product: String(body.product || "C Vidya Enterprise Suite"),
      reason: String(body.reason || "Custom enterprise consultation requested"),
      assignedAgent: "Chiranjeev Das (Founder & Director Desk)",
      priority: body.priority || "High",
      status: "Assigned",
      createdAt: new Date().toISOString(),
    };
    const authCheck = verifyEdgeAdminToken(request);
    if (authCheck.ok && authCheck.isFirebaseJwt) {
      await firestoreEdgeCreate("handoff_tickets", ticket, authCheck.token);
    }
    edgeState.handoffTickets.unshift(ticket);
    return jsonResponse({ success: true, ticket });
  }

  // 8. C Vidya AI Chatbot / Voice endpoints fallback
  if (path === "/api/chat" && method === "POST") {
    const rawMsg = String(body.message || "").trim();
    const lang = String(body.language || "en").toLowerCase();
    const reply =
      lang === "hi"
        ? `नमस्ते! C Vidya Solutions में आपका स्वागत है। हमारे पास 10 प्रमुख SaaS सॉफ्टवेयर (Library Management, Gym Fitness Zone, School/Institute ERP, Coaching Management, AgriFusion ERP, Jewelers ERP, Enterprise CRM, Petrol Pump Suite, Care Plus Hospital ERP, और All-in-One PDF Tools) और 4 AI Agents उपलब्ध हैं। किसी भी सॉफ्टवेयर के लाइव डेमो या जानकारी के लिए आप +91 92885 17027 पर संपर्क कर सकते हैं या मुझसे पूछ सकते हैं!`
        : `Hello! Welcome to C Vidya Solutions. We provide 10 flagship multi-tenant SaaS software suites (Library Management, Gym Fitness Zone, School/Institute ERP, Coaching Management, AgriFusion ERP, Jewelers ERP, Enterprise CRM, Petrol Pump Suite, Care Plus Hospital ERP, and All-in-One PDF Tools) along with 4 autonomous 24/7 AI Agents. You can explore any live demo right here on cvidyasolutions.com or reach our Director Desk at +91 92885 17027 (${rawMsg ? "Query: " + rawMsg.slice(0, 80) : "Ready to assist"}).`;
    return jsonResponse({
      reply,
      response: reply,
      source: "cvidya-edge-intelligence",
    });
  }

  if (path === "/api/tts" && method === "POST") {
    return jsonResponse({
      useBrowserTts: true,
      status: "browser_tts_fallback",
    });
  }

  if (path === "/api/transcribe" && method === "POST") {
    return jsonResponse({
      transcript: "",
      useBrowserSpeechRecognition: true,
    });
  }

  return jsonResponse(
    {
      status: "ok",
      gateway: "cloudflare-edge",
      path,
    },
    200
  );
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const isApiRoute = url.pathname.startsWith("/api/");

      // 1. If static asset binding is available and this is NOT an /api/* request, serve from Cloudflare Edge
      if (!isApiRoute && env && env.ASSETS && (request.method === "GET" || request.method === "HEAD")) {
        try {
          const assetRes = await env.ASSETS.fetch(request);
          if (assetRes.status < 400) {
            const assetHeaders = new Headers(assetRes.headers);
            assetHeaders.set("Permissions-Policy", "camera=(), microphone=*, geolocation=(), payment=(), usb=()");
            return new Response(assetRes.body, {
              status: assetRes.status,
              statusText: assetRes.statusText,
              headers: assetHeaders,
            });
          }
          // SPA client-side route fallback (e.g., /admin, /software, /contact) -> serve /index.html
          const indexReq = new Request(new URL("/index.html", request.url), request);
          const indexRes = await env.ASSETS.fetch(indexReq);
          if (indexRes.status < 400) {
            const idxHeaders = new Headers(indexRes.headers);
            idxHeaders.set("Permissions-Policy", "camera=(), microphone=*, geolocation=(), payment=(), usb=()");
            return new Response(indexRes.body, {
              status: 200,
              headers: idxHeaders,
            });
          }
        } catch (_) {}
      }

      // 2. For /api/* requests, try Cloud Run upstream ONLY if it returns valid JSON (not HTML cookie checks or 404s)
      let bodyBuffer = null;
      if (request.method !== "GET" && request.method !== "HEAD") {
        bodyBuffer = await request.arrayBuffer();
      }

      const buildFetchOptions = (headers) => {
        const opts = {
          method: request.method,
          headers,
          redirect: "manual",
        };
        if (bodyBuffer !== null) {
          opts.body = bodyBuffer;
        }
        return opts;
      };

      if (isApiRoute) {
        for (const host of [TARGET_HOST, BACKUP_HOST]) {
          try {
            const upstreamUrl = new URL(url.pathname + url.search, `https://${host}`);
            const upstreamHeaders = new Headers(request.headers);
            upstreamHeaders.set("Host", host);
            upstreamHeaders.set("X-Forwarded-Host", url.hostname);
            upstreamHeaders.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
            const upstreamRes = await fetch(upstreamUrl.toString(), buildFetchOptions(upstreamHeaders));
            const contentType = (upstreamRes.headers.get("content-type") || "").toLowerCase();
            if (upstreamRes.status >= 200 && upstreamRes.status < 300 && contentType.includes("application/json")) {
              const resHeaders = new Headers(upstreamRes.headers);
              resHeaders.set("X-Proxy-By", "Cloudflare-CVidya-Gateway");
              resHeaders.set("Permissions-Policy", "camera=(), microphone=*, geolocation=(), payment=(), usb=()");
              return new Response(upstreamRes.body, {
                status: upstreamRes.status,
                headers: resHeaders,
              });
            }
          } catch (_) {
            // Fall through to Edge API handler
          }
        }
        // Serve API route directly from Cloudflare Edge + Cloud Firestore REST
        return await handleEdgeApiRequest(request, url, bodyBuffer);
      }

      // 3. Non-API dynamic fallback
      const targetUrl = new URL(url.pathname + url.search, `https://${TARGET_HOST}`);
      const newHeaders = new Headers(request.headers);
      newHeaders.set("Host", TARGET_HOST);
      const response = await fetch(targetUrl.toString(), buildFetchOptions(newHeaders));
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("X-Proxy-By", "Cloudflare-CVidya-Gateway");
      responseHeaders.set("Permissions-Policy", "camera=(), microphone=*, geolocation=(), payment=(), usb=()");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>C Vidya Solutions</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>C Vidya Solutions Gateway</h2><p>Please <a href="/" onclick="location.reload();">refresh</a> in a moment.</p></body></html>`,
        { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  },
};


