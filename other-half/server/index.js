import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

import { optionalAuth, requireAdmin, requireAuth, signAuthToken } from "./lib/auth.js";
import {
  DATABASE_FILE,
  readDatabase,
  sanitizeUser,
  seedDatabase,
  UPLOADS_DIR,
  writeDatabase,
} from "./lib/database.js";
import { sendSupportRequestEmail } from "./lib/mailer.js";
import { resolveReviewProduct } from "../shared/reviewProductCatalog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT) || 4000;
const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const DIST_DIR = path.join(ROOT_DIR, "dist");
const DIST_INDEX = path.join(DIST_DIR, "index.html");

const app = express();

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOADS_DIR);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 5,
  },
});

const asyncHandler = (handler) => {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
};

const emailPattern = /\S+@\S+\.\S+/;

const normalizeEmail = (value = "") => value.trim().toLowerCase();

const normalizeTextValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const addQueryParam = (urlValue, key, value) => {
  try {
    const nextUrl = new URL(urlValue);
    nextUrl.searchParams.set(key, value);
    return nextUrl.toString();
  } catch {
    return urlValue;
  }
};

const sortByDateDescending = (collection, field = "createdAt") => {
  return [...collection].sort((firstItem, secondItem) => {
    return new Date(secondItem[field]).getTime() - new Date(firstItem[field]).getTime();
  });
};

const summarizeSupportRequest = (supportRequest) => ({
  ...supportRequest,
  attachments: supportRequest.attachments.map((attachment) => ({
    originalName: attachment.originalName,
    size: attachment.size,
    mimetype: attachment.mimetype,
  })),
  emailNotification: supportRequest.emailNotification || null,
});

const summarizeReview = (review) => ({
  id: review.id,
  productId: review.productId,
  productName: review.productName,
  productRoute: review.productRoute,
  title: review.title,
  description: review.description,
  rating: review.rating,
  customerName: review.customerName,
  customerProfile: review.customerProfile,
  customerImage: review.customerImage,
  createdAt: review.createdAt,
});

const getReviewSummary = (reviews) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return {
      count: 0,
      averageRating: 0,
    };
  }

  const totalRating = reviews.reduce(
    (runningTotal, review) => runningTotal + (Number(review.rating) || 0),
    0
  );

  return {
    count: reviews.length,
    averageRating: Number((totalRating / reviews.length).toFixed(1)),
  };
};

const resolveCatalogProductFromOrderItem = (item) => {
  return resolveReviewProduct({
    productId: item?.productId || "",
    productName: item?.name || "",
  });
};

const getReviewableProductsForUser = (orders, reviews, userId) => {
  const reviewLookup = new Set(
    reviews
      .filter((review) => review.userId === userId)
      .map((review) => `${review.userId}::${review.productId}`)
  );
  const productsById = new Map();

  orders
    .filter(
      (order) =>
        order.userId === userId &&
        order.orderStatus !== "cancelled" &&
        (String(order.paymentStatus || "").toLowerCase() === "paid" ||
          String(order.orderStatus || "").toLowerCase() === "processing" ||
          String(order.orderStatus || "").toLowerCase() === "shipped" ||
          String(order.orderStatus || "").toLowerCase() === "delivered" ||
          String(order.orderStatus || "").toLowerCase() === "placed")
    )
    .forEach((order) => {
      (order.items || []).forEach((item) => {
        const catalogProduct = resolveCatalogProductFromOrderItem(item);

        if (!catalogProduct) {
          return;
        }

        const reviewKey = `${userId}::${catalogProduct.productId}`;

        if (reviewLookup.has(reviewKey) || productsById.has(catalogProduct.productId)) {
          return;
        }

        productsById.set(catalogProduct.productId, {
          productId: catalogProduct.productId,
          productName: catalogProduct.productName,
          productRoute: catalogProduct.route,
          reviewSectionHref: catalogProduct.reviewSectionHref,
          image: catalogProduct.image,
          testimonialImage: catalogProduct.testimonialImage,
          sourceOrderId: order.id,
          sourceOrderNumber: order.orderNumber,
          purchasedAt: order.createdAt,
        });
      });
    });

  return Array.from(productsById.values()).sort((firstProduct, secondProduct) => {
    return new Date(secondProduct.purchasedAt).getTime() - new Date(firstProduct.purchasedAt).getTime();
  });
};

