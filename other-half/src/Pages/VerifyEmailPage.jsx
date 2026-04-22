import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthHeroPanel from "../Components/AuthHeroPanel.jsx";
import { LoadingButton } from "../Components/LoadingControl.jsx";
import AuthNotice from "../Components/AuthNotice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthConfig } from "../hooks/useAuthConfig.js";

const heroHighlights = [
  {
    title: "OTP or link",
    text: "Every email signup now sends both a one-time code and a verification link.",
  },
  {
    title: "Activation gate",
    text: "Password login stays blocked until email ownership is confirmed successfully.",
  },
  {
    title: "Safe retries",
    text: "Resend actions invalidate older codes and issue a fresh verification attempt.",
  },
];

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmailOtp, resendEmailVerification } = useAuth();
  const { config } = useAuthConfig();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialEmail = searchParams.get("email") || location.state?.email || "";
  const urlStatus = searchParams.get("status") || "";
  const urlMessage = searchParams.get("message") || "";
  const [formState, setFormState] = useState({
    email: initialEmail,
    otp: "",
  });
  const [status, setStatus] = useState({
    type:
      urlStatus === "success"
        ? "success"
        : urlStatus === "error"
          ? "error"
          : location.state?.message
            ? "info"
            : "",
    message:
      urlStatus === "success"
        ? "Email verified successfully. You can sign in now."
        : urlStatus === "error"
          ? urlMessage
          : location.state?.message || "",
  });
  const [debugPayload, setDebugPayload] = useState(location.state?.debug || null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await verifyEmailOtp(formState);
      navigate("/account", { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Email could not be verified.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!formState.email) {
      setStatus({
        type: "error",
        message: "Enter the email address that you used during signup first.",
      });
      return;
    }

    setResending(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await resendEmailVerification({ email: formState.email });
      setDebugPayload(response.debug || null);
      setStatus({
        type: "success",
        message: response.message || "A fresh verification code has been sent.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "A new verification email could not be sent.",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="bg-[#FBF8EF] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[70vh] max-w-[1240px] gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <AuthHeroPanel
          eyebrow="Verify email"
          title="Confirm inbox ownership before password sign-in goes live."
          description="Use the OTP from your inbox or the verification link we sent. Once this step succeeds, the account becomes active for password-based login."
          highlights={heroHighlights}
          footer={`Email OTPs expire in ${config.otpExpiresInMinutes} minutes, and every resend invalidates older codes.`}
        />

        <section className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Verification
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">
            Activate your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5F5B4F]">
            Enter the email you registered with and the OTP we sent to that inbox.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleVerify}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#353126]">Email address</span>
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

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#353126]">
                {config.otpLength}-digit OTP
              </span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={config.otpLength}
                value={formState.otp}
                onChange={(event) =>
                  handleFieldChange("otp", event.target.value.replace(/\D/g, ""))
                }
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
              {debugPayload?.verificationUrl ? (
                <a
                  href={debugPayload.verificationUrl}
                  className="mt-2 block text-xs font-semibold text-[#24508B]"
                >
                  Open dev verification link
                </a>
              ) : null}
            </AuthNotice>

            <div className="grid gap-3 sm:grid-cols-2">
              <LoadingButton
                type="button"
                onClick={handleResend}
                className="rounded-full border border-[#D9D1BF] px-6 py-3 text-sm font-semibold text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60"
                loading={resending}
                loadingText="Sending..."
                disabled={resending}
              >
                Resend code
              </LoadingButton>
              <LoadingButton
                type="submit"
                className="rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
                loading={submitting}
                loadingText="Verifying..."
                disabled={submitting}
              >
                Verify email
              </LoadingButton>
            </div>
          </form>

          <div className="mt-8 rounded-[28px] bg-[#FBF8EF] p-5 text-sm leading-6 text-[#5F5B4F]">
            <p className="font-semibold text-[#1A1A1A]">Need a different route?</p>
            <p className="mt-2">
              You can go back to <Link to="/register" className="font-semibold text-[#0F4A12]">signup</Link>,
              return to <Link to="/login" className="font-semibold text-[#0F4A12]">login</Link>,
              or use <Link to="/forgot-password" className="font-semibold text-[#0F4A12]">forgot password</Link> if you already own the inbox.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
