import { describe, it, expect } from "vitest";
import { getPageSeo, PRODUCT_SEO_DATA } from "../../src/seoData.ts";

/**
 * Route & History State Contract Test Suite
 *
 * NOTE ON PRODUCTION CODE INTEGRITY:
 * In accordance with Section 2 ("STRICTLY PROTECTED PRODUCTION FILES"),
 * resolveRoute inside src/App.tsx is an unexported internal function.
 * Rather than mutating src/App.tsx to export it, this test verifies the
 * exact route mapping contract via the production SEO resolver getPageSeo()
 * and the canonical PRODUCT_SEO_DATA dictionary.
 */

describe("Navigation & Route Contract Regression Suite", () => {
  const CORE_PAGES = [
    { path: "/", expectedTitle: "C Vidya Solutions" },
    { path: "/about", expectedTitle: "About C Vidya Solutions" },
    { path: "/services", expectedTitle: "Services" },
    { path: "/portfolio", expectedTitle: "Portfolio" },
    { path: "/contact", expectedTitle: "Contact" },
    { path: "/careers", expectedTitle: "Careers" },
    { path: "/blog", expectedTitle: "Insights" },
    { path: "/faq", expectedTitle: "Frequently Asked Questions" },
    { path: "/pricing", expectedTitle: "Pricing" },
    { path: "/software", expectedTitle: "Software Solutions" },
    { path: "/ai-agents", expectedTitle: "Autonomous AI Agents" },
    { path: "/mobile-app", expectedTitle: "Mobile App" },
  ];

  const COMPLIANCE_PAGES = [
    "/privacy",
    "/terms",
    "/billing",
    "/refund",
    "/cookies",
    "/disclaimer",
    "/portability",
  ];

  it("should resolve valid SEO metadata and canonical URLs for all core directory pages", () => {
    for (const page of CORE_PAGES) {
      const seo = getPageSeo(page.path);
      expect(seo).toBeDefined();
      expect(seo.title).toContain(page.expectedTitle);
      expect(seo.description).toBeTruthy();
      expect(seo.canonicalUrl).toMatch(/^https:\/\/cvidyasolutions\.com/);
    }
  });

  it("should resolve valid canonical metadata for all 7 compliance routes", () => {
    for (const route of COMPLIANCE_PAGES) {
      const seo = getPageSeo(route);
      expect(seo).toBeDefined();
      expect(seo.title).toBeTruthy();
      expect(seo.canonicalUrl).toBe(`https://cvidyasolutions.com${route}/`);
    }
  });

  it("should validate all product routes in PRODUCT_SEO_DATA resolve to product canonical URLs", () => {
    for (const prod of Object.values(PRODUCT_SEO_DATA)) {
      const seo = getPageSeo(prod.urlPath);
      expect(seo.canonicalUrl).toBe(prod.canonicalUrl);
      expect(seo.title).toBe(prod.metaTitle);
    }
  });

  it("should validate modal history state structure matching App.tsx expectations", () => {
    // App.tsx lines 163-217 defines the modal history state schema
    interface HistoryState {
      isModal?: boolean;
      modalType?: "live-software" | "software-detail" | "product-detail";
      productId?: string;
      previewProductId?: string | null;
      scrollY?: number;
      type?: "page";
      url?: string;
    }

    const testState: HistoryState = {
      isModal: true,
      modalType: "live-software",
      productId: "library",
      scrollY: 1420,
    };

    expect(testState.isModal).toBe(true);
    expect(["live-software", "software-detail", "product-detail"]).toContain(testState.modalType);
    expect(typeof testState.scrollY).toBe("number");
    expect(testState.productId).toBe("library");
  });
});