const validatePassword = (password = "") => {
  return password.trim().length >= 8;
};

const createStripeCheckoutSession = async ({
  secretKey,
  items,
  email,
  successUrl,
  cancelUrl,
}) => {
  const requestBody = new URLSearchParams();
  requestBody.set("mode", "payment");
  requestBody.set("success_url", successUrl);
  requestBody.set("cancel_url", cancelUrl);
  requestBody.set("payment_method_types[0]", "card");

  if (emailPattern.test(email)) {
    requestBody.set("customer_email", email);
  }

  items.forEach((item, index) => {
    requestBody.set(`line_items[${index}][quantity]`, String(item.quantity));
    requestBody.set(`line_items[${index}][price_data][currency]`, "usd");
    requestBody.set(
      `line_items[${index}][price_data][unit_amount]`,
      String(Math.round(item.unitPrice * 100))
    );
    requestBody.set(
      `line_items[${index}][price_data][product_data][name]`,
      item.name
    );

    if (item.description) {
      requestBody.set(
        `line_items[${index}][price_data][product_data][description]`,
        item.description
      );
    }

    if (item.image) {
      requestBody.set(
        `line_items[${index}][price_data][product_data][images][0]`,
        item.image
      );
    }
  });

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody,
  });
  const stripePayload = await stripeResponse.json();

  if (!stripeResponse.ok) {
    const upstreamMessage =
      stripePayload?.error?.message ||
      "Stripe checkout session could not be created.";
    const error = new Error(upstreamMessage);
    error.statusCode = 502;
    throw error;
  }

  return {
    sessionId: stripePayload.id,
    url: stripePayload.url,
  };
};

const createUpiPaymentLink = ({ vpa, payeeName, amount, note, transactionRef }) => {
  const upiQuery = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note,
    tr: transactionRef,
  });

  return `upi://pay?${upiQuery.toString()}`;
};

