/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

import { apiRequest, getStoredToken, setStoredToken } from "../lib/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadSession = async () => {
      if (!token) {
        if (isActive) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await apiRequest("/auth/me", { token });

        if (isActive) {
          setUser(response.user);
        }
      } catch {
        setStoredToken(null);

        if (isActive) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadSession();

    return () => {
      isActive = false;
    };
  }, [token]);

  const persistSession = (nextToken, nextUser) => {
    setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const consumeAuthResponse = (response) => {
    if (response?.token && response?.user) {
      persistSession(response.token, response.user);
    }

    return response;
  };

  const login = async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    });

    return consumeAuthResponse(response);
  };

  const register = async (payload) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: payload,
    });

    return consumeAuthResponse(response);
  };

  const registerWithPhone = async (payload) => {
    const response = await apiRequest("/auth/register/phone", {
      method: "POST",
      body: payload,
    });

    return consumeAuthResponse(response);
  };

  const requestPhoneOtp = async (payload) => {
    return apiRequest("/auth/phone/send-otp", {
      method: "POST",
      body: payload,
    });
  };

  const verifyPhoneOtp = async (payload) => {
    const response = await apiRequest("/auth/phone/verify-otp", {
      method: "POST",
      body: payload,
    });

    return consumeAuthResponse(response);
  };

  const verifyEmailOtp = async (payload) => {
    const response = await apiRequest("/auth/verify/email", {
      method: "POST",
      body: payload,
    });

    return consumeAuthResponse(response);
  };

  const resendEmailVerification = async (payload) => {
    return apiRequest("/auth/verify/email/resend", {
      method: "POST",
      body: payload,
    });
  };

  const requestPasswordReset = async (payload) => {
    return apiRequest("/auth/password/forgot", {
      method: "POST",
      body: payload,
    });
  };

  const resetPassword = async (payload) => {
    const response = await apiRequest("/auth/password/reset", {
      method: "POST",
      body: payload,
    });

    return consumeAuthResponse(response);
  };

  const exchangeSocialLoginCode = async (code) => {
    const response = await apiRequest("/auth/social/exchange", {
      method: "POST",
      body: { code },
    });

    return consumeAuthResponse(response);
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const refreshUser = async () => {
    if (!token) {
      return null;
    }

    const response = await apiRequest("/auth/me", { token });
    setUser(response.user);
    return response.user;
  };

  const updateLocalUser = (nextUser) => {
    setUser(nextUser);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        login,
        register,
        registerWithPhone,
        requestPhoneOtp,
        verifyPhoneOtp,
        verifyEmailOtp,
        resendEmailVerification,
        requestPasswordReset,
        resetPassword,
        exchangeSocialLoginCode,
        logout,
        refreshUser,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return value;
};
