import { describe, it, expect } from "vitest";
import {
  isHinglishQuery,
  isHindiDevanagari,
  detectLanguageMode,
  extractStructuredLeadFromChat,
  getSmartAssistantResponse,
  CUSTOMER_INTENT_PATTERNS,
  normalizeCustomerMessage,
  detectCustomerLanguage,
  detectCustomerIntents,
  extractCustomerDetails,
  identifyProductCategory,
  identifyCustomerRequirement,
  classifyLeadIntent,
  generateCustomerResponse,
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

  describe("Master Implementation Prompt: 31 Intent Categories, 8 Core Functions & 15 Test Cases", () => {
    it("should define all 31 intent categories in CUSTOMER_INTENT_PATTERNS", () => {
      const expectedKeys = [
        "greeting",
        "company_info",
        "software_info",
        "library",
        "institute",
        "coaching",
        "gym",
        "crm",
        "farm_fresh_hub",
        "delivery",
        "ai_chatbot",
        "ai_agent",
        "pricing",
        "demo",
        "features",
        "customization",
        "development",
        "support",
        "installation",
        "integration",
        "api_integration",
        "whatsapp_integration",
        "sms_integration",
        "payment",
        "purchase",
        "partnership",
        "reseller",
        "contact_info",
        "human_support",
        "general_questions",
        "unknown_questions",
      ];
      for (const key of expectedKeys) {
        expect(CUSTOMER_INTENT_PATTERNS).toHaveProperty(key);
        expect(Array.isArray(CUSTOMER_INTENT_PATTERNS[key])).toBe(true);
        expect(CUSTOMER_INTENT_PATTERNS[key].length).toBeGreaterThan(0);
      }
    });

    it("should execute all 8 reusable customer functions accurately", () => {
      expect(normalizeCustomerMessage("  Hello   World  ")).toBe("hello world");
      expect(detectCustomerLanguage("मुझे लाइब्रेरी सॉफ्टवेयर चाहिए")).toBe("hi");
      expect(detectCustomerLanguage("mujhe library software chahiye")).toBe("hi");
      expect(detectCustomerLanguage("I need Library Management Software")).toBe("en");

      const intents = detectCustomerIntents("Library Management Software की पूरी जानकारी, कीमत और डेमो कैसे मिलेगा?");
      expect(intents.matchedIntents).toContain("library");
      expect(intents.matchedIntents).toContain("pricing");
      expect(intents.matchedIntents).toContain("demo");

      expect(identifyProductCategory("Tell me about Farm Fresh Hub")).toContain("Farm Fresh Hub");
      expect(identifyProductCategory("मुझे डिलीवरी सॉफ्टवेयर चाहिए")).toContain("Delivery Management Software");
      expect(classifyLeadIntent("I want to book a free demo")).toBe("demo");
      expect(classifyLeadIntent("We want to become a reseller partner")).toBe("partnership");

      const details = extractCustomerDetails([
        { role: "user", content: "My name is Rahul from Dhanbad. Call me at 9876543210 for Gym Management Software demo" },
      ]);
      expect(details.name).toContain("Rahul");
      expect(details.phone).toContain("9876543210");
      expect(details.lead_type).toBe("demo");
      expect(identifyCustomerRequirement("Need custom ERP software")).toContain("Need custom ERP software");
    });

    it("Test 1 (Hindi Greeting): 'नमस्ते' -> responds in Hindi", () => {
      const reply = generateCustomerResponse([{ role: "user", content: "नमस्ते" }]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("C Vidya Solutions");
    });

    it("Test 2 (English Greeting): 'Hello' -> responds in English", () => {
      const reply = generateCustomerResponse([{ role: "user", content: "Hello" }]);
      expect(reply).toContain("Welcome to");
      expect(reply).toContain("C Vidya Solutions");
    });

    it("Test 3 (Hinglish Input -> Hindi Output): 'mujhe library software chahiye'", () => {
      const reply = generateCustomerResponse([{ role: "user", content: "mujhe library software chahiye" }]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("Library Management Software");
    });

    it("Test 4 (Library Enquiry): 'Library Management Software के बारे में बताइए'", () => {
      const reply = generateCustomerResponse([
        { role: "user", content: "Library Management Software के बारे में बताइए" },
      ]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("Library Management Software");
      expect(reply).toContain("डेमो");
    });

    it("Test 5 (Gym Enquiry): 'Tell me about Gym Management Software'", () => {
      const reply = generateCustomerResponse([
        { role: "user", content: "Tell me about Gym Management Software" },
      ]);
      expect(reply).toContain("Gym");
      expect(reply.toLowerCase()).toContain("membership");
    });

    it("Test 6 (Farm Fresh Hub Enquiry): 'Farm Fresh Hub क्या है?'", () => {
      const reply = generateCustomerResponse([{ role: "user", content: "Farm Fresh Hub क्या है?" }]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("Farm Fresh Hub");
    });

    it("Test 7 (Demo Request): 'मुझे डेमो चाहिए'", () => {
      const reply = generateCustomerResponse([{ role: "user", content: "मुझे डेमो चाहिए" }]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("डेमो");
    });

    it("Test 8 (Pricing Question): 'Price क्या है?'", () => {
      const reply = generateCustomerResponse([{ role: "user", content: "Price क्या है?" }]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("Pricing");
    });

    it("Test 9 (Multi-Intent Question): 'Library software के फीचर्स, प्राइस और डेमो बताइए'", () => {
      const reply = generateCustomerResponse([
        { role: "user", content: "Library software के फीचर्स, प्राइस और डेमो बताइए" },
      ]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("Library Management Software");
      expect(reply).toContain("मुख्य फीचर्स");
      expect(reply).toContain("कीमत");
      expect(reply).toContain("फ्री लाइव डेमो");
    });

    it("Test 10 (Custom Software Enquiry): 'We need custom software for our business'", () => {
      const reply = generateCustomerResponse([
        { role: "user", content: "We need custom software for our business" },
      ]);
      expect(reply.toLowerCase()).toContain("custom");
    });

    it("Test 11 (AI Agent Enquiry): 'AI Agent हमारे बिजनेस में कैसे काम करेगा?'", () => {
      const reply = generateCustomerResponse([
        { role: "user", content: "AI Agent हमारे बिजनेस में कैसे काम करेगा?" },
      ]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("AI");
    });

    it("Test 12 (Lead Capture): 'मेरा नाम राहुल है और नंबर 9876543210 है'", () => {
      const reply = generateCustomerResponse([
        { role: "user", content: "मेरा नाम राहुल है और नंबर 9876543210 है" },
      ]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("धन्यवाद");
      expect(reply).toContain("9876543210");
    });

    it("Test 13 (Invalid Phone Number): 'मेरा नंबर 12345 है'", () => {
      const reply = generateCustomerResponse([{ role: "user", content: "मेरा नंबर 12345 है" }]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("10 अंकों का सही मोबाइल नंबर");
    });

    it("Test 14 (Human Support Request): 'मुझे आपकी टीम से बात करनी है'", () => {
      const reply = generateCustomerResponse([
        { role: "user", content: "मुझे आपकी टीम से बात करनी है" },
      ]);
      expect(isHindiDevanagari(reply)).toBe(true);
      expect(reply).toContain("हमारी टीम तक पहुँचाने के लिए आपकी सहायता करता हूँ");
    });

    it("Test 15 (Unknown Question / Anti-Hallucination Guard): 'क्या आपके पास अंतरिक्ष रॉकेट लॉन्च करने का लाइसेंस है?'", () => {
      const replyHi = generateCustomerResponse([
        { role: "user", content: "क्या आपके पास अंतरिक्ष रॉकेट लॉन्च करने का लाइसेंस है?" },
      ]);
      expect(replyHi).toContain("इस जानकारी की पुष्टि अभी हमारे पास उपलब्ध नहीं है");

      const replyEn = generateCustomerResponse([
        { role: "user", content: "Do you manufacture nuclear submarines in Antarctica?" },
      ]);
      expect(replyEn).toContain("I don't currently have verified information about this");
    });

    it("should maintain Multi-Turn Conversation Memory across turns (Product -> Affirmative -> Name -> Phone)", () => {
      const turn1 = [{ role: "user", content: "मुझे जिम सॉफ्टवेयर चाहिए" }];
      const reply1 = generateCustomerResponse(turn1);
      expect(reply1).toContain("Gym");

      const turn2 = [
        ...turn1,
        { role: "model", content: reply1 },
        { role: "user", content: "हां" },
      ];
      const reply2 = generateCustomerResponse(turn2);
      expect(reply2).toContain("नाम और मोबाइल नंबर");

      const turn3 = [
        ...turn2,
        { role: "model", content: reply2 },
        { role: "user", content: "Rahul" },
      ];
      const reply3 = generateCustomerResponse(turn3);
      expect(reply3).toContain("Rahul");
      expect(reply3).toContain("10 अंकों का मोबाइल नंबर");

      const turn4 = [
        ...turn3,
        { role: "model", content: reply3 },
        { role: "user", content: "9876543210" },
      ];
      const reply4 = generateCustomerResponse(turn4);
      expect(reply4).toContain("धन्यवाद");
      expect(reply4).toContain("9876543210");
    });

    it("should handle Multi-Product Enquiries and Pricing Objections gracefully", () => {
      const multiProdReply = generateCustomerResponse([
        { role: "user", content: "मुझे Gym और CRM दोनों चाहिए।" },
      ]);
      expect(multiProdReply).toContain("Gym & Fitness Management Software");
      expect(multiProdReply).toContain("CRM Software");

      const objectionReply = generateCustomerResponse([
        { role: "user", content: "आपका सॉफ्टवेयर महंगा तो नहीं है?" },
      ]);
      expect(objectionReply).toContain("बजट और जरूरत के अनुसार");
    });
  });
});




