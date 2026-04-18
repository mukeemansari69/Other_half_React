import "../loadEnv.js";
import path from "node:path";

import nodemailer from "nodemailer";

import { UPLOADS_DIR } from "./database.js";

const emailPattern = /\S+@\S+\.\S+/;

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();
const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const toBoolean = (value, fallback = false) => {
  if (value === undefined) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
};

const getMailConfig = () => {
  const host = process.env.SMTP_HOST?.trim() || "";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim() || process.env.EMAIL_USER?.trim() || "";
  const pass = process.env.SMTP_PASS?.trim() || process.env.EMAIL_PASS?.trim() || "";
  const from = process.env.MAIL_FROM?.trim() || user || "no-reply@PetPlus.co.in";
  const supportNotificationEmail =
    process.env.SUPPORT_NOTIFICATION_EMAIL?.trim() ||
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    "admin@PetPlus.co.in";
  const secure = toBoolean(process.env.SMTP_SECURE, port === 465);

  return {
    host,
    port,
    user,
    pass,
    from,
    secure,
    supportNotificationEmail,
    isConfigured: Boolean(host && port && user && pass && emailPattern.test(supportNotificationEmail)),
  };
};

let cachedTransporter = null;
let cachedTransportKey = "";

const getTransporter = () => {
  const config = getMailConfig();

  if (!config.isConfigured) {
    return null;
  }

  const nextTransportKey = JSON.stringify({
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.user,
    from: config.from,
    supportNotificationEmail: config.supportNotificationEmail,
  });

  if (!cachedTransporter || cachedTransportKey !== nextTransportKey) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
    cachedTransportKey = nextTransportKey;
  }

  return cachedTransporter;
};

const buildRecipientList = (supportRequest) => {
  const config = getMailConfig();
  const primaryRecipient = normalizeEmail(config.supportNotificationEmail);
  const ccRecipients = [supportRequest.teamEmail]
    .map((email) => normalizeEmail(email))
    .filter((email) => emailPattern.test(email) && email !== primaryRecipient);

  return {
    to: primaryRecipient,
    cc: ccRecipients,
  };
};

const buildSupportRequestText = (supportRequest) => {
  const attachmentLines =
    Array.isArray(supportRequest.attachments) && supportRequest.attachments.length > 0
      ? supportRequest.attachments
          .map(
            (attachment) =>
              `- ${attachment.originalName} (${Math.max(
                1,
                Math.round((Number(attachment.size) || 0) / 1024)
              )} KB)${attachment.url ? ` - ${attachment.url}` : ""}`
          )
          .join("\n")
      : "No attachments";

  return [
    "New support request submitted through the Contact Us page.",
    "",
    `Team: ${supportRequest.team}`,
    `Customer name: ${supportRequest.name}`,
    `Customer email: ${supportRequest.email}`,
    `Phone: ${supportRequest.phone || "Not provided"}`,
    `Order number: ${supportRequest.orderNumber || "Not provided"}`,
    `Dog name: ${supportRequest.dogName || "Not provided"}`,
    `Category: ${supportRequest.category}`,
    `Priority: ${supportRequest.priority}`,
    `Preferred contact: ${supportRequest.preferredContact}`,
    "",
    "Subject:",
    supportRequest.subject,
    "",
    "Message:",
    supportRequest.message,
    "",
    "Attachments:",
    attachmentLines,
  ].join("\n");
};

