import "../loadEnv.js";

const toBoolean = (value, fallback = false) => {
  if (value === undefined) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
};

export const getSmsConfig = () => {
  const provider = String(process.env.SMS_PROVIDER || "twilio").trim().toLowerCase();
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim() || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim() || "";
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim() || "";
  const fromPhone = process.env.TWILIO_FROM_PHONE?.trim() || "";
  const enabled = toBoolean(process.env.SMS_ENABLED, true);

  if (provider !== "twilio") {
    return {
      provider,
      enabled,
      isConfigured: false,
      reason: "Only Twilio SMS delivery is wired in this project right now.",
    };
  }

  return {
    provider,
    enabled,
    accountSid,
    authToken,
    messagingServiceSid,
    fromPhone,
    isConfigured: Boolean(
      enabled &&
        accountSid &&
        authToken &&
        (messagingServiceSid || fromPhone)
    ),
    reason:
      "Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and either TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_PHONE to enable SMS delivery.",
  };
};

const buildOtpSmsBody = ({ code, purpose, expiresInMinutes }) => {
  const purposeCopy =
    purpose === "password-reset"
      ? "Reset your PetPlus password"
      : "Complete your PetPlus sign-in";

  return `${purposeCopy}. Your OTP is ${code}. It expires in ${expiresInMinutes} minutes.`;
};

export const sendOtpSms = async ({ phone, code, purpose, expiresInMinutes }) => {
  const config = getSmsConfig();

  if (!config.enabled || !config.isConfigured) {
    return {
      delivered: false,
      skipped: true,
      provider: config.provider,
      reason: config.reason,
      recipients: [phone].filter(Boolean),
      messageId: null,
    };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;
  const body = new URLSearchParams({
    To: phone,
    Body: buildOtpSmsBody({ code, purpose, expiresInMinutes }),
  });

  if (config.messagingServiceSid) {
    body.set("MessagingServiceSid", config.messagingServiceSid);
  } else if (config.fromPhone) {
    body.set("From", config.fromPhone);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${config.accountSid}:${config.authToken}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `SMS delivery failed with status ${response.status}: ${responseText || "No response body."}`
    );
  }

  const payload = await response.json();

  return {
    delivered: true,
    skipped: false,
    provider: config.provider,
    reason: "",
    recipients: [phone],
    messageId: payload.sid || null,
  };
};
