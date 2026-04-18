import "../loadEnv.js";
import bcrypt from "bcryptjs";
import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { randomUUID } from "node:crypto";

import { requireAuth, signAuthToken } from "../lib/auth.js";
import {
  AUTH_OTP_EXPIRY_MINUTES,
  SOCIAL_STATE_EXPIRY,
  createAuthExchangeCode,
  createOtpChallenge,
  createSignedActionToken,
  consumeAuthExchangeCode,
  consumeOtpChallenge,
  getClientAppUrl,
  getServerBaseUrl,
  maskEmailAddress,
  maskPhoneNumber,
  pruneAuthArtifacts,
  sanitizeRedirectPath,
  syncUserAuthMetadata,
  verifySignedActionToken,
} from "../lib/auth-workflows.js";
import { readDatabase, sanitizeUser, writeDatabase } from "../lib/database.js";
import {
  getMailConfig,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from "../lib/mailer.js";
import {
  buildSocialAuthorizationUrl,
  exchangeSocialCodeForProfile,
  getSocialProviderStatus,
} from "../lib/social-auth.js";
import { getSmsConfig, sendOtpSms } from "../lib/sms.js";
import { createInactiveSubscription } from "../lib/subscriptions.js";
import {
  PASSWORD_MIN_LENGTH,
  createHttpError,
  normalizeEmail,
  normalizePhoneInput,
  sanitizeEmailInput,
  sanitizePhoneInput,
  sanitizeTextInput,
  validatePassword,
} from "../lib/validation.js";

const isProduction = process.env.NODE_ENV === "production";

const asyncHandler = (handler) => {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
};

const createIdentityKey = (req) => {
  const email = normalizeEmail(req.body?.email || "");
  const phone = (() => {
    try {
      return normalizePhoneInput(req.body?.phone || "");
    } catch {
      return String(req.body?.phone || "").trim();
    }
  })();

  return `${ipKeyGenerator(req.ip || "")}:${email || phone || "anonymous-auth"}`;
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createIdentityKey,
  message: {
    message: "Too many sign-in attempts were made. Please wait a few minutes and try again.",
  },
});

const otpSendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createIdentityKey,
  message: {
    message: "Too many OTP requests were made. Please wait a few minutes and try again.",
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: createIdentityKey,
  message: {
    message: "Too many OTP verification attempts were made. Please request a new code and try again.",
  },
});

const socialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip || "")}:social:${req.params.provider || "unknown"}`,
  message: {
    message: "Too many social sign-in attempts were made. Please try again shortly.",
  },
});

const buildClientRedirectUrl = (path, params = {}) => {
  const url = new URL(path, `${getClientAppUrl()}/`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const buildDebugPayload = (payload = {}) => {
  if (isProduction) {
    return undefined;
  }

  const debugPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return Object.keys(debugPayload).length > 0 ? debugPayload : undefined;
};

const findUserByEmail = (database, email) =>
  database.users.find((candidate) => candidate.email === email);

const findUserByPhone = (database, phone) =>
  database.users.find((candidate) => candidate.phone === phone);

const findUserBySocialAccount = (database, provider, providerId) =>
  database.users.find((candidate) => candidate.socialAccounts?.[provider]?.id === providerId);

const ensurePasswordMeetsPolicy = (password = "") => {
  if (!validatePassword(password)) {
    throw createHttpError(
      `Password should be at least ${PASSWORD_MIN_LENGTH} characters long.`,
      400
    );
  }
};

const createAuthSuccessResponse = (user, message, redirectTo = null) => {
  return {
    token: signAuthToken(user),
    user: sanitizeUser(user),
    message,
    redirectTo,
  };
};

const markUserAsLoggedIn = (user, method) => {
  user.lastLoginAt = new Date().toISOString();
  user.lastLoginMethod = method;
  syncUserAuthMetadata(user);
  return user;
};

const ensureEmailDeliveryReady = () => {
  const mailConfig = getMailConfig();

  if (isProduction && !mailConfig.isConfigured) {
    throw createHttpError(
      "Email delivery is not configured yet. Add SMTP credentials before enabling this flow in production.",
      503
    );
  }

  return mailConfig;
};

const ensureSmsDeliveryReady = () => {
  const smsConfig = getSmsConfig();

  if (isProduction && !smsConfig.isConfigured) {
    throw createHttpError(
      "SMS delivery is not configured yet. Add Twilio credentials before enabling this flow in production.",
      503
    );
  }

  return smsConfig;
};

const sendEmailVerificationChallenge = async (database, user) => {
  const { otp, expiresInMinutes } = createOtpChallenge(database, {
    purpose: "email-verification",
    channel: "email",
    target: user.email,
    userId: user.id,
  });
  const verificationToken = createSignedActionToken(
    {
      purpose: "email-verification",
      userId: user.id,
      email: user.email,
    }
  );
  const verificationUrl = `${getServerBaseUrl()}/api/auth/verify/email/link?token=${encodeURIComponent(
    verificationToken
  )}`;

  await writeDatabase(database);

  let delivery;

  try {
    delivery = await sendEmailVerificationEmail({
      email: user.email,
      userName: user.name,
      otp,
      verificationUrl,
      expiresInMinutes,
    });
  } catch (error) {
    throw createHttpError(
      error.message || "Verification email could not be sent. Please try again.",
      502
    );
  }

  return {
    delivery,
    debug: buildDebugPayload({
      otp,
      verificationUrl,
    }),
  };
};

const sendPhoneOtpChallenge = async (database, user, purpose = "phone-auth") => {
  const { otp, expiresInMinutes } = createOtpChallenge(database, {
    purpose,
    channel: "sms",
    target: user.phone,
    userId: user.id,
  });

  await writeDatabase(database);

  let delivery;

  try {
    delivery = await sendOtpSms({
      phone: user.phone,
      code: otp,
      purpose,
      expiresInMinutes,
    });
  } catch (error) {
    throw createHttpError(
      error.message || "OTP SMS could not be sent. Please try again.",
      502
    );
  }

  return {
    delivery,
    debug: buildDebugPayload({ otp }),
  };
};

const sendPasswordResetChallenge = async (database, user, method) => {
  if (method === "email") {
    const { otp, expiresInMinutes } = createOtpChallenge(database, {
      purpose: "password-reset",
      channel: "email",
      target: user.email,
      userId: user.id,
    });
    const resetUrl = buildClientRedirectUrl("/forgot-password", {
      method: "email",
      email: user.email,
    });

    await writeDatabase(database);

    let delivery;

    try {
      delivery = await sendPasswordResetEmail({
        email: user.email,
        userName: user.name,
        otp,
        resetUrl,
        expiresInMinutes,
      });
    } catch (error) {
      throw createHttpError(
        error.message || "Password reset email could not be sent. Please try again.",
        502
      );
    }

    return {
      delivery,
      debug: buildDebugPayload({
        otp,
        resetUrl,
      }),
    };
  }

  const { otp, expiresInMinutes } = createOtpChallenge(database, {
    purpose: "password-reset",
    channel: "sms",
    target: user.phone,
    userId: user.id,
  });

  await writeDatabase(database);

  let delivery;

  try {
    delivery = await sendOtpSms({
      phone: user.phone,
      code: otp,
      purpose: "password-reset",
      expiresInMinutes,
    });
  } catch (error) {
    throw createHttpError(
      error.message || "Password reset SMS could not be sent. Please try again.",
      502
    );
  }

  return {
    delivery,
    debug: buildDebugPayload({ otp }),
  };
};

const createRouter = () => {
  const router = express.Router();

  router.get(
    "/config",
    asyncHandler(async (_req, res) => {
      const mailConfig = getMailConfig();
      const smsConfig = getSmsConfig();

      return res.json({
        passwordMinLength: PASSWORD_MIN_LENGTH,
        otpLength: 6,
        otpExpiresInMinutes: AUTH_OTP_EXPIRY_MINUTES,
        verification: {
          emailRequiredForPasswordLogin: true,
        },
        delivery: {
          emailConfigured: mailConfig.isConfigured,
          smsConfigured: smsConfig.isConfigured,
          smsProvider: smsConfig.provider,
        },
        social: getSocialProviderStatus(),
        developmentDebugCodes: !isProduction,
      });
    })
  );

  router.post(
    "/register",
    loginLimiter,
    asyncHandler(async (req, res) => {
      ensureEmailDeliveryReady();

      const name = sanitizeTextInput(req.body.name, {
        fieldLabel: "Full name",
        required: true,
        minimumLength: 2,
        maximumLength: 120,
      });
      const email = sanitizeEmailInput(req.body.email);
      const phone = sanitizePhoneInput(req.body.phone);
      const dogName = sanitizeTextInput(req.body.dogName || "Your dog", {
        fieldLabel: "Dog name",
        minimumLength: 2,
        maximumLength: 80,
      });
      const password = req.body.password || "";

      ensurePasswordMeetsPolicy(password);

      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const existingByEmail = findUserByEmail(database, email);
      const existingByPhone = phone ? findUserByPhone(database, phone) : null;
      const existingActiveAccount = Boolean(existingByEmail?.accountStatus === "active");

      if (existingByPhone && existingByPhone.id !== existingByEmail?.id) {
        throw createHttpError("An account with this mobile number already exists.", 409);
      }

      if (
        existingByEmail &&
        existingByEmail.accountStatus === "active" &&
        existingByEmail.emailVerified
      ) {
        throw createHttpError("An account with this email already exists.", 409);
      }

      const createdAt = new Date().toISOString();
      const user =
        existingByEmail ||
        {
          id: randomUUID(),
          role: "user",
          subscription: createInactiveSubscription(dogName),
          createdAt,
        };

      user.name = name;
      user.email = email;
      user.phone = phone;
      user.passwordHash = await bcrypt.hash(password, 10);
      user.passwordUpdatedAt = createdAt;
      user.emailVerified = Boolean(existingByEmail?.emailVerified);
      user.phoneVerified = Boolean(existingByEmail?.phoneVerified);
      user.isVerified = Boolean(existingByEmail?.isVerified);
      user.accountStatus = existingActiveAccount ? "active" : "pending_email_verification";
      user.lastLoginAt = null;
      user.lastLoginMethod = null;
      user.subscription = user.subscription || createInactiveSubscription(dogName);
      user.subscription.dogProfile = user.subscription.dogProfile || {};
      user.subscription.dogProfile.name = dogName;
      syncUserAuthMetadata(user);

      if (!user.emailVerified && !existingActiveAccount) {
        user.isVerified = false;
        user.accountStatus = "pending_email_verification";
      }

      if (!existingByEmail) {
        database.users.unshift(user);
      }

      const verification = await sendEmailVerificationChallenge(database, user);

      return res.status(existingByEmail ? 202 : 201).json({
        message: existingActiveAccount
          ? `Password saved. Verify ${maskEmailAddress(email)} before using email and password sign-in.`
          : `We sent a verification code to ${maskEmailAddress(email)}. Verify it to activate your account.`,
        requiresVerification: true,
        verification: {
          channel: "email",
          email,
          expiresInMinutes: AUTH_OTP_EXPIRY_MINUTES,
        },
        debug: verification.debug,
      });
    })
  );

  router.post(
    "/register/phone",
    otpSendLimiter,
    asyncHandler(async (req, res) => {
      ensureSmsDeliveryReady();

      const name = sanitizeTextInput(req.body.name, {
        fieldLabel: "Full name",
        required: true,
        minimumLength: 2,
        maximumLength: 120,
      });
      const phone = sanitizePhoneInput(req.body.phone);
      const email = req.body.email ? sanitizeEmailInput(req.body.email) : "";
      const dogName = sanitizeTextInput(req.body.dogName || "Your dog", {
        fieldLabel: "Dog name",
        minimumLength: 2,
        maximumLength: 80,
      });
      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const existingByPhone = findUserByPhone(database, phone);
      const existingByEmail = email ? findUserByEmail(database, email) : null;

      if (existingByEmail && existingByPhone && existingByEmail.id !== existingByPhone.id) {
        throw createHttpError(
          "That email already belongs to another account. Use a different email or leave it blank for phone signup.",
          409
        );
      }

      if (
        existingByPhone &&
        existingByPhone.accountStatus === "active" &&
        existingByPhone.phoneVerified
      ) {
        throw createHttpError("An account with this mobile number already exists.", 409);
      }

      if (
        existingByEmail &&
        existingByEmail.accountStatus === "active" &&
        existingByEmail.emailVerified &&
        existingByEmail.id !== existingByPhone?.id
      ) {
        throw createHttpError("That email already belongs to another account.", 409);
      }

      const createdAt = new Date().toISOString();
      const user =
        existingByPhone ||
        existingByEmail ||
        {
          id: randomUUID(),
          role: "user",
          subscription: createInactiveSubscription(dogName),
          createdAt,
        };

      user.name = name;
      user.phone = phone;
      user.email = email;
      user.emailVerified = Boolean(user.emailVerified);
      user.phoneVerified = false;
      user.isVerified = false;
      user.accountStatus = "pending_phone_verification";
      user.lastLoginAt = null;
      user.lastLoginMethod = null;
      user.subscription = user.subscription || createInactiveSubscription(dogName);
      user.subscription.dogProfile = user.subscription.dogProfile || {};
      user.subscription.dogProfile.name = dogName;
      syncUserAuthMetadata(user);
      user.isVerified = false;
      user.accountStatus = "pending_phone_verification";

      if (!existingByPhone && !existingByEmail) {
        database.users.unshift(user);
      }

      const verification = await sendPhoneOtpChallenge(database, user);

      return res.status(existingByPhone || existingByEmail ? 202 : 201).json({
        message: `We sent a one-time code to ${maskPhoneNumber(phone)}.`,
        requiresVerification: true,
        verification: {
          channel: "phone",
          phone,
          expiresInMinutes: AUTH_OTP_EXPIRY_MINUTES,
        },
        debug: verification.debug,
      });
    })
  );

  router.post(
    "/login",
    loginLimiter,
    asyncHandler(async (req, res) => {
      const email = sanitizeEmailInput(req.body.email);
      const password = sanitizeTextInput(req.body.password, {
        fieldLabel: "Password",
        required: true,
        minimumLength: 1,
        maximumLength: 200,
      });
      const database = await readDatabase();
      const user = findUserByEmail(database, email);

      if (!user || !user.passwordHash) {
        throw createHttpError("Email or password is incorrect.", 401);
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        throw createHttpError("Email or password is incorrect.", 401);
      }

      if (!user.emailVerified) {
        return res.status(403).json({
          message: "Verify your email before signing in with a password.",
          requiresEmailVerification: true,
          email: user.email,
        });
      }

      markUserAsLoggedIn(user, "password");
      await writeDatabase(database);

      return res.json(createAuthSuccessResponse(user, "Welcome back."));
    })
  );

  router.post(
    "/phone/send-otp",
    otpSendLimiter,
    asyncHandler(async (req, res) => {
      ensureSmsDeliveryReady();

      const phone = sanitizePhoneInput(req.body.phone);
      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const user = findUserByPhone(database, phone);

      if (!user) {
        throw createHttpError("No account was found for this mobile number.", 404);
      }

      const verification = await sendPhoneOtpChallenge(database, user);

      return res.json({
        message: `We sent a one-time code to ${maskPhoneNumber(phone)}.`,
        verification: {
          channel: "phone",
          phone,
          expiresInMinutes: AUTH_OTP_EXPIRY_MINUTES,
        },
        debug: verification.debug,
      });
    })
  );

  router.post(
    "/phone/verify-otp",
    otpVerifyLimiter,
    asyncHandler(async (req, res) => {
      const phone = sanitizePhoneInput(req.body.phone);
      const otp = sanitizeTextInput(req.body.otp, {
        fieldLabel: "OTP",
        required: true,
        minimumLength: 6,
        maximumLength: 6,
      });
      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const challenge = consumeOtpChallenge(database, {
        purpose: "phone-auth",
        channel: "sms",
        target: phone,
        otp,
      });
      const user =
        database.users.find((candidate) => candidate.id === challenge.userId) ||
        findUserByPhone(database, phone);

      if (!user) {
        throw createHttpError("Account could not be found for this OTP request.", 404);
      }

      user.phone = phone;
      user.phoneVerified = true;
      if (!user.accountStatus || user.accountStatus !== "active") {
        user.isVerified = true;
        user.accountStatus = "active";
      }
      markUserAsLoggedIn(user, "phone-otp");
      await writeDatabase(database);

      return res.json(
        createAuthSuccessResponse(user, "Mobile number verified. You are signed in.")
      );
    })
  );

  router.post(
    "/verify/email",
    otpVerifyLimiter,
    asyncHandler(async (req, res) => {
      const email = sanitizeEmailInput(req.body.email);
      const otp = sanitizeTextInput(req.body.otp, {
        fieldLabel: "OTP",
        required: true,
        minimumLength: 6,
        maximumLength: 6,
      });
      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const challenge = consumeOtpChallenge(database, {
        purpose: "email-verification",
        channel: "email",
        target: email,
        otp,
      });
      const user =
        database.users.find((candidate) => candidate.id === challenge.userId) ||
        findUserByEmail(database, email);

      if (!user) {
        throw createHttpError("Account could not be found for this verification request.", 404);
      }

      user.emailVerified = true;
      user.isVerified = true;
      user.accountStatus = "active";
      markUserAsLoggedIn(user, "email-verification");
      await writeDatabase(database);

      return res.json(
        createAuthSuccessResponse(user, "Email verified. Your account is ready.")
      );
    })
  );

  router.post(
    "/verify/email/resend",
    otpSendLimiter,
    asyncHandler(async (req, res) => {
      ensureEmailDeliveryReady();

      const email = sanitizeEmailInput(req.body.email);
      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const user = findUserByEmail(database, email);

      if (!user) {
        return res.json({
          message: "If a pending account exists for that email, a new verification code has been sent.",
        });
      }

      if (user.emailVerified) {
        return res.json({
          message: "This email is already verified.",
        });
      }

      const verification = await sendEmailVerificationChallenge(database, user);

      return res.json({
        message: `We sent a new verification code to ${maskEmailAddress(email)}.`,
        verification: {
          channel: "email",
          email,
          expiresInMinutes: AUTH_OTP_EXPIRY_MINUTES,
        },
        debug: verification.debug,
      });
    })
  );

  router.get(
    "/verify/email/link",
    asyncHandler(async (req, res) => {
      const rawToken = String(req.query.token || "").trim();

      if (!rawToken) {
        return res.redirect(
          buildClientRedirectUrl("/verify-email", {
            status: "error",
            message: "Verification link is missing.",
          })
        );
      }

      try {
        const payload = verifySignedActionToken(rawToken);

        if (payload.purpose !== "email-verification") {
          throw createHttpError("Verification link is invalid.", 400);
        }

        const database = await readDatabase();
        const user = database.users.find(
          (candidate) => candidate.id === payload.userId && candidate.email === payload.email
        );

        if (!user) {
          throw createHttpError("Account could not be found for this verification link.", 404);
        }

        if (!user.emailVerified) {
          user.emailVerified = true;
          user.isVerified = true;
          user.accountStatus = "active";
          syncUserAuthMetadata(user);
          await writeDatabase(database);
        }

        return res.redirect(
          buildClientRedirectUrl("/verify-email", {
            status: "success",
            email: user.email,
          })
        );
      } catch (error) {
        return res.redirect(
          buildClientRedirectUrl("/verify-email", {
            status: "error",
            message: error.message || "Verification link is invalid or expired.",
          })
        );
      }
    })
  );

  router.post(
    "/password/forgot",
    otpSendLimiter,
    asyncHandler(async (req, res) => {
      const method = String(req.body.method || "").trim().toLowerCase() === "phone" ? "phone" : "email";

      if (method === "email") {
        ensureEmailDeliveryReady();
      } else {
        ensureSmsDeliveryReady();
      }

      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const identifier =
        method === "email"
          ? sanitizeEmailInput(req.body.email)
          : sanitizePhoneInput(req.body.phone);
      const user =
        method === "email"
          ? findUserByEmail(database, identifier)
          : findUserByPhone(database, identifier);

      if (!user) {
        return res.json({
          message: `If an account exists for that ${method === "email" ? "email" : "mobile number"}, we have sent a reset code.`,
        });
      }

      const resetChallenge = await sendPasswordResetChallenge(database, user, method);

      return res.json({
        message:
          method === "email"
            ? `We sent a reset code to ${maskEmailAddress(identifier)}.`
            : `We sent a reset code to ${maskPhoneNumber(identifier)}.`,
        verification: {
          channel: method,
          expiresInMinutes: AUTH_OTP_EXPIRY_MINUTES,
        },
        debug: resetChallenge.debug,
      });
    })
  );

  router.post(
    "/password/reset",
    otpVerifyLimiter,
    asyncHandler(async (req, res) => {
      const method = String(req.body.method || "").trim().toLowerCase() === "phone" ? "phone" : "email";
      const identifier =
        method === "email"
          ? sanitizeEmailInput(req.body.email)
          : sanitizePhoneInput(req.body.phone);
      const otp = sanitizeTextInput(req.body.otp, {
        fieldLabel: "OTP",
        required: true,
        minimumLength: 6,
        maximumLength: 6,
      });
      const nextPassword = req.body.password || "";

      ensurePasswordMeetsPolicy(nextPassword);

      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const challenge = consumeOtpChallenge(database, {
        purpose: "password-reset",
        channel: method === "email" ? "email" : "sms",
        target: identifier,
        otp,
      });
      const user =
        database.users.find((candidate) => candidate.id === challenge.userId) ||
        (method === "email"
          ? findUserByEmail(database, identifier)
          : findUserByPhone(database, identifier));

      if (!user) {
        throw createHttpError("Account could not be found for this reset request.", 404);
      }

      user.passwordHash = await bcrypt.hash(nextPassword, 10);
      user.passwordUpdatedAt = new Date().toISOString();

      if (method === "email") {
        user.emailVerified = true;
      } else {
        user.phoneVerified = true;
      }

      user.isVerified = true;
      user.accountStatus = "active";
      markUserAsLoggedIn(user, "password-reset");
      await writeDatabase(database);

      return res.json(
        createAuthSuccessResponse(user, "Password updated. You are now signed in.")
      );
    })
  );

  router.get(
    "/social/:provider/start",
    socialLimiter,
    asyncHandler(async (req, res) => {
      const provider = String(req.params.provider || "").trim().toLowerCase();
      const redirectTo = sanitizeRedirectPath(req.query.redirectTo, "/account");
      const state = createSignedActionToken(
        {
          purpose: "social-login",
          provider,
          redirectTo,
        },
        SOCIAL_STATE_EXPIRY
      );
      const authorizationUrl = buildSocialAuthorizationUrl({
        provider,
        state,
      });

      return res.redirect(302, authorizationUrl);
    })
  );

  router.get(
    "/social/:provider/callback",
    socialLimiter,
    asyncHandler(async (req, res) => {
      const provider = String(req.params.provider || "").trim().toLowerCase();
      const errorMessage = String(req.query.error_description || req.query.error || "").trim();

      if (errorMessage) {
        return res.redirect(
          buildClientRedirectUrl("/auth/callback", {
            error: errorMessage,
          })
        );
      }

      try {
        const code = sanitizeTextInput(req.query.code, {
          fieldLabel: "Authorization code",
          required: true,
          minimumLength: 4,
          maximumLength: 2048,
        });
        const state = sanitizeTextInput(req.query.state, {
          fieldLabel: "OAuth state",
          required: true,
          minimumLength: 4,
          maximumLength: 4096,
        });
        const statePayload = verifySignedActionToken(state);

        if (
          statePayload.purpose !== "social-login" ||
          statePayload.provider !== provider
        ) {
          throw createHttpError("Social sign-in state is invalid or expired.", 400);
        }

        const profile = await exchangeSocialCodeForProfile({ provider, code });

        if (!profile.email) {
          throw createHttpError(
            `Your ${provider} account did not return an email address. Please try email or phone sign-in instead.`,
            400
          );
        }

        const database = await readDatabase();
        pruneAuthArtifacts(database);

        const existingByProvider = findUserBySocialAccount(database, provider, profile.id);
        const existingByEmail = findUserByEmail(database, profile.email);
        const user =
          existingByProvider ||
          existingByEmail ||
          {
            id: randomUUID(),
            role: "user",
            createdAt: new Date().toISOString(),
            subscription: createInactiveSubscription("Your dog"),
          };

        user.name = user.name || profile.name || "PetPlus customer";
        user.email = user.email || profile.email;
        user.emailVerified = true;
        user.isVerified = true;
        user.accountStatus = "active";
        user.socialAccounts = user.socialAccounts || {};
        user.socialAccounts[provider] = {
          id: profile.id,
          email: profile.email,
          linkedAt: new Date().toISOString(),
        };

        if (!existingByProvider && !existingByEmail) {
          database.users.unshift(user);
        }

        markUserAsLoggedIn(user, provider);
        const exchangeCode = createAuthExchangeCode(database, {
          userId: user.id,
          provider,
          redirectTo: statePayload.redirectTo || "/account",
        });
        await writeDatabase(database);

        return res.redirect(
          buildClientRedirectUrl("/auth/callback", {
            exchange: exchangeCode,
          })
        );
      } catch (error) {
        return res.redirect(
          buildClientRedirectUrl("/auth/callback", {
            error: error.message || "Social sign-in could not be completed.",
          })
        );
      }
    })
  );

  router.post(
    "/social/exchange",
    asyncHandler(async (req, res) => {
      const code = sanitizeTextInput(req.body.code, {
        fieldLabel: "Exchange code",
        required: true,
        minimumLength: 8,
        maximumLength: 200,
      });
      const database = await readDatabase();
      pruneAuthArtifacts(database);

      const exchange = consumeAuthExchangeCode(database, code);
      const user = database.users.find((candidate) => candidate.id === exchange.userId);

      if (!user) {
        throw createHttpError("The linked account could not be found.", 404);
      }

      markUserAsLoggedIn(user, exchange.provider || "social");
      await writeDatabase(database);

      return res.json(
        createAuthSuccessResponse(
          user,
          "Social sign-in completed.",
          user.role === "admin" ? "/admin" : exchange.redirectTo || "/account"
        )
      );
    })
  );

  router.get(
    "/me",
    requireAuth,
    asyncHandler(async (req, res) => {
      return res.json({ user: sanitizeUser(req.user) });
    })
  );

  return router;
};

export default createRouter;
