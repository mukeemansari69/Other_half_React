import "./loadEnv.js";
import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import helmet from "helmet";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { optionalAuth, requireAdmin, requireAuth } from "./lib/auth.js";
import { buildDogHealthAssistantReply } from "./lib/aiPetAssistant.js";
import {
  DATABASE_TARGET,
  readDatabase,
  sanitizeUser,
  seedDatabase,
  UPLOADS_DIR,
  writeDatabase,
} from "./lib/database.js";
import { createRequestLogger, logError, logInfo, logWarn } from "./lib/logger.js";
import { sendSupportRequestEmail } from "./lib/mailer.js";
import createAuthRouter from "./routes/auth.js";
import {
  ACTIVE_SUBSCRIPTION_STATUSES,
  getPrimarySubscriptionItem,
  normalizeSubscriptionStatus,
  syncUserSubscriptionState,
} from "./lib/subscriptions.js";
import {
  createStripeCheckoutSession,
  getStripeConfig,
  retrieveStripeCheckoutSession,
  retrieveStripeSubscription,
  verifyStripeWebhookSignature,
} from "./lib/stripe.js";
import {
  createRazorpayOrder,
  fetchRazorpayPayment,
  getRazorpayConfig,
  verifyRazorpayPaymentSignature,
} from "./lib/razorpay.js";
import {
  getUploadStorageMode,
  mapSupportRequestAttachments,
  supportUpload,
} from "./lib/uploads.js";
import { resolveReviewProduct } from "../shared/reviewProductCatalog.js";
import { addIntervalToDate, getCadenceDetails } from "../shared/subscriptionUtils.js";
import {
  BRAND_FULL_NAME,
  PAYMENT_PROVIDER,
  STORE_CURRENCY,
  calculateShipping,
  toMinorUnits,
} from "../shared/storefrontConfig.js";
import {
  SEO_REDIRECTS,
  getCanonicalPath,
  getRobotsDirectiveForPath,
  isKnownRoute,
} from "../shared/seo.js";
import {
  hasCompleteDeliveryAddress,
  normalizeDeliveryAddress,
  normalizeEmail,
  normalizeTextValue,
  sanitizeDeliveryAddressInput,
  sanitizeEmailInput,
  sanitizePhoneInput,
  sanitizeTextInput,
} from "./lib/validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT) || 4000;
const isProduction = process.env.NODE_ENV === "production";
const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const DIST_DIR = path.join(ROOT_DIR, "dist");
const DIST_INDEX = path.join(DIST_DIR, "index.html");
const DIST_NOT_FOUND = path.join(DIST_DIR, "404.html");

const resolveStaticHtmlPath = (requestPath) => {
  const normalizedPath = String(requestPath || "/").replace(/\/+$/, "") || "/";

  if (normalizedPath === "/") {
    return DIST_INDEX;
  }

  return path.join(DIST_DIR, normalizedPath.replace(/^\//, ""), "index.html");
};

const app = express();
app.disable("x-powered-by");

if (isProduction) {
  app.set("trust proxy", 1);
}

const asyncHandler = (handler) => {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
};

const allowedSupportCategories = new Set([
  "billing",
  "delivery",
  "general",
  "order-issue",
  "other",
  "product-question",
  "refund",
  "subscription-help",
  "website",
]);
const allowedSupportPriorities = new Set(["low", "standard", "priority", "urgent"]);
const allowedSupportContactMethods = new Set(["email", "phone"]);

const sanitizeSupportChoice = (value, allowedValues, fallback) => {
  const normalizedValue = String(value ?? "").trim().toLowerCase();
  return allowedValues.has(normalizedValue) ? normalizedValue : fallback;
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 300 : 1500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/api/health",
  message: {
    message: "Too many requests were sent from this connection. Please try again shortly.",
  },
});

const supportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = normalizeEmail(req.body?.email || "");
    return `${ipKeyGenerator(req.ip || "")}:${email || "anonymous-support"}`;
  },
  message: {
    message: "Too many support requests were submitted. Please try again shortly.",
  },
});

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
    url: attachment.url || "",
    storage: attachment.storage || "local",
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

