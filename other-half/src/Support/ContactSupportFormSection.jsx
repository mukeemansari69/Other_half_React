import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CircleCheckBig,
  FileText,
  Image,
  Mail,
  Paperclip,
  RefreshCw,
  Send,
  ShieldAlert,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

const MAX_FILE_COUNT = 5;
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

const buildInitialFormState = (user = null) => ({
  team: "support",
  name: user?.name || "",
  email: user?.email || "",
  phone: user?.phone || "",
  orderNumber: "",
  dogName: user?.subscription?.dogProfile?.name || "",
  subject: "",
  category: "order-support",
  priority: "standard",
  preferredContact: "email",
  message: "",
  consent: false,
});

const teamOptions = [
  {
    id: "support",
    label: "Customer Support",
    email: "care@otherhalfpets.com",
    description: "Best for order questions, product guidance, and anything affecting your dog's routine.",
    icon: Mail,
  },
  {
    id: "subscription",
    label: "Subscription Team",
    email: "subscriptions@otherhalfpets.com",
    description: "Best for skips, pauses, billing changes, and keeping deliveries aligned with your dog's needs.",
    icon: RefreshCw,
  },
  {
    id: "admin",
    label: "Admin Escalations",
    email: "admin@otherhalfpets.com",
    description: "Best for urgent issues, repeated service problems, or requests that need faster review.",
    icon: ShieldAlert,
  },
  {
    id: "partnerships",
    label: "Partnerships",
    email: "partners@otherhalfpets.com",
    description: "Best for wholesale, media, affiliate, and business partnership requests.",
    icon: Building2,
  },
];

const categoryOptions = [
  { value: "order-support", label: "Order support" },
  { value: "subscription-help", label: "Subscription help" },
  { value: "refund-review", label: "Refund or replacement review" },
  { value: "product-question", label: "Product guidance" },
  { value: "delivery-issue", label: "Shipping or tracking issue" },
  { value: "account-help", label: "Account or login issue" },
  { value: "partnership-request", label: "Partnership request" },
  { value: "other", label: "Other" },
];

const priorityOptions = [
  { value: "standard", label: "Standard" },
  { value: "priority", label: "Priority" },
  { value: "urgent", label: "Urgent" },
];

const preferredContactOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Email or phone" },
];

