import type { ProductService } from "../types";

export type DeploymentCategory = "software" | "ai-agent";
export type HostingPlatform = "cloudflare-workers" | "cloudflare-pages";
export type DeploymentStatus = "active" | "inactive" | "failed" | "coming-soon";

export interface DeploymentRegistryEntry {
  productId: string;
  legacyId: string;
  name: string;
  category: DeploymentCategory;
  hostingPlatform: HostingPlatform;
  githubRepository: string;
  branch: string;
  environment: string;
  deploymentUrl: string;
  version: string;
  commitSha: string;
  buildId: string;
  deploymentStatus: DeploymentStatus;
  enabled: boolean;
  connectedToAutoDeploy: boolean;
  deployedBy: string;
  lastDeploymentAt: string | null;
  updatedAt: string;
  badge: string;
  failureAlert?: boolean;
  lastFailedAt?: string | null;
  lastFailureReason?: string | null;
  adminLockedDisabled?: boolean;
  notes?: string;
}

export interface DeploymentHistoryEntry {
  id: string;
  productId: string;
  version: string;
  commitSha: string;
  buildId: string;
  deploymentUrl: string;
  hostingPlatform: HostingPlatform;
  githubRepository: string;
  branch: string;
  environment: string;
  status: "success" | "failed";
  deployedBy: string;
  deployedAt: string;
  message?: string;
}

export interface DeploymentAuditLog {
  id: string;
  action:
    | "webhook_register_success"
    | "webhook_register_failed_build"
    | "webhook_rejected"
    | "admin_toggle_enabled"
    | "admin_update_entry"
    | "admin_clear_alert";
  productId: string;
  actor: string;
  timestamp: string;
  details: string;
}

export interface RegisterDeploymentPayload {
  productId: string;
  productName?: string;
  category?: DeploymentCategory;
  hostingPlatform?: HostingPlatform | string;
  githubRepository?: string;
  branch?: string;
  environment?: string;
  deploymentUrl?: string;
  version?: string;
  commitSha?: string;
  buildId?: string;
  status?: string;
  deployedBy?: string;
  deployedAt?: string;
  errorMessage?: string;
}

export interface PublicDeploymentItem {
  productId: string;
  legacyId: string;
  name: string;
  category: DeploymentCategory;
  hostingPlatform: HostingPlatform;
  deploymentUrl: string;
  version: string;
  deploymentStatus: DeploymentStatus;
  enabled: boolean;
  connectedToAutoDeploy: boolean;
  lastDeploymentAt: string | null;
  badge: string;
}

export interface DeploymentRegistryStore {
  entries: Map<string, DeploymentRegistryEntry>;
  historyByProduct: Map<string, DeploymentHistoryEntry[]>;
  auditLogs: DeploymentAuditLog[];
  seenBuildKeys: Set<string>;
  registryVersion: number;
  etag: string;
}

export const MAX_HISTORY_PER_PRODUCT = 50;
export const MAX_AUDIT_LOGS = 200;

