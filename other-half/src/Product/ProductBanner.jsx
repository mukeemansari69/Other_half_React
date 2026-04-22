import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BellRing,
  Factory,
  FlaskConical,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Star,
  Stethoscope,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import "/public/Product/css/ProductBanner.css";
import BreadcrumbTrail from "../Components/BreadcrumbTrail.jsx";
import CheckoutLoginDrawer from "../Components/CheckoutLoginDrawer.jsx";
import { LoadingButton } from "../Components/LoadingControl.jsx";
import WishlistButton from "../Components/WishlistButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { apiRequest } from "../lib/api.js";
import { isDeliveryAddressComplete } from "../lib/deliveryAddress.js";
import { startRazorpayCheckout } from "../lib/startRazorpayCheckout.js";
import { resolveReviewProduct } from "../../shared/reviewProductCatalog.js";
import { collectionCards } from "../../shared/storeCatalog.js";
import { getCadenceDetails } from "../../shared/subscriptionUtils.js";
import {
  MADE_IN_LABEL,
  PAYMENT_PROVIDER,
  formatStoreCurrency,
  getDeliveryWindowText,
  getFreeShippingText,
} from "../../shared/storefrontConfig.js";

const highlightIconMap = {
  clinicallyTested: FlaskConical,
  humanGrade: ShieldCheck,
  vetRecommended: Stethoscope,
};

const guaranteeIconMap = {
  shipping: Truck,
  guarantee: BadgeCheck,
  origin: Factory,
};

const defaultProductBannerData = {
  id: "everyday-one",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Product", href: "/" },
    { label: "Everyday One" },
  ],
  name: "45 in 1 Everyday Daily Multivitamin",
  review: { rating: 4.5, count: 50, href: "#reviews" },
  gallery: [
    { id: "gallery-1", src: "/Product/images/Productimage.png", alt: "Product image 1" },
    { id: "gallery-2", src: "/Home/images/EverydayProduct.png", alt: "Product image 2" },
    { id: "gallery-3", src: "/Product/images/Productimage.png", alt: "Product image 3" },
    { id: "gallery-4", src: "/Home/images/EverydayProduct.png", alt: "Product image 4" },
  ],
  qualityHighlights: [
    {
      id: "clinically-tested",
      title: "Clinically Tested Ingredients",
      iconKey: "clinicallyTested",
    },
    { id: "human-grade", title: "Human-Grade Quality", iconKey: "humanGrade" },
    {
      id: "vet-recommended",
      title: "Veterinarian Recommended",
      iconKey: "vetRecommended",
    },
  ],
  tags: [
    "Bovine",
    "Spirulina",
    "Gold Milk",
    "Quercetin",
    "Lutein",
    "Turmeric",
    "Ashwagandha",
    "Boswellia",
  ],
  description:
    "45 high-quality ingredients in every scoop. Everyday is an all-in-one human grade dog supplement with bacon and pumpkin flavor for mobility, immunity, skin, coat, digestion, and healthy aging support. 45 high-quality ingredients in every scoop. Everyday is an all-in-one human grade dog supplement with bacon and pumpkin flavor for mobility, immunity, skin, coat, digestion, and healthy aging support. 45 high-quality ingredients in every scoop. Everyday is an all-in-one human grade dog supplement with bacon and pumpkin flavor for mobility, immunity, skin, coat, digestion, and healthy aging support.",
  benefits: [
    {
      id: "mobility",
      icon: "/Product/images/icon1.png",
      text: "Enhance Joint Mobility",
    },
    {
      id: "immunity",
      icon: "/Product/images/immunity (1) 1.png",
      text: "Immunity Boost",
    },
    {
      id: "allergies",
      icon: "/Product/images/love 1.png",
      text: "Soothe Allergies",
    },
    {
      id: "coat",
      icon: "/Product/images/allergies 1.png",
      text: "Nourish Skin & Coat",
    },
    {
      id: "digestion",
      icon: "/Product/images/stomach 1.png",
      text: "Better Digestion",
    },
    { id: "aging", icon: "/Product/images/dog 1.png", text: "Healthy Aging" },
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
  shippingNote: getDeliveryWindowText(),
  subscription: {
    title: "Subscribe and Save",
    description:
      `Easily pause or cancel your subscription anytime. Secure checkout powered by ${PAYMENT_PROVIDER}.`,
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
    { id: "guarantee", iconKey: "guarantee", title: "Money-Back Guarantee" },
    { id: "origin", iconKey: "origin", title: MADE_IN_LABEL },
  ],
  bundleHeading: "Bundle Up & Save 5%",
  bundleSuggestions: [
    {
      id: "daily-duo",
      image: "/Product/images/p1.png",
      title: "Upgrade to the Daily Duo",
      subtitle: "Delivered Every Two Month",
      compareAtPrice: 79.98,
      price: 70.98,
      badgeLabel: "15% OFF",
    },
    {
      id: "mobility-duo",
      image: "/Product/images/p1.png",
      title: "Build the Mobility Duo",
      subtitle: "Support joints plus daily wellness",
      compareAtPrice: 86.98,
      price: 74.98,
      badgeLabel: "14% OFF",
    },
    {
      id: "immunity-pair",
      image: "/Product/images/p1.png",
      title: "Add the Immunity Pair",
      subtitle: "Daily support with extra immune love",
      compareAtPrice: 84.98,
      price: 72.98,
      badgeLabel: "14% OFF",
    },
  ],
  accordionSections: [
    {
      id: "product-detail",
      title: "PRODUCT DETAIL",
      content: [
        "Everyday is a daily multivitamin powder for dogs that supports joints, immunity, skin, coat, and healthy digestion with one easy scoop.",
        "The formula is made with premium human grade ingredients and a bacon plus pumpkin flavor dogs love.",
      ],
    },
    {
      id: "serving-size",
      title: "SERVING SIZE",
      content: [
        "Small dogs: 1 scoop daily. Medium dogs: 2 scoops daily. Large dogs: 3 scoops daily. XL dogs: 4 scoops daily.",
        "Mix the powder into wet or dry food for best results.",
      ],
    },
    {
      id: "ingredients",
      title: "INGREDIENTS",
      content: [
        "Bovine colostrum, spirulina, turmeric, glucosamine, MSM, probiotics, pumpkin, and more.",
        "Made with carefully selected ingredients chosen to support everyday dog wellness.",
      ],
    },
  ],
  initialVisibleTags: 5,
};

