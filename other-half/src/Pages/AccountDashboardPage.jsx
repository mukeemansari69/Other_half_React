import { CalendarClock, CircleCheckBig, MessagesSquare, PawPrint, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

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
    label: "Open support requests",
    value: summary.metrics.openSupportRequests,
    icon: MessagesSquare,
  },
  {
    label: "Saved recommendations",
    value: summary.metrics.savedRecommendations,
    icon: Sparkles,
  },
  {
    label: "Next delivery",
    value: formatDate(summary.subscription.nextDelivery),
    icon: CalendarClock,
  },
];

const AccountDashboardPage = () => {
  const { logout, token, updateLocalUser, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    dogName: "",
    deliveryCadence: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

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

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await apiRequest("/account/profile", {
        method: "PATCH",
        token,
        body: formState,
      });

      setSummary((currentSummary) => ({
        ...currentSummary,
        user: response.user,
        subscription: response.subscription,
      }));
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
            Loading your account details...
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
            {status.message || "We could not load your dashboard right now."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FBF8EF] px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1240px] space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[36px] bg-[#163B1D] p-8 text-white shadow-[0_32px_100px_rgba(13,32,18,0.22)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#EBF466]">
              Customer dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              {user?.name || summary.user.name}, your backend-connected account is live.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
              This area is now powered by the Express API. Your support requests, saved quiz
              results, and subscription snapshot are all coming from authenticated data.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {metricCards(summary).map((card) => {
                const Icon = card.icon;

                return (
                  <article key={card.label} className="rounded-[28px] border border-white/10 bg-white/8 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF466] text-[#163B1D]">
                      <Icon size={20} />
                    </div>
                    <p className="mt-4 text-sm text-white/70">{card.label}</p>
                    <h2 className="mt-1 text-xl font-semibold">{card.value}</h2>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/quiz"
                className="rounded-full bg-[#EBF466] px-5 py-3 text-sm font-semibold text-[#163B1D]"
              >
                Take the quiz again
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
              >
                Create support request
              </Link>
              <button
                type="button"
                className="rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
                onClick={logout}
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                  Subscription snapshot
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
                  <p className="text-sm text-[#6A6458]">Dog profile</p>
                  <p className="font-semibold">{summary.subscription.dogProfile.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#1A1A1A]">
                <CalendarClock size={18} className="text-[#0F4A12]" />
                <div>
                  <p className="text-sm text-[#6A6458]">Next delivery</p>
                  <p className="font-semibold">{formatDate(summary.subscription.nextDelivery)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#1A1A1A]">
                <CircleCheckBig size={18} className="text-[#0F4A12]" />
                <div>
                  <p className="text-sm text-[#6A6458]">Cadence</p>
                  <p className="font-semibold">{summary.subscription.deliveryCadence}</p>
                </div>
              </div>
            </div>

            <Link
              to="/manage-subscription"
              className="mt-6 inline-flex rounded-full border border-[#D6D0C1] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
            >
              Read subscription guidance
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
              Update profile
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Keep account details current</h2>

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
                  value={formState.deliveryCadence}
                  onChange={(event) => handleFieldChange("deliveryCadence", event.target.value)}
                  className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                >
                  <option value="Every 30 days">Every 30 days</option>
                  <option value="Every 45 days">Every 45 days</option>
                  <option value="Every 60 days">Every 60 days</option>
                </select>
              </label>

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

              <button
                type="submit"
                className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                disabled={saving}
              >
                {saving ? "Saving changes..." : "Save profile"}
              </button>
            </form>
          </article>

          <div className="space-y-6">
            <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                    Support history
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Your recent requests</h2>
                </div>
                <Link
                  to="/contact"
                  className="rounded-full border border-[#D6D0C1] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
                >
                  New request
                </Link>
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
                    You have not submitted a support request yet. The contact form will now
                    store future submissions in the backend and surface them here.
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
                    Recommendation history
                  </h2>
                </div>
                <Link
                  to="/quiz"
                  className="rounded-full border border-[#D6D0C1] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
                >
                  Retake quiz
                </Link>
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
                    Complete the quiz while logged in and the result will be saved to your
                    account automatically.
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
