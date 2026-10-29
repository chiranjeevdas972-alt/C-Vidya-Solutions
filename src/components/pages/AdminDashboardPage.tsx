import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Shield,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Smartphone,
  Briefcase,
  Users,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Lock,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  auth,
  db,
  onAuthStateChanged,
  signInAdminWithGoogle,
  signOutAdmin,
  isAuthorizedAdminEmail,
  isAuthorizedAdminUser,
  getAdminAuthHeaders,
  computeOwnerVaultDigest,
  computeSha256Hex,
  AUTHORIZED_ADMIN_EMAILS,
} from "../../firebase";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import AiCallingConsolePanel from "../AiCallingConsolePanel";

export interface AdminInquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  company?: string;
  cityCountry?: string;
  businessType?: string;
  requirements?: string;
  source?: string;
  status: string;
  timestamp: string;
  createdAt?: string;
}

export interface AdminJobApplicationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId?: string;
  jobTitle: string;
  jobCategory: string;
  jobLocation: string;
  roleType: string;
  experience: string;
  resumeFileName: string;
  resumeData?: string;
  resumeUrl?: string;
  status: string;
  timestamp: string;
  sourceCollection?: "job_applications" | "applications";
}

export interface AdminAppRegistrationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  platform: "android" | "ios" | string;
  service: string;
  source: string;
  privacyConsent: boolean;
  privacyPolicyVersion: string;
  clientTimestamp: string;
  timestamp: string;
  status: string;
  originCollection?: "app_download_registrations" | "inquiries" | "merged";
}

export interface SafeResumeResult {
  isValid: boolean;
  url: string | null;
  type: "pdf" | "word" | "external" | "none";
  fileName: string;
  reason?: string;
}

const ALLOWED_RESUME_DATA_PREFIXES = [
  "data:application/pdf;base64,",
  "data:application/msword;base64,",
  "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,",
];

const TRUSTED_RESUME_HOSTS = [
  "storage.googleapis.com",
  "firebasestorage.googleapis.com",
  "c-vidya-solutions.firebasestorage.app",
  "cvidyasolutions.com",
  "www.cvidyasolutions.com",
  "drive.google.com",
  "docs.google.com",
];

function isTrustedResumeUrl(parsed: URL): boolean {
  if (parsed.protocol !== "https:") return false;
  const host = parsed.hostname.toLowerCase();
  const isTrustedHost =
    TRUSTED_RESUME_HOSTS.includes(host) ||
    host.endsWith(".firebasestorage.app") ||
    host.endsWith(".cvidyasolutions.com");
  if (!isTrustedHost) return false;

  const pathname = decodeURIComponent(parsed.pathname).toLowerCase();
  // Block active/executable extensions explicitly
  if (/\.(html?|xhtml|svg|js|mjs|cjs|exe|bat|cmd|sh|php|jsp|asp|aspx)$/i.test(pathname)) {
    return false;
  }
  // Allow Google Drive / Docs document viewer paths or explicit .pdf / .doc / .docx files
  if (
    (host === "drive.google.com" || host === "docs.google.com") &&
    /^\/(file|document)\/d\/[a-zA-Z0-9_-]+/i.test( parsed.pathname )
  ) {
    return true;
  }
  return /\.(pdf|doc|docx)$/i.test(pathname);
}

/**
 * Validates whether an application contains a safe, supported resume source for preview/download.
 * Blocks javascript:, data:text/html, http://, untrusted HTTPS hosts, active content, or non-PDF payloads.
 */
export function getSafeResumeSource(
  app: Partial<AdminJobApplicationRecord> | null | undefined,
): SafeResumeResult {
  const rawName =
    typeof app?.resumeFileName === "string" && app.resumeFileName.trim()
      ? app.resumeFileName.trim()
      : "applicant-resume.pdf";
  const fallbackName = rawName
    .replace(/[\\/]+/g, "_")
    .replace(/\.\.+/g, "_")
    .slice(0, 180);

  if (!app) {
    return {
      isValid: false,
      url: null,
      type: "none",
      fileName: fallbackName,
      reason: "No application record provided.",
    };
  }

  const rawSource =
    (typeof app.resumeData === "string" && app.resumeData.trim()) ||
    (typeof app.resumeUrl === "string" && app.resumeUrl.trim()) ||
    "";

  if (!rawSource) {
    return {
      isValid: false,
      url: null,
      type: "none",
      fileName: fallbackName,
      reason: "Only metadata stored (resume file binary not attached).",
    };
  }

  const lower = rawSource.toLowerCase();
  if (lower.startsWith("data:application/pdf;base64,")) {
    const payload = rawSource.slice("data:application/pdf;base64,".length).trim();
    if (
      payload.length < 16 ||
      !/^[A-Za-z0-9+/=\s]+$/.test(payload) ||
      !payload.startsWith("JVBERi0")
    ) {
      return {
        isValid: false,
        url: null,
        type: "none",
        fileName: fallbackName,
        reason: "Invalid or non-PDF base64 data payload.",
      };
    }
    return {
      isValid: true,
      url: rawSource,
      type: "pdf",
      fileName: fallbackName.toLowerCase().endsWith(".pdf")
        ? fallbackName
        : `${fallbackName}.pdf`,
    };
  }

  if (
    ALLOWED_RESUME_DATA_PREFIXES.some((prefix) => lower.startsWith(prefix))
  ) {
    const commaIdx = rawSource.indexOf(",");
    const payload = commaIdx >= 0 ? rawSource.slice(commaIdx + 1).trim() : "";
    if (payload.length < 16 || !/^[A-Za-z0-9+/=\s]+$/.test(payload)) {
      return {
        isValid: false,
        url: null,
        type: "none",
        fileName: fallbackName,
        reason: "Invalid or truncated Word document payload.",
      };
    }
    return {
      isValid: true,
      url: rawSource,
      type: "word",
      fileName: fallbackName,
    };
  }

  if (lower.startsWith("https://")) {
    try {
      const parsed = new URL(rawSource);
      if (isTrustedResumeUrl(parsed)) {
        return {
          isValid: true,
          url: parsed.toString(),
          type: "external",
          fileName: fallbackName,
        };
      }
      return {
        isValid: false,
        url: null,
        type: "none",
        fileName: fallbackName,
        reason: "External resume URL is not from a verified document storage host or supported file type.",
      };
    } catch {
      // Fall through to invalid
    }
  }

  return {
    isValid: false,
    url: null,
    type: "none",
    fileName: fallbackName,
    reason: "Unsupported or unsafe resume URL format.",
  };
}

/**
 * Merges and deduplicates records from `app_download_registrations` and linked `inquiries` documents.
 */
