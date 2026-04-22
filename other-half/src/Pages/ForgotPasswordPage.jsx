import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthHeroPanel from "../Components/AuthHeroPanel.jsx";
import { LoadingButton } from "../Components/LoadingControl.jsx";
import AuthNotice from "../Components/AuthNotice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthConfig } from "../hooks/useAuthConfig.js";

const heroHighlights = [
  {
    title: "Email reset",
    text: "Send a reset OTP to the registered inbox and set a new password after verification.",
  },
  {
    title: "Phone reset",
    text: "Use the registered mobile number to receive a reset code by SMS.",
  },
  {
    title: "Secure recovery",
    text: "Reset OTPs expire quickly and are validated server-side before any password change is accepted.",
  },
];

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, resetPassword } = useAuth();
  const { config } = useAuthConfig();
  const [method, setMethod] = useState("email");
  const [step, setStep] = useState("request");
  const [formState, setFormState] = useState({
    email: "",
    phone: "",
    otp: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [debugPayload, setDebugPayload] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleRequestReset = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    setDebugPayload(null);

    try {
      const response = await requestPasswordReset({
        method,
        email: formState.email,
        phone: formState.phone,
      });
      setDebugPayload(response.debug || null);
      setStep("reset");
      setStatus({
        type: "success",
        message: response.message || "Reset code sent successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Reset code could not be sent.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await resetPassword({
        method,
        email: formState.email,
        phone: formState.phone,
        otp: formState.otp,
        password: formState.password,
      });
      navigate("/account", { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Password could not be reset.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FBF8EF] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[70vh] max-w-[1240px] gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <AuthHeroPanel
          eyebrow="Password recovery"
          title="Reset access without weakening account security."
          description="Choose whether recovery should happen through the registered email or the registered mobile number, then verify the OTP before the password changes."
          highlights={heroHighlights}
          footer={`Recovery OTPs expire in ${config.otpExpiresInMinutes} minutes and can only be used once.`}
        />

        <section className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Forgot password
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">
            Recover your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5F5B4F]">
            Request a recovery OTP first, then submit the code with a new password.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-full bg-[#F7F2E7] p-1">
            {["email", "phone"].map((nextMethod) => (
              <button
                key={nextMethod}
                type="button"
                onClick={() => {
                  setMethod(nextMethod);
                  setStatus({ type: "", message: "" });
                }}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  method === nextMethod
                    ? "bg-[#0F4A12] text-white"
                    : "text-[#5F5B4F]"
                }`}
              >
                {nextMethod === "email" ? "Recover by email" : "Recover by mobile"}
              </button>
            ))}
          </div>

          {step === "request" ? (
            <form className="mt-8 space-y-5" onSubmit={handleRequestReset}>
              {method === "email" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#353126]">Registered email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={formState.email}
                    onChange={(event) => handleFieldChange("email", event.target.value)}
                    className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                    placeholder="name@example.com"
                    required
                  />
                </label>
              ) : (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#353126]">Registered mobile number</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={formState.phone}
                    onChange={(event) => handleFieldChange("phone", event.target.value)}
                    className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                    placeholder="+91 9876543210"
                    required
                  />
                </label>
              )}

              <AuthNotice type={status.type || "neutral"} message={status.message} />

              <LoadingButton
                type="submit"
                className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                loading={submitting}
                loadingText="Sending code..."
                disabled={submitting}
              >
                Send reset OTP
              </LoadingButton>
            </form>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleResetPassword}>
              {method === "email" ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#353126]">Registered email</span>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(event) => handleFieldChange("email", event.target.value)}
                    className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                    required
                  />
                </label>
              ) : (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#353126]">Registered mobile number</span>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(event) => handleFieldChange("phone", event.target.value)}
                    className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">
                  {config.otpLength}-digit OTP
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={config.otpLength}
                  value={formState.otp}
                  onChange={(event) => handleFieldChange("otp", event.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                  placeholder="Enter OTP"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={formState.password}
                  onChange={(event) => handleFieldChange("password", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                  placeholder={`At least ${config.passwordMinLength} characters`}
                  minLength={config.passwordMinLength}
                  required
                />
              </label>

              <AuthNotice type={status.type || "neutral"} message={status.message}>
                {debugPayload?.otp ? (
                  <p className="font-mono text-xs">
                    Dev OTP: <strong>{debugPayload.otp}</strong>
                  </p>
                ) : null}
              </AuthNotice>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="rounded-full border border-[#D9D1BF] px-6 py-3 text-sm font-semibold text-[#1A1A1A]"
                >
                  Request again
                </button>
                <LoadingButton
                  type="submit"
                  className="rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                  loading={submitting}
                  loadingText="Resetting..."
                  disabled={submitting}
                >
                  Reset password
                </LoadingButton>
              </div>
            </form>
          )}

          <p className="mt-6 text-sm text-[#5F5B4F]">
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-[#0F4A12]">
              Go back to login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
