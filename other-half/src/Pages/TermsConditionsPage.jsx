import React from "react";
import {
  CircleHelp,
  FileCheck2,
  PawPrint,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";

import PolicyPage from "../Support/PolicyPage";

const LAST_UPDATED = "April 7, 2026";

const page = {
  path: "/terms",
  themeClass: "support-page--leaf",
  eyebrow: "Customer Care / Store Terms",
  title: "Terms & Conditions",
  intro:
    "These terms explain how you can browse the Other Half website, place orders, use subscriptions, and interact with our products and content. By visiting the site or completing a purchase, you agree to the terms below.",
  image: "/public/Default/images/dog.jpg",
  imageAlt: "A happy dog looking toward the camera",
  stats: [
    { label: "Effective date", value: LAST_UPDATED },
    { label: "Applies to", value: "Website, orders, and subscriptions" },
    { label: "Main focus", value: "Site use, billing, and product terms" },
  ],
  actions: [
    { label: "Contact support", to: "/contact", variant: "primary" },
    { label: "Subscription policy", to: "/subscription-policy", variant: "secondary" },
  ],
  highlights: [
    {
      icon: ShieldCheck,
      title: "Transparent store rules",
      text: "Pricing, order acceptance, and recurring billing rules are outlined before and after checkout.",
    },
    {
      icon: PawPrint,
      title: "Pet wellness context",
      text: "Our formulas support daily wellness, but they do not replace veterinary diagnosis or emergency care.",
    },
    {
      icon: FileCheck2,
      title: "Updated terms",
      text: "If we revise these terms, the latest posted version controls future use of the site and services.",
    },
  ],
  sections: [
    {
      id: "acceptance",
      title: "1. Acceptance and eligibility",
      paragraphs: [
        "By using the website, creating an account, or placing an order, you confirm that you are legally able to enter into a binding agreement and that you will use the site in a lawful way.",
        "If you are purchasing on behalf of a household, rescue, or business, you are responsible for making sure the person placing the order has authority to do so.",
      ],
      listTitle: "When using the site, you agree to:",
      list: [
        "Provide accurate billing, shipping, and account information.",
        "Keep your login details secure and notify us if you suspect unauthorized access.",
        "Avoid copying, reselling, scraping, or interfering with the site, checkout, or support tools.",
      ],
      callout:
        "If you do not agree to these terms, please do not use the site or complete a purchase.",
    },
    {
      id: "orders-billing",
      title: "2. Orders, pricing, and billing",
      paragraphs: [
        "Prices, promotions, bundle offers, and shipping thresholds can change at any time. The price shown at checkout is the amount you authorize us to charge, including any applicable taxes and shipping fees.",
        "We reserve the right to limit quantities, refuse suspected fraudulent orders, or cancel an order if product availability, pricing, or billing information appears incorrect.",
      ],
      listTitle: "Important billing notes:",
      list: [
        "Promo codes cannot be combined unless checkout specifically allows it.",
        "Orders are not final until payment authorization is completed.",
        "If we cancel an order after payment, we will refund the original payment method.",
      ],
    },
    {
      id: "subscriptions",
      title: "3. Subscription terms",
      paragraphs: [
        "Some products may be offered as recurring subscriptions with discounted pricing. When you subscribe, you authorize recurring charges according to the delivery cadence selected at checkout.",
        "Detailed operating rules, including edit windows and cancellation timing, are described on our Subscription Policy page.",
      ],
      listTitle: "Subscription basics include:",
      list: [
        "Recurring orders renew until paused or canceled.",
        "Changes made after a renewal cutoff may apply to the next cycle instead of the current one.",
        "Promotional subscription pricing may depend on an active recurring plan.",
      ],
    },
    {
      id: "shipping-product-use",
      title: "4. Shipping, delivery, and product use",
      paragraphs: [
        "Shipping timelines are estimates, not guarantees. Carrier delays, weather events, incorrect addresses, and inventory constraints can affect delivery timing even after an order has shipped.",
        "Always follow label instructions and use professional veterinary guidance if your dog has allergies, is taking medication, or has an existing medical condition.",
      ],
      listTitle: "Please keep in mind:",
      list: [
        "Results vary by dog, consistency of use, age, diet, and overall health.",
        "Product information on the site is not a substitute for veterinary care.",
        "You are responsible for reviewing ingredients before purchase if your dog has sensitivities.",
      ],
    },
    {
      id: "rights-liability",
      title: "5. Site content, liability, and updates",
      paragraphs: [
        "All text, graphics, product photography, logos, and brand elements on the site belong to Other Half or our licensors and are protected by applicable intellectual property laws.",
        "To the fullest extent allowed by law, Other Half is not liable for indirect or consequential damages arising from site use, delayed delivery, or product performance expectations. Continued use of the site after updates means you accept the revised terms.",
      ],
    },
  ],
  infoCards: [
    {
      icon: WalletCards,
      title: "Checkout controls the price",
      text: "Taxes, shipping, discounts, and cadence selection are finalized at checkout and shown before you pay.",
    },
    {
      icon: Truck,
      title: "Delivery estimates are not guarantees",
      text: "Carrier scans, weather, address quality, and inventory timing can all affect when an order arrives.",
    },
    {
      icon: CircleHelp,
      title: "Need a plain-language explanation?",
      text: "Our support team can walk you through order, billing, or subscription terms before you place an order.",
      action: { label: "Talk to support", to: "/contact" },
    },
  ],
  cta: {
    eyebrow: "Still comparing store policies?",
    title: "See how subscriptions, refunds, and customer support fit together.",
    text: "If your question is about recurring orders or billing changes, the next best page is usually Manage Subscription or Subscription Policy.",
    actions: [
      { label: "Manage subscription", to: "/manage-subscription", variant: "light" },
      { label: "View refund policy", to: "/refund-policy", variant: "outline" },
    ],
  },
};

const TermsConditionsPage = () => {
  return <PolicyPage page={page} />;
};

export default TermsConditionsPage;
