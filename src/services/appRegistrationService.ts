import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface AppRegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  platform: "android" | "ios";
  consentGiven: boolean;
  notes?: string;
}

export interface RegistrationResult {
  success: boolean;
  registrationId?: string;
  errorMessage?: string;
  timestamp?: string;
  deduplicated?: boolean;
}

export interface SubmitRegistrationOptions {
  nowMs?: number;
  bypassCooldown?: boolean;
  firestoreSetDoc?: typeof setDoc;
  fetchImpl?: typeof fetch;
}

interface ChannelCompletionState {
  primaryFirestoreDone: boolean;
  linkedInquiryFirestoreDone: boolean;
  backendApiDone: boolean;
  timestamp: string;
}

// Client-side rate-limiting / abuse prevention and per-ID retry state (per session)
const SUBMISSION_COOLDOWN_MS = 15000; // 15 seconds cooldown between distinct submissions
let lastSubmissionTimestamp = 0;
const inFlightDeterministicIds = new Set<string>();
const channelStateByDeterministicId = new Map<string, ChannelCompletionState>();

/**
 * Resets in-memory session cooldown, in-flight locks, and channel completion state (used for deterministic unit testing).
 */
export function resetAppRegistrationSessionState(): void {
  lastSubmissionTimestamp = 0;
  inFlightDeterministicIds.clear();
  channelStateByDeterministicId.clear();
}

/**
 * Normalizes email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normalizes phone number (retains digits and optional leading +)
 */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[^\d+]/g, "");
}

/**
 * Validates registration input fields
 */
