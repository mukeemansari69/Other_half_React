import { getCadenceDetails } from "../shared/subscriptionUtils.js";
import {
  MADE_IN_LABEL,
  PAYMENT_PROVIDER,
  convertLegacyUsdPrice,
  formatStoreCurrency,
  getDeliveryWindowText,
  getFreeShippingText,
} from "../shared/storefrontConfig.js";

const POUNDS_TO_KILOGRAMS = 0.45359237;

const toKilograms = (value) => Math.round(Number(value) * POUNDS_TO_KILOGRAMS);

const localizeWeightLabel = (weightLabel = "") => {
  const plusMatch = String(weightLabel).match(/(\d+)\+\s*lbs?/i);

  if (plusMatch) {
    return `${toKilograms(plusMatch[1])}+ kg`;
  }

  const rangeMatch = String(weightLabel).match(/(\d+)\s*-\s*(\d+)\s*lbs?/i);

  if (rangeMatch) {
    return `${toKilograms(rangeMatch[1])}-${toKilograms(rangeMatch[2])} kg`;
  }

  return weightLabel;
};

const getPlanDays = (plan) => {
  const cadence = getCadenceDetails({
    planId: plan?.id,
    deliveryLabel: plan?.deliveryLabel,
  });

  if (cadence.intervalUnit === "week") {
    return cadence.intervalCount * 7;
  }

  if (cadence.intervalUnit === "year") {
    return cadence.intervalCount * 365;
  }

  return cadence.intervalCount * 30;
};

const formatPerDayLabel = (price, plan) => {
  const planDays = getPlanDays(plan);

  if (!planDays) {
    return `${formatStoreCurrency(price)}/cycle`;
  }

  const perDayPrice = price / planDays;

  return `(${formatStoreCurrency(perDayPrice, {
    minimumFractionDigits: perDayPrice < 100 ? 2 : 0,
    maximumFractionDigits: perDayPrice < 100 ? 2 : 0,
  })}/day)`;
};

const PRODUCT_MARKETING_PRICING = {
  "everyday-one": {
    unitPrice: 300,
    discountPercent: 15,
  },
  "doggie-dental": {
    unitPrice: 150,
    discountPercent: 18,
  },
  "daily-duo": {
    unitPrice: 450,
    discountPercent: 20,
  },
};

const roundStorePrice = (value) => Number((Number(value) || 0).toFixed(2));

const getPlanIntervalCountInMonths = (plan) => {
  const cadence = getCadenceDetails({
    planId: plan?.id,
    deliveryLabel: plan?.deliveryLabel,
  });

  if (cadence.intervalUnit === "month") {
    return cadence.intervalCount;
  }

  if (cadence.intervalUnit === "year") {
    return cadence.intervalCount * 12;
  }

  if (cadence.intervalUnit === "week") {
    return cadence.intervalCount / 4;
  }

  return cadence.intervalCount / 30;
};

const getPlanSavingsAmount = (plan, pricingRule) => {
  if (!pricingRule) {
    return 0;
  }

  const currentPlanMonths = Math.max(
    1,
    Math.round(getPlanIntervalCountInMonths(plan) || 1)
  );
  const compareAtPrice = pricingRule.unitPrice * currentPlanMonths;
  const discountedPrice =
    compareAtPrice * (1 - pricingRule.discountPercent / 100);

  return roundStorePrice(compareAtPrice - discountedPrice);
};