const formatFileSize = (size) => {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const createMailtoUrl = ({ recipient, subject, formState, files }) => {
  const attachmentSummary =
    files.length > 0
      ? files.map((file) => `- ${file.name} (${formatFileSize(file.size)})`).join("\n")
      : "No attachments selected.";

  const bodyLines = [
    `Team: ${recipient}`,
    `Name: ${formState.name}`,
    `Email: ${formState.email}`,
    `Phone: ${formState.phone || "Not provided"}`,
    `Order Number: ${formState.orderNumber || "Not provided"}`,
    `Dog Name: ${formState.dogName || "Not provided"}`,
    `Category: ${categoryOptions.find((item) => item.value === formState.category)?.label || formState.category}`,
    `Priority: ${priorityOptions.find((item) => item.value === formState.priority)?.label || formState.priority}`,
    `Preferred Contact: ${
      preferredContactOptions.find((item) => item.value === formState.preferredContact)?.label ||
      formState.preferredContact
    }`,
    "",
    "Issue details:",
    formState.message,
    "",
    "Attachments selected in the form:",
    attachmentSummary,
    "",
    "Note: Attach the same files manually in your email window if they are important to the review.",
  ];

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    bodyLines.join("\n")
  )}`;
};

const ContactSupportFormSection = () => {
  const { token, user } = useAuth();
  const [formState, setFormState] = useState(() => buildInitialFormState(user));
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const selectedTeam = useMemo(() => {
    return teamOptions.find((team) => team.id === formState.team) || teamOptions[0];
  }, [formState.team]);

  const imagePreviews = useMemo(() => {
    return attachments
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 3)
      .map((file) => ({
        id: `${file.name}-${file.size}`,
        file,
        url: URL.createObjectURL(file),
      }));
  }, [attachments]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormState((currentState) => ({
      ...currentState,
      name: currentState.name || user.name || "",
      email: currentState.email || user.email || "",
      phone: currentState.phone || user.phone || "",
      dogName: currentState.dogName || user.subscription?.dogProfile?.name || "",
    }));
  }, [user]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [imagePreviews]);

  const updateField = (key, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const resetForm = ({ keepStatus = false } = {}) => {
    setFormState(buildInitialFormState(user));
    setAttachments([]);
    if (!keepStatus) {
      setStatus(null);
    }
  };

  const handleFileSelection = (event) => {
    const nextFiles = Array.from(event.target.files || []);

    if (nextFiles.length === 0) {
      setAttachments([]);
      return;
    }

    if (nextFiles.length > MAX_FILE_COUNT) {
      setStatus({
        type: "error",
        title: "Too many files selected",
        message: `You can upload up to ${MAX_FILE_COUNT} files in one request.`,
      });
      return;
    }

    const oversizedFile = nextFiles.find((file) => file.size > MAX_FILE_SIZE_BYTES);

    if (oversizedFile) {
      setStatus({
        type: "error",
        title: "File is too large",
        message: `${oversizedFile.name} is larger than 8 MB. Please upload a smaller image or document.`,
      });
      return;
    }

    setAttachments(nextFiles);
    setStatus(null);
  };

  const validateForm = () => {
    if (!formState.name.trim()) {
      return "Please enter your name.";
    }

    if (!formState.email.trim()) {
      return "Please enter your email address.";
    }

    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      return "Please enter a valid email address.";
    }

    if (!formState.subject.trim()) {
      return "Please add a subject so the team can understand the issue quickly.";
    }

    if (!formState.message.trim() || formState.message.trim().length < 20) {
      return "Please describe what happened and how it is affecting your dog, order, or plan.";
    }

    if (!formState.consent) {
      return "Please confirm that the team can contact you about this request.";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setStatus({
        type: "error",
        title: "Please review the form",
        message: validationError,
      });
      return;
    }

    const subject = `[${selectedTeam.label}] ${formState.subject.trim()}`;
    setSubmitting(true);
    setStatus(null);

    try {
      const payload = new FormData();
      payload.append("team", selectedTeam.label);
      payload.append("teamEmail", selectedTeam.email);
      payload.append("name", formState.name.trim());
      payload.append("email", formState.email.trim());
      payload.append("phone", formState.phone.trim());
      payload.append("orderNumber", formState.orderNumber.trim());
      payload.append("dogName", formState.dogName.trim());
      payload.append("subject", subject);
      payload.append("category", formState.category);
      payload.append("priority", formState.priority);
      payload.append("preferredContact", formState.preferredContact);
      payload.append("message", formState.message.trim());
      attachments.forEach((file) => {
        payload.append("attachments", file);
      });

      const response = await apiRequest("/support/requests", {
        method: "POST",
        body: payload,
        token,
      });

      setStatus({
        type: "success",
        title: "Request sent successfully",
        message:
          response.message ||
          "Your message was sent to the support dashboard with the details your team needs.",
      });
      resetForm({ keepStatus: true });
    } catch (error) {
      if (!error.status) {
        window.location.href = createMailtoUrl({
          recipient: selectedTeam.email,
          subject,
          formState,
          files: attachments,
        });

        setStatus({
          type: "warning",
          title: "Email draft opened instead",
          message:
            "The backend is unavailable right now, so we opened a ready-to-send email draft so you do not lose your request.",
        });
      } else {
        setStatus({
          type: "error",
          title: "Request could not be sent",
          message: error.message || "Please try again in a moment.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid support-form-grid">
      <section className="support-form-card">
        <div className="support-form-card__header">
          <div>
            <span className="support-kicker support-kicker--soft">Support for dog parents</span>
            <h2 className="support-form-card__title">
              Share what happened, add photos if needed, and send it to the team that can help fastest.
            </h2>
            <p className="support-form-card__text">
              This form sends your note straight into the support dashboard, so the right
              team can follow up with context instead of starting from scratch.
            </p>
          </div>

          <div className="support-form-card__badges">
            <div className="support-form-card__badge">
              <CircleCheckBig size={16} />
              <span>Structured care request</span>
            </div>
            <div className="support-form-card__badge">
              <Paperclip size={16} />
              <span>Photos and documents welcome</span>
            </div>
          </div>
        </div>

        <div className="support-team-picker">
          {teamOptions.map((team) => {
            const Icon = team.icon;
            const isActive = team.id === formState.team;

            return (
              <button
                key={team.id}
                type="button"
                className={`support-team-card ${isActive ? "is-active" : ""}`}
                onClick={() => updateField("team", team.id)}
              >
                <div className="support-team-card__icon">
                  <Icon size={18} />
                </div>
                <div className="support-team-card__copy">
                  <p className="support-team-card__title">{team.label}</p>
                  <p className="support-team-card__text">{team.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <form className="support-contact-form" onSubmit={handleSubmit}>
          <div className="grid support-contact-form__grid">
            <label className="support-field">
              <span className="support-field__label">Full name</span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="support-field__control"
                placeholder="Your name"
              />
            </label>

            <label className="support-field">
              <span className="support-field__label">Email address</span>
              <input
                type="email"
                value={formState.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="support-field__control"
                placeholder="name@example.com"
              />
            </label>

            <label className="support-field">
              <span className="support-field__label">Phone number</span>
              <input
                type="tel"
                value={formState.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="support-field__control"
                placeholder="Optional"
              />
            </label>

            <label className="support-field">
              <span className="support-field__label">Order number</span>
              <input
                type="text"
                value={formState.orderNumber}
                onChange={(event) => updateField("orderNumber", event.target.value)}
                className="support-field__control"
                placeholder="Optional but helpful"
              />
            </label>

            <label className="support-field">
              <span className="support-field__label">Dog name</span>
              <input
                type="text"
                value={formState.dogName}
                onChange={(event) => updateField("dogName", event.target.value)}
                className="support-field__control"
                placeholder="Optional"
              />
            </label>

            <label className="support-field">
              <span className="support-field__label">Subject</span>
              <input
                type="text"
                value={formState.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                className="support-field__control"
                placeholder="A short summary of what went wrong"
              />
            </label>

            <label className="support-field">
              <span className="support-field__label">Issue category</span>
              <select
                value={formState.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="support-field__control"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="support-field">
              <span className="support-field__label">Priority</span>
              <select
                value={formState.priority}
                onChange={(event) => updateField("priority", event.target.value)}
                className="support-field__control"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="support-field support-field--full">
              <span className="support-field__label">Preferred contact method</span>
              <select
                value={formState.preferredContact}
                onChange={(event) => updateField("preferredContact", event.target.value)}
                className="support-field__control"
              >
                {preferredContactOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="support-field support-field--full">
              <span className="support-field__label">What is going on?</span>
              <textarea
                value={formState.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="support-field__control support-field__control--textarea"
                placeholder="Tell us what happened, what you noticed with your dog or order, and what kind of help you need from us."
              />
            </label>
          </div>

          <div className="support-upload-card">
            <div className="support-upload-card__copy">
              <p className="support-upload-card__title">Attachments</p>
              <p className="support-upload-card__text">
                Upload up to 5 files. Photos, screenshots, PDFs, and receipts help the
                team understand issues like damaged orders, wrong items, or delivery problems faster.
              </p>
            </div>

            <label className="support-upload-card__button">
              <Paperclip size={16} />
              <span>Choose files</span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelection}
              />
            </label>

            {attachments.length > 0 ? (
              <div className="support-upload-list">
                {attachments.map((file) => (
                  <div key={`${file.name}-${file.size}`} className="support-upload-item">
                    <div className="support-upload-item__icon">
                      {file.type.startsWith("image/") ? <Image size={16} /> : <FileText size={16} />}
                    </div>
                    <div className="support-upload-item__copy">
                      <p className="support-upload-item__name">{file.name}</p>
                      <p className="support-upload-item__meta">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {imagePreviews.length > 0 ? (
              <div className="support-upload-preview">
                {imagePreviews.map((preview) => (
                  <img
                    key={preview.id}
                    src={preview.url}
                    alt={preview.file.name}
                    className="support-upload-preview__image"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <label className="support-checkbox">
            <input
              type="checkbox"
              checked={formState.consent}
              onChange={(event) => updateField("consent", event.target.checked)}
            />
            <span>
              I agree that the selected team can contact me using the details above so they
              can help with this request.
            </span>
          </label>

          {status ? (
            <div className={`support-status support-status--${status.type}`}>
              <p className="support-status__title">{status.title}</p>
              <p className="support-status__text">{status.message}</p>
            </div>
          ) : null}

          <div className="support-contact-form__actions">
            <button
              type="submit"
              className="support-button support-button--primary support-contact-form__submit"
              disabled={submitting}
            >
              <Send size={16} />
              <span>{submitting ? "Sending request..." : "Send request"}</span>
            </button>

            <button
              type="button"
              className="support-button support-button--secondary support-contact-form__reset"
              onClick={resetForm}
            >
              Reset form
            </button>
          </div>
        </form>
      </section>

      <aside className="support-form-side-card">
        <div className="support-form-side-card__section">
          <p className="support-form-side-card__eyebrow">Where this goes</p>
          <h2 className="support-form-side-card__title">
            Your request goes to the right team with your dog's details attached.
          </h2>
          <p className="support-form-side-card__text">
            Right now your selected team is <strong>{selectedTeam.label}</strong>. Replies
            can come back by email or phone depending on the contact method you choose in
            the form.
          </p>
        </div>

        <div className="support-form-side-card__section">
          <p className="support-form-side-card__eyebrow">Selected inbox</p>
          <div className="support-form-inbox">
            <Mail size={18} />
            <span>{selectedTeam.email}</span>
          </div>
          <p className="support-form-side-card__text">
            Requests land in the backend dashboard and stay visible for follow-up, with
            email fallback only if the server is unavailable.
          </p>
        </div>

        <div className="support-form-side-card__section">
          <p className="support-form-side-card__eyebrow">Best things to include</p>
          <ul className="support-form-side-card__list">
            <li>Order number, tracking details, or subscription email if the request is account-related.</li>
            <li>Photos of damaged items, wrong products, leaking tubs, labels, or anything visible.</li>
            <li>What outcome you want most: refund, replacement, plan update, guidance, or a callback.</li>
          </ul>
        </div>

        <div className="support-form-side-card__section">
          <p className="support-form-side-card__eyebrow">Response expectations</p>
          <div className="support-form-process">
            <div className="support-form-process__item">
              <CircleCheckBig size={16} />
              <span>Most requests are reviewed within 1 business day.</span>
            </div>
            <div className="support-form-process__item">
              <CircleCheckBig size={16} />
              <span>Requests with photos and order details move faster.</span>
            </div>
            <div className="support-form-process__item">
              <CircleCheckBig size={16} />
              <span>Urgent delivery or renewal issues should be marked as priority or urgent.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ContactSupportFormSection;
