import "../loadEnv.js";
import fs from "node:fs/promises";
import path from "node:path";

import { UPLOADS_DIR } from "./database.js";

const emailPattern = /\S+@\S+\.\S+/;
const resendApiUrl = "https://api.resend.com/emails";

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();
const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const extractEmailAddress = (value = "") => {
  const trimmedValue = String(value).trim();
  const angleMatch = trimmedValue.match(/<([^<>]+)>/);

  return normalizeEmail(angleMatch?.[1] || trimmedValue);
};

const getMailConfig = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.MAIL_FROM?.trim() ||
    "PetPlus <no-reply@petplus.co.in>";
  const supportNotificationEmail =
    process.env.SUPPORT_NOTIFICATION_EMAIL?.trim() ||
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    "admin@petplus.co.in";
  const fromAddress = extractEmailAddress(from);

  return {
    provider: "resend",
    apiKey,
    from,
    fromAddress,
    supportNotificationEmail,
    isConfigured: Boolean(
      apiKey && emailPattern.test(fromAddress) && emailPattern.test(supportNotificationEmail)
    ),
  };
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

const buildMailAttachments = async (supportRequest) => {
  const localAttachments = (supportRequest.attachments || []).filter(
    (attachment) => attachment?.fileName && attachment.storage !== "cloudinary"
  );

  const encodedAttachments = await Promise.all(
    localAttachments.map(async (attachment) => {
      const content = await fs.readFile(path.join(UPLOADS_DIR, attachment.fileName));

      return {
        filename: attachment.originalName,
        content: content.toString("base64"),
        content_type: attachment.mimetype || undefined,
      };
    })
  );

  return encodedAttachments.filter(Boolean);
};

const sendResendEmail = async ({ to, cc, subject, text, html, replyTo, attachments }) => {
  const config = getMailConfig();

  if (!config.isConfigured) {
    return {
      delivered: false,
      skipped: true,
      reason:
        "Resend email delivery is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL in the server environment.",
      recipients: [to, ...(Array.isArray(cc) ? cc : [])].filter(Boolean),
      messageId: null,
    };
  }

  const response = await fetch(resendApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: Array.isArray(to) ? to : [to],
      cc: Array.isArray(cc) && cc.length > 0 ? cc : undefined,
      reply_to: replyTo,
      subject,
      text,
      html,
      attachments: Array.isArray(attachments) && attachments.length > 0 ? attachments : undefined,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.message || payload?.error || "Resend rejected the email request.";
    throw new Error(`Resend email delivery failed: ${message}`);
  }

  return {
    delivered: true,
    skipped: false,
    reason: "",
    recipients: [to, ...(Array.isArray(cc) ? cc : [])].flat().filter(Boolean),
    messageId: payload?.id || null,
  };
};

const sendSupportRequestEmail = async (supportRequest) => {
  const recipients = buildRecipientList(supportRequest);

  return sendResendEmail({
    to: recipients.to,
    cc: recipients.cc.length > 0 ? recipients.cc : undefined,
    replyTo: emailPattern.test(supportRequest.email) ? supportRequest.email : undefined,
    subject: `Contact request: ${supportRequest.subject}`,
    text: buildSupportRequestText(supportRequest),
    html: buildSupportRequestHtml(supportRequest),
    attachments: await buildMailAttachments(supportRequest),
  });
};

const sendMailMessage = async ({ to, subject, text, html, replyTo }) => {
  return sendResendEmail({
    to,
    subject,
    text,
    html,
    replyTo,
  });
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