const buildSupportRequestHtml = (supportRequest) => {
  const rows = [
    ["Team", supportRequest.team],
    ["Customer name", supportRequest.name],
    ["Customer email", supportRequest.email],
    ["Phone", supportRequest.phone || "Not provided"],
    ["Order number", supportRequest.orderNumber || "Not provided"],
    ["Dog name", supportRequest.dogName || "Not provided"],
    ["Category", supportRequest.category],
    ["Priority", supportRequest.priority],
    ["Preferred contact", supportRequest.preferredContact],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:700;border-bottom:1px solid #e6dfcf;">${escapeHtml(
          label
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #e6dfcf;">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("");

  const attachments =
    Array.isArray(supportRequest.attachments) && supportRequest.attachments.length > 0
      ? `<ul style="margin:0;padding-left:18px;">${supportRequest.attachments
          .map(
            (attachment) => {
              const label = `${escapeHtml(attachment.originalName)} (${Math.max(
                1,
                Math.round((Number(attachment.size) || 0) / 1024)
              )} KB)`;

              if (!attachment.url) {
                return `<li>${label}</li>`;
              }

              return `<li><a href="${escapeHtml(attachment.url)}">${label}</a></li>`;
            }
          )
          .join("")}</ul>`
      : "<p style=\"margin:0;\">No attachments</p>";

  return `
    <div style="font-family:Poppins,Arial,sans-serif;color:#1a1a1a;">
      <h2 style="margin:0 0 16px;color:#0f4a12;">New support request</h2>
      <table style="width:100%;border-collapse:collapse;background:#fffdf7;border:1px solid #e6dfcf;border-radius:18px;overflow:hidden;">
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:20px;">
        <h3 style="margin:0 0 8px;color:#0f4a12;">Subject</h3>
        <p style="margin:0;">${escapeHtml(supportRequest.subject)}</p>
      </div>
      <div style="margin-top:20px;">
        <h3 style="margin:0 0 8px;color:#0f4a12;">Message</h3>
        <p style="margin:0;white-space:pre-line;">${escapeHtml(supportRequest.message)}</p>
      </div>
      <div style="margin-top:20px;">
        <h3 style="margin:0 0 8px;color:#0f4a12;">Attachments</h3>
        ${attachments}
      </div>
    </div>
  `;
};

const buildMailAttachments = (supportRequest) => {
  return (supportRequest.attachments || [])
    .map((attachment) => {
      if (!attachment?.fileName || attachment.storage === "cloudinary") {
        return null;
      }

      return {
        filename: attachment.originalName,
        path: path.join(UPLOADS_DIR, attachment.fileName),
        contentType: attachment.mimetype || undefined,
      };
    })
    .filter(Boolean);
};

const sendSupportRequestEmail = async (supportRequest) => {
  const transporter = getTransporter();
  const config = getMailConfig();

  if (!transporter || !config.isConfigured) {
    return {
      delivered: false,
      skipped: true,
      reason:
        "SMTP mail delivery is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in the server environment.",
      recipients: [],
      messageId: null,
    };
  }

  const recipients = buildRecipientList(supportRequest);
  const info = await transporter.sendMail({
    from: config.from,
    to: recipients.to,
    cc: recipients.cc.length > 0 ? recipients.cc : undefined,
    replyTo: emailPattern.test(supportRequest.email) ? supportRequest.email : undefined,
    subject: `Contact request: ${supportRequest.subject}`,
    text: buildSupportRequestText(supportRequest),
    html: buildSupportRequestHtml(supportRequest),
    attachments: buildMailAttachments(supportRequest),
  });

  return {
    delivered: true,
    skipped: false,
    reason: "",
    recipients: [recipients.to, ...recipients.cc],
    messageId: info.messageId || null,
  };
};

const sendMailMessage = async ({ to, subject, text, html, replyTo }) => {
  const transporter = getTransporter();
  const config = getMailConfig();

  if (!transporter || !config.isConfigured) {
    return {
      delivered: false,
      skipped: true,
      reason:
        "SMTP mail delivery is not configured yet. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in the server environment.",
      recipients: [to].filter(Boolean),
      messageId: null,
    };
  }

  const info = await transporter.sendMail({
    from: config.from,
    to,
    subject,
    text,
    html,
    replyTo,
  });

  return {
    delivered: true,
    skipped: false,
    reason: "",
    recipients: [to].filter(Boolean),
    messageId: info.messageId || null,
  };
};

const buildAuthEmailHtml = ({ eyebrow, title, intro, otp, actionUrl, actionLabel, expiresInMinutes }) => {
  const actionButton = actionUrl
    ? `
      <div style="margin:24px 0;">
        <a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:#0f4a12;color:#ffffff;padding:14px 24px;border-radius:999px;text-decoration:none;font-weight:700;">
          ${escapeHtml(actionLabel)}
        </a>
      </div>
    `
    : "";

  return `
    <div style="font-family:Poppins,Arial,sans-serif;color:#1a1a1a;background:#f8f6ef;padding:24px;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e6dfcf;border-radius:28px;padding:32px;">
        <p style="margin:0 0 12px;color:#0f4a12;font-size:12px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;">
          ${escapeHtml(eyebrow)}
        </p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#163b1d;">
          ${escapeHtml(title)}
        </h1>
        <p style="margin:0 0 20px;color:#4f4a3e;line-height:1.7;">
          ${escapeHtml(intro)}
        </p>
        <div style="margin:24px 0;padding:20px;border-radius:24px;background:#fbf8ef;border:1px solid #e6dfcf;">
          <p style="margin:0 0 8px;color:#6a6458;font-size:13px;text-transform:uppercase;letter-spacing:0.18em;">
            One-time code
          </p>
          <p style="margin:0;font-size:34px;letter-spacing:0.36em;font-weight:700;color:#163b1d;">
            ${escapeHtml(otp)}
          </p>
          <p style="margin:12px 0 0;color:#6a6458;line-height:1.6;">
            This code expires in ${expiresInMinutes} minutes.
          </p>
        </div>
        ${actionButton}
        <p style="margin:20px 0 0;color:#6a6458;line-height:1.7;">
          If you did not request this, you can ignore this email.
        </p>
      </div>
    </div>
  `;
};

const buildAuthEmailText = ({ title, intro, otp, actionUrl, expiresInMinutes }) => {
  return [
    title,
    "",
    intro,
    "",
    `OTP: ${otp}`,
    `This code expires in ${expiresInMinutes} minutes.`,
    actionUrl ? `Verification link: ${actionUrl}` : "",
    "",
    "If you did not request this, you can ignore this email.",
  ]
    .filter(Boolean)
    .join("\n");
};

const sendEmailVerificationEmail = async ({
  email,
  userName,
  otp,
  verificationUrl,
  expiresInMinutes,
}) => {
  const intro = `Hi ${userName || "there"}, confirm your email address to activate your PetPlus account.`;

  return sendMailMessage({
    to: email,
    subject: "Verify your PetPlus email address",
    text: buildAuthEmailText({
      title: "Verify your email address",
      intro,
      otp,
      actionUrl: verificationUrl,
      expiresInMinutes,
    }),
    html: buildAuthEmailHtml({
      eyebrow: "Email verification",
      title: "Activate your PetPlus account",
      intro,
      otp,
      actionUrl: verificationUrl,
      actionLabel: "Verify email",
      expiresInMinutes,
    }),
  });
};

const sendPasswordResetEmail = async ({
  email,
  userName,
  otp,
  resetUrl,
  expiresInMinutes,
}) => {
  const intro = `Hi ${userName || "there"}, use this code to reset the password for your PetPlus account.`;

  return sendMailMessage({
    to: email,
    subject: "Reset your PetPlus password",
    text: buildAuthEmailText({
      title: "Reset your password",
      intro,
      otp,
      actionUrl: resetUrl,
      expiresInMinutes,
    }),
    html: buildAuthEmailHtml({
      eyebrow: "Password reset",
      title: "Choose a new password",
      intro,
      otp,
      actionUrl: resetUrl,
      actionLabel: "Reset password",
      expiresInMinutes,
    }),
  });
};

export {
  getMailConfig,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendSupportRequestEmail,
};
