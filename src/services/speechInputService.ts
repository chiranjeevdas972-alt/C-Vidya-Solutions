// Reusable Speech Input Service for C Vidya Solutions AI Voice Agent
// Combines browser Web Speech API (SpeechRecognition / webkitSpeechRecognition)
// with automatic navigator.mediaDevices.getUserMedia permission priming and
// server-side Gemini audio transcription (/api/transcribe) fallback so voice input
// works reliably across desktop, mobile, and deployed production environments.

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
 * (such as "see with the solution", "see vidya", "sea vidya", "si vidya", "sevidya", "c vidhya")
 * so spoken queries are cleanly written into the chatbot input box and understood.
 */
export function normalizeSpokenCvidyaText(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/\bsee\s+with\s+the\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bsee\s+with\s+a\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bsee\s+with\s+the\b/gi, "C Vidya")
    .replace(/\b(?:see|sea|si|sri|shri|se)\s*vid(?:ya|hya)\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\b(?:see|sea|si|sri|shri|se)\s*vid(?:ya|hya)\b/gi, "C Vidya")
    .replace(/\bc\s*vid(?:ya|hya)\s+solutions?\b/gi, "C Vidya Solutions")
    .replace(/\bc\s*vid(?:ya|hya)\b/gi, "C Vidya")
    .replace(/सी\s*विध्या/g, "सी विद्या")
    .replace(/से\s*विद्या/g, "सी विद्या");
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const commaIdx = result.indexOf(",");
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error("Failed to read recorded audio"));
    reader.readAsDataURL(blob);
  });
}

class BrowserSpeechInputProvider implements ISpeechInputProvider {
  private recognition: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private vadInterval: any = null;
  private maxRecordTimer: any = null;
  private listening = false;
  private silenceTimer: any = null;
  private sessionId = 0;

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private clearMediaRecorderResources(): void {
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
    if (this.maxRecordTimer) {
      clearTimeout(this.maxRecordTimer);
      this.maxRecordTimer = null;
    }
    if (this.mediaRecorder) {
      try {
        if (this.mediaRecorder.state !== "inactive") {
          this.mediaRecorder.stop();
        }
      } catch (_) {}
      this.mediaRecorder = null;
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      } catch (_) {}
      this.mediaStream = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (_) {}
      this.audioContext = null;
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
    const hasWebSpeech = Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
    const hasMediaRecorder = Boolean(
      typeof navigator !== "undefined" &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function" &&
        typeof w.MediaRecorder !== "undefined"
    );
    return hasWebSpeech || hasMediaRecorder;
  }

  public getIsListening(): boolean {
    return this.listening;
  }

