// Reusable Text-to-Speech (TTS) Service for C Vidya Solutions AI Voice Agent
// Uses real human neural voices via /api/tts (Gemini TTS: Kore for Female, Puck for Male)
// with automatic fallback to enhanced browser neural voices across English, Hindi & Hinglish.

export type VoiceGender = "female" | "male";

export interface TtsCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export interface ITtsProvider {
  isSupported(): boolean;
  speak(text: string, preferredLang: "en-IN" | "hi-IN", callbacks?: TtsCallbacks, gender?: VoiceGender): void;
  stop(): void;
  isSpeaking(): boolean;
}

const FEMALE_VOICE_HINTS = [
  "swara", "neerja", "aria", "jenny", "sonia", "ava", "emma", "samantha", "karen",
  "moira", "tessa", "veena", "lekha", "heera", "kalpana", "priya", "ananya", "aditi",
  "raveena", "natasha", "clara", "hazel", "zira", "victoria", "susan", "linda",
  "catherine", "female", "woman", "girl", "google हिन्दी", "google uk english female",
  "google us english"
];

const MALE_VOICE_HINTS = [
  "madhur", "prabhat", "andrew", "brian", "guy", "christopher", "eric", "roger",
  "steffan", "ryan", "rishi", "daniel", "hemant", "rohit", "arjun", "kabir", "dev",
  "alex", "david", "mark", "george", "james", "richard", "fred", "male", "man", "boy",
  "google uk english male"
];

/**
 * Strips markdown symbols, URLs, and decorative bullet chars and converts them into
 * natural conversational phrasing so spoken output sounds like a real human.
 */