const createOrderNumber = () => `OH-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

const toSafeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getTimeValue = (value) => {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const summarizeOrder = (order) => ({
  ...order,
  items: Array.isArray(order.items)
    ? order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: toSafeNumber(item.unitPrice),
        lineTotal: toSafeNumber(item.lineTotal),
        purchaseType: item.purchaseType || "one-time",
      }))
    : [],
});

const getSupportStatusCounts = (supportRequests) => {
  return supportRequests.reduce(
    (counts, supportRequest) => {
      const normalizedStatus = String(supportRequest.status || "").trim().toLowerCase();

      if (normalizedStatus === "new" || normalizedStatus === "in-review" || normalizedStatus === "resolved") {
        counts[normalizedStatus] += 1;
      } else {
        counts.other += 1;
      }

      return counts;
    },
    {
      new: 0,
      "in-review": 0,
      resolved: 0,
      other: 0,
    }
  );
};

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (configuredOrigins.length === 0) {
    return true;
  }

  if (configuredOrigins.includes(origin)) {
    return true;
  }

  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Other Half API is healthy.",
    timestamp: new Date().toISOString(),
  });
});

app.post(
  "/api/payments/create-checkout-session",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const rawItems = Array.isArray(req.body.items) ? req.body.items : [];
    const items = rawItems
      .slice(0, 20)
      .map((item) => ({
        productId: String(item?.productId || "").trim(),
        name: String(item?.name || "").trim(),
        description: String(item?.description || "").trim().slice(0, 240),
        image: String(item?.image || "").trim(),
        unitPrice: Number(item?.unitPrice),
        quantity: Math.round(Number(item?.quantity || 1)),
        purchaseType: item?.purchaseType === "subscription" ? "subscription" : "one-time",
      }))
      .filter(
        (item) =>
          item.name &&
          Number.isFinite(item.unitPrice) &&
          item.unitPrice > 0 &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0
      );

    if (items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    const upiVpa = (process.env.UPI_VPA || "9690296846@ptsbi").trim();
    const upiPayeeName = (process.env.UPI_PAYEE_NAME || "Other Half Pets").trim();
    const fallbackOrigin = req.headers.origin
      ? req.headers.origin
      : `http://localhost:${PORT}`;
    const preferredSuccessUrl =
      typeof req.body.successUrl === "string" ? req.body.successUrl.trim() : "";
    const preferredCancelUrl =
      typeof req.body.cancelUrl === "string" ? req.body.cancelUrl.trim() : "";
    const localOrderId = randomUUID();
    const localOrderNumber = createOrderNumber();
    const successUrlBase =
      /^https?:\/\//i.test(preferredSuccessUrl)
        ? preferredSuccessUrl
        : `${fallbackOrigin}/cart?checkout=success`;
    const cancelUrlBase =
      /^https?:\/\//i.test(preferredCancelUrl)
        ? preferredCancelUrl
        : `${fallbackOrigin}/cart?checkout=cancelled`;
    const successUrl = addQueryParam(successUrlBase, "orderId", localOrderId);
    const cancelUrl = addQueryParam(cancelUrlBase, "orderId", localOrderId);
    const email = normalizeEmail(req.body.email || "");
    const normalizedItems = items.map((item) => ({
      ...item,
      image:
        item.image && item.image.startsWith("/")
          ? `${fallbackOrigin}${item.image}`
          : item.image,
    }));
    const totalAmount = items.reduce(
      (runningTotal, item) => runningTotal + item.unitPrice * item.quantity,
      0
    );
    const now = new Date().toISOString();
    const customerName =
      req.user?.name || (typeof req.body.customerName === "string" ? req.body.customerName.trim() : "") || "Guest customer";
    const customerEmail = email || req.user?.email || "";
    const subscriptionType = items.some((item) => item.purchaseType === "subscription")
      ? "subscription"
      : "one-time";
    const deliveryDueAt = subscriptionType === "subscription" ? req.user?.subscription?.nextDelivery || null : null;
    const normalizedOrderItems = items.map((item) => ({
      productId:
        resolveCatalogProductFromOrderItem(item)?.productId || item.productId || "",
      name: item.name,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice.toFixed(2)),
      lineTotal: Number((item.unitPrice * item.quantity).toFixed(2)),
      purchaseType: item.purchaseType,
    }));

    const persistOrder = async ({
      paymentMode,
      paymentStatus,
      currency,
      paymentReference,
      orderStatus = "placed",
      deliveryStatus,
    }) => {
      const database = await readDatabase();
      database.orders.unshift({
        id: localOrderId,
        orderNumber: localOrderNumber,
        userId: req.user?.id || null,
        customerName,
        customerEmail,
        currency,
        totalAmount: Number(totalAmount.toFixed(2)),
        paymentMode,
        paymentStatus,
        paymentReference,
        orderStatus,
        subscriptionType,
        deliveryStatus:
          deliveryStatus ||
          (subscriptionType === "subscription" ? "scheduled" : "queued"),
        deliveryDueAt,
        items: normalizedOrderItems,
        createdAt: now,
        updatedAt: now,
      });
      await writeDatabase(database);
    };

    if (stripeSecretKey) {
      const session = await createStripeCheckoutSession({
        secretKey: stripeSecretKey,
        items: normalizedItems,
        email,
        successUrl,
        cancelUrl,
      });

      await persistOrder({
        paymentMode: "card",
        paymentStatus: "pending",
        currency: "USD",
        paymentReference: session.sessionId,
      });

      return res.status(201).json({
        mode: "stripe",
        url: session.url,
        sessionId: session.sessionId,
        orderId: localOrderId,
        orderNumber: localOrderNumber,
      });
    }

    if (upiVpa) {
      const transactionRef = `OH-${Date.now()}`;
      const topItemNames = items.slice(0, 2).map((item) => item.name);
      const note = `Order ${transactionRef} - ${topItemNames.join(", ")}`.slice(0, 80);
      const upiUrl = createUpiPaymentLink({
        vpa: upiVpa,
        payeeName: upiPayeeName,
        amount: totalAmount,
        note,
        transactionRef,
      });

      await persistOrder({
        paymentMode: "upi",
        paymentStatus: "pending",
        currency: "INR",
        paymentReference: transactionRef,
      });

      return res.status(201).json({
        mode: "upi",
        upiUrl,
        vpa: upiVpa,
        amount: Number(totalAmount.toFixed(2)),
        currency: "INR",
        transactionRef,
        orderId: localOrderId,
        orderNumber: localOrderNumber,
        message: "UPI payment link generated.",
      });
    }

    return res.status(503).json({
      message:
        "Payment gateway is not configured yet. Add STRIPE_SECRET_KEY or UPI_VPA on the server.",
    });
  })
);

