import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowRight } from 'react-icons/fa';
import "/public/Home/css/footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-font w-full bg-[#FFFFFF] footer-border-top">
      
      {/* DESKTOP UI - Hidden on Mobile, Visible on md and up */}
      <div className="hidden md:flex flex-col items-center pt-[80px]  pb-[80px] gap-[36px]">
        
        {/* Main Content Row */}
        <div className="w-full max-w-[1440px] flex justify-between items-start gap-[10px]">
          
          {/* Logo Section */}
          <div className="w-[130px] h-[155px] flex-shrink-0">
            <img src="/Home/images/logo2.png" alt="Other Half Logo" className="w-full h-full object-contain" />
          </div>

          {/* Text Container */}
          <div className="flex flex-1 justify-between items-start h-auto">
            
            {/* Quick Sniffs */}
            <div className="flex flex-col gap-[12px]">
              <h4 className="text-[18px] font-bold leading-[28px] text-[#1A1A1A]">Quick Sniffs</h4>
              <div className="flex gap-[52px]">
                <ul className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]">
                  <li>
                    <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              Home 
            </NavLink>
                  </li>
                  <li>
                     <NavLink
              to="/collection"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              Shop All 
            </NavLink>
                   </li>
                  <li>
                    <NavLink
              to="/Quiz"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
               Take the Quiz
            </NavLink>
                   </li>
                  <li>
                    <NavLink
              to="/story"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
               About Us
            </NavLink>
                   </li>
                  <li>
                     <NavLink
              to="/science"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
               Science
            </NavLink>
                   </li>
                  <li>
                    <NavLink
              to="/faqpage"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
               FAQ
            </NavLink>
                   </li>
                </ul>
                <ul className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]">
                  <li>
                    <NavLink
              to="/glossary"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                Ingredient Glossary
            </NavLink>
                  </li>
                  <li>
                     <NavLink
              to="/integrity"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                 Ingredient Integrity
            </NavLink>
                   </li>
                  <li>
                    {/*  <NavLink
              to="/story"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                 Our Story
            </NavLink> */}
                    </li>
                  <li>
                           <NavLink
              to="/blog"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                  Blog
            </NavLink>
                   </li>
                  <li>
                          <NavLink
              to="/clinical"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                  Clinical Studies
            </NavLink>
                   </li>
                </ul>
              </div>
            </div>

            {/* Customer Care */}
            <div className="flex flex-col gap-[12px] w-[192px]">
              <h4 className="text-[18px] font-bold leading-[28px] text-[#1A1A1A]">Customer Care</h4>
              <ul className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]">
                <li>
  <NavLink
    to="/terms"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Terms & Conditions
  </NavLink>
</li>

<li>
  <NavLink
    to="/manage-subscription"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Manage Subscription
  </NavLink>
</li>

<li>
  <NavLink
    to="/refund-policy"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Refund Policy
  </NavLink>
</li>

<li>
  <NavLink
    to="/privacy-policy"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Privacy Policy
  </NavLink>
</li>

<li>
  <NavLink
    to="/subscription-policy"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Subscription Policy
  </NavLink>
</li>

<li>
  <NavLink
    to="/contact"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Contact Us
  </NavLink>
