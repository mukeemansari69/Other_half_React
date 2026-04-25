import "../loadEnv.js";
import jwt from "jsonwebtoken";
import { createHash, randomBytes, randomInt, randomUUID, timingSafeEqual } from "node:crypto";

const DEFAULT_ACTION_TOKEN_SECRET = "other-half-dev-secret";
const ACTION_TOKEN_SECRET =
  process.env.AUTH_FLOW_SECRET || process.env.JWT_SECRET || DEFAULT_ACTION_TOKEN_SECRET;
const AUTH_CLIENT_URL_FALLBACK =
  process.env.AUTH_CLIENT_URL?.trim() ||
  process.env.PUBLIC_SITE_URL?.trim() ||
  process.env.VITE_SITE_URL?.trim() ||
  String(process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)[0] ||
  "http://localhost:5173";
const AUTH_SERVER_URL_FALLBACK = (() => {
  const configuredServerUrl =
    process.env.SERVER_PUBLIC_URL?.trim() || process.env.RENDER_EXTERNAL_URL?.trim();

  if (configuredServerUrl) {
    return configuredServerUrl.replace(/\/$/, "");
  }

  const configuredApiBase = String(
    process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || ""
  ).trim();

  if (configuredApiBase) {
    return configuredApiBase.replace(/\/api\/?$/, "");
  }

  const port = Number(process.env.PORT) || 4000;
  return `http://localhost:${port}`;
})();

export const AUTH_OTP_LENGTH = 6;
export const AUTH_OTP_EXPIRY_MINUTES = 5;
export const EMAIL_VERIFICATION_LINK_EXPIRY = "24h";
export const SOCIAL_STATE_EXPIRY = "10m";
const AUTH_EXCHANGE_EXPIRY_MS = 1000 * 60 * 10;
const AUTH_RECORD_RETENTION_MS = 1000 * 60 * 60 * 24 * 2;

const createHashDigest = (value = "") =>
  createHash("sha256").update(String(value)).digest("hex");

const matchesHash = (value, hash) => {
  if (!value || !hash) {
    return false;
  }

  const valueBuffer = Buffer.from(createHashDigest(value), "hex");
  const hashBuffer = Buffer.from(hash, "hex");

  if (valueBuffer.length !== hashBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, hashBuffer);
};

const getTimeValue = (value) => {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const isExpired = (value) => {
  const timestamp = getTimeValue(value);
  return timestamp === null || timestamp <= Date.now();
};

export const getClientAppUrl = () => AUTH_CLIENT_URL_FALLBACK.replace(/\/$/, "");

export const getServerBaseUrl = () => AUTH_SERVER_URL_FALLBACK.replace(/\/$/, "");

export const sanitizeRedirectPath = (value, fallback = "/account") => {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue.startsWith("/") || normalizedValue.startsWith("//")) {
    return fallback;
  }

  return normalizedValue;
};

export const maskEmailAddress = (email = "") => {
  const [localPart = "", domain = ""] = String(email).split("@");

  if (!localPart || !domain) {
    return email;
  }

  const visiblePrefix = localPart.slice(0, 2);
  return `${visiblePrefix}${"*".repeat(Math.max(localPart.length - 2, 1))}@${domain}`;
};

export const maskPhoneNumber = (phone = "") => {
  const digits = String(phone).replace(/\D/g, "");

  if (digits.length <= 4) {
    return phone;
  }

  return `${"*".repeat(Math.max(digits.length - 4, 1))}${digits.slice(-4)}`;
};

export const pruneAuthArtifacts = (database) => {
  let didChange = false;
  const now = Date.now();

  database.authChallenges = (database.authChallenges || []).filter((challenge) => {
    const terminalTimestamp =
      getTimeValue(challenge.consumedAt) ||
      getTimeValue(challenge.invalidatedAt) ||
      getTimeValue(challenge.expiresAt);

    if (terminalTimestamp !== null && terminalTimestamp + AUTH_RECORD_RETENTION_MS < now) {
      didChange = true;
      return false;
    }

    return true;
  });

  database.authExchanges = (database.authExchanges || []).filter((exchange) => {
    const terminalTimestamp =
      getTimeValue(exchange.consumedAt) || getTimeValue(exchange.expiresAt);

    if (terminalTimestamp !== null && terminalTimestamp + AUTH_RECORD_RETENTION_MS < now) {
      didChange = true;
      return false;
    }

    return true;
  });

  return didChange;
};