export function sanitizeTextForSpeech(rawText: string): string {
  return rawText
    .replace(/https?:\/\/(?:www\.)?cvidyasolutions\.com[^\s)]*/gi, "C Vidya Solutions dot com")
    .replace(/www\.cvidyasolutions\.com/gi, "C Vidya Solutions dot com")
    .replace(/https?:\/\/[^\s)]+/g, "our official link")
    .replace(/[`*_~#>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\b24\/7\b/g, "24 by 7")
    .replace(/<0\.8s/gi, "under 0.8 seconds")
    .replace(/<50ms/gi, "under 50 milliseconds")
    .replace(/\+91\s*/g, "+91 ")
    .replace(/[•▪▸►]/g, ". ")
    .replace(/[—–]/g, ", ")
    .replace(/[📦🤖⚡📞📧📍🏢👔🧾🚀👋🙏🇮🇳🎯💼🌐⏱️🚨📅📊👥🔒💡✅😊]/g, " ")
    .replace(/\n+/g, ". ")
    .replace(/\.\s*\./g, ".")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 900);
}

export function detectPreferredSpeechLocale(text: string): "hi-IN" | "en-IN" {
  // Detect Devanagari script range (\u0900-\u097F)
  if (/[\u0900-\u097F]/.test(text)) {
    return "hi-IN";
  }
  return "en-IN";
}

function classifyVoiceGender(voice: SpeechSynthesisVoice): VoiceGender | "unknown" {
  const n = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  if (/\bfemale\b/.test(n) || FEMALE_VOICE_HINTS.some((h) => n.includes(h))) {
    if (!/\bmale\b/.test(n)) return "female";
  }
  if (/\bmale\b/.test(n) || MALE_VOICE_HINTS.some((h) => n.includes(h))) {
    return "male";
  }
  return "unknown";
}

function selectBestHumanVoice(
  voices: SpeechSynthesisVoice[],
  targetLang: "en-IN" | "hi-IN",
  targetGender: VoiceGender
): { voice: SpeechSynthesisVoice | null; matchedGender: boolean } {
  if (!voices || voices.length === 0) {
    return { voice: null, matchedGender: false };
  }

  const langPrefix = targetLang.slice(0, 2).toLowerCase();
  const exactLang = targetLang.toLowerCase();

  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestScore = -999;
  let bestMatchedGender = false;

  for (const v of voices) {
    const vLang = (v.lang || "").toLowerCase();
    const vName = `${v.name} ${v.voiceURI}`.toLowerCase();

    let score = 0;

    // Language relevance
    if (vLang === exactLang) {
      score += 55;
    } else if (vLang.startsWith(langPrefix) && vLang.includes("in")) {
      score += 50;
    } else if (targetLang === "hi-IN" && vLang.includes("hi")) {
      score += 46;
    } else if (targetLang === "en-IN" && vLang.includes("in")) {
      score += 40;
    } else if (vLang.startsWith(langPrefix)) {
      score += 28;
    } else {
      continue;
    }

    // Strongly prefer ultra-realistic neural / natural / online human voices (ChatGPT-like clarity)
    if (vName.includes("natural") || vName.includes("neural") || vName.includes("multilingual")) {
      score += 45;
    } else if (vName.includes("online") || vName.includes("wavenet") || vName.includes("studio")) {
      score += 36;
    } else if (vName.includes("premium") || vName.includes("enhanced") || vName.includes("siri")) {
      score += 28;
    } else if (vName.includes("google") || vName.includes("microsoft")) {
      score += 18;
    }

    // Gender matching (Female vs Male)
    const detectedGender = classifyVoiceGender(v);
    const isGenderMatch = detectedGender === targetGender;
    if (isGenderMatch) {
      score += 50;
    } else if (detectedGender === "unknown") {
      score += 4;
    } else {
      score -= 45;
    }

    if (score > bestScore) {
      bestScore = score;
      bestVoice = v;
      bestMatchedGender = isGenderMatch;
    }
  }

  return { voice: bestVoice || voices[0] || null, matchedGender: bestMatchedGender };
}

/**
 * Prepares a concise, natural spoken conversational summary so the voice agent
 * begins speaking immediately and sounds like a live human conversation partner
 * rather than reading raw URLs or long bullet tables.
 */
function prepareConversationalSpeechScript(rawText: string): string {
  const withoutWorkerLinks = rawText
    .replace(/🔗[^\n]*/g, "")
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/₹\s*(\d+)/g, "$1 rupees");

  const cleaned = sanitizeTextForSpeech(withoutWorkerLinks);
  if (cleaned.length <= 340) return cleaned;

  const sliced = cleaned.slice(0, 340);
  const lastPeriod = Math.max(
    sliced.lastIndexOf(". "),
    sliced.lastIndexOf("। "),
    sliced.lastIndexOf("? "),
    sliced.lastIndexOf("! ")
  );
  if (lastPeriod > 120) {
    return sliced.slice(0, lastPeriod + 1).trim();
  }
  return sliced.trim();
}

class HumanHybridTtsProvider implements ITtsProvider {
  private speaking = false;
  private activeAudio: HTMLAudioElement | null = null;
  private activeAbortController: AbortController | null = null;
  private audioCache = new Map<string, string>();
  private serverTtsCooldownUntil = 0;

  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) || typeof Audio !== "undefined";
  }

  public isSpeaking(): boolean {
    if (!this.isSupported()) return false;
    const browserSpeaking = "speechSynthesis" in window ? window.speechSynthesis.speaking : false;
    return browserSpeaking || this.speaking;
  }

  private speakWithBrowserFallback(
    cleanSpeech: string,
    detectedLang: "en-IN" | "hi-IN",
    gender: VoiceGender,
    callbacks?: TtsCallbacks
  ): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.speaking = false;
      callbacks?.onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume?.();

      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      utterance.lang = detectedLang;

      const voices = window.speechSynthesis.getVoices?.() || [];
      const { voice: matchedVoice, matchedGender } = selectBestHumanVoice(voices, detectedLang, gender);

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      // Smooth, natural human conversational pace and vocal warmth
      if (gender === "female") {
        utterance.rate = 1.02;
        utterance.pitch = matchedGender ? 1.0 : 1.05;
      } else {
        utterance.rate = 1.01;
        utterance.pitch = matchedGender ? 0.98 : 0.92;
      }

      utterance.onstart = () => {
        this.speaking = true;
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        this.speaking = false;
        callbacks?.onEnd?.();
      };

      utterance.onerror = () => {
        this.speaking = false;
        callbacks?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      this.speaking = false;
      callbacks?.onError?.(err?.message || "Unable to play voice output.");
    }
  }

  public speak(
    text: string,
    preferredLang: "en-IN" | "hi-IN",
    callbacks?: TtsCallbacks,
    gender: VoiceGender = "female"
  ): void {
    if (!this.isSupported()) {
      callbacks?.onError?.("Text-to-speech playback is not supported in this browser.");
      return;
    }

    this.stop();

    const cleanSpeech = prepareConversationalSpeechScript(text);
    if (!cleanSpeech) {
      callbacks?.onEnd?.();
      return;
    }

    const detectedLang = detectPreferredSpeechLocale(text) === "hi-IN" ? "hi-IN" : preferredLang;
    const cacheKey = `${gender}:${detectedLang}:${cleanSpeech.slice(0, 300)}`;

    const playAudioUrl = (dataUrl: string) => {
      try {
        const audio = new Audio(dataUrl);
        audio.playbackRate = 1.03;
        this.activeAudio = audio;
        this.speaking = true;

        audio.onplay = () => {
          this.speaking = true;
          callbacks?.onStart?.();
        };

        audio.onended = () => {
          this.speaking = false;
          this.activeAudio = null;
          callbacks?.onEnd?.();
        };

        audio.onerror = () => {
          this.activeAudio = null;
          this.speakWithBrowserFallback(cleanSpeech, detectedLang, gender, callbacks);
        };

        audio.play().catch(() => {
          this.activeAudio = null;
          this.speakWithBrowserFallback(cleanSpeech, detectedLang, gender, callbacks);
        });
      } catch (_) {
        this.speakWithBrowserFallback(cleanSpeech, detectedLang, gender, callbacks);
      }
    };

    if (this.audioCache.has(cacheKey)) {
      playAudioUrl(this.audioCache.get(cacheKey)!);
      return;
    }

    const canUseServerTts =
      Date.now() >= this.serverTtsCooldownUntil &&
      typeof fetch === "function" &&
      typeof Audio !== "undefined";

    if (canUseServerTts) {
      const controller = new AbortController();
      this.activeAbortController = controller;
      const timeoutId = setTimeout(() => controller.abort(), 1450);

      this.speaking = true;
      callbacks?.onStart?.();

      fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanSpeech,
          gender,
          lang: detectedLang,
        }),
        signal: controller.signal,
      })
        .then(async (res) => {
          clearTimeout(timeoutId);
          if (res.status === 503) {
            this.serverTtsCooldownUntil = Date.now() + 60_000;
            throw new Error("Server TTS unconfigured");
          }
          if (!res.ok) {
            throw new Error("TTS API fallback");
          }
          const data = await res.json();
          if (data?.audioBase64) {
            const mime = data.mimeType || "audio/wav";
            const dataUrl = `data:${mime};base64,${data.audioBase64}`;
            this.audioCache.set(cacheKey, dataUrl);
            if (this.activeAbortController === controller) {
              this.activeAbortController = null;
              playAudioUrl(dataUrl);
            }
          } else {
            throw new Error("Empty audio payload");
          }
        })
        .catch(() => {
          clearTimeout(timeoutId);
          if (this.activeAbortController === controller) {
            this.activeAbortController = null;
            this.speakWithBrowserFallback(cleanSpeech, detectedLang, gender, callbacks);
          }
        });
      return;
    }

    this.speakWithBrowserFallback(cleanSpeech, detectedLang, gender, callbacks);
  }

  public stop(): void {
    if (this.activeAbortController) {
      try {
        this.activeAbortController.abort();
      } catch (_) {}
      this.activeAbortController = null;
    }
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (_) {}
      this.activeAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    this.speaking = false;
  }
}

class TtsService {
  private provider: ITtsProvider = new HumanHybridTtsProvider();
  private muted: boolean = false;
  private gender: VoiceGender = "female";

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.muted = localStorage.getItem("cvidya_voice_tts_muted") === "true";
        const savedGender = localStorage.getItem("cvidya_voice_gender");
        if (savedGender === "male" || savedGender === "female") {
          this.gender = savedGender;
        }
        // Pre-warm browser voice list
        if ("speechSynthesis" in window) {
          window.speechSynthesis.getVoices?.();
        }
      } catch (_) {}
    }
  }

  public setProvider(customProvider: ITtsProvider): void {
    this.provider.stop();
    this.provider = customProvider;
  }

  public isSupported(): boolean {
    return this.provider.isSupported();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stop();
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cvidya_voice_tts_muted", muted ? "true" : "false");
      } catch (_) {}
    }
  }

  public getVoiceGender(): VoiceGender {
    return this.gender;
  }

  public setVoiceGender(gender: VoiceGender): void {
    this.gender = gender;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cvidya_voice_gender", gender);
      } catch (_) {}
    }
  }

  public speak(
    text: string,
    preferredLang: "en-IN" | "hi-IN" = "en-IN",
    callbacks?: TtsCallbacks,
    genderOverride?: VoiceGender
  ): void {
    if (this.muted) {
      callbacks?.onEnd?.();
      return;
    }
    this.provider.speak(text, preferredLang, callbacks, genderOverride || this.gender);
  }

  public stop(): void {
    this.provider.stop();
  }

  public isSpeaking(): boolean {
    return this.provider.isSpeaking();
  }
}

export const ttsService = new TtsService();