const localizePlan = (plan, pricingRule) => {
  const cadence = getCadenceDetails({
    planId: plan.id,
    deliveryLabel: plan.deliveryLabel,
  });
  const monthsInPlan = Math.max(
    1,
    Math.round(getPlanIntervalCountInMonths(plan) || 1)
  );

  if (!pricingRule) {
    const localizedPrice = convertLegacyUsdPrice(plan.price);

    return {
      ...plan,
      price: localizedPrice,
      compareAtPrice: null,
      savingsAmount: 0,
      deliveryLabel: `Delivered every ${cadence.intervalCount} ${cadence.intervalUnit}${
        cadence.intervalCount > 1 ? "s" : ""
      }`,
      perDayLabel: formatPerDayLabel(localizedPrice, plan),
      offerLabel: plan.offerLabel,
    };
  }

  const compareAtPrice = roundStorePrice(pricingRule.unitPrice * monthsInPlan);
  const discountedPrice = roundStorePrice(
    compareAtPrice * (1 - pricingRule.discountPercent / 100)
  );
  const savingsAmount = getPlanSavingsAmount(plan, pricingRule);

  return {
    ...plan,
    price: discountedPrice,
    compareAtPrice,
    savingsAmount,
    deliveryLabel: `Delivered every ${cadence.intervalCount} ${cadence.intervalUnit}${
      cadence.intervalCount > 1 ? "s" : ""
    }`,
    perDayLabel: formatPerDayLabel(discountedPrice, plan),
    offerLabel: pricingRule ? `${pricingRule.discountPercent}% OFF` : plan.offerLabel,
  };
};

const localizeBundleSuggestion = (bundleSuggestion) => ({
  ...bundleSuggestion,
  price: roundStorePrice(bundleSuggestion.price),
  compareAtPrice: roundStorePrice(bundleSuggestion.compareAtPrice),
});

const applyIndiaStorefront = (product) => {
  const pricingRule = PRODUCT_MARKETING_PRICING[product.id] || null;

  product.sizes = product.sizes.map((size) => ({
    ...size,
    weight: localizeWeightLabel(size.weight),
    plans: size.plans.map((plan) => localizePlan(plan, pricingRule)),
  }));
  product.shippingNote = getDeliveryWindowText();
  const unitCompareAtPrice = Number(pricingRule?.unitPrice || 0);
  const unitDiscountedPrice = pricingRule
    ? roundStorePrice(
        unitCompareAtPrice * (1 - pricingRule.discountPercent / 100)
      )
    : 0;
  product.pricing = {
    unitCompareAtPrice,
    unitDiscountedPrice,
    discountPercent: pricingRule?.discountPercent || null,
  };
  product.subscription = {
    ...product.subscription,
    description: `${product.subscription.description} Secure checkout powered by ${PAYMENT_PROVIDER}.`,
  };
  product.cta = {
    ...product.cta,
    shopPayLabel:
      product.id === "daily-duo"
        ? `Pay Bundle with ${PAYMENT_PROVIDER}`
        : `Pay with ${PAYMENT_PROVIDER}`,
  };
  product.guaranteeBadges = product.guaranteeBadges.map((badge) => {
    if (badge.id === "shipping") {
      return {
        ...badge,
        title: getFreeShippingText(),
      };
    }

    if (badge.id === "origin") {
      return {
        ...badge,
        title: MADE_IN_LABEL,
      };
    }

    return badge;
  });
  product.bundleSuggestions = product.bundleSuggestions.map(localizeBundleSuggestion);

  return product;
};

