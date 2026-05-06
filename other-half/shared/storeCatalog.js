import {
  dailyDuoProductData,
  dogDentalProductData,
  everydayProductData,
} from "../src/productData.js";
import { getCadenceDetails } from "./subscriptionUtils.js";

const DEFAULT_AVAILABILITY = Object.freeze({
  status: "in_stock",
  message: "In stock and ready to ship.",
  notifyTitle: "Notify me when available",
  notifyDescription:
    "Leave your email and we'll send you a restock alert as soon as it is back.",
  relatedProductIds: [],
});

const normalizeCatalogValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const normalizeAvailability = (availability = {}) => {
  const status =
    String(availability?.status || DEFAULT_AVAILABILITY.status).trim().toLowerCase() ===
    "out_of_stock"
      ? "out_of_stock"
      : "in_stock";

  return {
    status,
    message: String(
      availability?.message ||
        (status === "out_of_stock"
          ? "This product is currently out of stock."
          : DEFAULT_AVAILABILITY.message)
    ).trim(),
    notifyTitle: String(
      availability?.notifyTitle || DEFAULT_AVAILABILITY.notifyTitle
    ).trim(),
    notifyDescription: String(
      availability?.notifyDescription || DEFAULT_AVAILABILITY.notifyDescription
    ).trim(),
    relatedProductIds: [
      ...new Set(
        (Array.isArray(availability?.relatedProductIds)
          ? availability.relatedProductIds
          : []
        )
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      ),
    ],
  };
};

const collectionOverrides = {
  "everyday-one": {
    route: "/product",
    tag: "Best Seller",
    tagColor: "bg-orange-500",
    image: "/Default/images/col1.webp",
    hoverImage: "/Default/images/col5hov.png",
    rating: 4.9,
    reviews: 429,
    badges: ["Immunity Boost", "Digestive Health", "Overall Wellness"],
    collectionDescription: "All-in-one daily wellness support for digestion, immunity, and mobility.",
    aliases: [
      "everyday-one",
      "45 in 1 everyday daily multivitamin",
      "everyday daily multivitamin",
      "everyday wellness plan",
    ],
  },
  "doggie-dental": {
    route: "/doggie-dental",
    tag: "Oral Care",
    tagColor: "bg-blue-500",
    image: "/Default/images/col2.webp",
    hoverImage: "/Default/images/col5hov.png",
    rating: 4.9,
    reviews: 429,
    badges: ["Bad Breath", "Plaque Support", "No-Brush Routine"],
    collectionDescription: "Daily oral care support for breath, plaque, tartar, and gum comfort.",
    aliases: [
      "doggie-dental",
      "doggie dental powder",
      "doggie dental powder - fresh breath & oral care",
    ],
  },
  "daily-duo": {
    route: "/daily-duo",
    tag: "Bundle & Save",
    tagColor: "bg-pink-600",
    image: "/Home/images/daily-duo-img.webp",
    hoverImage: "/Default/images/col5hov.png",
    rating: 4.9,
    reviews: 429,
    badges: ["Body + Mouth Support", "Best Value", "Repeat-Friendly Routine"],
    collectionDescription: "A stronger daily stack that pairs full-body wellness with oral care.",
    aliases: [
      "daily-duo",
      "daily duo",
      "daily duo bundle",
      "daily duo: multivitamin + dental powder",
    ],
  },
};

const rawProducts = [
  everydayProductData,
  dogDentalProductData,
  dailyDuoProductData,
];