export const CANONICAL_PRODUCT_REGISTRY_SEED: DeploymentRegistryEntry[] = [
  // ================= SOFTWARE SOLUTIONS (10) =================
  {
    productId: "cvidya-library-management",
    legacyId: "library",
    name: "Library Management System",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://v.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-library-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },
  {
    productId: "cvidya-fitness-zone",
    legacyId: "fitness",
    name: "Fitness Zone & Gym Management",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://fitzone.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-fitness-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },
  {
    productId: "cvidya-institutes-management",
    legacyId: "institutes",
    name: "Institutes Management System",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "",
    version: "0.0.0",
    commitSha: "",
    buildId: "seed-institutes-pending",
    deploymentStatus: "coming-soon",
    enabled: false,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Coming Soon",
    failureAlert: false,
  },
  {
    productId: "cvidya-coaching-management",
    legacyId: "coaching",
    name: "Coaching Management System",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://coaching.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-coaching-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },
  {
    productId: "cvidya-enterprise-crm",
    legacyId: "crm",
    name: "Enterprise CRM & Client Management",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://crm.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-crm-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },
  {
    productId: "cvidya-petrol-pump",
    legacyId: "petrol-pump",
    name: "Petrol Pump Management Software",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://c-vidya-cloud-petrol-pump.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-petrol-pump-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },
  {
    productId: "cvidya-agrifusion",
    legacyId: "farming",
    name: "AgriFusion & Smart Farming Platform",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://fresh.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-agrifusion-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },
  {
    productId: "cvidya-jewellers-management",
    legacyId: "members",
    name: "Jewellers & Jewellery Management Software",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://jewelry.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-jewellers-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },
  {
    productId: "cvidya-care-plus",
    legacyId: "care-plus",
    name: "Care Plus Healthcare & Clinic System",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://care-plus.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-care-plus-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },
  {
    productId: "cvidya-pdf-media-tools",
    legacyId: "pdf-media-tools",
    name: "C Vidya PDF & Media Tools SaaS",
    category: "software",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://c-vidya-pdf-saas-tools.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-pdf-media-tools-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "Live SaaS",
    failureAlert: false,
  },

  // ================= AI AGENTS (4) =================
  {
    productId: "cvidya-ai-social-media-agent",
    legacyId: "ai-social",
    name: "AI Social Media Automation Agent",
    category: "ai-agent",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-ai-social-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "AI Agent",
    failureAlert: false,
  },
  {
    productId: "cvidya-ai-customer-support-agent",
    legacyId: "ai-support",
    name: "AI Customer Support & Resolution Agent",
    category: "ai-agent",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-ai-support-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "AI Agent",
    failureAlert: false,
  },
  {
    productId: "cvidya-salesflow-ai-agent",
    legacyId: "ai-salesflow",
    name: "SalesFlow AI Outreach & Pipeline Agent",
    category: "ai-agent",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-ai-salesflow-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "AI Agent",
    failureAlert: false,
  },
  {
    productId: "cvidya-b2b-saas-growth-agent",
    legacyId: "ai-marketing",
    name: "B2B SaaS Growth & Marketing AI Agent",
    category: "ai-agent",
    hostingPlatform: "cloudflare-workers",
    githubRepository: "",
    branch: "main",
    environment: "production",
    deploymentUrl: "https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/",
    version: "1.0.0",
    commitSha: "",
    buildId: "seed-ai-marketing-1.0.0",
    deploymentStatus: "active",
    enabled: true,
    connectedToAutoDeploy: false,
    deployedBy: "initial-seed",
    lastDeploymentAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    badge: "AI Agent",
    failureAlert: false,
  },
];

const PRODUCT_ALIAS_TO_CANONICAL: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const item of CANONICAL_PRODUCT_REGISTRY_SEED) {
    map[item.productId.toLowerCase()] = item.productId;
    map[item.legacyId.toLowerCase()] = item.productId;
  }
  // Additional unambiguous alias mappings
  map["agrifusion"] = "cvidya-agrifusion";
  map["farming"] = "cvidya-agrifusion";
  map["jewellers"] = "cvidya-jewellers-management";
  map["jewelry"] = "cvidya-jewellers-management";
  map["members"] = "cvidya-jewellers-management";
  map["fitzone"] = "cvidya-fitness-zone";
  map["fitness-zone"] = "cvidya-fitness-zone";
  map["institutes"] = "cvidya-institutes-management";
  map["coaching"] = "cvidya-coaching-management";
  map["crm"] = "cvidya-enterprise-crm";
  map["petrol-pump"] = "cvidya-petrol-pump";
  map["care-plus"] = "cvidya-care-plus";
  map["pdf-media-tools"] = "cvidya-pdf-media-tools";
  map["ai-social"] = "cvidya-ai-social-media-agent";
  map["ai-support"] = "cvidya-ai-customer-support-agent";
  map["ai-salesflow"] = "cvidya-salesflow-ai-agent";
  map["ai-marketing"] = "cvidya-b2b-saas-growth-agent";
  return map;
})();

export function normalizeProductLookupKey(rawId: unknown): string | null {
  if (typeof rawId !== "string") return null;
  const trimmed = rawId.trim().toLowerCase();
  if (!trimmed) return null;
  return PRODUCT_ALIAS_TO_CANONICAL[trimmed] || null;
}

export function isPreviewOrStagingHostname(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  if (!host) return true;

  // Reject Cloudflare Pages preview deployments like 4a1b2c3d.my-project.pages.dev
  if (host.endsWith(".pages.dev")) {
    const labels = host.split(".");
    // Standard production pages.dev has 3 labels: <project>.pages.dev
    // Preview hash subdomains have >= 4 labels (e.g. a1b2c3d4.project.pages.dev or branch.project.pages.dev)
    if (labels.length > 3) {
      return true;
    }
    const projectLabel = labels[0] || "";
    if (/^(preview|staging|dev|test|pr-\d+|branch)-/i.test(projectLabel)) {
      return true;
    }
  }

  // Reject explicit preview/staging/dev prefixes on any domain
  if (
    /^(preview|staging|stage|dev|qa|sandbox|local|localhost|pr-\d+)(\.|-)/i.test(host) ||
    /-(preview|staging|dev|pr-\d+)\./i.test(host)
  ) {
    return true;
  }

  return false;
}

export function validateDeploymentUrl(
  rawUrl: unknown,
  options: { allowEmpty?: boolean } = {},
): { valid: boolean; normalizedUrl: string; error?: string } {
  if (typeof rawUrl !== "string") {
    return { valid: false, normalizedUrl: "", error: "Deployment URL must be a string." };
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    if (options.allowEmpty) {
      return { valid: true, normalizedUrl: "" };
    }
    return { valid: false, normalizedUrl: "", error: "Deployment URL cannot be empty." };
  }
  if (trimmed.length > 500) {
    return { valid: false, normalizedUrl: "", error: "Deployment URL exceeds 500 characters." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, normalizedUrl: "", error: "Invalid deployment URL format." };
  }

  if (parsed.protocol !== "https:") {
    return { valid: false, normalizedUrl: "", error: "Deployment URL must use https://." };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, normalizedUrl: "", error: "Deployment URL must not contain credentials." };
  }

  const host = parsed.hostname.toLowerCase();

  // Block localhost, metadata endpoints, raw IPv4 / IPv6 addresses
  if (
    host === "localhost" ||
    host === "metadata.google.internal" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||
    host.includes(":")
  ) {
    return {
      valid: false,
      normalizedUrl: "",
      error: "Local, private, IP, or internal hostnames are forbidden.",
    };
  }

  if (parsed.searchParams.has("preview") || parsed.searchParams.has("staging")) {
    return {
      valid: false,
      normalizedUrl: "",
      error: "Preview or staging query parameters are not permitted in production URLs.",
    };
  }

  if (isPreviewOrStagingHostname(host)) {
    return {
      valid: false,
      normalizedUrl: "",
      error: `Preview or staging URL '${host}' is rejected. Only production URLs are accepted.`,
    };
  }

  const isTrustedDomain =
    host === "cvidyasolutions.com" ||
    host === "www.cvidyasolutions.com" ||
    host.endsWith(".cvidyasolutions.com") ||
    host.endsWith(".cvidyasolutions.workers.dev") ||
    host.endsWith(".pages.dev");

  if (!isTrustedDomain) {
    return {
      valid: false,
      normalizedUrl: "",
      error: `Untrusted deployment hostname '${host}'. Allowed: *.cvidyasolutions.workers.dev, *.pages.dev, or *.cvidyasolutions.com.`,
    };
  }

  const normalizedUrl = parsed.toString();
  return { valid: true, normalizedUrl };
}

export function isValidGitHubRepoSlug(repo: unknown): boolean {
  if (typeof repo !== "string") return false;
  const trimmed = repo.trim();
  if (!trimmed) return false;
  return /^[a-zA-Z0-9._-]{1,100}\/[a-zA-Z0-9._-]{1,100}$/.test(trimmed);
}

export function isAuthorizedGitHubRepo(
  repo: unknown,
  options: { allowlistEnv?: string; boundRepo?: string } = {},
): { authorized: boolean; normalizedRepo: string; reason?: string } {
  if (typeof repo !== "string" || !repo.trim()) {
    return {
      authorized: false,
      normalizedRepo: "",
      reason: "githubRepository is required (owner/repo).",
    };
  }

  const normalizedRepo = repo.trim();
  if (!isValidGitHubRepoSlug(normalizedRepo)) {
    return {
      authorized: false,
      normalizedRepo: "",
      reason: "githubRepository must match 'owner/repo' format.",
    };
  }

  const normalizedLower = normalizedRepo.toLowerCase();

  // If the product already has a specific bound repo and differs from incoming payload, reject
  if (options.boundRepo && options.boundRepo.trim()) {
    if (options.boundRepo.trim().toLowerCase() !== normalizedLower) {
      return {
        authorized: false,
        normalizedRepo,
        reason: `Repository '${normalizedRepo}' does not match bound repository '${options.boundRepo}'.`,
      };
    }
  }

  const allowlistRaw = (options.allowlistEnv || "").trim();
  if (allowlistRaw) {
    const patterns = allowlistRaw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (patterns.length > 0) {
      const matched = patterns.some((pattern) => {
        if (pattern.endsWith("/*")) {
          const prefix = pattern.slice(0, -1); // "org/"
          return normalizedLower.startsWith(prefix);
        }
        return pattern === normalizedLower;
      });
      if (!matched) {
        return {
          authorized: false,
          normalizedRepo,
          reason: `Repository '${normalizedRepo}' is not in DEPLOYMENT_ALLOWED_REPOS.`,
        };
      }
    }
  }

  return { authorized: true, normalizedRepo };
}

export function normalizeHostingPlatform(
  platform: unknown,
  deploymentUrl: string,
  fallback: HostingPlatform = "cloudflare-workers",
): HostingPlatform {
  const raw = typeof platform === "string" ? platform.trim().toLowerCase() : "";
  if (raw === "cloudflare-pages" || raw === "pages") return "cloudflare-pages";
  if (raw === "cloudflare-workers" || raw === "workers") return "cloudflare-workers";
  if (deploymentUrl.toLowerCase().includes(".pages.dev")) return "cloudflare-pages";
  return fallback;
}

export function sanitizeShortString(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLen);
}

export function createInMemoryDeploymentRegistryStore(
  seedEntries: DeploymentRegistryEntry[] = CANONICAL_PRODUCT_REGISTRY_SEED,
): DeploymentRegistryStore {
  const entries = new Map<string, DeploymentRegistryEntry>();
  const historyByProduct = new Map<string, DeploymentHistoryEntry[]>();
  const seenBuildKeys = new Set<string>();

  for (const item of seedEntries) {
    entries.set(item.productId, { ...item });
    historyByProduct.set(item.productId, []);
    if (item.buildId) {
      seenBuildKeys.add(`${item.productId}::${item.buildId}`);
    }
  }

  return {
    entries,
    historyByProduct,
    auditLogs: [],
    seenBuildKeys,
    registryVersion: 1,
    etag: `"cvidya-reg-v1"`,
  };
}

function appendAuditLog(store: DeploymentRegistryStore, log: DeploymentAuditLog): void {
  store.auditLogs.unshift(log);
  if (store.auditLogs.length > MAX_AUDIT_LOGS) {
    store.auditLogs.length = MAX_AUDIT_LOGS;
  }
}

function appendHistoryEntry(
  store: DeploymentRegistryStore,
  entry: DeploymentHistoryEntry,
): void {
  const existing = store.historyByProduct.get(entry.productId) || [];
  existing.unshift(entry);
  if (existing.length > MAX_HISTORY_PER_PRODUCT) {
    existing.length = MAX_HISTORY_PER_PRODUCT;
  }
  store.historyByProduct.set(entry.productId, existing);
}

function bumpRegistryVersion(store: DeploymentRegistryStore): void {
  store.registryVersion += 1;
  store.etag = `"cvidya-reg-v${store.registryVersion}"`;
}

export interface ProcessRegistrationResult {
  ok: boolean;
  status: number;
  message: string;
  duplicate?: boolean;
  failedRecorded?: boolean;
  entry?: DeploymentRegistryEntry;
}

export function validateAndProcessDeploymentRegistration(
  store: DeploymentRegistryStore,
  payload: RegisterDeploymentPayload,
  options: { allowlistEnv?: string; nowIso?: string } = {},
): ProcessRegistrationResult {
  const nowIso = options.nowIso || new Date().toISOString();

  if (!payload || typeof payload !== "object") {
    return { ok: false, status: 400, message: "Invalid JSON payload." };
  }

  const canonicalId = normalizeProductLookupKey(payload.productId);
  if (!canonicalId) {
    return {
      ok: false,
      status: 404,
      message: `Unknown productId '${sanitizeShortString(payload.productId, 80)}'.`,
    };
  }

  const current = store.entries.get(canonicalId);
  if (!current) {
    return {
      ok: false,
      status: 404,
      message: `Product '${canonicalId}' not found in registry.`,
    };
  }

  const rawEnv = sanitizeShortString(payload.environment || "production", 40).toLowerCase();
  if (rawEnv !== "production") {
    appendAuditLog(store, {
      id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action: "webhook_rejected",
      productId: canonicalId,
      actor: sanitizeShortString(payload.deployedBy || "github-actions", 80),
      timestamp: nowIso,
      details: `Rejected non-production environment '${rawEnv}'.`,
    });
    return {
      ok: false,
      status: 400,
      message: `Only 'production' deployments are accepted (received '${rawEnv}').`,
    };
  }

  const rawBranch = sanitizeShortString(payload.branch || "main", 80)
    .replace(/^refs\/heads\//i, "");
  if (rawBranch !== "main") {
    appendAuditLog(store, {
      id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action: "webhook_rejected",
      productId: canonicalId,
      actor: sanitizeShortString(payload.deployedBy || "github-actions", 80),
      timestamp: nowIso,
      details: `Rejected non-main branch '${rawBranch}'.`,
    });
    return {
      ok: false,
      status: 400,
      message: `Only 'main' branch deployments are accepted (received '${rawBranch}').`,
    };
  }

  const repoCheck = isAuthorizedGitHubRepo(payload.githubRepository, {
    allowlistEnv: options.allowlistEnv,
    boundRepo: current.githubRepository,
  });
  if (!repoCheck.authorized) {
    appendAuditLog(store, {
      id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action: "webhook_rejected",
      productId: canonicalId,
      actor: sanitizeShortString(payload.deployedBy || "github-actions", 80),
      timestamp: nowIso,
      details: repoCheck.reason || "Unauthorized GitHub repository.",
    });
    return {
      ok: false,
      status: 403,
      message: repoCheck.reason || "Unauthorized GitHub repository.",
    };
  }

  const buildId = sanitizeShortString(payload.buildId, 120);
  if (!buildId) {
    return {
      ok: false,
      status: 400,
      message: "buildId is required for idempotency and audit tracking.",
    };
  }

  const statusNormalized = sanitizeShortString(payload.status || "success", 30).toLowerCase();
  const buildReplayKey = `${canonicalId}::${buildId}::${statusNormalized}`;
  if (store.seenBuildKeys.has(buildReplayKey)) {
    return {
      ok: true,
      status: 200,
      duplicate: true,
      message: `Duplicate buildId '${buildId}' already processed for '${canonicalId}'.`,
      entry: current,
    };
  }

  const version = sanitizeShortString(payload.version || current.version || "1.0.0", 60);
  const commitSha = sanitizeShortString(payload.commitSha || "", 80);
  const deployedBy = sanitizeShortString(payload.deployedBy || "github-actions", 80);
  const deployedAt = sanitizeShortString(payload.deployedAt || nowIso, 64) || nowIso;

  // Handle failed build notifications without overwriting live production URL/version
  if (statusNormalized === "failed" || statusNormalized === "failure" || statusNormalized === "error") {
    store.seenBuildKeys.add(buildReplayKey);
    const failureReason =
      sanitizeShortString(payload.errorMessage, 300) ||
      `Build ${buildId} failed on ${repoCheck.normalizedRepo}@${rawBranch}`;

    const updatedWithAlert: DeploymentRegistryEntry = {
      ...current,
      githubRepository: current.githubRepository || repoCheck.normalizedRepo,
      failureAlert: true,
      lastFailedAt: deployedAt,
      lastFailureReason: failureReason,
      updatedAt: nowIso,
    };
    store.entries.set(canonicalId, updatedWithAlert);

    appendHistoryEntry(store, {
      id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      productId: canonicalId,
      version,
      commitSha,
      buildId,
      deploymentUrl: current.deploymentUrl,
      hostingPlatform: normalizeHostingPlatform(
        payload.hostingPlatform,
        current.deploymentUrl,
        current.hostingPlatform,
      ),
      githubRepository: repoCheck.normalizedRepo,
      branch: rawBranch,
      environment: "production",
      status: "failed",
      deployedBy,
      deployedAt,
      message: failureReason,
    });

    appendAuditLog(store, {
      id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action: "webhook_register_failed_build",
      productId: canonicalId,
      actor: deployedBy,
      timestamp: nowIso,
      details: `Failed build ${buildId} recorded; live URL preserved (${current.deploymentUrl || "unconnected"}).`,
    });

    bumpRegistryVersion(store);

    return {
      ok: true,
      status: 202,
      failedRecorded: true,
      message: "Failed deployment recorded as alert without overwriting active production URL.",
      entry: updatedWithAlert,
    };
  }

  if (statusNormalized !== "success" && statusNormalized !== "active" && statusNormalized !== "deployed") {
    return {
      ok: false,
      status: 400,
      message: `Unsupported deployment status '${statusNormalized}'. Expected 'success', 'active', or 'failed'.`,
    };
  }

  // Validate production deployment URL strictly
  const urlValidation = validateDeploymentUrl(payload.deploymentUrl);
  if (!urlValidation.valid) {
    appendAuditLog(store, {
      id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action: "webhook_rejected",
      productId: canonicalId,
      actor: deployedBy,
      timestamp: nowIso,
      details: urlValidation.error || "Invalid deployment URL.",
    });
    return {
      ok: false,
      status: 400,
      message: urlValidation.error || "Invalid deployment URL.",
    };
  }

  const platform = normalizeHostingPlatform(
    payload.hostingPlatform,
    urlValidation.normalizedUrl,
    current.hostingPlatform,
  );

  store.seenBuildKeys.add(buildReplayKey);

  // If admin explicitly locked the product disabled, keep enabled=false, otherwise activate
  const shouldEnable = current.adminLockedDisabled ? false : true;
  const nextStatus: DeploymentStatus = current.adminLockedDisabled ? "inactive" : "active";
  const nextBadge =
    current.category === "ai-agent"
      ? "AI Agent"
      : shouldEnable
        ? "Live SaaS"
        : "Maintenance";

  const updatedEntry: DeploymentRegistryEntry = {
    ...current,
    hostingPlatform: platform,
    githubRepository: repoCheck.normalizedRepo,
    branch: "main",
    environment: "production",
    deploymentUrl: urlValidation.normalizedUrl,
    version,
    commitSha,
    buildId,
    deploymentStatus: nextStatus,
    enabled: shouldEnable,
    connectedToAutoDeploy: true,
    deployedBy,
    lastDeploymentAt: deployedAt,
    updatedAt: nowIso,
    badge: nextBadge,
    failureAlert: false,
    lastFailureReason: null,
  };

  store.entries.set(canonicalId, updatedEntry);

  appendHistoryEntry(store, {
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    productId: canonicalId,
    version,
    commitSha,
    buildId,
    deploymentUrl: urlValidation.normalizedUrl,
    hostingPlatform: platform,
    githubRepository: repoCheck.normalizedRepo,
    branch: "main",
    environment: "production",
    status: "success",
    deployedBy,
    deployedAt,
  });

  appendAuditLog(store, {
    id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    action: "webhook_register_success",
    productId: canonicalId,
    actor: deployedBy,
    timestamp: nowIso,
    details: `Updated production deployment to ${urlValidation.normalizedUrl} (v${version}, build ${buildId}).`,
  });

  bumpRegistryVersion(store);

  return {
    ok: true,
    status: 200,
    message: `Production deployment registered for '${canonicalId}'.`,
    entry: updatedEntry,
  };
}

export interface AdminUpdatePayload {
  enabled?: boolean;
  deploymentUrl?: string;
  githubRepository?: string;
  hostingPlatform?: HostingPlatform;
  version?: string;
  clearFailureAlert?: boolean;
  notes?: string;
}

export function adminUpdateDeploymentEntry(
  store: DeploymentRegistryStore,
  rawProductId: string,
  updates: AdminUpdatePayload,
  actorEmail: string,
  nowIso: string = new Date().toISOString(),
): { ok: boolean; status: number; message: string; entry?: DeploymentRegistryEntry } {
  const canonicalId = normalizeProductLookupKey(rawProductId);
  if (!canonicalId) {
    return { ok: false, status: 404, message: `Unknown productId '${rawProductId}'.` };
  }

  const current = store.entries.get(canonicalId);
  if (!current) {
    return { ok: false, status: 404, message: `Product '${canonicalId}' not found.` };
  }

  let nextUrl = current.deploymentUrl;
  if (typeof updates.deploymentUrl === "string") {
    const allowEmpty =
      canonicalId === "cvidya-institutes-management" && !updates.deploymentUrl.trim();
    const urlCheck = validateDeploymentUrl(updates.deploymentUrl, { allowEmpty });
    if (!urlCheck.valid) {
      return { ok: false, status: 400, message: urlCheck.error || "Invalid URL." };
    }
    nextUrl = urlCheck.normalizedUrl;
  }

  let nextRepo = current.githubRepository;
  if (typeof updates.githubRepository === "string") {
    const trimmedRepo = updates.githubRepository.trim();
    if (trimmedRepo && !isValidGitHubRepoSlug(trimmedRepo)) {
      return {
        ok: false,
        status: 400,
        message: "GitHub repository must follow 'owner/repo' format.",
      };
    }
    nextRepo = trimmedRepo;
  }

  const nextPlatform = updates.hostingPlatform
    ? normalizeHostingPlatform(updates.hostingPlatform, nextUrl, current.hostingPlatform)
    : nextUrl
      ? normalizeHostingPlatform(current.hostingPlatform, nextUrl, current.hostingPlatform)
      : current.hostingPlatform;

  let nextEnabled = current.enabled;
  let nextAdminLocked = Boolean(current.adminLockedDisabled);
  if (typeof updates.enabled === "boolean") {
    nextEnabled = updates.enabled;
    nextAdminLocked = !updates.enabled;
  } else if (nextUrl && current.deploymentStatus === "coming-soon") {
    // Admin provided a live URL for previously coming-soon product
    nextEnabled = true;
    nextAdminLocked = false;
  }

  const nextStatus: DeploymentStatus = !nextUrl
    ? "coming-soon"
    : nextEnabled
      ? "active"
      : "inactive";

  const nextBadge =
    nextStatus === "coming-soon"
      ? "Coming Soon"
      : current.category === "ai-agent"
        ? "AI Agent"
        : nextEnabled
          ? "Live SaaS"
          : "Maintenance";

  const updated: DeploymentRegistryEntry = {
    ...current,
    deploymentUrl: nextUrl,
    githubRepository: nextRepo,
    hostingPlatform: nextPlatform,
    version:
      typeof updates.version === "string" && updates.version.trim()
        ? sanitizeShortString(updates.version, 60)
        : current.version,
    enabled: nextEnabled,
    adminLockedDisabled: nextAdminLocked,
    deploymentStatus: nextStatus,
    badge: nextBadge,
    failureAlert: updates.clearFailureAlert ? false : current.failureAlert,
    lastFailureReason: updates.clearFailureAlert ? null : current.lastFailureReason,
    notes:
      typeof updates.notes === "string"
        ? sanitizeShortString(updates.notes, 300)
        : current.notes,
    updatedAt: nowIso,
  };

  store.entries.set(canonicalId, updated);

  appendAuditLog(store, {
    id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    action:
      typeof updates.enabled === "boolean"
        ? "admin_toggle_enabled"
        : updates.clearFailureAlert
          ? "admin_clear_alert"
          : "admin_update_entry",
    productId: canonicalId,
    actor: actorEmail || "admin",
    timestamp: nowIso,
    details: `Admin updated entry: status=${updated.deploymentStatus}, enabled=${updated.enabled}, url=${updated.deploymentUrl || "(none)"}`,
  });

  bumpRegistryVersion(store);

  return {
    ok: true,
    status: 200,
    message: `Updated deployment settings for '${canonicalId}'.`,
    entry: updated,
  };
}

export function toPublicRegistryItem(entry: DeploymentRegistryEntry): PublicDeploymentItem {
  return {
    productId: entry.productId,
    legacyId: entry.legacyId,
    name: entry.name,
    category: entry.category,
    hostingPlatform: entry.hostingPlatform,
    deploymentUrl: entry.enabled ? entry.deploymentUrl : "",
    version: entry.version,
    deploymentStatus: entry.deploymentStatus,
    enabled: entry.enabled,
    connectedToAutoDeploy: entry.connectedToAutoDeploy,
    lastDeploymentAt: entry.lastDeploymentAt,
    badge: entry.badge,
  };
}

export function toPublicRegistryView(store: DeploymentRegistryStore): {
  registryVersion: number;
  etag: string;
  updatedAt: string;
  items: PublicDeploymentItem[];
} {
  const items = Array.from(store.entries.values()).map(toPublicRegistryItem);
  const latestUpdate = items.reduce<string>((latest, _item, idx) => {
    const raw = Array.from(store.entries.values())[idx]?.updatedAt || "";
    return raw > latest ? raw : latest;
  }, "2026-01-01T00:00:00.000Z");

  return {
    registryVersion: store.registryVersion,
    etag: store.etag,
    updatedAt: latestUpdate,
    items,
  };
}

export function mergeProductsWithRegistry(
  staticProducts: ProductService[],
  registryItems: PublicDeploymentItem[],
): ProductService[] {
  if (!registryItems || registryItems.length === 0) {
    return staticProducts;
  }

  const byLegacyId = new Map<string, PublicDeploymentItem>();
  const byCanonicalId = new Map<string, PublicDeploymentItem>();
  for (const item of registryItems) {
    byLegacyId.set(item.legacyId, item);
    byCanonicalId.set(item.productId, item);
  }

  return staticProducts.map((product) => {
    const matched =
      (product.canonicalProductId && byCanonicalId.get(product.canonicalProductId)) ||
      byLegacyId.get(product.id);

    if (!matched) return product;

    const nextExternalLink =
      matched.enabled === false
        ? ""
        : matched.deploymentUrl || product.externalLink;

    return {
      ...product,
      canonicalProductId: matched.productId,
      externalLink: nextExternalLink,
      version: matched.version,
      deploymentStatus: matched.deploymentStatus,
      lastDeploymentAt: matched.lastDeploymentAt,
      connectedToAutoDeploy: matched.connectedToAutoDeploy,
      enabled: matched.enabled,
      badge: matched.badge || product.badge,
    };
  });
}

export function serializeAdminRegistrySnapshot(store: DeploymentRegistryStore) {
  const entries = Array.from(store.entries.values());
  const recentHistory: DeploymentHistoryEntry[] = [];
  for (const list of store.historyByProduct.values()) {
    recentHistory.push(...list);
  }
  recentHistory.sort(
    (a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime(),
  );

  return {
    registryVersion: store.registryVersion,
    etag: store.etag,
    totalProducts: entries.length,
    activeCount: entries.filter((e) => e.deploymentStatus === "active" && e.enabled).length,
    autoDeployConnectedCount: entries.filter((e) => e.connectedToAutoDeploy).length,
    failureAlertCount: entries.filter((e) => Boolean(e.failureAlert)).length,
    entries,
    history: recentHistory.slice(0, 100),
    auditLogs: store.auditLogs.slice(0, 100),
    webhookEndpoint: "/api/deployments/register",
  };
}