const formatCurrency = (value) => formatStoreCurrency(value);

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

const formatPlanPerDayLabel = (price, plan) => {
  const planDays = getPlanDays(plan);

  if (!planDays) {
    return `${formatCurrency(price)}/cycle`;
  }

  const perDayPrice = price / planDays;

  return `(${formatStoreCurrency(perDayPrice, {
    minimumFractionDigits: perDayPrice < 100 ? 2 : 0,
    maximumFractionDigits: perDayPrice < 100 ? 2 : 0,
  })}/day)`;
};

const getFirstAvailablePlanId = (size) =>
  size?.plans.find((plan) => plan.inStock !== false)?.id || size?.plans[0]?.id || "";

const getFirstAvailableSizeId = (sizes = []) =>
  sizes.find((size) => size?.plans?.some((plan) => plan.inStock !== false))?.id ||
  sizes[0]?.id ||
  "";

const RatingStars = ({ rating }) => (
  <div
    className="flex items-center gap-1"
    aria-label={`${rating} out of 5 stars`}
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} size={16} className="product-banner-star" />
    ))}
  </div>
);

const HighlightCard = ({ item }) => {
  const Icon = highlightIconMap[item.iconKey] ?? ShieldCheck;
  return (
    <div className="product-banner-highlight-card flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#0F4A121A] bg-[#FFFDF2] px-2 py-4 text-center">
      <span className="product-banner-highlight-icon">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <span className="text-[11px] font-semibold leading-[1.2] text-[#1A1A1A] sm:text-[13px]">
        {item.title}
      </span>
    </div>
  );
};

const GuaranteeCard = ({ item }) => {
  const Icon = guaranteeIconMap[item.iconKey] ?? PackageCheck;
  return (
    <div className="product-banner-guarantee-card flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#DEDEDE] bg-white px-3 py-4 text-center shadow-[0_1px_2px_0_rgba(105,81,255,0.05)]">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFDF2] text-[#0F4A12]">
        <Icon size={42} strokeWidth={1.9} />
      </span>
      <span className="text-xs font-medium leading-[1.35] text-[#1A1A1A] sm:text-sm">
        {item.title}
      </span>
    </div>
  );
};

const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div className="overflow-hidden rounded-2xl bg-[#FAF9F5]">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-[#1A1A1A] sm:px-5 sm:text-base"
    >
      <span>{item.title}</span>
      <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#0F4A12] text-[#EBF466]">
        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
      </span>
    </button>
    {isOpen ? (
      <div className="product-banner-accordion-body border-t border-[#E9E2D7] px-4 pb-4 pt-1 text-sm leading-7 text-[#444444] sm:px-5">
        {item.content.map((paragraph, index) => (
          <p key={`${item.id}-${index}`} className={index ? "mt-3" : ""}>
            {paragraph}
          </p>
        ))}
      </div>
    ) : null}
  </div>
);