app.post(
  "/api/auth/register",
  asyncHandler(async (req, res) => {
    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);
    const phone = req.body.phone?.trim() || "";
    const password = req.body.password || "";
    const dogName = req.body.dogName?.trim() || "Your dog";

    if (!name) {
      return res.status(400).json({ message: "Please enter your full name." });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password should be at least 8 characters long." });
    }

    const database = await readDatabase();
    const existingUser = database.users.find((user) => user.email === email);

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const createdAt = new Date().toISOString();
    const user = {
      id: randomUUID(),
      name,
      email,
      phone,
      role: "user",
      passwordHash: await bcrypt.hash(password, 10),
      subscription: {
        status: "active",
        planName: "Everyday Wellness Plan",
        deliveryCadence: "Every 30 days",
        nextDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
        dogProfile: {
          name: dogName,
          breed: "Not set yet",
          age: "Not set yet",
          focus: "Getting started",
        },
      },
      createdAt,
      lastLoginAt: createdAt,
    };

    database.users.unshift(user);
    await writeDatabase(database);

    return res.status(201).json({
      token: signAuthToken(user),
      user: sanitizeUser(user),
      message: "Account created successfully.",
    });
  })
);

app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password || "";
    const database = await readDatabase();
    const user = database.users.find((candidate) => candidate.email === email);

    if (!user) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    user.lastLoginAt = new Date().toISOString();
    await writeDatabase(database);

    return res.json({
      token: signAuthToken(user),
      user: sanitizeUser(user),
      message: "Welcome back.",
    });
  })
);

app.get(
  "/api/auth/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    return res.json({ user: req.safeUser });
  })
);

app.get(
  "/api/account/summary",
  requireAuth,
  asyncHandler(async (req, res) => {
    const database = await readDatabase();
    const supportRequests = sortByDateDescending(
      database.supportRequests.filter((request) => request.userId === req.user.id)
    ).map(summarizeSupportRequest);
    const quizSubmissions = sortByDateDescending(
      database.quizSubmissions.filter((submission) => submission.userId === req.user.id)
    );

    return res.json({
      user: sanitizeUser(req.user),
      subscription: req.user.subscription,
      supportRequests,
      quizSubmissions,
      metrics: {
        openSupportRequests: supportRequests.filter(
          (request) => request.status !== "resolved"
        ).length,
        savedRecommendations: quizSubmissions.length,
      },
    });
  })
);

app.patch(
  "/api/account/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    const database = await readDatabase();
    const user = database.users.find((candidate) => candidate.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Account was not found." });
    }

    const nextName = req.body.name?.trim();
    const nextPhone = req.body.phone?.trim();
    const nextDogName = req.body.dogName?.trim();
    const nextCadence = req.body.deliveryCadence?.trim();

    if (nextName) {
      user.name = nextName;
    }

    if (typeof nextPhone === "string") {
      user.phone = nextPhone;
    }

    if (nextDogName) {
      user.subscription.dogProfile.name = nextDogName;
    }

    if (nextCadence) {
      user.subscription.deliveryCadence = nextCadence;
    }

    await writeDatabase(database);

    return res.json({
      user: sanitizeUser(user),
      subscription: user.subscription,
      message: "Account details updated.",
    });
  })
);

