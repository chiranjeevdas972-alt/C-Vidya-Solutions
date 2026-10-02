import { useEffect } from "react";

export interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export default function SeoHead({
  title,
  description,
  canonicalUrl,
  ogType = "website",
  ogImage = "https://cvidyasolutions.com/og-image.png",
  jsonLd
}: SeoHeadProps) {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Helper to set or update meta tag
    const setMeta = (nameOrProperty: "name" | "property", key: string, value: string) => {
      let tag = document.querySelector(`meta[${nameOrProperty}="${key}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(nameOrProperty, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:site_name", "C Vidya Solutions");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // 3. Canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);

    // 4. Injected Dynamic Schema JSON-LD
    const SCRIPT_ID = "cv-page-jsonld";
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalUrl, ogType, ogImage, jsonLd]);

  return null;
}
