import { useState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

import { buildApiUrl } from "../lib/api.js";
import { LoadingButton } from "./LoadingControl.jsx";

const socialProviders = [
  {
    key: "google",
    label: "Continue with Google",
    icon: FaGoogle,
    className: "border-[#D9D1BF] bg-white text-[#1A1A1A] hover:border-[#BFB4A0]",
  },
  {
    key: "facebook",
    label: "Continue with Facebook",
    icon: FaFacebookF,
    className: "border-[#D5E0FF] bg-[#1877F2] text-white hover:bg-[#1569D8]",
  },
];

const AuthSocialButtons = ({
  social = {},
  disabled = false,
  redirectTo = "/account",
  title = "Or use a connected account",
}) => {
  const enabledProviders = socialProviders.filter((provider) => social?.[provider.key]?.enabled);
  const [pendingProvider, setPendingProvider] = useState("");

  if (enabledProviders.length === 0) {
    return null;
  }

  const handleSocialLogin = (provider) => {
    setPendingProvider(provider);
    window.location.assign(
      buildApiUrl(`/auth/social/${provider}/start?redirectTo=${encodeURIComponent(redirectTo)}`)
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7A7468]">
        {title}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {enabledProviders.map((provider) => {
          const Icon = provider.icon;

          return (
            <LoadingButton
              key={provider.key}
              type="button"
              onClick={() => handleSocialLogin(provider.key)}
              loading={pendingProvider === provider.key}
              loadingText="Redirecting..."
              disabled={disabled || Boolean(pendingProvider)}
              className={`flex items-center justify-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${provider.className}`}
            >
              <Icon size={16} />
              <span>{provider.label}</span>
            </LoadingButton>
          );
        })}
      </div>
    </div>
  );
};

export default AuthSocialButtons;
