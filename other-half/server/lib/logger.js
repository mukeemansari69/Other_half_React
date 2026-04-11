import { randomUUID } from "node:crypto";

const APP_NAME = "other-half-api";

const serializeError = (error) => {
  if (!error) {
    return null;
  }

  return {
    name: error.name || "Error",
    message: error.message || "Unexpected error",
    stack: error.stack || "",
    statusCode: error.statusCode || null,
    code: error.code || null,
  };
};

const writeLog = (level, event, details = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    service: APP_NAME,
    ...details,
  };
  const payload = JSON.stringify(entry);

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.log(payload);
};

export const logInfo = (event, details = {}) => {
  writeLog("info", event, details);
};

export const logWarn = (event, details = {}) => {
  writeLog("warn", event, details);
};

export const logError = (event, details = {}) => {
  writeLog("error", event, {
    ...details,
    error: serializeError(details.error),
  });
};

export const createRequestLogger = () => {
  return (req, res, next) => {
    const requestIdHeader = String(req.headers["x-request-id"] || "").trim();
    const requestId = requestIdHeader || randomUUID();
    const startedAt = process.hrtime.bigint();

    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const logLevel =
        res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
      const details = {
        requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(1)),
        ip: req.ip || req.socket?.remoteAddress || "",
        userAgent: String(req.headers["user-agent"] || ""),
      };

      if (logLevel === "error") {
        logError("request.completed", details);
        return;
      }

      if (logLevel === "warn") {
        logWarn("request.completed", details);
        return;
      }

      logInfo("request.completed", details);
    });

    next();
  };
};
