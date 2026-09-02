import React, { useState } from "react";
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Calendar, 
  Send,
  Zap,
  Layers,
  ArrowRight
} from "lucide-react";
import { type ProductService } from "../types";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface ProductDetailModalProps {
  product: ProductService | null;
  onClose: () => void;
  onOpenConsultation?: () => void;
  onOpenSoftware?: (product: ProductService) => void;
}

export default function ProductDetailModal({ product, onClose, onOpenConsultation, onOpenSoftware }: ProductDetailModalProps) {
  if (!product) return null;

  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setSubmitting(true);
    try {
      // 1. Direct Firestore write
      try {
        const inquiriesCol = collection(db, "inquiries");
        await addDoc(inquiriesCol, {
          name: leadName.trim(),
          email: leadEmail.trim() || "demo-request@cvidya.com",
          phone: leadPhone.trim(),
          service: product.name,
          message: `Product modal callback request for ${product.name}`,
          timestamp: new Date().toISOString(),
          status: "pending_review"
        });
      } catch (fbErr) {
        console.warn("Direct Firestore fallback:", fbErr);
      }

      // 2. Server API
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          email: leadEmail.trim() || "demo-request@cvidya.com",
          phone: leadPhone.trim(),
          service: product.name,
          message: `Product modal callback request for ${product.name}`
        })
      }).catch(() => {});

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Back</span>
          </button>
          
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-mono font-bold uppercase tracking-wider">
              {product.categoryType === "saas" ? "Enterprise SaaS Platform" : "Autonomous AI Agent"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            {product.name}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Features List */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">
              Key Capabilities &amp; Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Links & Demo */}
        <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-900">Live Production Preview</div>
            <div className="text-[11px] text-slate-500">Explore interactive console with live telemetry.</div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenSoftware) {
                onOpenSoftware(product);
              } else if (product.externalLink) {
                window.open(product.externalLink, "_blank");
              }
            }}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <span>Click Here</span>
          </button>
        </div>

        {/* Quick Callback / Demo Inquiry */}
        <div className="border-t border-slate-100 pt-5 space-y-3">
          <h4 className="text-xs font-mono uppercase text-slate-700 font-bold tracking-wider">
            Request an Institutional Walkthrough
          </h4>

          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-900">Request Successfully Transmitted</div>
              <div className="text-[11px] text-slate-600">Our engineering lead will call you at {leadPhone}.</div>
            </div>
          ) : (
            <form onSubmit={handleRequest} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="Your Name"
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="tel"
                required
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder="Phone (+91)"
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                {submitting ? "Sending..." : "Request Call"}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
