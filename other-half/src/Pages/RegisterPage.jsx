import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthConnectionNotice from "../Components/AuthConnectionNotice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useApiConnectionStatus } from "../hooks/useApiConnectionStatus.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { status: connectionStatus, retry: retryConnectionCheck } = useApiConnectionStatus();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    dogName: "",
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
      await register(formState);
      navigate("/account", { replace: true });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Account could not be created.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FBF8EF] px-6 py-10 md:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[70vh] max-w-[1120px] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[36px] border border-[#E6DFCF] bg-white p-8 shadow-[0_24px_80px_rgba(34,30,18,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Create account
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[#1A1A1A] md:text-4xl">
            Create a home base for your dog's daily care.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#5F5B4F]">
            Register once and we will save your dog's name, care routine, support history,
            and quiz results to a real account that stays with you each time you return.
          </p>
          <p className="mt-2 text-xs leading-5 text-[#7A7468]">
            If signup cannot reach the API, run <code>npm run dev:server</code> in a second terminal.
          </p>

          <div className="mt-4">
            <AuthConnectionNotice
              status={connectionStatus}
              onRetry={retryConnectionCheck}
            />
          </div>

          <div className="mt-8 rounded-[28px] bg-[#FBF8EF] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F4A12]">
              What you get
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#4E4A40]">
              <li>A saved dashboard built around your dog's routine.</li>
              <li>Quiz results and support requests tied to the same account.</li>
              <li>Faster follow-up when you need help with orders, deliveries, or subscriptions.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[36px] bg-[#163B1D] p-8 text-white shadow-[0_32px_100px_rgba(13,32,18,0.22)] md:p-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/80">Full name</span>
              <input
                type="text"
                autoComplete="name"
                value={formState.name}
                onChange={(event) => handleFieldChange("name", event.target.value)}
                className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/45 focus:border-[#EBF466]"
                placeholder="Your full name"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/80">Email address</span>
              <input
                type="email"
                autoComplete="email"
                value={formState.email}
                onChange={(event) => handleFieldChange("email", event.target.value)}
                className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/45 focus:border-[#EBF466]"
                placeholder="name@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/80">Phone number</span>
              <input
                type="tel"
                autoComplete="tel"
                value={formState.phone}
                onChange={(event) => handleFieldChange("phone", event.target.value)}
                className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/45 focus:border-[#EBF466]"
                placeholder="Optional"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/80">Dog name</span>
              <input
                type="text"
                value={formState.dogName}
                onChange={(event) => handleFieldChange("dogName", event.target.value)}
                className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/45 focus:border-[#EBF466]"
                placeholder="Your dog's name"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/80">Password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={formState.password}
                onChange={(event) => handleFieldChange("password", event.target.value)}
                className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-white/45 focus:border-[#EBF466]"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </label>

            {status.message ? (
              <div className="rounded-2xl bg-[#FFF1EE] px-4 py-3 text-sm text-[#A13A2C]">
                {status.message}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#EBF466] px-6 py-3 text-sm font-semibold text-[#163B1D] transition hover:bg-[#DDE95F] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create my account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-white/78">
            Already part of the pack?{" "}
            <Link to="/login" className="font-semibold text-[#EBF466]">
              Sign in here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