const buildProductCatalogEntry = (product) => {
  const overrides = collectionOverrides[product.id];
  const availability = normalizeAvailability(product.availability);
  const sizes = Array.isArray(product.sizes)
    ? product.sizes.map((size) => ({
        id: size.id,
        name: size.name,
        weight: size.weight,
        icon: size.icon,
        plans: Array.isArray(size.plans)
          ? size.plans.map((plan) => {
              const cadence = getCadenceDetails({
                planId: plan.id,
                deliveryLabel: plan.deliveryLabel,
              });

              return {
                id: plan.id,
                label: plan.label,
                deliveryLabel: plan.deliveryLabel,
                perDayLabel: plan.perDayLabel,
                offerLabel: plan.offerLabel || "",
                badgeLabel: plan.badgeLabel || "",
                price: Number(plan.price || 0),
                compareAtPrice: Number(plan.compareAtPrice || 0),
                savingsAmount: Number(plan.savingsAmount || 0),
                inStock: plan.inStock !== false,
                outOfStockMessage: String(plan.outOfStockMessage || "").trim(),
                billingIntervalUnit: cadence.intervalUnit,
                billingIntervalCount: cadence.intervalCount,
                deliveryCadence: cadence.cadenceLabel,
              };
            })
          : [],
      }))
    : [];
  const defaultSize =
    sizes.find((size) => size.plans.some((plan) => plan.inStock !== false)) || sizes[0] || null;
  const defaultPlan =
    defaultSize?.plans.find((plan) => plan.inStock !== false) || defaultSize?.plans[0] || null;
  const defaultPurchaseType = product.subscription?.enabledByDefault
    ? "subscription"
    : "one-time";

  return {
    productId: product.id,
    productName: product.name,
    route: overrides?.route || "/product",
    reviewHref: `/?reviewsProduct=${encodeURIComponent(product.id)}#reviews`,
    image: overrides?.image || product.gallery?.[0]?.src || "",
    hoverImage: overrides?.hoverImage || overrides?.image || product.gallery?.[1]?.src || "",
    rating: Number(overrides?.rating || product.review?.rating || 0),
    reviews: Number(overrides?.reviews || product.review?.count || 0),
    tag: overrides?.tag || "",
    tagColor: overrides?.tagColor || "",
    badges: overrides?.badges || [],
    collectionDescription: overrides?.collectionDescription || product.description || "",
    aliases: overrides?.aliases || [product.id, product.name],
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    sizes,
    bundleSuggestions: Array.isArray(product.bundleSuggestions)
      ? product.bundleSuggestions.map((bundle) => ({
          id: bundle.id,
          title: bundle.title,
          subtitle: bundle.subtitle || "",
          image: bundle.image || "",
          price: Number(bundle.price || 0),
          compareAtPrice: Number(bundle.compareAtPrice || 0),
          badgeLabel: bundle.badgeLabel || "",
        }))
      : [],
    availability,
    subscription: {
      title: product.subscription?.title || "Subscribe & Save",
      description: product.subscription?.description || "",
      enabledByDefault: Boolean(product.subscription?.enabledByDefault),
    },
    defaultSelection: {
      sizeId: defaultSize?.id || "",
      sizeLabel: defaultSize?.name || "",
      sizeWeight: defaultSize?.weight || "",
      planId: defaultPlan?.id || "",
      planLabel: defaultPlan?.label || "",
      deliveryLabel: defaultPlan?.deliveryLabel || "",
      deliveryCadence: defaultPlan?.deliveryCadence || "",
      billingIntervalUnit: defaultPlan?.billingIntervalUnit || "month",
      billingIntervalCount: defaultPlan?.billingIntervalCount || 1,
      inStock: defaultPlan?.inStock !== false,
      outOfStockMessage: defaultPlan?.outOfStockMessage || "",
      purchaseType: defaultPurchaseType,
    },
    pricing: {
      unitCompareAtPrice: Number(product.pricing?.unitCompareAtPrice || 0),
      unitDiscountedPrice: Number(product.pricing?.unitDiscountedPrice || 0),
      discountPercent: Number(product.pricing?.discountPercent || 0),
      startingCompareAtPrice: Number(defaultPlan?.compareAtPrice || 0),
      startingSavingsAmount: Number(defaultPlan?.savingsAmount || 0),
      startingDiscountLabel: defaultPlan?.offerLabel || "",
    },
  };
};

export const storeCatalog = rawProducts.map(buildProductCatalogEntry);

export const storeCatalogById = Object.fromEntries(
  storeCatalog.map((entry) => [entry.productId, entry])
);

export const collectionCards = storeCatalog.map((entry) => {
  const defaultSize =
    entry.sizes.find((size) => size.id === entry.defaultSelection.sizeId) || entry.sizes[0];
  const defaultPlan =
    defaultSize?.plans.find((plan) => plan.id === entry.defaultSelection.planId) ||
    defaultSize?.plans[0];

  return {
    productId: entry.productId,
    title: entry.productName,
    route: entry.route,
    tag: entry.tag,
    tagColor: entry.tagColor,
    image: entry.image,
    hoverImage: entry.hoverImage,
    rating: entry.rating,
    reviews: entry.reviews,
    badges: entry.badges,
    description: entry.collectionDescription,
    availability: entry.availability,
    defaultSelection: {
      ...entry.defaultSelection,
      sizeId: defaultSize?.id || "",
      sizeLabel: defaultSize?.name || "",
      sizeWeight: defaultSize?.weight || "",
      planId: defaultPlan?.id || "",
      planLabel: defaultPlan?.label || "",
      deliveryLabel: defaultPlan?.deliveryLabel || "",
      deliveryCadence: defaultPlan?.deliveryCadence || "",
      billingIntervalUnit: defaultPlan?.billingIntervalUnit || "month",
      billingIntervalCount: defaultPlan?.billingIntervalCount || 1,
      inStock: defaultPlan?.inStock !== false,
      outOfStockMessage: defaultPlan?.outOfStockMessage || "",
    },
    startingPrice: Number(defaultPlan?.price || 0),
    startingCompareAtPrice: Number(defaultPlan?.compareAtPrice || 0),
    startingSavingsAmount: Number(defaultPlan?.savingsAmount || 0),
    startingDiscountLabel: defaultPlan?.offerLabel || "",
    displayPrice: Number(
      entry.pricing?.unitDiscountedPrice || defaultPlan?.price || 0
    ),
    displayCompareAtPrice: Number(entry.pricing?.unitCompareAtPrice || 0),
    displayDiscountLabel: entry.pricing?.discountPercent
      ? `${entry.pricing.discountPercent}% OFF`
      : "",
    subscriptionEnabledByDefault: Boolean(entry.subscription.enabledByDefault),
  };
});

