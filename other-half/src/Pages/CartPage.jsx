import { MapPin, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import CheckoutLoginDrawer from "../Components/CheckoutLoginDrawer.jsx";
import DeliveryAddressFields from "../Components/DeliveryAddressFields.jsx";
import EmptyStateCard from "../Components/EmptyStateCard.jsx";
import { LoadingButton, LoadingLink } from "../Components/LoadingControl.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { startRazorpayCheckout, toCheckoutItemPayload } from "../lib/startRazorpayCheckout.js";
import {
  formatDeliveryAddressInline,
  getDeliveryAddressTypeLabel,
  hasDeliveryAddressInput,
  isDeliveryAddressComplete,
  normalizeDeliveryAddress,
  validateDeliveryAddress,
} from "../lib/deliveryAddress.js";
import {
  FLAT_SHIPPING_RATE,
  PAYMENT_PROVIDER,
  SHIPPING_THRESHOLD,
  calculateShipping,
  formatStoreCurrency,
  getShippingRuleText,
} from "../../shared/storefrontConfig.js";

const CartPage = () => {
  const { token, user, refreshUser } = useAuth();
  const {
    items,
    subtotal,
    removeItem,
    updateItemQuantity,
    clearCart,
    cartCount,
  } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState({ type: "", message: "" });
  const [checkingOut, setCheckingOut] = useState(false);
  const [showLoginDrawer, setShowLoginDrawer] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(() =>
    normalizeDeliveryAddress(user?.deliveryAddress)
  );
  const [addressErrors, setAddressErrors] = useState({});

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const savedDeliveryAddress = normalizeDeliveryAddress(user?.deliveryAddress);
  const hasSavedDeliveryAddress = isDeliveryAddressComplete(savedDeliveryAddress);
  const previewAddress = hasDeliveryAddressInput(deliveryAddress)
    ? deliveryAddress
    : savedDeliveryAddress;
  const previewAddressComplete = isDeliveryAddressComplete(previewAddress);

  useEffect(() => {
    setDeliveryAddress(normalizeDeliveryAddress(user?.deliveryAddress));
  }, [user]);

  useEffect(() => {
    if (!location.state?.message) {
      return;
    }

    setStatus({
      type: location.state?.needsAddress ? "error" : "success",
      message: location.state.message,
    });
  }, [location.state]);

  const finalizePaidOrder = async (verification, orderId) => {
    clearCart();

    await refreshUser().catch(() => null);
    navigate("/review", {
      replace: true,
      state: {
        fromCheckout: true,
        orderId,
        message:
          verification.message ||
          "Payment received. Your order has been confirmed successfully.",
      },
    });
  };

  const handleAddressFieldChange = (field, value) => {
    setDeliveryAddress((currentAddress) => ({
      ...currentAddress,
      [field]: value,
    }));
    setAddressErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  };

  const handleUseSavedAddress = () => {
    setDeliveryAddress(savedDeliveryAddress);
    setAddressErrors({});
    setStatus({
      type: "success",
      message: "Saved delivery address loaded for checkout.",
    });
  };

  const handleCheckout = async ({
    skipAuthCheck = false,
    authToken = token,
    authUser = user,
  } = {}) => {
    if (items.length === 0) {
      setStatus({
        type: "error",
        message: "Your cart is empty. Add a product before checkout.",
      });
      return;
    }

    const resolvedDeliveryAddress = isDeliveryAddressComplete(deliveryAddress)
      ? normalizeDeliveryAddress(deliveryAddress)
      : normalizeDeliveryAddress(authUser?.deliveryAddress);

    if (!isDeliveryAddressComplete(resolvedDeliveryAddress)) {
      setAddressErrors(validateDeliveryAddress(deliveryAddress));
      setStatus({
        type: "error",
        message: "Please add a complete delivery address before checkout.",
      });
      return;
    }

    setDeliveryAddress(resolvedDeliveryAddress);
    setCheckingOut(true);
    setStatus({ type: "", message: "" });

    try {
      const result = await startRazorpayCheckout({
        token: authToken,
        user: authUser,
        deliveryAddress: resolvedDeliveryAddress,
        items: items.map(toCheckoutItemPayload),
      });

      await finalizePaidOrder(result.verification, result.order.orderId);
    } catch (error) {
      if (error.status === 401) {
        setShowLoginDrawer(true);
      }
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
        <div className="mx-auto max-w-5xl">
          <EmptyStateCard
            icon={ShoppingCart}
            eyebrow="Cart check"
            title="Your cart is waiting for its first scoop"
            description="Pick a routine for joints, digestion, immunity, or dental care and we will keep it here until you are ready to checkout."
            chips={["Daily wellness", "Dental care", "Digestive support", "Quiz picks"]}
            primaryAction={{
              to: "/collection",
              label: "Browse products",
              loadingText: "Opening collection...",
            }}
            secondaryAction={{
              to: "/quiz#quiz-questions",
              label: "Take the quiz",
              loadingText: "Opening quiz...",
            }}
          >
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "Daily wellness stacks",
                  text: "Shop scoopable routines built for repeat daily use.",
                },
                {
                  title: "No-brush dental support",
                  text: "Find simpler oral-care options for breath and plaque support.",
                },
                {
                  title: "Guided picks",
                  text: "Use the quiz if you want the collection narrowed down for you.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-[#E6DFCF] bg-[#FBF8EF] p-4"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5F5B4F]">{item.text}</p>
                </div>
              ))}
            </div>
          </EmptyStateCard>
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
            <LoadingButton
              type="button"
              className="rounded-full border border-[#D9D1BF] px-4 py-2 text-sm font-semibold text-[#1A1A1A]"
              lockOnClick
              loadingText="Clearing..."
              onClick={clearCart}
            >
              Clear cart
            </LoadingButton>
          </div>

          <div className="mt-8 space-y-4">
            <section className="rounded-[28px] border border-[#E6DFCF] bg-[#F7F2E7] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
                    Delivery address
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#1A1A1A]">
                    Where should we send this order?
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F5B4F]">
                    Add the exact delivery location you want on the label. We save it
                    to your account and the admin billing view will use the same address.
                  </p>
                </div>

                {hasSavedDeliveryAddress ? (
                  <button
                    type="button"
                    className="rounded-full border border-[#D6D0C1] bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A]"
                    onClick={handleUseSavedAddress}
                  >
                    Use saved address
                  </button>
                ) : null}
              </div>

              <div className="mt-5 rounded-[24px] border border-[#E6DFCF] bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF6E7] text-[#0F4A12]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#EEF6E7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
                        {getDeliveryAddressTypeLabel(previewAddress.addressType)}
                      </span>
                      <span className="rounded-full bg-[#FBF8EF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6A6458]">
                        {hasSavedDeliveryAddress ? "Saved on account" : "Add once, reuse later"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#5F5B4F]">
                      {previewAddressComplete
                        ? formatDeliveryAddressInline(previewAddress)
                        : "Complete the form below so your order, shipping address, and admin bill all stay in sync."}
                    </p>
                  </div>
                </div>
              </div>

              <DeliveryAddressFields
                address={deliveryAddress}
                errors={addressErrors}
                onChange={handleAddressFieldChange}
                showAddressType={false}
                showOptionalFields={false}
                className="mt-5"
              />
            </section>

            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[24px] bg-[#FBF8EF] p-4 md:grid-cols-[120px_1fr_auto]"
              >
                <img
                  src={item.image || "/Default/images/col1.webp"}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
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
                    {formatStoreCurrency(item.unitPrice)} each
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
                    {formatStoreCurrency(item.unitPrice * item.quantity)}
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

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5F5B4F]">
            {[
              ["1", "Address"],
              ["2", "Review"],
              ["3", PAYMENT_PROVIDER],
            ].map(([step, label], index) => (
              <div
                key={step}
                className={`rounded-2xl border px-2 py-3 ${
                  index === 2
                    ? "border-[#0F4A12] bg-[#0F4A12] text-white"
                    : "border-[#E6DFCF] bg-[#FBF8EF]"
                }`}
              >
                <span className="block text-sm">{step}</span>
                {label}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-[#5F5B4F]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1A1A1A]">
                {formatStoreCurrency(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-[#1A1A1A]">
                {shipping === 0 ? "Free" : formatStoreCurrency(shipping)}
              </span>
            </div>
            <div className="h-px bg-[#E6DFCF]" />
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold text-[#1A1A1A]">Total</span>
              <span className="font-semibold text-[#1A1A1A]">
                {formatStoreCurrency(total)}
              </span>
            </div>
          </div>

          <LoadingButton
            type="button"
            onClick={handleCheckout}
            loading={checkingOut}
            loadingText={`Opening ${PAYMENT_PROVIDER}...`}
            disabled={checkingOut}
            className="mt-6 min-h-[52px] w-full rounded-full bg-[#0F4A12] px-6 py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(15,74,18,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {`Proceed to ${PAYMENT_PROVIDER} checkout`}
          </LoadingButton>

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

          <div className="mt-4 rounded-2xl bg-[#FBF8EF] px-4 py-4 text-xs leading-5 text-[#7A7468]">
            <p>
              Guest checkout is available. Secure payment powered by {PAYMENT_PROVIDER}. {getShippingRuleText()}
            </p>
            <p className="mt-2">
              Orders above {formatStoreCurrency(SHIPPING_THRESHOLD)} ship free.
              Smaller carts include a flat {formatStoreCurrency(FLAT_SHIPPING_RATE)} shipping
              fee.
            </p>
          </div>
        </aside>
      </div>
      <CheckoutLoginDrawer
        isOpen={showLoginDrawer}
        onClose={() => setShowLoginDrawer(false)}
        onAuthenticated={(authResponse) => {
          setShowLoginDrawer(false);
          setStatus({
            type: "success",
            message: "Login successful. Opening Razorpay checkout now.",
          });
          void handleCheckout({
            skipAuthCheck: true,
            authToken: authResponse?.token || token,
            authUser: authResponse?.user || user,
          });
        }}
        title="Please login"
        message="You can continue as a guest, or login if you want this order saved to your account."
      />
    </main>
  );
};

export default CartPage;