app.post(
  "/api/orders/:orderId/status",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const database = await readDatabase();
    const order = database.orders.find((candidate) => candidate.id === req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order was not found." });
    }

    if (order.userId && req.user?.id && order.userId !== req.user.id) {
      return res.status(403).json({ message: "You do not have access to update this order." });
    }

    const nextStatus = normalizeTextValue(req.body.status || "");

    if (nextStatus !== "paid" && nextStatus !== "cancelled") {
      return res.status(400).json({ message: "A valid order status is required." });
    }

    order.updatedAt = new Date().toISOString();

    if (nextStatus === "paid") {
      order.paymentStatus = "paid";
      order.orderStatus =
        order.orderStatus === "delivered" || order.orderStatus === "shipped"
          ? order.orderStatus
          : "processing";
    }

    if (nextStatus === "cancelled") {
      order.orderStatus = "cancelled";
      if (String(order.paymentStatus || "").toLowerCase() !== "paid") {
        order.paymentStatus = "cancelled";
      }
    }

    await writeDatabase(database);

    return res.json({
      message: "Order status updated.",
      order: summarizeOrder(order),
    });
  })
);

app.post(
  "/api/support/requests",
  optionalAuth,
  upload.array("attachments", 5),
  asyncHandler(async (req, res) => {
    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);
    const subject = req.body.subject?.trim();
    const message = req.body.message?.trim();

    if (!name || !emailPattern.test(email) || !subject || !message || message.length < 20) {
      return res.status(400).json({
        message: "Please complete the required support request details before submitting.",
      });
    }

    const database = await readDatabase();
    const createdAt = new Date().toISOString();
    const supportRequest = {
      id: randomUUID(),
      userId: req.user?.id || null,
      team: req.body.team?.trim() || "Customer Support",
      teamEmail: req.body.teamEmail?.trim() || "care@otherhalfpets.com",
      name,
      email,
      phone: req.body.phone?.trim() || "",
      orderNumber: req.body.orderNumber?.trim() || "",
      dogName: req.body.dogName?.trim() || "",
      subject,
      category: req.body.category?.trim() || "other",
      priority: req.body.priority?.trim() || "standard",
      preferredContact: req.body.preferredContact?.trim() || "email",
      message,
      status: "new",
      attachments: (req.files || []).map((file) => ({
        fileName: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      })),
      emailNotification: {
        delivered: false,
        skipped: false,
        reason: "",
        recipients: [],
        messageId: null,
        lastAttemptAt: null,
      },
      handledBy: null,
      createdAt,
      updatedAt: createdAt,
    };

    database.supportRequests.unshift(supportRequest);
    await writeDatabase(database);

    let emailDelivery = {
      delivered: false,
      skipped: true,
      reason: "Email delivery was not attempted.",
      recipients: [],
      messageId: null,
    };

    try {
      emailDelivery = await sendSupportRequestEmail(supportRequest);
    } catch (error) {
      emailDelivery = {
        delivered: false,
        skipped: false,
        reason: error.message || "Email delivery failed.",
        recipients: [],
        messageId: null,
      };
    }

    supportRequest.emailNotification = {
      delivered: emailDelivery.delivered,
      skipped: emailDelivery.skipped,
      reason: emailDelivery.reason,
      recipients: emailDelivery.recipients,
      messageId: emailDelivery.messageId,
      lastAttemptAt: new Date().toISOString(),
    };
    supportRequest.updatedAt = supportRequest.emailNotification.lastAttemptAt;
    await writeDatabase(database);

    return res.status(201).json({
      message: emailDelivery.delivered
        ? "Support request submitted successfully and emailed to the admin inbox."
        : "Support request submitted successfully. Email delivery is waiting for mail configuration or retry.",
      supportRequest: summarizeSupportRequest(supportRequest),
      emailDelivery: supportRequest.emailNotification,
    });
  })
);

app.get(
  "/api/support/my-requests",
  requireAuth,
  asyncHandler(async (req, res) => {
    const database = await readDatabase();
    const supportRequests = sortByDateDescending(
      database.supportRequests.filter((request) => request.userId === req.user.id)
    ).map(summarizeSupportRequest);

    return res.json({ supportRequests });
  })
);