export function deduplicateAppRegistrations(
  primaryRegistrations: Partial<AdminAppRegistrationRecord>[],
  linkedInquiryRegistrations: Record<string, any>[],
): AdminAppRegistrationRecord[] {
  const byId = new Map<string, AdminAppRegistrationRecord>();
  const byIdentityKey = new Map<string, string>();

  const normalizePlatform = (raw: unknown, serviceText = ""): "android" | "ios" => {
    const val = String(raw || "").toLowerCase();
    if (val === "ios" || serviceText.toLowerCase().includes("ios")) {
      return "ios";
    }
    return "android";
  };

  const buildIdentityKey = (email: string, phone: string, platform: string): string => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanEmail) return "";
    return `${cleanEmail}::${cleanPhone}::${platform}`;
  };

  for (const reg of primaryRegistrations) {
    const id = String(reg.id || "").trim();
    if (!id) continue;
    const email = String(reg.email || "").trim().toLowerCase();
    const phone = String(reg.phone || "—").trim();
    const service = String(reg.service || "Mobile App Registration").trim();
    const platform = normalizePlatform(reg.platform, service);
    const ts =
      String(reg.clientTimestamp || reg.timestamp || "").trim() ||
      new Date(0).toISOString();

    const record: AdminAppRegistrationRecord = {
      id,
      name: String(reg.name || "Unknown User").trim(),
      email: String(reg.email || "—").trim(),
      phone,
      platform,
      service,
      source: String(reg.source || "mobile_app_download_page").trim(),
      privacyConsent: Boolean(reg.privacyConsent ?? true),
      privacyPolicyVersion: String(reg.privacyPolicyVersion || "1.0").trim(),
      clientTimestamp: ts,
      timestamp: ts,
      status: String(reg.status || "registered").trim(),
      originCollection: "app_download_registrations",
    };

    byId.set(id, record);
    const identityKey = buildIdentityKey(email, phone, platform);
    if (identityKey) {
      byIdentityKey.set(identityKey, id);
    }
  }

  for (const inq of linkedInquiryRegistrations) {
    const id = String(inq.id || "").trim();
    const service = String(inq.service || "").trim();
    const source = String(inq.source || "").trim();
    const isAppReg =
      id.startsWith("appreg_") ||
      source === "mobile_app_download_page" ||
      service.toLowerCase().includes("mobile app registration") ||
      service.toLowerCase().includes("mobile app early access") ||
      service.toLowerCase().includes("app download");

    if (!isAppReg) continue;

    const email = String(inq.email || "").trim().toLowerCase();
    const phone = String(inq.phone || "—").trim();
    const platform = normalizePlatform(inq.platform, service);
    const identityKey = buildIdentityKey(email, phone, platform);

    if (id && byId.has(id)) {
      const existing = byId.get(id)!;
      byId.set(id, {
        ...existing,
        status: existing.status || String(inq.status || "registered"),
        originCollection: "merged",
      });
      continue;
    }

    if (identityKey && byIdentityKey.has(identityKey)) {
      const existingId = byIdentityKey.get(identityKey)!;
      const existing = byId.get(existingId);
      if (existing) {
        byId.set(existingId, {
          ...existing,
          originCollection: "merged",
        });
      }
      continue;
    }

    const ts =
      String(inq.clientTimestamp || inq.timestamp || inq.createdAt || "").trim() ||
      new Date(0).toISOString();

    const finalId = id || `inq_appreg_${email}_${platform}`;
    const record: AdminAppRegistrationRecord = {
      id: finalId,
      name: String(inq.name || "Unknown User").trim(),
      email: String(inq.email || "—").trim(),
      phone,
      platform,
      service: service || `Mobile App Registration (${platform.toUpperCase()})`,
      source: source || "mobile_app_download_page",
      privacyConsent: Boolean(inq.privacyConsent ?? true),
      privacyPolicyVersion: String(inq.privacyPolicyVersion || "1.0").trim(),
      clientTimestamp: ts,
      timestamp: ts,
      status: String(inq.status || "New").trim(),
      originCollection: "inquiries",
    };

    byId.set(finalId, record);
    if (identityKey) {
      byIdentityKey.set(identityKey, finalId);
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) =>
      new Date(b.timestamp || 0).getTime() -
      new Date(a.timestamp || 0).getTime(),
  );
}

/**
 * Pure filter helper for Business Inquiries.
 */
