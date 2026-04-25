import { homeFaq, productFaq, subscriptionFaq } from "../src/faqData.js";
import {
  dailyDuoProductData,
  dogDentalProductData,
  everydayProductData,
} from "../src/productData.js";
import { collectionCards } from "./storeCatalog.js";
import { BRAND_NAME, STORE_COUNTRY, STORE_CURRENCY, STORE_LOCALE } from "./storefrontConfig.js";

export const SITE_NAME = BRAND_NAME;
export const SITE_TAGLINE = "Daily Dog Wellness, Simplified";
export const DEFAULT_SITE_URL = "https://www.pet-plus.co.in";
export const SITE_LANGUAGE = STORE_LOCALE;
export const OG_LOCALE = "en_IN";
export const DEFAULT_OG_IMAGE_PATH = "/Home/images/PetPlus-Logo.png";
export const BRAND_LOGO_PATH = "/Home/images/PetPlus-Logo.png";
export const SUPPORT_EMAIL = "care@PetPlus.co.in";
export const SEO_HEAD_START = "<!-- SEO_START -->";
export const SEO_HEAD_END = "<!-- SEO_END -->";
export const INDEXABLE_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
export const NOINDEX_ROBOTS = "noindex,nofollow,noarchive";

export const SEO_REDIRECTS = {
  "/story": "/our-story",
  "/clinical": "/clinical-studies",
  "/dailyduo": "/daily-duo",
  "/faqPage": "/faq",
};

const PRODUCT_ROUTE_CONFIG = {
  "/product": {
    data: everydayProductData,
    imagePath: everydayProductData.gallery[0]?.src || DEFAULT_OG_IMAGE_PATH,
    description:
      "Shop dog supplements India trusts for immunity, digestion, mobility, skin and coat. PetPlus Everyday supports daily pet wellness in one easy scoop for dogs.",
  },
  "/doggie-dental": {
    data: dogDentalProductData,
    imagePath: dogDentalProductData.gallery[0]?.src || DEFAULT_OG_IMAGE_PATH,
    description:
      "Buy PetPlus Doggie Dental Powder for fresh breath, plaque care and gum support. A simple pet wellness product for daily dog oral care routines at home.",
  },
  "/daily-duo": {
    data: dailyDuoProductData,
    imagePath: dailyDuoProductData.gallery[0]?.src || DEFAULT_OG_IMAGE_PATH,
    description:
      "Shop Daily Duo dog supplements India dog parents can use for immunity, digestion and dental care. Multivitamin plus daily oral support in one routine.",
  },
};

const PRODUCT_DATA_TO_ROUTE = new Map(
  Object.entries(PRODUCT_ROUTE_CONFIG).map(([routePath, productConfig]) => [
    productConfig.data.id,
    routePath,
  ])
);

const normalizeSeoText = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .trim();

