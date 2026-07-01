import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, MessageSquare, PhoneCall, HelpCircle, User } from "lucide-react";
import { ChatMessage } from "../types";

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUESTIONS = [
  "What is the C Vidya Library software?",
  "How does the Coaching SMS alerts look?",
  "What features are in the Fitness zone?",
  "Do you have a system for Schools?"
];

export default function AiAssistant({ isOpen, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "Hello! I am **Vidya AI**, your dedicated product consultant for C Vidya Solution. How may I assist you with our integrated digital systems suite today? Feel free to ask about library automation, parent CRM portals, smart farming metrics, or custom dashboards!",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Gather relevant preceding chat messages to proxy history
      const formattedHistory = [...messages, userMessage].map(m => ({
        role: m.role === "model" ? "model" : "user",
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedHistory })
      });

      if (!response.ok) {
        throw new Error("Advisory assistant offline.");
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `msg_${Math.random().toString(36).substr(2, 9)}`,
        role: "model",
        content: data.text || "I was unable to synchronize details. Please ask again or reach us at cvidyasolutions@gmail.com.",
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: `msg_err_${Math.random().toString(36).substr(2, 9)}`,
        role: "model",
        content: "I'm having trouble reaching C Vidya Solution servers right now. Please confirm your internet connection or register a callback using the form below! Rest assured, we prioritize your operations.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="ai-assistant-drawer" className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-slate-950 border-l border-brand-gold-500/10 shadow-2xl z-50 flex flex-col justify-between font-sans text-white">
      
      {/* Drawer Header Block */}
      <div className="p-4 bg-brand-navy-900 border-b border-brand-gold-500/20 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-gold-500/10 border border-[#42A5F5] flex items-center justify-center animate-pulse">
            <Bot className="w-5 h-5 text-brand-gold-400" />
          </div>
          <div>
            <div className="font-display font-extrabold text-sm tracking-wider text-brand-gold-400">
              VIDYA AI ADVISER
            </div>
            <div className="text-[9.5px] font-mono text-emerald-400 flex items-center gap-1.5 leading-none mt-0.5">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>ONLINE | GEMINI SECURED PORTAL</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
          title="Minimize Advice"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative thin gold top line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-400 to-[#d69e2e]" />
      </div>

      {/* Main Dialogue Box Scroll Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll-panel bg-[#070b13]">
        
        {/* Safe AI credit warning line */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1 bg-[#131a26] text-[9.5px] font-mono text-slate-400 px-3 py-1 rounded-full border border-slate-800">
            <Sparkles className="w-3 h-3 text-brand-gold-500" />
            <span>Consulting about 8 Product Architectures</span>
          </span>
        </div>

        {/* Conversation List */}
        {messages.map((m) => {
          const isModel = m.role === "model" || m.role === "assistant";
          return (
            <div 
              key={m.id} 
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isModel ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Profile Avatar */}
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-mono font-bold ${
                isModel 
                  ? "bg-brand-navy-900 border-[#42A5F5]/20 text-brand-gold-400" 
                  : "bg-slate-700 border-slate-600 text-white"
              }`}>
                {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Dialog Bubble */}
              <div className="space-y-1">
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed break-words ${
                  isModel 
                    ? "bg-[#101726] text-slate-200 border border-slate-800/80 rounded-tl-none" 
                    : "bg-brand-gold-500 text-slate-950 font-medium rounded-tr-none"
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">
                    {m.content}
                  </p>
                </div>
                <div className={`text-[8.5px] text-slate-500 font-mono ${
                  isModel ? "text-left" : "text-right"
                }`}>
                  {m.timestamp}
                </div>
              </div>

            </div>
          );
        })}

        {/* AI Typing Loading Pulse Indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-brand-navy-900 border border-[#42A5F5]/20 text-brand-gold-400 flex items-center justify-center animate-bounce">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#101726]/80 border border-slate-800/60 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-brand-gold-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-brand-gold-400 rounded-full animate-pulse [animation-delay:200ms]" />
                <span className="w-1.5 h-1.5 bg-brand-gold-400 rounded-full animate-pulse [animation-delay:400ms]" />
                <span>Vidya Advisor formulating response...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Preset helper suggestions */}
      {messages.length === 1 && (
        <div className="px-4 py-2.5 bg-[#0a0f19] border-t border-slate-900">
          <div className="text-[10px] text-slate-400 font-mono font-bold mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#42A5F5]" />
            <span>SUGGESTED DISCOVERY QUERIES:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="text-[10.5px] bg-[#121a2b] hover:bg-brand-gold-500 hover:text-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 font-medium transition-colors cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Message Form Panel */}
      <div className="p-4 bg-brand-navy-900 border-t border-slate-900 flex flex-col gap-2">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about our product suite..."
            className="flex-1 text-xs px-4 py-3 bg-[#0d1524] border border-slate-800 rounded-xl focus:border-[#42A5F5]/60 focus:ring-1 focus:ring-[#42A5F5]/40 outline-none text-slate-100 placeholder-slate-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="p-3 bg-brand-gold-500 hover:bg-brand-gold-600 disabled:opacity-50 text-slate-950 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
            title="Transmit Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono mt-1">
          <div className="flex items-center gap-1">
            <Bot className="w-3 h-3 text-[#42A5F5]" />
            <span>Secure Enterprise consult logs</span>
          </div>
          <a href="#contact" onClick={onClose} className="hover:text-brand-gold-400 underline transition-colors">
            Request official Callback Form
          </a>
        </div>
      </div>

    </div>
  );
}
