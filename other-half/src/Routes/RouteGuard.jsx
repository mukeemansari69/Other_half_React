import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const LoadingState = ({ message }) => {
  return (
    <main className="min-h-[70vh] bg-[#FBF8EF] px-6 py-16">
      <div className="mx-auto flex max-w-2xl items-center justify-center rounded-[32px] border border-[#E6DFCF] bg-white px-8 py-14 text-center shadow-[0_24px_80px_rgba(34,30,18,0.08)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0F4A12]">
            Account check
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1A1A1A]">{message}</h1>
        </div>
      </div>
    </main>
  );
};

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return children;
};

export const GuestOnlyRoute = ({ children }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Preparing your account..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/account"} replace />;
  }

  return children;
};