export const syncUserAuthMetadata = (user) => {
  if (!user || typeof user !== "object") {
    return user;
  }

  user.authProviders = {
    password: Boolean(user.passwordHash),
    phoneOtp:
      Boolean(user.phoneVerified) ||
      Boolean(user.authProviders?.phoneOtp),
    google:
      Boolean(user.socialAccounts?.google?.id) ||
      Boolean(user.authProviders?.google),
    facebook:
      Boolean(user.socialAccounts?.facebook?.id) ||
      Boolean(user.authProviders?.facebook),
  };

  const hasVerifiedIdentity =
    Boolean(user.emailVerified) ||
    Boolean(user.phoneVerified) ||
    Boolean(user.authProviders.google) ||
    Boolean(user.authProviders.facebook) ||
    user.role === "admin";

  if (hasVerifiedIdentity) {
    user.isVerified = true;
    user.accountStatus = "active";
  } else if (!user.accountStatus) {
    user.isVerified = false;
    user.accountStatus = user.email
      ? "pending_email_verification"
      : user.phone
        ? "pending_phone_verification"
        : "pending";
  }

  user.authUpdatedAt = new Date().toISOString();
  return user;
};

export const createOtpChallenge = (
  database,
  { purpose, channel, target, userId, metadata = {}, expiresInMinutes = AUTH_OTP_EXPIRY_MINUTES }
) => {
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();
  const otp = String(randomInt(0, 10 ** AUTH_OTP_LENGTH)).padStart(AUTH_OTP_LENGTH, "0");

  database.authChallenges = (database.authChallenges || []).map((challenge) => {
    if (
      !challenge.consumedAt &&
      !challenge.invalidatedAt &&
      challenge.purpose === purpose &&
      challenge.channel === channel &&
      challenge.target === target
    ) {
      return {
        ...challenge,
        invalidatedAt: createdAt,
      };
    }

    return challenge;
  });

  database.authChallenges.unshift({
    id: randomUUID(),
    purpose,
    channel,
    target,
    userId,
    codeHash: createHashDigest(otp),
    attemptCount: 0,
    maxAttempts: 5,
    metadata,
    createdAt,
    expiresAt,
    consumedAt: null,
    invalidatedAt: null,
  });

  return {
    otp,
    expiresAt,
    expiresInMinutes,
  };
};

export const consumeOtpChallenge = (
  database,
  { purpose, channel, target, otp, userId = null }
) => {
  const matchingChallenge = (database.authChallenges || [])
    .filter((challenge) => {
      return (
        challenge.purpose === purpose &&
        challenge.channel === channel &&
        challenge.target === target &&
        (!userId || challenge.userId === userId) &&
        !challenge.consumedAt &&
        !challenge.invalidatedAt
      );
    })
    .sort((firstChallenge, secondChallenge) => {
      return (
        (getTimeValue(secondChallenge.createdAt) || 0) -
        (getTimeValue(firstChallenge.createdAt) || 0)
      );
    })[0];

  if (!matchingChallenge || isExpired(matchingChallenge.expiresAt)) {
    throw Object.assign(new Error("The OTP is invalid or has expired."), {
      statusCode: 400,
    });
  }

  matchingChallenge.attemptCount = Number(matchingChallenge.attemptCount || 0) + 1;

  if (!matchesHash(otp, matchingChallenge.codeHash)) {
    if (matchingChallenge.attemptCount >= Number(matchingChallenge.maxAttempts || 5)) {
      matchingChallenge.invalidatedAt = new Date().toISOString();
    }

    throw Object.assign(new Error("The OTP is invalid or has expired."), {
      statusCode: 400,
    });
  }

  matchingChallenge.consumedAt = new Date().toISOString();
  return matchingChallenge;
};

export const createSignedActionToken = (payload, expiresIn = EMAIL_VERIFICATION_LINK_EXPIRY) => {
  return jwt.sign(
    {
      ...payload,
      nonce: randomBytes(16).toString("hex"),
    },
    ACTION_TOKEN_SECRET,
    { expiresIn }
  );
};

export const verifySignedActionToken = (token) => {
  return jwt.verify(token, ACTION_TOKEN_SECRET);
};

export const createAuthExchangeCode = (database, { userId, provider, redirectTo = "/account" }) => {
  const code = randomBytes(32).toString("hex");

  database.authExchanges = database.authExchanges || [];
  database.authExchanges.unshift({
    id: randomUUID(),
    codeHash: createHashDigest(code),
    userId,
    provider,
    redirectTo: sanitizeRedirectPath(redirectTo),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + AUTH_EXCHANGE_EXPIRY_MS).toISOString(),
    consumedAt: null,
  });

  return code;
};

export const consumeAuthExchangeCode = (database, code) => {
  const exchange = (database.authExchanges || []).find((candidate) => {
    return !candidate.consumedAt && !isExpired(candidate.expiresAt) && matchesHash(code, candidate.codeHash);
  });

  if (!exchange) {
    throw Object.assign(new Error("That sign-in session is no longer available. Please try again."), {
      statusCode: 400,
    });
  }

  exchange.consumedAt = new Date().toISOString();
  return exchange;
};