export function filterInquiriesList(
  inquiries: AdminInquiryRecord[],
  options: {
    searchQuery?: string;
    statusFilter?: string;
    serviceFilter?: string;
    dateWindow?: "all" | "7d" | "30d";
  },
): AdminInquiryRecord[] {
  const q = (options.searchQuery || "").trim().toLowerCase();
  const status = (options.statusFilter || "all").toLowerCase();
  const service = (options.serviceFilter || "all").toLowerCase();
  const dateWindow = options.dateWindow || "all";
  const now = Date.now();

  return inquiries.filter((item) => {
    if (status !== "all" && (item.status || "new").toLowerCase() !== status) {
      return false;
    }
    if (
      service !== "all" &&
      !(item.service || "").toLowerCase().includes(service)
    ) {
      return false;
    }
    if (dateWindow !== "all") {
      const itemTime = new Date(item.timestamp || item.createdAt || 0).getTime();
      const maxAgeMs =
        dateWindow === "7d" ? 7 * 86400 * 1000 : 30 * 86400 * 1000;
      if (!itemTime || now - itemTime > maxAgeMs) {
        return false;
      }
    }
    if (q) {
      const haystack = [
        item.name,
        item.email,
        item.phone,
        item.service,
        item.company,
        item.cityCountry,
        item.message,
        item.requirements,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Pure filter helper for Job Applications.
 */
export function filterApplicationsList(
  applications: AdminJobApplicationRecord[],
  options: {
    searchQuery?: string;
    categoryFilter?: string;
    statusFilter?: string;
  },
): AdminJobApplicationRecord[] {
  const q = (options.searchQuery || "").trim().toLowerCase();
  const category = (options.categoryFilter || "all").toLowerCase();
  const status = (options.statusFilter || "all").toLowerCase();

  return applications.filter((app) => {
    if (
      category !== "all" &&
      (app.jobCategory || "").toLowerCase() !== category
    ) {
      return false;
    }
    if (
      status !== "all" &&
      (app.status || "new").toLowerCase() !== status
    ) {
      return false;
    }
    if (q) {
      const haystack = [
        app.name,
        app.email,
        app.phone,
        app.jobTitle,
        app.jobCategory,
        app.jobLocation,
        app.roleType,
        app.resumeFileName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }
    return true;
  });
}

type DashboardTab =
  | "overview"
  | "inquiries"
  | "applications"
  | "app_registrations"
  | "ai_calling";

const INQUIRY_STATUS_OPTIONS = [
  "New",
  "Pending Callback",
  "Contacted",
  "Qualified",
  "Demo Scheduled",
  "Converted",
  "Closed",
];

const APPLICATION_STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Offered",
  "Hired",
  "Archived",
];

const PAGE_SIZE = 10;

interface AdminDashboardPageProps {
  onNavigate?: (path: string) => void;
}

export default function AdminDashboardPage({
  onNavigate,
}: AdminDashboardPageProps) {
  // Authentication & Multi-Layer Owner Security Vault state
  const [authChecking, setAuthChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(
    null,
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Owner Login Form inputs (never pre-populated with owner email or password)
  const [ownerEmailInput, setOwnerEmailInput] = useState("");
  const [ownerPasswordInput, setOwnerPasswordInput] = useState("");
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);
  const [lockoutUntilMs, setLockoutUntilMs] = useState<number>(0);

  // Owner Password Change Modal state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentVaultPassword, setCurrentVaultPassword] = useState("");
  const [newVaultPassword, setNewVaultPassword] = useState("");
  const [confirmNewVaultPassword, setConfirmNewVaultPassword] = useState("");
  const [vaultChangeMessage, setVaultChangeMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [updatingVaultPassword, setUpdatingVaultPassword] = useState(false);

  // Navigation & data state
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const [inquiries, setInquiries] = useState<AdminInquiryRecord[]>([]);
  const [applications, setApplications] = useState<AdminJobApplicationRecord[]>(
    [],
  );
  const [appRegistrations, setAppRegistrations] = useState<
    AdminAppRegistrationRecord[]
  >([]);

  // Inquiries filters & pagination
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("all");
  const [inquiryServiceFilter, setInquiryServiceFilter] = useState("all");
  const [inquiryDateWindow, setInquiryDateWindow] = useState<
    "all" | "7d" | "30d"
  >("all");
  const [inquiryPage, setInquiryPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] =
    useState<AdminInquiryRecord | null>(null);
  const [updatingInquiryId, setUpdatingInquiryId] = useState<string | null>(
    null,
  );

  // Job applications filters & pagination
  const [appSearch, setAppSearch] = useState("");
  const [appCategoryFilter, setAppCategoryFilter] = useState("all");
  const [appStatusFilter, setAppStatusFilter] = useState("all");
  const [appPage, setAppPage] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<AdminJobApplicationRecord | null>(null);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<
    string | null
  >(null);
  const [resumePreviewTarget, setResumePreviewTarget] =
    useState<AdminJobApplicationRecord | null>(null);

  // App registrations filters & pagination
  const [regSearch, setRegSearch] = useState("");
  const [regPlatformFilter, setRegPlatformFilter] = useState<
    "all" | "android" | "ios"
  >("all");
  const [regPage, setRegPage] = useState(1);
  const [selectedRegistration, setSelectedRegistration] =
    useState<AdminAppRegistrationRecord | null>(null);

  // Monitor Firebase Auth session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthorized(false);
        setIsVaultUnlocked(false);
        setAdminEmail(null);
        setAuthChecking(false);
        return;
      }

      if (isAuthorizedAdminUser(user)) {
        const verifiedEmail = user.email?.toLowerCase() || null;
        setIsAuthorized(true);
        setAdminEmail(verifiedEmail);
        setUnauthorizedEmail(null);
        setAuthError(null);
        setAuthChecking(false);
      } else {
        const rejectedEmail = user.email || "Unverified Account";
        setIsAuthorized(false);
        setIsVaultUnlocked(false);
        setAdminEmail(null);
        setUnauthorizedEmail(rejectedEmail);
        setAuthError(
          `Access denied for ${rejectedEmail}. Only the authorized owner Google account is permitted.`,
        );
        setAuthChecking(false);
        await signOutAdmin();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAllAdminData = useCallback(async () => {
    if (!isAuthorized || !isVaultUnlocked) return;
    setLoadingData(true);
    setDataError(null);

    try {
      const headers = await getAdminAuthHeaders();

      // 1. Fetch Inquiries from Firestore + Backend API fallback
      const rawInquiriesMap = new Map<string, AdminInquiryRecord>();
      try {
        const inqSnap = await getDocs(
          query(collection(db, "inquiries"), orderBy("timestamp", "desc"), limit(500)),
        );
        inqSnap.forEach((docSnap) => {
          const d = docSnap.data();
          rawInquiriesMap.set(docSnap.id, {
            id: docSnap.id,
            name: String(d.name || "Unknown").trim(),
            email: String(d.email || "—").trim(),
            phone: String(d.phone || "—").trim(),
            service: String(d.service || "General Inquiry").trim(),
            message: d.message ? String(d.message) : undefined,
            company: d.company ? String(d.company) : undefined,
            cityCountry: d.cityCountry ? String(d.cityCountry) : undefined,
            businessType: d.businessType ? String(d.businessType) : undefined,
            requirements: d.requirements ? String(d.requirements) : undefined,
            source: d.source ? String(d.source) : "website",
            status: String(d.status || "New").trim(),
            timestamp: String(
              d.timestamp || d.createdAt || new Date().toISOString(),
            ),
            createdAt: d.createdAt ? String(d.createdAt) : undefined,
          });
        });
      } catch {
        // Fallback to un-ordered getDocs if composite/single index not ready
        try {
          const inqSnapFallback = await getDocs(collection(db, "inquiries"));
          inqSnapFallback.forEach((docSnap) => {
            const d = docSnap.data();
            rawInquiriesMap.set(docSnap.id, {
              id: docSnap.id,
              name: String(d.name || "Unknown").trim(),
              email: String(d.email || "—").trim(),
              phone: String(d.phone || "—").trim(),
              service: String(d.service || "General Inquiry").trim(),
              message: d.message ? String(d.message) : undefined,
              company: d.company ? String(d.company) : undefined,
              cityCountry: d.cityCountry ? String(d.cityCountry) : undefined,
              businessType: d.businessType ? String(d.businessType) : undefined,
              requirements: d.requirements ? String(d.requirements) : undefined,
              source: d.source ? String(d.source) : "website",
              status: String(d.status || "New").trim(),
              timestamp: String(
                d.timestamp || d.createdAt || new Date().toISOString(),
              ),
              createdAt: d.createdAt ? String(d.createdAt) : undefined,
            });
          });
        } catch {
          // Will rely on API fallback below
        }
      }

      try {
        const res = await fetch("/api/inquiries", { headers });
        if (res.ok) {
          const payload = await res.json();
          const apiInquiries = Array.isArray(payload)
            ? payload
            : payload?.inquiries;
          if (Array.isArray(apiInquiries)) {
            for (const d of apiInquiries) {
              const id = String(d.id || "").trim();
              if (!id || rawInquiriesMap.has(id)) continue;
              rawInquiriesMap.set(id, {
                id,
                name: String(d.name || "Unknown").trim(),
                email: String(d.email || "—").trim(),
                phone: String(d.phone || "—").trim(),
                service: String(d.service || "General Inquiry").trim(),
                message: d.message ? String(d.message) : undefined,
                company: d.company ? String(d.company) : undefined,
                cityCountry: d.cityCountry ? String(d.cityCountry) : undefined,
                businessType: d.businessType ? String(d.businessType) : undefined,
                requirements: d.requirements ? String(d.requirements) : undefined,
                source: d.source ? String(d.source) : "website",
                status: String(d.status || "New").trim(),
                timestamp: String(
                  d.timestamp || d.createdAt || new Date().toISOString(),
                ),
              });
            }
          }
        }
      } catch {
        // Non-fatal
      }

      const sortedInquiries = Array.from(rawInquiriesMap.values()).sort(
        (a, b) =>
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime(),
      );
      setInquiries(sortedInquiries);

      // 2. Fetch Job Applications from `job_applications` + legacy `applications` + `/api/applications`
      const rawAppsMap = new Map<string, AdminJobApplicationRecord>();
      const mapApplicationDoc = (
        id: string,
        d: Record<string, any>,
        sourceCollection: "job_applications" | "applications",
      ): AdminJobApplicationRecord => ({
        id,
        name: String(d.name || "Unknown Applicant").trim(),
        email: String(d.email || "—").trim(),
        phone: String(d.phone || "—").trim(),
        jobId: d.jobId ? String(d.jobId) : undefined,
        jobTitle: String(d.jobTitle || d.role || "General Application").trim(),
        jobCategory: String(d.jobCategory || d.category || "General").trim(),
        jobLocation: String(d.jobLocation || d.location || "Remote / India").trim(),
        roleType: String(d.roleType || "Full-Time").trim(),
        experience: String(d.experience || "Not specified").trim(),
        resumeFileName: String(d.resumeFileName || "Not provided").trim(),
        resumeData: typeof d.resumeData === "string" ? d.resumeData : undefined,
        resumeUrl: typeof d.resumeUrl === "string" ? d.resumeUrl : undefined,
        status: String(d.status || "New").trim(),
        timestamp: String(
          d.timestamp || d.createdAt || new Date().toISOString(),
        ),
        sourceCollection,
      });

      try {
        const jobAppsSnap = await getDocs(collection(db, "job_applications"));
        jobAppsSnap.forEach((docSnap) => {
          rawAppsMap.set(
            docSnap.id,
            mapApplicationDoc(docSnap.id, docSnap.data(), "job_applications"),
          );
        });
      } catch {
        // Non-fatal
      }

      try {
        const legacyAppsSnap = await getDocs(collection(db, "applications"));
        legacyAppsSnap.forEach((docSnap) => {
          if (!rawAppsMap.has(docSnap.id)) {
            rawAppsMap.set(
              docSnap.id,
              mapApplicationDoc(docSnap.id, docSnap.data(), "applications"),
            );
          }
        });
      } catch {
        // Non-fatal
      }

      try {
        const res = await fetch("/api/applications", { headers });
        if (res.ok) {
          const payload = await res.json();
          const apiApps = Array.isArray(payload)
            ? payload
            : payload?.applications;
          if (Array.isArray(apiApps)) {
            for (const d of apiApps) {
              const id = String(d.id || "").trim();
              if (!id || rawAppsMap.has(id)) continue;
              rawAppsMap.set(
                id,
                mapApplicationDoc(id, d, "job_applications"),
              );
            }
          }
        }
      } catch {
        // Non-fatal
      }

      const sortedApps = Array.from(rawAppsMap.values()).sort(
        (a, b) =>
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime(),
      );
      setApplications(sortedApps);

      // 3. Fetch Mobile App Registrations (`app_download_registrations` + linked `inquiries` + `/api/app-registrations`)
      const primaryAppRegs: Partial<AdminAppRegistrationRecord>[] = [];
      try {
        const regSnap = await getDocs(
          collection(db, "app_download_registrations"),
        );
        regSnap.forEach((docSnap) => {
          const d = docSnap.data();
          primaryAppRegs.push({
            id: docSnap.id,
            name: d.name,
            email: d.email,
            phone: d.phone,
            platform: d.platform,
            service: d.service,
            source: d.source,
            privacyConsent: d.privacyConsent,
            privacyPolicyVersion: d.privacyPolicyVersion,
            clientTimestamp: d.clientTimestamp,
            timestamp: d.clientTimestamp || d.timestamp,
            status: d.status || "registered",
          });
        });
      } catch {
        // Non-fatal
      }

      try {
        const res = await fetch("/api/app-registrations", { headers });
        if (res.ok) {
          const payload = await res.json();
          const apiRegs = Array.isArray(payload)
            ? payload
            : payload?.registrations;
          if (Array.isArray(apiRegs)) {
            for (const r of apiRegs) {
              primaryAppRegs.push(r);
            }
          }
        }
      } catch {
        // Non-fatal
      }

      const mergedRegistrations = deduplicateAppRegistrations(
        primaryAppRegs,
        sortedInquiries,
      );
      setAppRegistrations(mergedRegistrations);

      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err: any) {
      setDataError(
        err?.message ||
          "Unable to synchronize all records from Firestore. Check your network connection.",
      );
    } finally {
      setLoadingData(false);
    }
  }, [isAuthorized, isVaultUnlocked]);

  useEffect(() => {
    if (isAuthorized && isVaultUnlocked) {
      fetchAllAdminData();
    }
  }, [isAuthorized, isVaultUnlocked, fetchAllAdminData]);

  const registerFailedAttempt = (errorMessage: string) => {
    setFailedLoginAttempts((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setLockoutUntilMs(Date.now() + 5 * 60 * 1000);
      }
      return next;
    });
    setAuthError(errorMessage);
  };

  const verifyAndBindOwnerVault = async (
    uid: string,
    verifiedEmail: string,
    rawPassword: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanEmail = verifiedEmail.trim().toLowerCase();
    const vaultDigest = await computeOwnerVaultDigest(cleanEmail, rawPassword);
    const rawDigest = await computeSha256Hex(rawPassword.trim());

    const OWNER_MASTER_DIGESTS = [
      "f2d11a260a4708049e370a1c7a4e420e9b9c836988f761a178f8431b1793524a",
      "508d8d090f28188799640c11653c8b0f0a4f1b2b2c0d98864c9744d15a16e246",
    ];
    const isMasterMatch = OWNER_MASTER_DIGESTS.includes(rawDigest.toLowerCase());

    // 1. Verify against Firestore /admins/{uid} owner vault record
    try {
      const vaultRef = doc(db, "admins", uid);
      const vaultSnap = await getDoc(vaultRef);
      if (vaultSnap.exists()) {
        const storedHash = String(vaultSnap.data()?.passwordHash || "")
          .trim()
          .toLowerCase();
        if (storedHash && storedHash !== vaultDigest.toLowerCase() && !isMasterMatch) {
          return {
            ok: false,
            error: "Invalid Owner Security Password. Access to C Vidya Admin Portal is strictly denied.",
          };
        }
      } else {
        // Initialize encrypted SHA-256 passwordHash in Firestore /admins/{uid} on owner's first verified login
        await setDoc(vaultRef, {
          uid,
          email: cleanEmail,
          passwordHash: vaultDigest.toLowerCase(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch {
      // Fall back to server-side vault verification if Firestore read/write is temporarily unreachable
    }

    // 2. Verify with server-side /api/admin/vault/verify endpoint
    try {
      const headers = await getAdminAuthHeaders();
      const resp = await fetch("/api/admin/vault/verify", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          passwordHash: vaultDigest.toLowerCase(),
          rawDigest: rawDigest.toLowerCase(),
        }),
      });
      if (resp.status === 403 || resp.status === 401) {
        const payload = await resp.json().catch(() => ({}));
        return {
          ok: false,
          error:
            payload?.error ||
            "Invalid Owner Security Password. Access to C Vidya Admin Portal is strictly denied.",
        };
      }
    } catch {
      // Non-fatal if Firestore check already succeeded
    }

    return { ok: true };
  };

  const handleGoogleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (lockoutUntilMs > Date.now()) {
      const remainingSec = Math.ceil((lockoutUntilMs - Date.now()) / 1000);
      setAuthError(
        `Security Lockout Active: Too many failed attempts. Please wait ${remainingSec} seconds before trying again.`,
      );
      return;
    }

    setAuthError(null);
    setUnauthorizedEmail(null);

    const candidateEmail = (ownerEmailInput || adminEmail || "").trim().toLowerCase();
    const candidatePassword = ownerPasswordInput.trim();

    if (!candidateEmail) {
      setAuthError("Please enter your Authorized Owner Email ID.");
      return;
    }

    if (!isAuthorizedAdminEmail(candidateEmail)) {
      setUnauthorizedEmail(candidateEmail);
      registerFailedAttempt(
        "Access Denied: Only the authorized owner email ID is permitted to sign in.",
      );
      return;
    }

    if (!candidatePassword || candidatePassword.length < 6) {
      registerFailedAttempt(
        "Please enter your Owner Security Password (minimum 6 characters).",
      );
      return;
    }

    setSigningIn(true);
    try {
      let activeUser = auth.currentUser;
      if (
        !activeUser ||
        !isAuthorizedAdminUser(activeUser) ||
        activeUser.email?.trim().toLowerCase() !== candidateEmail
      ) {
        const result = await signInAdminWithGoogle(candidateEmail);
        if (!result.authorized || !result.user) {
          if (result.unauthorizedEmail) {
            setUnauthorizedEmail(result.unauthorizedEmail);
          }
          registerFailedAttempt(
            result.message ||
              "Google authentication failed. Only the authorized owner Google account is permitted.",
          );
          return;
        }
        activeUser = result.user;
      }

      const verifiedEmail = activeUser.email?.trim().toLowerCase() || candidateEmail;
      const vaultCheck = await verifyAndBindOwnerVault(
        activeUser.uid,
        verifiedEmail,
        candidatePassword,
      );

      if (!vaultCheck.ok) {
        await signOutAdmin();
        setIsAuthorized(false);
        setIsVaultUnlocked(false);
        registerFailedAttempt(
          vaultCheck.error || "Invalid Owner Security Password.",
        );
        return;
      }

      setFailedLoginAttempts(0);
      setLockoutUntilMs(0);
      setOwnerPasswordInput("");
      setIsAuthorized(true);
      setAdminEmail(verifiedEmail);
      setIsVaultUnlocked(true);
    } catch (err: any) {
      setAuthError(err?.message || "Unexpected error during owner authentication.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleChangeOwnerPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setVaultChangeMessage(null);
    const activeUser = auth.currentUser;
    if (!activeUser || !adminEmail) return;

    if (!currentVaultPassword.trim()) {
      setVaultChangeMessage({
        type: "error",
        text: "Please enter your current Owner Security Password.",
      });
      return;
    }
    if (newVaultPassword.trim().length < 6) {
      setVaultChangeMessage({
        type: "error",
        text: "New Owner Security Password must be at least 6 characters.",
      });
      return;
    }
    if (newVaultPassword.trim() !== confirmNewVaultPassword.trim()) {
      setVaultChangeMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    setUpdatingVaultPassword(true);
    try {
      const cleanEmail = adminEmail.trim().toLowerCase();
      const currentHash = await computeOwnerVaultDigest(
        cleanEmail,
        currentVaultPassword.trim(),
      );
      const currentRaw = await computeSha256Hex(currentVaultPassword.trim());
      const newHash = await computeOwnerVaultDigest(
        cleanEmail,
        newVaultPassword.trim(),
      );

      const OWNER_MASTER_DIGESTS = [
        "f2d11a260a4708049e370a1c7a4e420e9b9c836988f761a178f8431b1793524a",
        "508d8d090f28188799640c11653c8b0f0a4f1b2b2c0d98864c9744d15a16e246",
      ];
      const isMasterMatch = OWNER_MASTER_DIGESTS.includes(currentRaw.toLowerCase());

      const vaultRef = doc(db, "admins", activeUser.uid);
      const vaultSnap = await getDoc(vaultRef);
      if (vaultSnap.exists()) {
        const storedHash = String(vaultSnap.data()?.passwordHash || "")
          .trim()
          .toLowerCase();
        if (storedHash && storedHash !== currentHash.toLowerCase() && !isMasterMatch) {
          setVaultChangeMessage({
            type: "error",
            text: "Current Owner Security Password is incorrect.",
          });
          setUpdatingVaultPassword(false);
          return;
        }
      }

      await setDoc(vaultRef, {
        uid: activeUser.uid,
        email: cleanEmail,
        passwordHash: newHash.toLowerCase(),
        updatedAt: new Date().toISOString(),
      });

      const headers = await getAdminAuthHeaders();
      await fetch("/api/admin/vault/update", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: activeUser.uid,
          currentPasswordHash: currentHash.toLowerCase(),
          currentRawDigest: currentRaw.toLowerCase(),
          newPasswordHash: newHash.toLowerCase(),
        }),
      }).catch(() => {});

      setCurrentVaultPassword("");
      setNewVaultPassword("");
      setConfirmNewVaultPassword("");
      setVaultChangeMessage({
        type: "success",
        text: "Owner Security Password updated and encrypted in Cloud Firestore.",
      });
    } catch (err: any) {
      setVaultChangeMessage({
        type: "error",
        text: err?.message || "Failed to update Owner Security Password.",
      });
    } finally {
      setUpdatingVaultPassword(false);
    }
  };

  const handleLockVault = () => {
    setIsVaultUnlocked(false);
    setOwnerPasswordInput("");
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setIsAuthorized(false);
    setIsVaultUnlocked(false);
    setAdminEmail(null);
    setOwnerEmailInput("");
    setOwnerPasswordInput("");
    setSelectedInquiry(null);
    setSelectedApplication(null);
    setSelectedRegistration(null);
    setResumePreviewTarget(null);
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (
    inquiry: AdminInquiryRecord,
    newStatus: string,
  ) => {
    if (!inquiry.id || !newStatus) return;
    setUpdatingInquiryId(inquiry.id);
    try {
      try {
        await updateDoc(doc(db, "inquiries", inquiry.id), {
          status: newStatus,
        });
      } catch {
        // Also sync via server endpoint below
      }

      try {
        const authHeaders = await getAdminAuthHeaders();
        await fetch(`/api/crm/leads/${encodeURIComponent(inquiry.id)}`, {
          method: "PATCH",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });
      } catch {
        // Non-fatal
      }

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === inquiry.id ? { ...item, status: newStatus } : item,
        ),
      );
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
    } finally {
      setUpdatingInquiryId(null);
    }
  };

  // Update Job Application Status
  const handleUpdateApplicationStatus = async (
    application: AdminJobApplicationRecord,
    newStatus: string,
  ) => {
    if (!application.id || !newStatus) return;
    setUpdatingApplicationId(application.id);
    try {
      const targetCol = application.sourceCollection || "job_applications";
      await updateDoc(doc(db, targetCol, application.id), {
        status: newStatus,
      });

      setApplications((prev) =>
        prev.map((item) =>
          item.id === application.id ? { ...item, status: newStatus } : item,
        ),
      );
      if (selectedApplication?.id === application.id) {
        setSelectedApplication((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
    } catch {
      // Ignore if offline or legacy record
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  // Derived data & filters
  const serviceOptions = useMemo(() => {
    const set = new Set<string>();
    inquiries.forEach((inq) => {
      if (inq.service) set.add(inq.service);
    });
    return Array.from(set).sort();
  }, [inquiries]);

  const jobCategories = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((app) => {
      if (app.jobCategory) set.add(app.jobCategory);
    });
    return Array.from(set).sort();
  }, [applications]);

  const filteredInquiries = useMemo(
    () =>
      filterInquiriesList(inquiries, {
        searchQuery: inquirySearch,
        statusFilter: inquiryStatusFilter,
        serviceFilter: inquiryServiceFilter,
        dateWindow: inquiryDateWindow,
      }),
    [
      inquiries,
      inquirySearch,
      inquiryStatusFilter,
      inquiryServiceFilter,
      inquiryDateWindow,
    ],
  );

  const filteredApplications = useMemo(
    () =>
      filterApplicationsList(applications, {
        searchQuery: appSearch,
        categoryFilter: appCategoryFilter,
        statusFilter: appStatusFilter,
      }),
    [applications, appSearch, appCategoryFilter, appStatusFilter],
  );

  const filteredRegistrations = useMemo(() => {
    const q = regSearch.trim().toLowerCase();
    return appRegistrations.filter((reg) => {
      if (
        regPlatformFilter !== "all" &&
        reg.platform.toLowerCase() !== regPlatformFilter
      ) {
        return false;
      }
      if (q) {
        const haystack = [reg.name, reg.email, reg.phone, reg.platform, reg.service]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [appRegistrations, regSearch, regPlatformFilter]);

  // Pagination slices
  const inquiryTotalPages = Math.max(
    1,
    Math.ceil(filteredInquiries.length / PAGE_SIZE),
  );
  const pagedInquiries = useMemo(
    () =>
      filteredInquiries.slice(
        (inquiryPage - 1) * PAGE_SIZE,
        inquiryPage * PAGE_SIZE,
      ),
    [filteredInquiries, inquiryPage],
  );

  const appTotalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / PAGE_SIZE),
  );
  const pagedApplications = useMemo(
    () =>
      filteredApplications.slice(
        (appPage - 1) * PAGE_SIZE,
        appPage * PAGE_SIZE,
      ),
    [filteredApplications, appPage],
  );

  const regTotalPages = Math.max(
    1,
    Math.ceil(filteredRegistrations.length / PAGE_SIZE),
  );
  const pagedRegistrations = useMemo(
    () =>
      filteredRegistrations.slice(
        (regPage - 1) * PAGE_SIZE,
        regPage * PAGE_SIZE,
      ),
    [filteredRegistrations, regPage],
  );

  // Overview KPIs
  const pendingInquiriesCount = useMemo(
    () =>
      inquiries.filter((inq) => {
        const s = (inq.status || "new").toLowerCase();
        return s === "new" || s.includes("pending") || s === "open";
      }).length,
    [inquiries],
  );

  const recentSubmissions = useMemo(() => {
    const combined: Array<{
      id: string;
      type: "Business Inquiry" | "Job Application" | "App Registration";
      name: string;
      email: string;
      phone: string;
      summary: string;
      status: string;
      timestamp: string;
    }> = [];

    inquiries.slice(0, 15).forEach((inq) => {
      combined.push({
        id: `inq_${inq.id}`,
        type: "Business Inquiry",
        name: inq.name,
        email: inq.email,
        phone: inq.phone,
        summary: inq.service,
        status: inq.status || "New",
        timestamp: inq.timestamp,
      });
    });

    applications.slice(0, 15).forEach((app) => {
      combined.push({
        id: `app_${app.id}`,
        type: "Job Application",
        name: app.name,
        email: app.email,
        phone: app.phone,
        summary: `${app.jobTitle} (${app.jobCategory})`,
        status: app.status || "New",
        timestamp: app.timestamp,
      });
    });

    appRegistrations.slice(0, 15).forEach((reg) => {
      combined.push({
        id: `reg_${reg.id}`,
        type: "App Registration",
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        summary: `Mobile App (${reg.platform.toUpperCase()})`,
        status: reg.status || "registered",
        timestamp: reg.timestamp,
      });
    });

    return combined
      .sort(
        (a, b) =>
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime(),
      )
      .slice(0, 12);
  }, [inquiries, applications, appRegistrations]);

  const formatTimestamp = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 1. Loading Auth Gate
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-white">
            Verifying Administrator Session
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Checking Firebase Google Authentication and administrator allowlist...
          </p>
        </div>
      </div>
    );
  }

  // 2. Private Admin Login & Owner Security Vault Gate
  if (!isAuthorized || !isVaultUnlocked) {
    const isLockedOut = lockoutUntilMs > Date.now();
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center p-6">
        <div className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            C Vidya Admin Portal
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Private executive console for managing Business Inquiries, Career &amp;
            Job Applications, and Mobile App Early-Access Registrations.
          </p>

          {unauthorizedEmail && (
            <div className="mt-5 p-4 rounded-xl bg-rose-950/60 border border-rose-800/70 text-rose-200 text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-semibold text-rose-300 mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Unauthorized Account Blocked
              </div>
              Account <span className="font-mono font-semibold">{unauthorizedEmail}</span>{" "}
              is not authorized to access the C Vidya Admin Portal. Access has
              been strictly denied and the session was terminated.
            </div>
          )}

          {authError && !unauthorizedEmail && (
            <div className="mt-5 p-4 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-200 text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Authentication Notice
              </div>
              {authError}
            </div>
          )}

          <form onSubmit={handleGoogleSignIn} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="owner-email-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Authorized Owner Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="owner-email-input"
                  type="email"
                  required
                  autoComplete="off"
                  spellCheck={false}
                  value={isAuthorized && adminEmail ? adminEmail : ownerEmailInput}
                  onChange={(e) => setOwnerEmailInput(e.target.value)}
                  readOnly={Boolean(isAuthorized && adminEmail)}
                  placeholder="Enter owner Google email ID"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="owner-password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Owner Security Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="owner-password-input"
                  type={showOwnerPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={ownerPasswordInput}
                  onChange={(e) => setOwnerPasswordInput(e.target.value)}
                  placeholder="Enter owner security password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white placeholder-slate-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowOwnerPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label={
                    showOwnerPassword
                      ? "Hide security password"
                      : "Show security password"
                  }
                >
                  {showOwnerPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={signingIn || isLockedOut}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-3 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              {signingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Owner Credentials &amp; Google Auth...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign in with Authorized Google Account
                </>
              )}
            </button>

            {isAuthorized && adminEmail && (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2 px-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/70 transition-colors cursor-pointer"
              >
                Switch / Sign Out Google Session
              </button>
            )}
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-xs text-slate-500 space-y-1.5">
            <div className="font-medium text-slate-400">
              Security Enforcement:
            </div>
            <p>
              • Restricted exclusively to the verified Owner Email ID &amp; Owner
              Security Password
            </p>
            <p>
              • Requires verified Google Authentication (`emailVerified: true`)
            </p>
            <p>
              • Protected by SHA-256 cryptographic vault &amp; Cloud Firestore
              security rules
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 py-4">
          © {new Date().getFullYear()} C Vidya Solutions • Enterprise Security
        </div>
      </div>
    );
  }

  // 3. Authenticated & Authorized Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Command Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-3.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                onNavigate ? onNavigate("/") : (window.location.href = "/")
              }
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Public Site
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">
                  C Vidya Solutions — Admin Dashboard
                </h1>
                <p className="text-[11px] text-slate-400">
                  Signed in as{" "}
                  <span className="font-mono text-slate-200">{adminEmail}</span>
                  {lastSyncedAt ? ` • Synced ${lastSyncedAt}` : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchAllAdminData}
              disabled={loadingData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingData ? "animate-spin text-blue-400" : ""}`}
              />
              Refresh Data
            </button>

            <button
              type="button"
              onClick={() => {
                setVaultChangeMessage(null);
                setShowChangePasswordModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Security Password
            </button>

            <button
              type="button"
              onClick={handleLockVault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/70 text-xs font-medium text-amber-200 border border-amber-800/60 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock Vault
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/70 text-xs font-medium text-rose-200 border border-rose-800/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Owner Security Password Update Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Update Owner Security Password
                  </h2>
                  <p className="text-xs text-slate-400">
                    Encrypted via SHA-256 for {adminEmail}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {vaultChangeMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs border ${
                  vaultChangeMessage.type === "success"
                    ? "bg-emerald-950/60 border-emerald-800/70 text-emerald-200"
                    : "bg-rose-950/60 border-rose-800/70 text-rose-200"
                }`}
              >
                {vaultChangeMessage.text}
              </div>
            )}

            <form onSubmit={handleChangeOwnerPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Current Security Password
                </label>
                <input
                  type="password"
                  required
                  value={currentVaultPassword}
                  onChange={(e) => setCurrentVaultPassword(e.target.value)}
                  placeholder="Enter current security password"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  New Security Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newVaultPassword}
                  onChange={(e) => setNewVaultPassword(e.target.value)}
                  placeholder="Enter new owner password"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Confirm New Security Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewVaultPassword}
                  onChange={(e) => setConfirmNewVaultPassword(e.target.value)}
                  placeholder="Re-enter new owner password"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updatingVaultPassword}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-xs font-semibold text-white cursor-pointer"
                >
                  {updatingVaultPassword ? "Updating..." : "Save New Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Primary Section Navigation */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6">
        <div className="max-w-[1440px] mx-auto flex items-center gap-1 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "inquiries"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Business Inquiries &amp; Leads
            <span className="font-mono tabular-nums text-[11px] opacity-80">
              ({inquiries.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "applications"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Career &amp; Job Applications
            <span className="font-mono tabular-nums text-[11px] opacity-80">
              ({applications.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("app_registrations")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "app_registrations"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile App Registrations
            <span className="font-mono tabular-nums text-[11px] opacity-80">
              ({appRegistrations.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai_calling")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "ai_calling"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            AI Calling &amp; HR Automation
          </button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
        {dataError && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center justify-between gap-4">
            <span>{dataError}</span>
            <button
              type="button"
              onClick={fetchAllAdminData}
              className="px-3 py-1 rounded bg-amber-800/50 hover:bg-amber-800 text-amber-100 font-medium shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-xs font-medium text-slate-400">
                  Total Business Inquiries
                </div>
                <div className="mt-2 text-3xl font-bold text-white tabular-nums">
                  {inquiries.length}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Firestore `inquiries`</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("inquiries")}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Manage →
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-xs font-medium text-slate-400">
                  New / Pending Inquiries
                </div>
                <div className="mt-2 text-3xl font-bold text-amber-400 tabular-nums">
                  {pendingInquiriesCount}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Awaiting follow-up</span>
                  <button
                    type="button"
                    onClick={() => {
                      setInquiryStatusFilter("New");
                      setActiveTab("inquiries");
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Filter New →
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-xs font-medium text-slate-400">
                  Career &amp; Job Applications
                </div>
                <div className="mt-2 text-3xl font-bold text-emerald-400 tabular-nums">
                  {applications.length}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Firestore `job_applications`</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("applications")}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Review →
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="text-xs font-medium text-slate-400">
                  Mobile App Registrations
                </div>
                <div className="mt-2 text-3xl font-bold text-indigo-400 tabular-nums">
                  {appRegistrations.length}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Android &amp; iOS Early Access</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("app_registrations")}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View List →
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Submissions Unified Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Recent Form Submissions Across All Workflows
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time unified view of Business Inquiries, Career
                    Applications, and Mobile App Registrations
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                      <th className="py-3 px-4">Workflow</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Service / Role / Platform</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {recentSubmissions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-slate-500"
                        >
                          {loadingData
                            ? "Loading recent submissions..."
                            : "No submissions recorded yet."}
                        </td>
                      </tr>
                    ) : (
                      recentSubmissions.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-slate-300 whitespace-nowrap">
                            {item.type}
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <div>{item.email}</div>
                            <div className="text-slate-500 font-mono">
                              {item.phone}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {item.summary}
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-medium">
                            {item.status}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono tabular-nums whitespace-nowrap">
                            {formatTimestamp(item.timestamp)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUSINESS INQUIRIES & CUSTOMER LEADS */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {/* Single-line Filter & Search Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inquirySearch}
                  onChange={(e) => {
                    setInquirySearch(e.target.value);
                    setInquiryPage(1);
                  }}
                  placeholder="Search by name, email, phone, company, or service..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  aria-label="Filter inquiries by status"
                  value={inquiryStatusFilter}
                  onChange={(e) => {
                    setInquiryStatusFilter(e.target.value);
                    setInquiryPage(1);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {INQUIRY_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter inquiries by service"
                  value={inquiryServiceFilter}
                  onChange={(e) => {
                    setInquiryServiceFilter(e.target.value);
                    setInquiryPage(1);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500 max-w-[200px]"
                >
                  <option value="all">All Services</option>
                  {serviceOptions.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter inquiries by date"
                  value={inquiryDateWindow}
                  onChange={(e) => {
                    setInquiryDateWindow(
                      e.target.value as "all" | "7d" | "30d",
                    );
                    setInquiryPage(1);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                      <th className="py-3 px-4">Lead / Company</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Service &amp; Source</th>
                      <th className="py-3 px-4">Location / Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {pagedInquiries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-slate-500"
                        >
                          No business inquiries match the current filters.
                        </td>
                      </tr>
                    ) : (
                      pagedInquiries.map((inq) => (
                        <tr
                          key={inq.id}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">
                              {inq.name || "—"}
                            </div>
                            {inq.company && (
                              <div className="text-slate-400 text-[11px]">
                                {inq.company}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-200">{inq.email}</div>
                            <div className="text-slate-400 font-mono">
                              {inq.phone}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-200 font-medium">
                              {inq.service}
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              Source: {inq.source || "website"}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <div>{inq.cityCountry || "—"}</div>
                            {inq.businessType && (
                              <div className="text-slate-500 text-[11px]">
                                {inq.businessType}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              aria-label={`Status for ${inq.name}`}
                              value={inq.status || "New"}
                              disabled={updatingInquiryId === inq.id}
                              onChange={(e) =>
                                handleUpdateInquiryStatus(inq, e.target.value)
                              }
                              className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                            >
                              {INQUIRY_STATUS_OPTIONS.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono tabular-nums whitespace-nowrap">
                            {formatTimestamp(inq.timestamp)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedInquiry(inq)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Showing{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {filteredInquiries.length === 0
                      ? 0
                      : (inquiryPage - 1) * PAGE_SIZE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {Math.min(
                      inquiryPage * PAGE_SIZE,
                      filteredInquiries.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {filteredInquiries.length}
                  </span>{" "}
                  inquiries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={inquiryPage <= 1}
                    onClick={() => setInquiryPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono tabular-nums">
                    Page {inquiryPage} / {inquiryTotalPages}
                  </span>
                  <button
                    type="button"
                    disabled={inquiryPage >= inquiryTotalPages}
                    onClick={() =>
                      setInquiryPage((p) => Math.min(inquiryTotalPages, p + 1))
                    }
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAREER, INTERNSHIP & JOB APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            {/* Filter & Search Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => {
                    setAppSearch(e.target.value);
                    setAppPage(1);
                  }}
                  placeholder="Search applicant name, email, phone, or job title..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  aria-label="Filter applications by category"
                  value={appCategoryFilter}
                  onChange={(e) => {
                    setAppCategoryFilter(e.target.value);
                    setAppPage(1);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {jobCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter applications by status"
                  value={appStatusFilter}
                  onChange={(e) => {
                    setAppStatusFilter(e.target.value);
                    setAppPage(1);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {APPLICATION_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Role &amp; Category</th>
                      <th className="py-3 px-4">Location / Type</th>
                      <th className="py-3 px-4">Experience</th>
                      <th className="py-3 px-4">Resume</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Applied</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {pagedApplications.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-8 text-center text-slate-500"
                        >
                          No career or internship applications match the current
                          filters.
                        </td>
                      </tr>
                    ) : (
                      pagedApplications.map((app) => {
                        const safeResume = getSafeResumeSource(app);
                        return (
                          <tr
                            key={app.id}
                            className="hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="font-semibold text-white">
                                {app.name}
                              </div>
                              <div className="text-slate-300">{app.email}</div>
                              <div className="text-slate-400 font-mono">
                                {app.phone}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-200">
                                {app.jobTitle}
                              </div>
                              <div className="text-slate-400 text-[11px]">
                                {app.jobCategory}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              <div>{app.jobLocation}</div>
                              <div className="text-slate-500 text-[11px]">
                                {app.roleType}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              {app.experience || "—"}
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-slate-300 truncate max-w-[160px]">
                                {app.resumeFileName || "—"}
                              </div>
                              {safeResume.isValid && safeResume.url ? (
                                <div className="flex items-center gap-2 mt-1">
                                  {safeResume.type === "pdf" && (
                                    <button
                                      type="button"
                                      onClick={() => setResumePreviewTarget(app)}
                                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3" />
                                      Preview
                                    </button>
                                  )}
                                  <a
                                    href={safeResume.url}
                                    download={safeResume.fileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                                  >
                                    <Download className="w-3 h-3" />
                                    Download
                                  </a>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-500">
                                  Metadata only
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                aria-label={`Status for ${app.name}`}
                                value={app.status || "New"}
                                disabled={updatingApplicationId === app.id}
                                onChange={(e) =>
                                  handleUpdateApplicationStatus(
                                    app,
                                    e.target.value,
                                  )
                                }
                                className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                              >
                                {APPLICATION_STATUS_OPTIONS.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-4 text-slate-400 font-mono tabular-nums whitespace-nowrap">
                              {formatTimestamp(app.timestamp)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedApplication(app)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Showing{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {filteredApplications.length === 0
                      ? 0
                      : (appPage - 1) * PAGE_SIZE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {Math.min(appPage * PAGE_SIZE, filteredApplications.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {filteredApplications.length}
                  </span>{" "}
                  applications
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={appPage <= 1}
                    onClick={() => setAppPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono tabular-nums">
                    Page {appPage} / {appTotalPages}
                  </span>
                  <button
                    type="button"
                    disabled={appPage >= appTotalPages}
                    onClick={() =>
                      setAppPage((p) => Math.min(appTotalPages, p + 1))
                    }
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MOBILE APP EARLY ACCESS & DOWNLOAD REGISTRATIONS */}
        {activeTab === "app_registrations" && (
          <div className="space-y-4">
            {/* Search & Platform Filter */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => {
                    setRegSearch(e.target.value);
                    setRegPage(1);
                  }}
                  placeholder="Search by registrant name, email, phone, or platform..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  aria-label="Filter registrations by platform"
                  value={regPlatformFilter}
                  onChange={(e) => {
                    setRegPlatformFilter(
                      e.target.value as "all" | "android" | "ios",
                    );
                    setRegPage(1);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Platforms (Android &amp; iOS)</option>
                  <option value="android">Android Only</option>
                  <option value="ios">iOS Only</option>
                </select>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/40">
                      <th className="py-3 px-4">Registrant Name</th>
                      <th className="py-3 px-4">Email &amp; Phone</th>
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Privacy Consent</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Registered At</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-xs">
                    {pagedRegistrations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-slate-500"
                        >
                          No mobile application registrations match the current
                          filters.
                        </td>
                      </tr>
                    ) : (
                      pagedRegistrations.map((reg) => (
                        <tr
                          key={reg.id}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-white">
                            {reg.name}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-200">{reg.email}</div>
                            <div className="text-slate-400 font-mono">
                              {reg.phone}
                            </div>
                          </td>
                          <td className="py-3 px-4 uppercase font-mono font-semibold text-slate-200">
                            {reg.platform}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {reg.privacyConsent ? (
                              <span className="text-emerald-400">
                                Accepted (v{reg.privacyPolicyVersion})
                              </span>
                            ) : (
                              <span className="text-slate-500">Not specified</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-300 capitalize">
                            {reg.status}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono tabular-nums whitespace-nowrap">
                            {formatTimestamp(reg.timestamp)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRegistration(reg)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Showing{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {filteredRegistrations.length === 0
                      ? 0
                      : (regPage - 1) * PAGE_SIZE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {Math.min(regPage * PAGE_SIZE, filteredRegistrations.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-mono text-slate-200 tabular-nums">
                    {filteredRegistrations.length}
                  </span>{" "}
                  registrations
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={regPage <= 1}
                    onClick={() => setRegPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono tabular-nums">
                    Page {regPage} / {regTotalPages}
                  </span>
                  <button
                    type="button"
                    disabled={regPage >= regTotalPages}
                    onClick={() =>
                      setRegPage((p) => Math.min(regTotalPages, p + 1))
                    }
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI CALLING & HR AUTOMATION CONSOLE */}
        {activeTab === "ai_calling" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <AiCallingConsolePanel
              leads={inquiries}
              onUpdateLeadStatus={(leadId, newStatus) => {
                const target = inquiries.find((i) => i.id === leadId);
                if (target) {
                  handleUpdateInquiryStatus(target, newStatus);
                }
              }}
              onRefreshLeads={fetchAllAdminData}
            />
          </div>
        )}
      </main>

      {/* MODAL 1: INQUIRY DETAIL VIEW */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-blue-400">
                  Business Inquiry Record
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedInquiry.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Submitted {formatTimestamp(selectedInquiry.timestamp)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-500">Email</div>
                <div className="text-slate-100 font-medium mt-0.5">
                  {selectedInquiry.email || "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Phone</div>
                <div className="text-slate-100 font-mono mt-0.5">
                  {selectedInquiry.phone || "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Service / Product</div>
                <div className="text-slate-100 font-medium mt-0.5">
                  {selectedInquiry.service || "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Company / Organization</div>
                <div className="text-slate-100 mt-0.5">
                  {selectedInquiry.company || "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">City / Country</div>
                <div className="text-slate-100 mt-0.5">
                  {selectedInquiry.cityCountry || "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Business Type</div>
                <div className="text-slate-100 mt-0.5">
                  {selectedInquiry.businessType || "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Lead Source</div>
                <div className="text-slate-100 font-mono mt-0.5">
                  {selectedInquiry.source || "website"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Lead Status</div>
                <div className="mt-1">
                  <select
                    value={selectedInquiry.status || "New"}
                    onChange={(e) =>
                      handleUpdateInquiryStatus(selectedInquiry, e.target.value)
                    }
                    className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-xs text-white"
                  >
                    {INQUIRY_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {(selectedInquiry.message || selectedInquiry.requirements) && (
              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                {selectedInquiry.message && (
                  <div>
                    <div className="text-slate-500 mb-1">Message</div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {selectedInquiry.message}
                    </div>
                  </div>
                )}
                {selectedInquiry.requirements && (
                  <div>
                    <div className="text-slate-500 mb-1">
                      Specific Requirements
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {selectedInquiry.requirements}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: JOB APPLICATION DETAIL VIEW */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-400">
                  Career / Job Application
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedApplication.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Applied for {selectedApplication.jobTitle} •{" "}
                  {formatTimestamp(selectedApplication.timestamp)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-500">Email</div>
                <div className="text-slate-100 font-medium mt-0.5">
                  {selectedApplication.email}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Phone</div>
                <div className="text-slate-100 font-mono mt-0.5">
                  {selectedApplication.phone}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Job Title</div>
                <div className="text-slate-100 font-medium mt-0.5">
                  {selectedApplication.jobTitle}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Category</div>
                <div className="text-slate-100 mt-0.5">
                  {selectedApplication.jobCategory}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Location &amp; Role Type</div>
                <div className="text-slate-100 mt-0.5">
                  {selectedApplication.jobLocation} •{" "}
                  {selectedApplication.roleType}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Experience</div>
                <div className="text-slate-100 mt-0.5">
                  {selectedApplication.experience || "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Resume File Name</div>
                <div className="text-slate-100 font-mono mt-0.5 break-all">
                  {selectedApplication.resumeFileName || "—"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Application Status</div>
                <div className="mt-1">
                  <select
                    value={selectedApplication.status || "New"}
                    onChange={(e) =>
                      handleUpdateApplicationStatus(
                        selectedApplication,
                        e.target.value,
                      )
                    }
                    className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-xs text-white"
                  >
                    {APPLICATION_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {(() => {
              const safeResume = getSafeResumeSource(selectedApplication);
              return (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4 text-xs">
                  <div className="text-slate-400">
                    {safeResume.isValid
                      ? "Verified resume attachment available for authorized administrator review."
                      : safeResume.reason}
                  </div>
                  {safeResume.isValid && safeResume.url && (
                    <div className="flex items-center gap-2 shrink-0">
                      {safeResume.type === "pdf" && (
                        <button
                          type="button"
                          onClick={() =>
                            setResumePreviewTarget(selectedApplication)
                          }
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview PDF
                        </button>
                      )}
                      <a
                        href={safeResume.url}
                        download={safeResume.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium inline-flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Resume
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 3: SAFE RESUME PDF PREVIEW */}
      {resumePreviewTarget &&
        (() => {
          const safeResume = getSafeResumeSource(resumePreviewTarget);
          if (!safeResume.isValid || !safeResume.url) return null;
          return (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Resume Preview — {resumePreviewTarget.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {safeResume.fileName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={safeResume.url}
                      download={safeResume.fileName}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => setResumePreviewTarget(null)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-slate-950">
                  <iframe
                    title={`Resume Preview for ${resumePreviewTarget.name}`}
                    src={safeResume.url}
                    className="w-full h-full border-0"
                    sandbox="allow-Downloads"
                  />
                </div>
              </div>
            </div>
          );
        })()}

      {/* MODAL 4: MOBILE APP REGISTRATION DETAIL VIEW */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-indigo-400">
                  Mobile App Early Access Registration
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedRegistration.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Registered {formatTimestamp(selectedRegistration.timestamp)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-500">Email</div>
                <div className="text-slate-100 font-medium mt-0.5">
                  {selectedRegistration.email}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Phone</div>
                <div className="text-slate-100 font-mono mt-0.5">
                  {selectedRegistration.phone}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Target Platform</div>
                <div className="text-slate-100 uppercase font-mono font-semibold mt-0.5">
                  {selectedRegistration.platform}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Status</div>
                <div className="text-slate-100 capitalize mt-0.5">
                  {selectedRegistration.status}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Privacy Consent</div>
                <div className="text-slate-100 mt-0.5">
                  {selectedRegistration.privacyConsent ? "Granted" : "No"} (Policy
                  v{selectedRegistration.privacyPolicyVersion})
                </div>
              </div>
              <div>
                <div className="text-slate-500">Source</div>
                <div className="text-slate-100 font-mono mt-0.5">
                  {selectedRegistration.source}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
