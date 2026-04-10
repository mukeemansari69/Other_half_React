import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AuthConnectionNotice from "../Components/AuthConnectionNotice.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useApiConnectionStatus } from "../hooks/useApiConnectionStatus.js";
import "./homeAuthPromptModal.css";

const REOPEN_DELAY_MS = 15000;

const LOGIN_FORM_INITIAL_STATE = {
  email: "",
  password: "",
};

const REGISTER_FORM_INITIAL_STATE = {
  name: "",
  email: "",
  phone: "",
  dogName: "",
  password: "",
};

const benefitCards = [
  {
    title: "Save your dog's routine",
    text: "Keep quiz results, profile details, and care notes tied to one account.",
    icon: Sparkles,
  },
  {
    title: "Track support faster",
    text: "See your previous requests and get follow-up with the right context.",
    icon: ShieldCheck,
  },
  {
    title: "Protected account access",
    text: "Your dashboard, deliveries, and saved progress stay ready every time you return.",
    icon: LockKeyhole,
  },
];

const reminderPoints = [
  "Save account details once and return without starting over.",
  "Keep support, quizzes, and future orders tied to the same profile.",
  "Close this card if you want, and we will remind you again in 15 seconds.",
];

const HomeAuthPromptModal = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, register } = useAuth();
  const { status: connectionStatus, retry: retryConnectionCheck } = useApiConnectionStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm, setLoginForm] = useState(LOGIN_FORM_INITIAL_STATE);
  const [registerForm, setRegisterForm] = useState(REGISTER_FORM_INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
      return undefined;
    }

    if (isOpen) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsOpen(true);
    }, REOPEN_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (window.matchMedia("(max-width: 1023px)").matches) {
      setActiveTab("login");
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const activePanelCopy = useMemo(() => {
    if (activeTab === "create") {
      return {
        eyebrow: "Create your dog's account",
        heading: "Build a home base for orders, care notes, and quiz results.",
        text:
          "Set up one account and keep your dog's routine, support history, and future deliveries in one connected space.",
        buttonLabel: "Create account",
      };
    }

    return {
      eyebrow: "Welcome back",
      heading: "Sign in and reopen your dog's care dashboard in seconds.",
      text:
        "Your saved quiz result, support requests, and account details are waiting for you inside the pack dashboard.",
      buttonLabel: "Sign in",
    };
  }, [activeTab]);

  const closeModal = () => {
    setIsOpen(false);
    setStatus({ type: "", message: "" });
  };

  const switchTab = (nextTab) => {
    setActiveTab(nextTab);
    setStatus({ type: "", message: "" });
  };

  const handleLoginFieldChange = (field, value) => {
    setLoginForm((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleRegisterFieldChange = (field, value) => {
    setRegisterForm((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const navigateAfterAuth = (responseUser) => {
    navigate(responseUser.role === "admin" ? "/admin" : "/account", {
      replace: true,
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await login(loginForm);
      setIsOpen(false);
      setLoginForm(LOGIN_FORM_INITIAL_STATE);
      navigateAfterAuth(response.user);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Sign in could not be completed right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await register(registerForm);
      setIsOpen(false);
      setRegisterForm(REGISTER_FORM_INITIAL_STATE);
      navigateAfterAuth(response.user);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Account could not be created right now.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || isAuthenticated || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="home-auth-modal-overlay fixed inset-0 z-[120] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-auth-modal-heading"
        className="home-auth-modal relative w-full max-w-[1120px] overflow-hidden rounded-[28px] lg:rounded-[34px]"
      >
        <button
          type="button"
          onClick={closeModal}
          className="home-auth-modal__close absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full sm:right-4 sm:top-4 sm:h-11 sm:w-11"
          aria-label="Close sign in prompt"
        >
          <X size={18} />
        </button>

        <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[1.06fr_0.94fr]">
          <section className="home-auth-modal__hero relative hidden overflow-hidden px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:block lg:px-10 lg:py-10">
            <div className="home-auth-modal__glow home-auth-modal__glow--one" />
            <div className="home-auth-modal__glow home-auth-modal__glow--two" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3">
                <div className="home-auth-modal__brand-icon flex h-12 w-12 items-center justify-center rounded-[16px] sm:h-14 sm:w-14 sm:rounded-[18px]">
                  <img
                    src="/Home/images/dog-logo.svg"
                    alt="Other Half"
                    className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                  />
                </div>
                <div>
                  <p className="home-auth-modal__eyebrow">{activePanelCopy.eyebrow}</p>
                  <p className="home-auth-modal__brand-copy">
                    Dog-first wellness, all in one place
                  </p>
                </div>
              </div>

              <div className="mt-6 max-w-[440px] sm:mt-8">
                <p className="home-auth-modal__kicker">Other Half</p>
                <h2
                  id="home-auth-modal-heading"
                  className="home-auth-modal__title mt-3 sm:mt-4"
                >
                  {activePanelCopy.heading}
                </h2>
                <p className="home-auth-modal__body mt-3 sm:mt-4">
                  {activePanelCopy.text}
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 xl:grid-cols-3">
                {benefitCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article key={card.title} className="home-auth-modal__benefit p-4">
                      <div className="home-auth-modal__benefit-icon flex h-10 w-10 items-center justify-center rounded-full">
                        <Icon size={18} />
                      </div>
                      <h3 className="home-auth-modal__benefit-title mt-4">{card.title}</h3>
                      <p className="home-auth-modal__benefit-text mt-2">{card.text}</p>
                    </article>
                  );
                })}
              </div>

              <div className="home-auth-modal__photo-panel mt-6 p-4 sm:mt-8 sm:p-5">
                <div className="grid gap-4 sm:gap-5 md:grid-cols-[0.88fr_1.12fr] md:items-end">
                  <div className="overflow-hidden rounded-[22px] sm:rounded-[24px]">
                    <img
                      src="/Default/images/dogs4.avif"
                      alt="Happy dog enjoying a healthy routine"
                      className="h-[220px] w-full object-cover sm:h-[250px] md:h-full md:min-h-[220px]"
                    />
                  </div>

                  <div>
                    <p className="home-auth-modal__kicker">Why it helps</p>
                    <div className="mt-4 space-y-3">
                      {reminderPoints.map((point) => (
                        <div key={point} className="flex items-start gap-3">
                          <CheckCircle2
                            size={18}
                            className="mt-1 shrink-0 text-[#EBF466]"
                          />
                          <p className="home-auth-modal__point">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="home-auth-modal__panel px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-9 lg:py-9">
            <div className="mx-auto max-w-[420px]">
              <div className="mb-5 flex items-center gap-3 lg:hidden">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#F3EEE1]">
                  <img
                    src="/Home/images/dog-logo.svg"
                    alt="Other Half"
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <div>
                  <p className="home-auth-modal__panel-kicker">Other Half</p>
                  <p className="text-[13px] leading-5 text-[#625D51]">
                    Sign in to continue with your dog's account.
                  </p>
                </div>
              </div>

              <div>
                <p className="home-auth-modal__panel-kicker">Account access</p>
                <h3 className="home-auth-modal__panel-title mt-3">
                  {activeTab === "create" ? "Create your account" : "Sign in to continue"}
                </h3>
              </div>

              <div className="home-auth-modal__tab-shell mt-5 grid grid-cols-2 p-1 sm:mt-6">
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className={`home-auth-modal__tab rounded-full px-4 py-3 ${
                    activeTab === "login" ? "is-active" : ""
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchTab("create")}
                  className={`home-auth-modal__tab rounded-full px-4 py-3 ${
                    activeTab === "create" ? "is-active" : ""
                  }`}
                >
                  Create account
                </button>
              </div>

              <div className="mt-4">
                <AuthConnectionNotice
                  status={connectionStatus}
                  onRetry={retryConnectionCheck}
                  compact
                />
              </div>

              {activeTab === "login" ? (
                <form className="mt-5 space-y-4 sm:mt-6" onSubmit={handleLoginSubmit}>
                  <label className="block">
                    <span className="home-auth-modal__field-label mb-2 block">
                      Email address
                    </span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={loginForm.email}
                      onChange={(event) =>
                        handleLoginFieldChange("email", event.target.value)
                      }
                      className="home-auth-modal__input w-full rounded-[18px] px-4 py-3"
                      placeholder="name@example.com"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="home-auth-modal__field-label mb-2 block">
                      Password
                    </span>
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={loginForm.password}
                      onChange={(event) =>
                        handleLoginFieldChange("password", event.target.value)
                      }
                      className="home-auth-modal__input w-full rounded-[18px] px-4 py-3"
                      placeholder="Enter your password"
                      required
                    />
                  </label>

                  {status.message ? (
                    <div
                      className={`home-auth-modal__status rounded-[20px] px-4 py-3 ${
                        status.type === "error" ? "is-error" : "is-success"
                      }`}
                    >
                      {status.message}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="home-auth-modal__action flex w-full items-center justify-center gap-2 rounded-full px-6 py-3"
                  >
                    <span>{submitting ? "Signing in..." : "Sign in to dashboard"}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form className="mt-5 space-y-4 sm:mt-6" onSubmit={handleRegisterSubmit}>
                  <label className="block">
                    <span className="home-auth-modal__field-label mb-2 block">
                      Full name
                    </span>
                    <input
                      type="text"
                      autoComplete="name"
                      value={registerForm.name}
                      onChange={(event) =>
                        handleRegisterFieldChange("name", event.target.value)
                      }
                      className="home-auth-modal__input w-full rounded-[18px] px-4 py-3"
                      placeholder="Your full name"
                      required
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="home-auth-modal__field-label mb-2 block">Email</span>
                      <input
                        type="email"
                        autoComplete="email"
                        value={registerForm.email}
                        onChange={(event) =>
                          handleRegisterFieldChange("email", event.target.value)
                        }
                        className="home-auth-modal__input w-full rounded-[18px] px-4 py-3"
                        placeholder="name@example.com"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="home-auth-modal__field-label mb-2 block">Phone</span>
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={registerForm.phone}
                        onChange={(event) =>
                          handleRegisterFieldChange("phone", event.target.value)
                        }
                        className="home-auth-modal__input w-full rounded-[18px] px-4 py-3"
                        placeholder="Optional"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="home-auth-modal__field-label mb-2 block">Dog name</span>
                      <input
                        type="text"
                        value={registerForm.dogName}
                        onChange={(event) =>
                          handleRegisterFieldChange("dogName", event.target.value)
                        }
                        className="home-auth-modal__input w-full rounded-[18px] px-4 py-3"
                        placeholder="Your dog's name"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="home-auth-modal__field-label mb-2 block">Password</span>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={registerForm.password}
                        onChange={(event) =>
                          handleRegisterFieldChange("password", event.target.value)
                        }
                        className="home-auth-modal__input w-full rounded-[18px] px-4 py-3"
                        placeholder="At least 8 characters"
                        minLength={8}
                        required
                      />
                    </label>
                  </div>

                  {status.message ? (
                    <div
                      className={`home-auth-modal__status rounded-[20px] px-4 py-3 ${
                        status.type === "error" ? "is-error" : "is-success"
                      }`}
                    >
                      {status.message}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="home-auth-modal__action flex w-full items-center justify-center gap-2 rounded-full px-6 py-3"
                  >
                    <span>{submitting ? "Creating account..." : activePanelCopy.buttonLabel}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              <div className="home-auth-modal__note mt-5 rounded-[22px] px-4 py-4 sm:mt-6">
                <p className="home-auth-modal__note-kicker">Reminder behavior</p>
                <p className="home-auth-modal__note-copy mt-2">
                  If you close this card without signing in or creating an account, it will
                  show again after 15 seconds while you stay on the home page.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HomeAuthPromptModal;
