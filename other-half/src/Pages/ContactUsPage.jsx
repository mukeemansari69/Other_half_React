import React from "react";
import {
  Clock3,
  HeartHandshake,
  Mail,
  MessageCircleMore,
  RefreshCw,
} from "lucide-react";

import PolicyPage from "../Support/PolicyPage";
import ContactSupportFormSection from "../Support/ContactSupportFormSection";

const SUPPORT_EMAIL = "care@PetPlus.co.in";
const SUBSCRIPTION_EMAIL = "subscriptions@PetPlus.co.in";
const PARTNERS_EMAIL = "partners@PetPlus.co.in";

const page = {
  path: "/contact",
  themeClass: "support-page--rose",
  eyebrow: "Customer Care / Direct Help",
  title: "Contact Us",
  intro:
    "Whether you need order help, subscription support, product guidance, or a quick answer before checkout, we are here to make the process calm and clear. The more detail you share up front, the faster we can help.",
  image: "/Default/images/dogs4.avif",
  imageAlt: "Dog carrying an object in its mouth",
  stats: [
    { label: "General response goal", value: "Within 1 business day" },
    { label: "Support hours", value: "Monday to Saturday, 10am to 6pm IST" },
    { label: "Best for", value: "Orders, subscriptions, refunds, and product questions" },
  ],
  actions: [
    { label: "Email customer care", href: `mailto:${SUPPORT_EMAIL}`, variant: "primary" },
    { label: "Browse FAQs", to: "/faq", variant: "secondary" },
  ],
  highlights: [
    {
      icon: Mail,
      title: "Direct customer care",
      text: "Email is the best channel for order history, refund review, and subscription changes that need manual help.",
    },
    {
      icon: MessageCircleMore,
      title: "Faster replies start with detail",
      text: "Including your order number, dog size, and exact concern saves time and reduces back-and-forth.",
    },
    {
      icon: HeartHandshake,
      title: "Support with context",
      text: "We can explain product fit, recurring billing, delivery timing, and policy questions in plain language.",
    },
  ],
  sections: [
    {
      id: "best-way-to-reach-us",
      title: "1. Best way to reach us",
      paragraphs: [
        "For most issues, email is the fastest and most reliable support channel because it lets us review your order history, attach screenshots or photos, and respond with exact next steps.",
        `For general order and product support, contact ${SUPPORT_EMAIL}. For recurring order or billing questions tied to a subscription, contact ${SUBSCRIPTION_EMAIL}. For partnerships, press, or wholesale outreach, contact ${PARTNERS_EMAIL}.`,
      ],
      listTitle: "Use email when you need help with:",
      list: [
        "Order status, delivery issues, damaged shipments, or tracking questions.",
        "Subscription edits, renewal timing, billing errors, or skipped cycles.",
        "Refund eligibility, ingredient questions, or choosing the right formula for your routine.",
      ],
    },
    {
      id: "what-to-include",
      title: "2. What to include in your message",
      paragraphs: [
        "A complete message helps us solve the issue in one pass whenever possible. If your request is tied to an existing order, include the order number and the email address used at checkout.",
        "If you are asking about a product, include your dog's size, age range, and the formula you are using or considering so the team has enough context to respond clearly.",
      ],
      listTitle: "The fastest support requests usually include:",
      list: [
        "Order number, subscription email, or shipping ZIP code.",
        "Product name, dog size, and whether the issue is urgent because renewal or delivery is close.",
        "Photos of the package, label, or product if your concern involves damage, leakage, or the wrong item.",
      ],
    },
    {
      id: "how-we-can-help",
      title: "3. How customer care can help",
      paragraphs: [
        "Our team can review order issues, walk you through plan changes, explain policy language, and point you to the most relevant product or educational page if you are still deciding what fits your routine.",
        "We do our best to give helpful, practical support, but we cannot diagnose or treat medical conditions. For urgent or clinical concerns about your dog, contact a licensed veterinarian.",
      ],
      listTitle: "Common request types include:",
      list: [
        "Help updating a subscription before the next renewal.",
        "Review of damaged, delayed, or incorrect shipments.",
        "Questions about ingredients, daily usage, or which formula best matches your goals.",
      ],
    },
    {
      id: "response-timing",
      title: "4. Response timing and expectations",
      paragraphs: [
        "We aim to respond within 1 business day for most support requests. Response timing can be longer during launches, major promotions, or high-volume shipping periods, but we still work in the order requests are received.",
        "If your issue relates to a shipment that arrived damaged or a renewal date that is close, mention that in the subject line so the team can prioritize the review appropriately.",
      ],
      callout:
        "PetPlus customer care is a store support team, not a veterinary hotline. If your dog is having a reaction or urgent symptoms, contact a veterinarian immediately.",
    },
  ],
  infoCards: [
    {
      icon: Mail,
      title: "Customer care",
      text: SUPPORT_EMAIL,
      action: { label: "Email now", href: `mailto:${SUPPORT_EMAIL}` },
    },
    {
      icon: RefreshCw,
      title: "Subscription support",
      text: SUBSCRIPTION_EMAIL,
      action: { label: "Send subscription email", href: `mailto:${SUBSCRIPTION_EMAIL}` },
    },
    {
      icon: Clock3,
      title: "Support hours",
      text: "Monday to Saturday, 10am to 6pm IST. We aim to reply within 1 business day.",
    },
  ],
  cta: {
    eyebrow: "Want answers before you send a message?",
    title: "Check the policy pages first if your question is about refunds or recurring billing.",
    text: "That usually gives the fastest answer, and if you still need help afterward you will know exactly which details to include in your message.",
    actions: [
      { label: "Open refund policy", to: "/refund-policy", variant: "light" },
      { label: "Open subscription policy", to: "/subscription-policy", variant: "outline" },
    ],
  },
  customSection: () => <ContactSupportFormSection />,
};

const ContactUsPage = () => {
  return <PolicyPage page={page} />;
};

export default ContactUsPage;
