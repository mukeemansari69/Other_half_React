import React from "react";
import {
  BellRing,
  FileLock2,
  UserRoundSearch,
} from "lucide-react";

import PolicyPage from "../Support/PolicyPage";

const LAST_UPDATED = "April 7, 2026";

const page = {
  path: "/privacy-policy",
  themeClass: "support-page--sky",
  eyebrow: "Customer Care / Privacy",
  title: "Privacy Policy",
  intro:
    "We collect only the information needed to run the store responsibly, fulfill orders, personalize your customer experience, and improve how the brand communicates with dog parents. This page explains what we collect, why we use it, and how you can control it.",
  image: "/Default/images/dogs3.jpg",
  imageAlt: "Dog ingredients and product themed banner",
  stats: [
    { label: "Last updated", value: LAST_UPDATED },
    { label: "Covers", value: "Account, checkout, marketing, and analytics" },
    { label: "Request route", value: "Use the contact page for privacy requests" },
  ],
  actions: [
    { label: "Contact support", to: "/contact", variant: "primary" },
    { label: "Terms & conditions", to: "/terms", variant: "secondary" },
  ],
  highlights: [
    {
      icon: FileLock2,
      title: "Order-first data use",
      text: "Most information is collected to process orders, manage subscriptions, and improve customer support quality.",
    },
    {
      icon: UserRoundSearch,
      title: "Clear data categories",
      text: "We separate information into account, order, device, and pet profile details so usage stays easier to understand.",
    },
    {
      icon: BellRing,
      title: "Marketing stays optional",
      text: "You can opt out of promotional emails or texts without affecting transactional updates about existing orders.",
    },
  ],
  sections: [
    {
      id: "what-we-collect",
      title: "1. Information we collect",
      paragraphs: [
        "We may collect personal information you provide directly, including your name, email address, shipping and billing details, order history, and any messages you send to customer care.",
        "We may also collect pet-related information, such as your dog's size, age range, product preferences, or routine details, when you use quizzes, subscriptions, or support channels designed to personalize recommendations.",
      ],
      listTitle: "Typical categories include:",
      list: [
        "Account and checkout data such as name, address, email, and payment-related details handled through secure processors.",
        "Support messages, order notes, or form submissions you choose to send us.",
        "Basic device and usage data such as browser type, pages viewed, and referral source.",
      ],
    },
    {
      id: "how-we-use",
      title: "2. How we use your information",
      paragraphs: [
        "We use information to fulfill purchases, manage subscriptions, respond to customer care requests, reduce fraud, improve store performance, and better understand which products or educational content are most useful.",
        "If you opt into marketing, we may also use your information to send educational emails, product reminders, restock prompts, and promotional offers related to your interests or purchase behavior.",
      ],
      listTitle: "Common uses include:",
      list: [
        "Processing payments, shipping orders, and sending delivery or renewal notices.",
        "Providing product and subscription support based on prior orders or support history.",
        "Improving website usability, merchandising decisions, and campaign effectiveness.",
      ],
    },
    {
      id: "sharing-cookies",
      title: "3. Sharing, cookies, and analytics",
      paragraphs: [
        "We do not sell your personal information in the ordinary sense of trading customer lists for cash. We may share limited information with trusted service providers that help us run the store, such as payment processors, shipping platforms, analytics tools, email providers, and subscription management services.",
        "Like most ecommerce websites, we may use cookies and similar technologies to remember cart sessions, understand page performance, measure ad effectiveness, and improve the overall customer experience.",
      ],
      listTitle: "These tools may be used to:",
      list: [
        "Keep you signed in or maintain your cart between page visits.",
        "Measure which pages, campaigns, or products are performing well.",
        "Support remarketing or audience-building efforts when allowed by law and platform settings.",
      ],
    },
    {
      id: "retention-rights",
      title: "4. Retention, security, and your choices",
      paragraphs: [
        "We keep information for as long as reasonably necessary to fulfill orders, manage subscriptions, provide support, maintain business records, comply with legal obligations, and resolve disputes.",
        "You can unsubscribe from marketing emails at any time, manage some communication preferences directly, and contact us to request access, correction, or deletion of certain information subject to applicable law.",
      ],
      listTitle: "You can usually request to:",
      list: [
        "Review or correct contact and account information.",
        "Opt out of non-essential marketing communications.",
        "Request deletion of eligible personal data, subject to legal and operational exceptions.",
      ],
      callout:
        "The website is intended for adults making purchasing decisions for their households and pets. It is not designed for children to submit personal information directly.",
    },
  ],
  infoCards: [
    {
      icon: UserRoundSearch,
      title: "Main data buckets",
      text: "Account details, order history, support messages, device signals, and optional pet profile information are the main categories we use.",
    },
    {
      icon: BellRing,
      title: "Marketing can be turned off",
      text: "Opting out of promotional messages will not stop essential order, shipping, or renewal notices tied to your active purchases.",
    },
    {
      icon: FileLock2,
      title: "Send a privacy request",
      text: "Use the support page if you want to request access, correction, or deletion review.",
      action: { label: "Submit a request", to: "/contact" },
    },
  ],
  cta: {
    eyebrow: "Need policy context too?",
    title: "Privacy, checkout, and recurring billing all connect across the store.",
    text: "If your question is about what happens after a subscription renews or an order processes, the Terms and Subscription Policy pages give the clearest next step.",
    actions: [
      { label: "Read terms", to: "/terms", variant: "light" },
      { label: "Read subscription policy", to: "/subscription-policy", variant: "outline" },
    ],
  },
};

const PrivacyPolicyPage = () => {
  return <PolicyPage page={page} />;
};

export default PrivacyPolicyPage;

