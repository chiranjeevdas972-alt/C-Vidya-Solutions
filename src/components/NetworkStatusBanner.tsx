import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, AlertTriangle, RefreshCw, X, ShieldAlert } from "lucide-react";

interface NetworkStatusBannerProps {
  onSessionExpiredTrigger?: () => void;
}

export default function NetworkStatusBanner({ onSessionExpiredTrigger }: NetworkStatusBannerProps) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [showSimulatedOffline, setShowSimulatedOffline] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Global listener for session expired simulation events
    const handleSessionEvent = () => setSessionExpiredOpen(true);
    window.addEventListener("CV_TRIGGER_SESSION_EXPIRED", handleSessionEvent);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("CV_TRIGGER_SESSION_EXPIRED", handleSessionEvent);
    };
  }, []);

  const effectiveOffline = !isOnline || showSimulatedOffline;

  const handleRetry = () => {
    setIsReconnecting(true);
    setTimeout(() => {
      setIsReconnecting(false);
      if (showSimulatedOffline) {
        setShowSimulatedOffline(false);
      }
    }, 1000);
  };

  return (
    <>
      {/* Offline Status Top Banner */}
      {effectiveOffline && (
        <aside
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          className="bg-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-medium z-50 sticky top-0"
        >
          <div className="flex items-center gap-2.5 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-100 shrink-0 animate-pulse" />
              <span>
                <strong>No Internet Connection:</strong> You are browsing in offline fallback mode. Local client cache active.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleRetry}
                disabled={isReconnecting}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReconnecting ? "animate-spin" : ""}`} />
                <span>{isReconnecting ? "Connecting..." : "Retry Connection"}</span>
              </button>
              {showSimulatedOffline && (
                <button
                  type="button"
                  onClick={() => setShowSimulatedOffline(false)}
                  className="text-amber-200 hover:text-white transition-colors"
                  title="Dismiss simulated offline"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Session Expired Edge Case Modal */}
      {sessionExpiredOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-expired-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 text-left animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 border border-amber-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 id="session-expired-title" className="text-lg font-bold text-slate-900 mb-1">
              Security Session Expired
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Your secure session authentication token has elapsed or was invalidated for security compliance. Any unsaved form state has been preserved locally.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5 text-[11px] font-mono text-slate-600 space-y-1">
              <div>Status: 401 Unauthorized (TOKEN_REFRESH_REQUIRED)</div>
              <div>Security Layer: Zero-Trust Token Heartbeat</div>
            </div>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSessionExpiredOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setSessionExpiredOpen(false);
                  // Refresh token simulation
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Re-Authenticate Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
