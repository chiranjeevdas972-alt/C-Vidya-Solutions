import React, { useEffect } from "react";
import { 
  CheckCircle2, 
  X 
} from "lucide-react";

export interface SubmittedDemoData {
  name: string;
  phone: string;
  email: string;
  service: string;
  referenceId: string;
  requirements?: string;
}

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SubmittedDemoData | null;
  onNavigate?: (path: string) => void;
}

export default function CongratulationsModal({
  isOpen,
  onClose,
  data,
  onNavigate
}: CongratulationsModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="congratulations-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans animate-fade-in"
    >
      {/* Backdrop click area */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-center p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        {/* Close X Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close congratulations message"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Icon Badge */}
        <div className="mx-auto mb-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        {/* Heading */}
        <h3
          id="congratulations-modal-title"
          className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight"
        >
          Congratulations! 🎉
        </h3>

        <p className="text-sm sm:text-base font-semibold text-slate-800 mt-1.5 mb-6">
          Your Free Live Demo Has Been Successfully Booked
        </p>

        {/* Done Action Button */}
        <div className="flex items-center justify-center pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-w-[140px] px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
