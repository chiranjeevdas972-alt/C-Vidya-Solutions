import { describe, it, expect } from "vitest";
import {
  saasProductsData,
  aiAgentsData,
  otherServicesData,
  HERO_ROTATING_PHRASES,
  TESTIMONIALS_DATA,
  WORKFLOW_STEPS_DATA,
  BEFORE_AFTER_DATA,
  US_VS_THEM_DATA,
} from "../../src/data.ts";

describe("Data Integrity & Software Catalog Regression Test Suite", () => {
  it("should have distinct and non-empty product catalogs", () => {
    expect(saasProductsData.length).toBeGreaterThan(0);
    expect(aiAgentsData.length).toBeGreaterThan(0);
    expect(otherServicesData.length).toBeGreaterThan(0);
  });

  it("should guarantee all SaaS products have unique identifiers and required fields", () => {
    const ids = new Set<string>();
    for (const product of saasProductsData) {
      expect(ids.has(product.id)).toBe(false);
      ids.add(product.id);
      expect(product.name).toBeTruthy();
      expect(product.categoryType).toBe("saas");
      expect(product.tagline).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(Array.isArray(product.features)).toBe(true);
      expect(product.features.length).toBeGreaterThan(0);
    }
  });

  it("should contain the C Vidya Institute Management product in saasProductsData", () => {
    const institutes = saasProductsData.find(
      (p) => p.id === "institutes" || p.name.toLowerCase().includes("institute")
    );
    expect(institutes).toBeDefined();
    expect(institutes?.name.toLowerCase()).toContain("institute");
  });

  it("should guarantee all AI agents have unique identifiers", () => {
    const ids = new Set<string>();
    for (const agent of aiAgentsData) {
      expect(ids.has(agent.id)).toBe(false);
      ids.add(agent.id);
      expect(agent.name).toBeTruthy();
      expect(agent.tagline).toBeTruthy();
    }
  });

  it("should validate interactive UI/UX feature configuration data (Word Rotator, Testimonials, Workflow, Before/After, Us vs Them)", () => {
    expect(HERO_ROTATING_PHRASES.length).toBeGreaterThanOrEqual(4);
    expect(HERO_ROTATING_PHRASES).toContain("Manage Your Business");
    expect(TESTIMONIALS_DATA.length).toBeGreaterThanOrEqual(3);
    expect(WORKFLOW_STEPS_DATA.length).toBe(5);
    expect(BEFORE_AFTER_DATA.beforeItems.length).toBe(BEFORE_AFTER_DATA.afterItems.length);
    expect(US_VS_THEM_DATA.length).toBeGreaterThanOrEqual(5);
  });
});

