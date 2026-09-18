import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle, 
  User, 
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Logo from "./Logo";
import { ChatMessage } from "../types";
import { getSmartAssistantResponse } from "../utils/aiResponder";

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_CATEGORIES = [
  {
    category: "7 SaaS Products",
    questions: [
      "What software do you provide?",
      "Tell me about C Vidya Library Management",
      "How does CV Fitness Zone work?",
      "Explain C Vidya Institute Management",
      "Tell me about Coaching Management",
      "Explain AgriFusion & FarmFresh Hub",
      "Tell me about C Vidya Jewelers Management",
      "How does C Vidya Enterprises CRM work?"
    ]
  },
  {
    category: "4 AI Agents",
    questions: [
      "What are your 4 Autonomous AI Agents?",
      "Tell me about C Vidya Social Media Agent",
      "How does C Vidya AI Customer Support Agent work?",
      "Tell me about Business Sales Flow AI Agent",
      "Explain AI Marketing for B2B SaaS Companies"
    ]
  },
  {
    category: "Other Services",
    questions: [
      "Tell me about Petrol Pump Software",
      "Explain Care Plus Healthcare System",
      "How does C Vidya PDF & Media Tools SaaS work?",
      "How can I request a live demo or trial?",
      "What is your pricing model?"
    ]
  }
];