export const everydayProductData = {
  id: "everyday-one",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/collection" },
    { label: "Everyday Daily Multivitamin" },
  ],

  name: "45 in 1 Everyday Daily Multivitamin",

  review: {
    rating: 4.7,
    count: 1248,
    href: "#reviews",
  },

  gallery: [
    { id: "g1", src: "/Home/images/everyday.png", alt: "Front View" },
    { id: "g2", src: "/Product/images/p1.png", alt: "Back View" },
    { id: "g3", src: "/Home/images/everyday.png", alt: "Usage" },
    { id: "g4", src: "/Home/images/everyday.png", alt: "Ingredients" },
  ],

  qualityHighlights: [
    {
      id: "clinically-tested",
      title: "Clinically Tested Ingredients",
      iconKey: "clinicallyTested",
    },
    {
      id: "human-grade",
      title: "Human-Grade Quality",
      iconKey: "humanGrade",
    },
    {
      id: "vet-recommended",
      title: "Vet Recommended",
      iconKey: "vetRecommended",
    },
  ],

  tags: [
    "Bovine Colostrum",
    "Spirulina",
    "Turmeric",
    "Ashwagandha",
    "Glucosamine",
    "MSM",
    "Probiotics",
    "Pumpkin",
  ],

  description:
    "Everyday Multivitamin is a powerful all-in-one supplement designed to support your dog’s overall health. Packed with 45 essential nutrients, it helps improve joint mobility, digestion, immunity, skin, and coat health. Made with human-grade ingredients and a delicious bacon & pumpkin flavor your dog will love.",

  benefits: [
    {
      id: "mobility",
      icon: "/Product/images/icon1.png",
      text: "Joint Mobility Support",
    },
    {
      id: "immunity",
      icon: "/Product/images/immunity (1) 1.png",
      text: "Stronger Immunity",
    },
    {
      id: "allergies",
      icon: "/Product/images/allergies 1.png",
      text: "Allergy Relief",
    },
    {
      id: "coat",
      icon: "/Product/images/pl.jpg",
      text: "Healthy Skin & Coat",
    },
    {
      id: "digestion",
      icon: "/Product/images/stomach 1.png",
      text: "Better Digestion",
    },
    {
      id: "aging",
      icon: "/Product/images/love 1.png",
      text: "Supports Healthy Aging",
    },
  ],
  sizes: [
    {
      id: "small",
      name: "Small",
      weight: "0-25 lbs",
      icon: "/Product/images/d1.png",
      plans: [
        {
          id: "2m",
          label: "2 Month supply",
          deliveryLabel: "Delivered Every Two Month",
          perDayLabel: "($0.58/day)",
          price: 35.19,
          offerLabel: "10% OFF",
        },
        {
          id: "4m",
          label: "4 Month supply",
          deliveryLabel: "Delivered Every Four Month",
          perDayLabel: "($0.56/day)",
          price: 67.98,
          offerLabel: "15% OFF",
          badgeLabel: "Most Popular",
        },
        {
          id: "6m",
          label: "6 Month supply",
          deliveryLabel: "Delivered Every Six Month",
          perDayLabel: "($0.55/day)",
          price: 98.37,
          offerLabel: "20% OFF",
          badgeLabel: "Best Value",
        },
      ],
    },
    {
      id: "medium",
      name: "Medium",
      weight: "25-75 lbs",
      icon: "/Product/images/d2.png",
      plans: [
        {
          id: "2m",
          label: "2 Month supply",
          deliveryLabel: "Delivered Every Two Month",
          perDayLabel: "($0.81/day)",
          price: 52.79,
          offerLabel: "10% OFF",
        },
        {
          id: "4m",
          label: "4 Month supply",
          deliveryLabel: "Delivered Every Four Month",
          perDayLabel: "($0.79/day)",
          price: 101.6,
          offerLabel: "15% OFF",
          badgeLabel: "Most Popular",
        },
        {
          id: "6m",
          label: "6 Month supply",
          deliveryLabel: "Delivered Every Six Month",
          perDayLabel: "($0.76/day)",
          price: 148.27,
          offerLabel: "20% OFF",
          badgeLabel: "Best Value",
        },
      ],
    },
    {
      id: "large",
      name: "Large",
      weight: "75-100 lbs",
      icon: "/Product/images/d3.png",
      plans: [
        {
          id: "2m",
          label: "2 Month supply",
          deliveryLabel: "Delivered Every Two Month",
          perDayLabel: "($1.08/day)",
          price: 70.38,
          offerLabel: "10% OFF",
        },
        {
          id: "4m",
          label: "4 Month supply",
          deliveryLabel: "Delivered Every Four Month",
          perDayLabel: "($1.03/day)",
          price: 133.96,
          offerLabel: "15% OFF",
          badgeLabel: "Most Popular",
        },
        {
          id: "6m",
          label: "6 Month supply",
          deliveryLabel: "Delivered Every Six Month",
          perDayLabel: "($0.99/day)",
          price: 193.77,
          offerLabel: "20% OFF",
          badgeLabel: "Best Value",
        },
      ],
    },
    {
      id: "xl",
      name: "XL",
      weight: "101+ lbs",
      icon: "/Product/images/d4.png",
      plans: [
        {
          id: "2m",
          label: "2 Month supply",
          deliveryLabel: "Delivered Every Two Month",
          perDayLabel: "($1.29/day)",
          price: 84.3,
          offerLabel: "10% OFF",
        },
        {
          id: "4m",
          label: "4 Month supply",
          deliveryLabel: "Delivered Every Four Month",
          perDayLabel: "($1.22/day)",
          price: 160.17,
          offerLabel: "15% OFF",
          badgeLabel: "Most Popular",
        },
        {
          id: "6m",
          label: "6 Month supply",
          deliveryLabel: "Delivered Every Six Month",
          perDayLabel: "($1.17/day)",
          price: 230.94,
          offerLabel: "20% OFF",
          badgeLabel: "Best Value",
        },
      ],
    },
  ],
  shippingNote: "Ships within 24 hours from USA 🚀",

  subscription: {
    title: "Subscribe & Save",
    description: "Pause, skip or cancel anytime.",
    enabledByDefault: true,
  },

  cta: {
    addToCartLabel: "Add to Cart",
    shopPayLabel: `Pay with ${PAYMENT_PROVIDER}`,
    cartHref: "/cart",
  },

  guaranteeBadges: [
    {
      id: "shipping",
      iconKey: "shipping",
      title: getFreeShippingText(),
    },
    {
      id: "guarantee",
      iconKey: "guarantee",
      title: "30-Day Money Back",
    },
    {
      id: "origin",
      iconKey: "origin",
      title: "Made in USA",
    },
  ],

  bundleHeading: "Bundle & Save 5%",

  bundleSuggestions: [
    {
      id: "daily-duo",
      image: "/Product/images/multi.png",
      title: "Daily Duo Pack",
      subtitle: "Multivitamin + Immunity Boost",
      compareAtPrice: 89.99,
      price: 75.99,
      badgeLabel: "15% OFF",
    },
    {
      id: "mobility-pack",
      image: "/Default/images/col1.png",
      title: "Mobility Pack",
      subtitle: "Joint + Bone Support",
      compareAtPrice: 84.99,
      price: 72.99,
      badgeLabel: "14% OFF",
    },
  ],

  accordionSections: [
    {
      id: "details",
      title: "PRODUCT DETAILS",
      content: [
        "All-in-one multivitamin for dogs.",
        "Supports joints, digestion, and immunity.",
      ],
    },
    {
      id: "usage",
      title: "HOW TO USE",
      content: [
        "Mix with food once daily.",
        "Adjust serving based on dog size.",
      ],
    },
    {
      id: "ingredients",
      title: "INGREDIENTS",
      content: [
        "Spirulina, Turmeric, Glucosamine, MSM, Probiotics.",
      ],
    },
  ],

  initialVisibleTags: 5,
};



