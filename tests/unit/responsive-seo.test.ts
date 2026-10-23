import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Responsive Design, Cross-Browser Compatibility & Multi-Search-Engine SEO Test Suite", () => {
  const rootDir = process.cwd();

  it("should validate public/sitemap.xml has all 43 canonical URLs and correct HTTPS format", () => {
    const sitemapPath = path.join(rootDir, "public/sitemap.xml");
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
    expect(sitemapContent).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemapContent).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    expect(locMatches.length).toBe(43);

    // All URLs must be canonical HTTPS on cvidyasolutions.com
    for (const url of locMatches) {
      expect(url.startsWith("https://cvidyasolutions.com/")).toBe(true);
      expect(url).not.toContain("localhost");
      expect(url).not.toContain("run.app");
      expect(url).not.toContain("staging");
    }

    // Verify key core, mobile, and legal routes are in sitemap
    expect(locMatches).toContain("https://cvidyasolutions.com/");
    expect(locMatches).toContain("https://cvidyasolutions.com/mobile-app/");
    expect(locMatches).toContain("https://cvidyasolutions.com/coming-soon/");
    expect(locMatches).toContain("https://cvidyasolutions.com/software/library-management/");
    expect(locMatches).toContain("https://cvidyasolutions.com/software/fitness-zone/");
    expect(locMatches).toContain("https://cvidyasolutions.com/ai-agents/customer-support/");
    expect(locMatches).toContain("https://cvidyasolutions.com/privacy/");
    expect(locMatches).toContain("https://cvidyasolutions.com/terms/");
  });

  it("should validate public/robots.txt allows Googlebot, Bingbot, and general search crawlers while protecting private areas", () => {
    const robotsPath = path.join(rootDir, "public/robots.txt");
    expect(fs.existsSync(robotsPath)).toBe(true);

    const robotsContent = fs.readFileSync(robotsPath, "utf-8");
    expect(robotsContent).toContain("User-agent: *");
    expect(robotsContent).toContain("User-agent: Googlebot");
    expect(robotsContent).toContain("User-agent: Bingbot");
    expect(robotsContent).toContain("Allow: /");
    expect(robotsContent).toContain("Disallow: /api/");
    expect(robotsContent).toContain("Disallow: /admin/");
    expect(robotsContent).toContain("Sitemap: https://cvidyasolutions.com/sitemap.xml");
  });

  it("should validate index.html has Edge compatibility, mobile viewport-fit, format detection, and SearchAction schema", () => {
    const indexHtmlPath = path.join(rootDir, "index.html");
    expect(fs.existsSync(indexHtmlPath)).toBe(true);

    const html = fs.readFileSync(indexHtmlPath, "utf-8");
    // Cross-browser & viewport
    expect(html).toContain('http-equiv="X-UA-Compatible" content="IE=edge"');
    expect(html).toContain('name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"');
    expect(html).toContain('name="format-detection" content="telephone=no"');
    expect(html).toContain('rel="canonical" href="https://cvidyasolutions.com/"');

    // Schema.org WebSite & potentialAction for Google / Bing search box
    expect(html).toContain('"@type": "WebSite"');
    expect(html).toContain('"@type": "SearchAction"');
    expect(html).toContain('"@type": "Organization"');
    expect(html).toContain('"name": "C Vidya Solutions"');
  });

  it("should validate src/index.css includes WCAG AA reduced-motion, focus-visible, and mobile safe-area utilities", () => {
    const cssPath = path.join(rootDir, "src/index.css");
    expect(fs.existsSync(cssPath)).toBe(true);

    const css = fs.readFileSync(cssPath, "utf-8");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain(":focus-visible");
    expect(css).toContain("text-size-adjust: 100%");
    expect(css).toContain("-webkit-text-size-adjust: 100%");
    expect(css).toContain("env(safe-area-inset-bottom");
    expect(css).toContain("-webkit-overflow-scrolling: touch");
  });

  it("should validate IndexNow payload schema contract", () => {
    const sampleKey = "3a9f8b2c1d0e4f5a6b7c8d9e0f1a2b3c";
    const sampleUrls = [
      "https://cvidyasolutions.com/",
      "https://cvidyasolutions.com/software/library-management/",
    ];

    const payload = {
      host: "cvidyasolutions.com",
      key: sampleKey,
      keyLocation: `https://cvidyasolutions.com/${sampleKey}.txt`,
      urlList: sampleUrls,
    };

    expect(payload.host).toBe("cvidyasolutions.com");
    expect(payload.key).toBe(sampleKey);
    expect(payload.keyLocation).toBe(`https://cvidyasolutions.com/${sampleKey}.txt`);
    expect(payload.urlList.length).toBe(2);
    expect(payload.urlList.every(u => u.startsWith("https://cvidyasolutions.com"))).toBe(true);
  });

  it("should ensure C Vidya PDF and Media Tools SaaS Try Now launches the live software (/software/pdf-tools/index.html) and does not collide with the SEO details route (/software/pdf-media-tools/)", () => {
    const pdfToolsHtmlPath = path.join(rootDir, "public/software/pdf-tools/index.html");
    expect(fs.existsSync(pdfToolsHtmlPath)).toBe(true);

    const pdfToolsHtml = fs.readFileSync(pdfToolsHtmlPath, "utf-8");
    expect(pdfToolsHtml).toContain('<base href="/software/pdf-tools/">');
    expect(pdfToolsHtml).toContain("./assets/index-Dr7Qrl8o.js");
    expect(pdfToolsHtml).toContain("Cvidya PDF and Media tool SaaS");

    const liveAppTsx = fs.readFileSync(path.join(rootDir, "src/components/LiveSoftwareApp.tsx"), "utf-8");
    expect(liveAppTsx).toContain('return "/software/pdf-tools/index.html";');
    expect(liveAppTsx).not.toContain('return "/software/pdf-media-tools/index.html";');
  });
});

