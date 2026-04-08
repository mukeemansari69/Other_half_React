import "../loadEnv.js";
import crypto from "node:crypto";

const STRIPE_API_BASE_URL = "https://api.stripe.com/v1";

const getStripeConfig = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim() || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || "";

  return {
    secretKey,
    webhookSecret,
    isConfigured: Boolean(secretKey),
  };
};

const toUrlSearchParams = (body = null) => {
  if (!body) {
    return null;
  }

  if (body instanceof URLSearchParams) {
    return body;
  }

  const params = new URLSearchParams();
  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    params.set(key, String(value));
  });
  return params;
};

const callStripeApi = async ({
  secretKey,
  method = "GET",
  path,
  body = null,
  query = null,
}) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const queryString = query instanceof URLSearchParams ? `?${query.toString()}` : "";
  const requestUrl = `${STRIPE_API_BASE_URL}${normalizedPath}${queryString}`;
  const requestBody = method === "GET" ? null : toUrlSearchParams(body);
  const response = await fetch(requestUrl, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(requestBody
        ? { "Content-Type": "application/x-www-form-urlencoded" }
        : {}),
    },
    body: requestBody,
  });
  const payload = await response.json();

  if (!response.ok) {
    const upstreamMessage =
      payload?.error?.message || "Stripe request could not be completed.";
    const error = new Error(upstreamMessage);
    error.statusCode = 502;
    throw error;
  }

  return payload;
};

const verifyStripeWebhookSignature = ({
  payload,
  signatureHeader,
  webhookSecret,
  toleranceSeconds = 300,
}) => {
  if (!signatureHeader || !webhookSecret) {
    return false;
  }

  const signatureParts = Object.fromEntries(
    String(signatureHeader)
      .split(",")
      .map((part) => part.split("=", 2))
      .filter(([key, value]) => key && value)
  );
  const timestamp = Number(signatureParts.t);
  const expectedSignature = signatureParts.v1;

  if (!Number.isFinite(timestamp) || !expectedSignature) {
    return false;
  }

  const ageInSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestamp);

  if (ageInSeconds > toleranceSeconds) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const computedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const computedBuffer = Buffer.from(computedSignature, "hex");

  if (expectedBuffer.length !== computedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, computedBuffer);
};

const createStripeCheckoutSession = async ({
  secretKey,
  items,
  email,
  successUrl,
  cancelUrl,
  orderId,
  orderNumber,
  userId,
}) => {
  const hasSubscriptionItems = items.some(
    (item) => item.purchaseType === "subscription"
  );
  const requestBody = new URLSearchParams();
  requestBody.set("mode", hasSubscriptionItems ? "subscription" : "payment");
  requestBody.set("success_url", successUrl);
  requestBody.set("cancel_url", cancelUrl);
  requestBody.set("payment_method_types[0]", "card");
  requestBody.set("client_reference_id", orderId);
  requestBody.set("metadata[localOrderId]", orderId);
  requestBody.set("metadata[orderNumber]", orderNumber);

  if (userId) {
    requestBody.set("metadata[userId]", userId);
  }

  if (hasSubscriptionItems) {
    requestBody.set("subscription_data[metadata][localOrderId]", orderId);
    requestBody.set("subscription_data[metadata][orderNumber]", orderNumber);

    if (userId) {
      requestBody.set("subscription_data[metadata][userId]", userId);
    }
  }

  if (email) {
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
    requestBody.set(
      `line_items[${index}][price_data][product_data][metadata][productId]`,
      item.productId || item.name
    );
    requestBody.set(
      `line_items[${index}][price_data][product_data][metadata][purchaseType]`,
      item.purchaseType
    );

    if (item.planId) {
      requestBody.set(
        `line_items[${index}][price_data][product_data][metadata][planId]`,
        item.planId
      );
    }

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

    if (item.purchaseType === "subscription") {
      requestBody.set(
        `line_items[${index}][price_data][recurring][interval]`,
        item.billingIntervalUnit || "month"
      );
      requestBody.set(
        `line_items[${index}][price_data][recurring][interval_count]`,
        String(item.billingIntervalCount || 1)
      );
    }
  });

  const payload = await callStripeApi({
    secretKey,
    method: "POST",
    path: "/checkout/sessions",
    body: requestBody,
  });

  return {
    sessionId: payload.id,
    url: payload.url,
    mode: payload.mode,
  };
};

const retrieveStripeCheckoutSession = async ({ secretKey, sessionId }) => {
  const query = new URLSearchParams();
  query.append("expand[]", "subscription");
  query.append("expand[]", "payment_intent");
  query.append("expand[]", "line_items");

  return callStripeApi({
    secretKey,
    method: "GET",
    path: `/checkout/sessions/${sessionId}`,
    query,
  });
};

const retrieveStripeSubscription = async ({ secretKey, subscriptionId }) => {
  const query = new URLSearchParams();
  query.append("expand[]", "latest_invoice");

  return callStripeApi({
    secretKey,
    method: "GET",
    path: `/subscriptions/${subscriptionId}`,
    query,
  });
};

export {
  createStripeCheckoutSession,
  getStripeConfig,
  retrieveStripeCheckoutSession,
  retrieveStripeSubscription,
  verifyStripeWebhookSignature,
};
