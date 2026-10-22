import { describe, it, expect } from "vitest";

// Replicating the exact validation rules codified in firestore.rules lines 23-74
function isValidInquiry(data: any): boolean {
  return (
    data != null &&
    typeof data === "object" &&
    typeof data.name === "string" &&
    data.name.length >= 2 &&
    data.name.length <= 150 &&
    typeof data.email === "string" &&
    data.email.length >= 5 &&
    data.email.length <= 200 &&
    typeof data.phone === "string" &&
    data.phone.length >= 5 &&
    data.phone.length <= 50 &&
    (!("service" in data) || (typeof data.service === "string" && data.service.length <= 200)) &&
    (!("message" in data) || (typeof data.message === "string" && data.message.length <= 5000)) &&
    (!("status" in data) || (typeof data.status === "string" && data.status.length <= 100))
  );
}

function isValidAppRegistration(data: any): boolean {
  return (
    data != null &&
    typeof data === "object" &&
    typeof data.name === "string" &&
    data.name.length >= 2 &&
    data.name.length <= 150 &&
    typeof data.email === "string" &&
    data.email.length >= 5 &&
    data.email.length <= 200 &&
    typeof data.phone === "string" &&
    data.phone.length >= 5 &&
    data.phone.length <= 50 &&
    typeof data.platform === "string" &&
    (data.platform === "android" || data.platform === "ios") &&
    data.privacyConsent === true &&
    (!("status" in data) || (typeof data.status === "string" && data.status.length <= 100)) &&
    (!("privacyPolicyVersion" in data) || (typeof data.privacyPolicyVersion === "string" && data.privacyPolicyVersion.length <= 50))
  );
}

function isValidApplication(data: any): boolean {
  return (
    data != null &&
    typeof data === "object" &&
    typeof data.name === "string" &&
    data.name.length >= 2 &&
    data.name.length <= 150 &&
    typeof data.email === "string" &&
    data.email.length >= 5 &&
    data.email.length <= 200 &&
    typeof data.phone === "string" &&
    data.phone.length >= 5 &&
    data.phone.length <= 50 &&
    typeof data.jobTitle === "string" &&
    data.jobTitle.length > 0 &&
    data.jobTitle.length <= 200 &&
    (!("resumeData" in data) || (typeof data.resumeData === "string" && data.resumeData.length <= 800000))
  );
}

describe("Security & Input Validation Rules Regression Test Suite", () => {
  describe("Inquiry Form Validation (firestore.rules:isValidInquiry)", () => {
    it("should accept valid inquiry payloads", () => {
      const valid = {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "+91 9876543210",
        service: "Library Management",
        message: "Need a demonstration for our campus library.",
        status: "New",
      };
      expect(isValidInquiry(valid)).toBe(true);
    });

    it("should reject inquiries with missing name or name too short", () => {
      expect(isValidInquiry({ email: "a@b.com", phone: "123456" })).toBe(false);
      expect(isValidInquiry({ name: "A", email: "a@b.com", phone: "123456" })).toBe(false);
    });

    it("should reject inquiries with oversized payload fields (Injection/DoS guard)", () => {
      const hugeName = "A".repeat(151);
      expect(isValidInquiry({ name: hugeName, email: "test@domain.com", phone: "1234567" })).toBe(false);

      const hugeMessage = "M".repeat(5001);
      expect(
        isValidInquiry({
          name: "Valid Name",
          email: "test@domain.com",
          phone: "1234567",
          message: hugeMessage,
        })
      ).toBe(false);
    });
  });

  describe("Mobile App Registration Validation (firestore.rules:isValidAppRegistration)", () => {
    it("should accept valid registration with privacy consent", () => {
      const validAndroid = {
        name: "Priya Patel",
        email: "priya@example.com",
        phone: "9876543210",
        platform: "android",
        privacyConsent: true,
      };
      expect(isValidAppRegistration(validAndroid)).toBe(true);

      const validIos = {
        name: "Vikram Sen",
        email: "vikram@example.com",
        phone: "9876543210",
        platform: "ios",
        privacyConsent: true,
      };
      expect(isValidAppRegistration(validIos)).toBe(true);
    });

    it("should reject registrations without privacy consent", () => {
      const withoutConsent = {
        name: "Priya Patel",
        email: "priya@example.com",
        phone: "9876543210",
        platform: "android",
        privacyConsent: false,
      };
      expect(isValidAppRegistration(withoutConsent)).toBe(false);
    });

    it("should reject invalid platforms (e.g. windows, macos)", () => {
      const invalidPlatform = {
        name: "Priya Patel",
        email: "priya@example.com",
        phone: "9876543210",
        platform: "windows",
        privacyConsent: true,
      };
      expect(isValidAppRegistration(invalidPlatform)).toBe(false);
    });
  });

  describe("Careers Job Application Validation (firestore.rules:isValidApplication)", () => {
    it("should accept valid job application", () => {
      const valid = {
        name: "Amit Kumar",
        email: "amit@example.com",
        phone: "9876543210",
        jobTitle: "Senior Full Stack Engineer",
        resumeData: "data:application/pdf;base64,JVBERi0xLjQK...",
      };
      expect(isValidApplication(valid)).toBe(true);
    });

    it("should reject application if resumeData exceeds 800,000 characters limit", () => {
      const oversizedResume = "R".repeat(800001);
      const invalid = {
        name: "Amit Kumar",
        email: "amit@example.com",
        phone: "9876543210",
        jobTitle: "Senior Full Stack Engineer",
        resumeData: oversizedResume,
      };
      expect(isValidApplication(invalid)).toBe(false);
    });
  });
});