const trimSeoText = (value = "", maxLength = 160) => {
  const normalizedValue = normalizeSeoText(value);

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}...`;
};

const buildProductSeoTitle = (product) => `${product.name} | Dog Supplements India | ${SITE_NAME}`;

const buildProductSeoDescription = (product, fallbackDescription = "") =>
  trimSeoText(
    fallbackDescription ||
      product?.description ||
      `Shop ${product?.name || "dog wellness products"} from ${SITE_NAME}.`
  );

const buildProductSeoConfig = (routePath) => {
  const productConfig = PRODUCT_ROUTE_CONFIG[routePath];
  const product = productConfig?.data;

  if (!productConfig || !product) {
    return null;
  }

  return {
    title: buildProductSeoTitle(product),
    description: buildProductSeoDescription(product, productConfig.description),
    imagePath: productConfig.imagePath,
    pageType: "Product",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Collection", path: "/collection" },
      { name: product.name, path: routePath },
    ],
  };
};

const collectionSeoHighlights = collectionCards
  .map((item) => item.title)
  .filter(Boolean)
  .slice(0, 3);

const PUBLIC_ROUTE_CONFIG = {
  "/": {
    title: "PetPlus | Dog Supplements India & Pet Wellness Products",
    description:
      "PetPlus offers dog supplements India trusts for immunity, digestion, mobility, skin, coat and dental care with simple daily pet wellness routines for dogs.",
    imagePath: "/Home/images/home-Starter-Duo.png",
    pageType: "WebPage",
    breadcrumbs: [{ name: "Home", path: "/" }],
  },
  "/collection": {
    title: `Shop Dog Supplements India | Pet Wellness Products | ${SITE_NAME}`,
    description:
      "Explore PetPlus dog supplements India dog parents can use for immunity, dental care, digestion, skin, coat and daily pet wellness routines across India.",
    imagePath: collectionCards[0]?.image || DEFAULT_OG_IMAGE_PATH,
    pageType: "CollectionPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Collection", path: "/collection" },
    ],
  },
  "/product": buildProductSeoConfig("/product"),
  "/doggie-dental": buildProductSeoConfig("/doggie-dental"),
  "/daily-duo": buildProductSeoConfig("/daily-duo"),
  "/science": {
    title: "Dog Wellness Science & Ingredients | PetPlus India",
    description:
      "Learn how PetPlus ingredients support dog immunity, digestion, joints, skin, coat and oral care with practical pet wellness science for India and daily care.",
    imagePath: "/Science/images/everyday.png",
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Science", path: "/science" },
    ],
  },
  "/ai-pet-health": {
    title: "AI Dog Health Assistant & Wellness Guide | PetPlus",
    description:
      "Ask the PetPlus AI dog health assistant about immunity, digestion, dental care and daily wellness routines for dogs in India using clear guidance at home.",
    imagePath: "/Home/images/Home-banner.png",
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "AI Pet Health Assistant", path: "/ai-pet-health" },
    ],
  },
  "/integrity": {
    title: "Dog Supplement Quality & Ingredient Integrity | PetPlus",
    description:
      "See how PetPlus chooses dog supplement ingredients, quality checks and pet wellness standards for safe daily routines for Indian dog parents online care.",
    imagePath: "/Integrity/images/dogi-img.jpg",
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Ingredient Integrity", path: "/integrity" },
    ],
  },
  "/our-story": {
    title: "Our Story | PetPlus Dog Wellness India",
    description:
      "Read the PetPlus story and why we build simple dog supplements and pet wellness products for everyday dog parents in India who want easy care online daily.",
    imagePath: "/OurStory/images/howit.jpg",
    pageType: "AboutPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Our Story", path: "/our-story" },
    ],
  },
  "/clinical-studies": {
    title: "Dog Supplement Studies & Formula Breakdown | PetPlus",
    description:
      "Explore PetPlus formula pages for dog immunity booster support, digestion, mobility, oral care and complete daily pet wellness routines for India care.",
    imagePath: "/Default/images/col4.png",
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Clinical Studies", path: "/clinical-studies" },
    ],
  },
  "/blog": {
    title: "Dog Care Blog India | Supplements & Wellness | PetPlus",
    description:
      "Read dog care tips on immunity, digestion, dental health, supplements and pet wellness products for Indian dog parents building daily routines at home.",
    imagePath: "/OurStory/images/story-banner.jpg",
    pageType: "Blog",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ],
  },
  "/faq": {
    title: "Dog Supplement FAQs India | PetPlus",
    description:
      "Find answers about PetPlus dog supplements India, ingredients, safety, dosage, subscriptions, shipping and pet wellness routines for dogs and daily care.",
    imagePath: "/Default/images/dogs4.avif",
    pageType: "FAQPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "FAQ", path: "/faq" },
    ],
  },
  "/quiz": {
    title: "Dog Wellness Quiz India | PetPlus",
    description:
      "Take the PetPlus dog wellness quiz to find supplements for immunity, digestion, dental care, skin, coat and daily health based on your dog today daily.",
    imagePath: "/Default/images/mkm.png",
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Quiz", path: "/quiz" },
    ],
  },
  "/contact": {
    title: "Contact PetPlus Support | Orders, Subscriptions & Product Help",
    description:
      "Contact PetPlus for dog supplement questions, orders, subscriptions, refunds, shipping, product safety and customer care for Indian dog parents online.",
    imagePath: "/Default/images/dogs4.avif",
    pageType: "ContactPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ],
  },
  "/glossary": {
    title: "Dog Supplement Ingredient Glossary | PetPlus India",
    description:
      "Understand dog supplement ingredients, immunity boosters, probiotics, dental support and pet wellness terms used by PetPlus products for daily care ideas.",
    imagePath: "/Glossary/images/banner.jpg",
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Glossary", path: "/glossary" },
    ],
  },
  "/terms": {
    title: "Terms and Conditions | PetPlus",
    description:
      "Review PetPlus terms for dog supplement orders, pricing, subscriptions, shipping, checkout, website use and customer policies in India online clearly.",
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Terms and Conditions", path: "/terms" },
    ],
  },
  "/refund-policy": {
    title: "Refund Policy | PetPlus",
    description:
      "Read the PetPlus refund policy for dog supplement orders, damaged products, delivery issues, replacement reviews and refund eligibility in India today.",
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Refund Policy", path: "/refund-policy" },
    ],
  },
  "/privacy-policy": {
    title: "Privacy Policy | PetPlus",
    description:
      "See how PetPlus protects customer, order, subscription, support and dog wellness quiz data for Indian pet parents using our website safely online care.",
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy" },
    ],
  },
  "/subscription-policy": {
    title: "Subscription Policy | PetPlus",
    description:
      "Understand PetPlus dog supplement subscriptions, recurring billing, renewals, plan changes, cancellations and discount rules for dog parents in India.",
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Subscription Policy", path: "/subscription-policy" },
    ],
  },
};

const NON_INDEXABLE_ROUTE_CONFIG = {
  "/cart": {
    title: "Cart | PetPlus",
    description: "Review your selected PetPlus products before secure checkout.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/login": {
    title: "Sign In | PetPlus",
    description: "Sign in to access your PetPlus account and saved dog wellness activity.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/register": {
    title: "Create Account | PetPlus",
    description: "Create your PetPlus account to save quiz results and subscription details.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/account": {
    title: "Account Dashboard | PetPlus",
    description: "Manage your PetPlus account, quiz results, and recurring orders.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/review": {
    title: "Write a Review | PetPlus",
    description: "Share your PetPlus product review and dog wellness experience.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/admin": {
    title: "Admin Dashboard | PetPlus",
    description: "Internal PetPlus admin dashboard.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/quizdesktop": {
    title: "Quiz Desktop Experience | PetPlus",
    description: "Internal desktop quiz experience for PetPlus.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/manage-subscription": {
    title: "Manage Subscription | PetPlus",
    description:
      "Open the PetPlus subscription management page to review cadence, billing, address, or renewal details.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/forgot-password": {
    title: "Reset Password | PetPlus",
    description: "Reset your PetPlus password with a secure one-time verification flow.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/verify-email": {
    title: "Verify Email | PetPlus",
    description:
      "Verify your PetPlus email address with the latest one-time code or verification link.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
  "/auth/callback": {
    title: "Signing You In | PetPlus",
    description: "Completing secure PetPlus sign-in.",
    robots: NOINDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    pageType: "WebPage",
  },
};

const NOT_FOUND_ROUTE_CONFIG = {
  title: "Page Not Found | PetPlus",
  description:
    "The page you requested could not be found. Explore PetPlus dog wellness products, quiz tools, or support pages instead.",
  robots: NOINDEX_ROBOTS,
  imagePath: DEFAULT_OG_IMAGE_PATH,
  pageType: "WebPage",
};

export const CANONICAL_PUBLIC_ROUTES = Object.keys(PUBLIC_ROUTE_CONFIG);
export const NON_INDEXABLE_ROUTES = Object.keys(NON_INDEXABLE_ROUTE_CONFIG);
export const ALL_KNOWN_ROUTES = [
  ...CANONICAL_PUBLIC_ROUTES,
  ...NON_INDEXABLE_ROUTES,
  ...Object.keys(SEO_REDIRECTS),
];

const normalizePathname = (pathname = "/") => {
  const cleanPath = String(pathname || "/").split("#")[0].split("?")[0].trim() || "/";

  if (cleanPath === "/") {
    return "/";
  }

  return cleanPath.replace(/\/+$/, "") || "/";
};

const toTitleCaseWords = (value = "") =>
  String(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getAbsoluteUrl = (pathOrUrl, siteOrigin = DEFAULT_SITE_URL) => {
  if (!pathOrUrl) {
    return siteOrigin;
  }

  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl, `${siteOrigin.replace(/\/+$/, "")}/`).toString();
  }
};

const getProductLowestPrice = (product) => {
  const prices = (product.sizes || []).flatMap((size) =>
    (size.plans || []).map((plan) => Number(plan.price || 0)).filter((price) => price > 0)
  );

  return prices.length > 0 ? Math.min(...prices) : 0;
};

const getProductHighestPrice = (product) => {
  const prices = (product.sizes || []).flatMap((size) =>
    (size.plans || []).map((plan) => Number(plan.price || 0)).filter((price) => price > 0)
  );

  return prices.length > 0 ? Math.max(...prices) : 0;
};

const getProductOfferCount = (product) =>
  (product.sizes || []).reduce(
    (totalOffers, size) => totalOffers + (Array.isArray(size.plans) ? size.plans.length : 0),
    0
  );

const buildSiteSchemas = (siteOrigin) => {
  const absoluteLogoUrl = getAbsoluteUrl(BRAND_LOGO_PATH, siteOrigin);

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: SITE_NAME,
      url: siteOrigin,
      email: SUPPORT_EMAIL,
      logo: {
        "@type": "ImageObject",
        url: absoluteLogoUrl,
        contentUrl: absoluteLogoUrl,
        width: 512,
        height: 512,
        caption: `${SITE_NAME} logo`,
      },
      image: absoluteLogoUrl,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: SUPPORT_EMAIL,
          areaServed: STORE_COUNTRY,
          availableLanguage: ["en-IN", "en"],
        },
      ],
      areaServed: STORE_COUNTRY,
      knowsAbout: [
        "dog supplements India",
        "pet wellness products",
        "dog immunity booster",
        "dog digestion support",
        "dog dental care",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      name: SITE_NAME,
      alternateName: `${SITE_NAME} ${SITE_TAGLINE}`,
      url: siteOrigin,
      inLanguage: SITE_LANGUAGE,
      publisher: {
        "@id": `${siteOrigin}/#organization`,
      },
    },
  ];
};

