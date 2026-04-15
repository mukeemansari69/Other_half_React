import "../loadEnv.js";
import path from "node:path";

import nodemailer from "nodemailer";

import { UPLOADS_DIR } from "./database.js";

const emailPattern = /\S+@\S+\.\S+/;

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

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
  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

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

export { getMailConfig, sendSupportRequestEmail };
