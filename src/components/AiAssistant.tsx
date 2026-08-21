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
  RefreshCw
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
    category: "Explore Products",
    questions: [
      "What software do you provide?",
      "Tell me about C Vidya Library Management",
      "How does CV Fitness Zone work?",
      "Explain AgriFusion & FarmFresh Hub"
    ]
  },
  {
    category: "Autonomous AI Agents",
    questions: [
      "What are your 4 Autonomous AI Agents?",
      "Tell me about SalesFlow AI Agent",
      "How does AI Customer Support Agent work?",
      "Explain AI Marketing for B2B SaaS"
    ]
  },
  {
    category: "Demos & Pricing",
    questions: [
      "How can I request a live demo or trial?",
      "What is your pricing model?",
      "Can we import existing Excel records?"
    ]
  }
];

export default function AiAssistant({ isOpen, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
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
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isTyping]);

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
    <div 
      id="ai-assistant-drawer" 
      className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-slate-950 border-l border-brand-gold-500/20 shadow-2xl z-50 flex flex-col justify-between font-sans text-white"
    >
      
      {/* Drawer Header Block */}
      <div className="p-4 bg-brand-navy-900 border-b border-brand-gold-500/20 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-gold-500/10 border border-brand-gold-400 flex items-center justify-center animate-pulse shrink-0">
            <Logo size={26} showText={false} className="shrink-0" />
          </div>
          <div>
            <div className="font-display font-extrabold text-sm tracking-wider text-brand-gold-400 flex items-center gap-1.5">
              <span>C-VIDYA AI CUSTOMER SUPPORT AGENT</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 leading-none mt-0.5 font-bold">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
              <span>ONLINE | OFFICIAL 24/7 SUPPORT</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={resetChat}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Decorative thin gold top line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-400 to-[#d69e2e]" />
      </div>

      {/* Main Dialogue Box Scroll Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll-panel bg-[#070b13]">
        
        {/* Knowledge & Scope Indicator */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 bg-[#131a26] text-[10px] font-mono text-slate-300 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold-400" />
            <span>Trained on 7 SaaS Products, 4 AI Agents & STPI Sindri Cloud Node</span>
          </span>
        </div>

        {/* Conversation Message List */}
        {messages.map((m) => {
          const isModel = m.role === "model" || m.role === "assistant";
          return (
            <div 
              key={m.id} 
              className={`flex items-start gap-2.5 max-w-[88%] ${
                isModel ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Profile Avatar */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-mono font-bold ${
                isModel 
                  ? "bg-brand-navy-900 border-brand-gold-400/40 text-brand-gold-400" 
                  : "bg-slate-700 border-slate-600 text-white"
              }`}>
                {isModel ? <Logo size={18} showText={false} className="shrink-0" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Dialog Bubble */}
              <div className="space-y-1">
                <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed break-words ${
                  isModel 
                    ? "bg-[#101726] text-slate-200 border border-slate-800/80 rounded-tl-none shadow-sm" 
                    : "bg-brand-gold-500 text-slate-950 font-semibold rounded-tr-none shadow-sm"
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">
                    {m.content}
                  </p>
                </div>
                <div className={`text-[9px] text-slate-500 font-mono ${
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
          <div className="flex items-start gap-2.5 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-brand-navy-900 border border-brand-gold-400/40 text-brand-gold-400 flex items-center justify-center animate-bounce">
              <Logo size={18} showText={false} className="shrink-0" />
            </div>
            <div className="bg-[#101726]/90 border border-slate-800/80 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-gold-400 rounded-full animate-ping" />
                <span className="font-mono text-[11px] text-brand-gold-400 font-bold">
                  C-Vidya AI is typing an answer...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Preset Discovery Tabs & Suggestion Pills */}
      <div className="px-4 py-3 bg-[#0a0f19] border-t border-slate-900 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1.5 uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-brand-gold-400" />
            <span>QUICK TOPICS:</span>
          </div>
          <div className="flex gap-1">
            {PRESET_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md transition-all ${
                  activeCategoryIndex === idx 
                    ? "bg-brand-gold-500 text-slate-950 font-bold" 
                    : "bg-slate-800 text-slate-400 hover:text-white"
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
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-[#121a2b] hover:bg-brand-gold-500 hover:text-slate-950 border border-slate-800 hover:border-brand-gold-500 rounded-xl px-3 py-1.5 text-slate-300 font-medium transition-all cursor-pointer text-left active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Message Form Panel */}
      <div className="p-4 bg-brand-navy-900 border-t border-brand-gold-500/20 flex flex-col gap-2">
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
            className="flex-1 text-xs sm:text-sm px-4 py-3 bg-[#0d1524] border border-slate-700/80 rounded-xl focus:border-brand-gold-400 focus:ring-1 focus:ring-brand-gold-400 outline-none text-slate-100 placeholder-slate-500 font-medium shadow-inner"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="p-3 bg-brand-gold-500 hover:bg-brand-gold-400 disabled:opacity-40 text-slate-950 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 font-bold shadow-md hover:scale-105"
            title="Send Message"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="flex justify-between items-center text-[9.5px] text-slate-400 font-mono mt-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Official C Vidya Solutions Support</span>
          </div>
          <a 
            href="#contact" 
            onClick={onClose} 
            className="hover:text-brand-gold-400 underline transition-colors"
          >
            Direct Helpline: 8987766981
          </a>
        </div>
      </div>

    </div>
  );
}
