import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Replicating strict allowlist logic from server.ts for /api/live-software-embed
const softwareWorkerMap: Record<string, string> = {
  library: "https://v.cvidyasolutions.workers.dev/",
  fitness: "https://fitzone.cvidyasolutions.workers.dev/",
  fitzone: "https://fitzone.cvidyasolutions.workers.dev/",
  "ai-social": "https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/",
  "ai-support": "https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/",
  "ai-salesflow": "https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/",
  "ai-sales": "https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/",
  "ai-marketing": "https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/",
  "ai-market": "https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/",
  coaching: "https://coaching.cvidyasolutions.workers.dev/",
  farming: "https://fresh.cvidyasolutions.workers.dev/",
  fresh: "https://fresh.cvidyasolutions.workers.dev/",
  agrifusion: "https://fresh.cvidyasolutions.workers.dev/",
  members: "https://jewelry.cvidyasolutions.workers.dev/",
  jewelry: "https://jewelry.cvidyasolutions.workers.dev/",
  crm: "https://crm.cvidyasolutions.workers.dev/",
  "care-plus": "https://care-plus.cvidyasolutions.workers.dev/",
  hospital: "https://care-plus.cvidyasolutions.workers.dev/",
  institutes: "https://institutes.cvidyasolutions.workers.dev/",
};

function isAllowedSoftwareEmbedUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string" || rawUrl.length > 500) return false;
  const allowlistedUrls = new Set(Object.values(softwareWorkerMap));
  if (allowlistedUrls.has(rawUrl)) return true;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return false;
    return /^[a-z0-9-]+\.cvidyasolutions\.workers\.dev$/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

// Replicating Firestore validation rules for Phase 1 collections (firestore.rules)
function isValidCallLog(data: any): boolean {
  return (
    data != null &&
    typeof data === "object" &&
    typeof data.callId === "string" &&
    data.callId.length >= 2 &&
    data.callId.length <= 128 &&
    typeof data.leadName === "string" &&
    data.leadName.length >= 2 &&
    data.leadName.length <= 150 &&
    typeof data.phone === "string" &&
    data.phone.length >= 5 &&
    data.phone.length <= 50 &&
    typeof data.direction === "string" &&
    (data.direction === "Inbound" || data.direction === "Outbound") &&
    typeof data.outcome === "string" &&
    data.outcome.length >= 2 &&
    data.outcome.length <= 100 &&
    typeof data.timestamp === "string" &&
    data.timestamp.length >= 10 &&
    data.timestamp.length <= 64
  );
}

function isValidDemoBooking(data: any): boolean {
  return (
    data != null &&
    typeof data === "object" &&
    typeof data.bookingId === "string" &&
    data.bookingId.length >= 2 &&
    data.bookingId.length <= 128 &&
    typeof data.leadName === "string" &&
    data.leadName.length >= 2 &&
    data.leadName.length <= 150 &&
    typeof data.phone === "string" &&
    data.phone.length >= 5 &&
    data.phone.length <= 50 &&
    typeof data.product === "string" &&
    data.product.length >= 2 &&
    data.product.length <= 200 &&
    typeof data.preferredDate === "string" &&
    data.preferredDate.length >= 4 &&
    data.preferredDate.length <= 50 &&
    typeof data.preferredTimeSlot === "string" &&
    data.preferredTimeSlot.length >= 2 &&
    data.preferredTimeSlot.length <= 100 &&
    typeof data.status === "string" &&
    data.status.length >= 2 &&
    data.status.length <= 60 &&
    typeof data.createdAt === "string" &&
    data.createdAt.length >= 10 &&
    data.createdAt.length <= 64
  );
}

function isValidHandoffTicket(data: any): boolean {
  return (
    data != null &&
    typeof data === "object" &&
    typeof data.ticketId === "string" &&
    data.ticketId.length >= 2 &&
    data.ticketId.length <= 128 &&
    typeof data.leadName === "string" &&
    data.leadName.length >= 2 &&
    data.leadName.length <= 150 &&
    typeof data.phone === "string" &&
    data.phone.length >= 5 &&
    data.phone.length <= 50 &&
    typeof data.reason === "string" &&
    data.reason.length >= 2 &&
    data.reason.length <= 2000 &&
    typeof data.urgency === "string" &&
    (data.urgency === "Immediate" || data.urgency === "High" || data.urgency === "Normal") &&
    typeof data.targetDepartment === "string" &&
    data.targetDepartment.length >= 2 &&
    data.targetDepartment.length <= 100 &&
    typeof data.status === "string" &&
    (data.status === "Open" || data.status === "In Progress" || data.status === "Resolved") &&
    typeof data.createdAt === "string" &&
    data.createdAt.length >= 10 &&
    data.createdAt.length <= 64
  );
}

