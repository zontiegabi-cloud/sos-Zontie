import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function SEOManager() {
  const { settings } = useSiteSettings();
  const { seo } = settings;

  useEffect(() => {
    // Update Title
    document.title = seo.defaultTitle;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(isProperty ? "property" : "name", name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Description
    updateMeta("description", seo.defaultDescription);

    // Keywords
    if (seo.defaultKeywords && seo.defaultKeywords.length > 0) {
      updateMeta("keywords", seo.defaultKeywords.join(", "));
    }

    // Open Graph
    updateMeta("og:title", seo.defaultTitle, true);
    updateMeta("og:description", seo.defaultDescription, true);
    updateMeta("og:type", "website", true);
    if (seo.ogImage) {
      updateMeta("og:image", seo.ogImage, true);
    }

    // Twitter
    updateMeta("twitter:card", "summary_large_image");
    if (seo.twitterHandle) {
      updateMeta("twitter:site", seo.twitterHandle);
      updateMeta("twitter:creator", seo.twitterHandle);
    }
    updateMeta("twitter:title", seo.defaultTitle);
    updateMeta("twitter:description", seo.defaultDescription);
    if (seo.ogImage) {
      updateMeta("twitter:image", seo.ogImage);
    }

  }, [seo]);

  return null;
}
