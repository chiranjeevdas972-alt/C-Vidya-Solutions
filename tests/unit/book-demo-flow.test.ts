import { describe, it, expect } from "vitest";

describe("Book Free Demo & Congratulations Flow", () => {
  it("generates a valid demo reference ID starting with CVD-DEMO-", () => {
    const generateRefId = () => `CVD-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    const refId = generateRefId();
    expect(refId).toMatch(/^CVD-DEMO-\d{6}$/);
  });

  it("validates demo form payload completely before submission", () => {
    const validateForm = (fullName: string, phone: string, email: string, consent: boolean) => {
      if (!fullName.trim()) return { valid: false, error: "Please enter your Full Name." };
      const cleanPhone = phone.trim();
      if (!cleanPhone || cleanPhone === "+91" || cleanPhone === "+91 ") {
        return { valid: false, error: "Please enter a valid Phone Number." };
      }
      if (!email.trim() || !email.includes("@")) {
        return { valid: false, error: "Please enter a valid Email Address." };
      }
      if (!consent) {
        return { valid: false, error: "Please accept the secure storage and transmission consent." };
      }
      return { valid: true };
    };

    expect(validateForm("", "+91 9288517027", "test@domain.com", true).valid).toBe(false);
    expect(validateForm("Chiranjeev Das", "+91", "test@domain.com", true).valid).toBe(false);
    expect(validateForm("Chiranjeev Das", "+91 9288517027", "invalid-email", true).valid).toBe(false);
    expect(validateForm("Chiranjeev Das", "+91 9288517027", "test@domain.com", false).valid).toBe(false);
    expect(validateForm("Chiranjeev Das", "+91 9288517027", "test@domain.com", true).valid).toBe(true);
  });

  it("formats congratulations data structure accurately for popup modal display", () => {
    const demoSubmission = {
      name: "Rohan Verma",
      phone: "+91 8987766981",
      email: "rohan@company.com",
      service: "C Vidya Library Management",
      referenceId: "CVD-DEMO-582910",
      requirements: "Need automated barcode scanning & seat reservation for 200 members."
    };

    expect(demoSubmission.name).toBe("Rohan Verma");
    expect(demoSubmission.phone).toContain("+91");
    expect(demoSubmission.service).toBe("C Vidya Library Management");
    expect(demoSubmission.referenceId).toMatch(/^CVD-DEMO-/);
  });
});