const buildBreadcrumbSchema = (breadcrumbs, siteOrigin) => {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: getAbsoluteUrl(crumb.path, siteOrigin),
    })),
  };
};

const buildCollectionSchema = (siteOrigin) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "PetPlus Collection",
  description: PUBLIC_ROUTE_CONFIG["/collection"].description,
  url: getAbsoluteUrl("/collection", siteOrigin),
  inLanguage: SITE_LANGUAGE,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: collectionCards.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteUrl(
        PRODUCT_DATA_TO_ROUTE.get(item.productId) || item.route || "/collection",
        siteOrigin
      ),
      name: item.title,
    })),
  },
});

const buildProductSchema = (routePath, siteOrigin) => {
  const productConfig = PRODUCT_ROUTE_CONFIG[routePath];

  if (!productConfig) {
    return null;
  }

  const product = productConfig.data;
  const lowPrice = getProductLowestPrice(product);
  const highPrice = getProductHighestPrice(product);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${getAbsoluteUrl(routePath, siteOrigin)}#product`,
    name: product.name,
    description: product.description,
    image: (product.gallery || []).map((image) => getAbsoluteUrl(image.src, siteOrigin)),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: "Dog supplement",
    review: {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Verified dog parent",
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: Number(product.review?.rating || 0),
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody:
        product.reviewSchemaText ||
        `${product.name} is reviewed by dog parents using PetPlus as part of a daily pet wellness routine.`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(product.review?.rating || 0),
      reviewCount: Number(product.review?.count || 0),
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: STORE_CURRENCY,
      lowPrice: Number(lowPrice.toFixed(2)),
      highPrice: Number(highPrice.toFixed(2)),
      offerCount: getProductOfferCount(product),
      availability: "https://schema.org/InStock",
      url: getAbsoluteUrl(routePath, siteOrigin),
      seller: {
        "@id": `${siteOrigin}/#organization`,
      },
    },
  };
};

