import { describe, it, expect } from "vitest";
import { isHinglishQuery, getSmartAssistantResponse } from "../../src/utils/aiResponder.ts";

describe("AI Assistant & Bilingual Knowledge Base Regression Suite", () => {
  describe("Hinglish Query Detection", () => {
    it("should correctly identify common Hinglish keywords and sentence structures", () => {
      expect(isHinglishQuery("kya price hai software ka?")).toBe(true);
      expect(isHinglishQuery("library software kaise kaam karta hai")).toBe(true);
      expect(isHinglishQuery("mujhe demo dekhna hai")).toBe(true);
      expect(isHinglishQuery("gym ke liye biometric turnstile chahiye")).toBe(true);
    });

    it("should return false for purely English queries", () => {
      expect(isHinglishQuery("What are the features of library management?")).toBe(false);
      expect(isHinglishQuery("Can you provide an enterprise quotation?")).toBe(false);
    });
  });

  describe("Assistant Response Handling & Lead Capture", () => {
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
  });
});
