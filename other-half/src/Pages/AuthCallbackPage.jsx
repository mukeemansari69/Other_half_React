import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { exchangeSocialLoginCode } = useAuth();
  const exchangeSocialLoginCodeRef = useRef(exchangeSocialLoginCode);
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const exchangeCode = searchParams.get("exchange") || "";
  const initialError = searchParams.get("error") || "";
  const [status, setStatus] = useState({
    type: initialError ? "error" : "info",
    message: initialError || "Completing sign-in...",
  });

  useEffect(() => {
    exchangeSocialLoginCodeRef.current = exchangeSocialLoginCode;
  }, [exchangeSocialLoginCode]);

  useEffect(() => {
    let isActive = true;

    const finalizeLogin = async () => {
      if (!exchangeCode) {
        if (isActive) {
          setStatus({
            type: "error",
            message: initialError || "No sign-in exchange code was provided.",
          });
        }
        return;
      }

      try {
        const response = await exchangeSocialLoginCodeRef.current(exchangeCode);

        if (!isActive) {
          return;
        }

        navigate(response.redirectTo || "/account", { replace: true });
      } catch (error) {
        if (isActive) {
          setStatus({
            type: "error",
            message: error.message || "Social sign-in could not be completed.",
          });
        }
      }
    };

    finalizeLogin();

    return () => {
      isActive = false;
    };
  }, [exchangeCode, initialError, navigate]);

  const toneClasses =
    status.type === "error"
      ? "border-[#F3D3CC] bg-white text-[#A13A2C]"
      : "border-[#E6DFCF] bg-white text-[#0F4A12]";

  return (
    <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
      <div className={`mx-auto max-w-2xl rounded-[32px] border px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)] ${toneClasses}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.24em]">
          Authentication
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1A1A1A]">
          {status.type === "error" ? "Sign-in failed" : "Connecting your account"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#5F5B4F]">{status.message}</p>

        {status.type === "error" ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="rounded-full bg-[#0F4A12] px-5 py-3 text-sm font-semibold text-white"
            >
              Back to login
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-[#D9D1BF] px-5 py-3 text-sm font-semibold text-[#1A1A1A]"
            >
              Create account
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default AuthCallbackPage;