const buildFaqSchema = (items = [...subscriptionFaq, ...productFaq]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

const getProductFaqItems = (product) =>
  Array.isArray(product?.faq) && product.faq.length > 0 ? product.faq : productFaq;

const buildHomeFaqSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

const buildGenericWebPageSchema = (seo, siteOrigin, pathname) => ({
  "@context": "https://schema.org",
  "@type": seo.pageType || "WebPage",
  name: seo.title,
  description: seo.description,
  url: getAbsoluteUrl(pathname, siteOrigin),
  inLanguage: SITE_LANGUAGE,
  isPartOf: {
    "@id": `${siteOrigin}/#website`,
  },
});

const buildBlogSchema = (siteOrigin) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "PetPlus Blog",
  description: PUBLIC_ROUTE_CONFIG["/blog"].description,
  url: getAbsoluteUrl("/blog", siteOrigin),
  inLanguage: SITE_LANGUAGE,
});

export const getCanonicalPath = (pathname = "/") => {
  const normalizedPath = normalizePathname(pathname);
  return SEO_REDIRECTS[normalizedPath] || normalizedPath;
};

export const isKnownRoute = (pathname = "/") =>
  ALL_KNOWN_ROUTES.includes(normalizePathname(pathname));

export const isIndexableRoute = (pathname = "/") =>
  CANONICAL_PUBLIC_ROUTES.includes(getCanonicalPath(pathname));

