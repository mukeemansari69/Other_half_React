import { CircleCheckBig, Mail, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";

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

const fetchAdminData = async (token) => {
  const [dashboardResponse, usersResponse, supportResponse, subscribersResponse, quizResponse] =
    await Promise.all([
      apiRequest("/admin/dashboard", { token }),
      apiRequest("/admin/users", { token }),
      apiRequest("/admin/support-requests", { token }),
      apiRequest("/admin/newsletter-subscribers", { token }),
      apiRequest("/admin/quiz-submissions", { token }),
    ]);

  return {
    dashboard: dashboardResponse,
    users: usersResponse.users,
    supportRequests: supportResponse.supportRequests,
    subscribers: subscribersResponse.subscribers,
    quizSubmissions: quizResponse.quizSubmissions,
  };
};

const statusTone = {
  new: "bg-[#FFF4D6] text-[#8A5A09]",
  "in-review": "bg-[#E8F1FF] text-[#265A9A]",
  resolved: "bg-[#EAF7E9] text-[#1E6B2D]",
};

const AdminDashboardPage = () => {
  const { logout, token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [quizSubmissions, setQuizSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [updatingRequestId, setUpdatingRequestId] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        const response = await fetchAdminData(token);

        if (!isActive) {
          return;
        }

        setDashboard(response.dashboard);
        setUsers(response.users);
        setSupportRequests(response.supportRequests);
        setSubscribers(response.subscribers);
        setQuizSubmissions(response.quizSubmissions);
      } catch (error) {
        if (isActive) {
          setStatusMessage({
            type: "error",
            message: error.message || "Admin data could not be loaded.",
          });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [token]);

  const handleStatusChange = async (requestId, nextStatus) => {
    setUpdatingRequestId(requestId);
    setStatusMessage({ type: "", message: "" });

    try {
      const response = await apiRequest(`/admin/support-requests/${requestId}/status`, {
        method: "PATCH",
        token,
        body: { status: nextStatus },
      });

      setSupportRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId ? response.supportRequest : request
        )
      );
      setStatusMessage({ type: "success", message: response.message });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error.message || "Status could not be updated.",
      });
    } finally {
      setUpdatingRequestId("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#E6DFCF] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1A1A1A]">
            Loading dashboard data...
          </h1>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-[#F3D3CC] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
          <h1 className="text-3xl font-semibold text-[#1A1A1A]">Admin dashboard unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-[#695B54]">
            {statusMessage.message || "We could not load the backend data."}
          </p>
        </div>
      </main>
    );
  }

  const overviewCards = [
    { label: "Users", value: dashboard.overview.users, icon: Users },
    { label: "Admins", value: dashboard.overview.admins, icon: ShieldCheck },
    { label: "Support requests", value: dashboard.overview.supportRequests, icon: CircleCheckBig },
    {
      label: "Open requests",
      value: dashboard.overview.openSupportRequests,
      icon: CircleCheckBig,
    },
    { label: "Newsletter leads", value: dashboard.overview.newsletterSubscribers, icon: Mail },
    { label: "Quiz submissions", value: dashboard.overview.quizSubmissions, icon: Sparkles },
  ];

  return (
    <main className="bg-[#FBF8EF] px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1320px] space-y-6">
        <section className="rounded-[36px] bg-[#1A1A1A] p-8 text-white shadow-[0_32px_100px_rgba(18,18,18,0.22)] md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#EBF466]">
                Admin control room
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                {user?.name}, the backend dashboard is ready for ops.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/74 md:text-base">
                This view is protected by admin auth and powered by the new Express API. It
                gives you live access to user accounts, support requests, quiz leads, and
                newsletter signups from the frontend.
              </p>
            </div>

            <button
              type="button"
              className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white"
              onClick={logout}
            >
              Sign out
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overviewCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.label} className="rounded-[28px] border border-white/8 bg-white/6 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF466] text-[#1A1A1A]">
                    <Icon size={20} />
                  </div>
                  <p className="mt-4 text-sm text-white/70">{card.label}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{card.value}</h2>
                </article>
              );
            })}
          </div>
        </section>

        {statusMessage.message ? (
          <div
            className={`rounded-[28px] px-5 py-4 text-sm ${
              statusMessage.type === "success"
                ? "bg-[#EEF6E7] text-[#0F4A12]"
                : "bg-[#FFF1EE] text-[#A13A2C]"
            }`}
          >
            {statusMessage.message}
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                  Support queue
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Incoming requests</h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {supportRequests.map((request) => (
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
                        statusTone[request.status] || "bg-[#EEE7D8] text-[#5B5448]"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#5C584D]">{request.message}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                    <div className="flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                      <span>{request.name}</span>
                      <span>{request.email}</span>
                      <span>{formatDate(request.createdAt)}</span>
                      <span>Priority: {request.priority}</span>
                    </div>

                    <select
                      value={request.status}
                      onChange={(event) => handleStatusChange(request.id, event.target.value)}
                      disabled={updatingRequestId === request.id}
                      className="rounded-full border border-[#D9D1BF] bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] outline-none"
                    >
                      <option value="new">New</option>
                      <option value="in-review">In review</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                Users
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Registered accounts</h2>

              <div className="mt-8 space-y-4">
                {users.map((account) => (
                  <article key={account.id} className="rounded-[24px] bg-[#FBF8EF] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#1A1A1A]">{account.name}</h3>
                        <p className="text-sm text-[#5F5B4F]">{account.email}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#4F4A3E]">
                        {account.role}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                      <span>{account.subscription?.planName || "No plan"}</span>
                      <span>{formatDate(account.createdAt)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
                Newsletter
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Latest subscribers</h2>

              <div className="mt-8 space-y-3">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="rounded-[24px] bg-[#FBF8EF] px-4 py-4">
                    <p className="font-semibold text-[#1A1A1A]">{subscriber.email}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#6A6458]">
                      {subscriber.source} • {formatDate(subscriber.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Quiz insights
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Latest recommendations</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quizSubmissions.map((submission) => (
              <article key={submission.id} className="rounded-[28px] bg-[#FBF8EF] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0F4A12]">
                  {formatDate(submission.createdAt)}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#1A1A1A]">
                  {submission.recommendationTitle}
                </h3>
                <p className="mt-2 text-sm text-[#5F5B4F]">
                  {submission.email || submission.name || "Guest visitor"}
                </p>

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
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
