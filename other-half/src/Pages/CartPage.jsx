import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { apiRequest } from "../lib/api.js";

const SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING_RATE = 6.99;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const CartPage = () => {
  const { user } = useAuth();
  const {
    items,
    subtotal,
    removeItem,
    updateItemQuantity,
    clearCart,
    cartCount,
  } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [checkingOut, setCheckingOut] = useState(false);
  const [upiCheckoutInfo, setUpiCheckoutInfo] = useState(null);

  const shipping = useMemo(() => {
    if (subtotal === 0 || subtotal >= SHIPPING_THRESHOLD) {
      return 0;
    }

    return FLAT_SHIPPING_RATE;
  }, [subtotal]);

  const total = subtotal + shipping;

  useEffect(() => {
    const checkoutState = searchParams.get("checkout");

    if (!checkoutState) {
      return;
    }

    if (checkoutState === "success") {
      clearCart();
      setStatus({
        type: "success",
        message:
          "Payment received. Thank you. Your order has been placed successfully.",
      });
    } else if (checkoutState === "cancelled") {
      setStatus({
        type: "error",
        message:
          "Payment was cancelled. Your cart is still saved, and you can try again anytime.",
      });
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("checkout");
    setSearchParams(nextParams, { replace: true });
  }, [clearCart, searchParams, setSearchParams]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setStatus({
        type: "error",
        message: "Your cart is empty. Add a product before checkout.",
      });
      return;
    }

    setCheckingOut(true);
    setStatus({ type: "", message: "" });
    setUpiCheckoutInfo(null);

    try {
      const response = await apiRequest("/payments/create-checkout-session", {
        method: "POST",
        body: {
          email: user?.email || "",
          successUrl: `${window.location.origin}/cart?checkout=success`,
          cancelUrl: `${window.location.origin}/cart?checkout=cancelled`,
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            image: item.image,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        },
      });

      if (!response?.url) {
        if (response?.mode === "upi" && response?.upiUrl) {
          setCheckingOut(false);
          setUpiCheckoutInfo({
            upiUrl: response.upiUrl,
            vpa: response.vpa,
            amount: response.amount,
            currency: response.currency,
            transactionRef: response.transactionRef,
          });

          setStatus({
            type: "success",
            message:
              "UPI payment link is ready. Open it in your UPI app and complete payment.",
          });

          return;
        }

        throw new Error("Checkout session could not be created. Please try again.");
      }

      window.location.assign(response.url);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "Checkout could not be started right now. Please try again.",
      });
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="bg-[#FBF8EF] px-6 py-12 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#E6DFCF] bg-white p-10 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF6E7] text-[#0F4A12]">
            <ShoppingCart size={24} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-[#1A1A1A]">
            Your cart is empty
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5F5B4F]">
            Add a product to your cart, and we will keep it here until you are ready
            to checkout.
          </p>
          <Link
            to="/collection"
            className="mt-8 inline-flex rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white"
          >
            Browse collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FBF8EF] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1260px] gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[32px] border border-[#E6DFCF] bg-white p-7 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
                Shopping cart
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#1A1A1A]">
                {cartCount} item{cartCount > 1 ? "s" : ""} in your cart
              </h1>
            </div>
            <button
              type="button"
              className="rounded-full border border-[#D9D1BF] px-4 py-2 text-sm font-semibold text-[#1A1A1A]"
              onClick={clearCart}
            >
              Clear cart
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[24px] bg-[#FBF8EF] p-4 md:grid-cols-[120px_1fr_auto]"
              >
                <img
                  src={item.image || "/Default/images/col1.png"}
                  alt={item.name}
                  className="h-[110px] w-full rounded-2xl object-cover"
                />

                <div>
                  <h2 className="text-xl font-semibold text-[#1A1A1A]">{item.name}</h2>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-6 text-[#5F5B4F]">
                      {item.description}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm font-semibold text-[#0F4A12]">
                    {formatCurrency(item.unitPrice)} each
                  </p>
                </div>

                <div className="flex flex-col items-start justify-between gap-3 md:items-end">
                  <div className="flex items-center gap-2 rounded-full border border-[#D9D1BF] bg-white px-2 py-1">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#1A1A1A]"
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity - 1)
                      }
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-[28px] text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[#1A1A1A]"
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                      }
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="text-lg font-semibold text-[#1A1A1A]">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </p>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#A13A2C]"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-[32px] border border-[#E6DFCF] bg-white p-7 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
            Order summary
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[#1A1A1A]">Checkout</h2>

          <div className="mt-6 space-y-3 text-sm text-[#5F5B4F]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1A1A1A]">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-[#1A1A1A]">
                {shipping === 0 ? "Free" : formatCurrency(shipping)}
              </span>
            </div>
            <div className="h-px bg-[#E6DFCF]" />
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold text-[#1A1A1A]">Total</span>
              <span className="font-semibold text-[#1A1A1A]">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-6 w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {checkingOut ? "Redirecting to secure payment..." : "Proceed to secure payment"}
          </button>

          {status.message ? (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                status.type === "success"
                  ? "bg-[#EEF6E7] text-[#0F4A12]"
                  : "bg-[#FFF1EE] text-[#A13A2C]"
              }`}
            >
              {status.message}
            </div>
          ) : null}

          {upiCheckoutInfo ? (
            <div className="mt-4 rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-4 text-sm text-[#1A1A1A]">
              <p className="font-semibold text-[#0F4A12]">UPI payment ready</p>
              <p className="mt-2">UPI ID: {upiCheckoutInfo.vpa}</p>
              <p>Amount: {formatCurrency(upiCheckoutInfo.amount)}</p>
              <p>Reference: {upiCheckoutInfo.transactionRef}</p>
              <a
                href={upiCheckoutInfo.upiUrl}
                className="mt-3 inline-flex rounded-full bg-[#0F4A12] px-4 py-2 text-xs font-semibold text-white"
              >
                Open UPI app
              </a>
            </div>
          ) : null}

          <p className="mt-4 text-xs leading-5 text-[#7A7468]">
            If Stripe is configured, card checkout opens automatically. If not, the app
            falls back to UPI checkout using the server UPI ID.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default CartPage;
