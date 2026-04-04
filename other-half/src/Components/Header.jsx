import { useState } from "react";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      <div className="w-full bg-[#EBF466] h-[48px] flex items-center justify-center">
        <p className="font-semibold text-[14px] md:text-[16px] text-[#1A1A1A]">
          Subscribe & save on every order!
        </p>
      </div>

      {/* Main Header */}
      <div className="w-full bg-white border-b border-black/20 backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto px-[20px] lg:px-[120px] py-[12px] flex items-center justify-between">
          {/* LEFT CONTAINER (LOGO) */}
          <div className="flex items-center w-[262px]">
            <img
              src="/Home/images/dog-logo.svg"
              alt="logo"
              className="w-[40px] h-[40px]"
            />
          </div>

          {/* CENTER MENU (DESKTOP) */}
          <nav className="hidden lg:flex gap-[16px] text-[16px] font-semibold text-[#0F4A12]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-[#EBF466] border-b-2 border-[#EBF466]"
                  : "text-[#0F4A12]"
              }
            >
              HOME
            </NavLink>

            <NavLink
              to="/collection"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              SHOP
            </NavLink>

            <NavLink
              to="/story"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              ABOUT
            </NavLink>

            <NavLink
              to="/science"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              SCIENCE
            </NavLink>

            <NavLink
              to="/glossary"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              GLOSSARY
            </NavLink>

            <NavLink
              to="/faqPage"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
              FAQ
            </NavLink>
          </nav>

          {/* RIGHT CONTAINER */}
          <div className="flex items-center justify-end gap-[8px]">
            {/* QUIZ BUTTON (DESKTOP) */}
            <button className="hidden lg:flex items-center justify-center bg-[#1A1A1A] text-white text-sm px-[14px] py-[6px] rounded-full h-[40px]">
               <NavLink
              to="/Quiz"
              className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
            >
             Take the Quiz
            </NavLink>
             
            </button>

            {/* ICONS */}
            <button className="w-[40px] h-[40px] flex items-center justify-center p-[8px] rounded">
              <Search size={20} />
            </button>

            <button className="w-[40px] h-[40px] flex items-center justify-center p-[8px] rounded relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full">
                2
              </span>
            </button>

            <button className="w-[40px] h-[40px] flex items-center justify-center p-[8px] rounded">
              <User size={20} />
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden w-[40px] h-[40px] flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden border-t border-black/10 px-6 pb-6 text-align-center mobile-menu">
            <nav className="flex flex-col gap-4 mt-4 text-[#0F4A12] font-semibold">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EBF466] border-b-2 border-[#EBF466]"
                    : "text-[#0F4A12]"
                }
              >
                HOME
              </NavLink>

              <NavLink
                to="/collection"
                className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
              >
                SHOP
              </NavLink>

              <NavLink
                to="/story"
                className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
              >
                ABOUT
              </NavLink>

              <NavLink
                to="/science"
                className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
              >
                SCIENCE
              </NavLink>

              <NavLink
                to="/glossary"
                className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
              >
                GLOSSARY
              </NavLink>

              <NavLink
                to="/quiz"
                className={({ isActive }) => (isActive ? "text-[#EBF466]" : "")}
              >
                FAQ
              </NavLink>
            </nav>

            <button className="mt-4 bg-black text-white px-6 py-2 rounded-full">
              Take the Quiz
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
