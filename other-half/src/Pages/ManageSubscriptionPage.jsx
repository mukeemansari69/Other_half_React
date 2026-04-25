import React from "react";
import {
  CalendarClock,
  CreditCard,
  MessageCircleMore,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

import PolicyPage from "../Support/PolicyPage";

const LAST_UPDATED = "April 7, 2026";

const page = {
  path: "/manage-subscription",
  themeClass: "support-page--mint",
  eyebrow: "Customer Care / Subscription Help",
  title: "Manage Subscription",
  intro:
    "Your subscription is built to stay flexible. This page explains how to update delivery timing, change product quantity, switch payment details, skip an upcoming shipment, or pause service without losing control of your routine.",
  image: "/Product/images/multi.webp",
  imageAlt: "PetPlus Daily Duo product packaging",
  stats: [
    { label: "Updated", value: LAST_UPDATED },
    { label: "Best for", value: "Plan changes, skips, and payment updates" },
    { label: "Recommended window", value: "At least 48 hours before renewal" },
  ],
  actions: [
    { label: "Subscription policy", to: "/subscription-policy", variant: "primary" },
    { label: "Refund policy", to: "/refund-policy", variant: "secondary" },
  ],
  highlights: [
    {
      icon: RefreshCw,
      title: "Pause or skip with less friction",
      text: "Recurring orders can usually be delayed without canceling the whole plan.",
    },
    {
      icon: CreditCard,
      title: "Billing details stay editable",
      text: "Update saved payment methods before your next renewal to avoid failed charges.",
    },
    {
      icon: PackageCheck,
      title: "Adjust the routine",
      text: "Quantity, cadence, and address changes let you match the plan to real daily usage.",
    },
  ],
  sections: [
    {
      id: "portal-access",
      title: "1. How to access your subscription",
      paragraphs: [
        "You can usually manage your plan through the subscription link in your account area, a renewal reminder email, or a customer care message sent after your first recurring order is created.",
        "For the smoothest experience, use the same email address that was used at checkout so your order history, active plan, and renewal schedule all appear in one place.",
      ],
      listTitle: "Your subscription portal typically allows you to:",
      list: [
        "View active products, renewal dates, and last successful charges.",
        "Check the delivery cadence selected for your dog's size or formula.",
        "See whether a plan is active, paused, skipped, or awaiting payment.",
      ],
    },
    {
      id: "plan-updates",
      title: "2. What you can change",
      paragraphs: [
        "Depending on the product, you can usually change quantity, switch product size, move the next order date, or update your shipping address and billing method.",
        "Any changes made after an order begins processing may apply to the next cycle instead of the shipment that is already being prepared.",
      ],
      listTitle: "The most common updates are:",
      list: [
        "Changing the delivery cadence to better match actual product usage.",
        "Increasing or decreasing quantity for one dog or multiple dogs.",
        "Updating payment card details, billing address, or shipping destination before the next charge runs.",
      ],
    },
    {
      id: "skip-pause-cancel",
      title: "3. Skip, pause, reactivate, or cancel",
      paragraphs: [
        "If you are stocked up, waiting on travel, or testing product fit, you can often skip a shipment or pause the plan instead of fully canceling. That helps preserve convenience without triggering an unnecessary reorder.",
        "If you decide to cancel, the cancellation usually stops future renewals only. Orders that have already been billed or entered fulfillment are handled under the Refund Policy.",
      ],
      listTitle: "A few useful distinctions:",
      list: [
        "Skip means one cycle is delayed but the plan stays active afterward.",
        "Pause temporarily stops renewals until you reactivate the plan.",
        "Cancel ends future recurring billing and may remove access to subscriber pricing.",
      ],
    },
    {
      id: "renewal-timing",
      title: "4. Timing matters before the next renewal",
      paragraphs: [
        "To avoid a charge or shipment you no longer want, make changes at least 48 hours before the scheduled renewal date. That buffer gives the billing and fulfillment systems time to register the update correctly.",
        "If a request is submitted too close to renewal, we will do our best to help, but we may only be able to apply the change to the following cycle.",
      ],
      listTitle: "Changes that are safest to make early include:",
      list: [
        "Card updates after an expiration or replacement.",
        "Address corrections before a move or temporary relocation.",
        "Product swaps when your dog changes size, routine, or support needs.",
      ],
      callout:
        "The closer you are to renewal, the higher the chance that the current order has already entered billing or fulfillment.",
    },
    {
      id: "support-help",
      title: "5. When customer care should step in",
      paragraphs: [
        "If your subscription portal does not show the right plan, your last renewal failed unexpectedly, or you need a change that the self-service area does not support, contact us directly and include the email used on your order.",
        "The more detail you send up front, the faster we can verify your plan and resolve billing, cadence, or address issues accurately.",
      ],
      listTitle: "Helpful details to include in your message:",
      list: [
        "Order number or subscription email address.",
        "Product name, dog size, and the exact change you need.",
        "Whether the issue is urgent because a renewal date is within the next 48 hours.",
      ],
    },
  ],
  infoCards: [
    {
      icon: CalendarClock,
      title: "48-hour change window",
      text: "Edits made before the renewal cutoff have the best chance of applying to the very next recurring order.",
    },
    {
      icon: CreditCard,
      title: "Update billing first",
      text: "If your card is expired or replaced, save the new payment method before your next scheduled charge.",
    },
    {
      icon: MessageCircleMore,
      title: "Manual help is available",
      text: "If the self-service portal does not show what you need, customer care can review the plan with you.",
      action: { label: "Open contact page", to: "/contact" },
    },
  ],
  cta: {
    eyebrow: "Need the formal recurring billing rules?",
    title: "Read the policy behind renewals, cancellations, and recurring discounts.",
    text: "This page explains how to manage a plan. The Subscription Policy explains the rules that control how recurring orders renew and when edits take effect.",
    actions: [
      { label: "Open subscription policy", to: "/subscription-policy", variant: "light" },
      { label: "See refund policy", to: "/refund-policy", variant: "outline" },
    ],
  },
};

const ManageSubscriptionPage = () => {
  return <PolicyPage page={page} />;
};

export default ManageSubscriptionPage;
