import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  User, 
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  AlertCircle,
  ChevronDown,
  Check
} from "lucide-react";
import Logo from "./Logo";
import { ChatMessage, VoiceAgentStatus } from "../types";
import { getSmartAssistantResponse, detectLanguageMode, isGenericCatchAllReply, extractStructuredLeadFromChat } from "../utils/aiResponder";
import { speechInputService, SupportedVoiceLocale, normalizeSpokenCvidyaText } from "../services/speechInputService";
import { ttsService, VoiceGender } from "../services/ttsService";

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChatLanguageChoice = "en" | "hi";

function formatCleanHumanReply(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "");
}

export default function AiAssistant({ isOpen, onClose }: AiAssistantProps) {
  // Open blank chatbot with no pre-written message content
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Voice Agent & Language Pop-up State
  const [voiceStatus, setVoiceStatus] = useState<VoiceAgentStatus>("idle");
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() => ttsService.getVoiceGender());
  const [languageChoice, setLanguageChoice] = useState<ChatLanguageChoice>("en");
  const [showGenderPopup, setShowGenderPopup] = useState(false);
  const [showLangPopup, setShowLangPopup] = useState(false);
  const [ttsMuted, setTtsMuted] = useState<boolean>(() => ttsService.isMuted());
  const [voiceError, setVoiceError] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const speechSupported = speechInputService.isSupported();
  const ttsSupported = ttsService.isSupported();

  const voiceLocale: SupportedVoiceLocale = languageChoice === "hi" ? "hi-IN" : "en-IN";

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const headerControlsRef = useRef<HTMLDivElement>(null);
  const isListeningRef = useRef<boolean>(false);

  const clearComposerInput = () => {
    setInput("");
    setInterimTranscript("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Close pop-ups when clicking outside header dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (headerControlsRef.current && !headerControlsRef.current.contains(e.target as Node)) {
        setShowGenderPopup(false);
        setShowLangPopup(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowGenderPopup(false);
          setShowLangPopup(false);
          isListeningRef.current = false;
          speechInputService.stopListening();
          ttsService.stop();
          clearComposerInput();
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 150);
      return () => window.removeEventListener("keydown", handleKeyDown);
    } else {
      setShowGenderPopup(false);
      setShowLangPopup(false);
      isListeningRef.current = false;
      speechInputService.stopListening();
      ttsService.stop();
      setVoiceStatus("idle");
      clearComposerInput();
    }
  }, [isOpen, messages, isTyping, onClose]);

  const speakAssistantReply = (text: string, genderOverride?: VoiceGender) => {
    if (ttsMuted || !ttsSupported) {
      setVoiceStatus("idle");
      return;
    }
    const langMode = detectLanguageMode(text);
    const preferredLang: "hi-IN" | "en-IN" = langMode === "hi" || voiceLocale === "hi-IN" ? "hi-IN" : "en-IN";
    ttsService.speak(
      text,
      preferredLang,
      {
        onStart: () => setVoiceStatus("speaking"),
        onEnd: () => {
          setVoiceStatus("idle");
          if (!isListeningRef.current) {
            setInterimTranscript("");
          }
        },
        onError: () => {
          setVoiceStatus("idle");
          if (!isListeningRef.current) {
            setInterimTranscript("");
          }
        }
      },
      genderOverride || voiceGender
    );
  };

  const handleSelectVoiceGender = (nextGender: VoiceGender) => {
    setVoiceGender(nextGender);
    ttsService.setVoiceGender(nextGender);
    setShowGenderPopup(false);
    // If currently speaking, immediately switch to the selected Male/Female human voice
    if (voiceStatus === "speaking") {
      const lastModelMsg = [...messagesRef.current].reverse().find((m) => m.role === "model" || m.role === "assistant");
      if (lastModelMsg) {
        speakAssistantReply(lastModelMsg.content, nextGender);
      }
    }
  };

  const handleSelectLanguage = (nextLang: ChatLanguageChoice) => {
    setLanguageChoice(nextLang);
    setShowLangPopup(false);
  };

  const handleToggleListening = () => {
    setVoiceError("");
    setShowGenderPopup(false);
    setShowLangPopup(false);

    if (voiceStatus === "listening" || speechInputService.getIsListening() || isListeningRef.current) {
      const pendingText = normalizeSpokenCvidyaText(interimTranscript || input).trim();
      isListeningRef.current = false;
      speechInputService.stopListening();
      setVoiceStatus("idle");
      clearComposerInput();
      if (pendingText) {
        handleSendMessage(pendingText, true);
      }
      return;
    }

    if (!speechSupported) {
      setVoiceStatus("error");
      setVoiceError(
        "Browser speech recognition is not supported in this browser. Text chat remains fully operational."
      );
      return;
    }

    ttsService.stop();
    isListeningRef.current = true;
    clearComposerInput();

    speechInputService.startListening(voiceLocale, {
      onStateChange: (listening) => {
        isListeningRef.current = listening;
        setVoiceStatus(listening ? "listening" : "idle");
        if (!listening) {
          setInterimTranscript("");
        }
      },
      onInterimResult: (transcript) => {
        if (!isListeningRef.current || !speechInputService.getIsListening()) return;
        const cleaned = normalizeSpokenCvidyaText(transcript);
        setInterimTranscript(cleaned);
        setInput(cleaned);
      },
      onFinalResult: (finalText) => {
        isListeningRef.current = false;
        speechInputService.stopListening();
        const cleaned = normalizeSpokenCvidyaText(finalText).trim();
        clearComposerInput();
        if (cleaned) {
          handleSendMessage(cleaned, true);
        } else {
          setVoiceStatus("idle");
        }
      },
      onError: (msg) => {
        isListeningRef.current = false;
        clearComposerInput();
        setVoiceStatus("error");
        setVoiceError(msg);
      }
    });
  };

  const handleToggleMute = () => {
    const nextMuted = !ttsMuted;
    setTtsMuted(nextMuted);
    ttsService.setMuted(nextMuted);
    if (nextMuted && voiceStatus === "speaking") {
      setVoiceStatus("idle");
    }
  };

  const handleStopSpeaking = () => {
    ttsService.stop();
    if (voiceStatus === "speaking") {
      setVoiceStatus("idle");
    }
  };

  const handleSendMessage = async (textToSend: string, triggeredByVoice = false) => {
    const normalizedInput = normalizeSpokenCvidyaText(textToSend).trim();
    if (!normalizedInput) {
      clearComposerInput();
      return;
    }

    setShowGenderPopup(false);
    setShowLangPopup(false);
    isListeningRef.current = false;
    speechInputService.stopListening();
    ttsService.stop();
    clearComposerInput();
    setVoiceError("");

    const userMessage: ChatMessage = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content: normalizedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const currentHistory = [...messagesRef.current, userMessage];
    messagesRef.current = currentHistory;
    setMessages(currentHistory);
    setIsTyping(true);
    setVoiceStatus("processing");

    const formattedHistory = currentHistory.map(m => ({
      role: m.role === "model" || m.role === "assistant" ? "model" : "user",
      content: m.content
    }));

    try {
      // 1. Check instant verified C Vidya Software & Business Knowledge Base (<1ms latency)
      const instantLocalReply = getSmartAssistantResponse(formattedHistory, {
        gender: voiceGender,
        preferredLanguage: languageChoice
      });

      const isKnownSoftwareOrBusinessQuery = !isGenericCatchAllReply(instantLocalReply);
      let assistantText = "";

      if (isKnownSoftwareOrBusinessQuery) {
        // Instant reply for all software, AI agents, pricing, demos, greetings, support & company queries
        assistantText = instantLocalReply;

        // If user shared phone/email/demo intent, sync lead in background without blocking the instant reply
        const leadCheck = extractStructuredLeadFromChat(formattedHistory);
        if (leadCheck.hasContactOrIntent && typeof fetch === "function") {
          fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: formattedHistory,
              voiceGender,
              preferredLanguage: languageChoice
            })
          }).catch(() => {});
        }
      } else {
        // Open-ended general query: query fast Gemini endpoint with tight 1300ms timeout
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1300);

          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: formattedHistory,
              voiceGender,
              preferredLanguage: languageChoice
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          const contentType = response.headers.get("content-type") || "";
          if (response.ok && contentType.includes("application/json")) {
            const data = await response.json();
            if (data && typeof data.text === "string" && data.text.trim()) {
              assistantText = data.text.trim();
            }
          }
        } catch (_) {
          // Instant local fallback on timeout
        }

        if (!assistantText) {
          assistantText = instantLocalReply;
        }
      }
      
      const assistantMessage: ChatMessage = {
        id: `msg_${Math.random().toString(36).substr(2, 9)}`,
        role: "model",
        content: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => {
        const updated = [...prev, assistantMessage];
        messagesRef.current = updated;
        return updated;
      });

      clearComposerInput();

      if (triggeredByVoice || !ttsMuted) {
        speakAssistantReply(assistantText);
      } else {
        setVoiceStatus("idle");
      }

    } catch (error: any) {
      const fallbackText = getSmartAssistantResponse(formattedHistory, {
        gender: voiceGender,
        preferredLanguage: languageChoice
      });
      const errorMessage: ChatMessage = {
        id: `msg_err_${Math.random().toString(36).substr(2, 9)}`,
        role: "model",
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => {
        const updated = [...prev, errorMessage];
        messagesRef.current = updated;
        return updated;
      });
      clearComposerInput();
      setVoiceStatus("idle");
    } finally {
      setIsTyping(false);
      if (!isListeningRef.current) {
        clearComposerInput();
      }
    }
  };

  if (!isOpen) return null;

  const languageLabel = languageChoice === "hi" ? "Hindi" : "English";

  return (
    <>
      {/* Backdrop overlay for focus and dismiss */}
      <div 
        onClick={() => {
          speechInputService.stopListening();
          ttsService.stop();
          onClose();
        }}
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div 
        id="ai-assistant-drawer" 
        role="dialog"
        aria-modal="true"
        aria-label="C-Vidya AI Assistant"
        className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:w-[400px] md:w-[440px] lg:w-[460px] xl:w-[480px] max-w-[100vw] h-full max-h-[100dvh] sm:h-[100dvh] bg-white sm:border-l border-slate-200 shadow-2xl z-50 flex flex-col justify-between font-sans text-slate-900 pb-[env(safe-area-inset-bottom,0px)] overflow-hidden"
      >
      
      {/* Drawer Header Block */}
      <div className="px-2.5 sm:px-4 py-2.5 sm:py-3.5 pt-[max(0.625rem,env(safe-area-inset-top,0.625rem))] sm:pt-3.5 bg-brand-navy-900 border-b border-brand-gold-500/20 flex justify-between items-center gap-1.5 sm:gap-2 relative shrink-0 z-20">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-gold-500/10 border border-brand-gold-400 flex items-center justify-center animate-pulse shrink-0">
            <Logo size={22} showText={false} className="shrink-0" />
          </div>
          <div className="min-w-0">
            <div className="font-display font-black text-xs min-[375px]:text-sm sm:text-base tracking-wider text-brand-gold-400 flex items-center gap-1 sm:gap-1.5 min-w-0">
              <span className="truncate">C-VIDYA AI</span>
              <span
                aria-live="polite"
                className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full border shrink-0 ${
                  voiceStatus === "listening"
                    ? "bg-rose-500/20 border-rose-400 text-rose-200 animate-pulse"
                    : voiceStatus === "processing"
                    ? "bg-amber-500/20 border-amber-400 text-amber-200"
                    : voiceStatus === "speaking"
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                    : "bg-slate-800 border-slate-700 text-slate-300"
                }`}
              >
                {voiceStatus === "listening"
                  ? "Listening..."
                  : voiceStatus === "processing"
                  ? "Processing..."
                  : voiceStatus === "speaking"
                  ? "Speaking..."
                  : "Idle"}
              </span>
            </div>
          </div>
        </div>

        <div ref={headerControlsRef} className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Male / Female Voice Pop-up Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowGenderPopup((prev) => !prev);
                setShowLangPopup(false);
              }}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-mono font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer transition-colors whitespace-nowrap"
              title="Select Male or Female Real Human Voice"
              aria-expanded={showGenderPopup}
              aria-haspopup="menu"
            >
              <span>{voiceGender === "female" ? "Female" : "Male"}</span>
              <ChevronDown className={`w-3 h-3 text-brand-gold-400 transition-transform ${showGenderPopup ? "rotate-180" : ""}`} />
            </button>

            {showGenderPopup && (
              <div
                role="menu"
                aria-label="Select Voice Gender"
                className="absolute right-0 mt-1.5 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs font-sans overflow-hidden"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectVoiceGender("female")}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                    voiceGender === "female"
                      ? "bg-brand-gold-500/20 text-brand-gold-400 font-bold"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <span>Female</span>
                  {voiceGender === "female" && <Check className="w-3.5 h-3.5 text-brand-gold-400" />}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectVoiceGender("male")}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                    voiceGender === "male"
                      ? "bg-brand-gold-500/20 text-brand-gold-400 font-bold"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <span>Male</span>
                  {voiceGender === "male" && <Check className="w-3.5 h-3.5 text-brand-gold-400" />}
                </button>
              </div>
            )}
          </div>

          {/* English / Hindi Language Pop-up Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLangPopup((prev) => !prev);
                setShowGenderPopup(false);
              }}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-mono font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-gold-400 border border-slate-700 cursor-pointer transition-colors whitespace-nowrap"
              title="Select Language (English, Hindi)"
              aria-expanded={showLangPopup}
              aria-haspopup="menu"
            >
              <span>{languageLabel}</span>
              <ChevronDown className={`w-3 h-3 text-brand-gold-400 transition-transform ${showLangPopup ? "rotate-180" : ""}`} />
            </button>

            {showLangPopup && (
              <div
                role="menu"
                aria-label="Select Language"
                className="absolute right-0 mt-1.5 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs font-sans overflow-hidden"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectLanguage("en")}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                    languageChoice === "en"
                      ? "bg-brand-gold-500/20 text-brand-gold-400 font-bold"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <span>English</span>
                  {languageChoice === "en" && <Check className="w-3.5 h-3.5 text-brand-gold-400" />}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectLanguage("hi")}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                    languageChoice === "hi"
                      ? "bg-brand-gold-500/20 text-brand-gold-400 font-bold"
                      : "text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <span>Hindi (हिंदी)</span>
                  {languageChoice === "hi" && <Check className="w-3.5 h-3.5 text-brand-gold-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Stop Speaking button when speaking */}
          {voiceStatus === "speaking" && (
            <button
              type="button"
              onClick={handleStopSpeaking}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-rose-600/20 hover:bg-rose-600/40 border border-rose-400/50 rounded-lg text-rose-200 transition-colors cursor-pointer shrink-0"
              title="Stop speaking"
              aria-label="Stop speaking"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Mute / Unmute TTS Toggle */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title={ttsMuted ? "Unmute voice responses" : "Mute voice responses"}
            aria-label={ttsMuted ? "Unmute voice responses" : "Mute voice responses"}
          >
            {ttsMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button 
            type="button"
            onClick={() => {
              speechInputService.stopListening();
              ttsService.stop();
              onClose();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close Assistant"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Decorative thin gold top line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-400 to-[#d69e2e]" />
      </div>

      {/* Main Dialogue Box Scroll Window (Starts Blank until User Sends or Speaks) */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3 sm:space-y-4 custom-scroll-panel bg-white">
        {/* Voice Error / Browser Compatibility Notice */}
        {voiceError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-2"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{voiceError}</span>
            </div>
            <button
              type="button"
              onClick={() => setVoiceError("")}
              className="text-amber-700 hover:text-amber-950 font-bold text-xs cursor-pointer"
              aria-label="Dismiss voice notice"
            >
              ×
            </button>
          </div>
        )}

        {/* Conversation Message List */}
        {messages.map((m) => {
          const isModel = m.role === "model" || m.role === "assistant";
          const displayContent = isModel ? formatCleanHumanReply(m.content) : m.content;
          return (
            <div 
              key={m.id} 
              className={`flex items-start gap-2 sm:gap-2.5 max-w-[92%] sm:max-w-[85%] ${
                isModel ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Profile Avatar */}
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-mono font-bold shadow-2xs ${
                isModel 
                  ? "bg-brand-navy-900 border-brand-gold-400/40 text-brand-gold-400" 
                  : "bg-brand-navy-900 border-brand-navy-800 text-white"
              }`}>
                {isModel ? <Logo size={18} showText={false} className="shrink-0" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Dialog Bubble */}
              <div className="space-y-1 min-w-0">
                <div className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed break-words shadow-2xs ${
                  isModel 
                    ? "bg-slate-100 text-slate-900 border border-slate-200/90 rounded-tl-none font-sans" 
                    : "bg-brand-navy-900 text-white font-medium rounded-tr-none"
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">
                    {displayContent}
                  </p>
                </div>
                <div className={`flex items-center gap-2 text-[9px] text-slate-400 font-mono ${
                  isModel ? "justify-start" : "justify-end"
                }`}>
                  <span>{m.timestamp}</span>
                  {isModel && ttsSupported && (
                    <button
                      type="button"
                      onClick={() => speakAssistantReply(m.content)}
                      className="text-blue-600 hover:underline cursor-pointer"
                      title="Listen in human voice"
                    >
                      Speak ({voiceGender === "female" ? "Female" : "Male"})
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-2 sm:gap-2.5 max-w-[92%] sm:max-w-[85%] mr-auto">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-navy-900 border border-brand-gold-400/40 text-brand-gold-400 flex items-center justify-center animate-bounce shrink-0">
              <Logo size={18} showText={false} className="shrink-0" />
            </div>
            <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-800 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-navy-900 rounded-full animate-ping" />
                <span className="font-mono text-[11px] text-brand-navy-950 font-bold">
                  Typing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Message & Voice Agent Control Bar */}
      <div className="p-2.5 sm:p-4 bg-brand-navy-900 border-t border-brand-gold-500/20 flex flex-col gap-2 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]">
        {voiceStatus === "listening" && interimTranscript && (
          <div className="text-[11px] font-mono text-brand-gold-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-brand-gold-500/30 truncate">
            🎙️ Listening ({languageLabel}): &ldquo;{interimTranscript}&rdquo;
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2 items-center w-full"
        >
          {/* Microphone Start / Stop Listening Button */}
          <button
            type="button"
            onClick={handleToggleListening}
            disabled={isTyping}
            className={`min-w-[44px] min-h-[44px] p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center justify-center ${
              voiceStatus === "listening"
                ? "bg-rose-600 hover:bg-rose-500 border-rose-400 text-white animate-pulse shadow-lg"
                : "bg-[#0d1524] hover:bg-slate-800 border-slate-700 text-brand-gold-400"
            }`}
            title={voiceStatus === "listening" ? "Stop voice listening" : "Start voice input (English, Hindi)"}
            aria-label={voiceStatus === "listening" ? "Stop voice listening" : "Start voice input"}
            aria-pressed={voiceStatus === "listening"}
          >
            {voiceStatus === "listening" ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask or speak in English or Hindi..."
            className="flex-1 min-w-0 text-[16px] sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#0d1524] border border-slate-700/80 rounded-xl focus:border-brand-gold-400 focus:ring-1 focus:ring-brand-gold-400 outline-none text-slate-100 placeholder-slate-500 font-medium shadow-inner min-h-[44px]"
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
      </div>

    </div>
    </>
  );
}