app.post(
  "/api/newsletter/subscribe",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const source = req.body.source?.trim() || "footer";

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const database = await readDatabase();
    const existingSubscriber = database.newsletterSubscribers.find(
      (subscriber) => subscriber.email === email
    );

    if (existingSubscriber) {
      return res.json({
        message: "This email is already in the pack. You are all set.",
      });
    }

    database.newsletterSubscribers.unshift({
      id: randomUUID(),
      email,
      source,
      createdAt: new Date().toISOString(),
    });

    await writeDatabase(database);

    return res.status(201).json({
      message: "You are in. We will send new drops and useful updates your way.",
    });
  })
);

app.post(
  "/api/quiz/submissions",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const recommendationKey = req.body.recommendationKey?.trim();
    const recommendationTitle = req.body.recommendationTitle?.trim();
    const topFocuses = Array.isArray(req.body.topFocuses) ? req.body.topFocuses.slice(0, 3) : [];
    const answers = Array.isArray(req.body.answers) ? req.body.answers.slice(0, 10) : [];

    if (!recommendationKey || !recommendationTitle) {
      return res.status(400).json({ message: "Quiz result is missing recommendation details." });
    }

    const database = await readDatabase();
    const submission = {
      id: randomUUID(),
      userId: req.user?.id || null,
      name: req.user?.name || "Guest visitor",
      email: req.user?.email || "",
      recommendationKey,
      recommendationTitle,
      topFocuses,
      scores: req.body.scores || {},
      answers,
      createdAt: new Date().toISOString(),
    };

    database.quizSubmissions.unshift(submission);
    await writeDatabase(database);

    return res.status(201).json({
      message: req.user
        ? "Quiz result saved to your account."
        : "Quiz result saved for reporting.",
      submission,
    });
  })
);

app.get(
  "/api/reviews",
  asyncHandler(async (req, res) => {
    const database = await readDatabase();
    const requestedProductId = String(req.query.productId || "").trim();
    const productFilter = requestedProductId
      ? resolveReviewProduct({ productId: requestedProductId })?.productId || requestedProductId
      : "";
    const reviews = sortByDateDescending(database.reviews)
      .filter((review) => review.status === "approved")
      .filter((review) => (productFilter ? review.productId === productFilter : true));

    return res.json({
      reviews: reviews.map(summarizeReview),
      summary: getReviewSummary(reviews),
    });
  })
);

app.get(
  "/api/reviews/eligible",
  requireAuth,
  asyncHandler(async (req, res) => {
    const database = await readDatabase();
    const products = getReviewableProductsForUser(database.orders, database.reviews, req.user.id);

    return res.json({ products });
  })
);

app.post(
  "/api/reviews",
  requireAuth,
  asyncHandler(async (req, res) => {
    const database = await readDatabase();
    const product = resolveReviewProduct({
      productId: req.body.productId,
      productName: req.body.productName,
    });
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const rating = Math.round(Number(req.body.rating || 0));

    if (!product) {
      return res.status(400).json({ message: "Please choose a valid purchased product." });
    }

    if (!title || title.length < 4) {
      return res.status(400).json({ message: "Review title should be at least 4 characters long." });
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please choose a rating between 1 and 5 stars." });
    }

    if (!description || description.length < 20) {
      return res.status(400).json({ message: "Review description should be at least 20 characters long." });
    }

    const eligibleProducts = getReviewableProductsForUser(database.orders, database.reviews, req.user.id);
    const eligibleProduct = eligibleProducts.find(
      (candidate) => candidate.productId === product.productId
    );

    if (!eligibleProduct) {
      return res.status(403).json({
        message: "You can only review a product after purchasing it from your account.",
      });
    }

    const createdAt = new Date().toISOString();
    const review = {
      id: randomUUID(),
      userId: req.user.id,
      productId: product.productId,
      productName: product.productName,
      productRoute: product.route,
      title,
      description,
      rating,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerProfile:
        req.body.customerProfile?.trim() ||
        `${req.user.subscription?.dogProfile?.breed || "Dog parent"} | ${product.productName}`,
      customerImage: product.testimonialImage,
      sourceOrderId: eligibleProduct.sourceOrderId,
      sourceOrderNumber: eligibleProduct.sourceOrderNumber,
      status: "approved",
      createdAt,
      updatedAt: createdAt,
    };

    database.reviews.unshift(review);
    await writeDatabase(database);

    const productReviews = database.reviews.filter(
      (candidate) => candidate.status === "approved" && candidate.productId === product.productId
    );

    return res.status(201).json({
      message: "Review submitted successfully.",
      review: summarizeReview(review),
      summary: getReviewSummary(productReviews),
    });
  })
);

