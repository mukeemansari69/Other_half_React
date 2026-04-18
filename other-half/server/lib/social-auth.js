import "../loadEnv.js";

import { getServerBaseUrl } from "./auth-workflows.js";
import { createHttpError } from "./validation.js";

const GOOGLE_SCOPE = ["openid", "email", "profile"].join(" ");
const FACEBOOK_SCOPE = ["email", "public_profile"].join(",");

const getProviderConfig = (provider) => {
  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI?.trim() ||
      `${getServerBaseUrl()}/api/auth/social/google/callback`;

    return {
      provider,
      clientId,
      clientSecret,
      redirectUri,
      isConfigured: Boolean(clientId && clientSecret),
    };
  }

  if (provider === "facebook") {
    const clientId = process.env.FACEBOOK_APP_ID?.trim() || "";
    const clientSecret = process.env.FACEBOOK_APP_SECRET?.trim() || "";
    const redirectUri =
      process.env.FACEBOOK_REDIRECT_URI?.trim() ||
      `${getServerBaseUrl()}/api/auth/social/facebook/callback`;

    return {
      provider,
      clientId,
      clientSecret,
      redirectUri,
      isConfigured: Boolean(clientId && clientSecret),
    };
  }

  throw createHttpError("That social sign-in provider is not supported.", 400);
};

export const getSocialProviderStatus = () => {
  return {
    google: { enabled: getProviderConfig("google").isConfigured },
    facebook: { enabled: getProviderConfig("facebook").isConfigured },
  };
};

export const buildSocialAuthorizationUrl = ({ provider, state, prompt = "select_account" }) => {
  const config = getProviderConfig(provider);

  if (!config.isConfigured) {
    throw createHttpError(`The ${provider} sign-in provider is not configured yet.`, 503);
  }

  if (provider === "google") {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", config.clientId);
    url.searchParams.set("redirect_uri", config.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", GOOGLE_SCOPE);
    url.searchParams.set("state", state);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", prompt);
    return url.toString();
  }

  const url = new URL("https://www.facebook.com/v22.0/dialog/oauth");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", FACEBOOK_SCOPE);
  url.searchParams.set("response_type", "code");
  return url.toString();
};

const exchangeGoogleCode = async (code, config) => {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    throw createHttpError("Google sign-in could not be completed. Please try again.", 502);
  }

  const tokenPayload = await tokenResponse.json();
  const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`,
    },
  });

  if (!userInfoResponse.ok) {
    throw createHttpError("Google account details could not be loaded.", 502);
  }

  const profile = await userInfoResponse.json();

  return {
    id: String(profile.sub || "").trim(),
    email: String(profile.email || "").trim().toLowerCase(),
    name: String(profile.name || "").trim(),
    avatarUrl: String(profile.picture || "").trim(),
    emailVerified: Boolean(profile.email_verified),
  };
};

const exchangeFacebookCode = async (code, config) => {
  const tokenUrl = new URL("https://graph.facebook.com/v22.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", config.clientId);
  tokenUrl.searchParams.set("client_secret", config.clientSecret);
  tokenUrl.searchParams.set("redirect_uri", config.redirectUri);
  tokenUrl.searchParams.set("code", code);

  const tokenResponse = await fetch(tokenUrl);

  if (!tokenResponse.ok) {
    throw createHttpError("Facebook sign-in could not be completed. Please try again.", 502);
  }

  const tokenPayload = await tokenResponse.json();
  const profileUrl = new URL("https://graph.facebook.com/me");
  profileUrl.searchParams.set("fields", "id,name,email,picture");
  profileUrl.searchParams.set("access_token", tokenPayload.access_token);

  const profileResponse = await fetch(profileUrl);

  if (!profileResponse.ok) {
    throw createHttpError("Facebook account details could not be loaded.", 502);
  }

  const profile = await profileResponse.json();

  return {
    id: String(profile.id || "").trim(),
    email: String(profile.email || "").trim().toLowerCase(),
    name: String(profile.name || "").trim(),
    avatarUrl: String(profile.picture?.data?.url || "").trim(),
    emailVerified: Boolean(profile.email),
  };
};

export const exchangeSocialCodeForProfile = async ({ provider, code }) => {
  const config = getProviderConfig(provider);

  if (!config.isConfigured) {
    throw createHttpError(`The ${provider} sign-in provider is not configured yet.`, 503);
  }

  if (provider === "google") {
    return exchangeGoogleCode(code, config);
  }

  return exchangeFacebookCode(code, config);
};