</li>
              </ul>
            </div>

            {/* Join the Pack */}
            <div className="flex flex-col gap-[24px] w-[248px]">
              <div className="flex flex-col gap-[12px]">
                <h4 className="text-[18px] font-bold leading-[28px] text-[#1A1A1A]">Join the Pack</h4>
                <div className="relative flex items-center w-[248px] h-[50px] bg-[#FAF9F5] border border-[#161829] rounded-[6px] overflow-hidden">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full h-full px-[16px] bg-transparent outline-none text-[14px]"
                  />
                  <button className="absolute right-0 w-[50px] h-[50px] bg-[#0F4A12] flex items-center justify-center border-l border-[#363636]">
                    <FaArrowRight className="text-white w-[13px] h-[15px]" />
                  </button>
                </div>
              </div>
              <p className="text-[14px] font-normal leading-[1.4] text-[#1A1A1A]">
                Sign up for exclusive deals, new drops, and the occasional meme. No spam. Just tail-wag-worthy content.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Bar Desktop */}
        <div className="w-full max-w-[1440px] pt-[16px] border-t border-gray-100 flex justify-between items-center">
          <p className="text-[16px] font-medium leading-[30px] text-[#000000]">
            © 2025 Other Half. All rights reserved.
          </p>
          <div className="flex gap-[34px] items-center">
            <FaFacebookF className="w-[24px] h-[24px] cursor-pointer social-icon-blue" />
            <FaTwitter className="w-[24px] h-[24px] cursor-pointer" />
            <FaInstagram className="w-[24px] h-[24px] cursor-pointer" />
            <FaLinkedinIn className="w-[24px] h-[24px] cursor-pointer" />
          </div>
        </div>
      </div>

      {/* MOBILE UI - Visible on small screens, Hidden on md and up */}
      <div className="flex md:hidden flex-col pt-[24px] px-[16px] pb-[24px] gap-[29px] items-start">
        
        {/* Logo & Social Icons */}
        <div className="flex flex-col gap-[17px] w-full mobile-logo">
          <img src="/Home/images/logo2.png" alt="Logo" className="w-[100px] h-[120px] object-contain" />
          <div className="flex gap-[34px] items-center">
            <FaFacebookF className="w-[24px] h-[24px] social-icon-blue" />
            <FaTwitter className="w-[24px] h-[24px]" />
            <FaInstagram className="w-[24px] h-[24px]" />
            <FaLinkedinIn className="w-[24px] h-[24px]" />
          </div>
        </div>

        {/* Quick Sniffs Mobile */}
        <div className="flex flex-col gap-[12px] w-full">
          <h4 className="text-[18px] font-bold leading-[28px]">Quick Sniffs</h4>
          <ul className="grid grid-cols-1 gap-[12px] text-[16px] font-normal mobile-grid">
             <li>
                    <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              Home 
            </NavLink>
                  </li>
                  <li>
                     <NavLink
              to="/collection"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              Shop All 
            </NavLink>
                   </li>
                  <li>
                    <NavLink
              to="/Quiz"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
               Take the Quiz
            </NavLink>
                   </li>
                  <li>
                    <NavLink
              to="/story"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
               About Us
            </NavLink>
                   </li>
                  <li>
                     <NavLink
              to="/science"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
               Science
            </NavLink>
                   </li>
                  <li>
                    <NavLink
              to="/faqPage"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
               FAQ
            </NavLink>
                   </li>
                </ul>
                <ul className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]">
                  <li>
                    <NavLink
              to="/glossary"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                Ingredient Glossary
            </NavLink>
                  </li>
                  <li>
                     <NavLink
              to="/integrity"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                 Ingredient Integrity
            </NavLink>
                   </li>
                 {/*  <li>
                     <NavLink
              to="/story"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                 Our Story
            </NavLink>
                    </li> */}
                  <li>
                           <NavLink
              to="/blog"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                  Blog
            </NavLink>
                   </li>
                  <li>
                          <NavLink
              to="/clinical"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
                  Clinical Studies
            </NavLink>
                   </li>
          </ul>
        </div>

        {/* Customer Care Mobile */}
        <div className="flex flex-col gap-[12px] w-full">
          <h4 className="text-[18px] font-bold leading-[28px]">Customer Care</h4>
          <ul className="flex flex-col gap-[12px] text-[16px] font-normal text-[#1A1A1A]">
             <li>
  <NavLink
    to="/terms"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Terms & Conditions
  </NavLink>
</li>

<li>
  <NavLink
    to="/manage-subscription"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Manage Subscription
  </NavLink>
</li>

<li>
  <NavLink
    to="/refund-policy"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Refund Policy
  </NavLink>
</li>

<li>
  <NavLink
    to="/privacy-policy"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Privacy Policy
  </NavLink>
</li>

<li>
  <NavLink
    to="/subscription-policy"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Subscription Policy
  </NavLink>
</li>

<li>
  <NavLink
    to="/contact"
    className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
  >
    Contact Us
  </NavLink>
</li>
          </ul>
        </div>

        {/* Join the Pack Mobile */}
        <div className="flex flex-col gap-[24px] w-full">
          <h4 className="text-[18px] font-bold leading-[28px]">Join the Pack</h4>
          <div className="relative flex items-center h-[50px] bg-[#FAF9F5] border border-[#161829] rounded-[6px]">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full h-full px-[16px] bg-transparent outline-none text-[14px]"
            />
            <button className="absolute right-0 w-[50px] h-[50px] bg-[#0F4A12] flex items-center justify-center rounded-r-[6px]">
              <FaArrowRight className="text-white" />
            </button>
          </div>
          <p className="text-[14px] leading-[1.4] text-[#1A1A1A]">
            Sign up for exclusive deals, new drops, and the occasional meme. No spam. Just tail-wag-worthy content.
          </p>
        </div>

        {/* Copyright Mobile */}
        <div className="pt-[16px] border-t border-gray-100 w-full">
          <p className="text-[16px] font-medium leading-[30px] text-[#000000]">
            © 2025 Other Half. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;