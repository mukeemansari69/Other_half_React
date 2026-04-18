const emailPattern = /\S+@\S+\.\S+/;
const phonePattern = /^\+?\d{7,15}$/;

export const PASSWORD_MIN_LENGTH = 8;

export const createHttpError = (message, statusCode = 400, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (details && typeof details === "object") {
    error.details = details;
  }

  return error;
};

export const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

export const normalizeTextValue = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const sanitizeTextInput = (
  value,
  { fieldLabel, required = false, minimumLength = 0, maximumLength = 500 } = {}
) => {
  const normalizedValue = String(value ?? "").trim();

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
  const trimmedValue = String(value ?? "").trim();

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

export const validatePassword = (password = "") => {
  return String(password).trim().length >= PASSWORD_MIN_LENGTH;
};

export { emailPattern, phonePattern };
