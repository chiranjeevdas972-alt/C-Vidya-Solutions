import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import type { Analytics } from "firebase/analytics";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "../firebase-applet-config.json" with { type: "json" };

// Initialize Firebase (safely singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const AUTHORIZED_ADMIN_EMAILS = [
  "cvidyasolutions@gmail.com",
  "chiranjeevdas972@gmail.com",
] as const;

const ADMIN_SESSION_TOKEN_KEY = "cvidya_admin_session_token_v1";

export function isAuthorizedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}

export function isAuthorizedAdminUser(user: User | null | undefined): boolean {
  if (!user || !user.email) return false;
  if (user.emailVerified !== true) return false;
  return isAuthorizedAdminEmail(user.email);
}

export function getStoredAdminToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setStoredAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, token);
    } else {
      window.sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export function clearStoredAdminToken(): void {
  setStoredAdminToken("");
}

export async function getAdminAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  try {
    const currentUser = auth.currentUser;
    if (currentUser && isAuthorizedAdminUser(currentUser)) {
      const idToken = await currentUser.getIdToken();
      if (idToken) {
        headers["Authorization"] = `Bearer ${idToken}`;
      }
    }
  } catch {
    // Ignore token retrieval error; caller will handle 401
  }
  return headers;
}

export async function verifyAdminPasscodeWithServer(
  _passcode: string
): Promise<{ authorized: boolean; message?: string }> {
  return {
    authorized: false,
    message:
      "Passcode authentication is disabled. Please sign in using an authorized Google administrator account.",
  };
}

export async function computeSha256Hex(input: string): Promise<string> {
  const normalized = String(input || "");
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    const encoded = new TextEncoder().encode(normalized);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback deterministic 64-char hex for non-WebCrypto test environments
  let h1 = 0xdeadbeef ^ normalized.length;
  let h2 = 0x41c6ce57 ^ normalized.length;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part = (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
  return part.repeat(4).slice(0, 64);
}

export async function computeOwnerVaultDigest(email: string, password: string): Promise<string> {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "").trim();
  return computeSha256Hex(`cvidya_owner_vault_v1::${cleanEmail}::${cleanPassword}`);
}

export async function signInAdminWithGoogle(expectedEmail?: string): Promise<{
  authorized: boolean;
  user?: User;
  unauthorizedEmail?: string;
  message?: string;
}> {
  try {
    const normalizedExpected =
      typeof expectedEmail === "string" && expectedEmail.trim()
        ? expectedEmail.trim().toLowerCase()
        : undefined;

    if (normalizedExpected && !isAuthorizedAdminEmail(normalizedExpected)) {
      clearStoredAdminToken();
      return {
        authorized: false,
        unauthorizedEmail: normalizedExpected,
        message: "Access denied. This email ID is not authorized to access the C Vidya Admin Portal.",
      };
    }

    if (normalizedExpected) {
      googleProvider.setCustomParameters({
        prompt: "select_account",
        login_hint: normalizedExpected,
      });
    } else {
      googleProvider.setCustomParameters({ prompt: "select_account" });
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (!user.emailVerified) {
      const unverifiedEmail = user.email || "unknown";
      await signOut(auth);
      clearStoredAdminToken();
      return {
        authorized: false,
        unauthorizedEmail: unverifiedEmail,
        message: `Google account (${unverifiedEmail}) does not have a verified email address.`,
      };
    }
    if (!isAuthorizedAdminUser(user)) {
      const rejectedEmail = user.email || "unknown";
      await signOut(auth);
      clearStoredAdminToken();
      return {
        authorized: false,
        unauthorizedEmail: rejectedEmail,
        message: `Access denied for ${rejectedEmail}. Only the authorized owner Google account is permitted.`,
      };
    }
    if (normalizedExpected && user.email?.trim().toLowerCase() !== normalizedExpected) {
      const mismatchedEmail = user.email || "unknown";
      await signOut(auth);
      clearStoredAdminToken();
      return {
        authorized: false,
        unauthorizedEmail: mismatchedEmail,
        message: `Signed-in Google account (${mismatchedEmail}) does not match the entered Authorized Email ID.`,
      };
    }
    const idToken = await user.getIdToken();
    setStoredAdminToken(idToken);
    return { authorized: true, user };
  } catch (err: any) {
    const code = err?.code || "";
    if (code === "auth/popup-closed-by-user") {
      return {
        authorized: false,
        message: "Google Sign-In popup was closed before completing authentication.",
      };
    }
    return {
      authorized: false,
      message: err instanceof Error ? err.message : "Google Sign-In failed.",
    };
  }
}

export async function signOutAdmin(): Promise<void> {
  clearStoredAdminToken();
  try {
    if (auth.currentUser) {
      await signOut(auth);
    }
  } catch {
    // ignore signout error
  }
}

export { onAuthStateChanged };

export const OperationType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  GET: "get",
  WRITE: "write",
} as const;

export type OperationType = (typeof OperationType)[keyof typeof OperationType];

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("Analytics initialization failed:", err);
  }

  // Validate Firestore connectivity on boot
  getDocFromServer(doc(db, "_connection_check", "ping")).catch((err) => {
    if (err instanceof Error && err.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration. Firestore client reports offline.");
    }
  });
}

export { app, analytics };

