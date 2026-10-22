import { describe, it, expect } from "vitest";
import { PRODUCT_SEO_DATA, BASE_SITE_URL, getPageSeo } from "../../src/seoData.ts";
import { ARTICLES_DATA } from "../../src/articleData.ts";

describe("SEO & Canonical URLs Regression Test Suite", () => {
  it("should have correct BASE_SITE_URL matching production domain", () => {
    expect(BASE_SITE_URL).toBe("https://cvidyasolutions.com");
  });

  it("should validate all 9 SaaS products in PRODUCT_SEO_DATA have valid metadata and canonical URLs", () => {
    const products = Object.values(PRODUCT_SEO_DATA);
    expect(products.length).toBeGreaterThanOrEqual(9);

    for (const p of products) {
      expect(p.id).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.urlPath).toMatch(/^\/(software|ai-agents)\/[a-z0-9-]+/);
      expect(p.canonicalUrl).toBe(`${BASE_SITE_URL}${p.urlPath}`);
      expect(p.metaTitle.length).toBeGreaterThan(10);
      expect(p.metaDescription.length).toBeGreaterThan(20);
      expect(["SoftwareApplication", "Service"]).toContain(p.schemaType);
      expect(Array.isArray(p.secondaryKeywords)).toBe(true);
      expect(Array.isArray(p.targetUsers)).toBe(true);
    }
  });

  it("should resolve SEO for core pages via getPageSeo", () => {
    const homeSeo = getPageSeo("/");
    expect(homeSeo.canonicalUrl).toBe("https://cvidyasolutions.com/");
    expect(homeSeo.title).toContain("C Vidya Solutions");
    expect(homeSeo.description.length).toBeGreaterThan(15);

    const servicesSeo = getPageSeo("/services");
    expect(servicesSeo.canonicalUrl).toBe("https://cvidyasolutions.com/services/");
    expect(servicesSeo.title).toContain("Services");

    const softwareSeo = getPageSeo("/software");
    expect(softwareSeo.canonicalUrl).toBe("https://cvidyasolutions.com/software/");

    const contactSeo = getPageSeo("/contact");
    expect(contactSeo.canonicalUrl).toBe("https://cvidyasolutions.com/contact/");
  });

  it("should resolve SEO for dedicated product landing pages", () => {
    const librarySeo = getPageSeo("/software/library-management/");
    expect(librarySeo.canonicalUrl).toBe("https://cvidyasolutions.com/software/library-management/");
    expect(librarySeo.title).toContain("Library");

    const fitnessSeo = getPageSeo("/software/fitness-zone/");
    expect(fitnessSeo.canonicalUrl).toBe("https://cvidyasolutions.com/software/fitness-zone/");
    expect(fitnessSeo.title).toContain("Fitness");
  });

  it("should validate all blog articles have required slug, title, and summary", () => {
    const articles = Object.values(ARTICLES_DATA);
    expect(articles.length).toBeGreaterThan(0);

    for (const article of articles) {
      expect(article.id).toBeTruthy();
      expect(article.title).toBeTruthy();
      expect(article.summary).toBeTruthy();
      expect(article.readTime).toBeTruthy();
      expect(article.canonicalUrl).toMatch(/^https:\/\/cvidyasolutions\.com\/blog\//);
    }
  });
});
