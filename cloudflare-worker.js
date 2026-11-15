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

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CVidya-Signature-256, X-GitHub-Delivery",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Permissions-Policy": "camera=(), microphone=*, geolocation=(), payment=(), usb=()",
      "X-Proxy-By": "Cloudflare-CVidya-Edge",
      ...extraHeaders,
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

let cachedEdgeGoogleJwks = {
  keys: [],
  expiresAtMs: 0,
};

function base64UrlToUint8Array(segment) {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function fetchEdgeGoogleJwks(forceRefresh = false) {
  if (!forceRefresh && cachedEdgeGoogleJwks.keys.length > 0 && cachedEdgeGoogleJwks.expiresAtMs > Date.now()) {
    return cachedEdgeGoogleJwks.keys;
  }
  try {
    const resp = await fetch(
      "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
      { method: "GET", headers: { Accept: "application/json" } }
    );
    if (!resp.ok) return cachedEdgeGoogleJwks.keys;
    const cacheControl = resp.headers.get("cache-control") || "";
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
    const maxAgeSec = maxAgeMatch ? Math.max(60, parseInt(maxAgeMatch[1], 10)) : 3600;
    const data = await resp.json();
    const keys = Array.isArray(data?.keys) ? data.keys : [];
    if (keys.length > 0) {
      cachedEdgeGoogleJwks = {
        keys,
        expiresAtMs: Date.now() + maxAgeSec * 1000,
      };
    }
    return cachedEdgeGoogleJwks.keys;
  } catch {
    return cachedEdgeGoogleJwks.keys;
  }
}

async function verifyEdgeAdminToken(request, env = {}) {
  const token = extractBearerToken(request);
  if (!token) return { ok: false, token: "" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, token: "" };
  const [headerSeg, payloadSeg, sigSeg] = parts;
  const header = decodeBase64UrlJson(headerSeg);
  const payload = decodeBase64UrlJson(payloadSeg);
  if (!header || !payload || !sigSeg || sigSeg === "fakesignature") {
    return { ok: false, token: "" };
  }
  if (
    header.alg !== "RS256" ||
    header.kid === "cvidya-owner-vault-v1" ||
    typeof header.kid !== "string" ||
    !header.kid.trim()
  ) {
    return { ok: false, token: "" };
  }
  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.exp || typeof payload.exp !== "number" || payload.exp <= nowSec) {
    return { ok: false, token: "" };
  }
  if (typeof payload.iat === "number" && payload.iat > nowSec + 300) {
    return { ok: false, token: "" };
  }
  if (typeof payload.auth_time === "number" && payload.auth_time > nowSec + 300) {
    return { ok: false, token: "" };
  }
  if (payload.email_verified !== true) {
    return { ok: false, token: "" };
  }
  if (typeof payload.sub !== "string" || !payload.sub.trim() || payload.sub.length > 128) {
    return { ok: false, token: "" };
  }
  const email = String(payload.email || "").trim().toLowerCase();
  if (!email || !AUTHORIZED_OWNER_EMAILS.includes(email)) {
    return { ok: false, token: "" };
  }
  const projectId = String((env && env.FIREBASE_PROJECT_ID) || FIREBASE_PROJECT_ID).trim();
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) {
    return { ok: false, token: "" };
  }

  try {
    let keys = await fetchEdgeGoogleJwks(false);
    let matchedKey = keys.find((k) => k.kid === header.kid);
    if (!matchedKey) {
      keys = await fetchEdgeGoogleJwks(true);
      matchedKey = keys.find((k) => k.kid === header.kid);
    }
    if (!matchedKey) return { ok: false, token: "" };

    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      matchedKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = base64UrlToUint8Array(sigSeg);
    const signedBytes = new TextEncoder().encode(`${headerSeg}.${payloadSeg}`);
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, sigBytes, signedBytes);
    if (!valid) return { ok: false, token: "" };
  } catch {
    return { ok: false, token: "" };
  }

  return {
    ok: true,
    token,
    email,
    uid: payload.sub.trim(),
    isFirebaseJwt: true,
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

async function firestoreEdgeList(collectionName, bearerToken, maxPages = 3) {
  try {
    const headers = { Accept: "application/json" };
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
    const allDocs = [];
    let pageToken = "";
    let pageCount = 0;

    while (pageCount < maxPages) {
      pageCount++;
      const tokenQuery = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "";
      const resp = await fetch(
        `${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}?pageSize=300${tokenQuery}`,
        { method: "GET", headers }
      );
      if (!resp.ok) return pageCount === 1 ? null : allDocs;
      const data = await resp.json();
      const docs = Array.isArray(data?.documents) ? data.documents : [];
      for (const d of docs) {
        const id = String(d?.name || "").split("/").pop() || "";
        const fields = d?.fields || {};
        const parsed = { id };
        for (const [k, v] of Object.entries(fields)) {
          parsed[k] = fromFirestoreValue(v);
        }
        allDocs.push(parsed);
      }
      if (typeof data?.nextPageToken === "string" && data.nextPageToken.trim()) {
        pageToken = data.nextPageToken.trim();
      } else {
        break;
      }
    }
    return allDocs;
  } catch {
    return null;
  }
}

async function firestoreEdgeGetDoc(collectionName, docId, bearerToken) {
  try {
    const headers = { Accept: "application/json" };
    if (bearerToken) {
      headers.Authorization = `Bearer ${bearerToken}`;
    }
    const resp = await fetch(
      `${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}`,
      { method: "GET", headers }
    );
    if (resp.status === 404) return { status: "not_found" };
    if (!resp.ok) return { status: "error" };
    const docData = await resp.json();
    const fields = docData?.fields || {};
    const parsed = { id: docId };
    for (const [k, v] of Object.entries(fields)) {
      parsed[k] = fromFirestoreValue(v);
    }
    return { status: "found", data: parsed };
  } catch {
    return { status: "error" };
  }
}

async function firestoreEdgeCreate(collectionName, docData, bearerToken, env = {}) {
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
    const apiKey = String((env && env.FIREBASE_WEB_API_KEY) || "").trim();
    const keyQuery = apiKey ? `?key=${encodeURIComponent(apiKey)}` : "";
    const resp = await fetch(
      `${FIRESTORE_BASE_URL}/${encodeURIComponent(collectionName)}${keyQuery}`,
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

// ============================================================================
// AUTOMATIC SOFTWARE & AI AGENT DEPLOYMENT REGISTRY (EDGE STATE + KV PERSIST)
// ============================================================================
const EDGE_DEPLOYMENT_SEED = [
  { productId: "cvidya-library-management", legacyId: "library", name: "Library Management System", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://v.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-library-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-fitness-zone", legacyId: "fitness", name: "Fitness Zone & Gym Management", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://fitzone.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-fitness-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-institutes-management", legacyId: "institutes", name: "Institutes Management System", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "", version: "0.0.0", commitSha: "", buildId: "seed-institutes-pending", deploymentStatus: "coming-soon", enabled: false, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Coming Soon", failureAlert: false },
  { productId: "cvidya-coaching-management", legacyId: "coaching", name: "Coaching Management System", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://coaching.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-coaching-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-enterprise-crm", legacyId: "crm", name: "Enterprise CRM & Client Management", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://crm.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-crm-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-petrol-pump", legacyId: "petrol-pump", name: "Petrol Pump Management Software", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://c-vidya-cloud-petrol-pump.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-petrol-pump-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-agrifusion", legacyId: "farming", name: "AgriFusion & Smart Farming Platform", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://fresh.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-agrifusion-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-jewellers-management", legacyId: "members", name: "Jewellers & Jewellery Management Software", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://jewelry.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-jewellers-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-care-plus", legacyId: "care-plus", name: "Care Plus Healthcare & Clinic System", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://care-plus.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-care-plus-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-pdf-media-tools", legacyId: "pdf-media-tools", name: "C Vidya PDF & Media Tools SaaS", category: "software", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://c-vidya-pdf-saas-tools.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-pdf-media-tools-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "Live SaaS", failureAlert: false },
  { productId: "cvidya-ai-social-media-agent", legacyId: "ai-social", name: "AI Social Media Automation Agent", category: "ai-agent", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-ai-social-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "AI Agent", failureAlert: false },
  { productId: "cvidya-ai-customer-support-agent", legacyId: "ai-support", name: "AI Customer Support & Resolution Agent", category: "ai-agent", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-ai-support-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "AI Agent", failureAlert: false },
  { productId: "cvidya-salesflow-ai-agent", legacyId: "ai-salesflow", name: "SalesFlow AI Outreach & Pipeline Agent", category: "ai-agent", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-ai-salesflow-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "AI Agent", failureAlert: false },
  { productId: "cvidya-b2b-saas-growth-agent", legacyId: "ai-marketing", name: "B2B SaaS Growth & Marketing AI Agent", category: "ai-agent", hostingPlatform: "cloudflare-workers", githubRepository: "", branch: "main", environment: "production", deploymentUrl: "https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/", version: "1.0.0", commitSha: "", buildId: "seed-ai-marketing-1.0.0", deploymentStatus: "active", enabled: true, connectedToAutoDeploy: false, deployedBy: "initial-seed", lastDeploymentAt: null, updatedAt: "2026-01-01T00:00:00.000Z", badge: "AI Agent", failureAlert: false },
];

const edgeDeploymentRegistry = {
  entries: new Map(EDGE_DEPLOYMENT_SEED.map((e) => [e.productId, { ...e }])),
  history: [],
  auditLogs: [],
  seenBuildKeys: new Set(),
  registryVersion: 1,
  kvLoaded: false,
};

const EDGE_PRODUCT_ALIASES = (() => {
  const m = {};
  for (const e of EDGE_DEPLOYMENT_SEED) {
    m[e.productId.toLowerCase()] = e.productId;
    m[e.legacyId.toLowerCase()] = e.productId;
  }
  m["agrifusion"] = "cvidya-agrifusion";
  m["jewellers"] = "cvidya-jewellers-management";
  m["jewelry"] = "cvidya-jewellers-management";
  m["fitzone"] = "cvidya-fitness-zone";
  return m;
})();

function validateEdgeDeploymentUrl(rawUrl, allowEmpty = false) {
  if (typeof rawUrl !== "string") return { valid: false, normalizedUrl: "", error: "Deployment URL must be a string." };
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return allowEmpty ? { valid: true, normalizedUrl: "" } : { valid: false, normalizedUrl: "", error: "Deployment URL cannot be empty." };
  }
  if (trimmed.length > 500) return { valid: false, normalizedUrl: "", error: "Deployment URL exceeds 500 characters." };
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, normalizedUrl: "", error: "Invalid deployment URL format." };
  }
  if (parsed.protocol !== "https:") return { valid: false, normalizedUrl: "", error: "Deployment URL must use https://." };
  if (parsed.username || parsed.password) return { valid: false, normalizedUrl: "", error: "Deployment URL must not contain credentials." };
  const host = parsed.hostname.toLowerCase();
  if (host === "localhost" || host === "metadata.google.internal" || host.endsWith(".local") || host.endsWith(".internal") || /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) {
    return { valid: false, normalizedUrl: "", error: "Local, private, IP, or internal hostnames are forbidden." };
  }
  if (parsed.searchParams.has("preview") || parsed.searchParams.has("staging")) {
    return { valid: false, normalizedUrl: "", error: "Preview or staging query parameters are not permitted." };
  }
  if (host.endsWith(".pages.dev")) {
    const labels = host.split(".");
    if (labels.length > 3 || /^(preview|staging|dev|test|pr-\d+|branch)-/i.test(labels[0] || "")) {
      return { valid: false, normalizedUrl: "", error: `Preview or staging URL '${host}' is rejected.` };
    }
  }
  if (/^(preview|staging|stage|dev|qa|sandbox|local|localhost|pr-\d+)\./i.test(host) || /-(preview|staging|dev|pr-\d+)\./i.test(host)) {
    return { valid: false, normalizedUrl: "", error: `Preview or staging URL '${host}' is rejected.` };
  }
  const isTrusted = host === "cvidyasolutions.com" || host === "www.cvidyasolutions.com" || host.endsWith(".cvidyasolutions.com") || host.endsWith(".cvidyasolutions.workers.dev") || host.endsWith(".pages.dev");
  if (!isTrusted) return { valid: false, normalizedUrl: "", error: `Untrusted deployment hostname '${host}'.` };
  return { valid: true, normalizedUrl: parsed.toString() };
}

function edgeTimingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyEdgeWebhookAuth(request, rawBodyBuffer, env) {
  const secret = String((env && env.DEPLOYMENT_WEBHOOK_SECRET) || "").trim();
  const authHeader = (request.headers.get("Authorization") || request.headers.get("authorization") || "").trim();
  const sigHeader = (request.headers.get("X-CVidya-Signature-256") || request.headers.get("x-cvidya-signature-256") || "").trim();

  if (!authHeader && !sigHeader) {
    return { ok: false, status: 401, reason: "Missing webhook authentication credentials." };
  }
  if (!secret) {
    return { ok: false, status: 503, reason: "Worker DEPLOYMENT_WEBHOOK_SECRET is not configured." };
  }
  if (sigHeader) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, rawBodyBuffer || new ArrayBuffer(0));
    const expectedHex = Array.from(new Uint8Array(sigBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    const providedHex = sigHeader.replace(/^sha256=/i, "").trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(providedHex) || !edgeTimingSafeEqual(providedHex, expectedHex)) {
      return { ok: false, status: 401, reason: "Invalid X-CVidya-Signature-256 HMAC signature." };
    }
  }
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match || !edgeTimingSafeEqual(match[1].trim(), secret)) {
      return { ok: false, status: 401, reason: "Invalid Bearer deployment webhook token." };
    }
  }
  return { ok: true, status: 200 };
}

