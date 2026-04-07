import React from "react";
import {
  Clock3,
  HeartHandshake,
  Mail,
  PackageCheck,
  Truck,
  WalletCards,
} from "lucide-react";

import PolicyPage from "../Support/PolicyPage";

const LAST_UPDATED = "April 7, 2026";

const page = {
  path: "/refund-policy",
  themeClass: "support-page--peach",
  eyebrow: "Customer Care / Returns",
  title: "Refund Policy",
  intro:
    "We want every order to feel low risk and easy to understand. This policy explains when a purchase may be eligible for a refund, what information helps us review a request faster, and how we handle damaged or incorrect shipments.",
  image: "public/Default/images/dogs.webp",
  imageAlt: "Dog eating from a bowl",
  stats: [
    { label: "Policy date", value: LAST_UPDATED },
    { label: "Review speed", value: "Usually 1 to 2 business days" },
    { label: "Refund method", value: "Original payment method" },
  ],
  actions: [
    { label: "Contact support", to: "/contact", variant: "primary" },
    { label: "Manage subscription", to: "/manage-subscription", variant: "secondary" },
  ],
  highlights: [
    {
      icon: HeartHandshake,
      title: "Fair review process",
      text: "We review refund requests using order date, product condition, and the specific issue you experienced.",
    },
    {
      icon: PackageCheck,
      title: "Wrong or damaged order support",
      text: "If the shipment arrives damaged or incorrect, contact us quickly with clear photos and your order number.",
    },
    {
      icon: WalletCards,
      title: "Back to the original payment method",
      text: "Approved refunds are returned to the original payment method and bank timing can vary after processing.",
    },
  ],
  sections: [
    {
      id: "eligibility-window",
      title: "1. Refund windows and eligibility",
      paragraphs: [
        "Refund eligibility depends on the product, condition of the item, and how long it has been since the order was delivered. Unless a product page clearly states a longer guarantee, requests should be submitted within 30 days of delivery.",
        "Some formulas or bundles may advertise a product-specific satisfaction window. If that happens, the product page terms govern that specific order.",
      ],
      listTitle: "To improve eligibility, submit your request with:",
      list: [
        "Your order number and the email address used at checkout.",
        "A short explanation of the issue, such as damage, incorrect item, or product fit concern.",
        "Photos of the package or product if the issue relates to damage, leakage, or a packing error.",
      ],
    },
    {
      id: "qualifying-orders",
      title: "2. What may qualify for a refund",
      paragraphs: [
        "We may approve refunds for orders that arrive damaged, contain the wrong item, are materially defective, or fall under an active satisfaction guarantee shown on the relevant product page.",
        "For product fit concerns, we may ask follow-up questions about how the formula was used, how long it was used, and whether the item was opened or mostly unused.",
      ],
      listTitle: "Examples that may qualify include:",
      list: [
        "A package arrives with visible transit damage or broken seals.",
        "The shipment contains the wrong formula, size, or quantity.",
        "A covered product-specific satisfaction guarantee applies to your order.",
      ],
    },
    {
      id: "non-refundable",
      title: "3. What generally does not qualify",
      paragraphs: [
        "To protect the integrity of ingestible pet products, some items cannot be refunded once they are heavily used, far outside the posted policy window, or compromised by improper storage after delivery.",
        "Shipping charges are generally non-refundable unless the issue was caused by our error or the carrier returned the shipment due to a verified fulfillment problem.",
      ],
      listTitle: "Refunds may be denied for:",
      list: [
        "Requests submitted outside the stated refund or guarantee window.",
        "Products that were extensively consumed, altered, or stored in unsafe conditions after delivery.",
        "Gift cards, final-sale promotions, or misuse of promotional and refund systems.",
      ],
    },
    {
      id: "damaged-or-incorrect",
      title: "4. Damaged, defective, or incorrect orders",
      paragraphs: [
        "If your order arrives damaged, incomplete, or incorrect, contact us as soon as possible so we can investigate while carrier data and package details are still fresh.",
        "We may offer a replacement, store credit, or refund depending on product condition, stock availability, and the nature of the issue.",
      ],
      listTitle: "Please include:",
      list: [
        "The order number and delivery ZIP code.",
        "Photos of the outer package, label, and affected item.",
        "A brief note explaining whether you prefer a replacement review or refund review.",
      ],
      callout:
        "Waiting too long to report transit damage can reduce what the carrier allows us to recover on your behalf.",
    },
    {
      id: "processing-timing",
      title: "5. How refunds are processed",
      paragraphs: [
        "Once approved, refunds are issued back to the original payment method. Most refunds are initiated within 1 to 2 business days after approval, but your bank may take additional time to post the credit.",
        "If a subscription order is already in progress when a cancellation request arrives, we may only be able to stop future renewals instead of reversing the current charge.",
      ],
    },
  ],
  infoCards: [
    {
      icon: Clock3,
      title: "Typical review time",
      text: "Most standard refund requests are reviewed within 1 to 2 business days once we have the necessary details.",
    },
    {
      icon: Truck,
      title: "Photos help with shipping claims",
      text: "Clear images of the parcel and item speed up damaged-order reviews and help us determine whether a replacement makes sense.",
    },
    {
      icon: Mail,
      title: "Start a refund request",
      text: "If you already have your order number ready, our support page is the fastest place to begin.",
      action: { label: "Go to contact page", to: "/contact" },
    },
  ],
  cta: {
    eyebrow: "Need to stop future recurring orders too?",
    title: "Refunds and subscription edits are related, but they are not the same process.",
    text: "If your question is about preventing a future renewal, update the subscription first and then contact support if the current order still needs review.",
    actions: [
      { label: "Manage your plan", to: "/manage-subscription", variant: "light" },
      { label: "Read subscription policy", to: "/subscription-policy", variant: "outline" },
    ],
  },
};

const RefundPolicyPage = () => {
  return <PolicyPage page={page} />;
};

export default RefundPolicyPage;