export const resolveStoreProduct = ({ productId = "", productName = "" } = {}) => {
  const normalizedId = normalizeCatalogValue(productId);

  if (normalizedId && storeCatalogById[normalizedId]) {
    return storeCatalogById[normalizedId];
  }

  const normalizedName = normalizeCatalogValue(productName);

  if (!normalizedName) {
    return null;
  }

  return (
    storeCatalog.find((entry) =>
      entry.aliases.some((alias) => normalizeCatalogValue(alias) === normalizedName)
    ) || null
  );
};

const getResolvedSelection = (entry, { sizeId = "", planId = "" } = {}) => {
  const defaultSize =
    entry.sizes.find((size) => size.id === entry.defaultSelection.sizeId) || entry.sizes[0];
  const size = entry.sizes.find((candidate) => candidate.id === sizeId) || defaultSize;
  const defaultPlan =
    size?.plans.find((plan) => plan.id === entry.defaultSelection.planId) || size?.plans[0];
  const plan = size?.plans.find((candidate) => candidate.id === planId) || defaultPlan;

  if (!size || !plan) {
    return null;
  }

  return { size, plan };
};

export const resolveCatalogLineItem = ({
  productId = "",
  productName = "",
  sizeId = "",
  planId = "",
  purchaseType = "one-time",
  bundleIds = [],
} = {}) => {
  const entry = resolveStoreProduct({ productId, productName });

  if (!entry) {
    return null;
  }

  const selection = getResolvedSelection(entry, { sizeId, planId });

  if (!selection) {
    return null;
  }

  const normalizedPurchaseType =
    String(purchaseType || "").trim().toLowerCase() === "subscription"
      ? "subscription"
      : "one-time";
  const normalizedBundleIds = [
    ...new Set(
      (Array.isArray(bundleIds) ? bundleIds : [])
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    ),
  ];
  const selectedBundles = entry.bundleSuggestions.filter((bundle) =>
    normalizedBundleIds.includes(bundle.id)
  );
  const bundleLabels = selectedBundles.map((bundle) => bundle.title);
  const bundleTotal = selectedBundles.reduce(
    (runningTotal, bundle) =>
      runningTotal +
      Number(
        normalizedPurchaseType === "subscription"
          ? bundle.price || 0
          : bundle.compareAtPrice || bundle.price || 0
      ),
    0
  );
  const basePlanPrice =
    normalizedPurchaseType === "subscription"
      ? Number(selection.plan.price || 0)
      : Number(selection.plan.compareAtPrice || selection.plan.price || 0);
  const unitPrice = Number((basePlanPrice + bundleTotal).toFixed(2));
  const lineDescription = [
    `${selection.size.name} (${selection.size.weight})`,
    selection.plan.label,
    normalizedPurchaseType === "subscription" ? entry.subscription.title : "One-time purchase",
    bundleLabels.length > 0 ? `Bundles: ${bundleLabels.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    productId: entry.productId,
    productName: entry.productName,
    route: entry.route,
    image: entry.image,
    description: lineDescription,
    unitPrice,
    bundleTotal: Number(bundleTotal.toFixed(2)),
    bundleIds: selectedBundles.map((bundle) => bundle.id),
    bundleLabels,
    purchaseType: normalizedPurchaseType,
    sizeId: selection.size.id,
    sizeLabel: selection.size.name,
    sizeWeight: selection.size.weight,
    planId: selection.plan.id,
    planLabel: selection.plan.label,
    deliveryLabel: selection.plan.deliveryLabel,
    deliveryCadence: selection.plan.deliveryCadence,
    billingIntervalUnit: selection.plan.billingIntervalUnit,
    billingIntervalCount: selection.plan.billingIntervalCount,
    inStock: selection.plan.inStock !== false,
    outOfStockMessage: selection.plan.outOfStockMessage || "",
  };
};
