import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, LockKeyhole, X } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const INITIAL_FORM_STATE = {
  email: "",
  password: "",
};

const CheckoutLoginDrawer = ({
  isOpen,
  onClose,
  onAuthenticated,
  title = "Please login",
  message = "Sign in to continue with secure payment.",
}) => {
  const { login } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!isOpen) {
      setSubmitting(false);
      setStatus({ type: "", message: "" });
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await login(form);
      setForm(INITIAL_FORM_STATE);
      onAuthenticated?.(response);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Login could not be completed right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[140] bg-[#1A1A1A]/45"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <aside className="ml-auto flex h-full w-full max-w-[440px] flex-col border-l border-[#E7DECC] bg-[#FFFDF7] shadow-[-32px_0_80px_rgba(25,20,12,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#EFE5D6] px-6 pb-5 pt-6">
          <div className="space-y-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F3C56C] bg-[#FFF4D9] text-[#0F4A12] shadow-[0_0_0_6px_rgba(243,197,108,0.18)]">
              <LockKeyhole size={22} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                Login required
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#1A1A1A]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5F5B4F]">{message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E7DECC] bg-white text-[#1A1A1A]"
            aria-label="Close login drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="rounded-[24px] border border-[#F3C56C] bg-[#FFF9EA] px-4 py-4 text-sm leading-6 text-[#5E5037]">
            Please login first. After sign in, Razorpay payment will continue from the same page.
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#353126]">
                Email address
              </span>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) =>
                  setForm((currentState) => ({
                    ...currentState,
                    email: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#D9D1BF] bg-white px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                placeholder="name@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#353126]">
                Password
              </span>
              <input
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(event) =>
                  setForm((currentState) => ({
                    ...currentState,
                    password: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#D9D1BF] bg-white px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                placeholder="Enter your password"
                required
              />
            </label>

            {status.message ? (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  status.type === "error"
                    ? "bg-[#FFF1EE] text-[#A13A2C]"
                    : "bg-[#EEF6E7] text-[#0F4A12]"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{submitting ? "Signing in..." : "Sign in to continue"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 rounded-[24px] border border-[#E7DECC] bg-white px-4 py-4 text-sm leading-6 text-[#5F5B4F]">
            <p>
              Need a full login page or a new account?
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link to="/login" className="font-semibold text-[#0F4A12]">
                Open login page
              </Link>
              <Link to="/register" className="font-semibold text-[#0F4A12]">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
};

export default CheckoutLoginDrawer;