//  Dog Dental Chews

export const dogDentalProductData = {
  id: "doggie-dental",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/collection" },
    { label: "Doggie Dental Powder" },
  ],

  name: "Doggie Dental Powder - Fresh Breath & Oral Care",

  review: {
    rating: 4.6,
    count: 980,
    href: "#reviews",
  },

  gallery: [
    { id: "g1", src: "/Product/images/dogi-dental-powder.png", alt: "Dental Powder" },
    { id: "g2", src: "/Product/images/before.png", alt: "Before After" },
    { id: "g3", src: "/Product/images/dogi-dental-powder.png", alt: "Usage" },
    { id: "g4", src: "/Product/images/before.png", alt: "Ingredients" },
  ],

  qualityHighlights: [
    {
      id: "clinically-tested",
      title: "Clinically Proven Formula",
      iconKey: "clinicallyTested",
    },
    {
      id: "human-grade",
      title: "Natural Ingredients",
      iconKey: "humanGrade",
    },
    {
      id: "vet-recommended",
      title: "Vet Recommended",
      iconKey: "vetRecommended",
    },
  ],

  tags: [
    "Plaque Control",
    "Tartar Removal",
    "Fresh Breath",
    "Probiotics",
    "Seaweed",
    "Enzymes",
    "Oral Care",
    "No Brushing",
  ],

  description:
    "Doggie Dental Powder is an easy-to-use oral care supplement that helps reduce plaque, tartar, and bad breath naturally. Just sprinkle it over your dog’s food daily to support healthier teeth and gums without the hassle of brushing.",

  benefits: [
    {
      id: "breath",
      icon: "/Product/images/f.png",
      text: "Freshens Bad Breath",
    },
    {
      id: "plaque",
      icon: "/Product/images/pl.jpg",
      text: "Reduces Plaque Build-up",
    },
    {
      id: "tartar",
      icon: "/Product/images/dog 1.png",
      text: "Prevents Tartar",
    },
    {
      id: "gums",
      icon: "/Product/images/allergies 1.png",
      text: "Supports Healthy Gums",
    },
    {
      id: "microbiome",
      icon: "/Product/images/love 1.png",
      text: "Improves Oral Microbiome",
    },
    {
      id: "easy",
      icon: "/Product/images/f.png",
      text: "No Brushing Needed",
    },
  ],

  sizes: [
  {
    id: "small",
    name: "Small",
    weight: "0-25 lbs",
    icon: "/Product/images/d1.png",
    plans: [
      {
        id: "1m",
        label: "1 Month Supply",
        deliveryLabel: "Delivered every month",
        perDayLabel: "$1.16/day",
        price: 34.99,
        offerLabel: "10% OFF",
      },
      {
        id: "3m",
        label: "3 Month Supply",
        deliveryLabel: "Delivered every 3 months",
        perDayLabel: "$0.98/day",
        price: 88.99,
        offerLabel: "15% OFF",
        badgeLabel: "Most Popular",
      },
      {
        id: "6m",
        label: "6 Month Supply",
        deliveryLabel: "Delivered every 6 months",
        perDayLabel: "$0.85/day",
        price: 159.99,
        offerLabel: "20% OFF",
        badgeLabel: "Best Value",
      },
    ],
  },

  {
    id: "medium",
    name: "Medium",
    weight: "25-75 lbs",
    icon: "/Product/images/d2.png",
    plans: [
      {
        id: "1m",
        label: "1 Month Supply",
        deliveryLabel: "Delivered every month",
        perDayLabel: "$1.40/day",
        price: 44.99,
        offerLabel: "10% OFF",
      },
      {
        id: "3m",
        label: "3 Month Supply",
        deliveryLabel: "Delivered every 3 months",
        perDayLabel: "$1.20/day",
        price: 109.99,
        offerLabel: "15% OFF",
        badgeLabel: "Most Popular",
      },
      {
        id: "6m",
        label: "6 Month Supply",
        deliveryLabel: "Delivered every 6 months",
        perDayLabel: "$1.05/day",
        price: 199.99,
        offerLabel: "20% OFF",
        badgeLabel: "Best Value",
      },
    ],
  },

  {
    id: "large",
    name: "Large",
    weight: "75-100 lbs",
    icon: "/Product/images/d3.png",
    plans: [
      {
        id: "1m",
        label: "1 Month Supply",
        deliveryLabel: "Delivered every month",
        perDayLabel: "$1.80/day",
        price: 59.99,
        offerLabel: "10% OFF",
      },
      {
        id: "3m",
        label: "3 Month Supply",
        deliveryLabel: "Delivered every 3 months",
        perDayLabel: "$1.55/day",
        price: 149.99,
        offerLabel: "15% OFF",
        badgeLabel: "Most Popular",
      },
      {
        id: "6m",
        label: "6 Month Supply",
        deliveryLabel: "Delivered every 6 months",
        perDayLabel: "$1.35/day",
        price: 269.99,
        offerLabel: "20% OFF",
        badgeLabel: "Best Value",
      },
    ],
  },

  {
    id: "xl",
    name: "XL",
    weight: "101+ lbs",
    icon: "/Product/images/d4.png",
    plans: [
      {
        id: "1m",
        label: "1 Month Supply",
        deliveryLabel: "Delivered every month",
        perDayLabel: "$2.10/day",
        price: 69.99,
        offerLabel: "10% OFF",
      },
      {
        id: "3m",
        label: "3 Month Supply",
        deliveryLabel: "Delivered every 3 months",
        perDayLabel: "$1.85/day",
        price: 179.99,
        offerLabel: "15% OFF",
        badgeLabel: "Most Popular",
      },
      {
        id: "6m",
        label: "6 Month Supply",
        deliveryLabel: "Delivered every 6 months",
        perDayLabel: "$1.60/day",
        price: 319.99,
        offerLabel: "20% OFF",
        badgeLabel: "Best Value",
      },
    ],
  },
],
  shippingNote: "Ships within 24 hours",

  subscription: {
    title: "Subscribe & Save",
    description: "Cancel anytime, no commitments.",
    enabledByDefault: true,
  },

  cta: {
    addToCartLabel: "Add to Cart",
    shopPayLabel: `Pay with ${PAYMENT_PROVIDER}`,
    cartHref: "/cart",
  },

  guaranteeBadges: [
    {
      id: "shipping",
      iconKey: "shipping",
      title: getFreeShippingText(),
    },
    {
      id: "guarantee",
      iconKey: "guarantee",
      title: "60-Day Money Back",
    },
    {
      id: "origin",
      iconKey: "origin",
      title: "Vet Approved Formula",
    },
  ],

  bundleHeading: "Bundle & Save 10%",

  bundleSuggestions: [
    {
      id: "dental-duo",
      image: "/Product/images/multi.png",
      title: "Dental Duo Pack",
      subtitle: "2x Dental Powder for long-term care",
      compareAtPrice: 69.98,
      price: 59.99,
      badgeLabel: "15% OFF",
    },
    {
      id: "complete-care",
      image: "/Product/images/dogi-dental-powder.png",
      title: "Complete Oral Care",
      subtitle: "Dental Powder + Multivitamin",
      compareAtPrice: 94.99,
      price: 79.99,
      badgeLabel: "16% OFF",
    },
  ],

  accordionSections: [
    {
      id: "details",
      title: "PRODUCT DETAILS",
      content: [
        "Supports oral hygiene by reducing plaque and tartar.",
        "Improves bad breath and gum health naturally.",
      ],
    },
    {
      id: "usage",
      title: "HOW TO USE",
      content: [
        "Sprinkle once daily over your dog’s food.",
        "Use consistently for best results.",
      ],
    },
    {
      id: "ingredients",
      title: "INGREDIENTS",
      content: [
        "Seaweed, enzymes, probiotics, and minerals.",
      ],
    },
  ],

  initialVisibleTags: 5,
};

