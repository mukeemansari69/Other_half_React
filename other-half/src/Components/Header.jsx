import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";

import "/public/Home/css/header.css";
import { LoadingButton } from "./LoadingControl.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const desktopLinks = [
  { label: "HOME", to: "/" },
  { label: "SHOP", to: "/collection" },
  { label: "ABOUT", to: "/our-story" },
  { label: "SCIENCE", to: "/science" },
  { label: "FAQ", to: "/faq" },
];

const mobileSections = [
  {
    title: "Shop & Discover",
    links: [
      {
        label: "Home",
        to: "/",
        description: "Start from the homepage and latest featured content.",
      },
      {
        label: "Shop All",
        to: "/collection",
        description: "Browse the full product collection.",
      },
      {
        label: "Product Overview",
        to: "/product",
        description: "See the main product experience and daily benefits.",
      },
      {
        label: "Daily Duo",
        to: "/daily-duo",
        description: "Explore the wellness + dental bundle routine.",
      },
      {
        label: "Doggie Dental",
        to: "/doggie-dental",
        description: "Discover the no-brush oral care product.",
      },
      {
        label: "Take the Quiz",
        to: "/quiz",
        description: "Find the best routine for your dog.",
      },
      {
        label: "Cart",
        to: "/cart",
        description: "Review added products and continue to secure checkout.",
      },
    ],
  },
  {
    title: "Learn More",
    links: [
      {
        label: "About Us",
        to: "/our-story",
        description: "Read the brand story and product vision.",
      },
      {
        label: "Ingredient Integrity",
        to: "/integrity",
        description: "See how sourcing and ingredient standards are handled.",
      },
      {
        label: "Science",
        to: "/science",
        description: "Learn how ingredients support daily dog wellness.",
      },
      {
        label: "Clinical Studies",
        to: "/clinical-studies",
        description: "Explore study-style product and formula pages.",
      },
      {
        label: "Blog",
        to: "/blog",
        description: "Read practical dog care and product education content.",
      },
      {
        label: "Glossary",
        to: "/glossary",
        description: "Understand ingredients and what they do.",
      },
      {
        label: "FAQ",
        to: "/faq",
        description: "Find answers about products and subscriptions.",
      },
    ],
  },
  {
    title: "Customer Care",
    links: [
      {
        label: "Terms & Conditions",
        to: "/terms",
        description: "Review general site, order, and billing terms.",
      },
      {
        label: "Manage Subscription",
        to: "/manage-subscription",
        description: "Update cadence, address, or payment details.",
      },
      {
        label: "Refund Policy",
        to: "/refund-policy",
        description: "Understand returns, damage reviews, and refunds.",
      },
      {
        label: "Privacy Policy",
        to: "/privacy-policy",
        description: "See how customer and order data is handled.",
      },
      {
        label: "Subscription Policy",
        to: "/subscription-policy",
        description: "Read the rules behind recurring billing and renewals.",
      },
      {
        label: "Contact Us",
        to: "/contact",
        description: "Reach support for orders, billing, and product questions.",
      },
    ],
  },
];

const searchCatalog = mobileSections.flatMap((section) =>
  section.links.map((link) => ({
    ...link,
    group: section.title,
    keywords: `${section.title} ${link.label} ${link.description}`.toLowerCase(),
  }))
);

const quickSearchResults = [
  "/collection",
  "/daily-duo",
  "/science",
  "/faq",
  "/cart",
  "/manage-subscription",
  "/contact",
].map((path) => searchCatalog.find((item) => item.to === path));

const desktopNavClass = ({ isActive }) =>
  `header-nav-link ${isActive ? "is-active" : ""}`;

