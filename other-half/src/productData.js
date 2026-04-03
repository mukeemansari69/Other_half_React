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
    { id: "g1", src: "/Product/images/everyday/1.png", alt: "Front View" },
    { id: "g2", src: "/Product/images/everyday/2.png", alt: "Back View" },
    { id: "g3", src: "/Product/images/everyday/3.png", alt: "Usage" },
    { id: "g4", src: "/Product/images/everyday/4.png", alt: "Ingredients" },
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
      icon: "/Product/images/immunity.png",
      text: "Stronger Immunity",
    },
    {
      id: "allergies",
      icon: "/Product/images/allergy.png",
      text: "Allergy Relief",
    },
    {
      id: "coat",
      icon: "/Product/images/coat.png",
      text: "Healthy Skin & Coat",
    },
    {
      id: "digestion",
      icon: "/Product/images/digestion.png",
      text: "Better Digestion",
    },
    {
      id: "aging",
      icon: "/Product/images/aging.png",
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
    shopPayLabel: "Buy with Shop Pay",
    cartHref: "/cart",
  },

  guaranteeBadges: [
    {
      id: "shipping",
      iconKey: "shipping",
      title: "Free Shipping Over $50",
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
      image: "/Product/images/bundle/daily.png",
      title: "Daily Duo Pack",
      subtitle: "Multivitamin + Immunity Boost",
      compareAtPrice: 89.99,
      price: 75.99,
      badgeLabel: "15% OFF",
    },
    {
      id: "mobility-pack",
      image: "/Product/images/bundle/mobility.png",
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
    { id: "g1", src: "public/Product/images/dogi-dental-powder.png", alt: "Dental Powder" },
    { id: "g2", src: "public/Product/images/before.png", alt: "Before After" },
    { id: "g3", src: "public/Product/images/dogi-dental-powder.png", alt: "Usage" },
    { id: "g4", src: "public/Product/images/before.png", alt: "Ingredients" },
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
      icon: "public/Product/images/f.png",
      text: "Freshens Bad Breath",
    },
    {
      id: "plaque",
      icon: "public/Product/images/pl.jpg",
      text: "Reduces Plaque Build-up",
    },
    {
      id: "tartar",
      icon: "public/Product/images/dog 1.png",
      text: "Prevents Tartar",
    },
    {
      id: "gums",
      icon: "public/Product/images/allergies 1.png",
      text: "Supports Healthy Gums",
    },
    {
      id: "microbiome",
      icon: "public/Product/images/love 1.png",
      text: "Improves Oral Microbiome",
    },
    {
      id: "easy",
      icon: "public/Product/images/f.png",
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
  shippingNote: "Ships within 24 hours 🚀",

  subscription: {
    title: "Subscribe & Save",
    description: "Cancel anytime, no commitments.",
    enabledByDefault: true,
  },

  cta: {
    addToCartLabel: "Add to Cart",
    shopPayLabel: "Buy with Shop Pay",
    cartHref: "/cart",
  },

  guaranteeBadges: [
    {
      id: "shipping",
      iconKey: "shipping",
      title: "Free Shipping Over $50",
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
      image: "public/Product/images/multi.png",
      title: "Dental Duo Pack",
      subtitle: "2x Dental Powder for long-term care",
      compareAtPrice: 69.98,
      price: 59.99,
      badgeLabel: "15% OFF",
    },
    {
      id: "complete-care",
      image: "/Product/images/bundle/dental2.png",
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
    { id: "g1", src: "/Product/images/duo/1.png", alt: "Daily Duo Front" },
    { id: "g2", src: "/Product/images/duo/2.png", alt: "Products Together" },
    { id: "g3", src: "/Product/images/duo/3.png", alt: "Usage" },
    { id: "g4", src: "/Product/images/duo/4.png", alt: "Benefits" },
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
      icon: "/Product/images/duo/health.png",
      text: "Complete Health Support",
    },
    {
      id: "dental",
      icon: "/Product/images/duo/dental.png",
      text: "Cleaner Teeth & Breath",
    },
    {
      id: "immunity",
      icon: "/Product/images/duo/immunity.png",
      text: "Stronger Immunity",
    },
    {
      id: "gut",
      icon: "/Product/images/duo/gut.png",
      text: "Improved Digestion",
    },
    {
      id: "coat",
      icon: "/Product/images/duo/coat.png",
      text: "Healthy Skin & Coat",
    },
    {
      id: "easy",
      icon: "/Product/images/duo/easy.png",
      text: "Simple Daily Routine",
    },
  ],

  // ✅ IMPORTANT: Bundle = single size (keep UI stable)
  sizes: [
  {
    id: "small",
    name: "Small",
    weight: "0-25 lbs",
    icon: "/Product/images/duo/d1.png",
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
    icon: "/Product/images/duo/d2.png",
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
    icon: "/Product/images/duo/d3.png",
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
    icon: "/Product/images/duo/d4.png",
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
    shopPayLabel: "Buy Now",
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
  bundleHeading: "",
  bundleSuggestions: [],

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