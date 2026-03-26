import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  Factory,
  FlaskConical,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Stethoscope,
  Truck,
} from "lucide-react";
import "./ProductBanner.css";

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

export const defaultProductBannerData = {
  id: "everyday-one",
  breadcrumb: [
    { label: "Home", href: "#" },
    { label: "Product", href: "#" },
    { label: "Everyday One" },
  ],
  name: "45 in 1 Everyday Daily Multivitamin",
  review: { rating: 4.5, count: 50, href: "#reviews" },
  gallery: [
    { id: "gallery-1", src: "/Product/images/p1.png", alt: "Product image 1" },
    { id: "gallery-2", src: "/Product/images/p1.png", alt: "Product image 2" },
    { id: "gallery-3", src: "/Product/images/p1.png", alt: "Product image 3" },
    { id: "gallery-4", src: "/Product/images/p1.png", alt: "Product image 4" },
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
  shippingNote: "Zooming your way from the USA - ships within 24 hours*",
  subscription: {
    title: "Subscribe and Save",
    description:
      "Easily pause or cancel your subscription anytime, stress-free.",
    enabledByDefault: true,
  },
  cta: {
    addToCartLabel: "Add to Cart",
    shopPayLabel: "Buy with shop Pay",
    cartHref: "/cart",
  },
  guaranteeBadges: [
    {
      id: "shipping",
      iconKey: "shipping",
      title: "Free Shipping on Orders $50+",
    },
    { id: "guarantee", iconKey: "guarantee", title: "Money-Back Guarantee" },
    { id: "origin", iconKey: "origin", title: "Made in the USA" },
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
        "Replace this with real admin-fed ingredients when backend data is connected.",
      ],
    },
  ],
  initialVisibleTags: 5,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

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
  onFavoriteToggle,
}) => {
  const product = productData;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState(
    product.sizes[0]?.id ?? "",
  );
  const [selectedPlanId, setSelectedPlanId] = useState(
    product.sizes[0]?.plans[0]?.id ?? "",
  );
  const [showAllTags, setShowAllTags] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(
    product.subscription.enabledByDefault,
  );
  const [selectedBundleIds, setSelectedBundleIds] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSuggestionIndex(
        (current) => (current + 1) % product.bundleSuggestions.length,
      );
    }, 30000);
    return () => window.clearInterval(timer);
  }, [product.bundleSuggestions.length]);

  const selectedSize =
    product.sizes.find((size) => size.id === selectedSizeId) ??
    product.sizes[0];
  const selectedPlan =
    selectedSize.plans.find((plan) => plan.id === selectedPlanId) ??
    selectedSize.plans[0];
  const selectedImage =
    product.gallery[selectedImageIndex] ?? product.gallery[0];
  const activeSuggestion = product.bundleSuggestions[activeSuggestionIndex];
  const visibleTags = showAllTags
    ? product.tags
    : product.tags.slice(0, product.initialVisibleTags);
  const bundleTotal = product.bundleSuggestions
    .filter((item) => selectedBundleIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);
  const totalPrice = selectedPlan.price + bundleTotal;
  const isActiveSuggestionAdded = selectedBundleIds.includes(
    activeSuggestion.id,
  );

  const handleSizeChange = (sizeId) => {
    const nextSize = product.sizes.find((size) => size.id === sizeId);
    setSelectedSizeId(sizeId);
    setSelectedPlanId(nextSize?.plans[0]?.id ?? "");
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
    setIsInCart(true);
    if (typeof onAddToCart === "function") {
      onAddToCart({
        source,
        productId: product.id,
        size: selectedSize,
        plan: selectedPlan,
        bundleIds: selectedBundleIds,
        totalPrice,
      });
    }
  };

  const handleFavoriteToggle = () => {
    const nextValue = !isFavorite;
    setIsFavorite(nextValue);
    if (typeof onFavoriteToggle === "function") {
      onFavoriteToggle({ productId: product.id, isFavorite: nextValue });
    }
  };

  return (
    <section className="product-banner-root">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-12 lg:py-8 xl:px-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm font-normal leading-7 text-[#8F8F8F] sm:text-base">
            {product.breadcrumb.map((item, index) => {
              const isLastItem = index === product.breadcrumb.length - 1;
              return (
                <li
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-1"
                >
                  {item.href && !isLastItem ? (
                    <a
                      href={item.href}
                      className="transition-colors hover:text-[#0F4A12]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      className={
                        isLastItem ? "font-semibold text-[#1A1A1A]" : ""
                      }
                    >
                      {item.label}
                    </span>
                  )}
                  {!isLastItem ? (
                    <span className="text-[#B7B7B7]">&gt;</span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>

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
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="product-banner-main-media">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
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
                <a
                  href={product.review.href}
                  className="text-sm font-medium text-[#1A1A1A] underline underline-offset-2 sm:text-base p-review"
                >
                  See All Reviews
                </a>
              </div>

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
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="space-y-1">
                            <p className="text-xs leading-none text-[#9E9E9E]">
                              {plan.perDayLabel}
                            </p>
                            <span className="inline-flex rounded-full bg-[#0F4A12] px-2 py-1 text-[10px] font-semibold leading-none text-[#EBF466]">
                              {plan.offerLabel}
                            </span>
                          </div>
                          <p className="text-lg font-semibold leading-none text-[#E55C2A] sm:text-xl">
                            {formatCurrency(plan.price)}
                          </p>
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
                      {product.subscription.description}
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
                  <button
                    type="button"
                    onClick={() => {
                      if (isInCart) {
                        window.location.href = product.cta.cartHref;
                      } else {
                        handleAddToCart("cart");
                      }
                    }}
                    className={`product-banner-cta flex w-full items-center justify-center rounded-full px-5 py-4 text-center text-lg font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(105,81,255,0.05)] sm:text-2xl 
    ${isInCart ? "bg-[#0F4A12]" : "bg-[#E8754C]"}`}
                  >
                    {isInCart
                      ? "Go to Cart"
                      : `${product.cta.addToCartLabel} | ${formatCurrency(totalPrice)}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart("shop-pay")}
                    className="product-banner-cta flex w-full items-center justify-center rounded-full bg-[#4E3CE2] px-5 py-4 text-center text-base font-semibold leading-6 text-white shadow-[0_1px_2px_0_rgba(105,81,255,0.05)]"
                  >
                    {product.cta.shopPayLabel}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {product.guaranteeBadges.map((item) => (
                    <GuaranteeCard key={item.id} item={item} />
                  ))}
                </div>

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
                            <span className="text-lg font-semibold leading-[1.34] text-[#B2B2B2] line-through sm:text-xl">
                              {formatCurrency(activeSuggestion.compareAtPrice)}
                            </span>
                            <span className="text-lg font-semibold leading-[1.34] text-[#1A1A1A] sm:text-xl">
                              {formatCurrency(activeSuggestion.price)}
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
                              {isActiveSuggestionAdded ? "Remove" : "Quick Add"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
    </section>
  );
};

export default ProductBanner;