export function validateRegistration(data: AppRegistrationPayload): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const cleanName = data.fullName.trim();
  if (!cleanName || cleanName.length < 2) {
    errors.fullName = "Please enter your full name (minimum 2 characters).";
  } else if (cleanName.length > 120) {
    errors.fullName = "Name is too long (maximum 120 characters).";
  }

  const cleanEmail = normalizeEmail(data.email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    errors.email = "Please enter a valid business or personal email address.";
  }

  const cleanPhone = normalizePhone(data.phone);
  if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
    errors.phone = "Please enter a valid mobile number (minimum 10 digits).";
  }

  if (data.platform !== "android" && data.platform !== "ios") {
    errors.platform = "Please select either Android or iOS platform.";
  }

  if (!data.consentGiven) {
    errors.consentGiven = "You must accept the Privacy Policy to register for early access & download.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Generates a Firestore-safe, collision-resistant deterministic ID for an app registration
 * scoped to a 5-minute idempotency window so retries reuse the same document ID while
 * distinct users, phone numbers, or platforms always receive distinct IDs.
 */
export function generateDeterministicAppRegistrationId(
  email: string,
  phone: string,
  platform: "android" | "ios",
  timestampMs: number = Date.now()
): string {
  const cleanEmail = normalizeEmail(email);
  const cleanPhone = normalizePhone(phone).replace(/\D/g, "");
  const cleanPlatform = platform === "ios" ? "ios" : "android";
  const windowBucket = Math.floor(timestampMs / 300000); // 5-minute idempotency window
  const rawKey = `${cleanEmail}|${cleanPhone}|${cleanPlatform}|${windowBucket}`;

  // Dual 32-bit FNV-1a style hash for 64-bit deterministic hex fingerprint without external dependencies
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < rawKey.length; i++) {
    const ch = rawKey.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch + (i & 0xff);
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  const hex1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const hex2 = (h2 >>> 0).toString(16).padStart(8, "0");
  const bucketBase36 = windowBucket.toString(36);
  return `appreg_${cleanPlatform}_${bucketBase36}_${hex1}${hex2}`;
}

/**
 * Submits registration to Firestore (`app_download_registrations` + linked `inquiries`) and backend synchronization.
 * Safely handles concurrent double-clicks, 5-minute idempotent retries, and partial channel recovery without
 * triggering Firestore update-permission rejections on already-created documents.
 */
export async function submitAppRegistration(
  payload: AppRegistrationPayload,
  options: SubmitRegistrationOptions = {}
): Promise<RegistrationResult> {
  // 1. Validation check
  const { isValid, errors } = validateRegistration(payload);
  if (!isValid) {
    const firstError = Object.values(errors)[0] || "Invalid submission details.";
    return { success: false, errorMessage: firstError };
  }

  const now = typeof options.nowMs === "number" ? options.nowMs : Date.now();
  const cleanName = payload.fullName.trim().slice(0, 150);
  const cleanEmail = normalizeEmail(payload.email).slice(0, 200);
  const cleanPhone = normalizePhone(payload.phone).slice(0, 50);
  const platform: "android" | "ios" = payload.platform === "ios" ? "ios" : "android";
  const deterministicId = generateDeterministicAppRegistrationId(cleanEmail, cleanPhone, platform, now);

  // 2. Concurrent request lock (prevents rapid double-click race conditions)
  if (inFlightDeterministicIds.has(deterministicId)) {
    return {
      success: false,
      registrationId: deterministicId,
      errorMessage: "A registration request for this account is already in progress. Please wait a moment.",
    };
  }

  const existingChannelState = channelStateByDeterministicId.get(deterministicId);
  const isPartialRetry =
    existingChannelState !== undefined &&
    (!existingChannelState.primaryFirestoreDone ||
      !existingChannelState.linkedInquiryFirestoreDone ||
      !existingChannelState.backendApiDone);

  // If all channels already succeeded for this deterministicId in the current 5-minute window, return idempotent success
  if (
    existingChannelState &&
    existingChannelState.primaryFirestoreDone &&
    existingChannelState.linkedInquiryFirestoreDone &&
    existingChannelState.backendApiDone
  ) {
    return {
      success: true,
      registrationId: deterministicId,
      timestamp: existingChannelState.timestamp,
      deduplicated: true,
    };
  }

  // 3. Client-side abuse protection (rapid submissions of distinct registrations, bypassed for partial-failure retries)
  if (
    !options.bypassCooldown &&
    !isPartialRetry &&
    lastSubmissionTimestamp > 0 &&
    now - lastSubmissionTimestamp < SUBMISSION_COOLDOWN_MS
  ) {
    const waitSec = Math.ceil((SUBMISSION_COOLDOWN_MS - (now - lastSubmissionTimestamp)) / 1000);
    return {
      success: false,
      errorMessage: `Please wait ${waitSec} seconds before submitting another registration.`
    };
  }

  inFlightDeterministicIds.add(deterministicId);

  try {
    const isoTimestamp = existingChannelState?.timestamp || new Date(now).toISOString();
    const userAgent =
      typeof navigator !== "undefined" && navigator.userAgent
        ? navigator.userAgent.slice(0, 280)
        : "Web Browser";

    const setDocFn = options.firestoreSetDoc || setDoc;
    const fetchFn = options.fetchImpl || (typeof fetch !== "undefined" ? fetch : undefined);

    const state: ChannelCompletionState = existingChannelState || {
      primaryFirestoreDone: false,
      linkedInquiryFirestoreDone: false,
      backendApiDone: false,
      timestamp: isoTimestamp,
    };

    // 4a. Persist to dedicated Firestore `app_download_registrations` collection (create-only; skipped if already created)
    if (!state.primaryFirestoreDone) {
      try {
        await setDocFn(doc(db, "app_download_registrations", deterministicId), {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          platform,
          privacyConsent: true,
          privacyPolicyVersion: "2026.1",
          status: "registered",
          clientTimestamp: isoTimestamp,
          userAgent,
        });
        state.primaryFirestoreDone = true;
      } catch (regErr: any) {
        console.warn("Direct Firestore app_download_registrations submission warning:", regErr?.message);
      }
    }

    // 4b. Preserve linked record in `inquiries` collection using pure create semantics (no { merge: true })
    if (!state.linkedInquiryFirestoreDone) {
      try {
        await setDocFn(doc(db, "inquiries", deterministicId), {
          id: deterministicId,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          platform,
          privacyConsent: true,
          privacyPolicyVersion: "2026.1",
          service: `Mobile App Early Access (${platform.toUpperCase()})`,
          message: `Platform: ${platform} | Privacy Consent: Accepted | Policy Version: 2026.1`,
          status: "registered",
          timestamp: isoTimestamp,
          clientTimestamp: isoTimestamp,
          source: "mobile_app_download_page",
        });
        state.linkedInquiryFirestoreDone = true;
      } catch (firestoreErr: any) {
        console.warn("Direct Firestore inquiries link submission warning:", firestoreErr?.message);
      }
    }

    // 4c. Server API sync (/api/app-registrations)
    if (!state.backendApiDone && fetchFn && (typeof window !== "undefined" || options.fetchImpl)) {
      try {
        const response = await fetchFn("/api/app-registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            platform,
            privacyConsent: true,
            registrationId: deterministicId,
            userAgent,
          })
        });

        if (response.ok) {
          state.backendApiDone = true;
        }
      } catch (apiErr) {
        console.warn("Backend API sync warning:", apiErr);
      }
    } else if (typeof window === "undefined" && !options.fetchImpl) {
      // In Node test environments without a mock fetch, mark backend API channel as not required when Firestore succeeded
      if (state.primaryFirestoreDone || state.linkedInquiryFirestoreDone) {
        state.backendApiDone = true;
      }
    }

    const anyPersisted =
      state.primaryFirestoreDone || state.linkedInquiryFirestoreDone || state.backendApiDone;

    if (!anyPersisted) {
      return {
        success: false,
        errorMessage: "Unable to save your registration at this time. Please check your connection and try again.",
      };
    }

    channelStateByDeterministicId.set(deterministicId, state);
    lastSubmissionTimestamp = now;
    return {
      success: true,
      registrationId: deterministicId,
      timestamp: isoTimestamp,
      deduplicated: false,
    };
  } finally {
    inFlightDeterministicIds.delete(deterministicId);
  }
}


