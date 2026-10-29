import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

// ============================================================================
// FEATURE 03 — SALE / ACTIVITY PINGS (Real Data & Anonymized Activity Only)
// ============================================================================

export interface ActivityPingItem {
  id: string;
  category: string;
  message: string;
  timestampLabel: string;
  targetPath?: string;
}

const ACTIVITY_PING_STORAGE_KEY = "cvidya_activity_pings_enabled";
const ACTIVITY_EVENT_NAME = "cvidya-activity-ping";

export function isActivityPingsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(ACTIVITY_PING_STORAGE_KEY) !== "false";
}

export function setActivityPingsEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVITY_PING_STORAGE_KEY, enabled ? "true" : "false");
  window.dispatchEvent(new CustomEvent("cvidya-activity-settings-changed", { detail: { enabled } }));
}

export function dispatchActivityPing(ping: Omit<ActivityPingItem, "id">): void {
  if (typeof window === "undefined") return;
  const fullPing: ActivityPingItem = {
    ...ping,
    id: `ping_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
  };
  window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT_NAME, { detail: fullPing }));
}

/**
 * Builds anonymized activity notifications strictly from real stored records
 * (without exposing any customer PII such as name, phone, or email) and
 * verified system modules.
 */
function getVerifiedActivityQueue(): ActivityPingItem[] {
  const items: ActivityPingItem[] = [];

  if (typeof window !== "undefined") {
    try {
      const localLeads = JSON.parse(localStorage.getItem("cvidya_local_leads") || "[]");
      if (Array.isArray(localLeads)) {
        localLeads.slice(0, 3).forEach((lead: any, idx: number) => {
          const serviceName = typeof lead?.service === "string" && lead.service.trim()
            ? lead.service.trim()
            : "General Inquiry";
          items.push({
            id: `real_lead_${idx}`,
            category: "Verified Inquiry",
            message: `Enquiry recorded for ${serviceName}`,
            timestampLabel: lead?.timestamp ? String(lead.timestamp) : "Recently logged",
            targetPath: "/contact/"
          });
        });
      }
    } catch (_) {}

    try {
      const localApps = JSON.parse(localStorage.getItem("cvidya_local_applications") || "[]");
      if (Array.isArray(localApps)) {
        localApps.slice(0, 2).forEach((app: any, idx: number) => {
          const roleTitle = typeof app?.jobTitle === "string" && app.jobTitle.trim()
            ? app.jobTitle.trim()
            : "Engineering Role";
          items.push({
            id: `real_app_${idx}`,
            category: "Career Application",
            message: `New candidate application saved for ${roleTitle}`,
            timestampLabel: app?.timestamp ? String(app.timestamp) : "Recently logged",
            targetPath: "/careers/"
          });
        });
      }
    } catch (_) {}
  }

  return items;
}

export function ActivityPingNotification({ onNavigate: _onNavigate }: { onNavigate?: (path: string) => void }) {
  return null;
}

// ============================================================================
// FEATURE 12 — CLICK → SUCCESS / SUCCESS FEEDBACK
// ============================================================================

export interface SuccessFeedbackPayload {
  title: string;
  message: string;
  actionLabel?: string;
  actionPath?: string;
}

const SUCCESS_FEEDBACK_EVENT = "cvidya-success-feedback";

export function triggerSuccessFeedback(payload: SuccessFeedbackPayload): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SUCCESS_FEEDBACK_EVENT, { detail: payload }));
}

export function SuccessFeedbackToast({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [feedback, setFeedback] = useState<SuccessFeedbackPayload | null>(null);

  useEffect(() => {
    const handleSuccess = (e: Event) => {
      const custom = e as CustomEvent<SuccessFeedbackPayload>;
      if (custom.detail) {
        setFeedback(custom.detail);
      }
    };

    window.addEventListener(SUCCESS_FEEDBACK_EVENT, handleSuccess);
    return () => window.removeEventListener(SUCCESS_FEEDBACK_EVENT, handleSuccess);
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 5500);
    return () => clearTimeout(timer);
  }, [feedback]);

  return (
    <div
      aria-live="assertive"
      className="fixed top-20 right-4 sm:right-6 z-[9995] pointer-events-none max-w-[calc(100vw-2rem)] sm:max-w-sm"
    >
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto bg-white border border-emerald-200 shadow-xl rounded-2xl p-4 flex items-start gap-3.5 text-slate-900"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 className="w-5 h-5" />
            </motion.div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-950">
                {feedback.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                {feedback.message}
              </p>
              {feedback.actionLabel && feedback.actionPath && onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    const path = feedback.actionPath!;
                    setFeedback(null);
                    onNavigate(path);
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <span>{feedback.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Close success notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Product Tour feature removed as requested
export function startProductTour(): void {
  // No-op: Product tour disabled and removed
}

export function ProductTour(_props: { onNavigate?: (path: string) => void }) {
  return null;
}

