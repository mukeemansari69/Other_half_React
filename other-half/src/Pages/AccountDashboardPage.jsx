import {
  CalendarClock,
  CircleCheckBig,
  MapPin,
  MessagesSquare,
  PawPrint,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DeliveryAddressFields from "../Components/DeliveryAddressFields.jsx";
import { LoadingButton, LoadingLink } from "../Components/LoadingControl.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";
import {
  createEmptyDeliveryAddress,
  formatDeliveryAddressInline,
  getDeliveryAddressTypeLabel,
  hasDeliveryAddressInput,
  isDeliveryAddressComplete,
  normalizeDeliveryAddress,
  validateDeliveryAddress,
} from "../lib/deliveryAddress.js";

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const requestTone = {
  new: "bg-[#FFF4D6] text-[#8A5A09]",
  "in-review": "bg-[#E8F1FF] text-[#265A9A]",
  resolved: "bg-[#EAF7E9] text-[#1E6B2D]",
};

const metricCards = (summary) => [
  {
    key: "support",
    label: "Open support requests",
    value: summary.metrics.openSupportRequests,
    icon: MessagesSquare,
  },
  {
    key: "quiz",
    label: "Saved recommendations",
    value: summary.metrics.savedRecommendations,
    icon: Sparkles,
  },
  {
    key: "delivery",
    label: "Next delivery",
    value: formatDate(summary.subscription.nextDelivery),
    icon: CalendarClock,
  },
];

const getSupportStatusCounts = (supportRequests) => {
  return supportRequests.reduce(
    (counts, request) => {
      const normalizedStatus = String(request.status || "").toLowerCase();

      if (normalizedStatus === "new" || normalizedStatus === "in-review" || normalizedStatus === "resolved") {
        counts[normalizedStatus] += 1;
      } else {
        counts.other += 1;
      }

      return counts;
    },
    {
      new: 0,
      "in-review": 0,
      resolved: 0,
      other: 0,
    }
  );
};

const AccountDashboardPage = () => {
  const { logout, token, updateLocalUser, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    dogName: "",
    deliveryCadence: "",
    deliveryAddress: createEmptyDeliveryAddress(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [activeMetric, setActiveMetric] = useState("support");
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    let isActive = true;

    const loadSummary = async () => {
      setLoading(true);

      try {
        const response = await apiRequest("/account/summary", { token });

        if (!isActive) {
          return;
        }

        setSummary(response);
        setFormState({
          name: response.user.name || "",
          phone: response.user.phone || "",
          dogName: response.subscription?.dogProfile?.name || "",
          deliveryCadence: response.subscription?.deliveryCadence || "",
          deliveryAddress: normalizeDeliveryAddress(response.user.deliveryAddress),
        });
      } catch (error) {
        if (isActive) {
          setStatus({
            type: "error",
            message: error.message || "Account details could not be loaded.",
          });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      isActive = false;
    };
  }, [token]);

  const handleFieldChange = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleAddressFieldChange = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      deliveryAddress: {
        ...currentState.deliveryAddress,
        [field]: value,
      },
    }));
    setAddressErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const shouldSaveAddress = hasDeliveryAddressInput(formState.deliveryAddress);
    const nextAddressErrors = shouldSaveAddress
      ? validateDeliveryAddress(formState.deliveryAddress)
      : {};

    if (Object.keys(nextAddressErrors).length > 0) {
      setAddressErrors(nextAddressErrors);
      setStatus({
        type: "error",
        message: "Please complete the delivery address fields before saving.",
      });
      return;
    }

    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await apiRequest("/account/profile", {
        method: "PATCH",
        token,
        body: {
          name: formState.name,
          phone: formState.phone,
          dogName: formState.dogName,
          deliveryCadence: formState.deliveryCadence,
          ...(shouldSaveAddress
            ? {
                deliveryAddress: normalizeDeliveryAddress(formState.deliveryAddress),
              }
            : {}),
        },
      });

      setSummary((currentSummary) => ({
        ...currentSummary,
        user: response.user,
        subscription: response.subscription,
      }));
      setFormState({
        name: response.user.name || "",
        phone: response.user.phone || "",
        dogName: response.subscription?.dogProfile?.name || "",
        deliveryCadence: response.subscription?.deliveryCadence || "",
        deliveryAddress: normalizeDeliveryAddress(response.user.deliveryAddress),
      });
      setAddressErrors({});
      updateLocalUser(response.user);
      setStatus({ type: "success", message: response.message });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Profile details could not be saved.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#E6DFCF] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1A1A1A]">
            Bringing your dog's care snapshot together...
          </h1>
        </div>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#F3D3CC] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
          <h1 className="text-3xl font-semibold text-[#1A1A1A]">Account unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-[#695B54]">
            {status.message || "We could not load your dog's saved dashboard right now."}
          </p>
        </div>
      </main>
    );
  }

  const dogName = summary.subscription?.dogProfile?.name || "your dog";
  const supportStatusCounts = getSupportStatusCounts(summary.supportRequests);
  const isManagedSubscription = Boolean(summary.subscription?.sourceOrderId);
  const deliveryCadenceOptions = ["Every 30 days", "Every 45 days", "Every 60 days"];
  const deliveryCadenceValue = formState.deliveryCadence || "Not set";
  const savedDeliveryAddress = normalizeDeliveryAddress(summary.user.deliveryAddress);
  const hasSavedDeliveryAddress = isDeliveryAddressComplete(savedDeliveryAddress);
  const verificationItems = [
    {
      label: "Email verified",
      value: summary.user.emailVerified,
    },
    {
      label: "Phone verified",
      value: summary.user.phoneVerified,
    },
  ];

  return (
    <main className="bg-[#FBF8EF] px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1240px] space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[36px] bg-[#163B1D] p-8 text-white shadow-[0_32px_100px_rgba(13,32,18,0.22)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#EBF466]">
              Care dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              {user?.name || summary.user.name}, {dogName}'s routine is all in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
              From saved quiz answers to delivery timing and support messages, this space keeps
              the little details that help you care for {dogName} with less guesswork.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {verificationItems.map((item) => (
                <span
                  key={item.label}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                    item.value
                      ? "bg-[#EBF466] text-[#163B1D]"
                      : "border border-white/16 bg-white/8 text-white/72"
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {metricCards(summary).map((card) => {
                const Icon = card.icon;
                const isActive = activeMetric === card.key;

                return (
                  <button
                    type="button"
                    key={card.key}
                    onClick={() => setActiveMetric(card.key)}
                    className={`rounded-[28px] border p-5 text-left transition ${
                      isActive
                        ? "border-[#EBF466] bg-white/16"
                        : "border-white/10 bg-white/8 hover:bg-white/12"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF466] text-[#163B1D]">
                      <Icon size={20} />
                    </div>
                    <p className="mt-4 text-sm text-white/70">{card.label}</p>
                    <h2 className="mt-1 text-xl font-semibold">{card.value}</h2>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[24px] border border-white/16 bg-white/8 p-5">
              {activeMetric === "support" ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EBF466]">
                    Support status
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/88">
                    <span>New: {supportStatusCounts.new}</span>
                    <span>In review: {supportStatusCounts["in-review"]}</span>
                    <span>Resolved: {supportStatusCounts.resolved}</span>
                  </div>
                </div>
              ) : null}

              {activeMetric === "quiz" ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EBF466]">
                    Latest saved quiz
                  </p>
                  {summary.quizSubmissions.length > 0 ? (
                    <div className="mt-3 text-sm text-white/88">
                      <p>{summary.quizSubmissions[0].recommendationTitle}</p>
                      <p className="mt-1 text-white/70">
                        Saved on {formatDate(summary.quizSubmissions[0].createdAt)}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-white/78">
                      No saved quiz result yet. Retake the quiz and it will appear here.
                    </p>
                  )}
                </div>
              ) : null}

              {activeMetric === "delivery" ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EBF466]">
                    Delivery details
                  </p>
                  <div className="mt-3 text-sm text-white/88">
                    <p>Plan: {summary.subscription.planName}</p>
                    <p className="mt-1">Cadence: {summary.subscription.deliveryCadence}</p>
                    <p className="mt-1">Next box: {formatDate(summary.subscription.nextDelivery)}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <LoadingLink
                to="/quiz"
                className="rounded-full bg-[#EBF466] px-5 py-3 text-sm font-semibold text-[#163B1D]"
                loadingText="Opening..."
              >
                Retake care quiz
              </LoadingLink>
              <LoadingLink
                to="/contact"
                className="rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
                loadingText="Opening..."
              >
                Contact support
              </LoadingLink>
              <LoadingButton
                type="button"
                className="rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
                lockOnClick
                loadingText="Signing out..."
                onClick={logout}
              >
                Sign out
              </LoadingButton>
            </div>
          </div>

          <div className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                  Routine snapshot
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">
                  {summary.subscription.planName}
                </h2>
              </div>
              <div className="rounded-full bg-[#EAF7E9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1E6B2D]">
                {summary.subscription.status}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-[28px] bg-[#FBF8EF] p-5">
              <div className="flex items-center gap-3 text-[#1A1A1A]">
                <PawPrint size={18} className="text-[#0F4A12]" />
                <div>
                  <p className="text-sm text-[#6A6458]">Dog you are caring for</p>
                  <p className="font-semibold">{summary.subscription.dogProfile.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#1A1A1A]">
                <CalendarClock size={18} className="text-[#0F4A12]" />
                <div>
                  <p className="text-sm text-[#6A6458]">Next box</p>
                  <p className="font-semibold">{formatDate(summary.subscription.nextDelivery)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#1A1A1A]">
                <CircleCheckBig size={18} className="text-[#0F4A12]" />
                <div>
                  <p className="text-sm text-[#6A6458]">Delivery rhythm</p>
                  <p className="font-semibold">{summary.subscription.deliveryCadence}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-[#E6DFCF] bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EEF6E7] text-[#0F4A12]">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#EEF6E7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
                      {getDeliveryAddressTypeLabel(savedDeliveryAddress.addressType)}
                    </span>
                    <span className="rounded-full bg-[#FBF8EF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6A6458]">
                      {hasSavedDeliveryAddress ? "Saved delivery address" : "Not saved yet"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5F5B4F]">
                    {hasSavedDeliveryAddress
                      ? formatDeliveryAddressInline(savedDeliveryAddress)
                      : "Add a delivery address below so checkout can prefill it and admin can see the same shipping location."}
                  </p>
                </div>
              </div>
            </div>

            <LoadingLink
              to="/manage-subscription"
              className="mt-6 inline-flex rounded-full border border-[#D6D0C1] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
              loadingText="Opening..."
            >
              View subscription help
            </LoadingLink>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
              Update profile
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Keep {dogName}'s details current</h2>

            <form className="mt-8 space-y-5" onSubmit={handleSaveProfile}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Full name</span>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) => handleFieldChange("name", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Phone</span>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={(event) => handleFieldChange("phone", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                />
                {!summary.user.phoneVerified && formState.phone ? (
                  <p className="mt-2 text-sm text-[#6A6458]">
                    This number is saved, but OTP login will only work after you verify it through
                    the mobile sign-in flow.
                  </p>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Dog name</span>
                <input
                  type="text"
                  value={formState.dogName}
                  onChange={(event) => handleFieldChange("dogName", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#353126]">Delivery cadence</span>
                <select
                  value={
                    deliveryCadenceOptions.includes(deliveryCadenceValue)
                      ? deliveryCadenceValue
                      : "custom"
                  }
                  onChange={(event) => handleFieldChange("deliveryCadence", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                  disabled={isManagedSubscription}
                >
                  <option value="Every 30 days">Every 30 days</option>
                  <option value="Every 45 days">Every 45 days</option>
                  <option value="Every 60 days">Every 60 days</option>
                  {!deliveryCadenceOptions.includes(deliveryCadenceValue) ? (
                    <option value="custom">{deliveryCadenceValue}</option>
                  ) : null}
                </select>
                <p className="mt-2 text-sm text-[#6A6458]">
                  {isManagedSubscription
                    ? "This cadence is controlled by your active subscription billing setup."
                    : "This field is only a saved preference until a recurring plan is active."}
                </p>
              </label>

              <div className="rounded-[28px] border border-[#E6DFCF] bg-[#F7F2E7] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F4A12]">
                  Delivery address
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#1A1A1A]">
                  Save the address used for shipping
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5F5B4F]">
                  This is the address your cart will prefill and the same location the admin
                  billing card will show for each order.
                </p>

                <DeliveryAddressFields
                  address={formState.deliveryAddress}
                  errors={addressErrors}
                  onChange={handleAddressFieldChange}
                  className="mt-5"
                />
              </div>

              {status.message ? (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-[#EEF6E7] text-[#0F4A12]"
                      : "bg-[#FFF1EE] text-[#A13A2C]"
                  }`}
                >
                  {status.message}
                </div>
              ) : null}

              <LoadingButton
                type="submit"
                className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                loading={saving}
                loadingText="Saving changes..."
                disabled={saving}
              >
                Save profile
              </LoadingButton>
            </form>
          </article>

          <div className="space-y-6">
            <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                    Support history
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Recent conversations about {dogName}</h2>
                </div>
                <LoadingLink
                  to="/contact"
                  className="rounded-full border border-[#D6D0C1] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
                  loadingText="Opening..."
                >
                  Ask for help
                </LoadingLink>
              </div>

              <div className="mt-8 space-y-4">
                {summary.supportRequests.length > 0 ? (
                  summary.supportRequests.map((request) => (
                    <article key={request.id} className="rounded-[28px] bg-[#FBF8EF] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
                            {request.team}
                          </p>
                          <h3 className="mt-1 text-xl font-semibold text-[#1A1A1A]">
                            {request.subject}
                          </h3>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                            requestTone[request.status] || "bg-[#EEE7D8] text-[#5B5448]"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#5C584D]">{request.message}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                        <span>Priority: {request.priority}</span>
                        <span>Created: {formatDate(request.createdAt)}</span>
                        <span>Attachments: {request.attachments.length}</span>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-[28px] bg-[#FBF8EF] px-5 py-6 text-sm leading-6 text-[#5C584D]">
                    You have not needed help yet. If anything feels off with an order,
                    delivery, or plan, send a request and it will appear here.
                  </p>
                )}
              </div>
            </article>

            <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                    Saved quiz results
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">
                    Saved care matches
                  </h2>
                </div>
                <LoadingLink
                  to="/quiz"
                  className="rounded-full border border-[#D6D0C1] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
                  loadingText="Opening..."
                >
                  Retake quiz
                </LoadingLink>
              </div>

              <div className="mt-8 grid gap-4">
                {summary.quizSubmissions.length > 0 ? (
                  summary.quizSubmissions.map((submission) => (
                    <article key={submission.id} className="rounded-[28px] bg-[#FBF8EF] p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
                        {formatDate(submission.createdAt)}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[#1A1A1A]">
                        {submission.recommendationTitle}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {submission.topFocuses.map((focus) => (
                          <span
                            key={`${submission.id}-${focus}`}
                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#4F4A3E]"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="rounded-[28px] bg-[#FBF8EF] px-5 py-6 text-sm leading-6 text-[#5C584D]">
                    Complete the quiz while logged in and we will save the result here so you
                    can revisit what fits {dogName} best.
                  </p>
                )}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AccountDashboardPage;
