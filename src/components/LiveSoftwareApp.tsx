import React, { useState, useEffect } from "react";
import { ProductService } from "../types";
import { 
  ArrowRight, 
  X, 
  RefreshCw, 
  Maximize2, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Send,
  MessageSquare,
  TrendingUp,
  Headphones,
  Megaphone,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface LiveSoftwareAppProps {
  software: ProductService | null;
  onClose: () => void;
  onOpenDetails?: () => void;
}

export default function LiveSoftwareApp({ software, onClose, onOpenDetails }: LiveSoftwareAppProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "console">("live");

  // Simulation states for interactive backup
  const [userInput, setUserInput] = useState("");
  const [simLogs, setSimLogs] = useState<Array<{ sender: "user" | "agent"; text: string; time: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (software) {
      document.body.style.overflow = "hidden";
      setIframeLoaded(false);
      setIframeError(false);

      // Seed initial simulation log
      if (software.id === "ai-social") {
        setSimLogs([
          { sender: "agent", text: "Welcome to C Vidya AI Social Media Agent. Connecting to LinkedIn, X, Instagram & Facebook. Ready to generate viral posts & automate multi-channel campaigns.", time: "Just now" }
        ]);
      } else if (software.id === "ai-support") {
        setSimLogs([
          { sender: "agent", text: "C Vidya AI Customer Support Agent is active. 24/7 Neural RAG knowledge base connected. How can I assist you or your customers today?", time: "Just now" }
        ]);
      } else if (software.id === "ai-salesflow") {
        setSimLogs([
          { sender: "agent", text: "C Vidya SalesFlow AI Agent initialized. Prospecting verified B2B leads & generating high-converting multi-touch sales sequences.", time: "Just now" }
        ]);
      } else if (software.id === "ai-marketing") {
        setSimLogs([
          { sender: "agent", text: "C Vidya B2B SaaS Growth & Marketing AI Agent is live. Inbound demand generation, SEO topic clustering & multi-channel ROI tracker active.", time: "Just now" }
        ]);
      } else {
        setSimLogs([
          { sender: "agent", text: `Connected to ${software.name} live production environment. All cloud nodes and local caching are operational.`, time: "Just now" }
        ]);
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [software, onClose]);

  if (!software) return null;

  const handleSimulateAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    const query = userInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setSimLogs((prev) => [...prev, { sender: "user", text: query, time: timeNow }]);
    setUserInput("");
    setIsProcessing(true);

    setTimeout(() => {
      let reply = "";
      if (software.id === "ai-social") {
        reply = `✨ Generated viral post for LinkedIn & X: "🚀 Excited to announce our new automated workflow! Here are 3 key takeaways that doubled our team efficiency: 1️⃣ Zero manual latency 2️⃣ Multi-channel auto-scheduling 3️⃣ Real-time engagement analytics. #Growth #AI #Automation"`;
      } else if (software.id === "ai-support") {
        reply = `🤖 Neural RAG resolved query with 99.4% confidence: "Your subscription details and active seats have been verified. Invoices are dispatched to your registered billing email."`;
      } else if (software.id === "ai-salesflow") {
        reply = `🎯 SalesFlow AI identified 14 verified B2B decision makers matching "${query}". Auto-generated customized outreach sequence & booked follow-up cadences.`;
      } else if (software.id === "ai-marketing") {
        reply = `📊 B2B Marketing Agent launched high-intent organic campaign. SEO cluster built for "${query}" with projected 3.4x inbound MQL growth.`;
      } else {
        reply = `✅ ${software.name} processed transaction for "${query}". Cloud sync logged with zero conflict.`;
      }

      setSimLogs((prev) => [...prev, { sender: "agent", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden animate-fadeIn">
      {/* Top Application Header Bar with Back Button */}
      <header className="h-16 bg-[#071739] border-b border-blue-900/60 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-lg z-30">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-all shadow-md cursor-pointer border-none"
            title="Return to previous page"
          >
            <ArrowRight className="w-4 h-4 rotate-180 text-white stroke-[2.5]" />
            <span>Back</span>
          </button>

          <span className="font-bold text-xs sm:text-sm md:text-base text-white tracking-wide truncate max-w-xs sm:max-w-md md:max-w-xl">
            {software.name}
          </span>
        </div>
      </header>

      {/* Main Software Canvas Area */}
      <main className="flex-1 w-full h-[calc(100vh-64px)] relative bg-slate-900 overflow-hidden flex flex-col">
        {activeTab === "live" && software.externalLink ? (
          <div className="w-full h-full relative flex flex-col">
            {/* Loading Indicator */}
            {!iframeLoaded && !iframeError && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-10">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-xs text-slate-400 font-mono">Loading {software.name} environment...</p>
              </div>
            )}

            {/* Embedded Live Web Application */}
            <iframe
              src={software.externalLink}
              title={software.name}
              onLoad={() => setIframeLoaded(true)}
              onError={() => {
                setIframeLoaded(true);
                setIframeError(true);
              }}
              allow="camera; microphone; geolocation; clipboard-write; display-capture;"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              className="w-full flex-1 border-none bg-slate-950"
            />
          </div>
        ) : (
          /* High Fidelity Interactive Simulator Console */
          <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 sm:p-6 overflow-hidden">
            <div className="bg-slate-900 border border-blue-900/40 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
              {/* Console Header */}
              <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2 font-semibold">
                    {software.id}-agent-daemon: active-session
                  </span>
                </div>
                <span className="text-xs font-mono text-blue-400 font-bold">
                  {software.categoryType === "ai-agent" ? "Autonomous AI Agent Engine" : "Cloud Platform"}
                </span>
              </div>

              {/* Console Logs / Dialogue */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/60 font-sans">
                {simLogs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${log.sender === "user" ? "items-end" : "items-start"} space-y-1`}
                  >
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{log.sender === "user" ? "You (Client Admin)" : software.name}</span>
                      <span>•</span>
                      <span>{log.time}</span>
                    </div>
                    <div 
                      className={`max-w-2xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        log.sender === "user" 
                          ? "bg-blue-600 text-white rounded-br-none" 
                          : "bg-slate-800 text-slate-100 border border-slate-700/60 rounded-bl-none shadow-md"
                      }`}
                    >
                      {log.text}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-mono animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Agent reasoning &amp; orchestrating live tasks...</span>
                  </div>
                )}
              </div>

              {/* Console Command Input Bar */}
              <form onSubmit={handleSimulateAction} className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={
                    software.id === "ai-social" 
                      ? "Enter topic, campaign goal, or target audience (e.g., 'SaaS growth tips for Twitter')..." 
                      : software.id === "ai-support" 
                      ? "Ask any customer support inquiry or policy question..." 
                      : software.id === "ai-salesflow"
                      ? "Enter target B2B sector or company size (e.g., 'Logistics CTOs in India')..."
                      : software.id === "ai-marketing"
                      ? "Enter marketing initiative or SEO keyword cluster..."
                      : "Type a command or test query..."
                  }
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim() || isProcessing}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Execute</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