app.get(
  "/api/admin/dashboard",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const database = await readDatabase();
    const supportRequests = sortByDateDescending(database.supportRequests);
    const quizSubmissions = sortByDateDescending(database.quizSubmissions);
    const newsletterSubscribers = sortByDateDescending(database.newsletterSubscribers);
    const orders = sortByDateDescending(database.orders);
    const dogParents = database.users.filter((user) => user.role !== "admin");
    const activeSubscriptions = dogParents.filter(
      (user) => String(user.subscription?.status || "").toLowerCase() === "active"
    );
    const usersWithSubscription = dogParents.filter((user) => {
      const subscriptionStatus = String(user.subscription?.status || "").toLowerCase();
      return Boolean(user.subscription) && subscriptionStatus !== "cancelled" && subscriptionStatus !== "none";
    });
    const usersWithoutSubscription = dogParents.length - usersWithSubscription.length;
    const supportStatusCounts = getSupportStatusCounts(supportRequests);
    const now = Date.now();
    const sevenDaysAhead = now + 1000 * 60 * 60 * 24 * 7;

    const deliveryQueue = activeSubscriptions
      .map((user) => ({
        ...sanitizeUser(user),
        nextDelivery: user.subscription?.nextDelivery || null,
      }))
      .filter((user) => user.nextDelivery)
      .sort((firstUser, secondUser) => {
        const firstTime = getTimeValue(firstUser.nextDelivery) ?? Number.MAX_SAFE_INTEGER;
        const secondTime = getTimeValue(secondUser.nextDelivery) ?? Number.MAX_SAFE_INTEGER;
        return firstTime - secondTime;
      });

    const deliveriesDueNow = deliveryQueue.filter((user) => {
      const deliveryTime = getTimeValue(user.nextDelivery);
      return deliveryTime !== null && deliveryTime <= now;
    }).length;

    const deliveriesDueSoon = deliveryQueue.filter((user) => {
      const deliveryTime = getTimeValue(user.nextDelivery);
      return deliveryTime !== null && deliveryTime > now && deliveryTime <= sevenDaysAhead;
    }).length;

    const orderMetrics = orders.reduce(
      (metrics, order) => {
        const totalAmount = toSafeNumber(order.totalAmount);
        const paymentStatus = String(order.paymentStatus || "").toLowerCase();
        const orderStatus = String(order.orderStatus || "").toLowerCase();
        const subscriptionType = String(order.subscriptionType || "").toLowerCase();

        metrics.totalOrders += 1;
        metrics.totalRevenue += totalAmount;

        if (paymentStatus === "paid") {
          metrics.paidOrders += 1;
          metrics.paidRevenue += totalAmount;
        } else if (paymentStatus === "pending") {
          metrics.pendingPayments += 1;
        }

        if (subscriptionType === "subscription") {
          metrics.subscriptionOrders += 1;
        } else {
          metrics.oneTimeOrders += 1;
        }

        if (Object.prototype.hasOwnProperty.call(metrics.statusCounts, orderStatus)) {
          metrics.statusCounts[orderStatus] += 1;
        } else {
          metrics.statusCounts.other += 1;
        }

        return metrics;
      },
      {
        totalOrders: 0,
        totalRevenue: 0,
        paidOrders: 0,
        paidRevenue: 0,
        pendingPayments: 0,
        subscriptionOrders: 0,
        oneTimeOrders: 0,
        statusCounts: {
          placed: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
          other: 0,
        },
      }
    );

    const analytics = {
      supportStatusCounts,
      orders: {
        ...orderMetrics,
        totalRevenue: Number(orderMetrics.totalRevenue.toFixed(2)),
        paidRevenue: Number(orderMetrics.paidRevenue.toFixed(2)),
        averageOrderValue:
          orderMetrics.totalOrders > 0
            ? Number((orderMetrics.totalRevenue / orderMetrics.totalOrders).toFixed(2))
            : 0,
      },
      subscriptions: {
        active: activeSubscriptions.length,
        withSubscription: usersWithSubscription.length,
        withoutSubscription: usersWithoutSubscription,
      },
      deliveries: {
        dueNow: deliveriesDueNow,
        dueSoon: deliveriesDueSoon,
        queued: deliveryQueue.length,
      },
    };

    return res.json({
      overview: {
        users: database.users.length,
        admins: database.users.filter((user) => user.role === "admin").length,
        supportRequests: supportRequests.length,
        openSupportRequests: supportRequests.filter(
          (request) => request.status !== "resolved"
        ).length,
        newsletterSubscribers: newsletterSubscribers.length,
        quizSubmissions: quizSubmissions.length,
        orders: orders.length,
        activeSubscriptions: activeSubscriptions.length,
        deliveriesDue: deliveriesDueNow + deliveriesDueSoon,
      },
      analytics,
      latestSupportRequests: supportRequests.slice(0, 5).map(summarizeSupportRequest),
      latestQuizSubmissions: quizSubmissions.slice(0, 5),
      latestSubscribers: newsletterSubscribers.slice(0, 5),
      latestOrders: orders.slice(0, 5).map(summarizeOrder),
      deliveryQueue: deliveryQueue.slice(0, 15),
    });
  })
);

