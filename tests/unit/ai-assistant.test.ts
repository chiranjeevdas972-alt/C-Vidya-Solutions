import { describe, it, expect } from "vitest";
import {
  isHinglishQuery,
  isHindiDevanagari,
  detectLanguageMode,
  extractStructuredLeadFromChat,
  getSmartAssistantResponse,
} from "../../src/utils/aiResponder.ts";
import { sanitizeTextForSpeech, ttsService } from "../../src/services/ttsService.ts";

describe("AI Assistant & Trilingual Business Knowledge Base Regression Suite", () => {
  describe("Language Mode Detection (English, Hindi Devanagari, Hinglish)", () => {
    it("should correctly identify common Hinglish keywords and sentence structures", () => {
      expect(isHinglishQuery("kya price hai software ka?")).toBe(true);
      expect(isHinglishQuery("library software kaise kaam karta hai")).toBe(true);
      expect(isHinglishQuery("mujhe demo dekhna hai")).toBe(true);
      expect(isHinglishQuery("gym ke liye biometric turnstile chahiye")).toBe(true);
      expect(detectLanguageMode("mujhe demo dekhna hai")).toBe("hinglish");
    });

    it("should correctly identify Hindi Devanagari script", () => {
      expect(isHindiDevanagari("मुझे लाइब्रेरी सॉफ्टवेयर का डेमो चाहिए")).toBe(true);
      expect(detectLanguageMode("मुझे लाइब्रेरी सॉफ्टवेयर का डेमो चाहिए")).toBe("hi");
    });

    it("should return false / en for purely English queries", () => {
      expect(isHinglishQuery("What are the features of library management?")).toBe(false);
      expect(isHinglishQuery("Can you provide an enterprise quotation?")).toBe(false);
      expect(detectLanguageMode("What are the features of library management?")).toBe("en");
    });
  });

  describe("Assistant Response Handling, Lead Capture & Business Workflows", () => {
    it("should return welcoming greeting when messages array is empty", () => {
      const response = getSmartAssistantResponse([]);
      expect(response).toContain("Welcome to **C Vidya Solutions**");
    });

    it("should automatically detect and capture contact numbers and route to official desk", () => {
      const response = getSmartAssistantResponse([
        { role: "user", content: "My phone number is 9876543210 please call me" },
      ]);
      expect(response).toContain("contact details have been successfully captured");
      expect(response).toContain("contact@cvidyasolutions.com");
    });

    it("should automatically detect email addresses and acknowledge capture", () => {
      const response = getSmartAssistantResponse([
        { role: "user", content: "You can email me at client@mycompany.org" },
      ]);
      expect(response).toContain("contact details have been successfully captured");
    });

    it("should extract structured CRM lead attributes from conversation text", () => {
      const lead = extractStructuredLeadFromChat(
        "My name is Rahul Sharma from Apex Coaching in Jaipur. Call me at 9876543210 or email rahul@apex.in for Library Management Software follow-up."
      );
      expect(lead).not.toBeNull();
      expect(lead?.phone).toContain("9876543210");
      expect(lead?.email).toBe("rahul@apex.in");
      expect(lead?.cityCountry?.toLowerCase()).toBe("jaipur");
      expect(lead?.productOfInterest).toContain("Library Management");
    });

    it("should answer library management inquiries accurately in English", () => {
      const response = getSmartAssistantResponse([
        { role: "user", content: "Tell me about your library management software" },
      ]);
      expect(response.toLowerCase()).toContain("library");
    });

    it("should answer pricing inquiries with transparent tier details", () => {
      const response = getSmartAssistantResponse([
        { role: "user", content: "What is the price of your software?" },
      ]);
      expect(response.toLowerCase()).toMatch(/(price|pricing|tier|plan|cost)/);
    });

    it("should respond in Hindi when asked a question in Devanagari Hindi", () => {
      const response = getSmartAssistantResponse([
        { role: "user", content: "नमस्ते, आपके सॉफ्टवेयर की कीमत क्या है?" },
      ]);
      expect(isHindiDevanagari(response)).toBe(true);
    });

    it("should handle human escalation and management report queries accurately", () => {
      const escalationResponse = getSmartAssistantResponse([
        { role: "user", content: "Please escalate this to a human manager" },
      ]);
      expect(escalationResponse).toContain("contact@cvidyasolutions.com");

      const reportResponse = getSmartAssistantResponse([
        { role: "user", content: "Generate a management report of your portfolio" },
      ]);
      expect(reportResponse).toContain("Management & Portfolio Report");
    });

    it("should reply like a warm real human to user feedback in English, Hindi, and Hinglish", () => {
      const enFeedback = getSmartAssistantResponse([
        { role: "user", content: "Great work, your software is awesome!" },
      ]);
      expect(enFeedback).toContain("Thank you so much");

      const hinglishFeedback = getSmartAssistantResponse([
        { role: "user", content: "Bahut badhiya software hai aapka" },
      ]);
      expect(hinglishFeedback).toContain("dhanyawad");

      const hiFeedback = getSmartAssistantResponse([
        { role: "user", content: "आपका सॉफ्टवेयर बहुत अच्छा लगा, धन्यवाद" },
      ]);
      expect(isHindiDevanagari(hiFeedback)).toBe(true);
    });
  });

  describe("Voice Agent TTS & Speech Normalization", () => {
    it("should strip markdown formatting and bullets for clean speech output", () => {
      const raw = "### Welcome to **C Vidya Solutions**\n• **Library SaaS**: ₹699/mo";
      const clean = sanitizeTextForSpeech(raw);
      expect(clean).not.toContain("**");
      expect(clean).not.toContain("###");
      expect(clean).toContain("Welcome to C Vidya Solutions");
    });

    it("should support switching between Girl (female) and Boy (male) human voice options", () => {
      ttsService.setVoiceGender("female");
      expect(ttsService.getVoiceGender()).toBe("female");
      ttsService.setVoiceGender("male");
      expect(ttsService.getVoiceGender()).toBe("male");
      ttsService.setVoiceGender("female");
    });

    it("should answer 'www.cvidyasolutions.com ko dekho aur mujhe easy way batao.' in Hinglish", () => {
      const reply = getSmartAssistantResponse([
        { role: "user", content: "www.cvidyasolutions.com ko dekho aur mujhe easy way batao." },
      ]);
      expect(reply).toContain("Easy Way");
      expect(reply).toContain("7 Ready-to-Use Business Software");
      expect(reply).toContain("4 Autonomous AI Agents");
    });

    it("should answer 'What is the C Vidya solutions?' and spoken 'What is the see with the solution?' in English", () => {
      const reply1 = getSmartAssistantResponse([
        { role: "user", content: "What is the C Vidya solutions?" },
      ]);
      const reply2 = getSmartAssistantResponse([
        { role: "user", content: "What is the see with the solution?" },
      ]);
      expect(reply1).toContain("Explained Simply");
      expect(reply2).toContain("Explained Simply");
    });

    it("should answer 'सी विद्या सॉल्यूशंस क्या है? आसान भाषा में बताएं' in Hindi Devanagari", () => {
      const reply = getSmartAssistantResponse([
        { role: "user", content: "सी विद्या सॉल्यूशंस क्या है? आसान भाषा में बताएं" },
      ]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("आसान और सरल शब्दों में पूरी जानकारी");
    });

    it("should respond like a real Male or Female human to 'Mujhe software abhi Nahin chahie Ek Bar Kuchh Achcha chij batao'", () => {
      const femaleReply = getSmartAssistantResponse(
        [{ role: "user", content: "Mujhe software abhi Nahin chahie Ek Bar Kuchh Achcha chij batao" }],
        { gender: "female", preferredLanguage: "hinglish" }
      );
      const maleReply = getSmartAssistantResponse(
        [{ role: "user", content: "Mujhe software abhi Nahin chahie Ek Bar Kuchh Achcha chij batao" }],
        { gender: "male", preferredLanguage: "hinglish" }
      );
      expect(femaleReply).toContain("share karti hoon");
      expect(maleReply).toContain("share karta hoon");
      expect(femaleReply).not.toContain("7 Flagship SaaS Products");
    });
  });
});




