import { LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const featurePoints = [
  {
    title: "Customer login",
    text: "See your saved quiz recommendations, support history, and subscription snapshot.",
    icon: UserRound,
  },
  {
    title: "Admin access",
    text: "Review tickets, newsletter leads, quiz submissions, and registered members in one place.",
    icon: ShieldCheck,
  },
  {
    title: "Protected session",
    text: "The new Express API uses token-based authentication for account and admin routes.",
    icon: LockKeyhole,
  },
];

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await login(formState);
      const fallbackRoute = response.user.role === "admin" ? "/admin" : "/account";
      const destination = location.state?.from?.pathname || fallbackRoute;
      navigate(destination, { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Login failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FBF8EF] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[70vh] max-w-[1240px] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[36px] bg-[#163B1D] p-8 text-white shadow-[0_32px_100px_rgba(13,32,18,0.22)] md:p-12">
          <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#E8F0C7]">
            Full-stack account access
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
            Login flow is now connected to the new Node.js + Express backend.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
            Sign in to reach the customer dashboard or the admin control room. The frontend
            now talks to real API routes instead of static-only account placeholders.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featurePoints.map((point) => {
              const Icon = point.icon;

              return (
                <article
                  key={point.title}
                  className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF466] text-[#163B1D]">
                    <Icon size={20} />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">{point.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/72">{point.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/10 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#EBF466]">
              Demo credentials
            </p>
            <p className="mt-3 text-sm leading-7 text-white/78">
              Admin: <span className="font-semibold text-white">admin@otherhalfpets.com</span> /
              {" "}
              <span className="font-semibold text-white">Admin@123</span>
            </p>
            <p className="text-sm leading-7 text-white/78">
              Member: <span className="font-semibold text-white">member@example.com</span> /{" "}
              <span className="font-semibold text-white">Member@123</span>
            </p>
          </div>
        </section>

        <section className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Sign in
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[#1A1A1A]">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-[#5F5B4F]">
            Use your account email to open your dashboard, review saved data, and continue
            with the new authenticated flow.
          </p>
          <p className="mt-2 text-xs leading-5 text-[#7A7468]">
            If you see a server connection error, start the backend with <code>npm run dev:server</code>.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#353126]">Email address</span>
              <input
                type="email"
                value={formState.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                placeholder="name@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#353126]">Password</span>
              <input
                type="password"
                value={formState.password}
                onChange={(event) => handleFieldChange("password", event.target.value)}
                className="w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]"
                placeholder="Enter your password"
              />
            </label>

            {status.message ? (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  status.type === "error"
                    ? "bg-[#FFF1EE] text-[#A13A2C]"
                    : "bg-[#EEF6E7] text-[#0F4A12]"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#0F4A12] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#133F18] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-[#5F5B4F]">
            Need a new account?{" "}
            <Link to="/register" className="font-semibold text-[#0F4A12]">
              Create one here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
