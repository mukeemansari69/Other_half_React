import React, { useState } from "react";
import {
  FaArrowRight,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

import { apiRequest } from "../lib/api.js";
import "/public/Home/css/footer.css";

const quickLinksPrimary = [
  { label: "Home", to: "/" },
  { label: "Shop All", to: "/collection" },
  { label: "Take the Quiz", to: "/quiz" },
  { label: "About Us", to: "/our-story" },
  { label: "Science", to: "/science" },
  { label: "FAQ", to: "/faq" },
];

const quickLinksSecondary = [
  { label: "Ingredient Glossary", to: "/glossary" },
  { label: "Ingredient Integrity", to: "/integrity" },
  { label: "Blog", to: "/blog" },
  { label: "Clinical Studies", to: "/clinical-studies" },
];

const customerCareLinks = [
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Manage Subscription", to: "/manage-subscription" },
  { label: "Refund Policy", to: "/refund-policy" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Subscription Policy", to: "/subscription-policy" },
  { label: "Contact Us", to: "/contact" },
];

const FooterLinkList = ({ links, className }) => {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.to}>
          <NavLink
            to={link.to}
            className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

const NewsletterSignup = ({ source, compact = false }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await apiRequest("/newsletter/subscribe", {
        method: "POST",
        body: {
          email,
          source,
        },
      });

      setStatus({ type: "success", message: response.message });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Subscription could not be saved.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <h4 className="text-[18px] font-bold leading-[28px] text-[#1A1A1A]">Join the Pack</h4>
      <form className="relative" onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center bg-[#FAF9F5] border border-[#161829] rounded-[6px] overflow-hidden ${
            compact ? "h-[50px]" : "w-[248px] h-[50px]"
          }`}
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full h-full px-[16px] bg-transparent outline-none text-[14px]"
          />
          <button
            type="submit"
            className="absolute right-0 w-[50px] h-[50px] bg-[#0F4A12] flex items-center justify-center"
            disabled={submitting}
            aria-label="Subscribe to newsletter"
          >
            <FaArrowRight className="text-white w-[13px] h-[15px]" />
          </button>
        </div>
      </form>
      <p className="text-[14px] font-normal leading-[1.4] text-[#1A1A1A]">
        Get thoughtful care tips, product drops, and helpful notes for people who love
        their dogs like family.
      </p>
      {status.message ? (
        <p
          className={`text-[13px] leading-[1.5] ${
            status.type === "success" ? "text-[#0F4A12]" : "text-[#A13A2C]"
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="footer-font w-full bg-[#FFFFFF] footer-border-top">
      <div className="hidden lg:flex flex-col items-center pt-[80px] pb-[80px] gap-[36px]">
        <div className="w-full max-w-[1440px] flex justify-between items-start gap-[10px]">
          <div className="w-[130px] h-[155px] flex-shrink-0">
            <img
              src="/Home/images/PetPlus-Logo.png"
              alt="PetPlus logo"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-1 justify-between items-start h-auto gap-[32px]">
            <div className="flex flex-col gap-[12px]">
              <h4 className="text-[18px] font-bold leading-[28px] text-[#1A1A1A]">Quick Sniffs</h4>
              <div className="flex gap-[52px]">
                <FooterLinkList
                  links={quickLinksPrimary}
                  className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]"
                />
                <FooterLinkList
                  links={quickLinksSecondary}
                  className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[12px] w-[192px]">
              <h4 className="text-[18px] font-bold leading-[28px] text-[#1A1A1A]">Customer Care</h4>
              <FooterLinkList
                links={customerCareLinks}
                className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]"
              />
            </div>

            <div className="w-[248px]">
              <NewsletterSignup source="footer-desktop" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1440px] pt-[16px] border-t border-gray-100 flex justify-between items-center">
          <p className="text-[16px] font-medium leading-[30px] text-[#000000]">
            © 2026 PetPlus. All rights reserved.
          </p>
          <div className="flex gap-[34px] items-center">
            <FaFacebookF className="w-[24px] h-[24px] cursor-pointer social-icon-blue" />
            <FaTwitter className="w-[24px] h-[24px] cursor-pointer" />
            <FaInstagram className="w-[24px] h-[24px] cursor-pointer" />
            <FaLinkedinIn className="w-[24px] h-[24px] cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex lg:hidden flex-col pt-[24px] px-[16px] pb-[24px] gap-[29px] items-start">
        <div className="flex flex-col gap-[17px] w-full mobile-logo">
          <img
            src="/Home/images/PetPlus-Logo.png"
            alt="PetPlus logo"
            loading="lazy"
            decoding="async"
            className="w-[100px] h-[120px] object-contain"
          />
          <div className="flex gap-[34px] items-center">
            <FaFacebookF className="w-[24px] h-[24px] social-icon-blue" />
            <FaTwitter className="w-[24px] h-[24px]" />
            <FaInstagram className="w-[24px] h-[24px]" />
            <FaLinkedinIn className="w-[24px] h-[24px]" />
          </div>
        </div>

        <div className="flex flex-col gap-[12px] w-full">
          <h4 className="text-[18px] font-bold leading-[28px]">Quick Sniffs</h4>
          <FooterLinkList
            links={quickLinksPrimary}
            className="grid grid-cols-1 gap-[12px] text-[16px] font-normal mobile-grid"
          />
          <FooterLinkList
            links={quickLinksSecondary}
            className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]"
          />
        </div>

        <div className="flex flex-col gap-[12px] w-full">
          <h4 className="text-[18px] font-bold leading-[28px]">Customer Care</h4>
          <FooterLinkList
            links={customerCareLinks}
            className="flex flex-col gap-[12px] text-[16px] font-normal text-[#1A1A1A]"
          />
        </div>

        <div className="w-full">
          <NewsletterSignup source="footer-mobile" compact />
        </div>

        <div className="pt-[16px] border-t border-gray-100 w-full">
          <p className="text-[16px] font-medium leading-[30px] text-[#000000]">
            © 2026 PetPlus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