app.get(
  "/api/admin/users",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const database = await readDatabase();
    const users = sortByDateDescending(database.users, "createdAt").map(sanitizeUser);
    return res.json({ users });
  })
);

app.get(
  "/api/admin/orders",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const database = await readDatabase();
    const orders = sortByDateDescending(database.orders).map(summarizeOrder);
    return res.json({ orders });
  })
);

app.get(
  "/api/admin/support-requests",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const database = await readDatabase();
    const supportRequests = sortByDateDescending(database.supportRequests).map(
      summarizeSupportRequest
    );
    return res.json({ supportRequests });
  })
);

app.patch(
  "/api/admin/support-requests/:requestId/status",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const database = await readDatabase();
    const supportRequest = database.supportRequests.find(
      (request) => request.id === req.params.requestId
    );

    if (!supportRequest) {
      return res.status(404).json({ message: "Support request not found." });
    }

    supportRequest.status = req.body.status?.trim() || supportRequest.status;
    supportRequest.handledBy = req.user.name;
    supportRequest.updatedAt = new Date().toISOString();
    await writeDatabase(database);

    return res.json({
      message: "Support request status updated.",
      supportRequest: summarizeSupportRequest(supportRequest),
    });
  })
);

app.get(
  "/api/admin/newsletter-subscribers",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const database = await readDatabase();
    const subscribers = sortByDateDescending(database.newsletterSubscribers);
    return res.json({ subscribers });
  })
);

app.get(
  "/api/admin/quiz-submissions",
  requireAuth,
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const database = await readDatabase();
    const quizSubmissions = sortByDateDescending(database.quizSubmissions);
    return res.json({ quizSubmissions });
  })
);

app.use((error, _req, res, next) => {
  void next;

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Request body could not be read. Please check the submitted form data.",
    });
  }

  if (error?.message?.includes("not allowed by CORS")) {
    return res.status(403).json({
      message:
        "This frontend origin is not allowed yet. Update CLIENT_ORIGIN or use localhost/127.0.0.1.",
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Each attachment must be smaller than 8 MB." });
    }

    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({
    message: "Something unexpected happened on the server.",
  });
});

if (fs.existsSync(DIST_INDEX)) {
  app.use(express.static(DIST_DIR));
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    return res.sendFile(DIST_INDEX);
  });
}

seedDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Other Half API listening on http://localhost:${PORT}`);
      console.log(`Local database file: ${DATABASE_FILE}`);
    });
  })
  .catch((error) => {
    console.error("Failed to seed database", error);
    process.exit(1);
  });
