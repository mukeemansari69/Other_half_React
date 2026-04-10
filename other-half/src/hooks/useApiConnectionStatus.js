import { useEffect, useState } from "react";

import { checkApiConnection } from "../lib/api.js";

const CHECKING_STATUS = {
  state: "checking",
  message: "Checking backend connection...",
};

export const useApiConnectionStatus = () => {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState(CHECKING_STATUS);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const verifyConnection = async () => {
      setStatus(CHECKING_STATUS);

      try {
        await checkApiConnection({ signal: controller.signal });

        if (isActive) {
          setStatus({
            state: "connected",
            message: "Backend connected. Authentication is ready.",
          });
        }
      } catch (error) {
        if (!isActive || controller.signal.aborted) {
          return;
        }

        setStatus({
          state: "error",
          message: error.message || "Unable to reach the server right now.",
        });
      }
    };

    verifyConnection();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [attempt]);

  return {
    status,
    retry: () => setAttempt((currentAttempt) => currentAttempt + 1),
  };
};
