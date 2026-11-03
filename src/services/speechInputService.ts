// Reusable Speech Input Service for C Vidya Solutions AI Voice Agent
// Combines browser Web Speech API (SpeechRecognition / webkitSpeechRecognition)
// with automatic navigator.mediaDevices.getUserMedia + MediaRecorder + server-side Gemini
// audio transcription (/api/transcribe) fallback so microphone voice input works across
// all Android phones, Android tablets, iPhones, iPads, and desktop/laptop browsers.

export type SupportedVoiceLocale = "en-IN" | "hi-IN" | "en-US";

export interface SpeechInputCallbacks {
  onInterimResult?: (transcript: string) => void;
  onStatusHint?: (hint: string) => void;
  onFinalResult?: (transcript: string) => void;
  onStateChange?: (isListening: boolean) => void;
  onError?: (userFriendlyMessage: string, rawErrorCode?: string) => void;
}

export interface ISpeechInputProvider {
  isSupported(): boolean;
  startListening(locale: SupportedVoiceLocale, callbacks: SpeechInputCallbacks): void;
  finishListening?(): void;
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

function isMobileOrTabletDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua)) {
    return true;
  }
  // iPadOS 13+ reports MacIntel with multi-touch points
  if (navigator.platform === "MacIntel" && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1) {
    return true;
  }
  return false;
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
  private latestInterimText = "";
  private activeDispatchFinal: ((text: string) => void) | null = null;
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
   * Direct microphone capture using navigator.mediaDevices.getUserMedia + MediaRecorder + /api/transcribe.
   * Ensures that on all Android phones, Android tablets, iPhones, iPads, and deployed webviews where
   * Web Speech API is unavailable or restricted, the microphone captures audio and transcribes it into text.
   */
  private async startServerMediaRecorderFallback(
    locale: SupportedVoiceLocale,
    callbacks: SpeechInputCallbacks,
    currentSessionId: number
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

    const w = window as any;

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch {
        // Fallback to simple { audio: true } for mobile browsers/tablets that reject audio constraint objects
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (currentSessionId !== this.sessionId) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      if (typeof MediaRecorder === "undefined") {
        stream.getTracks().forEach((t) => t.stop());
        this.listening = false;
        callbacks.onStateChange?.(false);
        callbacks.onError?.(
          "Voice recording is not supported in this browser. Please use Chrome, Safari, or Edge.",
          "unsupported"
        );
        return;
      }

      this.mediaStream = stream;
      this.listening = true;
      callbacks.onStateChange?.(true);
      callbacks.onStatusHint?.(
        locale === "hi-IN" ? "सुन रहे हैं... कृपया बोलिए" : "Listening... Speak now"
      );

      // Select best supported audio container across Android (webm/opus) and iOS/iPadOS Safari (mp4/aac)
      const preferredMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/aac",
        "audio/ogg;codecs=opus",
      ];
      let selectedMimeType = "";
      for (const candidate of preferredMimeTypes) {
        try {
          if (typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(candidate)) {
            selectedMimeType = candidate;
            break;
          }
        } catch (_) {}
      }

      let recorder: MediaRecorder;
      try {
        recorder = selectedMimeType
          ? new MediaRecorder(stream, { mimeType: selectedMimeType })
          : new MediaRecorder(stream);
      } catch {
        recorder = new MediaRecorder(stream);
      }
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
            "No speech was detected. Please tap the microphone and speak clearly in English or Hindi.",
            "no-speech"
          );
          return;
        }

        const audioBlob = new Blob(chunks, { type: mimeType });
        if (audioBlob.size < 250) {
          callbacks.onError?.(
            "No speech was detected. Please tap the microphone and speak clearly in English or Hindi.",
            "no-speech"
          );
          return;
        }

        try {
          callbacks.onStatusHint?.(
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
            callbacks.onInterimResult?.(transcript);
            callbacks.onFinalResult?.(transcript);
          } else {
            callbacks.onError?.(
              "No speech was detected. Please tap the microphone and speak clearly in English or Hindi.",
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

      try {
        recorder.start(250);
      } catch {
        recorder.start();
      }

      // Automatic Voice Activity & Silence Detection (VAD) compatible with Android, iPhone & iPad
      try {
        const AudioCtx = w.AudioContext || w.webkitAudioContext;
        if (AudioCtx) {
          const audioCtx: AudioContext = new AudioCtx();
          this.audioContext = audioCtx;
          if (audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => {});
          }
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);

          const freqArray = new Uint8Array(analyser.frequencyBinCount);
          const timeArray = new Uint8Array(analyser.fftSize);
          let hasSpoken = false;
          let silenceStart = 0;
          const recordingStartTime = Date.now();

          this.vadInterval = setInterval(() => {
            if (currentSessionId !== this.sessionId || !this.mediaRecorder || this.mediaRecorder.state !== "recording") {
              return;
            }
            if (audioCtx.state === "suspended") {
              audioCtx.resume().catch(() => {});
            }

            analyser.getByteFrequencyData(freqArray);
            let freqSum = 0;
            for (let i = 0; i < freqArray.length; i++) {
              freqSum += freqArray[i];
            }
            const avgFreq = freqSum / freqArray.length;

            analyser.getByteTimeDomainData(timeArray);
            let peakDeviation = 0;
            for (let i = 0; i < timeArray.length; i++) {
              const dev = Math.abs(timeArray[i] - 128);
              if (dev > peakDeviation) peakDeviation = dev;
            }

            // Detect speech across both desktop and mobile microphone gains
            const isSpeakingNow = avgFreq > 11 || peakDeviation > 14;

            if (isSpeakingNow) {
              hasSpoken = true;
              silenceStart = 0;
            } else if (hasSpoken) {
              if (!silenceStart) {
                silenceStart = Date.now();
              } else if (Date.now() - silenceStart > 1150) {
                // User finished speaking and paused for 1.15s -> auto-finalize and transcribe
                if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
                  try {
                    this.mediaRecorder.requestData?.();
                  } catch (_) {}
                  this.mediaRecorder.stop();
                }
              }
            } else if (Date.now() - recordingStartTime > 5500) {
              // 5.5 seconds of complete silence
              if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
                try {
                  this.mediaRecorder.requestData?.();
                } catch (_) {}
                this.mediaRecorder.stop();
              }
            }
          }, 110);
        }
      } catch (_) {
        // If AudioContext VAD is unavailable, rely on maxRecordTimer or user tapping mic button
      }

      // Maximum 8.5 seconds per voice turn
      this.maxRecordTimer = setTimeout(() => {
        if (currentSessionId === this.sessionId && this.mediaRecorder && this.mediaRecorder.state === "recording") {
          try {
            this.mediaRecorder.requestData?.();
            this.mediaRecorder.stop();
          } catch (_) {}
        }
      }, 8500);
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
          "Microphone permission is blocked in your browser settings. Tap the lock/settings icon in your browser address bar, set Microphone to 'Allow', and tap the mic button again.",
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
      this.startServerMediaRecorderFallback(locale, callbacks, currentSessionId);
      return;
    }

    const isMobile = isMobileOrTabletDevice();

    try {
      const recognition = new SpeechRecognitionCtor();

      // On iOS/iPadOS Safari, "en-US" has broader built-in dictation support than "en-IN"
      const isIOS =
        typeof navigator !== "undefined" &&
        (/iPhone|iPad|iPod/i.test(navigator.userAgent || "") ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
      const effectiveRecLang =
        locale === "hi-IN" ? "hi-IN" : isIOS ? "en-US" : locale || "en-IN";

      recognition.lang = effectiveRecLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalTranscriptAccumulated = "";
      let latestCombinedTranscript = "";
      let hasDispatchedFinal = false;
      let hasFallenBackToMediaRecorder = false;
      const recognitionStartTime = Date.now();

      this.latestInterimText = "";

      const isStale = () =>
        currentSessionId !== this.sessionId || hasDispatchedFinal || hasFallenBackToMediaRecorder;

      const dispatchFinalOnce = (rawText: string) => {
        if (isStale()) return;
        const normalized = normalizeSpokenCvidyaText(rawText).trim();
        if (!normalized) return;
        hasDispatchedFinal = true;
        this.activeDispatchFinal = null;
        this.latestInterimText = "";
        this.clearSilenceTimer();
        this.listening = false;
        if (this.recognition === recognition) {
          this.recognition = null;
        }
        this.detachAndStopRecognition(recognition);
        callbacks.onStateChange?.(false);
        callbacks.onFinalResult?.(normalized);
      };

      this.activeDispatchFinal = dispatchFinalOnce;

      recognition.onstart = () => {
        if (isStale()) return;
        this.listening = true;
        callbacks.onStateChange?.(true);
        callbacks.onStatusHint?.(
          locale === "hi-IN" ? "सुन रहे हैं... कृपया बोलिए" : "Listening... Speak now"
        );
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
        if (combined) {
          latestCombinedTranscript = combined;
          this.latestInterimText = combined;
          callbacks.onInterimResult?.(combined);
        }

        if (finalTranscriptAccumulated.trim()) {
          dispatchFinalOnce(finalTranscriptAccumulated.trim());
        } else if (combined) {
          // Give mobile/tablet users 1250ms between spoken words (750ms on desktop) so mobile dictation never cuts off mid-sentence
          const pauseMs = isMobile ? 1250 : 750;
          this.clearSilenceTimer();
          this.silenceTimer = setTimeout(() => {
            if (!isStale() && this.listening && latestCombinedTranscript.trim()) {
              dispatchFinalOnce(latestCombinedTranscript.trim());
            }
          }, pauseMs);
        }
      };

      recognition.onerror = (event: any) => {
        if (isStale()) return;
        this.clearSilenceTimer();
        this.activeDispatchFinal = null;
        const code = String(event?.error || "unknown").toLowerCase();
        if (this.recognition === recognition) {
          this.recognition = null;
        }
        this.detachAndStopRecognition(recognition);

        // If user already spoke interim words before an error/cutoff, finalize those words immediately
        if (latestCombinedTranscript.trim()) {
          dispatchFinalOnce(latestCombinedTranscript.trim());
          return;
        }

        // On mobile/tablet or desktop, if Web Speech API fails with permission/service/network/device/language error,
        // automatically switch to getUserMedia + MediaRecorder + /api/transcribe!
        const elapsedMs = Date.now() - recognitionStartTime;
        if (
          canFallbackToGetUserMedia &&
          (code === "not-allowed" ||
            code === "service-not-allowed" ||
            code === "network" ||
            code === "language-not-supported" ||
            code === "audio-capture" ||
            code === "aborted" ||
            (code === "no-speech" && elapsedMs < 1500))
        ) {
          hasFallenBackToMediaRecorder = true;
          this.startServerMediaRecorderFallback(locale, callbacks, currentSessionId);
          return;
        }

        this.listening = false;
        callbacks.onStateChange?.(false);

        if (code === "not-allowed" || code === "service-not-allowed") {
          callbacks.onError?.(
            "Microphone permission is blocked in your browser settings. Tap the lock/settings icon in your browser address bar, set Microphone to 'Allow', and tap the mic button again.",
            code
          );
        } else if (code === "no-speech") {
          callbacks.onError?.(
            "No speech was detected. Please tap the microphone and speak clearly in English or Hindi.",
            code
          );
        } else if (code === "audio-capture") {
          callbacks.onError?.(
            "No microphone was found on this device. Please connect a microphone or use text chat.",
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
        this.activeDispatchFinal = null;
        if (this.recognition === recognition) {
          this.recognition = null;
        }

        if (latestCombinedTranscript.trim()) {
          dispatchFinalOnce(latestCombinedTranscript.trim());
          return;
        }

        // CRITICAL MOBILE/TABLET FIX:
        // On Android phones, tablets, iPhones, and iPads, webkitSpeechRecognition often terminates
        // within <1500ms via `onend` without firing `onerror` when native dictation is unavailable in the webview/browser.
        // Automatically switch to MediaRecorder + /api/transcribe so the mic works seamlessly!
        const elapsedMs = Date.now() - recognitionStartTime;
        if (canFallbackToGetUserMedia && elapsedMs < 1500) {
          hasFallenBackToMediaRecorder = true;
          this.startServerMediaRecorderFallback(locale, callbacks, currentSessionId);
          return;
        }

        this.listening = false;
        callbacks.onStateChange?.(false);
      };

      this.recognition = recognition;
      recognition.start();
    } catch (_) {
      this.clearSilenceTimer();
      this.activeDispatchFinal = null;
      if (canFallbackToGetUserMedia) {
        this.startServerMediaRecorderFallback(locale, callbacks, currentSessionId);
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
        "Voice input is not supported in this browser. Please use Chrome, Safari, or Edge, or continue using text chat.",
        "unsupported"
      );
      return;
    }

    this.stopListening();
    const currentSessionId = ++this.sessionId;
    this.startWebSpeechRecognition(locale, callbacks, currentSessionId, true);
  }

  /**
   * Gracefully finishes the current listening session when the user taps the Mic button a second time:
   * - If MediaRecorder is recording on mobile/tablet, stops the recorder so `recorder.onstop` transcribes and sends the audio.
   * - If Web SpeechRecognition has interim text, dispatches it immediately; otherwise stops recognition gracefully so it emits final results.
   */
  public finishListening(): void {
    this.clearSilenceTimer();

    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      if (this.vadInterval) {
        clearInterval(this.vadInterval);
        this.vadInterval = null;
      }
      if (this.maxRecordTimer) {
        clearTimeout(this.maxRecordTimer);
        this.maxRecordTimer = null;
      }
      try {
        this.mediaRecorder.requestData?.();
        this.mediaRecorder.stop();
      } catch (_) {
        this.stopListening();
      }
      return;
    }

    if (this.latestInterimText.trim() && this.activeDispatchFinal) {
      this.activeDispatchFinal(this.latestInterimText.trim());
      return;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
        return;
      } catch (_) {}
    }

    this.stopListening();
  }

  public stopListening(): void {
    this.sessionId++;
    this.latestInterimText = "";
    this.activeDispatchFinal = null;
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

  public finishListening(): void {
    if (typeof this.provider.finishListening === "function") {
      this.provider.finishListening();
    } else {
      this.provider.stopListening();
    }
  }

  public stopListening(): void {
    this.provider.stopListening();
  }

  public getIsListening(): boolean {
    return this.provider.getIsListening();
  }
}

export const speechInputService = new SpeechInputService();
