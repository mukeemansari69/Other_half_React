import React from "react";
import {
  CalendarClock,
  CircleHelp,
  CreditCard,
  RefreshCw,
} from "lucide-react";

import PolicyPage from "../Support/PolicyPage";

const LAST_UPDATED = "April 7, 2026";

const page = {
  path: "/subscription-policy",
  themeClass: "support-page--sand",
  eyebrow: "Customer Care / Recurring Billing",
  title: "Subscription Policy",
  intro:
    "Our subscription program is designed for convenience, consistency, and savings. This policy explains how recurring billing works, when changes take effect, how pricing and cadence are set, and what happens if a charge fails or a plan is canceled.",
  image: "/Default/images/col3.png",
  imageAlt: "Daily Duo collection tile",
  stats: [
    { label: "Policy date", value: LAST_UPDATED },
    { label: "Program type", value: "Auto-renewing recurring delivery" },
    { label: "Best practice", value: "Edit at least 48 hours before renewal" },
  ],
  actions: [
    { label: "Manage subscription", to: "/manage-subscription", variant: "primary" },
    { label: "Contact support", to: "/contact", variant: "secondary" },
  ],
  highlights: [
    {
      icon: RefreshCw,
      title: "Auto-renewal stays active",
      text: "Subscription orders continue to renew until you pause or cancel them from the account area or through support.",
    },
    {
      icon: CreditCard,
      title: "Saved billing method is reused",
      text: "Each renewal is charged to the payment method on file at the time the recurring order processes.",
    },
    {
      icon: CalendarClock,
      title: "Cadence depends on the plan",
      text: "Delivery timing is tied to the product and plan selected at checkout, including size-based supply options where applicable.",
    },
  ],
  sections: [
    {
      id: "auto-renewal",
      title: "1. How auto-renewal works",
      paragraphs: [
        "When you choose a subscription offer, you authorize recurring charges and recurring shipments based on the cadence selected during checkout. The subscription stays active until it is paused or canceled.",
        "Renewal timing may differ by product, size, or plan configuration. The active cadence shown in your account or renewal notice is the timing that controls your future orders.",
      ],
      listTitle: "Auto-renewal means:",
      list: [
        "You do not need to place each order manually while the plan remains active.",
        "Future charges are processed using the saved payment method on file.",
        "Renewal notices and timing reminders may be sent before the next recurring charge where supported.",
      ],
    },
    {
      id: "pricing-cadence",
      title: "2. Pricing, discounts, and cadence selection",
      paragraphs: [
        "Subscription pricing may include savings compared with one-time purchases. The amount of that discount, and the cadence options available, can vary by product, dog size, bundle type, or promotional campaign.",
        "Multi-month supply options and recurring bundle pricing are shown at checkout and may change over time for new subscriptions or future renewals if prices are updated.",
      ],
      listTitle: "A few pricing rules to keep in mind:",
      list: [
        "The discount shown at checkout applies to the selected plan at the time you subscribe.",
        "Future pricing may change with notice where required if ingredient or shipping costs materially shift.",
        "Some offers are limited to first-time subscribers, active plans, or specific products.",
      ],
    },
    {
      id: "changes-cutoff",
      title: "3. Edit, skip, pause, or cancel timing",
      paragraphs: [
        "To avoid an unwanted renewal, make changes at least 48 hours before the next scheduled charge. This applies to address updates, cadence changes, product swaps, skips, pauses, and cancellations.",
        "Requests submitted after the cutoff may not stop the current renewal if the system has already begun billing or preparing fulfillment.",
      ],
      listTitle: "Changes made before the cutoff may include:",
      list: [
        "Skipping one cycle while keeping the plan active.",
        "Pausing the plan until you are ready to restart.",
        "Canceling future renewals or updating the product, quantity, size, or destination address.",
      ],
      callout:
        "A successful cancellation stops future recurring orders, but it does not automatically reverse a renewal that already processed.",
    },
    {
      id: "payment-failures",
      title: "4. Failed payments and account status",
      paragraphs: [
        "If a renewal charge fails, we may retry the payment, notify you to update billing details, or temporarily pause the subscription until a valid payment method is provided.",
        "If a plan is canceled, paused for a long period, or materially changed, previously applied promotional pricing may no longer be available when the plan is reactivated.",
      ],
    },
    {
      id: "refund-interaction",
      title: "5. How this policy works with refunds",
      paragraphs: [
        "This page explains how recurring plans renew and how future charges can be stopped. Refund decisions for billed orders are handled separately under the Refund Policy.",
        "If you no longer want a subscription, cancel or pause it first, then contact support if a recently renewed order still needs to be reviewed for eligibility.",
      ],
    },
  ],
  infoCards: [
    {
      icon: RefreshCw,
      title: "Recurring until changed",
      text: "Plans continue to renew automatically until they are paused or canceled through the account or with customer care.",
    },
    {
      icon: CreditCard,
      title: "Renewals use the saved method",
      text: "Make sure your card and billing details are current before the next scheduled order date.",
    },
    {
      icon: CircleHelp,
      title: "Need help with the cutoff window?",
      text: "The Manage Subscription page explains the practical steps for editing a plan before the next charge.",
      action: { label: "Open manage subscription", to: "/manage-subscription" },
    },
  ],
  cta: {
    eyebrow: "Want the practical how-to version?",
    title: "Use the management guide when you are ready to change an active plan.",
    text: "This page covers the rules. The Manage Subscription page shows the most common plan changes and the details that help support resolve issues faster.",
    actions: [
      { label: "Go to management guide", to: "/manage-subscription", variant: "light" },
      { label: "See refund policy", to: "/refund-policy", variant: "outline" },
    ],
  },
};

const SubscriptionPolicyPage = () => {
  return <PolicyPage page={page} />;
};

export default SubscriptionPolicyPage;
