import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "Other Half Pets";
const FALLBACK_SITE_URL = "https://www.otherhalfpets.com";
const DEFAULT_DESCRIPTION =
  "Other Half Pets makes daily dog wellness routines easier with clean formulas, thoughtful education, and support that stays connected.";
const DEFAULT_IMAGE_PATH = "/Home/images/logo2.png";

const routeMetadata = {
  "/": {
    title: "Daily Dog Wellness, Simplified",
    description:
      "Shop daily dog wellness formulas, explore the quiz, and build a routine that supports immunity, digestion, mobility, and oral care.",
  },
  "/collection": {
    title: "Shop The Collection",
    description:
      "Explore Other Half's full collection of dog wellness products, including daily multivitamins, oral care, and value bundles.",
  },
  "/product": {
    title: "Everyday Daily Multivitamin",
    description:
      "See size-based plans, formula benefits, and subscribe-ready options for the Everyday Daily Multivitamin.",
  },
  "/doggie-dental": {
    title: "Doggie Dental Powder",
    description:
      "Discover a simple no-brush oral care routine designed for fresher breath, cleaner teeth, and happier gums.",
  },
  "/daily-duo": {
    title: "Daily Duo Bundle",
    description:
      "Bundle daily wellness and oral care into one repeat-friendly routine with the Daily Duo subscription-ready stack.",
  },
  "/science": {
    title: "Science Behind The Formulas",
    description:
      "Learn how each Other Half formula supports dog wellness through ingredient choices, product structure, and daily-use design.",
  },
  "/integrity": {
    title: "Ingredient Integrity",
    description:
      "Review sourcing standards, manufacturing practices, and the quality principles behind Other Half products.",
  },
  "/our-story": {
    title: "Our Story",
    description:
      "Read the Other Half story, the care philosophy behind the brand, and how the team thinks about daily dog wellness.",
  },
  "/story": {
    title: "Our Story",
    description:
      "Read the Other Half story, the care philosophy behind the brand, and how the team thinks about daily dog wellness.",
  },
  "/clinical-studies": {
    title: "Clinical Studies",
    description:
      "Explore research-inspired product pages and learn how the formulas map to real dog wellness goals.",
  },
  "/clinical": {
    title: "Clinical Studies",
    description:
      "Explore research-inspired product pages and learn how the formulas map to real dog wellness goals.",
  },
  "/blog": {
    title: "Blog",
    description:
      "Browse dog care education, product guidance, and practical notes for building a more consistent wellness routine.",
  },
  "/faq": {
    title: "Frequently Asked Questions",
    description:
      "Find answers about products, delivery plans, subscriptions, orders, and support across the Other Half experience.",
  },
  "/faqPage": {
    title: "Frequently Asked Questions",
    description:
      "Find answers about products, delivery plans, subscriptions, orders, and support across the Other Half experience.",
  },
  "/quiz": {
    title: "Dog Wellness Quiz",
    description:
      "Take the quiz to find the best Other Half routine for your dog's wellness goals and daily needs.",
  },
  "/quiz-desktop": {
    title: "Interactive Quiz Experience",
    description:
      "Walk through the desktop quiz journey to match your dog with the right wellness routine.",
  },
  "/quizdesktop": {
    title: "Interactive Quiz Experience",
    description:
      "Walk through the desktop quiz journey to match your dog with the right wellness routine.",
  },
  "/dailyduo": {
    title: "Daily Duo Bundle",
    description:
      "Bundle daily wellness and oral care into one repeat-friendly routine with the Daily Duo subscription-ready stack.",
  },
  "/contact": {
    title: "Contact Support",
    description:
      "Reach the Other Half support team for help with orders, subscriptions, account access, and product questions.",
  },
  "/login": {
    title: "Sign In",
    description:
      "Access your account to review saved recommendations, support conversations, and delivery details.",
  },
  "/register": {
    title: "Create Account",
    description:
      "Create your Other Half account to save your dog's quiz results, support history, and subscription details.",
  },
  "/cart": {
    title: "Your Cart",
    description:
      "Review your cart, confirm product selections, and continue to secure checkout with server-verified pricing.",
  },
};

const getSiteOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return (import.meta.env.VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");
};

const getRouteMetadata = (pathname) => {
  return (
    routeMetadata[pathname] || {
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
    }
  );
};

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

const RouteMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const siteOrigin = getSiteOrigin();
    const metadata = getRouteMetadata(location.pathname);
    const pageTitle =
      metadata.title === SITE_NAME ? metadata.title : `${metadata.title} | ${SITE_NAME}`;
    const description = metadata.description || DEFAULT_DESCRIPTION;
    const canonicalUrl = `${siteOrigin}${location.pathname}`;
    const imageUrl = `${siteOrigin}${DEFAULT_IMAGE_PATH}`;

    document.title = pageTitle;

    ensureMetaTag('meta[name="description"]', {
      name: "description",
      content: description,
    });
    ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: pageTitle,
    });
    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    ensureMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    ensureMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    ensureMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });
    ensureMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: pageTitle,
    });
    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    ensureMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });
    ensureLinkTag('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });
  }, [location.pathname]);

  return null;
};

export default RouteMeta;
