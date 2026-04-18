import { useEffect, useState } from "react";

import { apiRequest } from "../lib/api.js";

const defaultAuthConfig = {
  passwordMinLength: 8,
  otpLength: 6,
  otpExpiresInMinutes: 5,
  delivery: {
    emailConfigured: false,
    smsConfigured: false,
    smsProvider: "",
  },
  social: {
    google: { enabled: false },
    facebook: { enabled: false },
  },
  developmentDebugCodes: false,
};

export const useAuthConfig = () => {
  const [config, setConfig] = useState(defaultAuthConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadConfig = async () => {
      setLoading(true);

      try {
        const response = await apiRequest("/auth/config");

        if (isActive) {
          setConfig({
            ...defaultAuthConfig,
            ...response,
          });
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(requestError.message || "Authentication settings could not be loaded.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadConfig();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    config,
    loading,
    error,
  };
};