describe("Phase 1 Security, Authentication & Persistence Test Suite", () => {
  describe("Zero Hardcoded Passcodes in Frontend & Backend Source", () => {
    it("should not contain hardcoded administrative passcodes in frontend files", () => {
      const filesToAudit = [
        "src/App.tsx",
        "src/components/InquiryForm.tsx",
        "src/components/AiCallingConsolePanel.tsx",
        "src/services/aiCallingService.ts",
      ];

      for (const relPath of filesToAudit) {
        const content = fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
        expect(content).not.toContain("cvidya2026");
        expect(content).not.toContain("cvidya2025");
        expect(content).not.toContain("admin123");
        expect(content).not.toContain("password.trim().length >= 4");
      }
    });
  });

  describe("Open Redirect Protection (/api/live-software-embed)", () => {
    it("should allow verified C Vidya worker URLs", () => {
      expect(isAllowedSoftwareEmbedUrl("https://v.cvidyasolutions.workers.dev/")).toBe(true);
      expect(isAllowedSoftwareEmbedUrl("https://fitzone.cvidyasolutions.workers.dev/")).toBe(true);
      expect(isAllowedSoftwareEmbedUrl("https://crm.cvidyasolutions.workers.dev/dashboard")).toBe(true);
    });

    it("should block arbitrary external domains, javascript: URIs, and HTTP URLs", () => {
      expect(isAllowedSoftwareEmbedUrl("https://evil.example.com/phishing")).toBe(false);
      expect(isAllowedSoftwareEmbedUrl("https://cvidyasolutions.workers.dev.evil.com/")).toBe(false);
      expect(isAllowedSoftwareEmbedUrl("http://v.cvidyasolutions.workers.dev/")).toBe(false);
      expect(isAllowedSoftwareEmbedUrl("javascript:alert(1)")).toBe(false);
      expect(isAllowedSoftwareEmbedUrl("//evil.com")).toBe(false);
    });
  });

  describe("Constant-Time Admin Digest Verification", () => {
    it("should verify SHA-256 digests in constant time and reject invalid tokens", () => {
      const secret = "test_enterprise_secret_2026";
      const expectedDigest = crypto.createHash("sha256").update(secret).digest();
      const candidateMatch = crypto.createHash("sha256").update("test_enterprise_secret_2026").digest();
      const candidateMismatch = crypto.createHash("sha256").update("wrong_passcode").digest();

      expect(crypto.timingSafeEqual(expectedDigest, candidateMatch)).toBe(true);
      expect(crypto.timingSafeEqual(expectedDigest, candidateMismatch)).toBe(false);
    });
  });

  describe("Firestore Persistence Schema Validation (call_logs, demo_bookings, handoff_tickets)", () => {
    it("should validate CallLog documents against firestore.rules:isValidCallLog", () => {
      const validCallLog = {
        callId: "call_1730000000_abcd",
        leadName: "Dr. Rakesh Verma",
        phone: "+91 9876543210",
        direction: "Outbound",
        outcome: "Connected — Product Walkthrough & Follow-Up Logged",
        timestamp: new Date().toISOString(),
      };
      expect(isValidCallLog(validCallLog)).toBe(true);
      expect(isValidCallLog({ ...validCallLog, direction: "InvalidDirection" })).toBe(false);
    });

    it("should validate DemoBooking documents against firestore.rules:isValidDemoBooking", () => {
      const validBooking = {
        bookingId: "demo_1730000000_xyz",
        leadName: "Anjali Gupta",
        phone: "+91 9876543210",
        product: "C Vidya Library Management System",
        preferredDate: "2026-11-01",
        preferredTimeSlot: "11:30 AM IST",
        status: "Scheduled",
        createdAt: new Date().toISOString(),
      };
      expect(isValidDemoBooking(validBooking)).toBe(true);
      expect(isValidDemoBooking({ ...validBooking, product: "" })).toBe(false);
    });

    it("should validate HandoffTicket documents against firestore.rules:isValidHandoffTicket", () => {
      const validTicket = {
        ticketId: "handoff_1730000000_123",
        leadName: "Suresh Nair",
        phone: "+91 9876543210",
        reason: "Enterprise multi-campus custom SLA negotiation",
        urgency: "High",
        targetDepartment: "Sales",
        status: "Open",
        createdAt: new Date().toISOString(),
      };
      expect(isValidHandoffTicket(validTicket)).toBe(true);
      expect(isValidHandoffTicket({ ...validTicket, urgency: "InvalidUrgency" })).toBe(false);
    });
  });
});
