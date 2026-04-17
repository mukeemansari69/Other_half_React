import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
  DEFAULT_SITE_URL,
  OG_LOCALE,
  SITE_LANGUAGE,
  getSeoPayload,
} from "../../shared/seo.js";

const ensureMetaTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
};

const ensureLinkTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("link");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
};

const ensureStructuredDataScript = (structuredData) => {
  let tag = document.head.querySelector("#seo-schema");

  if (!tag) {
    tag = document.createElement("script");
    tag.id = "seo-schema";
    tag.type = "application/ld+json";
    document.head.appendChild(tag);
  }

  tag.textContent = JSON.stringify(structuredData).replace(/</g, "\\u003c");
};

const removeTag = (selector) => {
  const tag = document.head.querySelector(selector);

  if (tag) {
    tag.remove();
  }
};

const getSiteOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return DEFAULT_SITE_URL.replace(/\/+$/, "");
};

const RouteMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoPayload(location.pathname, getSiteOrigin());

    document.title = seo.title;
    document.documentElement.lang = SITE_LANGUAGE;

    ensureMetaTag('meta[name="description"]', {
      name: "description",
      content: seo.description,
    });
    ensureMetaTag('meta[name="robots"]', {
      name: "robots",
      content: seo.robots,
    });
    ensureMetaTag('meta[name="googlebot"]', {
      name: "googlebot",
      content: seo.robots,
    });
    ensureMetaTag('meta[name="author"]', {
      name: "author",
      content: "PetPlus",
    });
    ensureMetaTag('meta[name="application-name"]', {
      name: "application-name",
      content: "PetPlus",
    });
    ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: seo.title,
    });
    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: seo.description,
    });
    ensureMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    ensureMetaTag('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "PetPlus",
    });
    ensureMetaTag('meta[property="og:locale"]', {
      property: "og:locale",
      content: OG_LOCALE,
    });
    ensureMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: seo.imageUrl,
    });
    ensureMetaTag('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: seo.imageAlt,
    });
    ensureMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: seo.title,
    });
    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: seo.description,
    });
    ensureMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: seo.imageUrl,
    });

    if (seo.canonicalUrl) {
      ensureMetaTag('meta[property="og:url"]', {
        property: "og:url",
        content: seo.canonicalUrl,
      });
      ensureLinkTag('link[rel="canonical"]', {
        rel: "canonical",
        href: seo.canonicalUrl,
      });
      ensureLinkTag(`link[rel="alternate"][hreflang="${SITE_LANGUAGE}"]`, {
        rel: "alternate",
        hreflang: SITE_LANGUAGE,
        href: seo.canonicalUrl,
      });
      ensureLinkTag('link[rel="alternate"][hreflang="x-default"]', {
        rel: "alternate",
        hreflang: "x-default",
        href: seo.canonicalUrl,
      });
    } else {
      removeTag('meta[property="og:url"]');
      removeTag('link[rel="canonical"]');
      removeTag(`link[rel="alternate"][hreflang="${SITE_LANGUAGE}"]`);
      removeTag('link[rel="alternate"][hreflang="x-default"]');
    }

    ensureStructuredDataScript(seo.structuredData);
  }, [location.pathname]);

  return null;
};

export default RouteMeta;
