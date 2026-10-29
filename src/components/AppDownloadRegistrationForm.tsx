import React, { useState } from "react";
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

// Official Apple logo with signature bite
function AppleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8.93-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.74-.86 2.76 1.01.08 2.04-.51 2.56-1.26z" />
    </svg>
  );
}
import { 
  AppRegistrationPayload, 
  submitAppRegistration, 
  validateRegistration 
} from "../services/appRegistrationService";
import { MOBILE_APP_CONFIG, PlatformConfig } from "../services/appDownloadConfig";
import { triggerSuccessFeedback, dispatchActivityPing } from "./ActivityPingsAndTour";

interface AppDownloadRegistrationFormProps {
  selectedPlatform: "android" | "ios";
  onPlatformChange: (platform: "android" | "ios") => void;
  onNavigatePrivacy?: () => void;
  onNavigateTerms?: () => void;
}

export default function AppDownloadRegistrationForm({
  selectedPlatform,
  onPlatformChange,
  onNavigatePrivacy,
  onNavigateTerms
}: AppDownloadRegistrationFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const currentPlatformConfig: PlatformConfig = MOBILE_APP_CONFIG.platforms[selectedPlatform];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const payload: AppRegistrationPayload = {
      fullName,
      email,
      phone,
      platform: selectedPlatform,
      consentGiven
    };

    const validation = validateRegistration(payload);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      const res = await submitAppRegistration(payload);
      if (res.success) {
        setIsSuccess(true);
        setRegistrationId(res.registrationId || null);
        triggerSuccessFeedback({
          title: "Registration Completed!",
          message: `Your ${selectedPlatform === "android" ? "Android" : "iOS"} mobile app access registration has been saved.`
        });
        dispatchActivityPing({
          category: "New App Registration",
          message: `Mobile App registration completed (${selectedPlatform === "android" ? "Android" : "iOS"})`,
          timestampLabel: "Just now"
        });
      } else {
        setSubmitError(res.errorMessage || "Submission could not be completed. Please try again.");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setRegistrationId(null);
    setSubmitError(null);
    setFieldErrors({});
    setFullName("");
    setEmail("");
    setPhone("");
    setConsentGiven(false);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-8 md:p-10 space-y-6">
      
      {/* Platform Selector Buttons */}
      <div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              onPlatformChange("android");
              setFieldErrors(prev => ({ ...prev, platform: "" }));
            }}
            className={`p-4 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedPlatform === "android"
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              selectedPlatform === "android" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base leading-tight">Android</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onPlatformChange("ios");
              setFieldErrors(prev => ({ ...prev, platform: "" }));
            }}
            className={`p-4 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedPlatform === "ios"
                ? "bg-blue-500/10 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              selectedPlatform === "ios" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              <AppleLogo className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base leading-tight">iOS</div>
            </div>
          </button>
        </div>
      </div>

      {/* SUCCESS STATE */}
      {isSuccess ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-900 space-y-5 animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-emerald-950 leading-tight">
                Registration Confirmed!
              </h3>
              <p className="text-xs text-emerald-800">
                Your mobile app access request has been securely recorded.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-100 text-xs font-mono space-y-2 text-slate-700">
            <div className="flex justify-between pb-1 border-b border-slate-100">
              <span className="text-slate-500">Platform:</span>
              <span className="font-bold uppercase text-slate-900">{selectedPlatform}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-100">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-bold text-slate-900">{fullName}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-100">
              <span className="text-slate-500">Delivery Email:</span>
              <span className="font-bold text-slate-900">{email}</span>
            </div>
            {registrationId && (
              <div className="flex justify-between">
                <span className="text-slate-500">Security Token ID:</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">{registrationId}</span>
              </div>
            )}
          </div>

          {/* Download Destination handling - Honest verified destination */}
          <div className="space-y-3 pt-2">
            {currentPlatformConfig.downloadUrl ? (
              <a
                href={currentPlatformConfig.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified {currentPlatformConfig.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-950">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Early Access Verification Link Dispatched</span>
                </div>
                <p className="leading-relaxed">
                  We have queued your install token. You will receive an official direct download invitation via SMS / WhatsApp at <strong>{phone}</strong> and email at <strong>{email}</strong> once your device environment is approved.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Register Another Device or Platform</span>
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Full Name *</span>
              {fieldErrors.fullName && (
                <span className="text-[11px] font-normal text-red-600">{fieldErrors.fullName}</span>
              )}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: "" }));
              }}
              placeholder="e.g. Rahul Sharma"
              className={`w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 border transition-all focus:bg-white focus:outline-hidden ${
                fieldErrors.fullName ? "border-red-400 ring-1 ring-red-400" : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Business / Personal Email *</span>
                {fieldErrors.email && (
                  <span className="text-[11px] font-normal text-red-600 truncate">{fieldErrors.email}</span>
                )}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }));
                }}
                placeholder="you@domain.com"
                className={`w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 border transition-all focus:bg-white focus:outline-hidden ${
                  fieldErrors.email ? "border-red-400 ring-1 ring-red-400" : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Mobile Number *</span>
                {fieldErrors.phone && (
                  <span className="text-[11px] font-normal text-red-600 truncate">{fieldErrors.phone}</span>
                )}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: "" }));
                }}
                placeholder="+91 98765 43210"
                className={`w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 border transition-all focus:bg-white focus:outline-hidden ${
                  fieldErrors.phone ? "border-red-400 ring-1 ring-red-400" : "border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
              />
            </div>
          </div>

          {/* Privacy Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => {
                  setConsentGiven(e.target.checked);
                  if (fieldErrors.consentGiven) setFieldErrors(prev => ({ ...prev, consentGiven: "" }));
                }}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-snug">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={onNavigatePrivacy}
                  className="text-blue-600 hover:underline font-bold inline"
                >
                  Privacy Policy
                </button>{" "}
                and consent to receiving mobile app download links and software access notifications from C Vidya Solutions.
              </span>
            </label>
            {fieldErrors.consentGiven && (
              <p className="text-[11px] text-red-600 mt-1 pl-6">{fieldErrors.consentGiven}</p>
            )}
          </div>

          {/* Error Banner */}
          {submitError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Recording Registration...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Register &amp; Get {selectedPlatform === "android" ? "Android" : "iOS"} App Access</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