export default function AiAssistant({ isOpen, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: `Hello! 👋 Welcome to **C Vidya Solutions**.

I am your **C-Vidya AI Assistant**. I can help you with:

• **7 Flagship SaaS Products**:
  1. C Vidya Library Management
  2. C Vidya Fitness Zone
  3. C Vidya Institute Management
  4. C Vidya Coaching Management
  5. AgriFusion (FarmFresh Hub)
  6. C Vidya Jewelers Management
  7. C Vidya Enterprises CRM

• **4 Autonomous AI Agents**:
  1. C Vidya Social Media Agent
  2. C Vidya AI Customer Support Agent
  3. C Vidya Business Sales Flow AI Agent
  4. C Vidya AI Marketing for B2B SaaS Companies AI Agent

• **Other Specialized Services**:
  1. C Vidya Cloud-Based Software Petrol Pump Site
  2. Care Plus Healthcare System
  3. C Vidya PDF and Media Tools SaaS

Feel free to ask any question regarding software features, live demos, pricing, architectures, or technical FAQs in English, Hindi, or Hinglish!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [showQuickTopics, setShowQuickTopics] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 150);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, messages, isTyping, onClose]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const formattedHistory = [...messages, userMessage].map(m => ({
        role: m.role === "model" || m.role === "assistant" ? "model" : "user",
        content: m.content
      }));

      let assistantText = "";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: formattedHistory })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.text) {
            assistantText = data.text;
          }
        }
      } catch (e) {
        console.warn("Backend chat endpoint unreachable, using local AI responder:", e);
      }

      if (!assistantText) {
        assistantText = getSmartAssistantResponse(formattedHistory);
      }
      
      const assistantMessage: ChatMessage = {
        id: `msg_${Math.random().toString(36).substr(2, 9)}`,
        role: "model",
        content: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      const fallbackText = getSmartAssistantResponse([...messages, userMessage]);
      const errorMessage: ChatMessage = {
        id: `msg_err_${Math.random().toString(36).substr(2, 9)}`,
        role: "model",
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        content: `Hello! 👋 Welcome to **C Vidya Solutions**.

I am your **C-Vidya AI Customer Support Agent**. I can help you with:

• **7 Flagship SaaS Suites** (Library, Gym, Institutes, Coaching, AgriFusion, Jewelry, CRM)
• **4 Autonomous AI Agents** (Social Media, Support, SalesFlow, B2B SaaS Marketing)
• **Live Cloud Demos & Sandbox Access**
• **Custom Pricing & Turnkey Onboarding**

How can I help you today? Feel free to ask in English, Hindi, or Hinglish!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay for focus and dismiss */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div 
        id="ai-assistant-drawer" 
        role="dialog"
        aria-modal="true"
        aria-label="C-Vidya AI Assistant"
        className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:w-[440px] md:w-[460px] lg:w-[480px] max-w-full h-[100dvh] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col justify-between font-sans text-slate-900 pb-[env(safe-area-inset-bottom,0px)] overflow-hidden"
      >
      
      {/* Drawer Header Block */}
      <div className="p-3 sm:p-4 bg-brand-navy-900 border-b border-brand-gold-500/20 flex justify-between items-center relative shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-gold-500/10 border border-brand-gold-400 flex items-center justify-center animate-pulse shrink-0">
            <Logo size={24} showText={false} className="shrink-0" />
          </div>
          <div className="min-w-0">
            <div className="font-display font-black text-sm sm:text-base tracking-wider text-brand-gold-400 truncate">
              <span>C-VIDYA AI</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close Assistant"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Decorative thin gold top line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-400 to-[#d69e2e]" />
      </div>

      {/* Main Dialogue Box Scroll Window */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 sm:space-y-4 custom-scroll-panel bg-white">
        
        {/* Knowledge & Scope Indicator */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-[9.5px] sm:text-[10px] font-mono text-slate-700 px-3 sm:px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-brand-navy-900 shrink-0" />
            <span className="truncate">Trained on 7 SaaS Products, 4 AI Agents & Specialized Cloud Services</span>
          </span>
        </div>

        {/* Conversation Message List */}
        {messages.map((m) => {
          const isModel = m.role === "model" || m.role === "assistant";
          return (
            <div 
              key={m.id} 
              className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%] ${
                isModel ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Profile Avatar */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-mono font-bold shadow-2xs ${
                isModel 
                  ? "bg-brand-navy-900 border-brand-gold-400/40 text-brand-gold-400" 
                  : "bg-brand-navy-900 border-brand-navy-800 text-white"
              }`}>
                {isModel ? <Logo size={18} showText={false} className="shrink-0" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Dialog Bubble */}
              <div className="space-y-1 min-w-0">
                <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed break-words shadow-2xs ${
                  isModel 
                    ? "bg-slate-100 text-slate-900 border border-slate-200/90 rounded-tl-none font-sans" 
                    : "bg-brand-navy-900 text-white font-medium rounded-tr-none"
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">
                    {m.content}
                  </p>
                </div>
                <div className={`text-[9px] text-slate-400 font-mono ${
                  isModel ? "text-left" : "text-right"
                }`}>
                  {m.timestamp}
                </div>
              </div>

            </div>
          );
        })}

        {/* AI Typing Pulse Indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-brand-navy-900 border border-brand-gold-400/40 text-brand-gold-400 flex items-center justify-center animate-bounce shrink-0">
              <Logo size={18} showText={false} className="shrink-0" />
            </div>
            <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-800 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-navy-900 rounded-full animate-ping" />
                <span className="font-mono text-[11px] text-brand-navy-950 font-bold">
                  C-Vidya AI is typing an answer...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Topics Collapsible Bar with Arrow Toggle */}
      <div className="shrink-0 bg-[#090e18] border-t border-slate-800/90">
        <button
          type="button"
          onClick={() => setShowQuickTopics(!showQuickTopics)}
          className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors group cursor-pointer"
          aria-expanded={showQuickTopics}
          aria-label={showQuickTopics ? "Hide quick topics and suggested questions" : "Show quick topics and suggested questions"}
        >
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold text-slate-300 group-hover:text-brand-gold-400 transition-colors">
            <HelpCircle className="w-3.5 h-3.5 text-brand-gold-400 shrink-0" />
            <span>QUICK TOPICS & QUESTIONS</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-brand-gold-400">
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300">
              {showQuickTopics ? "Hide" : "Open"}
            </span>
            <div className="p-1 rounded-md bg-slate-800 group-hover:bg-slate-700 text-brand-gold-400 transition-all flex items-center justify-center">
              {showQuickTopics ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </div>
          </div>
        </button>

        {/* Collapsible Content: Opened only when user clicks the arrow */}
        {showQuickTopics && (
          <div className="px-3 sm:px-4 pb-3 pt-1 space-y-2.5 max-h-56 sm:max-h-64 overflow-y-auto custom-scroll-panel border-t border-slate-800/60 bg-[#0a0f19] animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
              <span className="text-[9.5px] text-slate-400 font-mono font-bold tracking-wider uppercase">
                CATEGORY:
              </span>
              <div className="flex flex-wrap gap-1">
                {PRESET_CATEGORIES.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveCategoryIndex(idx)}
                    className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      activeCategoryIndex === idx 
                        ? "bg-brand-gold-500 text-slate-950 font-bold shadow-xs" 
                        : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_CATEGORIES[activeCategoryIndex].questions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="text-[10.5px] sm:text-[11px] bg-[#121a2b] hover:bg-brand-gold-500 hover:text-slate-950 border border-slate-800 hover:border-brand-gold-500 rounded-xl px-2.5 py-1.5 sm:px-3 text-slate-300 font-medium transition-all cursor-pointer text-left active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Message Form Panel */}
      <div className="p-3 sm:p-4 bg-brand-navy-900 border-t border-brand-gold-500/20 flex flex-col gap-2 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2 items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about software, AI agents, demo, pricing, or logins..."
            className="flex-1 text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#0d1524] border border-slate-700/80 rounded-xl focus:border-brand-gold-400 focus:ring-1 focus:ring-brand-gold-400 outline-none text-slate-100 placeholder-slate-500 font-medium shadow-inner min-h-[44px]"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="min-w-[44px] min-h-[44px] p-2.5 sm:p-3 bg-brand-gold-500 hover:bg-brand-gold-400 disabled:opacity-40 text-slate-950 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 font-bold shadow-md hover:scale-105 flex items-center justify-center"
            title="Send Message"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-mono">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">Official C Vidya Solutions Support</span>
        </div>
      </div>

    </div>
    </>
  );
}
