// Reusable Text-to-Speech (TTS) Service for C Vidya Solutions AI Voice Agent
// Combines instant browser neural voices (Hindi hi-IN & English en-IN, Male & Female)
// with automatic Gemini TTS (/api/tts: Puck for Male, Kore for Female) via unlocked Web Audio API
// and phonetic Hindi fallback so the AI ALWAYS speaks out loud on every desktop and mobile device.

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
  unlockAudio?(): void;
}

const FEMALE_VOICE_HINTS = [
  "swara", "neerja", "aria", "jenny", "sonia", "ava", "emma", "samantha", "karen",
  "moira", "tessa", "veena", "lekha", "kiyara", "isha", "sangeeta", "heera", "kalpana",
  "priya", "ananya", "aditi", "raveena", "kavya", "divya", "natasha", "clara", "hazel",
  "zira", "victoria", "susan", "linda", "catherine", "serena", "allison", "nicky", "siri female",
  "google uk english female", "google us english", "wavenet-a", "wavenet-d", "wavenet-c", "wavenet-e", "wavenet-f",
  "standard-a", "standard-d", "neural2-a", "neural2-c", "neural2-d", "neural2-e", "neural2-f",
  "hia-local", "hia-network", "hic-local", "hic-network", "hif-local", "hif-network",
  "ena-local", "ena-network", "enc-local", "enc-network", "enf-local", "enf-network",
  "sfg-local", "sfg-network", "iob-local", "iob-network",
  "female", "woman", "girl"
];

const MALE_VOICE_HINTS = [
  "madhur", "prabhat", "hemant", "ravi", "rishi", "neel", "andrew", "brian", "guy",
  "christopher", "eric", "roger", "steffan", "ryan", "daniel", "rohit", "arjun",
  "kabir", "dev", "amit", "raj", "alex", "david", "mark", "george", "james", "richard",
  "fred", "tom", "aaron", "arthur", "oliver", "reed", "evan", "siri male", "google uk english male",
  "wavenet-b", "wavenet-c", "wavenet-d", "wavenet-i", "wavenet-j",
  "standard-b", "standard-c", "neural2-b", "neural2-d", "neural2-i", "neural2-j",
  "hib-local", "hib-network", "hid-local", "hid-network", "hie-local", "hie-network",
  "enb-local", "enb-network", "end-local", "end-network", "ene-local", "ene-network",
  "iom-local", "iom-network", "tpd-local", "tpd-network",
  "male", "man", "boy"
];

const TOP_HINDI_VOICE_NAMES = ["swara", "madhur", "kalpana", "hemant", "lekha", "kiyara", "neel", "google हिन्दी", "hindi"];
const TOP_ENGLISH_NEURAL_VOICE_NAMES = [
  "neerja", "prabhat", "aria", "andrew", "brian", "guy", "jenny", "sonia", "ryan", "ava",
  "emma", "christopher", "eric", "steffan", "rishi", "veena", "isha", "samantha", "daniel",
  "karen", "moira", "serena", "alex", "oliver", "google uk english female", "google uk english male", "google us english"
];

/**
 * Strips markdown symbols, URLs, and decorative bullet chars and converts them into
 * natural conversational phrasing so spoken output sounds like a real human.
 */