const ProductBanner = ({
  productData = defaultProductBannerData,
  onAddToCart,
}) => {
  const navigate = useNavigate();
  const { token, user, refreshUser } = useAuth();
  const { addItem, hasItem } = useCart();
  const product = productData;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState(
    getFirstAvailableSizeId(product.sizes),
  );
  const [selectedPlanId, setSelectedPlanId] = useState(
    getFirstAvailablePlanId(product.sizes[0]),
  );
  const [showAllTags, setShowAllTags] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(
    product.subscription.enabledByDefault,
  );
  const [selectedBundleIds, setSelectedBundleIds] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [checkoutStatus, setCheckoutStatus] = useState({ type: "", message: "" });
  const [checkingOut, setCheckingOut] = useState(false);
  const [showLoginDrawer, setShowLoginDrawer] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(user?.email || "");
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState({ type: "", message: "" });
  const bundleSuggestions = useMemo(() => {
    return product.bundleSuggestions ?? [];
  }, [product.bundleSuggestions]);

  useEffect(() => {
    if (user?.email && !notifyEmail) {
      setNotifyEmail(user.email);
    }
  }, [notifyEmail, user?.email]);

  useEffect(() => {
    if (bundleSuggestions.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSuggestionIndex(
        (current) => (current + 1) % bundleSuggestions.length,
      );
    }, 30000);
    return () => window.clearInterval(timer);
  }, [bundleSuggestions.length]);

  const selectedSize =
    product.sizes.find((size) => size.id === selectedSizeId) ??
    product.sizes[0];
  const selectedPlan =
    selectedSize.plans.find((plan) => plan.id === selectedPlanId) ??
    selectedSize.plans[0];
  const productAvailability = product.availability || {};
  const isSelectedPlanInStock = selectedPlan?.inStock !== false;
  const isOutOfStock =
    String(productAvailability.status || "").trim().toLowerCase() === "out_of_stock" ||
    !isSelectedPlanInStock;
  const outOfStockMessage =
    selectedPlan?.outOfStockMessage ||
    productAvailability.message ||
    "This product is currently out of stock.";
  const selectedImage =
    product.gallery[selectedImageIndex] ?? product.gallery[0];
  const selectedCadence = useMemo(() => {
    return getCadenceDetails({
      planId: selectedPlan?.id,
      deliveryLabel: selectedPlan?.deliveryLabel,
    });
  }, [selectedPlan?.deliveryLabel, selectedPlan?.id]);
  const activeSuggestion =
    bundleSuggestions.length > 0
      ? bundleSuggestions[activeSuggestionIndex % bundleSuggestions.length]
      : null;
  const relatedProducts = useMemo(() => {
    const fallbackProducts = collectionCards.filter(
      (item) => item.productId !== product.id
    );
    const preferredRelatedProductIds = [
      ...new Set(
        (Array.isArray(productAvailability.relatedProductIds)
          ? productAvailability.relatedProductIds
          : []
        )
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      ),
    ];

    if (preferredRelatedProductIds.length === 0) {
      return fallbackProducts.slice(0, 2);
    }

    const prioritizedProducts = preferredRelatedProductIds
      .map((productId) =>
        fallbackProducts.find((item) => item.productId === productId)
      )
      .filter(Boolean);
    const prioritizedProductIds = new Set(
      prioritizedProducts.map((item) => item.productId)
    );

    return [
      ...prioritizedProducts,
      ...fallbackProducts.filter(
        (item) => !prioritizedProductIds.has(item.productId)
      ),
    ].slice(0, 2);
  }, [product.id, productAvailability.relatedProductIds]);
  const reviewProduct = resolveReviewProduct({ productId: product.id, productName: product.name });
  const reviewSectionHref = reviewProduct?.reviewSectionHref || product.review.href;
  const visibleTags = showAllTags
    ? product.tags
    : product.tags.slice(0, product.initialVisibleTags);
  const bundleTotal = bundleSuggestions
    .filter((item) => selectedBundleIds.includes(item.id))
    .reduce(
      (sum, item) =>
        sum +
        (isSubscribed
          ? Number(item.price || 0)
          : Number(item.compareAtPrice || item.price || 0)),
      0
    );
  const selectedPlanFullPrice = Number(
    selectedPlan.compareAtPrice || selectedPlan.price || 0
  );
  const selectedPlanEffectivePrice = isSubscribed
    ? Number(selectedPlan.price || 0)
    : selectedPlanFullPrice;
  const totalPrice = selectedPlanEffectivePrice + bundleTotal;
  const perProductCompareAtPrice = Number(
    product.pricing?.unitCompareAtPrice || 0
  );
  const perProductDiscountedPrice = Number(
    product.pricing?.unitDiscountedPrice || 0
  );
  const hasPerProductDiscount =
    perProductCompareAtPrice > 0 &&
    perProductDiscountedPrice > 0 &&
    perProductCompareAtPrice > perProductDiscountedPrice;
  const perProductDisplayPrice = isSubscribed
    ? hasPerProductDiscount
      ? perProductDiscountedPrice
      : perProductCompareAtPrice || perProductDiscountedPrice
    : perProductCompareAtPrice || perProductDiscountedPrice;
  const isActiveSuggestionAdded = activeSuggestion
    ? selectedBundleIds.includes(activeSuggestion.id)
    : false;
  const sortedBundleIds = useMemo(() => {
    return [...selectedBundleIds].sort();
  }, [selectedBundleIds]);
  const selectedBundleTitles = useMemo(() => {
    return bundleSuggestions
      .filter((item) => sortedBundleIds.includes(item.id))
      .map((item) => item.title);
  }, [bundleSuggestions, sortedBundleIds]);
  const lineDescription = useMemo(() => {
    return [
      `${selectedSize.name} (${selectedSize.weight})`,
      selectedPlan.label,
      isSubscribed ? "Subscribe & Save" : "One-time purchase",
      selectedBundleTitles.length > 0
        ? `Bundles: ${selectedBundleTitles.join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join(" | ");
  }, [
    isSubscribed,
    selectedBundleTitles,
    selectedPlan.label,
    selectedSize.name,
    selectedSize.weight,
  ]);
  const cartVariantId = useMemo(() => {
    return [
      product.id,
      selectedSize.id,
      selectedPlan.id,
      isSubscribed ? "subscription" : "one-time",
      sortedBundleIds.length > 0 ? sortedBundleIds.join("+") : "no-bundle",
    ].join("::");
  }, [
    isSubscribed,
    product.id,
    selectedPlan.id,
    selectedSize.id,
    sortedBundleIds,
  ]);
  const checkoutLineItem = useMemo(() => {
    return {
      id: cartVariantId,
      productId: product.id,
      name: product.name,
      description: lineDescription,
      image: product.gallery[0]?.src || selectedImage?.src || "",
      unitPrice: Number(totalPrice.toFixed(2)),
      quantity: 1,
      purchaseType: isSubscribed ? "subscription" : "one-time",
      planId: selectedPlan.id,
      planLabel: selectedPlan.label,
      deliveryLabel: selectedPlan.deliveryLabel,
      deliveryCadence: selectedCadence.cadenceLabel,
      billingIntervalUnit: selectedCadence.intervalUnit,
      billingIntervalCount: selectedCadence.intervalCount,
      sizeId: selectedSize.id,
      sizeLabel: selectedSize.name,
      sizeWeight: selectedSize.weight,
    };
  }, [
    cartVariantId,
    isSubscribed,
    lineDescription,
    product.gallery,
    product.id,
    product.name,
    selectedCadence.cadenceLabel,
    selectedCadence.intervalCount,
    selectedCadence.intervalUnit,
    selectedImage?.src,
    selectedPlan.deliveryLabel,
    selectedPlan.id,
    selectedPlan.label,
    selectedSize.id,
    selectedSize.name,
    selectedSize.weight,
    totalPrice,
  ]);
  const isInCart = hasItem(cartVariantId);
  const activeSuggestionPrice = activeSuggestion
    ? Number(
        isSubscribed
          ? activeSuggestion.price || 0
          : activeSuggestion.compareAtPrice || activeSuggestion.price || 0
      )
    : 0;
  const activeSuggestionCompareAtPrice =
    isSubscribed && activeSuggestion?.compareAtPrice
      ? Number(activeSuggestion.compareAtPrice || 0)
      : null;

  const handleSizeChange = (sizeId) => {
    const nextSize = product.sizes.find((size) => size.id === sizeId);
    setSelectedSizeId(sizeId);
    setSelectedPlanId(getFirstAvailablePlanId(nextSize));
    setNotifyStatus({ type: "", message: "" });
  };

  const handleToggleBundle = (bundleId) => {
    setSelectedBundleIds(
      (current) =>
        current.includes(bundleId)
          ? current.filter((id) => id !== bundleId) // REMOVE
          : [...current, bundleId], // ADD
    );
  };
  const handleAddToCart = (source = "cart") => {
    if (isOutOfStock) {
      setCheckoutStatus({
        type: "error",
        message: outOfStockMessage,
      });
      return;
    }

    addItem(checkoutLineItem);

    if (typeof onAddToCart === "function") {
      onAddToCart({
        source,
        productId: cartVariantId,
        size: selectedSize,
        plan: selectedPlan,
        bundleIds: selectedBundleIds,
        totalPrice,
      });
    }
  };

  const handleDirectCheckout = async ({
    skipAuthCheck = false,
    authToken = token,
    authUser = user,
  } = {}) => {
    if (isOutOfStock) {
      setCheckoutStatus({
        type: "error",
        message: outOfStockMessage,
      });
      return;
    }

    if (!skipAuthCheck && !authToken) {
      setCheckoutStatus({
        type: "error",
        message: "Please login first to continue with Razorpay payment.",
      });
      setShowLoginDrawer(true);
      return;
    }

    if (!isDeliveryAddressComplete(authUser?.deliveryAddress)) {
      if (!hasItem(cartVariantId)) {
        addItem(checkoutLineItem);
      }

      navigate("/cart", {
        state: {
          needsAddress: true,
          message: "Please add your delivery address in cart before completing checkout.",
        },
      });
      return;
    }

    setCheckingOut(true);
    setCheckoutStatus({ type: "", message: "" });

    try {
      const result = await startRazorpayCheckout({
        token: authToken,
        user: authUser,
        deliveryAddress: authUser?.deliveryAddress || null,
        items: [checkoutLineItem],
      });

      await refreshUser().catch(() => null);
      navigate("/review", {
        replace: true,
        state: {
          fromCheckout: true,
          orderId: result.order.orderId,
          message:
            result.verification.message ||
            "Payment confirmed and your order has been placed successfully.",
        },
      });
    } catch (error) {
      if (error.status === 401) {
        setShowLoginDrawer(true);
      }

      setCheckoutStatus({
        type: "error",
        message:
          error.message ||
          "Checkout could not be started right now. Please try again.",
      });
    } finally {
      setCheckingOut(false);
    }
  };

  const handleNotifyMeSubmit = async (event) => {
    event.preventDefault();
    setNotifySubmitting(true);
    setNotifyStatus({ type: "", message: "" });

    try {
      const response = await apiRequest("/newsletter/subscribe", {
        method: "POST",
        body: {
          email: notifyEmail,
          source: `restock-${product.id}`,
        },
      });

      setNotifyStatus({
        type: "success",
        message:
          response.message ||
          "Thanks. We'll send you a restock alert as soon as this is available.",
      });
      setNotifyEmail("");
    } catch (error) {
      setNotifyStatus({
        type: "error",
        message: error.message || "We could not save your restock alert right now.",
      });
    } finally {
      setNotifySubmitting(false);
    }
  };

  return (
    <section className="product-banner-root">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-12 lg:py-8 xl:px-20">
        <BreadcrumbTrail items={product.breadcrumb} />

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] xl:gap-10">
          <div className="space-y-4 xl:sticky xl:top-24">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 sm:gap-4">
              <div className="product-banner-thumb-column product-banner-scrollbar flex flex-col gap-3 overflow-x-auto">
                {product.gallery.map((image, index) => (
                  <button
                    type="button"
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`product-banner-thumb ${selectedImageIndex === index ? "is-active" : ""}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="product-banner-main-media">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[1/0.86] h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <h1 className="text-[1.85rem] font-semibold leading-tight text-[#1A1A1A] sm:text-[2.125rem] p-heading">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#358248] sm:text-base">
                  <span>{product.review.rating}</span>
                  <RatingStars rating={product.review.rating} />
                  <span className="text-[#1A1A1A]">
                    {product.review.count} reviews
                  </span>
                </div>
                <Link
                  to={reviewSectionHref}
                  className="text-sm font-medium text-[#1A1A1A] underline underline-offset-2 sm:text-base p-review"
                >
                  See All Reviews
                </Link>
              </div>

              {perProductDisplayPrice ? (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-medium text-[#555555]">
                    {isSubscribed ? "Per product" : "One-time price"}
                  </span>
                  {isSubscribed && hasPerProductDiscount ? (
                    <span className="text-[#8F8F8F] line-through">
                      MRP {formatCurrency(perProductCompareAtPrice)}
                    </span>
                  ) : null}
                  <span className="font-semibold text-[#1A1A1A]">
                    {isSubscribed && hasPerProductDiscount ? "Now " : ""}
                    {formatCurrency(perProductDisplayPrice)}
                  </span>
                  {isSubscribed && hasPerProductDiscount && product.pricing?.discountPercent ? (
                    <span className="inline-flex rounded-full bg-[#FFF4D9] px-3 py-1 text-xs font-semibold text-[#7A4C00]">
                      Subscribe & save {product.pricing.discountPercent}%
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#E7E7E7] bg-white px-3 py-1 text-sm leading-7 text-[#1A1A1A]  p-bovine"
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > product.initialVisibleTags ? (
                  <button
                    type="button"
                    onClick={() => setShowAllTags((current) => !current)}
                    className="rounded-full border border-[#E7E7E7] bg-white px-3 py-1 text-sm font-medium leading-7 text-[#1A1A1A] p-bovine"
                  >
                    {showAllTags
                      ? "Show Less"
                      : `+${product.tags.length - product.initialVisibleTags} More`}
                  </button>
                ) : null}
              </div>

              <div className="space-y-2 text-sm leading-7 text-[#4A4A4A] sm:text-[14px] p-bovine">
                <p
                  className={
                    showFullDescription
                      ? ""
                      : "product-banner-description--collapsed"
                  }
                >
                  {product.description}
                </p>
                <button
                  type="button"
                  onClick={() => setShowFullDescription((current) => !current)}
                  className="text-sm font-semibold text-[#1A1A1A] underline underline-offset-2 p-bovine"
                >
                  {showFullDescription ? "Read Less" : "Read More"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {product.benefits.map((item) => (
                <div
                  key={item.id}
                  className="product-banner-benefit-pill flex items-center gap-2 px-3 py-2"
                >
                  <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#0F4A1233] bg-[#FFFDF2]">
                    <img
                      src={item.icon}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-5 w-5 object-contain"
                    />
                  </span>
                  <span className="text-sm font-normal leading-[1.35] text-[#1A1A1A] p-bovine">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="text-sm font-semibold text-[#1A1A1A] sm:text-base">
                Dog Size:{" "}
                <span className="font-normal text-[#555555]">
                  {selectedSize.name} ({selectedSize.weight})
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => {
                  const isSelected = size.id === selectedSize.id;
                  return (
                    <button
                      type="button"
                      key={size.id}
                      onClick={() => handleSizeChange(size.id)}
                      className={`product-banner-size-card flex flex-col items-center justify-between rounded-2xl border-2 px-3 py-3 text-center ${isSelected ? "is-selected border-[#0F4A12]" : "border-[#E7E7E7] bg-white"}`}
                    >
                      <div className="flex min-h-[3.25rem] items-center justify-center">
                        <img
                          src={size.icon}
                          alt={`${size.name} dog size`}
                          loading="lazy"
                          decoding="async"
                          className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[13px] font-semibold leading-none text-[#1A1A1A] sm:text-sm">
                          {size.name}
                        </p>
                        <p className="text-[11px] leading-[1.35] text-[#555555] sm:text-xs">
                          {size.weight}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-[#DEDEDE] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-[#1A1A1A] sm:text-lg">
                  Frequency
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium text-[#555555] sm:text-sm">
                  <PackageCheck size={16} className="text-[#0F4A12]" />
                  <span>{product.shippingNote}</span>
                </div>
              </div>

              <div className="space-y-3">
                {selectedSize.plans.map((plan) => {
                  const isSelected = plan.id === selectedPlan.id;
                  const hasPlanDiscount =
                    Number(plan.compareAtPrice || 0) > Number(plan.price || 0);
                  const displayPlanPrice = Number(
                    isSubscribed
                      ? plan.price || 0
                      : plan.compareAtPrice || plan.price || 0
                  );
                  const displayPlanCompareAtPrice =
                    isSubscribed && hasPlanDiscount
                      ? Number(plan.compareAtPrice || 0)
                      : null;
                  const displayPlanSavings = isSubscribed
                    ? Number(plan.savingsAmount || 0)
                    : 0;
                  const displayPerDayLabel = formatPlanPerDayLabel(
                    displayPlanPrice,
                    plan
                  );
                  const badgeTone =
                    plan.badgeLabel === "Best Value"
                      ? "border-black bg-[#EBF466] text-[#1A1A1A]"
                      : "border-[#0F4A12] bg-[#E5FFBD] text-[#1A1A1A]";

                  return (
                    <button
                      type="button"
                      key={`${selectedSize.id}-${plan.id}`}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`product-banner-frequency-card w-full rounded-2xl border-2 px-4 py-4 ${isSelected ? "is-selected" : "border-[#DEDEDE] bg-white"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={`product-banner-radio mt-1 ${isSelected ? "is-selected" : ""}`}
                          />
                          <div className="space-y-2">
                            {plan.badgeLabel ? (
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold leading-none ${badgeTone}`}
                              >
                                {plan.badgeLabel}
                              </span>
                            ) : null}
                            <div>
                              <p className="text-base font-semibold leading-tight text-[#1A1A1A]">
                                {plan.label}
                              </p>
                              <p className="mt-1 text-xs leading-[1.4] text-[#555555] sm:text-sm">
                                {plan.deliveryLabel}
                              </p>
                              {plan.inStock === false ? (
                                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#A13A2C]">
                                  Sold out
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="space-y-1">
                            <p className="text-xs leading-none text-[#9E9E9E]">
                              {displayPerDayLabel}
                            </p>
                            {isSubscribed ? (
                              <span className="inline-flex rounded-full bg-[#0F4A12] px-2 py-1 text-[10px] font-semibold leading-none text-[#EBF466]">
                                {hasPlanDiscount ? plan.offerLabel : "Subscription"}
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-[#F4EFE5] px-2 py-1 text-[10px] font-semibold leading-none text-[#6A6458]">
                                One-time
                              </span>
                            )}
                          </div>
                          {displayPlanCompareAtPrice ? (
                            <p className="text-xs font-medium leading-none text-[#9E9E9E] line-through">
                              MRP {formatCurrency(displayPlanCompareAtPrice)}
                            </p>
                          ) : null}
                          <p className="text-lg font-semibold leading-none text-[#E55C2A] sm:text-xl">
                            {displayPlanCompareAtPrice ? "Now " : ""}
                            {formatCurrency(displayPlanPrice)}
                          </p>
                          {displayPlanSavings ? (
                            <p className="text-xs font-semibold leading-none text-[#0F4A12]">
                              Save {formatCurrency(displayPlanSavings)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold leading-tight text-[#1A1A1A]">
                      {product.subscription.title}
                    </h3>
                    <p className="mt-1 text-sm leading-[1.4] text-[#6C6C6C]">
                      {isSubscribed
                        ? product.subscription.description
                        : "Switch subscription on to apply the savings shown above."}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={isSubscribed}
                    onClick={() => setIsSubscribed((current) => !current)}
                    className="product-banner-switch flex-shrink-0"
                    data-active={isSubscribed}
                  >
                    <span className="product-banner-switch-thumb" />
                  </button>
                </div>

                <div className="space-y-3">
                  <WishlistButton productId={product.id} className="w-full justify-center" />
                  <LoadingButton
                    type="button"
                    onClick={() => {
                      if (isOutOfStock) {
                        setCheckoutStatus({
                          type: "error",
                          message: outOfStockMessage,
                        });
                        return;
                      }

                      if (isInCart) {
                        navigate(product.cta.cartHref || "/cart");
                        return;
                      }

                      handleAddToCart("cart");
                    }}
                    lockOnClick
                    loadingText={
                      isOutOfStock
                        ? "Unavailable"
                        : isInCart
                          ? "Opening cart..."
                          : "Adding to cart..."
                    }
                    disabled={isOutOfStock}
                    className={`product-banner-cta flex w-full items-center justify-center rounded-full px-5 py-4 text-center text-lg font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(105,81,255,0.05)] sm:text-2xl 
    ${
      isOutOfStock
        ? "bg-[#B8B0A1]"
        : isInCart
          ? "bg-[#0F4A12]"
          : "bg-[#E8754C]"
    }`}
                  >
                    {isOutOfStock
                      ? "Currently Out of Stock"
                      : isInCart
                        ? "Go to Cart"
                        : `${product.cta.addToCartLabel} | ${formatCurrency(totalPrice)}`}
                  </LoadingButton>
                  {isOutOfStock ? (
                    <div className="space-y-4 rounded-[24px] border border-[#F0D6C9] bg-[#FFF8F4] p-4">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF1EE] text-[#A13A2C]">
                          <BellRing size={18} />
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-base font-semibold text-[#1A1A1A] sm:text-lg">
                            {productAvailability.notifyTitle || "Notify me when available"}
                          </h4>
                          <p className="text-sm leading-6 text-[#5F5B4F]">
                            {outOfStockMessage}
                          </p>
                          <p className="text-sm leading-6 text-[#5F5B4F]">
                            {productAvailability.notifyDescription ||
                              "Leave your email and we'll send you a restock alert as soon as it is back."}
                          </p>
                        </div>
                      </div>

                      <form className="space-y-3" onSubmit={handleNotifyMeSubmit}>
                        <input
                          type="email"
                          value={notifyEmail}
                          onChange={(event) => setNotifyEmail(event.target.value)}
                          placeholder="Email address"
                          required
                          className="w-full rounded-full border border-[#E4D7C8] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                        />
                        <LoadingButton
                          type="submit"
                          loading={notifySubmitting}
                          loadingText="Saving alert..."
                          disabled={notifySubmitting}
                          className="product-banner-cta flex w-full items-center justify-center rounded-full bg-[#0F4A12] px-5 py-4 text-center text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(105,81,255,0.05)]"
                        >
                          Notify Me When Available
                        </LoadingButton>
                      </form>

                      {notifyStatus.message ? (
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm ${
                            notifyStatus.type === "success"
                              ? "bg-[#EEF6E7] text-[#0F4A12]"
                              : "bg-[#FFF1EE] text-[#A13A2C]"
                          }`}
                        >
                          {notifyStatus.message}
                        </div>
                      ) : null}

                      {relatedProducts.length > 0 ? (
                        <div className="space-y-3">
                          <h5 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6A6458]">
                            You may also like
                          </h5>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {relatedProducts.map((item) => (
                              <Link
                                key={item.productId}
                                to={item.route}
                                className="rounded-[20px] border border-[#E4D7C8] bg-white p-3 transition hover:border-[#0F4A12]"
                              >
                                <div className="overflow-hidden rounded-[16px] bg-[#FFFDF2]">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-32 w-full object-contain p-3"
                                  />
                                </div>
                                <div className="mt-3 space-y-1">
                                  <p className="text-sm font-semibold text-[#1A1A1A]">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-[#5F5B4F]">
                                    {formatStoreCurrency(item.displayPrice)}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <LoadingButton
                      type="button"
                      onClick={() => {
                        void handleDirectCheckout();
                      }}
                      loading={checkingOut}
                      loadingText={`Opening ${PAYMENT_PROVIDER}...`}
                      disabled={checkingOut}
                      className="product-banner-cta flex w-full items-center justify-center rounded-full bg-[#4E3CE2] px-5 py-4 text-center text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(105,81,255,0.05)]"
                    >
                      {product.cta.shopPayLabel}
                    </LoadingButton>
                  )}

                  {checkoutStatus.message ? (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        checkoutStatus.type === "success"
                          ? "bg-[#EEF6E7] text-[#0F4A12]"
                          : "bg-[#FFF1EE] text-[#A13A2C]"
                      }`}
                    >
                      {checkoutStatus.message}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {product.guaranteeBadges.map((item) => (
                    <GuaranteeCard key={item.id} item={item} />
                  ))}
                </div>

                {!isOutOfStock && activeSuggestion ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold leading-tight text-[#1A1A1A] sm:text-xl">
                        {product.bundleHeading}
                      </h3>
                      <span className="rounded-full bg-[#0F4A12] px-2 py-1 text-[10px] font-semibold leading-none text-[#EBF466]">
                        30 sec rotate
                      </span>
                    </div>

                    <div className="product-banner-upsell-card is-active grid overflow-hidden rounded-[14px] border border-[#EDEDED] bg-white sm:grid-cols-[minmax(0,10rem)_1fr] p-mobile">
                      <div className="border-b border-[#EDEDED] bg-[#FFFDF2] sm:border-b-0 sm:border-r p-mobile-img">
                        <img
                          src={activeSuggestion.image}
                          alt={activeSuggestion.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full min-h-[8rem] w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between gap-4 p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <h4 className="text-lg font-semibold leading-[1.2] text-[#000000] sm:text-xl ">
                                {activeSuggestion.title}
                              </h4>
                              <p className="text-sm font-medium leading-[1.2] text-[#1A1A1A]">
                                {activeSuggestion.subtitle}
                              </p>
                            </div>
                            <span className="rounded-[5px] bg-[#0F4A12] px-3 py-1.5 text-[9px] font-bold uppercase leading-none tracking-[0.02em] text-[#EBF466]">
                              {activeSuggestion.badgeLabel}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {activeSuggestionCompareAtPrice ? (
                                <span className="text-lg font-semibold leading-[1.34] text-[#B2B2B2] line-through sm:text-xl">
                                  {formatCurrency(activeSuggestionCompareAtPrice)}
                                </span>
                              ) : null}
                              <span className="text-lg font-semibold leading-[1.34] text-[#1A1A1A] sm:text-xl">
                                {formatCurrency(activeSuggestionPrice)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleBundle(activeSuggestion.id)
                              }
                              className={`product-banner-quick-add flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-[0_1px_2px_0_rgba(105,81,255,0.05)] 
    ${isActiveSuggestionAdded ? "bg-[#0F4A12] text-white" : "border-black bg-[#FAF9F5] text-black"}`}
                            >
                              {isActiveSuggestionAdded ? (
                                <Minus size={18} />
                              ) : (
                                <Plus size={18} />
                              )}
                              <span>
                                {isActiveSuggestionAdded
                                  ? "Remove"
                                  : "Quick Add"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              {product.accordionSections.map((item) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isOpen={openAccordionId === item.id}
                  onToggle={() =>
                    setOpenAccordionId((current) =>
                      current === item.id ? null : item.id,
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <CheckoutLoginDrawer
        isOpen={showLoginDrawer}
        onClose={() => setShowLoginDrawer(false)}
        onAuthenticated={(authResponse) => {
          setShowLoginDrawer(false);
          setCheckoutStatus({
            type: "success",
            message: "Login successful. Opening Razorpay payment now.",
          });
          void handleDirectCheckout({
            skipAuthCheck: true,
            authToken: authResponse?.token || token,
            authUser: authResponse?.user || user,
          });
        }}
        title="Please login"
        message="Razorpay payment on the product page is available only after sign in."
      />
    </section>
  );
};

export default ProductBanner;


