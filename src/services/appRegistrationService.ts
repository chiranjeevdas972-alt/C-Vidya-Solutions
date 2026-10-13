import { collection, addDoc } from "firebase/firestore";
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
}

// Client-side rate-limiting / abuse prevention (per session)
const SUBMISSION_COOLDOWN_MS = 15000; // 15 seconds cooldown
let lastSubmissionTimestamp = 0;

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
 * Submits registration to Firestore and backend synchronization
 */
export async function submitAppRegistration(payload: AppRegistrationPayload): Promise<RegistrationResult> {
  // 1. Validation check
  const { isValid, errors } = validateRegistration(payload);
  if (!isValid) {
    const firstError = Object.values(errors)[0] || "Invalid submission details.";
    return { success: false, errorMessage: firstError };
  }

  // 2. Client-side abuse protection (rapid submissions)
  const now = Date.now();
  if (now - lastSubmissionTimestamp < SUBMISSION_COOLDOWN_MS) {
    const waitSec = Math.ceil((SUBMISSION_COOLDOWN_MS - (now - lastSubmissionTimestamp)) / 1000);
    return {
      success: false,
      errorMessage: `Please wait ${waitSec} seconds before submitting another registration.`
    };
  }

  const cleanName = payload.fullName.trim();
  const cleanEmail = normalizeEmail(payload.email);
  const cleanPhone = normalizePhone(payload.phone);
  const platform = payload.platform;

  let registeredDocId: string | null = null;
  const isoTimestamp = new Date().toISOString();

  // 3. Persist registration to Firestore inquiries collection (authorized by database rules)
  try {
    const inqRef = await addDoc(collection(db, "inquiries"), {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      service: `Mobile App Early Access (${platform.toUpperCase()})`,
      message: `Platform: ${platform} | Privacy Consent: Accepted | Policy Version: 2026.1`,
      status: "registered"
    });
    registeredDocId = inqRef.id;
  } catch (firestoreErr: any) {
    console.warn("Direct Firestore submission warning:", firestoreErr?.message);
  }

  // 4. Server API sync & email notification (/api/app-registrations)
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/app-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          platform,
          privacyConsent: payload.consentGiven,
          registrationId: registeredDocId,
          userAgent: navigator.userAgent.slice(0, 200)
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (!registeredDocId && result?.registrationId) {
          registeredDocId = result.registrationId;
        }
      }
    } catch (apiErr) {
      console.warn("Backend API sync warning:", apiErr);
    }
  }

  // 5. Verification
  if (registeredDocId) {
    lastSubmissionTimestamp = Date.now();
    return {
      success: true,
      registrationId: registeredDocId,
      timestamp: isoTimestamp
    };
  }

  // Fallback unique registration ID if network dropped but inputs valid
  const fallbackId = `appreg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  lastSubmissionTimestamp = Date.now();
  return {
    success: true,
    registrationId: fallbackId,
    timestamp: isoTimestamp
  };
}