export default function Header() {
  const location = useLocation();
  const { isAdmin, isAuthenticated, logout, user } = useAuth();
  const { cartCount } = useCart();
  const searchInputRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const trimmedSearch = searchQuery.trim().toLowerCase();
  const accountPath = isAuthenticated ? (isAdmin ? "/admin" : "/account") : "/login";
  const accountLabel = isAuthenticated ? (isAdmin ? "Admin" : "Account") : "Login";
  const userInitials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const visibleSearchResults = useMemo(() => {
    if (!trimmedSearch) {
      return quickSearchResults.filter(Boolean);
    }

    return searchCatalog
      .filter((item) => item.keywords.includes(trimmedSearch))
      .slice(0, 8);
  }, [trimmedSearch]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen((currentValue) => {
      const nextValue = !currentValue;
      if (nextValue) {
        setSearchOpen(false);
      }
      return nextValue;
    });
  };

  const toggleSearch = () => {
    setSearchOpen((currentValue) => {
      const nextValue = !currentValue;
      if (nextValue) {
        setMenuOpen(false);
      }
      if (!nextValue) {
        setSearchQuery("");
      }
      return nextValue;
    });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="w-full header-shell">
      <div className="w-full bg-[#EBF466] h-[48px] flex items-center justify-center">
        <p className="font-semibold text-[14px] md:text-[16px] text-[#1A1A1A]">
          Subscribe & save on every order!
        </p>
      </div>

      <div className="w-full bg-white border-b border-black/20 backdrop-blur-md header-main">
        <div className="max-w-[1920px] mx-auto px-[20px] lg:px-[120px] py-[12px] flex items-center justify-between header-main__bar">
          <Link to="/" className="flex items-center w-[262px] header-logo" aria-label="PetPlus home">
            <img
              src="/Home/images/PetPlus-Logo.png"
              alt="PetPlus logo"
              className="w-[40px] h-[40px]"
            />
          </Link>

          <nav className="hidden lg:flex gap-[16px] text-[16px] font-semibold text-[#0F4A12]">
            {desktopLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={desktopNavClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-[8px] header-actions">
            <NavLink to="/quiz" className="hidden lg:flex items-center justify-center bg-[#1A1A1A] text-white text-sm px-[14px] py-[6px] rounded-full h-[40px] header-quiz-button">
              Take the Quiz
            </NavLink>

            <NavLink
              to={accountPath}
              className="hidden lg:flex items-center justify-center rounded-full border border-[#D9D4C8] bg-[#F7F4EA] px-[14px] py-[6px] text-sm font-semibold text-[#1A1A1A] h-[40px]"
            >
              {accountLabel}
            </NavLink>

            <button
              type="button"
              className={`w-[40px] h-[40px] flex items-center justify-center p-[8px] rounded header-icon-button ${
                searchOpen ? "is-active" : ""
              }`}
              onClick={toggleSearch}
              aria-expanded={searchOpen}
              aria-controls="site-search-panel"
              aria-label="Toggle site search"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <NavLink
              to="/cart"
              className="w-[40px] h-[40px] flex items-center justify-center p-[8px] rounded relative header-icon-button"
              aria-label="Open cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              ) : null}
            </NavLink>

            <Link
              to={accountPath}
              className="w-[40px] h-[40px] flex items-center justify-center p-[8px] rounded header-icon-button"
              aria-label={isAuthenticated ? `Open ${accountLabel}` : "Open login"}
            >
              {isAuthenticated && userInitials ? (
                <span className="text-[12px] font-bold text-[#1A1A1A]">{userInitials}</span>
              ) : (
                <User size={20} />
              )}
            </Link>

            {isAuthenticated ? (
              <LoadingButton
                type="button"
                className="hidden lg:flex items-center justify-center rounded-full border border-[#D9D4C8] px-[14px] py-[6px] text-sm font-semibold text-[#1A1A1A] h-[40px]"
                lockOnClick
                loadingText="Signing out..."
                onClick={logout}
              >
                Sign out
              </LoadingButton>
            ) : null}

            <button
              type="button"
              className="lg:hidden w-[40px] h-[40px] flex items-center justify-center header-icon-button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          id="site-search-panel"
          className={`header-search-panel ${searchOpen ? "is-open" : ""}`}
          aria-hidden={!searchOpen}
        >
          <div className="header-search-panel__shell">
            <div className="header-search-panel__inner">
              <div className="header-search-panel__top">
                <p className="header-search-panel__eyebrow">Search the site</p>
                <button
                  type="button"
                  className="header-search-panel__close"
                  onClick={closeSearch}
                >
                  Close
                </button>
              </div>

              <div className="header-search-form">
                <Search size={18} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products, science, policies, or support pages"
                  aria-label="Search pages"
                />
              </div>

              <div className="header-search-results">
                {visibleSearchResults.length > 0 ? (
                  visibleSearchResults.map((item) => (
                    <Link
                      key={`${item.group}-${item.to}`}
                      to={item.to}
                      className="header-search-result-card"
                    >
                      <span className="header-search-result-card__group">{item.group}</span>
                      <p className="header-search-result-card__title">{item.label}</p>
                      <p className="header-search-result-card__text">{item.description}</p>
                    </Link>
                  ))
                ) : (
                  <div className="header-search-empty">
                    <p className="header-search-empty__title">No matching pages found</p>
                    <p className="header-search-empty__text">
                      Try searching for shop, science, refund, subscription, or contact.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`header-mobile-backdrop lg:hidden ${menuOpen ? "is-open" : ""}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <div
        id="mobile-navigation-drawer"
        className={`header-mobile-drawer lg:hidden ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="header-mobile-drawer__panel">
          <div className="header-mobile-drawer__top">
            <Link to="/" className="header-mobile-drawer__brand" onClick={closeMenu}>
              <img
                src="/Home/images/PetPlus-Logo.png"
                alt="PetPlus logo"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="header-mobile-drawer__brand-title">PetPlus</p>
                <p className="header-mobile-drawer__brand-text">Everything in one place</p>
              </div>
            </Link>

            <button
              type="button"
              className="header-mobile-drawer__close"
              onClick={closeMenu}
              aria-label="Close mobile menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="header-mobile-drawer__body">
            {mobileSections.map((section) => (
              <section key={section.title} className="header-mobile-section">
                <p className="header-mobile-section__title">{section.title}</p>
                <div className="header-mobile-section__links">
                  {section.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `header-mobile-link ${isActive ? "is-active" : ""}`
                      }
                      onClick={closeMenu}
                    >
                      <span className="header-mobile-link__label">{link.label}</span>
                      <span className="header-mobile-link__text">{link.description}</span>
                    </NavLink>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="header-mobile-drawer__footer">
            <NavLink to="/quiz" className="header-mobile-drawer__quiz" onClick={closeMenu}>
              Take the Quiz
            </NavLink>
            <div className="mt-3 grid gap-2">
              <NavLink
                to="/cart"
                className="header-mobile-drawer__quiz bg-white text-[#1A1A1A] border border-[#D9D4C8]"
                onClick={closeMenu}
              >
                Cart {cartCount > 0 ? `(${cartCount})` : ""}
              </NavLink>
              <NavLink
                to={accountPath}
                className="header-mobile-drawer__quiz bg-white text-[#1A1A1A] border border-[#D9D4C8]"
                onClick={closeMenu}
              >
                {accountLabel}
              </NavLink>
              {isAuthenticated ? (
                <LoadingButton
                  type="button"
                  className="header-mobile-drawer__quiz"
                  lockOnClick
                  loadingText="Signing out..."
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Sign out
                </LoadingButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


