export const BRAND_NAME = "PetPlus";
export const BRAND_FULL_NAME = "PetPlus Pets";
export const STORE_COUNTRY = "India";
export const STORE_CURRENCY = "INR";
export const STORE_LOCALE = "en-IN";
export const PAYMENT_PROVIDER = "Razorpay";
export const MADE_IN_LABEL = "Made in India";
export const SHIPPING_THRESHOLD = 500;
export const FLAT_SHIPPING_RATE = 49;

const DEFAULT_USD_TO_INR_RATE = 93.29;

const getConfiguredUsdToInrRate = () => {
  const clientRate = Number(import.meta.env?.VITE_USD_TO_INR_RATE);

  if (Number.isFinite(clientRate) && clientRate > 0) {
    return clientRate;
  }

  if (typeof process !== "undefined") {
    const serverRate = Number(
      process.env?.USD_TO_INR_RATE || process.env?.VITE_USD_TO_INR_RATE
    );

    if (Number.isFinite(serverRate) && serverRate > 0) {
      return serverRate;
    }
  }

  return DEFAULT_USD_TO_INR_RATE;
};

export const USD_TO_INR_RATE = getConfiguredUsdToInrRate();

export const formatStoreCurrency = (
  value,
  {
    locale = STORE_LOCALE,
    currency = STORE_CURRENCY,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = {}
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Number(value) || 0);

export const convertLegacyUsdPrice = (value) =>
  Number(((Number(value) || 0) * USD_TO_INR_RATE).toFixed(2));

export const toMinorUnits = (value) => Math.round((Number(value) || 0) * 100);

export const calculateShipping = (subtotal) => {
  const safeSubtotal = Number(subtotal) || 0;

  if (safeSubtotal === 0 || safeSubtotal >= SHIPPING_THRESHOLD) {
    return 0;
  }

  return FLAT_SHIPPING_RATE;
};

export const getShippingRuleText = () =>
  `${formatStoreCurrency(FLAT_SHIPPING_RATE)} shipping below ${formatStoreCurrency(
    SHIPPING_THRESHOLD
  )}, free above that.`;

export const getFreeShippingText = () =>
  `Free shipping over ${formatStoreCurrency(SHIPPING_THRESHOLD)}`;

export const getDeliveryWindowText = () =>
  `Made in ${STORE_COUNTRY}. Delivered in 2 to 5 business days across ${STORE_COUNTRY}.`;
