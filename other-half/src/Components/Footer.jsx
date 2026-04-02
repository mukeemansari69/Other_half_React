import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaArrowRight } from 'react-icons/fa';
import "/public/Home/css/footer.css";

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
                  <li>Home</li>
                  <li>Shop All</li>
                  <li>Take the Quiz</li>
                  <li>About Us</li>
                  <li>Science</li>
                  <li>FAQ</li>
                </ul>
                <ul className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]">
                  <li>Ingredient Glossary</li>
                  <li>Ingredient Integrity</li>
                  <li>Our Story</li>
                  <li>Blog</li>
                  <li>Clinical Studies</li>
                </ul>
              </div>
            </div>

            {/* Customer Care */}
            <div className="flex flex-col gap-[12px] w-[192px]">
              <h4 className="text-[18px] font-bold leading-[28px] text-[#1A1A1A]">Customer Care</h4>
              <ul className="flex flex-col gap-[10px] text-[18px] font-normal leading-none text-[#1A1A1A]">
                <li>Terms & Conditions</li>
                <li>Manage Subscription</li>
                <li>Refund Policy</li>
                <li>Privacy Policy</li>
                <li>Subscription Policy</li>
                <li>Contact Us</li>
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
            <li>Home</li>
            <li>Shop All</li>
            <li>Take the Quiz</li>
            <li>About Us</li>
            <li>Science</li>
            <li>FAQ</li>
            <li>Ingredient Glossary</li>
            <li>Ingredient Integrity</li>
            <li>Our Story</li>
            <li>Blog</li>
            <li>Clinical Studies</li>
          </ul>
        </div>

        {/* Customer Care Mobile */}
        <div className="flex flex-col gap-[12px] w-full">
          <h4 className="text-[18px] font-bold leading-[28px]">Customer Care</h4>
          <ul className="flex flex-col gap-[12px] text-[16px] font-normal text-[#1A1A1A]">
            <li>Terms & Conditions</li>
            <li>Manage Subscription</li>
            <li>Refund Policy</li>
            <li>Privacy Policy</li>
            <li>Subscription Policy</li>
            <li>Contact Us</li>
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