const createOrderNumber = () => `PP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

const toSafeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getTimeValue = (value) => {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
};

const appendRawQueryParam = (urlValue, key, value) => {
  const separator = urlValue.includes("?") ? "&" : "?";
  return `${urlValue}${separator}${encodeURIComponent(key)}=${value}`;
};

const toIsoFromUnixSeconds = (value) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return new Date(parsed * 1000).toISOString();
};

const toCurrencyAmountFromMinorUnits = (value) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? Number((parsed / 100).toFixed(2)) : 0;
};

const hasSubmittedAddressFields = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return [
    "fullName",
    "name",
    "phone",
    "line1",
    "line2",
    "landmark",
    "city",
    "state",
    "postalCode",
    "zip",
    "pincode",
  ].some((fieldName) => String(value[fieldName] ?? "").trim());
};

const buildSubscriptionSnapshotFromItems = (items, overrides = {}, referenceDate = new Date().toISOString()) => {
  const primaryItem = getPrimarySubscriptionItem({ items });

  if (!primaryItem || primaryItem.purchaseType !== "subscription") {
    return null;
  }

  const cadence = getCadenceDetails({
    planId: primaryItem.planId,
    deliveryLabel:
      primaryItem.deliveryLabel ||
      primaryItem.deliveryCadence ||
      overrides.deliveryCadence,
    intervalCount: primaryItem.billingIntervalCount || overrides.intervalCount,
    intervalUnit: primaryItem.billingIntervalUnit || overrides.intervalUnit || "month",
  });
  const nextDelivery =
    overrides.nextDelivery ||
    overrides.currentPeriodEnd ||
    addIntervalToDate(referenceDate, cadence.intervalCount, cadence.intervalUnit);

  return {
    status: normalizeSubscriptionStatus(overrides.status) || "pending",
    planName:
      overrides.planName ||
      `${primaryItem.name}${primaryItem.planLabel ? ` - ${primaryItem.planLabel}` : ""}`,
    deliveryCadence:
      overrides.deliveryCadence ||
      primaryItem.deliveryCadence ||
      cadence.cadenceLabel,
    nextDelivery: nextDelivery || null,
    productId: primaryItem.productId || null,
    productName: primaryItem.name || "",
    planId: primaryItem.planId || null,
    planLabel: primaryItem.planLabel || "",
    intervalUnit: cadence.intervalUnit,
    intervalCount: cadence.intervalCount,
    stripeCustomerId: overrides.stripeCustomerId || null,
    stripeSubscriptionId: overrides.stripeSubscriptionId || null,
    currentPeriodEnd: overrides.currentPeriodEnd || nextDelivery || null,
    cancelAtPeriodEnd: Boolean(overrides.cancelAtPeriodEnd),
    sourceOrderId: overrides.sourceOrderId || null,
    sourceOrderNumber: overrides.sourceOrderNumber || null,
    lastInvoiceId: overrides.lastInvoiceId || null,
  };
};

const applySubscriptionSnapshotToOrder = (order, overrides = {}) => {
  if (String(order.subscriptionType || "").toLowerCase() !== "subscription") {
    order.subscription = null;
    return null;
  }

  order.subscription = buildSubscriptionSnapshotFromItems(
    order.items,
    {
      ...(order.subscription || {}),
      ...overrides,
      sourceOrderId: order.id,
      sourceOrderNumber: order.orderNumber,
    },
    order.createdAt || new Date().toISOString()
  );

  if (order.subscription?.nextDelivery) {
    order.deliveryDueAt = order.subscription.nextDelivery;
  }

  return order.subscription;
};

const markOrderAsPaid = (order, paymentReference = "") => {
  order.paymentStatus = "paid";

  if (paymentReference) {
    order.paymentReference = paymentReference;
  }

  if (order.orderStatus !== "delivered" && order.orderStatus !== "shipped") {
    order.orderStatus = "processing";
  }

  if (!order.deliveryStatus || order.deliveryStatus === "queued") {
    order.deliveryStatus =
      order.subscriptionType === "subscription" ? "scheduled" : "queued";
  }

  order.updatedAt = new Date().toISOString();
};

const syncDatabaseUserSubscription = (database, userId) => {
  if (!userId) {
    return null;
  }

  syncUserSubscriptionState(database, userId);
  const user = database.users.find((candidate) => candidate.id === userId);
  return user ? sanitizeUser(user) : null;
};

const resolveOrderDeliveryAddress = (order, fallbackAddress = null) => {
  const normalizedOrderAddress = normalizeDeliveryAddress(order?.deliveryAddress);

  if (hasCompleteDeliveryAddress(normalizedOrderAddress)) {
    return normalizedOrderAddress;
  }

  const normalizedFallbackAddress = normalizeDeliveryAddress(fallbackAddress);

  if (hasCompleteDeliveryAddress(normalizedFallbackAddress)) {
    return normalizedFallbackAddress;
  }

  return normalizedOrderAddress;
};

const getOrderSubtotalAmount = (order) => {
  const savedSubtotal = toSafeNumber(order?.pricing?.subtotalAmount);

  if (savedSubtotal > 0) {
    return savedSubtotal;
  }

  return Array.isArray(order?.items)
    ? order.items.reduce((runningTotal, item) => {
        const lineTotal =
          toSafeNumber(item?.lineTotal) ||
          toSafeNumber(item?.unitPrice) * Math.max(1, Number(item?.quantity || 1));
        return runningTotal + lineTotal;
      }, 0)
    : 0;
};

const getOrderShippingAmount = (order) => {
  return toSafeNumber(order?.pricing?.shippingAmount);
};

const buildOrderBill = (order, deliveryAddress) => {
  const subtotalAmount = Number(getOrderSubtotalAmount(order).toFixed(2));
  const shippingAmount = Number(getOrderShippingAmount(order).toFixed(2));
  const totalAmount = Number(
    (toSafeNumber(order?.totalAmount) || subtotalAmount + shippingAmount).toFixed(2)
  );

  return {
    type:
      String(order?.subscriptionType || "").toLowerCase() === "subscription"
        ? "Subscription bill"
        : "One-time order bill",
    itemCount: Array.isArray(order?.items)
      ? order.items.reduce(
          (runningTotal, item) => runningTotal + Math.max(1, Number(item?.quantity || 1)),
          0
        )
      : 0,
    subtotalAmount,
    shippingAmount,
    totalAmount,
    currency: String(order?.currency || STORE_CURRENCY).toUpperCase(),
    billedTo: {
      name: order?.customerName || "",
      email: order?.customerEmail || "",
      phone: deliveryAddress?.phone || order?.customerPhone || "",
    },
    deliveryAddress,
    generatedAt: order?.updatedAt || order?.createdAt || new Date().toISOString(),
  };
};

const findLatestOrderBySubscriptionId = (orders, subscriptionId) => {
  return [...orders]
    .filter(
      (order) => order.subscription?.stripeSubscriptionId === subscriptionId
    )
    .sort((firstOrder, secondOrder) => {
      return (
        (getTimeValue(secondOrder.updatedAt) || 0) -
        (getTimeValue(firstOrder.updatedAt) || 0)
      );
    })[0];
};

const createRenewalOrderFromInvoice = ({
  sourceOrder,
  invoice,
  subscription,
}) => {
  const createdAt =
    toIsoFromUnixSeconds(invoice.status_transitions?.paid_at) ||
    toIsoFromUnixSeconds(invoice.created) ||
    new Date().toISOString();
  const totalAmount =
    toCurrencyAmountFromMinorUnits(invoice.amount_paid || invoice.amount_due) ||
    toSafeNumber(sourceOrder.totalAmount);
  const items = Array.isArray(sourceOrder.items)
    ? sourceOrder.items.map((item) => ({
        ...item,
        lineTotal: Number((toSafeNumber(item.unitPrice) * Number(item.quantity || 1)).toFixed(2)),
      }))
    : [];
  const order = {
    id: randomUUID(),
    orderNumber: createOrderNumber(),
    userId: sourceOrder.userId || null,
    customerName: sourceOrder.customerName,
    customerEmail: sourceOrder.customerEmail,
    customerPhone:
      sourceOrder.customerPhone ||
      normalizeDeliveryAddress(sourceOrder.deliveryAddress).phone ||
      "",
    currency: String(invoice.currency || sourceOrder.currency || "USD").toUpperCase(),
    totalAmount,
    paymentMode: "card",
    paymentStatus: "paid",
    paymentReference: invoice.payment_intent || invoice.id,
    orderStatus: "processing",
    subscriptionType: "subscription",
    deliveryStatus: "scheduled",
    deliveryDueAt: null,
    deliveryAddress: resolveOrderDeliveryAddress(sourceOrder),
    items,
    subscription: null,
    pricing: {
      subtotalAmount: Number(getOrderSubtotalAmount(sourceOrder).toFixed(2)),
      shippingAmount: Number(getOrderShippingAmount(sourceOrder).toFixed(2)),
    },
    metadata: {
      renewalOfOrderId: sourceOrder.id,
      renewalOfOrderNumber: sourceOrder.orderNumber,
      sourceInvoiceId: invoice.id,
    },
    createdAt,
    updatedAt: createdAt,
  };

  applySubscriptionSnapshotToOrder(order, {
    status: subscription.status,
    stripeCustomerId: subscription.customer || sourceOrder.subscription?.stripeCustomerId || null,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd:
      toIsoFromUnixSeconds(subscription.current_period_end) ||
      sourceOrder.subscription?.currentPeriodEnd ||
      null,
    nextDelivery:
      toIsoFromUnixSeconds(subscription.current_period_end) ||
      sourceOrder.subscription?.nextDelivery ||
      null,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    lastInvoiceId: invoice.id,
  });

  return order;
};

const summarizeOrder = (order, { fallbackAddress = null } = {}) => {
  const deliveryAddress = resolveOrderDeliveryAddress(order, fallbackAddress);

  return {
    ...order,
    customerPhone: order.customerPhone || deliveryAddress.phone || "",
    deliveryAddress,
    pricing: {
      ...(order.pricing || {}),
      subtotalAmount: Number(getOrderSubtotalAmount(order).toFixed(2)),
      shippingAmount: Number(getOrderShippingAmount(order).toFixed(2)),
    },
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          productId: item.productId || "",
          name: item.name,
          quantity: item.quantity,
          unitPrice: toSafeNumber(item.unitPrice),
          lineTotal: toSafeNumber(item.lineTotal),
          purchaseType: item.purchaseType || "one-time",
          planId: item.planId || "",
          planLabel: item.planLabel || "",
          deliveryLabel: item.deliveryLabel || "",
          deliveryCadence: item.deliveryCadence || "",
          billingIntervalUnit: item.billingIntervalUnit || "",
          billingIntervalCount: Number(item.billingIntervalCount || 0),
          sizeId: item.sizeId || "",
          sizeLabel: item.sizeLabel || "",
          sizeWeight: item.sizeWeight || "",
        }))
      : [],
    subscription: order.subscription
      ? {
          ...order.subscription,
          intervalCount: Number(order.subscription.intervalCount || 0),
        }
      : null,
    bill: buildOrderBill(order, deliveryAddress),
  };
};

const summarizeOrderForDatabase = (database, order) => {
  const fallbackAddress =
    database?.users?.find((candidate) => candidate.id === order?.userId)?.deliveryAddress ||
    null;

  return summarizeOrder(order, { fallbackAddress });
};

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

const applyStripeCheckoutSessionToOrder = async ({
  database,
  order,
  session,
  stripeSecretKey,
}) => {
  const subscription =
    typeof session.subscription === "string"
      ? await retrieveStripeSubscription({
          secretKey: stripeSecretKey,
          subscriptionId: session.subscription,
        })
      : session.subscription || null;
  const sessionPaymentReference =
    session.payment_intent?.id || session.payment_intent || session.id;

  order.paymentMode = "card";
  order.paymentReference = sessionPaymentReference;
  order.updatedAt = new Date().toISOString();

  if (String(order.subscriptionType || "").toLowerCase() === "subscription") {
    applySubscriptionSnapshotToOrder(order, {
      status:
        subscription?.status ||
        (String(session.payment_status || "").toLowerCase() === "paid"
          ? "active"
          : "pending"),
      stripeCustomerId: session.customer || subscription?.customer || null,
      stripeSubscriptionId:
        subscription?.id ||
        (typeof session.subscription === "string" ? session.subscription : null),
      currentPeriodEnd: toIsoFromUnixSeconds(subscription?.current_period_end),
      nextDelivery: toIsoFromUnixSeconds(subscription?.current_period_end),
      cancelAtPeriodEnd: Boolean(subscription?.cancel_at_period_end),
      lastInvoiceId: subscription?.latest_invoice?.id || null,
    });

    if (
      ACTIVE_SUBSCRIPTION_STATUSES.includes(
        normalizeSubscriptionStatus(order.subscription?.status)
      )
    ) {
      markOrderAsPaid(order, sessionPaymentReference);
    }
  } else if (String(session.payment_status || "").toLowerCase() === "paid") {
    markOrderAsPaid(order, sessionPaymentReference);
  }

  const user = syncDatabaseUserSubscription(database, order.userId);

  return {
    order,
    user,
    subscription,
  };
};

const applyStripeSubscriptionToMatchingOrders = ({
  database,
  subscription,
}) => {
  const matchingOrders = database.orders.filter(
    (order) => order.subscription?.stripeSubscriptionId === subscription.id
  );

  matchingOrders.forEach((order) => {
    applySubscriptionSnapshotToOrder(order, {
      status: subscription.status,
      stripeCustomerId: subscription.customer || null,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: toIsoFromUnixSeconds(subscription.current_period_end),
      nextDelivery: toIsoFromUnixSeconds(subscription.current_period_end),
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      lastInvoiceId:
        subscription.latest_invoice?.id || order.subscription?.lastInvoiceId || null,
    });
    order.updatedAt = new Date().toISOString();
  });

  const latestOrder = matchingOrders[0] || null;
  const user = latestOrder
    ? syncDatabaseUserSubscription(database, latestOrder.userId)
    : null;

  return {
    matchingOrders,
    user,
  };
};

const handleStripeInvoicePaid = async ({
  database,
  invoice,
  stripeSecretKey,
}) => {
  const subscriptionId = String(invoice.subscription || "").trim();

  if (!subscriptionId) {
    return null;
  }

  const subscription = await retrieveStripeSubscription({
    secretKey: stripeSecretKey,
    subscriptionId,
  });
  let sourceOrder =
    findLatestOrderBySubscriptionId(database.orders, subscription.id) || null;

  if (!sourceOrder) {
    const metadataOrderId =
      invoice.parent?.subscription_details?.metadata?.localOrderId ||
      invoice.subscription_details?.metadata?.localOrderId ||
      "";

    if (metadataOrderId) {
      sourceOrder =
        database.orders.find((order) => order.id === metadataOrderId) || null;
    }
  }

  if (!sourceOrder) {
    return null;
  }

  const existingInvoiceOrder = database.orders.find(
    (order) =>
      order.subscription?.lastInvoiceId === invoice.id ||
      order.metadata?.sourceInvoiceId === invoice.id
  );
  const billingReason = String(invoice.billing_reason || "").toLowerCase();
  let affectedOrder = sourceOrder;

  if (
    billingReason === "subscription_cycle" &&
    !existingInvoiceOrder
  ) {
    affectedOrder = createRenewalOrderFromInvoice({
      sourceOrder,
      invoice,
      subscription,
    });
    database.orders.unshift(affectedOrder);
  } else if (existingInvoiceOrder) {
    affectedOrder = existingInvoiceOrder;
    applySubscriptionSnapshotToOrder(affectedOrder, {
      status: subscription.status,
      stripeCustomerId: subscription.customer || null,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: toIsoFromUnixSeconds(subscription.current_period_end),
      nextDelivery: toIsoFromUnixSeconds(subscription.current_period_end),
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      lastInvoiceId: invoice.id,
    });
    markOrderAsPaid(
      affectedOrder,
      invoice.payment_intent || invoice.id || affectedOrder.paymentReference
    );
  } else {
    applySubscriptionSnapshotToOrder(sourceOrder, {
      status: subscription.status,
      stripeCustomerId: subscription.customer || null,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: toIsoFromUnixSeconds(subscription.current_period_end),
      nextDelivery: toIsoFromUnixSeconds(subscription.current_period_end),
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      lastInvoiceId: invoice.id,
    });
    markOrderAsPaid(
      sourceOrder,
      invoice.payment_intent || invoice.id || sourceOrder.paymentReference
    );
  }

  const user = syncDatabaseUserSubscription(database, affectedOrder.userId);

  return {
    order: affectedOrder,
    user,
  };
};

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (configuredOrigins.includes(origin)) {
    return true;
  }

  if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return true;
  }

  return false;
};

app.use(createRequestLogger());
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.post(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(async (req, res) => {
    if (PAYMENT_PROVIDER !== "stripe") {
      return res.status(410).json({
        message:
          "Stripe checkout has been retired for PetPlus. Use the Razorpay payment flow instead.",
      });
    }

    const { secretKey, webhookSecret } = getStripeConfig();

    if (!secretKey || !webhookSecret) {
      return res.status(503).json({
        message:
          "Stripe webhook handling is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
      });
    }

    const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : "";
    const signatureHeader = req.headers["stripe-signature"];

    if (
      !verifyStripeWebhookSignature({
        payload,
        signatureHeader,
        webhookSecret,
      })
    ) {
      return res.status(400).json({ message: "Stripe webhook signature is invalid." });
    }

    const event = JSON.parse(payload || "{}");
    const database = await readDatabase();

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data?.object || {};
      const localOrderId =
        session.metadata?.localOrderId || session.client_reference_id || "";
      const order = database.orders.find((candidate) => candidate.id === localOrderId);

      if (order) {
        await applyStripeCheckoutSessionToOrder({
          database,
          order,
          session,
          stripeSecretKey: secretKey,
        });
      }
    }

    if (event.type === "invoice.paid") {
      await handleStripeInvoicePaid({
        database,
        invoice: event.data?.object || {},
        stripeSecretKey: secretKey,
      });
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      applyStripeSubscriptionToMatchingOrders({
        database,
        subscription: event.data?.object || {},
      });
    }

    await writeDatabase(database);

    return res.json({ received: true });
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiLimiter);
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "PetPlus API is healthy.",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", createAuthRouter());

app.post(
  "/api/ai/dog-health-assistant",
  asyncHandler(async (req, res) => {
    const description = sanitizeTextInput(req.body?.description, {
      fieldLabel: "Dog problem description",
      required: true,
      minimumLength: 18,
      maximumLength: 2200,
    });

    const guidance = await buildDogHealthAssistantReply({
      description,
    });

    return res.json(guidance);
  })
);

app.post(
  "/api/payments/create-order",
  requireAuth,
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
        quantity: Math.max(1, Math.round(Number(item?.quantity || 1))),
        purchaseType: item?.purchaseType === "subscription" ? "subscription" : "one-time",
        planId: String(item?.planId || "").trim(),
        planLabel: String(item?.planLabel || "").trim(),
        deliveryLabel: String(item?.deliveryLabel || "").trim(),
        deliveryCadence: String(item?.deliveryCadence || "").trim(),
        billingIntervalUnit: String(item?.billingIntervalUnit || "").trim() || "month",
        billingIntervalCount: Math.max(1, Math.round(Number(item?.billingIntervalCount || 1))),
        sizeId: String(item?.sizeId || "").trim(),
        sizeLabel: String(item?.sizeLabel || "").trim(),
        sizeWeight: String(item?.sizeWeight || "").trim(),
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

    const rawDeliveryAddress = hasSubmittedAddressFields(req.body.deliveryAddress)
      ? req.body.deliveryAddress
      : req.user?.deliveryAddress;
    const deliveryAddress = sanitizeDeliveryAddressInput(rawDeliveryAddress, {
      required: true,
    });

    const { keyId, keySecret, isConfigured } = getRazorpayConfig();

    if (!isConfigured) {
      return res.status(503).json({
        message:
          "Razorpay is not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.",
      });
    }

    const localOrderId = randomUUID();
    const localOrderNumber = createOrderNumber();
    const email = normalizeEmail(req.body.email || "");
    const itemSubtotal = items.reduce(
      (runningTotal, item) => runningTotal + item.unitPrice * item.quantity,
      0
    );
    const shippingAmount = calculateShipping(itemSubtotal);
    const totalAmount = Number((itemSubtotal + shippingAmount).toFixed(2));
    const customerName =
      req.user?.name ||
      (typeof req.body.customerName === "string" ? req.body.customerName.trim() : "") ||
      deliveryAddress.fullName ||
      "Guest customer";
    const customerEmail = email || req.user?.email || "";
    const customerPhone = deliveryAddress.phone || req.user?.phone || "";
    const subscriptionType = items.some((item) => item.purchaseType === "subscription")
      ? "subscription"
      : "one-time";
    const now = new Date().toISOString();
    const normalizedOrderItems = items.map((item) => ({
      productId:
        resolveCatalogProductFromOrderItem(item)?.productId || item.productId || "",
      name: item.name,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice.toFixed(2)),
      lineTotal: Number((item.unitPrice * item.quantity).toFixed(2)),
      purchaseType: item.purchaseType,
      planId: item.planId,
      planLabel: item.planLabel,
      deliveryLabel: item.deliveryLabel,
      deliveryCadence:
        item.deliveryCadence ||
        getCadenceDetails({
          planId: item.planId,
          deliveryLabel: item.deliveryLabel,
          intervalCount: item.billingIntervalCount,
          intervalUnit: item.billingIntervalUnit,
        }).cadenceLabel,
      billingIntervalUnit: item.billingIntervalUnit,
      billingIntervalCount: item.billingIntervalCount,
      sizeId: item.sizeId,
      sizeLabel: item.sizeLabel,
      sizeWeight: item.sizeWeight,
    }));
    const pendingSubscriptionSnapshot =
      subscriptionType === "subscription"
        ? buildSubscriptionSnapshotFromItems(
            normalizedOrderItems,
            {
              status: "pending",
              sourceOrderId: localOrderId,
              sourceOrderNumber: localOrderNumber,
            },
            now
          )
        : null;
    const deliveryDueAt = pendingSubscriptionSnapshot?.nextDelivery || null;

    const gatewayOrder = await createRazorpayOrder({
      keyId,
      keySecret,
      amount: toMinorUnits(totalAmount),
      currency: STORE_CURRENCY,
      receipt: localOrderNumber,
      notes: {
        localOrderId,
        orderNumber: localOrderNumber,
        customerEmail,
        customerPhone,
        deliveryCity: deliveryAddress.city,
        deliveryPostalCode: deliveryAddress.postalCode,
        subscriptionType,
      },
    });

    const database = await readDatabase();
    const databaseUser = database.users.find((candidate) => candidate.id === req.user?.id);

    if (databaseUser) {
      databaseUser.deliveryAddress = deliveryAddress;
    }

    database.orders.unshift({
      id: localOrderId,
      orderNumber: localOrderNumber,
      userId: req.user?.id || null,
      customerName,
      customerEmail,
      customerPhone,
      currency: STORE_CURRENCY,
      totalAmount,
      paymentMode: "razorpay",
      paymentStatus: "pending",
      paymentReference: gatewayOrder.id,
      orderStatus: "placed",
      subscriptionType,
      deliveryStatus:
        subscriptionType === "subscription" ? "scheduled" : "queued",
      deliveryDueAt,
      deliveryAddress,
      items: normalizedOrderItems,
      subscription: pendingSubscriptionSnapshot,
      pricing: {
        subtotalAmount: Number(itemSubtotal.toFixed(2)),
        shippingAmount: Number(shippingAmount.toFixed(2)),
      },
      createdAt: now,
      updatedAt: now,
    });
    await writeDatabase(database);

    return res.status(201).json({
      orderId: localOrderId,
      orderNumber: localOrderNumber,
      gatewayOrderId: gatewayOrder.id,
      keyId,
      amount: gatewayOrder.amount,
      currency: gatewayOrder.currency || STORE_CURRENCY,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      subtotalAmount: Number(itemSubtotal.toFixed(2)),
      shippingAmount: Number(shippingAmount.toFixed(2)),
      totalAmount,
      paymentProvider: PAYMENT_PROVIDER,
      subscriptionType,
    });
  })
);

app.post(
  "/api/payments/razorpay/verify-payment",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { keyId, keySecret, isConfigured } = getRazorpayConfig();

    if (!isConfigured) {
      return res.status(503).json({
        message: "Razorpay payment confirmation is not configured yet.",
      });
    }

    const orderId = String(req.body.orderId || "").trim();
    const razorpayOrderId = String(req.body.razorpayOrderId || "").trim();
    const razorpayPaymentId = String(req.body.razorpayPaymentId || "").trim();
    const razorpaySignature = String(req.body.razorpaySignature || "").trim();

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        message: "Order ID and Razorpay payment details are required.",
      });
    }

    if (
      !verifyRazorpayPaymentSignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
        keySecret,
      })
    ) {
      return res.status(400).json({
        message: "Razorpay payment signature is invalid.",
      });
    }

    const database = await readDatabase();
    const order = database.orders.find((candidate) => candidate.id === orderId);

    if (!order) {
      return res.status(404).json({ message: "Order was not found." });
    }

    if (order.userId && req.user?.id && order.userId !== req.user.id) {
      return res.status(403).json({
        message: "You do not have access to confirm this order.",
      });
    }

    if (String(order.paymentStatus || "").toLowerCase() === "paid") {
      return res.json({
        message: "Payment was already confirmed for this order.",
        order: summarizeOrder(order),
        user: syncDatabaseUserSubscription(database, order.userId),
      });
    }

    if (order.paymentReference && order.paymentReference !== razorpayOrderId) {
      return res.status(400).json({
        message: "This Razorpay order does not belong to the requested order.",
      });
    }

    const payment = await fetchRazorpayPayment({
      keyId,
      keySecret,
      paymentId: razorpayPaymentId,
    });

    if (String(payment.order_id || "").trim() !== razorpayOrderId) {
      return res.status(400).json({
        message: "Razorpay payment does not match the expected order.",
      });
    }

    const normalizedPaymentStatus = String(payment.status || "").toLowerCase();

    if (
      normalizedPaymentStatus !== "captured" &&
      normalizedPaymentStatus !== "authorized"
    ) {
      return res.status(400).json({
        message: "Razorpay payment is not in a payable state yet.",
      });
    }

    if ((Number(payment.amount) || 0) !== toMinorUnits(order.totalAmount)) {
      return res.status(400).json({
        message: "Paid amount does not match the saved order total.",
      });
    }

    order.paymentMode = "razorpay";
    order.paymentReference = razorpayPaymentId;

    if (String(order.subscriptionType || "").toLowerCase() === "subscription") {
      applySubscriptionSnapshotToOrder(order, {
        status: "active",
        lastInvoiceId: razorpayPaymentId,
      });
    }

    markOrderAsPaid(order, razorpayPaymentId);
    const user = syncDatabaseUserSubscription(database, order.userId);
    await writeDatabase(database);

    return res.json({
      message:
        order.subscriptionType === "subscription"
          ? "Payment confirmed and your subscription plan is now active."
          : "Payment confirmed and your order is now processing.",
      order: summarizeOrder(order),
      user,
    });
  })
);

app.post(
  "/api/payments/create-checkout-session",
  optionalAuth,
  asyncHandler(async (req, res) => {
    if (PAYMENT_PROVIDER !== "stripe") {
      return res.status(410).json({
        message:
          "This legacy checkout endpoint has been retired. Use /api/payments/create-order for Razorpay checkout.",
      });
    }

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
        planId: String(item?.planId || "").trim(),
        planLabel: String(item?.planLabel || "").trim(),
        deliveryLabel: String(item?.deliveryLabel || "").trim(),
        deliveryCadence: String(item?.deliveryCadence || "").trim(),
        billingIntervalUnit: String(item?.billingIntervalUnit || "").trim() || "month",
        billingIntervalCount: Math.max(1, Math.round(Number(item?.billingIntervalCount || 1))),
        sizeId: String(item?.sizeId || "").trim(),
        sizeLabel: String(item?.sizeLabel || "").trim(),
        sizeWeight: String(item?.sizeWeight || "").trim(),
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

    const { secretKey: stripeSecretKey } = getStripeConfig();
    const upiVpa = (process.env.UPI_VPA || "9690296846@ptsbi").trim();
    const upiPayeeName = (process.env.UPI_PAYEE_NAME || "PetPlus").trim();
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
    const normalizedOrderItems = items.map((item) => ({
      productId:
        resolveCatalogProductFromOrderItem(item)?.productId || item.productId || "",
      name: item.name,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice.toFixed(2)),
      lineTotal: Number((item.unitPrice * item.quantity).toFixed(2)),
      purchaseType: item.purchaseType,
      planId: item.planId,
      planLabel: item.planLabel,
      deliveryLabel: item.deliveryLabel,
      deliveryCadence:
        item.deliveryCadence ||
        getCadenceDetails({
          planId: item.planId,
          deliveryLabel: item.deliveryLabel,
          intervalCount: item.billingIntervalCount,
          intervalUnit: item.billingIntervalUnit,
        }).cadenceLabel,
      billingIntervalUnit: item.billingIntervalUnit,
      billingIntervalCount: item.billingIntervalCount,
      sizeId: item.sizeId,
      sizeLabel: item.sizeLabel,
      sizeWeight: item.sizeWeight,
    }));
    const pendingSubscriptionSnapshot =
      subscriptionType === "subscription"
        ? buildSubscriptionSnapshotFromItems(
            normalizedOrderItems,
            {
              status: "pending",
              sourceOrderId: localOrderId,
              sourceOrderNumber: localOrderNumber,
            },
            now
          )
        : null;
    const deliveryDueAt =
      pendingSubscriptionSnapshot?.nextDelivery || null;

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
        subscription: pendingSubscriptionSnapshot,
        createdAt: now,
        updatedAt: now,
      });
      await writeDatabase(database);
    };

    if (subscriptionType === "subscription" && !stripeSecretKey) {
      return res.status(503).json({
        message:
          "Recurring subscriptions need Stripe billing. Add STRIPE_SECRET_KEY on the server to enable auto-renewal.",
      });
    }

    if (stripeSecretKey) {
      const successUrl = appendRawQueryParam(
        addQueryParam(successUrlBase, "orderId", localOrderId),
        "session_id",
        "{CHECKOUT_SESSION_ID}"
      );
      const session = await createStripeCheckoutSession({
        secretKey: stripeSecretKey,
        items: normalizedItems,
        email,
        successUrl,
        cancelUrl,
        orderId: localOrderId,
        orderNumber: localOrderNumber,
        userId: req.user?.id || "",
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
        subscriptionType,
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
        subscriptionType,
        message: "UPI payment link generated.",
      });
    }

    return res.status(503).json({
      message:
        "Payment gateway is not configured yet. Add Razorpay credentials on the server.",
    });
  })
);

app.post(
  "/api/payments/stripe/confirm-session",
  optionalAuth,
  asyncHandler(async (req, res) => {
    if (PAYMENT_PROVIDER !== "stripe") {
      return res.status(410).json({
        message:
          "Stripe confirmation has been retired for PetPlus. Razorpay payments are confirmed through /api/payments/razorpay/verify-payment.",
      });
    }

    const { secretKey: stripeSecretKey } = getStripeConfig();

    if (!stripeSecretKey) {
      return res.status(503).json({
        message: "Stripe checkout confirmation is not configured yet.",
      });
    }

    const orderId = String(req.body.orderId || "").trim();
    const sessionId = String(req.body.sessionId || "").trim();

    if (!orderId || !sessionId) {
      return res.status(400).json({
        message: "Order ID and session ID are required to confirm payment.",
      });
    }

    const database = await readDatabase();
    const order = database.orders.find((candidate) => candidate.id === orderId);

    if (!order) {
      return res.status(404).json({ message: "Order was not found." });
    }

    if (order.userId && req.user?.id && order.userId !== req.user.id) {
      return res.status(403).json({
        message: "You do not have access to confirm this order.",
      });
    }

    const session = await retrieveStripeCheckoutSession({
      secretKey: stripeSecretKey,
      sessionId,
    });
    const localOrderId =
      session.metadata?.localOrderId || session.client_reference_id || "";

    if (localOrderId !== order.id) {
      return res.status(400).json({
        message: "This Stripe session does not belong to the requested order.",
      });
    }

    const result = await applyStripeCheckoutSessionToOrder({
      database,
      order,
      session,
      stripeSecretKey,
    });

    await writeDatabase(database);

    return res.json({
      message:
        order.paymentStatus === "paid"
          ? order.subscriptionType === "subscription"
            ? "Subscription checkout confirmed and recurring billing is active."
            : "Payment confirmed and order is now processing."
          : "Checkout completed and Stripe confirmation is still syncing.",
      order: summarizeOrder(result.order),
      user: result.user,
    });
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
    const nextPhone = req.body.phone;
    const nextDogName = req.body.dogName;
    const nextCadence = req.body.deliveryCadence;
    const nextDeliveryAddress = req.body.deliveryAddress;
    const isManagedSubscription = Boolean(user.subscription?.sourceOrderId);
    let didPhoneChange = false;

    if (nextName) {
      user.name = sanitizeTextInput(nextName, {
        fieldLabel: "Full name",
        minimumLength: 2,
        maximumLength: 120,
      });
    }

    if (typeof nextPhone === "string") {
      const normalizedPhone = sanitizePhoneInput(nextPhone);
      didPhoneChange = normalizedPhone !== user.phone;

      if (didPhoneChange) {
        const existingPhoneOwner = database.users.find(
          (candidate) => candidate.id !== user.id && candidate.phone === normalizedPhone
        );

        if (existingPhoneOwner) {
          return res.status(409).json({
            message: "That mobile number is already linked to another account.",
          });
        }
      }

      user.phone = normalizedPhone;

      if (didPhoneChange && normalizedPhone) {
        user.phoneVerified = false;
      }
    }

    if (nextDogName) {
      user.subscription.dogProfile.name = sanitizeTextInput(nextDogName, {
        fieldLabel: "Dog name",
        minimumLength: 2,
        maximumLength: 80,
      });
    }

    if (nextCadence) {
      const normalizedCadence = sanitizeTextInput(nextCadence, {
        fieldLabel: "Delivery cadence",
        minimumLength: 3,
        maximumLength: 80,
      });

      if (
        isManagedSubscription &&
        normalizedCadence !== user.subscription.deliveryCadence
      ) {
        return res.status(400).json({
          message:
            "Delivery cadence for an active subscription is managed from billing and cannot be edited from the profile form yet.",
        });
      }

      user.subscription.deliveryCadence = normalizedCadence;
    }

    if (hasSubmittedAddressFields(nextDeliveryAddress)) {
      user.deliveryAddress = sanitizeDeliveryAddressInput(nextDeliveryAddress, {
        required: true,
      });
    }

    await writeDatabase(database);

    return res.json({
      user: sanitizeUser(user),
      subscription: user.subscription,
      message: didPhoneChange
        ? "Account details updated. Verify the new mobile number the next time you use OTP sign-in."
        : "Account details updated.",
    });
  })
);

app.post(
  "/api/orders/:orderId/status",
  requireAuth,
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

    if (
      nextStatus === "paid" &&
      ["card", "razorpay"].includes(String(order.paymentMode || "").toLowerCase())
    ) {
      return res.status(400).json({
        message: "Online payments are confirmed by the payment gateway, not from the browser.",
      });
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

    syncDatabaseUserSubscription(database, order.userId);

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
  supportLimiter,
  supportUpload.array("attachments", 5),
  asyncHandler(async (req, res) => {
    const name = sanitizeTextInput(req.body.name, {
      fieldLabel: "Name",
      required: true,
      minimumLength: 2,
      maximumLength: 120,
    });
    const email = sanitizeEmailInput(req.body.email);
    const subject = sanitizeTextInput(req.body.subject, {
      fieldLabel: "Subject",
      required: true,
      minimumLength: 4,
      maximumLength: 180,
    });
    const message = sanitizeTextInput(req.body.message, {
      fieldLabel: "Message",
      required: true,
      minimumLength: 20,
      maximumLength: 4000,
    });
    const attachments = await mapSupportRequestAttachments(req.files || []);

    const database = await readDatabase();
    const createdAt = new Date().toISOString();
    const supportRequest = {
      id: randomUUID(),
      userId: req.user?.id || null,
      team: sanitizeTextInput(req.body.team || "Customer Support", {
        fieldLabel: "Support team",
        minimumLength: 2,
        maximumLength: 80,
      }),
      teamEmail: req.body.teamEmail
        ? sanitizeEmailInput(req.body.teamEmail, "team email address")
        : "care@PetPlus.co.in",
      name,
      email,
      phone: sanitizePhoneInput(req.body.phone),
      orderNumber: sanitizeTextInput(req.body.orderNumber, {
        fieldLabel: "Order number",
        maximumLength: 60,
      }),
      dogName: sanitizeTextInput(req.body.dogName, {
        fieldLabel: "Dog name",
        maximumLength: 80,
      }),
      subject,
      category: sanitizeSupportChoice(req.body.category, allowedSupportCategories, "other"),
      priority: sanitizeSupportChoice(req.body.priority, allowedSupportPriorities, "standard"),
      preferredContact: sanitizeSupportChoice(
        req.body.preferredContact,
        allowedSupportContactMethods,
        "email"
      ),
      message,
      status: "new",
      attachments,
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
    const email = sanitizeEmailInput(req.body.email);
    const source = sanitizeTextInput(req.body.source || "footer", {
      fieldLabel: "Source",
      minimumLength: 2,
      maximumLength: 60,
    });

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
    const recommendationKey = sanitizeTextInput(req.body.recommendationKey, {
      fieldLabel: "Recommendation key",
      required: true,
      minimumLength: 2,
      maximumLength: 60,
    });
    const recommendationTitle = sanitizeTextInput(req.body.recommendationTitle, {
      fieldLabel: "Recommendation title",
      required: true,
      minimumLength: 2,
      maximumLength: 120,
    });
    const topFocuses = Array.isArray(req.body.topFocuses)
      ? req.body.topFocuses
          .slice(0, 3)
          .map((focus) =>
            sanitizeTextInput(focus, {
              fieldLabel: "Top focus",
              minimumLength: 2,
              maximumLength: 40,
            })
          )
      : [];
    const answers = Array.isArray(req.body.answers)
      ? req.body.answers.slice(0, 10).map((answer) => ({
          questionId: sanitizeTextInput(answer?.questionId, {
            fieldLabel: "Question identifier",
            minimumLength: 1,
            maximumLength: 60,
          }),
          title: sanitizeTextInput(answer?.title, {
            fieldLabel: "Answer title",
            minimumLength: 1,
            maximumLength: 140,
          }),
        }))
      : [];

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
    const title = sanitizeTextInput(req.body.title, {
      fieldLabel: "Review title",
      required: true,
      minimumLength: 4,
      maximumLength: 140,
    });
    const description = sanitizeTextInput(req.body.description, {
      fieldLabel: "Review description",
      required: true,
      minimumLength: 20,
      maximumLength: 2400,
    });
    const rating = Math.round(Number(req.body.rating || 0));

    if (!product) {
      return res.status(400).json({ message: "Please choose a valid purchased product." });
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please choose a rating between 1 and 5 stars." });
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
        sanitizeTextInput(req.body.customerProfile, {
          fieldLabel: "Customer profile",
          maximumLength: 120,
        }) ||
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
      latestOrders: orders.slice(0, 5).map((order) => summarizeOrderForDatabase(database, order)),
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
    const orders = sortByDateDescending(database.orders).map((order) =>
      summarizeOrderForDatabase(database, order)
    );
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

    const nextStatus = String(req.body.status || "").trim().toLowerCase();

    if (!["new", "in-review", "resolved"].includes(nextStatus)) {
      return res.status(400).json({
        message: "Support request status must be new, in-review, or resolved.",
      });
    }

    supportRequest.status = nextStatus;
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

app.use((error, req, res, next) => {
  void next;
  const requestId = req.requestId || randomUUID();

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Request body could not be read. Please check the submitted form data.",
      requestId,
    });
  }

  if (error?.message?.includes("not allowed by CORS")) {
    return res.status(403).json({
      message:
        "This frontend origin is not allowed yet. Update CLIENT_ORIGIN or use localhost/127.0.0.1.",
      requestId,
    });
  }

  if (error?.name === "MulterError") {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Each attachment must be smaller than 8 MB.",
        requestId,
      });
    }

    return res.status(400).json({ message: error.message, requestId });
  }

  if (error?.statusCode) {
    logWarn("request.failed", {
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: error.statusCode,
      error,
    });

    return res.status(error.statusCode).json({
      message: error.message || "The request could not be completed.",
      requestId,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  logError("request.failed", {
    requestId,
    method: req.method,
    path: req.originalUrl || req.url,
    statusCode: 500,
    error,
  });
  return res.status(500).json({
    message: "Something unexpected happened on the server.",
    requestId,
    ...(error?.details ? { details: error.details } : {}),
  });
});

if (fs.existsSync(DIST_INDEX)) {
  Object.entries(SEO_REDIRECTS).forEach(([sourcePath, destinationPath]) => {
    app.get(sourcePath, (_req, res) => {
      return res.redirect(301, destinationPath);
    });
  });

  app.use(
    express.static(DIST_DIR, {
      setHeaders: (res, filePath) => {
        const relativeFilePath = path.relative(DIST_DIR, filePath).replace(/\\/g, "/");

        if (relativeFilePath.startsWith("assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }

        if (!relativeFilePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "public, max-age=2592000");
          return;
        }

        const routePath =
          relativeFilePath === "index.html"
            ? "/"
            : `/${relativeFilePath.replace(/\/index\.html$/, "")}`;
        const robotsDirective = getRobotsDirectiveForPath(routePath);

        if (String(robotsDirective || "").toLowerCase().startsWith("noindex")) {
          res.setHeader("X-Robots-Tag", robotsDirective);
        }
      },
    })
  );

  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    const canonicalPath = getCanonicalPath(req.path);
    const robotsDirective = getRobotsDirectiveForPath(req.path);
    const htmlPath = resolveStaticHtmlPath(canonicalPath);

    if (String(robotsDirective || "").toLowerCase().startsWith("noindex")) {
      res.set("X-Robots-Tag", robotsDirective);
    }

    if (isKnownRoute(canonicalPath) && fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }

    if (fs.existsSync(DIST_NOT_FOUND)) {
      return res.status(404).sendFile(DIST_NOT_FOUND);
    }

    return res.status(404).sendFile(DIST_INDEX);
  });
}

seedDatabase()
  .then((database) => {
    const adminCount = database.users.filter((user) => user.role === "admin").length;
    const { isConfigured: isRazorpayConfigured } = getRazorpayConfig();
    const uploadStorageMode = getUploadStorageMode();

    if (isProduction && adminCount === 0) {
      throw new Error(
        "No admin account is configured. Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD before deploying."
      );
    }

    if (isProduction && configuredOrigins.length === 0 && !fs.existsSync(DIST_INDEX)) {
      throw new Error(
        "CLIENT_ORIGIN must be configured in production when the frontend is hosted separately."
      );
    }

    if (isProduction && configuredOrigins.some((origin) => !origin.startsWith("https://"))) {
      logWarn("server.config.insecure_origin", {
        configuredOrigins,
      });
    }

    if (isProduction && !isRazorpayConfigured) {
      logWarn("server.config.razorpay_missing_credentials", {
        message:
          "Razorpay credentials are not configured. Checkout will stay unavailable until RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.",
      });
    }

    if (isProduction && uploadStorageMode === "disabled") {
      logWarn("server.config.upload_storage_disabled", {
        message:
          "Cloudinary is not configured, so support attachments are disabled in production until cloud storage is provided.",
      });
    }

    app.listen(PORT, () => {
      logInfo("server.started", {
        port: PORT,
        databaseTarget: DATABASE_TARGET,
        uploadsDirectory: UPLOADS_DIR,
        uploadStorageMode,
        configuredOrigins,
      });
    });
  })
  .catch((error) => {
    logError("server.start_failed", { error, port: PORT });
    process.exit(1);
  });