//  daily Duo bundle


export const dailyDuoProductData = {
  id: "daily-duo",

  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/collection" },
    { label: "Daily Duo" },
  ],

  name: "Daily Duo: Multivitamin + Dental Powder",

  review: {
    rating: 4.8,
    count: 640,
    href: "#reviews",
  },

  gallery: [
    { id: "g1", src: "/Product/images/multi.png", alt: "Daily Duo Front" },
    { id: "g2", src: "/Product/images/dogi-dental-powder.png", alt: "Products Together" },
    { id: "g3", src: "/Product/images/p1.png", alt: "Usage" },
    { id: "g4", src: "/Product/images/before.png", alt: "Benefits" },
  ],

  qualityHighlights: [
    {
      id: "clinically-tested",
      title: "Clinically Tested",
      iconKey: "clinicallyTested",
    },
    {
      id: "human-grade",
      title: "Human Grade",
      iconKey: "humanGrade",
    },
    {
      id: "vet-recommended",
      title: "Vet Recommended",
      iconKey: "vetRecommended",
    },
  ],

  tags: [
    "Full Body Care",
    "Dental + Immunity",
    "Joint Support",
    "Fresh Breath",
    "Gut Health",
    "Skin & Coat",
    "All-in-One",
  ],

  description:
    "Daily Duo combines our best-selling multivitamin and dental powder to give your dog complete daily health support. From joints and digestion to oral hygiene and fresh breath — everything in one easy routine.",

  benefits: [
    {
      id: "health",
      icon: "/Product/images/icon1.png",
      text: "Complete Health Support",
    },
    {
      id: "dental",
      icon: "/Product/images/pl.jpg",
      text: "Cleaner Teeth & Breath",
    },
    {
      id: "immunity",
      icon: "/Product/images/immunity (1) 1.png",
      text: "Stronger Immunity",
    },
    {
      id: "gut",
      icon: "/Product/images/stomach 1.png",
      text: "Improved Digestion",
    },
    {
      id: "coat",
      icon: "/Product/images/allergies 1.png",
      text: "Healthy Skin & Coat",
    },
    {
      id: "easy",
      icon: "/Product/images/love 1.png",
      text: "Simple Daily Routine",
    },
  ],

  sizes: [
  {
    id: "small",
    name: "Small",
    weight: "0-25 lbs",
    icon: "/Product/images/d1.png",
    plans: [
      {
        id: "1m",
        label: "1 Month Bundle",
        deliveryLabel: "Delivered every month",
        perDayLabel: "$1.90/day",
        price: 69.99,
        offerLabel: "10% OFF",
      },
      {
        id: "3m",
        label: "3 Month Bundle",
        deliveryLabel: "Delivered every 3 months",
        perDayLabel: "$1.65/day",
        price: 179.99,
        offerLabel: "15% OFF",
        badgeLabel: "Most Popular",
      },
      {
        id: "6m",
        label: "6 Month Bundle",
        deliveryLabel: "Delivered every 6 months",
        perDayLabel: "$1.45/day",
        price: 329.99,
        offerLabel: "20% OFF",
        badgeLabel: "Best Value",
      },
    ],
  },

  {
    id: "medium",
    name: "Medium",
    weight: "25-75 lbs",
    icon: "/Product/images/d2.png",
    plans: [
      {
        id: "1m",
        label: "1 Month Bundle",
        deliveryLabel: "Delivered every month",
        perDayLabel: "$2.20/day",
        price: 79.99,
        offerLabel: "10% OFF",
      },
      {
        id: "3m",
        label: "3 Month Bundle",
        deliveryLabel: "Delivered every 3 months",
        perDayLabel: "$1.95/day",
        price: 199.99,
        offerLabel: "15% OFF",
        badgeLabel: "Most Popular",
      },
      {
        id: "6m",
        label: "6 Month Bundle",
        deliveryLabel: "Delivered every 6 months",
        perDayLabel: "$1.75/day",
        price: 359.99,
        offerLabel: "20% OFF",
        badgeLabel: "Best Value",
      },
    ],
  },

  {
    id: "large",
    name: "Large",
    weight: "75-100 lbs",
    icon: "/Product/images/d3.png",
    plans: [
      {
        id: "1m",
        label: "1 Month Bundle",
        deliveryLabel: "Delivered every month",
        perDayLabel: "$2.60/day",
        price: 94.99,
        offerLabel: "10% OFF",
      },
      {
        id: "3m",
        label: "3 Month Bundle",
        deliveryLabel: "Delivered every 3 months",
        perDayLabel: "$2.30/day",
        price: 229.99,
        offerLabel: "15% OFF",
        badgeLabel: "Most Popular",
      },
      {
        id: "6m",
        label: "6 Month Bundle",
        deliveryLabel: "Delivered every 6 months",
        perDayLabel: "$2.05/day",
        price: 409.99,
        offerLabel: "20% OFF",
        badgeLabel: "Best Value",
      },
    ],
  },

  {
    id: "xl",
    name: "XL",
    weight: "101+ lbs",
    icon: "/Product/images/d4.png",
    plans: [
      {
        id: "1m",
        label: "1 Month Bundle",
        deliveryLabel: "Delivered every month",
        perDayLabel: "$3.00/day",
        price: 109.99,
        offerLabel: "10% OFF",
      },
      {
        id: "3m",
        label: "3 Month Bundle",
        deliveryLabel: "Delivered every 3 months",
        perDayLabel: "$2.65/day",
        price: 259.99,
        offerLabel: "15% OFF",
        badgeLabel: "Most Popular",
      },
      {
        id: "6m",
        label: "6 Month Bundle",
        deliveryLabel: "Delivered every 6 months",
        perDayLabel: "$2.35/day",
        price: 459.99,
        offerLabel: "20% OFF",
        badgeLabel: "Best Value",
      },
    ],
  },
],

  shippingNote: "Free & Fast Shipping 🚀",

  subscription: {
    title: "Subscribe & Save",
    description: "Get extra savings on bundle plans. Cancel anytime.",
    enabledByDefault: true,
  },

  cta: {
    addToCartLabel: "Add Bundle to Cart",
    shopPayLabel: "Buy Bundle Now",
    cartHref: "/cart",
  },

  guaranteeBadges: [
    {
      id: "shipping",
      iconKey: "shipping",
      title: "Free Shipping",
    },
    {
      id: "guarantee",
      iconKey: "guarantee",
      title: "60-Day Guarantee",
    },
    {
      id: "origin",
      iconKey: "origin",
      title: "Premium Quality",
    },
  ],

  // ❌ IMPORTANT: bundle ke andar bundle suggestions mat dena
  bundleHeading: "Complete the Routine",
  bundleSuggestions: [
    {
      id: "extra-multivitamin",
      image: "/Product/images/multi.png",
      title: "Add an Extra Multivitamin",
      subtitle: "Keep daily joint, gut, and immune support stocked",
      compareAtPrice: 54,
      price: 49,
      badgeLabel: "9% OFF",
    },
    {
      id: "extra-dental",
      image: "/Product/images/dogi-dental-powder.png",
      title: "Add a Second Dental Powder",
      subtitle: "Extend fresh breath and plaque support",
      compareAtPrice: 39.99,
      price: 35.99,
      badgeLabel: "10% OFF",
    },
  ],

  accordionSections: [
    {
      id: "included",
      title: "WHAT’S INCLUDED",
      content: [
        "1x Everyday Multivitamin (45 ingredients)",
        "1x Doggie Dental Powder",
      ],
    },
    {
      id: "usage",
      title: "HOW TO USE",
      content: [
        "Mix both powders into your dog’s daily food.",
        "Follow serving based on dog size.",
      ],
    },
    {
      id: "why",
      title: "WHY DAILY DUO",
      content: [
        "Covers both internal health and oral hygiene.",
        "Saves more compared to buying separately.",
      ],
    },
  ],

  initialVisibleTags: 5,
};

applyIndiaStorefront(everydayProductData);
applyIndiaStorefront(dogDentalProductData);
applyIndiaStorefront(dailyDuoProductData);