export function sanitizeTextForSpeech(rawText: string): string {
  const isHindi = /[\u0900-\u097F]/.test(rawText);
  return rawText
    .replace(/\[[^\]]*(?:cvidyasolutions|workers\.dev|Live:)[^\]]*\]/gi, "")
    .replace(/https?:\/\/(?:www\.)?cvidyasolutions\.com[^\s)]*/gi, isHindi ? "सी विद्या सॉल्यूशंस डॉट कॉम" : "C Vidya Solutions dot com")
    .replace(/www\.cvidyasolutions\.com/gi, isHindi ? "सी विद्या सॉल्यूशंस डॉट कॉम" : "C Vidya Solutions dot com")
    .replace(/[a-z0-9-]+\.cvidyasolutions\.workers\.dev[^\s)\]]*/gi, "")
    .replace(/https?:\/\/[^\s)]+/g, isHindi ? "हमारे आधिकारिक लिंक" : "our official link")
    .replace(/[`*_~#>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/₹\s*(\d[\d,]*)\s*\/\s*(?:mo|month)\b/gi, isHindi ? "$1 रुपये प्रति माह" : "$1 rupees per month")
    .replace(/₹\s*(\d[\d,]*)\s*\/\s*(?:yr|year)\b/gi, isHindi ? "$1 रुपये प्रति वर्ष" : "$1 rupees per year")
    .replace(/₹\s*(\d[\d,]*)/g, isHindi ? "$1 रुपये" : "$1 rupees")
    .replace(/\b24\/7\b/g, isHindi ? "चौबीसों घंटे" : "twenty-four seven")
    .replace(/\bOPD\/IPD\b/gi, "O P D and I P D")
    .replace(/\bSMS\/WhatsApp\b/gi, isHindi ? "एसएमएस और व्हाट्सऐप" : "S M S and WhatsApp")
    .replace(/\bCBSE\/ICSE\b/gi, "C B S E and I C S E")
    .replace(/\b24K\/22K\b/gi, isHindi ? "24 कैरेट और 22 कैरेट" : "24 karat and 22 karat")
    .replace(/\b1-on-1\b/gi, isHindi ? "वन ऑन वन" : "one on one")
    .replace(/<0\.8s/gi, isHindi ? "0.8 सेकंड से भी कम समय में" : "under 0.8 seconds")
    .replace(/<50ms/gi, isHindi ? "50 मिलीसेकंड से कम में" : "under 50 milliseconds")
    .replace(/\+91\s*92885\s*17027/g, "+91 92885, 17027")
    .replace(/8987766981/g, "89877, 66981")
    .replace(/\+91\s*/g, "+91 ")
    .replace(/[•▪▸►]/g, ". ")
    .replace(/[—–]/g, ", ")
    .replace(/[📦🤖⚡📞📧📍🏢👔🧾🚀👋🙏🇮🇳🎯💼🌐⏱️🚨📅📊👥🔒💡✅😊💳🚪📈🔗🛠️🏆📱💻🤝]/g, " ")
    .replace(/\n+/g, ". ")
    .replace(/\.\s*\./g, ".")
    .replace(/।\s*\./g, "।")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 900);
}

/**
 * Strictly resolves speech locale to ONLY Hindi ("hi-IN") or English ("en-IN").
 */
export function detectPreferredSpeechLocale(text: string): "hi-IN" | "en-IN" {
  if (/[\u0900-\u097F]/.test(text)) {
    return "hi-IN";
  }
  return "en-IN";
}

function classifyVoiceGender(voice: SpeechSynthesisVoice): VoiceGender | "unknown" {
  const n = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  if (/\bfemale\b/.test(n) || n.includes("google us english")) {
    return "female";
  }
  if (/\bmale\b/.test(n)) {
    return "male";
  }
  if (MALE_VOICE_HINTS.some((h) => n.includes(h))) {
    return "male";
  }
  if (FEMALE_VOICE_HINTS.some((h) => n.includes(h))) {
    return "female";
  }
  return "unknown";
}

/**
 * Selects the most lifelike human Male or Female voice strictly from Hindi ("hi")
 * for Hindi speech or English ("en") for English speech.
 * Strongly prioritizes cloud/neural/natural voices (Google Wavenet, Microsoft Online Natural, Apple Neural)
 * and penalizes legacy offline desktop SAPI5 voices so English sounds like a real human.
 */
function selectBestHumanVoice(
  voices: SpeechSynthesisVoice[],
  targetLang: "en-IN" | "hi-IN",
  targetGender: VoiceGender
): { voice: SpeechSynthesisVoice | null; matchedGender: boolean } {
  if (!voices || voices.length === 0) {
    return { voice: null, matchedGender: false };
  }

  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestScore = -999;
  let bestMatchedGender = false;

  for (const v of voices) {
    const vLang = (v.lang || "").toLowerCase().replace("_", "-");
    const vName = `${v.name} ${v.voiceURI}`.toLowerCase();
    const isHindiVoice =
      vLang.startsWith("hi") ||
      vName.includes("hindi") ||
      vName.includes("हिन्दी") ||
      vName.includes("हिंदी") ||
      TOP_HINDI_VOICE_NAMES.some((n) => vName.includes(n));
    const isEnglishVoice = vLang.startsWith("en") || vName.includes("english");

    let score = 0;

    if (targetLang === "hi-IN") {
      // CRITICAL: Only pick voices that can actually pronounce Devanagari Hindi!
      if (!isHindiVoice) {
        continue;
      }
      score += 100;
    } else {
      // targetLang === "en-IN": strictly English voices only
      if (!isEnglishVoice || isHindiVoice) {
        continue;
      }
      if (vLang === "en-in") {
        score += 75;
      } else if (vLang === "en-gb" || vLang === "en-us") {
        score += 72;
      } else {
        score += 55;
      }
    }

    // Detect legacy offline Windows SAPI5 voices (e.g. "Microsoft Heera", "Microsoft Ravi", "Microsoft David", "Microsoft Zira")
    // which have localService === true and lack "natural" / "online" / "neural"
    const isLegacyOfflineSapi5 =
      v.localService === true &&
      vName.includes("microsoft") &&
      !vName.includes("natural") &&
      !vName.includes("online") &&
      !vName.includes("neural");

    // Strongly prefer ultra-realistic neural / natural / cloud Wavenet human voices
    if (vName.includes("natural") || vName.includes("neural") || vName.includes("multilingual") || vName.includes("wavenet")) {
      score += 115;
    } else if (vName.includes("google") && v.localService === false) {
      // Chrome's Google UK English Female / Google UK English Male / Google US English / Google हिन्दी cloud voices
      score += 110;
    } else if (vName.includes("online") || vName.includes("network") || vName.includes("studio") || v.localService === false) {
      score += 92;
    } else if (vName.includes("premium") || vName.includes("enhanced") || vName.includes("siri")) {
      score += 82;
    } else if (vName.includes("google") || vName.includes("apple")) {
      score += 60;
    } else if (isLegacyOfflineSapi5) {
      // Penalize old robotic offline desktop SAPI5 voices so cloud/neural voices always win when available
      score -= 55;
    } else if (vName.includes("microsoft")) {
      score += 20;
    }

    if (targetLang === "hi-IN" && TOP_HINDI_VOICE_NAMES.some((n) => vName.includes(n))) {
      score += 28;
    } else if (targetLang === "en-IN" && TOP_ENGLISH_NEURAL_VOICE_NAMES.some((n) => vName.includes(n)) && !isLegacyOfflineSapi5) {
      score += 32;
    }

    // Gender matching (Female vs Male)
    const detectedGender = classifyVoiceGender(v);
    const isGenderMatch = detectedGender === targetGender;
    if (isGenderMatch) {
      score += 95;
    } else if (detectedGender === "unknown") {
      score += 15;
    } else {
      score -= 60;
    }

    if (score > bestScore) {
      bestScore = score;
      bestVoice = v;
      bestMatchedGender = isGenderMatch;
    }
  }

  return { voice: bestVoice, matchedGender: bestMatchedGender };
}

/**
 * Transliterates Devanagari Hindi into phonetic Roman script ONLY as a last-resort backup
 * if a user's offline device has zero Hindi voices and /api/tts is unreachable,
 * ensuring the browser's English voice can still read the Hindi words out loud.
 */
function transliterateDevanagariToPhonetic(text: string): string {
  const map: Record<string, string> = {
    "अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ऋ": "ri",
    "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au", "ऑ": "o", "ऍ": "e", "अं": "an", "अः": "ah",
    "क्ष": "ksha", "त्र": "tra", "ज्ञ": "gya", "श्र": "shra",
    "क": "ka", "ख": "kha", "ग": "ga", "घ": "gha", "ङ": "na",
    "च": "cha", "छ": "chha", "ज": "ja", "झ": "jha", "ञ": "nya",
    "ट": "ta", "ठ": "tha", "ड": "da", "ढ": "dha", "ण": "na",
    "त": "ta", "थ": "tha", "द": "da", "ध": "dha", "न": "na",
    "प": "pa", "फ": "pha", "ब": "ba", "भ": "bha", "म": "ma",
    "य": "ya", "र": "ra", "ल": "la", "व": "va", "श": "sha", "ष": "sha", "स": "sa", "ह": "ha",
    "ड़": "da", "ढ़": "dha", "क़": "qa", "ख़": "kha", "ग़": "ga", "ज़": "za", "फ़": "fa",
    "क़": "k", "ख़": "kh", "ग़": "g", "ज़": "z", "ड़": "d", "ढ़": "dh", "फ़": "f", "य़": "y", "ऩ": "n",
    "ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri",
    "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ॉ": "o", "ॅ": "e", "ं": "n", "ँ": "n", "ः": "h",
    "्": "", "।": ".", "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9"
  };

  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1] || "";
    const threeChar = text.slice(i, i + 3);
    if (map[threeChar] !== undefined) {
      out += map[threeChar];
      i += 2;
      continue;
    }
    const twoChar = ch + next;
    if (map[twoChar] !== undefined) {
      out += map[twoChar];
      i++;
      continue;
    }
    if (map[ch] !== undefined) {
      const val = map[ch];
      const isConsonant = val.length > 1 && val.endsWith("a") && ch >= "क" && ch <= "ह";
      const nextIsMatraOrVirama = (next >= "ा" && next <= "्") || next === "ॉ" || next === "ॅ";
      const nextIsSpaceOrPunct = !next || /[\s.,?!।-]/.test(next);
      if (isConsonant && (nextIsMatraOrVirama || nextIsSpaceOrPunct)) {
        out += val.slice(0, -1);
      } else {
        out += val;
      }
    } else {
      out += ch;
    }
  }
  return out.replace(/[\u0900-\u097F]+/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Prepares a concise, natural spoken conversational summary so the voice agent
 * begins speaking immediately and sounds like a live human conversation partner
 * in strictly Hindi or English.
 */
function prepareConversationalSpeechScript(rawText: string, targetLang: "en-IN" | "hi-IN" = "en-IN"): string {
  let text = rawText
    .replace(/🔗[^\n]*/g, "")
    .replace(/\[[^\]]*(?:cvidyasolutions|workers\.dev|Live:)[^\]]*\]/gi, "")
    .replace(/https?:\/\/[^\s)]+/g, "");

  if (targetLang === "hi-IN" || /[\u0900-\u097F]/.test(text)) {
    text = text
      .replace(/\bC\s*-?\s*Vidya\s+Solutions\b/gi, "सी विद्या सॉल्यूशंस")
      .replace(/\bC\s*-?\s*Vidya\b/gi, "सी विद्या")
      .replace(/\bChiranjeev\s+Das\b/gi, "चिरंजीव दास")
      .replace(/\bLibrary\s+Management\s+Software\b/gi, "लाइब्रेरी मैनेजमेंट सॉफ्टवेयर")
      .replace(/\bLibrary\s+Management\b/gi, "लाइब्रेरी मैनेजमेंट")
      .replace(/\bGym\s+Management\s+Software\b/gi, "जिम मैनेजमेंट सॉफ्टवेयर")
      .replace(/\bFitness\s+Zone\b/gi, "फिटनेस ज़ोन")
      .replace(/\bInstitute\s+Management\s+Software\b/gi, "इंस्टीट्यूट मैनेजमेंट सॉफ्टवेयर")
      .replace(/\bInstitutes\s+Management\b/gi, "इंस्टीट्यूट्स मैनेजमेंट")
      .replace(/\bCoaching\s+Management\s+Software\b/gi, "कोचिंग मैनेजमेंट सॉफ्टवेयर")
      .replace(/\bCoaching\s+Management\b/gi, "कोचिंग मैनेजमेंट")
      .replace(/\bAgriFusion\b/gi, "एग्रीफ्यूज़न")
      .replace(/\bFarm\s*Fresh\s+Hub\b/gi, "फार्म फ्रेश हब")
      .replace(/\bDelivery\s+Management\s+Software\b/gi, "डिलीवरी मैनेजमेंट सॉफ्टवेयर")
      .replace(/\bJewelers\s+Management\b/gi, "ज्वेलर्स मैनेजमेंट")
      .replace(/\bEnterprises\s+CRM\b/gi, "एंटरप्राइजेज सीआरएम")
      .replace(/\bCRM\s+Software\b/gi, "सीआरएम सॉफ्टवेयर")
      .replace(/\bPetrol\s+Pump\b/gi, "पेट्रोल पंप")
      .replace(/\bCare\s+Plus\s+Healthcare\b/gi, "केयर प्लस हेल्थकेयर")
      .replace(/\bFree\s+Live\s+Demo\b/gi, "फ्री लाइव डेमो")
      .replace(/\bTry\s+Now\b/gi, "ट्राई नाउ")
      .replace(/\bWhatsApp\b/gi, "व्हाट्सऐप")
      .replace(/\bSaaS\b/g, "क्लाउड सॉफ्टवेयर")
      .replace(/\bERP\b/g, "ईआरपी")
      .replace(/\bCRM\b/g, "सीआरएम")
      .replace(/\bAI\b/g, "एआई");
  } else {
    text = text
      .replace(/\bC-VIDYA\b/gi, "C Vidya")
      .replace(/\bSaaS\b/g, "cloud software")
      .replace(/\bSLA\b/g, "service guarantee")
      .replace(/\bERP\b/g, "E R P")
      .replace(/\bCRM\b/g, "C R M")
      .replace(/\bPOS\b/g, "point of sale")
      .replace(/\bGST\b/g, "G S T")
      .replace(/\bUPI\b/g, "U P I")
      .replace(/\bOMR\b/g, "O M R")
      .replace(/\bISBN\b/g, "I S B N")
      .replace(/\bRFID\b/g, "R F I D");
  }

  const cleaned = sanitizeTextForSpeech(text);
  const maxLen = targetLang === "hi-IN" ? 210 : 250;
  if (cleaned.length <= maxLen) return cleaned;

  const sliced = cleaned.slice(0, maxLen);
  const lastPeriod = Math.max(
    sliced.lastIndexOf("। "),
    sliced.lastIndexOf("।"),
    sliced.lastIndexOf(". "),
    sliced.lastIndexOf("? "),
    sliced.lastIndexOf("! ")
  );
  if (lastPeriod > 55) {
    return sliced.slice(0, lastPeriod + 1).trim();
  }
  const lastSpace = sliced.lastIndexOf(" ");
  if (lastSpace > 45) {
    return sliced.slice(0, lastSpace).trim();
  }
  return sliced.trim();
}

/**
 * Splits speech text into safe, bite-sized clauses (<= 95 chars for Hindi Devanagari, <= 135 chars for English)
 * so Chrome's network voices (like "Google हिन्दी", "Google UK English", "Google US English")
 * never reject or truncate long utterances.
 */
function splitIntoSpeechChunks(text: string, targetLang: "en-IN" | "hi-IN"): string[] {
  const maxChunkLen = targetLang === "hi-IN" ? 95 : 135;
  const rawSentences = text
    .split(/(?<=[।.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const fineParts: string[] = [];
  for (const sentence of rawSentences) {
    if (sentence.length <= maxChunkLen) {
      fineParts.push(sentence);
    } else {
      const clauses = sentence
        .split(/(?<=,|،|;|:)\s+|\s+(?=और\s|या\s|तथा\s|लेकिन\s|तो\s|and\s|or\s|but\s|with\s|including\s)/i)
        .map((c) => c.trim())
        .filter(Boolean);
      for (const clause of clauses) {
        if (clause.length <= maxChunkLen) {
          fineParts.push(clause);
        } else {
          const words = clause.split(/\s+/);
          let buf = "";
          for (const w of words) {
            if (!buf) {
              buf = w;
            } else if (buf.length + w.length + 1 <= maxChunkLen) {
              buf += " " + w;
            } else {
              fineParts.push(buf);
              buf = w;
            }
          }
          if (buf) fineParts.push(buf);
        }
      }
    }
  }

  if (fineParts.length === 0) return [text];

  const mergedChunks: string[] = [];
  let current = "";
  for (const part of fineParts) {
    if (!current) {
      current = part;
    } else if (current.length + part.length + 1 <= maxChunkLen) {
      current += " " + part;
    } else {
      mergedChunks.push(current);
      current = part;
    }
  }
  if (current) mergedChunks.push(current);
  return mergedChunks.slice(0, 4);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

class HumanHybridTtsProvider implements ITtsProvider {
  private speaking = false;
  private activeAudio: HTMLAudioElement | null = null;
  private activeAudioSource: AudioBufferSourceNode | null = null;
  private audioCtx: AudioContext | null = null;
  private audioUnlocked = false;
  private activeAbortController: AbortController | null = null;
  private activeUtterances: SpeechSynthesisUtterance[] = [];
  private startTimerId: any = null;
  private watchdogTimerId: any = null;
  private audioCache = new Map<string, string>();
  private speechSessionId = 0;

  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) || typeof Audio !== "undefined";
  }

  public isSpeaking(): boolean {
    if (!this.isSupported()) return false;
    const browserSpeaking = "speechSynthesis" in window ? window.speechSynthesis.speaking : false;
    return browserSpeaking || this.speaking;
  }

  /**
   * Unlocks Web Audio API and warms up SpeechSynthesis inside a direct user click gesture
   * so async voice replies are never blocked by browser autoplay rules.
   */
  public unlockAudio(): void {
    if (typeof window === "undefined") return;
    try {
      const w = window as any;
      const AudioCtx = w.AudioContext || w.webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioCtx();
        }
        if (this.audioCtx && this.audioCtx.state === "suspended") {
          this.audioCtx.resume().catch(() => {});
        }
        if (this.audioCtx && !this.audioUnlocked) {
          const buffer = this.audioCtx.createBuffer(1, 1, 22050);
          const source = this.audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(this.audioCtx.destination);
          source.start(0);
          this.audioUnlocked = true;
        }
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.getVoices?.();
        window.speechSynthesis.resume?.();
      }
    } catch (_) {}
  }

  private clearTimers(): void {
    if (this.startTimerId) {
      clearTimeout(this.startTimerId);
      this.startTimerId = null;
    }
    if (this.watchdogTimerId) {
      clearTimeout(this.watchdogTimerId);
      this.watchdogTimerId = null;
    }
  }

  /**
   * Plays base64 WAV audio using the unlocked Web Audio API (AudioContext.decodeAudioData)
   * with automatic fallback to HTMLAudioElement.
   */
  private async playBase64Audio(
    base64Data: string,
    mimeType: string,
    currentSession: number,
    callbacks?: TtsCallbacks,
    onPlaybackFailed?: () => void
  ): Promise<void> {
    if (currentSession !== this.speechSessionId) return;

    const w = typeof window !== "undefined" ? (window as any) : null;
    const AudioCtx = w ? w.AudioContext || w.webkitAudioContext : null;

    if (AudioCtx && typeof window.atob === "function") {
      try {
        if (!this.audioCtx) {
          this.audioCtx = new AudioCtx();
        }
        const ctx = this.audioCtx!;
        if (ctx.state === "suspended") {
          await Promise.race([
            ctx.resume().catch(() => {}),
            new Promise((resolve) => setTimeout(resolve, 250)),
          ]);
        }
        if (currentSession !== this.speechSessionId) return;
        const arrayBuffer = base64ToArrayBuffer(base64Data);
        const decodedBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
          try {
            const p = ctx.decodeAudioData(arrayBuffer, resolve, reject);
            if (p && typeof (p as Promise<AudioBuffer>).then === "function") {
              (p as Promise<AudioBuffer>).then(resolve).catch(reject);
            }
          } catch (err) {
            reject(err);
          }
        });
        if (currentSession !== this.speechSessionId) return;
        const source = ctx.createBufferSource();
        source.buffer = decodedBuffer;
        source.playbackRate.value = 1.0;
        source.connect(ctx.destination);
        this.activeAudioSource = source;
        this.speaking = true;
        callbacks?.onStart?.();

        source.onended = () => {
          if (currentSession !== this.speechSessionId) return;
          this.speaking = false;
          this.activeAudioSource = null;
          callbacks?.onEnd?.();
        };
        source.start(0);
        return;
      } catch (_) {
        // Fall through to HTMLAudioElement
      }
    }

    this.playHtmlAudioElement(base64Data, mimeType, currentSession, callbacks, onPlaybackFailed);
  }

  private playHtmlAudioElement(
    base64Data: string,
    mimeType: string,
    currentSession: number,
    callbacks?: TtsCallbacks,
    onPlaybackFailed?: () => void
  ): void {
    if (currentSession !== this.speechSessionId || typeof Audio === "undefined") {
      if (onPlaybackFailed) onPlaybackFailed();
      else {
        this.speaking = false;
        callbacks?.onEnd?.();
      }
      return;
    }

    try {
      const dataUrl = `data:${mimeType || "audio/wav"};base64,${base64Data}`;
      const audio = new Audio(dataUrl);
      audio.playbackRate = 1.0;
      this.activeAudio = audio;
      this.speaking = true;

      audio.onplay = () => {
        if (currentSession !== this.speechSessionId) return;
        this.speaking = true;
        callbacks?.onStart?.();
      };
      audio.onended = () => {
        if (currentSession !== this.speechSessionId) return;
        this.speaking = false;
        this.activeAudio = null;
        callbacks?.onEnd?.();
      };
      audio.onerror = () => {
        if (currentSession !== this.speechSessionId) return;
        this.activeAudio = null;
        if (onPlaybackFailed) onPlaybackFailed();
        else {
          this.speaking = false;
          callbacks?.onEnd?.();
        }
      };
      audio.play().catch(() => {
        if (currentSession !== this.speechSessionId) return;
        this.activeAudio = null;
        if (onPlaybackFailed) onPlaybackFailed();
        else {
          this.speaking = false;
          callbacks?.onEnd?.();
        }
      });
    } catch (_) {
      if (onPlaybackFailed) onPlaybackFailed();
      else {
        this.speaking = false;
        callbacks?.onEnd?.();
      }
    }
  }

  /**
   * Last-resort offline phonetic Hindi fallback using the browser's English voice
   * when the device has no native Hindi TTS voice and /api/tts is unavailable.
   */
  private speakPhoneticHindiFallback(
    cleanSpeech: string,
    gender: VoiceGender,
    currentSession: number,
    callbacks?: TtsCallbacks
  ): void {
    if (
      currentSession !== this.speechSessionId ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      this.speaking = false;
      callbacks?.onEnd?.();
      return;
    }

    try {
      const phoneticText = transliterateDevanagariToPhonetic(cleanSpeech);
      if (!phoneticText) {
        this.speaking = false;
        callbacks?.onEnd?.();
        return;
      }

      const voices = window.speechSynthesis.getVoices?.() || [];
      const { voice: enVoice, matchedGender } = selectBestHumanVoice(voices, "en-IN", gender);
      const utterance = new SpeechSynthesisUtterance(phoneticText);
      utterance.lang = enVoice?.lang || "en-IN";
      if (enVoice) {
        utterance.voice = enVoice;
      }
      utterance.rate = 0.96;
      utterance.pitch = gender === "female" ? (matchedGender ? 1.02 : 1.12) : (matchedGender ? 0.95 : 0.84);

      this.activeUtterances = [utterance];
      this.speaking = true;

      utterance.onstart = () => {
        if (currentSession !== this.speechSessionId) return;
        this.speaking = true;
        callbacks?.onStart?.();
      };
      utterance.onend = () => {
        if (currentSession !== this.speechSessionId) return;
        this.speaking = false;
        this.activeUtterances = [];
        callbacks?.onEnd?.();
      };
      utterance.onerror = () => {
        if (currentSession !== this.speechSessionId) return;
        this.speaking = false;
        this.activeUtterances = [];
        callbacks?.onEnd?.();
      };

      window.speechSynthesis.resume?.();
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      this.speaking = false;
      callbacks?.onEnd?.();
    }
  }

  /**
   * Speaks via server-side Gemini Neural TTS (/api/tts: Kore for Female, Puck for Male).
   * Calls `onUnavailable` immediately if /api/tts is unavailable, returns useBrowserTts, or fails.
   */
  private speakWithServerTts(
    cleanSpeech: string,
    strictLang: "en-IN" | "hi-IN",
    gender: VoiceGender,
    currentSession: number,
    callbacks?: TtsCallbacks,
    onUnavailable?: () => void
  ): void {
    if (currentSession !== this.speechSessionId) return;

    const handleFailure = () => {
      if (currentSession !== this.speechSessionId) return;
      if (onUnavailable) {
        onUnavailable();
      } else if (strictLang === "hi-IN") {
        this.speakPhoneticHindiFallback(cleanSpeech, gender, currentSession, callbacks);
      } else {
        this.speaking = false;
        callbacks?.onEnd?.();
      }
    };

    const cacheKey = `${gender}:${strictLang}:${cleanSpeech.slice(0, 240)}`;
    if (this.audioCache.has(cacheKey)) {
      const cached = this.audioCache.get(cacheKey)!;
      const [mimePart, base64Part] = cached.split("|");
      void this.playBase64Audio(
        base64Part,
        mimePart || "audio/wav",
        currentSession,
        callbacks,
        handleFailure
      );
      return;
    }

    if (typeof fetch !== "function") {
      handleFailure();
      return;
    }

    const controller = new AbortController();
    this.activeAbortController = controller;
    const timeoutId = setTimeout(() => controller.abort(), 9500);

    this.speaking = true;
    callbacks?.onStart?.();

    fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: cleanSpeech,
        gender,
        lang: strictLang,
      }),
      signal: controller.signal,
    })
      .then(async (res) => {
        clearTimeout(timeoutId);
        if (currentSession !== this.speechSessionId) return;
        if (!res.ok) throw new Error("TTS HTTP error");
        const data = await res.json();
        if (data?.useBrowserTts || !data?.audioBase64) {
          throw new Error("Use browser TTS fallback");
        }
        const mime = data.mimeType || "audio/wav";
        this.audioCache.set(cacheKey, `${mime}|${data.audioBase64}`);
        if (this.activeAbortController === controller) {
          this.activeAbortController = null;
        }
        void this.playBase64Audio(
          data.audioBase64,
          mime,
          currentSession,
          callbacks,
          handleFailure
        );
      })
      .catch(() => {
        clearTimeout(timeoutId);
        if (this.activeAbortController === controller) {
          this.activeAbortController = null;
        }
        handleFailure();
      });
  }

  /**
   * Speaks sequentially chunk-by-chunk using Browser SpeechSynthesis as fallback
   * when Server Gemini TTS is unavailable or offline.
   */
  private speakWithBrowserHumanVoice(
    cleanSpeech: string,
    strictLang: "en-IN" | "hi-IN",
    gender: VoiceGender,
    currentSession: number,
    wasBusyBeforeStop: boolean,
    callbacks?: TtsCallbacks,
    allowServerRetry = false
  ): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      if (strictLang === "hi-IN") {
        this.speaking = false;
        callbacks?.onEnd?.();
      }
      return false;
    }

    try {
      const voices = window.speechSynthesis.getVoices?.() || [];
      const { voice: matchedVoice, matchedGender } = selectBestHumanVoice(voices, strictLang, gender);

      // Never feed Devanagari text to an English/default OS voice when no Hindi voice exists
      if (strictLang === "hi-IN" && !matchedVoice) {
        return false;
      }

      const chunks = splitIntoSpeechChunks(cleanSpeech, strictLang);
      if (chunks.length === 0) {
        this.speaking = false;
        callbacks?.onEnd?.();
        return true;
      }

      this.speaking = true;
      this.activeUtterances = [];
      let hasStarted = false;
      let hasFallenBack = false;
      let retriedDefaultVoice = false;

      const triggerFallback = () => {
        if (hasFallenBack || currentSession !== this.speechSessionId) return;
        hasFallenBack = true;
        this.clearTimers();
        this.activeUtterances = [];
        try {
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            window.speechSynthesis.cancel();
          }
        } catch (_) {}
        if (allowServerRetry) {
          this.speakWithServerTts(cleanSpeech, strictLang, gender, currentSession, callbacks);
        } else if (strictLang === "hi-IN") {
          this.speakPhoneticHindiFallback(cleanSpeech, gender, currentSession, callbacks);
        } else {
          this.speaking = false;
          callbacks?.onEnd?.();
        }
      };

      const speakChunkAtIndex = (idx: number, forceDefaultVoice = false) => {
        if (currentSession !== this.speechSessionId || hasFallenBack) return;
        if (idx >= chunks.length) {
          this.clearTimers();
          this.speaking = false;
          this.activeUtterances = [];
          callbacks?.onEnd?.();
          return;
        }

        const chunkText = chunks[idx];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        this.activeUtterances.push(utterance);

        utterance.lang = strictLang;
        utterance.volume = 1.0;

        if (!forceDefaultVoice) {
          const latestVoices = window.speechSynthesis.getVoices?.() || voices;
          const { voice: currentMatchedVoice, matchedGender: currentMatchedGender } =
            matchedVoice
              ? { voice: matchedVoice, matchedGender }
              : selectBestHumanVoice(latestVoices, strictLang, gender);

          if (strictLang === "hi-IN" && !currentMatchedVoice) {
            triggerFallback();
            return;
          }

          if (currentMatchedVoice) {
            utterance.voice = currentMatchedVoice;
            const vLang = (currentMatchedVoice.lang || "").toLowerCase();
            if (strictLang === "hi-IN" && vLang.startsWith("hi")) {
              utterance.lang = currentMatchedVoice.lang;
            } else if (strictLang === "en-IN" && vLang.startsWith("en")) {
              utterance.lang = currentMatchedVoice.lang;
            }
          }

          if (strictLang === "hi-IN") {
            utterance.rate = gender === "female" ? 1.02 : 1.0;
            utterance.pitch = gender === "female" ? (currentMatchedGender ? 1.03 : 1.12) : (currentMatchedGender ? 0.94 : 0.84);
          } else {
            utterance.rate = gender === "female" ? 1.0 : 0.98;
            utterance.pitch = gender === "female" ? (currentMatchedGender ? 1.0 : 1.1) : (currentMatchedGender ? 0.97 : 0.85);
          }
        } else {
          utterance.lang = strictLang === "hi-IN" ? "hi-IN" : "en-US";
          utterance.rate = 1.0;
          utterance.pitch = gender === "female" ? 1.06 : 0.9;
        }

        const chunkDispatchTime = Date.now();

        utterance.onstart = () => {
          if (currentSession !== this.speechSessionId || hasFallenBack) return;
          if (this.watchdogTimerId) {
            clearTimeout(this.watchdogTimerId);
            this.watchdogTimerId = null;
          }
          if (!hasStarted) {
            hasStarted = true;
            this.speaking = true;
            callbacks?.onStart?.();
          }
        };

        utterance.onend = () => {
          if (currentSession !== this.speechSessionId || hasFallenBack) return;
          const elapsedMs = Date.now() - chunkDispatchTime;
          if (idx === 0 && chunkText.length >= 10 && elapsedMs < 140) {
            if (!retriedDefaultVoice && matchedVoice && strictLang !== "hi-IN") {
              retriedDefaultVoice = true;
              speakChunkAtIndex(0, true);
              return;
            }
            triggerFallback();
            return;
          }
          speakChunkAtIndex(idx + 1, forceDefaultVoice);
        };

        utterance.onerror = (ev: any) => {
          if (currentSession !== this.speechSessionId || hasFallenBack) return;
          const errCode = String(ev?.error || "").toLowerCase();
          if (errCode === "canceled" || errCode === "interrupted") {
            return;
          }
          if (idx === 0 && !retriedDefaultVoice && matchedVoice && strictLang !== "hi-IN") {
            retriedDefaultVoice = true;
            speakChunkAtIndex(0, true);
            return;
          }
          if (idx === 0) {
            triggerFallback();
          } else {
            speakChunkAtIndex(idx + 1, forceDefaultVoice);
          }
        };

        if (idx === 0) {
          this.watchdogTimerId = setTimeout(() => {
            if (currentSession === this.speechSessionId && !hasFallenBack && !window.speechSynthesis.speaking) {
              triggerFallback();
            }
          }, 1200);
        }

        window.speechSynthesis.resume?.();
        window.speechSynthesis.speak(utterance);
      };

      callbacks?.onStart?.();

      if (wasBusyBeforeStop) {
        this.startTimerId = setTimeout(() => {
          speakChunkAtIndex(0);
        }, 95);
      } else {
        speakChunkAtIndex(0);
      }

      return true;
    } catch (_) {
      return false;
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

    const wasBusy =
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      Boolean(window.speechSynthesis.speaking || window.speechSynthesis.pending);

    this.stop();
    const currentSession = ++this.speechSessionId;

    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const strictLang: "en-IN" | "hi-IN" =
      hasDevanagari || preferredLang === "hi-IN" ? (hasDevanagari ? "hi-IN" : "en-IN") : "en-IN";

    const cleanSpeech = prepareConversationalSpeechScript(text, strictLang);
    if (!cleanSpeech) {
      callbacks?.onEnd?.();
      return;
    }

    // Use ultra-realistic Server Gemini Neural TTS (Kore/Puck via unlocked AudioContext) as primary
    // so both Hindi and English Female/Male voices sound human across every desktop and mobile device,
    // automatically falling back to browser SpeechSynthesis + phonetic Hindi if /api/tts is unavailable.
    this.speakWithServerTts(cleanSpeech, strictLang, gender, currentSession, callbacks, () => {
      const browserOk = this.speakWithBrowserHumanVoice(
        cleanSpeech,
        strictLang,
        gender,
        currentSession,
        wasBusy,
        callbacks,
        false
      );
      if (!browserOk) {
        if (strictLang === "hi-IN") {
          this.speakPhoneticHindiFallback(cleanSpeech, gender, currentSession, callbacks);
        } else {
          this.speaking = false;
          callbacks?.onEnd?.();
        }
      }
    });
  }

  public stop(): void {
    this.speechSessionId++;
    this.clearTimers();
    this.activeUtterances = [];
    if (this.activeAbortController) {
      try {
        this.activeAbortController.abort();
      } catch (_) {}
      this.activeAbortController = null;
    }
    if (this.activeAudioSource) {
      try {
        this.activeAudioSource.stop();
        this.activeAudioSource.disconnect();
      } catch (_) {}
      this.activeAudioSource = null;
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
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
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
        if ("speechSynthesis" in window) {
          window.speechSynthesis.getVoices?.();
          if (typeof window.speechSynthesis.addEventListener === "function") {
            window.speechSynthesis.addEventListener("voiceschanged", () => {
              window.speechSynthesis.getVoices?.();
            });
          }
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

  public unlockAudio(): void {
    this.provider.unlockAudio?.();
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
