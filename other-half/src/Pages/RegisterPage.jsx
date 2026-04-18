import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthConnectionNotice from "../Components/AuthConnectionNotice.jsx";
import AuthHeroPanel from "../Components/AuthHeroPanel.jsx";
import AuthNotice from "../Components/AuthNotice.jsx";
import AuthSocialButtons from "../Components/AuthSocialButtons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useApiConnectionStatus } from "../hooks/useApiConnectionStatus.js";
import { useAuthConfig } from "../hooks/useAuthConfig.js";

const heroHighlights = [
  {
    title: "Verified access",
    text: "Email accounts stay pending until the inbox OTP or verification link is completed.",
  },
  {
    title: "Phone-first signup",
    text: "A mobile number can create and activate an account through OTP verification alone.",
  },
  {
    title: "One account per identity",
    text: "Duplicate email and phone entries are blocked before account creation finishes.",
  },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    registerWithPhone,
    verifyPhoneOtp,
  } = useAuth();
  const { status: connectionStatus, retry: retryConnectionCheck } = useApiConnectionStatus();
  const { config, error: authConfigError } = useAuthConfig();
  const [activeTab, setActiveTab] = useState("email");
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    phone: "",
    dogName: "",
    password: "",
  });
  const [phoneForm, setPhoneForm] = useState({
    name: "",
    phone: "",
    email: "",
    dogName: "",
    otp: "",
  });
  const [phoneChallenge, setPhoneChallenge] = useState(null);
  const [debugPayload, setDebugPayload] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

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

  const handleEmailSignup = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    setDebugPayload(null);

    try {
      const response = await register(emailForm);
      navigate(`/verify-email?email=${encodeURIComponent(emailForm.email)}`, {
        state: {
          message: response.message,
          debug: response.debug || null,
        },
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Account could not be created.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneSignup = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    setDebugPayload(null);

    try {
      const response = await registerWithPhone(phoneForm);
      setPhoneChallenge(response.verification || { phone: phoneForm.phone });
      setDebugPayload(response.debug || null);
      setStatus({
        type: "success",
        message: response.message || "OTP sent successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Phone signup could not be started.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyPhoneSignup = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await verifyPhoneOtp({
        phone: phoneForm.phone,
        otp: phoneForm.otp,
      });
      navigate("/account", { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "OTP verification failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FBF8EF] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[70vh] max-w-[1240px] gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <AuthHeroPanel
          eyebrow="Account setup"
          title="Create a verified account that can grow with every auth method."
          description="This signup flow now supports verified email activation, phone OTP onboarding, and optional social login buttons so the experience can scale from simple D2C access to production auth."
          highlights={heroHighlights}
          footer="Email/password accounts stay inactive until verification succeeds. Phone signup activates as soon as the OTP is confirmed."
        />

        <section className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Signup
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[#1A1A1A] md:text-4xl">
            Set up your dog's account home base
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#5F5B4F]">
            Pick the signup path you want today. You can always add more ways to sign in later.
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
                {tab === "email" ? "Email signup" : "Phone signup"}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <AuthSocialButtons social={config.social} disabled={submitting} redirectTo="/account" title="Or create the account with a provider" />
          </div>

          <div className="my-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B8477]">
            <span className="h-px flex-1 bg-[#E7DECC]" />
            <span>or complete the form</span>
            <span className="h-px flex-1 bg-[#E7DECC]" />
          </div>

          {activeTab === "email" ? (
            <form className="space-y-5" onSubmit={handleEmailSignup}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Full name</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={emailForm.name}
                  onChange={(event) => updateEmailField("name", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                  placeholder="Your full name"
                  required
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
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
                  <span className="mb-2 block text-sm font-medium text-[#353126]">Phone number</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={emailForm.phone}
                    onChange={(event) => updateEmailField("phone", event.target.value)}
                    className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                    placeholder="Optional"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Dog name</span>
                <input
                  type="text"
                  value={emailForm.dogName}
                  onChange={(event) => updateEmailField("dogName", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                  placeholder="Your dog's name"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={emailForm.password}
                  onChange={(event) => updateEmailField("password", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                  placeholder={`At least ${config.passwordMinLength} characters`}
                  minLength={config.passwordMinLength}
                  required
                />
              </label>

              <AuthNotice type={status.type || "neutral"} message={status.message} />

              <button
                type="submit"
                className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={submitting}
              >
                {submitting ? "Creating account..." : "Create account with email"}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <AuthNotice
                type={canUsePhoneOtp ? "info" : "neutral"}
                message={
                  canUsePhoneOtp
                    ? `Phone signup activates the account after OTP confirmation. The OTP expires in ${config.otpExpiresInMinutes} minutes.`
                    : "SMS delivery is not configured yet, so phone signup is currently unavailable."
                }
              />

              {!phoneChallenge ? (
                <form className="space-y-5" onSubmit={handlePhoneSignup}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#353126]">Full name</span>
                    <input
                      type="text"
                      autoComplete="name"
                      value={phoneForm.name}
                      onChange={(event) => updatePhoneField("name", event.target.value)}
                      className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                      placeholder="Your full name"
                      required
                    />
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
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

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#353126]">Email address</span>
                      <input
                        type="email"
                        autoComplete="email"
                        value={phoneForm.email}
                        onChange={(event) => updatePhoneField("email", event.target.value)}
                        className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                        placeholder="Optional"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#353126]">Dog name</span>
                    <input
                      type="text"
                      value={phoneForm.dogName}
                      onChange={(event) => updatePhoneField("dogName", event.target.value)}
                      className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                      placeholder="Your dog's name"
                      required
                    />
                  </label>

                  <AuthNotice type={status.type || "neutral"} message={status.message} />

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={submitting || !canUsePhoneOtp}
                  >
                    {submitting ? "Sending OTP..." : "Send OTP to create account"}
                  </button>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleVerifyPhoneSignup}>
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
                      Edit signup
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={submitting}
                    >
                      {submitting ? "Verifying..." : "Verify OTP & continue"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <p className="mt-6 text-sm text-[#5F5B4F]">
            Already part of the pack?{" "}
            <Link to="/login" className="font-semibold text-[#0F4A12]">
              Sign in here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
