import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthConnectionNotice from "../Components/AuthConnectionNotice.jsx";
import AuthHeroPanel from "../Components/AuthHeroPanel.jsx";
import AuthNotice from "../Components/AuthNotice.jsx";
import AuthSocialButtons from "../Components/AuthSocialButtons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useApiConnectionStatus } from "../hooks/useApiConnectionStatus.js";
import { useAuthConfig } from "../hooks/useAuthConfig.js";

const heroHighlights = [
  {
    title: "Email + password",
    text: "Secure password sign-in stays available after email verification succeeds.",
  },
  {
    title: "Mobile OTP",
    text: "Use a six-digit SMS code for quick access without remembering a password.",
  },
  {
    title: "Social sign-in",
    text: "Google and Facebook can be switched on from environment config without rewriting the UI.",
  },
];

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, requestPhoneOtp, verifyPhoneOtp } = useAuth();
  const { status: connectionStatus, retry: retryConnectionCheck } = useApiConnectionStatus();
  const { config, error: authConfigError } = useAuthConfig();
  const [activeTab, setActiveTab] = useState("email");
  const [emailForm, setEmailForm] = useState({
    email: "",
    password: "",
  });
  const [phoneForm, setPhoneForm] = useState({
    phone: "",
    otp: "",
  });
  const [phoneChallenge, setPhoneChallenge] = useState(null);
  const [debugPayload, setDebugPayload] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const defaultDestination = location.state?.from?.pathname || "/account";
  const canUsePhoneOtp = config.delivery.smsConfigured || config.developmentDebugCodes;

  const updateEmailField = (field, value) => {
    setEmailForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const updatePhoneField = (field, value) => {
    setPhoneForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setDebugPayload(null);
    setStatus({ type: "", message: "" });

    try {
      const response = await login(emailForm);
      const destination = response.user.role === "admin" ? "/admin" : defaultDestination;
      navigate(destination, { replace: true });
    } catch (error) {
      if (error.data?.requiresEmailVerification) {
        setStatus({
          type: "error",
          message: "Email verification is still pending for this account.",
        });
        navigate(`/verify-email?email=${encodeURIComponent(error.data.email)}`, {
          replace: false,
          state: {
            message: "Enter the OTP from your inbox or open the verification link we emailed you.",
          },
        });
      } else {
        setStatus({
          type: "error",
          message: error.message || "Login failed. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendPhoneOtp = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    setDebugPayload(null);

    try {
      const response = await requestPhoneOtp({ phone: phoneForm.phone });
      setPhoneChallenge(response.verification || { phone: phoneForm.phone });
      setDebugPayload(response.debug || null);
      setStatus({
        type: "success",
        message: response.message || "A one-time code has been sent to your mobile number.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "OTP could not be sent right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyPhoneOtp = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await verifyPhoneOtp(phoneForm);
      const destination = response.user.role === "admin" ? "/admin" : defaultDestination;
      navigate(destination, { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "OTP verification failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FBF8EF] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[70vh] max-w-[1240px] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <AuthHeroPanel
          eyebrow="Authentication"
          title="Sign back in with the flow that fits your routine."
          description="Email, SMS OTP, and social login now live in the same auth system, so dog parents can get back to their account without friction and without weakening security."
          highlights={heroHighlights}
          footer="If the backend is running locally without SMTP or Twilio, development mode will surface debug OTP details in the form so the flow still stays testable."
        />

        <section className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Login
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Welcome back to the pack</h2>
          <p className="mt-3 text-sm leading-6 text-[#5F5B4F]">
            Choose password login, mobile OTP, or a connected social account.
          </p>

          <div className="mt-4 space-y-3">
            <AuthConnectionNotice
              status={connectionStatus}
              onRetry={retryConnectionCheck}
            />
            {authConfigError ? <AuthNotice type="neutral" message={authConfigError} /> : null}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-full bg-[#F7F2E7] p-1">
            {["email", "phone"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setStatus({ type: "", message: "" });
                }}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#0F4A12] text-white"
                    : "text-[#5F5B4F]"
                }`}
              >
                {tab === "email" ? "Email login" : "Mobile OTP"}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <AuthSocialButtons social={config.social} disabled={submitting} redirectTo={defaultDestination} />
          </div>

          <div className="my-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B8477]">
            <span className="h-px flex-1 bg-[#E7DECC]" />
            <span>or continue here</span>
            <span className="h-px flex-1 bg-[#E7DECC]" />
          </div>

          {activeTab === "email" ? (
            <form className="space-y-5" onSubmit={handleEmailLogin}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Email address</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={emailForm.email}
                  onChange={(event) => updateEmailField("email", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                  placeholder="name@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={emailForm.password}
                  onChange={(event) => updateEmailField("password", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                  placeholder="Enter your password"
                  required
                />
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <Link to="/forgot-password" className="font-semibold text-[#0F4A12]">
                  Forgot password?
                </Link>
                <Link
                  to={emailForm.email ? `/verify-email?email=${encodeURIComponent(emailForm.email)}` : "/verify-email"}
                  className="text-[#6A6458]"
                >
                  Verify email
                </Link>
              </div>

              <AuthNotice type={status.type || "neutral"} message={status.message} />

              <button
                type="submit"
                className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign in with email"}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <AuthNotice
                type={canUsePhoneOtp ? "info" : "neutral"}
                message={
                  canUsePhoneOtp
                    ? `OTP expires in ${config.otpExpiresInMinutes} minutes. Use the same mobile number linked to your account.`
                    : "SMS delivery is not configured yet, so mobile OTP sign-in is currently unavailable."
                }
              />

              {!phoneChallenge ? (
                <form className="space-y-5" onSubmit={handleSendPhoneOtp}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#353126]">Mobile number</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={phoneForm.phone}
                      onChange={(event) => updatePhoneField("phone", event.target.value)}
                      className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                      placeholder="+91 9876543210"
                      required
                    />
                  </label>

                  <AuthNotice type={status.type || "neutral"} message={status.message} />

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={submitting || !canUsePhoneOtp}
                  >
                    {submitting ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleVerifyPhoneOtp}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#353126]">Mobile number</span>
                    <input
                      type="tel"
                      value={phoneForm.phone}
                      onChange={(event) => updatePhoneField("phone", event.target.value)}
                      className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#353126]">
                      {config.otpLength}-digit OTP
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={config.otpLength}
                      value={phoneForm.otp}
                      onChange={(event) => updatePhoneField("otp", event.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                      placeholder="Enter OTP"
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
                      onClick={() => setPhoneChallenge(null)}
                      className="rounded-full border border-[#D9D1BF] px-6 py-3 text-sm font-semibold text-[#1A1A1A]"
                    >
                      Change number
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={submitting}
                    >
                      {submitting ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <p className="mt-6 text-sm text-[#5F5B4F]">
            Need a new account?{" "}
            <Link to="/register" className="font-semibold text-[#0F4A12]">
              Create one here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