export const getRobotsDirectiveForPath = (pathname = "/") => {
  const normalizedPath = normalizePathname(pathname);
  const canonicalPath = getCanonicalPath(normalizedPath);

  if (PUBLIC_ROUTE_CONFIG[canonicalPath]) {
    return PUBLIC_ROUTE_CONFIG[canonicalPath].robots || INDEXABLE_ROBOTS;
  }

  if (NON_INDEXABLE_ROUTE_CONFIG[canonicalPath]) {
    return NON_INDEXABLE_ROUTE_CONFIG[canonicalPath].robots || NOINDEX_ROBOTS;
  }

  return NOT_FOUND_ROUTE_CONFIG.robots || NOINDEX_ROBOTS;
};

export const getSeoPayload = (pathname = "/", siteOrigin = DEFAULT_SITE_URL) => {
  const normalizedPath = normalizePathname(pathname);
  const canonicalPath = getCanonicalPath(normalizedPath);
  const seoBase =
    PUBLIC_ROUTE_CONFIG[canonicalPath] ||
    NON_INDEXABLE_ROUTE_CONFIG[canonicalPath] ||
    NOT_FOUND_ROUTE_CONFIG;
  const pageTitle = seoBase.title || `${SITE_NAME} | ${SITE_TAGLINE}`;
  const canonicalUrl =
    seoBase === NOT_FOUND_ROUTE_CONFIG
      ? null
      : getAbsoluteUrl(canonicalPath, siteOrigin.replace(/\/+$/, ""));
  const imageUrl = getAbsoluteUrl(seoBase.imagePath || DEFAULT_OG_IMAGE_PATH, siteOrigin);
  const breadcrumbs = Array.isArray(seoBase.breadcrumbs)
    ? seoBase.breadcrumbs
    : seoBase === NOT_FOUND_ROUTE_CONFIG
      ? [{ name: "Home", path: "/" }, { name: "Page Not Found", path: canonicalPath }]
      : [
          { name: "Home", path: "/" },
          { name: toTitleCaseWords(canonicalPath.replace(/^\//, "")), path: canonicalPath },
        ];

  const structuredData = [...buildSiteSchemas(siteOrigin)];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs, siteOrigin);

  if (breadcrumbSchema) {
    structuredData.push(breadcrumbSchema);
  }

  if (canonicalPath === "/") {
    structuredData.push(buildGenericWebPageSchema(seoBase, siteOrigin, canonicalPath));
    structuredData.push(buildHomeFaqSchema());
  } else if (canonicalPath === "/collection") {
    structuredData.push(buildCollectionSchema(siteOrigin));
  } else if (PRODUCT_ROUTE_CONFIG[canonicalPath]) {
    const product = PRODUCT_ROUTE_CONFIG[canonicalPath].data;
    structuredData.push(buildProductSchema(canonicalPath, siteOrigin));
    structuredData.push(buildFaqSchema(getProductFaqItems(product)));
  } else if (canonicalPath === "/faq") {
    structuredData.push(buildFaqSchema());
  } else if (canonicalPath === "/blog") {
    structuredData.push(buildBlogSchema(siteOrigin));
  } else {
    structuredData.push(buildGenericWebPageSchema(seoBase, siteOrigin, canonicalPath));
  }

  return {
    path: normalizedPath,
    canonicalPath,
    title: pageTitle,
    description: seoBase.description,
    robots: seoBase.robots || INDEXABLE_ROBOTS,
    imageUrl,
    imageAlt: pageTitle,
    canonicalUrl,
    siteOrigin: siteOrigin.replace(/\/+$/, ""),
    pageType: seoBase.pageType || "WebPage",
    breadcrumbs,
    structuredData,
  };
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeHtmlAttribute = (value = "") =>
  escapeHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const stringifyStructuredData = (structuredData) =>
  JSON.stringify(structuredData).replace(/</g, "\\u003c");

export const renderSeoHead = (pathname = "/", siteOrigin = DEFAULT_SITE_URL) => {
  const seo = getSeoPayload(pathname, siteOrigin);
  const headTags = [
    `    <title>${escapeHtml(seo.title)}</title>`,
    `    <meta name="description" content="${escapeHtmlAttribute(seo.description)}" />`,
    `    <meta name="robots" content="${escapeHtmlAttribute(seo.robots)}" />`,
    `    <meta name="googlebot" content="${escapeHtmlAttribute(seo.robots)}" />`,
    `    <meta name="author" content="${escapeHtmlAttribute(SITE_NAME)}" />`,
    `    <meta name="application-name" content="${escapeHtmlAttribute(SITE_NAME)}" />`,
    `    <meta property="og:locale" content="${escapeHtmlAttribute(OG_LOCALE)}" />`,
    `    <meta property="og:site_name" content="${escapeHtmlAttribute(SITE_NAME)}" />`,
    `    <meta property="og:title" content="${escapeHtmlAttribute(seo.title)}" />`,
    `    <meta property="og:description" content="${escapeHtmlAttribute(seo.description)}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:image" content="${escapeHtmlAttribute(seo.imageUrl)}" />`,
    `    <meta property="og:image:alt" content="${escapeHtmlAttribute(seo.imageAlt)}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeHtmlAttribute(seo.title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtmlAttribute(seo.description)}" />`,
    `    <meta name="twitter:image" content="${escapeHtmlAttribute(seo.imageUrl)}" />`,
  ];

  if (seo.canonicalUrl) {
    headTags.push(
      `    <link rel="canonical" href="${escapeHtmlAttribute(seo.canonicalUrl)}" />`,
      `    <link rel="alternate" hreflang="${escapeHtmlAttribute(SITE_LANGUAGE)}" href="${escapeHtmlAttribute(seo.canonicalUrl)}" />`,
      `    <link rel="alternate" hreflang="x-default" href="${escapeHtmlAttribute(seo.canonicalUrl)}" />`,
      `    <meta property="og:url" content="${escapeHtmlAttribute(seo.canonicalUrl)}" />`
    );
  }

  headTags.push(
    `    <script id="seo-schema" type="application/ld+json">${stringifyStructuredData(
      seo.structuredData
    )}</script>`
  );

  return headTags.join("\n");
};