async function hydrateEdgeDeploymentKV(env) {
  if (!env || !env.DEPLOYMENT_REGISTRY_KV || edgeDeploymentRegistry.kvLoaded) return;
  try {
    const saved = await env.DEPLOYMENT_REGISTRY_KV.get("registry_snapshot", "json");
    if (saved && Array.isArray(saved.entries)) {
      for (const item of saved.entries) {
        if (item && item.productId && edgeDeploymentRegistry.entries.has(item.productId)) {
          edgeDeploymentRegistry.entries.set(item.productId, item);
        }
      }
      if (Array.isArray(saved.history)) edgeDeploymentRegistry.history = saved.history.slice(0, 100);
      if (Array.isArray(saved.auditLogs)) edgeDeploymentRegistry.auditLogs = saved.auditLogs.slice(0, 200);
      if (typeof saved.registryVersion === "number") edgeDeploymentRegistry.registryVersion = saved.registryVersion;
    }
    edgeDeploymentRegistry.kvLoaded = true;
  } catch {
    // Non-fatal
  }
}

async function persistEdgeDeploymentKV(env) {
  if (!env || !env.DEPLOYMENT_REGISTRY_KV) return;
  try {
    await env.DEPLOYMENT_REGISTRY_KV.put(
      "registry_snapshot",
      JSON.stringify({
        registryVersion: edgeDeploymentRegistry.registryVersion,
        entries: Array.from(edgeDeploymentRegistry.entries.values()),
        history: edgeDeploymentRegistry.history.slice(0, 100),
        auditLogs: edgeDeploymentRegistry.auditLogs.slice(0, 200),
      })
    );
  } catch {
    // Non-fatal
  }
}

