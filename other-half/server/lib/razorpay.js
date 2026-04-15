import "../loadEnv.js";
import crypto from "node:crypto";

const RAZORPAY_API_BASE_URL = "https://api.razorpay.com/v1";

export const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";

  return {
    keyId,
    keySecret,
    isConfigured: Boolean(keyId && keySecret),
  };
};

const createAuthHeader = ({ keyId, keySecret }) => {
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  return `Basic ${credentials}`;
};

const callRazorpayApi = async ({
  keyId,
  keySecret,
  method = "GET",
  path,
  body,
}) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${RAZORPAY_API_BASE_URL}${normalizedPath}`, {
    method,
    headers: {
      Authorization: createAuthHeader({ keyId, keySecret }),
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(
      payload?.error?.description ||
        payload?.error?.reason ||
        "Razorpay request could not be completed."
    );
    error.statusCode = 502;
    throw error;
  }

  return payload;
};

export const createRazorpayOrder = async ({
  keyId,
  keySecret,
  amount,
  currency,
  receipt,
  notes,
}) =>
  callRazorpayApi({
    keyId,
    keySecret,
    method: "POST",
    path: "/orders",
    body: {
      amount,
      currency,
      receipt,
      notes,
    },
  });

export const fetchRazorpayPayment = async ({ keyId, keySecret, paymentId }) =>
  callRazorpayApi({
    keyId,
    keySecret,
    method: "GET",
    path: `/payments/${paymentId}`,
  });

export const verifyRazorpayPaymentSignature = ({
  orderId,
  paymentId,
  signature,
  keySecret,
}) => {
  if (!orderId || !paymentId || !signature || !keySecret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature.length !== String(signature).length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(String(signature))
  );
};
