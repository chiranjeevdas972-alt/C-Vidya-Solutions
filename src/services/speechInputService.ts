// Reusable Speech Input Service for C Vidya Solutions AI Voice Agent
// Uses supported browser Web Speech APIs (SpeechRecognition / webkitSpeechRecognition)
// while providing a clean provider interface so a dedicated real-time voice provider can be integrated later.

export type SupportedVoiceLocale = "en-IN" | "hi-IN" | "en-US";

export interface SpeechInputCallbacks {
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onStateChange?: (isListening: boolean) => void;
  onError?: (userFriendlyMessage: string, rawErrorCode?: string) => void;
}

export interface ISpeechInputProvider {
  isSupported(): boolean;
  startListening(locale: SupportedVoiceLocale, callbacks: SpeechInputCallbacks): void;
  stopListening(): void;
  getIsListening(): boolean;
}

/**
 * Normalizes common speech-to-text phonetic misrecognitions of "C Vidya Solutions"
 * (such as "see with the solution", "see vidya", "sea vidya", "si vidya", "c vidhya")
 * so spoken queries are cleanly written into the chatbot input box and understood.
 */
export function normalizeSpokenCvidyaText(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/\bsee\s+with\s+the\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bsee\s+with\s+a\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bsee\s+with\s+the\b/gi, "C Vidya")
    .replace(/\b(?:see|sea|si|sri|shri)\s+vid(?:ya|hya)\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\b(?:see|sea|si|sri|shri)\s+vid(?:ya|hya)\b/gi, "C Vidya")
    .replace(/\bc\s*vid(?:ya|hya)\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bc\s*vid(?:ya|hya)\b/gi, "C Vidya")
    .replace(/सी\s*विध्या/g, "सी विद्या");
}

class BrowserSpeechInputProvider implements ISpeechInputProvider {
  private recognition: any = null;
  private listening = false;
  private silenceTimer: any = null;
  private sessionId = 0;

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private detachAndStopRecognition(rec: any): void {
    if (!rec) return;
    try {
      rec.onstart = null;
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
    } catch (_) {}
    try {
      rec.abort();
    } catch (_) {}
    try {
      rec.stop();
    } catch (_) {}
  }

  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    const w = window as any;
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  }

  public getIsListening(): boolean {
    return this.listening;
  }

  public startListening(locale: SupportedVoiceLocale, callbacks: SpeechInputCallbacks): void {
    if (!this.isSupported()) {
      callbacks.onError?.(
        "Voice input is not supported in this browser. Please use Chrome, Edge, or Safari, or continue using text chat.",
        "unsupported"
      );
      return;
    }

    this.stopListening();
    const currentSessionId = ++this.sessionId;

    try {
      const w = window as any;
      const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionCtor();

      recognition.lang = locale || "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalTranscriptAccumulated = "";
      let latestCombinedTranscript = "";
      let hasDispatchedFinal = false;

      const isStale = () => currentSessionId !== this.sessionId || hasDispatchedFinal;

      const dispatchFinalOnce = (rawText: string) => {
        if (isStale()) return;
        const normalized = normalizeSpokenCvidyaText(rawText).trim();
        if (!normalized) return;
        hasDispatchedFinal = true;
        this.clearSilenceTimer();
        this.listening = false;
        if (this.recognition === recognition) {
          this.recognition = null;
        }
        this.detachAndStopRecognition(recognition);
        callbacks.onStateChange?.(false);
        callbacks.onFinalResult?.(normalized);
      };

      recognition.onstart = () => {
        if (isStale()) return;
        this.listening = true;
        callbacks.onStateChange?.(true);
      };

      recognition.onresult = (event: any) => {
        if (isStale() || !this.listening) return;
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result?.[0]?.transcript || "";
          if (result.isFinal) {
            finalTranscriptAccumulated += text + " ";
          } else {
            interim += text;
          }
        }
        const combined = normalizeSpokenCvidyaText(
          (finalTranscriptAccumulated + interim).trim()
        );
        if (combined && !finalTranscriptAccumulated.trim()) {
          latestCombinedTranscript = combined;
          callbacks.onInterimResult?.(combined);
        } else if (combined) {
          latestCombinedTranscript = combined;
        }

        if (finalTranscriptAccumulated.trim()) {
          dispatchFinalOnce(finalTranscriptAccumulated.trim());
        } else if (combined) {
          // Auto-finalize after 500ms pause if browser only emitted interim results for instant response
          this.clearSilenceTimer();
          this.silenceTimer = setTimeout(() => {
            if (!isStale() && this.listening && latestCombinedTranscript.trim()) {
              dispatchFinalOnce(latestCombinedTranscript.trim());
            }
          }, 500);
        }
      };

      recognition.onerror = (event: any) => {
        if (isStale()) return;
        this.clearSilenceTimer();
        const code = String(event?.error || "unknown");
        this.listening = false;
        if (this.recognition === recognition) {
          this.recognition = null;
        }
        this.detachAndStopRecognition(recognition);
        callbacks.onStateChange?.(false);

        if (code === "not-allowed" || code === "service-not-allowed") {
          callbacks.onError?.(
            "Microphone permission was denied. Please allow microphone access in your browser address bar to use voice input.",
            code
          );
        } else if (code === "no-speech") {
          if (latestCombinedTranscript.trim()) {
            dispatchFinalOnce(latestCombinedTranscript.trim());
            return;
          }
          callbacks.onError?.(
            "No speech was detected. Please click the microphone and speak clearly in English or Hindi.",
            code
          );
        } else if (code === "audio-capture") {
          callbacks.onError?.(
            "No microphone was found on this device. Please connect a microphone or use text chat.",
            code
          );
        } else if (code === "network") {
          callbacks.onError?.(
            "Browser speech recognition encountered a network issue. Text chat remains fully operational.",
            code
          );
        } else if (code !== "aborted") {
          callbacks.onError?.(
            "Could not capture voice input. Please try again or type your message below.",
            code
          );
        }
      };

      recognition.onend = () => {
        if (isStale()) return;
        this.clearSilenceTimer();
        this.listening = false;
        if (this.recognition === recognition) {
          this.recognition = null;
        }
        callbacks.onStateChange?.(false);
        if (latestCombinedTranscript.trim()) {
          dispatchFinalOnce(latestCombinedTranscript.trim());
        }
      };

      this.recognition = recognition;
      recognition.start();
    } catch (err: any) {
      this.clearSilenceTimer();
      this.listening = false;
      callbacks.onStateChange?.(false);
      callbacks.onError?.(
        "Unable to start microphone listening in this browser environment. Text chat remains available.",
        err?.message || "start_failed"
      );
    }
  }

  public stopListening(): void {
    this.sessionId++;
    this.clearSilenceTimer();
    if (this.recognition) {
      const rec = this.recognition;
      this.recognition = null;
      this.detachAndStopRecognition(rec);
    }
    this.listening = false;
  }
}

// Singleton service instance with pluggable provider support
class SpeechInputService {
  private provider: ISpeechInputProvider = new BrowserSpeechInputProvider();

  public setProvider(customProvider: ISpeechInputProvider): void {
    this.provider.stopListening();
    this.provider = customProvider;
  }

  public isSupported(): boolean {
    return this.provider.isSupported();
  }

  public startListening(locale: SupportedVoiceLocale, callbacks: SpeechInputCallbacks): void {
    this.provider.startListening(locale, callbacks);
  }

  public stopListening(): void {
    this.provider.stopListening();
  }

  public getIsListening(): boolean {
    return this.provider.getIsListening();
  }
}

export const speechInputService = new SpeechInputService();
