const emailPattern = /\S+@\S+\.\S+/;
const phonePattern = /^\+?\d{7,15}$/;
const allowedDeliveryAddressTypes = new Set(["home", "work", "other"]);

export const PASSWORD_MIN_LENGTH = 8;

export const createHttpError = (message, statusCode = 400, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (details && typeof details === "object") {
    error.details = details;
  }

  return error;
};

const toScalarString = (value, fieldLabel = "This field") => {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "object") {
    throw createHttpError(`${fieldLabel} format is invalid.`, 400);
  }

  return String(value);
};

export const normalizeEmail = (value = "") =>
  toScalarString(value, "Email address").trim().toLowerCase();

export const normalizeTextValue = (value = "") =>
  toScalarString(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

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

export const sanitizeTextInput = (
  value,
  { fieldLabel, required = false, minimumLength = 0, maximumLength = 500 } = {}
) => {
  const normalizedValue = toScalarString(value, fieldLabel || "This field").trim();

  if (!normalizedValue) {
    if (required) {
      throw createHttpError(`${fieldLabel} is required.`, 400);
    }

    return "";
  }

  if (minimumLength > 0 && normalizedValue.length < minimumLength) {
    throw createHttpError(
      `${fieldLabel} must be at least ${minimumLength} characters long.`,
      400
    );
  }

  return normalizedValue.slice(0, maximumLength);
};

export const sanitizeEmailInput = (value, fieldLabel = "Email address") => {
  const normalizedEmail = normalizeEmail(value);

  if (!emailPattern.test(normalizedEmail)) {
    throw createHttpError(`Please enter a valid ${fieldLabel.toLowerCase()}.`, 400);
  }

  return normalizedEmail;
};

export const normalizePhoneInput = (value = "") => {
  const trimmedValue = toScalarString(value, "Phone number").trim();

  if (!trimmedValue) {
    return "";
  }

  const compactValue = trimmedValue.replace(/[()\-\s]/g, "");

  if (!phonePattern.test(compactValue)) {
    throw createHttpError("Please enter a valid phone number.", 400);
  }

  return compactValue;
};

export const sanitizePhoneInput = (value) => {
  return normalizePhoneInput(value);
};

export const normalizeDeliveryAddress = (value = {}) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return createEmptyDeliveryAddress();
  }

  const baseAddress = createEmptyDeliveryAddress();
  const normalizedAddressType = normalizeTextValue(value.addressType || "");
  let normalizedPhone = "";

  try {
    normalizedPhone = normalizePhoneInput(value.phone || "");
  } catch {
    normalizedPhone = String(value.phone || "").trim().slice(0, 24);
  }

  return {
    addressType: allowedDeliveryAddressTypes.has(normalizedAddressType)
      ? normalizedAddressType
      : baseAddress.addressType,
    fullName: String(value.fullName || value.name || "").trim().slice(0, 120),
    phone: normalizedPhone,
    line1: String(value.line1 || "").trim().slice(0, 160),
    line2: String(value.line2 || "").trim().slice(0, 160),
    landmark: String(value.landmark || "").trim().slice(0, 120),
    city: String(value.city || "").trim().slice(0, 80),
    state: String(value.state || "").trim().slice(0, 80),
    postalCode: String(value.postalCode || value.zip || value.pincode || "")
      .trim()
      .slice(0, 20)
      .toUpperCase(),
    country: String(value.country || baseAddress.country).trim().slice(0, 80) || baseAddress.country,
  };
};

export const hasCompleteDeliveryAddress = (value = {}) => {
  const address = normalizeDeliveryAddress(value);

  return Boolean(
    address.fullName &&
      address.phone &&
      address.line1 &&
      address.city &&
      address.state &&
      address.postalCode &&
      address.country
  );
};

export const sanitizeDeliveryAddressInput = (value, { required = false } = {}) => {
  const hasProvidedValue =
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    [
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

  if (!hasProvidedValue) {
    if (required) {
      throw createHttpError("Delivery address is required.", 400);
    }

    return createEmptyDeliveryAddress();
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw createHttpError("Delivery address is required.", 400);
  }

  const normalizedAddressType = normalizeTextValue(value.addressType || "");
  const fullName = sanitizeTextInput(value.fullName || value.name, {
    fieldLabel: "Recipient name",
    required: true,
    minimumLength: 2,
    maximumLength: 120,
  });
  const phone = sanitizePhoneInput(value.phone || "");

  if (!phone) {
    throw createHttpError("Delivery phone number is required.", 400);
  }

  return {
    addressType: allowedDeliveryAddressTypes.has(normalizedAddressType)
      ? normalizedAddressType
      : "home",
    fullName,
    phone,
    line1: sanitizeTextInput(value.line1, {
      fieldLabel: "Address line 1",
      required: true,
      minimumLength: 5,
      maximumLength: 160,
    }),
    line2: sanitizeTextInput(value.line2, {
      fieldLabel: "Address line 2",
      maximumLength: 160,
    }),
    landmark: sanitizeTextInput(value.landmark, {
      fieldLabel: "Landmark",
      maximumLength: 120,
    }),
    city: sanitizeTextInput(value.city, {
      fieldLabel: "City",
      required: true,
      minimumLength: 2,
      maximumLength: 80,
    }),
    state: sanitizeTextInput(value.state, {
      fieldLabel: "State",
      required: true,
      minimumLength: 2,
      maximumLength: 80,
    }),
    postalCode: sanitizeTextInput(
      value.postalCode || value.zip || value.pincode,
      {
        fieldLabel: "Postal code",
        required: true,
        minimumLength: 4,
        maximumLength: 20,
      }
    ).toUpperCase(),
    country: sanitizeTextInput(value.country || "India", {
      fieldLabel: "Country",
      required: true,
      minimumLength: 2,
      maximumLength: 80,
    }),
  };
};

export const validatePassword = (password = "") => {
  return toScalarString(password, "Password").trim().length >= PASSWORD_MIN_LENGTH;
};

export const sanitizeNumericRecordInput = (
  value,
  {
    fieldLabel = "This field",
    maximumKeys = 20,
    minimumValue = -1000,
    maximumValue = 1000,
  } = {}
) => {
  if (value === undefined || value === null || value === "") {
    return {};
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw createHttpError(`${fieldLabel} format is invalid.`, 400);
  }

  const entries = Object.entries(value)
    .slice(0, maximumKeys)
    .flatMap(([rawKey, rawValue]) => {
      const key = toScalarString(rawKey, `${fieldLabel} key`).trim().slice(0, 60);
      const numericValue = Number(rawValue);

      if (!key || !Number.isFinite(numericValue)) {
        return [];
      }

      const safeValue = Math.min(maximumValue, Math.max(minimumValue, numericValue));
      return [[key, Number(safeValue.toFixed(4))]];
    });

  return Object.fromEntries(entries);
};

export { allowedDeliveryAddressTypes, emailPattern, phonePattern };
