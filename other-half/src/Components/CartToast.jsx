import { CheckCircle2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { useCart } from "../context/CartContext.jsx";

const CartToast = () => {
  const { cartCount, cartNotice, dismissCartNotice } = useCart();

  useEffect(() => {
    if (!cartNotice) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dismissCartNotice();
    }, 2400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [cartNotice, dismissCartNotice]);

  if (!cartNotice) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[90] w-[min(calc(100%-1.5rem),24rem)]"
    >
      <div className="pointer-events-auto rounded-[24px] border border-[#D7E8CB] bg-white/95 p-4 shadow-[0_24px_80px_rgba(34,30,18,0.16)] backdrop-blur">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF6E7] text-[#0F4A12]">
            <CheckCircle2 size={20} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
              Added to cart
            </p>
            <p className="mt-1 text-base font-semibold text-[#1A1A1A]">
              {cartNotice.itemName}
            </p>
            <p className="mt-1 text-sm text-[#5F5B4F]">
              {cartCount} item{cartCount === 1 ? "" : "s"} ready for checkout.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={dismissCartNotice}
            className="text-sm font-semibold text-[#6A6458]"
          >
            Continue shopping
          </button>

          <Link
            to="/cart"
            onClick={dismissCartNotice}
            className="inline-flex items-center gap-2 rounded-full bg-[#0F4A12] px-4 py-2 text-sm font-semibold text-white"
          >
            <ShoppingCart size={16} />
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartToast;

