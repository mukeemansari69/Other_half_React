const DELIVERY_ADDRESS_TYPES = new Set(["home", "work", "other"]);
const PHONE_PATTERN = /^\+?\d{7,15}$/;

export const createEmptyDeliveryAddress = () => ({
  addressType: "home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
});

export const normalizeDeliveryAddress = (value = {}) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return createEmptyDeliveryAddress();
  }

  const compactPhone = String(value.phone || "")
    .trim()
    .replace(/[()\-\s]/g, "");
  const normalizedAddressType = String(value.addressType || "")
    .trim()
    .toLowerCase();

  return {
    addressType: DELIVERY_ADDRESS_TYPES.has(normalizedAddressType)
      ? normalizedAddressType
      : "home",
    fullName: String(value.fullName || value.name || "").trim(),
    phone: compactPhone,
    line1: String(value.line1 || "").trim(),
    line2: String(value.line2 || "").trim(),
    landmark: String(value.landmark || "").trim(),
    city: String(value.city || "").trim(),
    state: String(value.state || "").trim(),
    postalCode: String(value.postalCode || value.zip || value.pincode || "")
      .trim()
      .toUpperCase(),
    country: String(value.country || "India").trim() || "India",
  };
};

export const hasDeliveryAddressInput = (value = {}) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return [
    "fullName",
    "phone",
    "line1",
    "line2",
    "landmark",
    "city",
    "state",
    "postalCode",
  ].some((fieldName) => String(value[fieldName] ?? "").trim());
};

export const isDeliveryAddressComplete = (value = {}) => {
  const address = normalizeDeliveryAddress(value);

  return Boolean(
    address.fullName &&
      PHONE_PATTERN.test(address.phone) &&
      address.line1 &&
      address.city &&
      address.state &&
      address.postalCode &&
      address.country
  );
};

export const validateDeliveryAddress = (value = {}) => {
  const address = normalizeDeliveryAddress(value);
  const errors = {};

  if (!address.fullName) {
    errors.fullName = "Recipient name is required.";
  } else if (address.fullName.length < 2) {
    errors.fullName = "Recipient name should be at least 2 characters.";
  }

  if (!address.phone) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_PATTERN.test(address.phone)) {
    errors.phone = "Enter a valid phone number with country code if needed.";
  }

  if (!address.line1) {
    errors.line1 = "Address line 1 is required.";
  } else if (address.line1.length < 5) {
    errors.line1 = "Address line 1 should be at least 5 characters.";
  }

  if (!address.city) {
    errors.city = "City is required.";
  }

  if (!address.state) {
    errors.state = "State is required.";
  }

  if (!address.postalCode) {
    errors.postalCode = "Postal code is required.";
  } else if (address.postalCode.length < 4) {
    errors.postalCode = "Postal code should be at least 4 characters.";
  }

  if (!address.country) {
    errors.country = "Country is required.";
  }

  return errors;
};

export const getDeliveryAddressTypeLabel = (value = "home") => {
  switch (String(value || "").trim().toLowerCase()) {
    case "work":
      return "Work";
    case "other":
      return "Other";
    case "home":
    default:
      return "Home";
  }
};

export const formatDeliveryAddressLines = (value = {}) => {
  const address = normalizeDeliveryAddress(value);

  return [
    address.fullName,
    [address.line1, address.line2].filter(Boolean).join(", "),
    address.landmark ? `Landmark: ${address.landmark}` : "",
    [address.city, address.state, address.postalCode].filter(Boolean).join(", "),
    address.country,
    address.phone ? `Phone: ${address.phone}` : "",
  ].filter(Boolean);
};

export const formatDeliveryAddressInline = (value = {}) =>
  formatDeliveryAddressLines(value).join(" • ");