  /**
   * Fallback & permission-priming path using navigator.mediaDevices.getUserMedia + MediaRecorder + /api/transcribe.
   * Ensures that after deployment, even if Web Speech API fails with `not-allowed`, `service-not-allowed`, or `network`,
   * the browser explicitly requests microphone access and transcribes audio via the server.
   */
  private async startServerMediaRecorderFallback(
    locale: SupportedVoiceLocale,
    callbacks: SpeechInputCallbacks,
    currentSessionId: number,
    allowWebSpeechRetryAfterGrant: boolean
  ): Promise<void> {
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      this.listening = false;
      callbacks.onStateChange?.(false);
      callbacks.onError?.(
        "Microphone access is not available in this browser context. Please ensure you are visiting over HTTPS and allow microphone access.",
        "not-allowed"
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (currentSessionId !== this.sessionId) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      // If Web Speech API is supported and only failed because permission wasn't granted yet,
      // release the priming stream and start Web Speech API now that permission is granted!
      const w = window as any;
      const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (allowWebSpeechRetryAfterGrant && SpeechRecognitionCtor) {
        stream.getTracks().forEach((t) => t.stop());
        this.startWebSpeechRecognition(locale, callbacks, currentSessionId, false);
        return;
      }

      if (typeof MediaRecorder === "undefined") {
        stream.getTracks().forEach((t) => t.stop());
        this.listening = false;
        callbacks.onStateChange?.(false);
        callbacks.onError?.(
          "Voice recording is not supported in this browser. Please use Chrome, Edge, or Safari.",
          "unsupported"
        );
        return;
      }

      this.mediaStream = stream;
      this.listening = true;
      callbacks.onStateChange?.(true);
      callbacks.onInterimResult?.(
        locale === "hi-IN" ? "सुन रहे हैं... कृपया बोलिए" : "Listening... Speak now"
      );

      const preferredMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      let selectedMimeType = "";
      for (const candidate of preferredMimeTypes) {
        if (typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(candidate)) {
          selectedMimeType = candidate;
          break;
        }
      }

      const recorder = selectedMimeType
        ? new MediaRecorder(stream, { mimeType: selectedMimeType })
        : new MediaRecorder(stream);
      this.mediaRecorder = recorder;

      const chunks: BlobPart[] = [];
      let hasTranscribed = false;

      recorder.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) {
          chunks.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        if (hasTranscribed || currentSessionId !== this.sessionId) return;
        hasTranscribed = true;

        const mimeType = (recorder.mimeType || selectedMimeType || "audio/webm").split(";")[0];
        this.clearMediaRecorderResources();
        this.listening = false;
        callbacks.onStateChange?.(false);

        if (chunks.length === 0) {
          callbacks.onError?.(
            "No speech was detected. Please click the microphone and speak clearly in English or Hindi.",
            "no-speech"
          );
          return;
        }

        const audioBlob = new Blob(chunks, { type: mimeType });
        if (audioBlob.size < 400) {
          callbacks.onError?.(
            "No speech was detected. Please click the microphone and speak clearly in English or Hindi.",
            "no-speech"
          );
          return;
        }

        try {
          callbacks.onInterimResult?.(
            locale === "hi-IN" ? "आवाज़ प्रोसेस हो रही है..." : "Processing voice..."
          );
          const audioBase64 = await blobToBase64(audioBlob);
          const response = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audioBase64,
              mimeType,
              lang: locale,
              locale,
            }),
          });

          if (!response.ok) {
            throw new Error(`Transcription status ${response.status}`);
          }

          const data = await response.json();
          const transcript = normalizeSpokenCvidyaText(String(data?.transcript || data?.text || "")).trim();
          if (transcript) {
            callbacks.onFinalResult?.(transcript);
          } else {
            callbacks.onError?.(
              "No speech was detected. Please click the microphone and speak clearly in English or Hindi.",
              "no-speech"
            );
          }
        } catch (err: any) {
          callbacks.onError?.(
            "Could not process voice input on the server. Please try again or type your message below.",
            err?.message || "transcribe_failed"
          );
        }
      };

      recorder.start(200);

      // Set up automatic voice activity & silence detection using Web Audio API
      try {
        const AudioCtx = w.AudioContext || w.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx: AudioContext = new AudioCtx();
          this.audioContext = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let hasSpoken = false;
          let silenceStart = 0;
          const recordingStartTime = Date.now();

          this.vadInterval = setInterval(() => {
            if (currentSessionId !== this.sessionId || !this.mediaRecorder || this.mediaRecorder.state !== "recording") {
              return;
            }
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avgVolume = sum / dataArray.length;

            if (avgVolume > 14) {
              hasSpoken = true;
              silenceStart = 0;
            } else if (hasSpoken) {
              if (!silenceStart) {
                silenceStart = Date.now();
              } else if (Date.now() - silenceStart > 1100) {
                // User finished speaking and paused for 1.1s -> auto-finalize
                if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
                  this.mediaRecorder.stop();
                }
              }
            } else if (Date.now() - recordingStartTime > 5000) {
              // 5 seconds of complete silence
              if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
                this.mediaRecorder.stop();
              }
            }
          }, 120);
        }
      } catch (_) {
        // If AudioContext VAD is unavailable, rely on maxRecordTimer or manual stop
      }

      // Maximum 9 seconds per voice turn
      this.maxRecordTimer = setTimeout(() => {
        if (currentSessionId === this.sessionId && this.mediaRecorder && this.mediaRecorder.state === "recording") {
          try {
            this.mediaRecorder.stop();
          } catch (_) {}
        }
      }, 9000);
    } catch (err: any) {
      this.clearMediaRecorderResources();
      this.listening = false;
      callbacks.onStateChange?.(false);

      const errName = String(err?.name || "").toLowerCase();
      if (errName.includes("notfound") || errName.includes("devicesnotfound")) {
        callbacks.onError?.(
          "No microphone was found on this device. Please connect a microphone or use text chat.",
          "audio-capture"
        );
      } else {
        callbacks.onError?.(
          "Microphone permission is blocked in your browser settings. Click the lock/tune icon on the left of your browser address bar, set Microphone to 'Allow', and click the mic button again.",
          "not-allowed"
        );
      }
    }
  }

  private startWebSpeechRecognition(
    locale: SupportedVoiceLocale,
    callbacks: SpeechInputCallbacks,
    currentSessionId: number,
    canFallbackToGetUserMedia: boolean
  ): void {
    const w = window as any;
    const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      this.startServerMediaRecorderFallback(locale, callbacks, currentSessionId, false);
      return;
    }

    try {
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
          // Auto-finalize after 550ms pause if browser only emitted interim results for instant response
          this.clearSilenceTimer();
          this.silenceTimer = setTimeout(() => {
            if (!isStale() && this.listening && latestCombinedTranscript.trim()) {
              dispatchFinalOnce(latestCombinedTranscript.trim());
            }
          }, 550);
        }
      };

      recognition.onerror = (event: any) => {
        if (isStale()) return;
        this.clearSilenceTimer();
        const code = String(event?.error || "unknown");
        if (this.recognition === recognition) {
          this.recognition = null;
        }
        this.detachAndStopRecognition(recognition);

        // If user already spoke interim words before an error/cutoff, finalize those words
        if (latestCombinedTranscript.trim()) {
          dispatchFinalOnce(latestCombinedTranscript.trim());
          return;
        }

        // If Web Speech API returned not-allowed, service-not-allowed, or network error,
        // automatically prime permission with getUserMedia and fall back to server audio transcription!
        if (
          canFallbackToGetUserMedia &&
          (code === "not-allowed" || code === "service-not-allowed" || code === "network")
        ) {
          const shouldRetryWebSpeech = code === "not-allowed";
          this.startServerMediaRecorderFallback(
            locale,
            callbacks,
            currentSessionId,
            shouldRetryWebSpeech
          );
          return;
        }

        this.listening = false;
        callbacks.onStateChange?.(false);

        if (code === "not-allowed" || code === "service-not-allowed") {
          callbacks.onError?.(
            "Microphone permission is blocked in your browser settings. Click the lock/tune icon on the left of your browser address bar, set Microphone to 'Allow', and click the mic button again.",
            code
          );
        } else if (code === "no-speech") {
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
          // Fall back to server MediaRecorder if network error occurs on Web Speech
          this.startServerMediaRecorderFallback(locale, callbacks, currentSessionId, false);
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
    } catch (_) {
      this.clearSilenceTimer();
      if (canFallbackToGetUserMedia) {
        this.startServerMediaRecorderFallback(locale, callbacks, currentSessionId, false);
      } else {
        this.listening = false;
        callbacks.onStateChange?.(false);
        callbacks.onError?.(
          "Unable to start microphone listening in this browser environment. Text chat remains available.",
          "start_failed"
        );
      }
    }
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
    this.startWebSpeechRecognition(locale, callbacks, currentSessionId, true);
  }

  public stopListening(): void {
    this.sessionId++;
    this.clearSilenceTimer();
    if (this.recognition) {
      const rec = this.recognition;
      this.recognition = null;
      this.detachAndStopRecognition(rec);
    }
    this.clearMediaRecorderResources();
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
