import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useWishlist } from "../hooks/useWishlist.js";

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors";

const WishlistButton = ({ productId, className = "", iconOnly = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(productId);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname,
          nextPathname: location.pathname,
          wishlistProductId: productId,
        },
      });
      return;
    }

    toggleWishlist(productId);
  };

  const label = !isAuthenticated
    ? "Sign in to save"
    : wishlisted
      ? "Wishlisted"
      : "Save";
  const activeClassName = wishlisted
    ? "border-[#0F4A12] bg-[#0F4A12] text-white"
    : "border-[#D9D1BF] bg-white text-[#1A1A1A] hover:border-[#0F4A12]";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isAuthenticated ? wishlisted : undefined}
      aria-label={label}
      className={`${baseClassName} ${activeClassName} ${iconOnly ? "min-h-11 min-w-11 px-3" : ""} ${className}`.trim()}
    >
      <Heart
        size={18}
        className="flex-shrink-0"
        fill={wishlisted ? "currentColor" : "none"}
      />
      {iconOnly ? null : <span>{label}</span>}
    </button>
  );
};

export default WishlistButton;