async function handleEdgeApiRequest(request, url, bodyBuffer, env = {}) {
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

  if (path === "/api/health") {
    return jsonResponse({
      status: "healthy",
      gateway: "cloudflare-edge",
      timestamp: new Date().toISOString(),
    });
  }

  if (path === "/api/proxy/petrol-pump") {
    return Response.redirect(`${url.origin}/software/petrol-pump/index.html`, 302);
  }
  if (path === "/api/proxy/library") {
    return Response.redirect("https://v.cvidyasolutions.workers.dev/", 302);
  }
  if (path === "/api/proxy/fitness") {
    return Response.redirect("https://fitzone.cvidyasolutions.workers.dev/", 302);
  }

  if (path === "/api/admin/verify" && method === "POST") {
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse({ success: false, error: "Unauthorized access." }, 401);
    }
    return jsonResponse({
      success: true,
      email: authCheck.email,
      uid: authCheck.uid,
      verifiedAt: new Date().toISOString(),
    });
  }

  if (path === "/api/admin/vault/session" && method === "POST") {
    return jsonResponse(
      {
        success: false,
        error: "Direct vault session bypass is disabled. Verified Google Sign-In and Owner Security Password are required.",
      },
      403
    );
  }

  if (path === "/api/admin/vault/verify" && method === "POST") {
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse(
        { success: false, error: "Unauthorized access. Verified owner Google session required." },
        401
      );
    }
    const cleanHash = String(body.passwordHash || "").trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(cleanHash)) {
      return jsonResponse({ success: false, error: "Invalid cryptographic vault verification payload." }, 400);
    }

    const existing = await firestoreEdgeGetDoc("admins", authCheck.uid, authCheck.token);
    if (existing.status === "found") {
      const storedEmail = String(existing.data?.email || "").trim().toLowerCase();
      const storedHash = String(existing.data?.passwordHash || "").trim().toLowerCase();
      if (storedEmail !== authCheck.email || !/^[a-f0-9]{64}$/.test(storedHash) || !edgeTimingSafeEqual(cleanHash, storedHash)) {
        return jsonResponse(
          { success: false, error: "Incorrect Owner Security Password. Access strictly denied." },
          403
        );
      }
      edgeState.vaultHashes.set(authCheck.uid, storedHash);
      return jsonResponse({
        success: true,
        uid: authCheck.uid,
        email: authCheck.email,
        verifiedAt: new Date().toISOString(),
      });
    }

    if (existing.status === "error") {
      const cached = edgeState.vaultHashes.get(authCheck.uid);
      if (cached && edgeTimingSafeEqual(cleanHash, cached)) {
        return jsonResponse({
          success: true,
          uid: authCheck.uid,
          email: authCheck.email,
          verifiedAt: new Date().toISOString(),
        });
      }
      return jsonResponse(
        { success: false, error: "Unable to verify Owner Security Vault against Firestore. Access denied." },
        503
      );
    }

    const envRequiredHash = String((env && env.ADMIN_VAULT_PASSWORD_HASH) || "").trim().toLowerCase();
    if (/^[a-f0-9]{64}$/.test(envRequiredHash) && !edgeTimingSafeEqual(cleanHash, envRequiredHash)) {
      return jsonResponse(
        { success: false, error: "Incorrect Owner Security Password. Access strictly denied." },
        403
      );
    }

    const saved = await firestoreEdgePatch(
      "admins",
      authCheck.uid,
      {
        uid: authCheck.uid,
        email: authCheck.email,
        passwordHash: cleanHash,
        updatedAt: new Date().toISOString(),
      },
      authCheck.token
    );
    if (!saved) {
      return jsonResponse(
        { success: false, error: "Failed to initialize Owner Security Vault in Cloud Firestore." },
        503
      );
    }
    edgeState.vaultHashes.set(authCheck.uid, cleanHash);
    return jsonResponse({
      success: true,
      initialized: true,
      uid: authCheck.uid,
      email: authCheck.email,
      verifiedAt: new Date().toISOString(),
    });
  }

  if (path === "/api/admin/vault/update" && method === "POST") {
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse(
        { success: false, error: "Unauthorized access. Verified owner Google session required." },
        401
      );
    }
    const cleanCurrentHash = String(body.currentPasswordHash || "").trim().toLowerCase();
    const cleanNewHash = String(body.newPasswordHash || "").trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(cleanCurrentHash) || !/^[a-f0-9]{64}$/.test(cleanNewHash)) {
      return jsonResponse(
        { success: false, error: "Valid current and new SHA-256 password hashes are required." },
        400
      );
    }
    const existing = await firestoreEdgeGetDoc("admins", authCheck.uid, authCheck.token);
    const storedHash =
      existing.status === "found"
        ? String(existing.data?.passwordHash || "").trim().toLowerCase()
        : edgeState.vaultHashes.get(authCheck.uid) || "";
    if (!storedHash || !edgeTimingSafeEqual(cleanCurrentHash, storedHash)) {
      return jsonResponse(
        { success: false, error: "Current Owner Security Password is incorrect. Password update denied." },
        403
      );
    }
    const updated = await firestoreEdgePatch(
      "admins",
      authCheck.uid,
      {
        uid: authCheck.uid,
        email: authCheck.email,
        passwordHash: cleanNewHash,
        updatedAt: new Date().toISOString(),
      },
      authCheck.token
    );
    if (!updated) {
      return jsonResponse(
        { success: false, error: "Failed to persist updated Owner Security Password to Cloud Firestore." },
        503
      );
    }
    edgeState.vaultHashes.set(authCheck.uid, cleanNewHash);
    return jsonResponse({
      success: true,
      uid: authCheck.uid,
      email: authCheck.email,
      updatedAt: new Date().toISOString(),
    });
  }

  if ((path === "/api/inquiry" || path === "/api/inquiries" || path === "/api/crm/leads") && method === "POST") {
    const nowIso = new Date().toISOString();
    const rawPhone = String(body.phone || "").trim();
    const newLead = {
      id: `inq_${Date.now()}`,
      name: String(body.name || "Valued Client").trim(),
      email: String(body.email || "info@cvidyasolutions.com").trim(),
      phone: rawPhone.length >= 5 ? rawPhone : "Not Provided",
      service: String(body.service || body.product || "General Inquiry").trim(),
      message: String(body.message || body.requirements || "").trim(),
      company: String(body.company || "").trim(),
      cityCountry: String(body.cityCountry || "").trim(),
      businessType: String(body.businessType || "").trim(),
      source: String(body.source || "website").trim(),
      status: "New",
      timestamp: nowIso,
    };
    const fsId = await firestoreEdgeCreate("inquiries", newLead, "", env);
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
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const fsDocs = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("inquiries", authCheck.token)
      : null;
    const merged = Array.isArray(fsDocs) ? fsDocs : edgeState.inquiries;
    if (path === "/api/crm/leads") {
      return jsonResponse({ success: true, leads: merged });
    }
    return jsonResponse(merged);
  }

  if ((path.startsWith("/api/inquiries/") || path.startsWith("/api/crm/leads/")) && (method === "PATCH" || method === "PUT")) {
    const authCheck = await verifyEdgeAdminToken(request, env);
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
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const docId = decodeURIComponent(path.split("/").pop() || "");
    edgeState.inquiries = edgeState.inquiries.filter((item) => item.id !== docId);
    return jsonResponse({ success: true, id: docId });
  }

  if (
    (path === "/api/application" ||
      path === "/api/applications" ||
      path === "/api/job-applications") &&
    method === "POST"
  ) {
    const nowIso = new Date().toISOString();
    const rawAppPhone = String(body.phone || "").trim();
    const record = {
      id: `app_${Date.now()}`,
      name: String(body.name || "Applicant").trim(),
      email: String(body.email || "").trim(),
      phone: rawAppPhone.length >= 5 ? rawAppPhone : "Not Provided",
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
    const fsId = await firestoreEdgeCreate("job_applications", record, "", env);
    if (fsId) record.id = fsId;
    edgeState.applications.unshift(record);
    return jsonResponse({
      success: true,
      id: record.id,
      application: record,
    });
  }

  if ((path === "/api/applications" || path === "/api/job-applications") && method === "GET") {
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const fsDocs = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("job_applications", authCheck.token)
      : null;
    const merged = Array.isArray(fsDocs) ? fsDocs : edgeState.applications;
    return jsonResponse({ success: true, applications: merged });
  }

  if (
    (path.startsWith("/api/applications/") || path.startsWith("/api/job-applications/")) &&
    (method === "PATCH" || method === "PUT")
  ) {
    const authCheck = await verifyEdgeAdminToken(request, env);
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

  if (path === "/api/app-registrations" && method === "POST") {
    const nowIso = new Date().toISOString();
    const rawRegPhone = String(body.phone || "").trim();
    const reg = {
      id: `reg_${Date.now()}`,
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      phone: rawRegPhone.length >= 5 ? rawRegPhone : "Not Provided",
      platform: String(body.platform || "android").trim().toLowerCase(),
      service: "Mobile App Early Access",
      source: "mobile_app_registration",
      privacyConsent: Boolean(body.privacyConsent ?? true),
      privacyPolicyVersion: String(body.privacyPolicyVersion || "2026.1"),
      clientTimestamp: String(body.clientTimestamp || nowIso),
      timestamp: nowIso,
      status: "registered",
    };
    const fsId = await firestoreEdgeCreate("app_download_registrations", reg, "", env);
    if (fsId) reg.id = fsId;
    edgeState.appRegistrations.unshift(reg);
    return jsonResponse({ success: true, id: reg.id, registration: reg });
  }

  if (path === "/api/app-registrations" && method === "GET") {
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    const fsDocs = authCheck.isFirebaseJwt
      ? await firestoreEdgeList("app_download_registrations", authCheck.token)
      : null;
    const merged = Array.isArray(fsDocs) ? fsDocs : edgeState.appRegistrations;
    return jsonResponse({ success: true, registrations: merged });
  }

  if (path === "/api/crm/report" && method === "GET") {
    const authCheck = await verifyEdgeAdminToken(request, env);
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
    const authCheck = await verifyEdgeAdminToken(request, env);
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
    const authCheck = await verifyEdgeAdminToken(request, env);
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
    const authCheck = await verifyEdgeAdminToken(request, env);
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
      await firestoreEdgeCreate("call_logs", callRecord, authCheck.token, env);
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
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (authCheck.ok && authCheck.isFirebaseJwt) {
      await firestoreEdgeCreate("demo_bookings", booking, authCheck.token, env);
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
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (authCheck.ok && authCheck.isFirebaseJwt) {
      await firestoreEdgeCreate("handoff_tickets", ticket, authCheck.token, env);
    }
    edgeState.handoffTickets.unshift(ticket);
    return jsonResponse({ success: true, ticket });
  }

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

  // 9. Automatic Software & AI Agent Deployment Registry Endpoints
  if (path === "/api/deployments/registry" && method === "GET") {
    await hydrateEdgeDeploymentKV(env);
    const entries = Array.from(edgeDeploymentRegistry.entries.values());
    const etag = `"cvidya-reg-v${edgeDeploymentRegistry.registryVersion}"`;
    if (request.headers.get("If-None-Match") === etag) {
      return new Response(null, { status: 304, headers: { ETag: etag, "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
    }
    const items = entries.map((e) => ({
      productId: e.productId,
      legacyId: e.legacyId,
      name: e.name,
      category: e.category,
      hostingPlatform: e.hostingPlatform,
      deploymentUrl: e.enabled ? e.deploymentUrl : "",
      version: e.version,
      deploymentStatus: e.deploymentStatus,
      enabled: e.enabled,
      connectedToAutoDeploy: e.connectedToAutoDeploy,
      lastDeploymentAt: e.lastDeploymentAt,
      badge: e.badge,
    }));
    return jsonResponse(
      {
        registryVersion: edgeDeploymentRegistry.registryVersion,
        etag,
        updatedAt: entries.reduce((acc, e) => (e.updatedAt > acc ? e.updatedAt : acc), "2026-01-01T00:00:00.000Z"),
        items,
      },
      200,
      { ETag: etag, "Cache-Control": "public, max-age=30, stale-while-revalidate=120" }
    );
  }

  if (path === "/api/deployments/register" && method === "POST") {
    await hydrateEdgeDeploymentKV(env);
    const authCheck = await verifyEdgeWebhookAuth(request, bodyBuffer, env);
    if (!authCheck.ok) {
      return jsonResponse({ success: false, error: authCheck.reason }, authCheck.status);
    }
    const canonicalId = EDGE_PRODUCT_ALIASES[String(body.productId || "").trim().toLowerCase()];
    if (!canonicalId || !edgeDeploymentRegistry.entries.has(canonicalId)) {
      return jsonResponse({ success: false, error: `Unknown productId '${String(body.productId || "")}'.` }, 404);
    }
    const current = edgeDeploymentRegistry.entries.get(canonicalId);
    const rawEnv = String(body.environment || "production").trim().toLowerCase();
    if (rawEnv !== "production") {
      return jsonResponse({ success: false, error: `Only 'production' deployments are accepted (received '${rawEnv}').` }, 400);
    }
    const rawBranch = String(body.branch || "main").trim().replace(/^refs\/heads\//i, "");
    if (rawBranch !== "main") {
      return jsonResponse({ success: false, error: `Only 'main' branch deployments are accepted (received '${rawBranch}').` }, 400);
    }
    const repoSlug = String(body.githubRepository || "").trim();
    if (!/^[a-zA-Z0-9._-]{1,100}\/[a-zA-Z0-9._-]{1,100}$/.test(repoSlug)) {
      return jsonResponse({ success: false, error: "githubRepository must match 'owner/repo' format." }, 400);
    }
    if (current.githubRepository && current.githubRepository.toLowerCase() !== repoSlug.toLowerCase()) {
      return jsonResponse({ success: false, error: `Repository '${repoSlug}' does not match bound repository '${current.githubRepository}'.` }, 403);
    }
    const allowlistRaw = String((env && env.DEPLOYMENT_ALLOWED_REPOS) || "").trim();
    if (allowlistRaw) {
      const allowed = allowlistRaw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      const repoLower = repoSlug.toLowerCase();
      if (allowed.length > 0 && !allowed.some((p) => (p.endsWith("/*") ? repoLower.startsWith(p.slice(0, -1)) : p === repoLower))) {
        return jsonResponse({ success: false, error: `Repository '${repoSlug}' is not in DEPLOYMENT_ALLOWED_REPOS.` }, 403);
      }
    }
    const buildId = String(body.buildId || "").trim().slice(0, 120);
    if (!buildId) {
      return jsonResponse({ success: false, error: "buildId is required." }, 400);
    }
    const statusNorm = String(body.status || "success").trim().toLowerCase();
    const replayKey = `${canonicalId}::${buildId}::${statusNorm}`;
    if (edgeDeploymentRegistry.seenBuildKeys.has(replayKey)) {
      return jsonResponse({ success: true, duplicate: true, message: "Duplicate buildId already processed.", entry: current }, 200);
    }
    const nowIso = new Date().toISOString();
    const deployedAt = String(body.deployedAt || nowIso).slice(0, 64);
    const version = String(body.version || current.version || "1.0.0").slice(0, 60);
    const commitSha = String(body.commitSha || "").slice(0, 80);
    const deployedBy = String(body.deployedBy || "github-actions").slice(0, 80);

    if (statusNorm === "failed" || statusNorm === "failure" || statusNorm === "error") {
      edgeDeploymentRegistry.seenBuildKeys.add(replayKey);
      const reason = String(body.errorMessage || `Build ${buildId} failed`).slice(0, 300);
      const updated = { ...current, githubRepository: current.githubRepository || repoSlug, failureAlert: true, lastFailedAt: deployedAt, lastFailureReason: reason, updatedAt: nowIso };
      edgeDeploymentRegistry.entries.set(canonicalId, updated);
      edgeDeploymentRegistry.history.unshift({ id: `hist_${Date.now()}`, productId: canonicalId, version, commitSha, buildId, deploymentUrl: current.deploymentUrl, hostingPlatform: current.hostingPlatform, githubRepository: repoSlug, branch: "main", environment: "production", status: "failed", deployedBy, deployedAt, message: reason });
      edgeDeploymentRegistry.registryVersion += 1;
      await persistEdgeDeploymentKV(env);
      return jsonResponse({ success: true, failedRecorded: true, message: "Failed deployment recorded as alert; live URL preserved.", entry: updated }, 202);
    }

    const urlCheck = validateEdgeDeploymentUrl(body.deploymentUrl);
    if (!urlCheck.valid) {
      return jsonResponse({ success: false, error: urlCheck.error }, 400);
    }
    const platform = String(body.hostingPlatform || "").toLowerCase().includes("pages") || urlCheck.normalizedUrl.includes(".pages.dev")
      ? "cloudflare-pages"
      : "cloudflare-workers";
    const shouldEnable = current.adminLockedDisabled ? false : true;
    const updated = {
      ...current,
      hostingPlatform: platform,
      githubRepository: repoSlug,
      branch: "main",
      environment: "production",
      deploymentUrl: urlCheck.normalizedUrl,
      version,
      commitSha,
      buildId,
      deploymentStatus: current.adminLockedDisabled ? "inactive" : "active",
      enabled: shouldEnable,
      connectedToAutoDeploy: true,
      deployedBy,
      lastDeploymentAt: deployedAt,
      updatedAt: nowIso,
      badge: current.category === "ai-agent" ? "AI Agent" : shouldEnable ? "Live SaaS" : "Maintenance",
      failureAlert: false,
      lastFailureReason: null,
    };
    edgeDeploymentRegistry.seenBuildKeys.add(replayKey);
    edgeDeploymentRegistry.entries.set(canonicalId, updated);
    edgeDeploymentRegistry.history.unshift({ id: `hist_${Date.now()}`, productId: canonicalId, version, commitSha, buildId, deploymentUrl: urlCheck.normalizedUrl, hostingPlatform: platform, githubRepository: repoSlug, branch: "main", environment: "production", status: "success", deployedBy, deployedAt });
    if (edgeDeploymentRegistry.history.length > 100) edgeDeploymentRegistry.history.length = 100;
    edgeDeploymentRegistry.auditLogs.unshift({ id: `aud_${Date.now()}`, action: "webhook_register_success", productId: canonicalId, actor: deployedBy, timestamp: nowIso, details: `Updated ${canonicalId} -> ${urlCheck.normalizedUrl}` });
    edgeDeploymentRegistry.registryVersion += 1;
    await persistEdgeDeploymentKV(env);
    return jsonResponse({ success: true, message: `Registered deployment for ${canonicalId}.`, entry: updated }, 200);
  }

  if (path === "/api/admin/deployments" && method === "GET") {
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    await hydrateEdgeDeploymentKV(env);
    const entries = Array.from(edgeDeploymentRegistry.entries.values());
    return jsonResponse({
      registryVersion: edgeDeploymentRegistry.registryVersion,
      etag: `"cvidya-reg-v${edgeDeploymentRegistry.registryVersion}"`,
      totalProducts: entries.length,
      activeCount: entries.filter((e) => e.deploymentStatus === "active" && e.enabled).length,
      autoDeployConnectedCount: entries.filter((e) => e.connectedToAutoDeploy).length,
      failureAlertCount: entries.filter((e) => Boolean(e.failureAlert)).length,
      entries,
      history: edgeDeploymentRegistry.history.slice(0, 100),
      auditLogs: edgeDeploymentRegistry.auditLogs.slice(0, 100),
      webhookEndpoint: "/api/deployments/register",
      webhookSecretConfigured: Boolean(env && env.DEPLOYMENT_WEBHOOK_SECRET),
    });
  }

  if (path.startsWith("/api/admin/deployments/") && method === "PATCH") {
    const authCheck = await verifyEdgeAdminToken(request, env);
    if (!authCheck.ok) {
      return jsonResponse({ error: "Unauthorized admin access." }, 401);
    }
    await hydrateEdgeDeploymentKV(env);
    const rawId = decodeURIComponent(path.slice("/api/admin/deployments/".length)).trim().toLowerCase();
    const canonicalId = EDGE_PRODUCT_ALIASES[rawId];
    if (!canonicalId || !edgeDeploymentRegistry.entries.has(canonicalId)) {
      return jsonResponse({ success: false, error: `Unknown productId '${rawId}'.` }, 404);
    }
    const current = edgeDeploymentRegistry.entries.get(canonicalId);
    let nextUrl = current.deploymentUrl;
    if (typeof body.deploymentUrl === "string") {
      const allowEmpty = canonicalId === "cvidya-institutes-management" && !body.deploymentUrl.trim();
      const urlCheck = validateEdgeDeploymentUrl(body.deploymentUrl, allowEmpty);
      if (!urlCheck.valid) {
        return jsonResponse({ success: false, error: urlCheck.error }, 400);
      }
      nextUrl = urlCheck.normalizedUrl;
    }
    let nextRepo = current.githubRepository;
    if (typeof body.githubRepository === "string") {
      const trimmedRepo = body.githubRepository.trim();
      if (trimmedRepo && !/^[a-zA-Z0-9._-]{1,100}\/[a-zA-Z0-9._-]{1,100}$/.test(trimmedRepo)) {
        return jsonResponse({ success: false, error: "GitHub repository must follow 'owner/repo' format." }, 400);
      }
      nextRepo = trimmedRepo;
    }
    const nextEnabled = typeof body.enabled === "boolean" ? body.enabled : (nextUrl && current.deploymentStatus === "coming-soon" ? true : current.enabled);
    const nextAdminLocked = typeof body.enabled === "boolean" ? !body.enabled : (nextUrl && current.deploymentStatus === "coming-soon" ? false : Boolean(current.adminLockedDisabled));
    const nextStatus = !nextUrl ? "coming-soon" : nextEnabled ? "active" : "inactive";
    const nowIso = new Date().toISOString();
    const updated = {
      ...current,
      deploymentUrl: nextUrl,
      githubRepository: nextRepo,
      hostingPlatform: body.hostingPlatform === "cloudflare-pages" || nextUrl.includes(".pages.dev") ? "cloudflare-pages" : current.hostingPlatform,
      version: typeof body.version === "string" && body.version.trim() ? body.version.trim().slice(0, 60) : current.version,
      enabled: nextEnabled,
      adminLockedDisabled: nextAdminLocked,
      deploymentStatus: nextStatus,
      badge: nextStatus === "coming-soon" ? "Coming Soon" : current.category === "ai-agent" ? "AI Agent" : nextEnabled ? "Live SaaS" : "Maintenance",
      failureAlert: body.clearFailureAlert ? false : current.failureAlert,
      lastFailureReason: body.clearFailureAlert ? null : current.lastFailureReason,
      updatedAt: nowIso,
    };
    edgeDeploymentRegistry.entries.set(canonicalId, updated);
    edgeDeploymentRegistry.registryVersion += 1;
    await persistEdgeDeploymentKV(env);
    if (authCheck.isFirebaseJwt) {
      await firestoreEdgePatch("cvidya_deployment_registry", canonicalId, updated, authCheck.token);
    }
    return jsonResponse({ success: true, message: `Updated ${canonicalId}.`, entry: updated });
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
            if (
              ((upstreamRes.status >= 200 && upstreamRes.status < 300) ||
                upstreamRes.status === 401 ||
                upstreamRes.status === 403) &&
              contentType.includes("application/json")
            ) {
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
        return await handleEdgeApiRequest(request, url, bodyBuffer, env);
      }

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

