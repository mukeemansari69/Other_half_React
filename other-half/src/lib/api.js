const TOKEN_STORAGE_KEY = "other-half-auth-token";
const UNREACHABLE_SERVER_MESSAGE =
  "Unable to reach the server right now. Make sure the backend is running with `npm run dev:server`.";
let resolvedApiBaseUrl = "";

const normalizeBaseUrl = (value = "") => value.trim().replace(/\/$/, "");
const isAbsoluteUrl = (value = "") => /^https?:\/\//i.test(value);
const isBrowserSecureContext = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";
const isLocalHost = (hostname = "") => ["localhost", "127.0.0.1"].includes(hostname);
const canUseInsecureLocalApi = (hostname = "") =>
  typeof window !== "undefined" &&
  !isBrowserSecureContext() &&
  (isLocalHost(window.location.hostname) || isLocalHost(hostname));
const canUseConfiguredApiBaseUrl = (value = "") => {
  const normalizedValue = normalizeBaseUrl(value);

  if (!normalizedValue) {
    return false;
  }

  if (!isAbsoluteUrl(normalizedValue)) {
    return true;
  }

  try {
    const parsedUrl = new URL(normalizedValue);

    if (parsedUrl.protocol === "https:") {
      return true;
    }

    return canUseInsecureLocalApi(parsedUrl.hostname);
  } catch {
    return false;
  }
};

const isLikelyHtmlResponse = (payload) => {
  return (
    typeof payload === "string" &&
    /<!doctype html>|<html[\s>]/i.test(payload)
  );
};

export const getApiBaseCandidates = () => {
  const candidates = [];
  const addCandidate = (value) => {
    const normalizedValue = normalizeBaseUrl(value);

    if (!normalizedValue || candidates.includes(normalizedValue)) {
      return;
    }

    candidates.push(normalizedValue);
  };

  addCandidate("/api");
  const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  if (canUseConfiguredApiBaseUrl(configuredApiBaseUrl)) {
    addCandidate(configuredApiBaseUrl);
  }

  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    const browserProtocol = protocol === "https:" ? "https:" : "http:";
    const localHosts = ["localhost", "127.0.0.1"];

    if (isLocalHost(hostname)) {
      addCandidate(`${browserProtocol}//${hostname}:4000/api`);
      if (canUseInsecureLocalApi(hostname)) {
        addCandidate(`http://${hostname}:4000/api`);
      }
    }

    localHosts.forEach((host) => {
      addCandidate(`${browserProtocol}//${host}:4000/api`);
      if (canUseInsecureLocalApi(host)) {
        addCandidate(`http://${host}:4000/api`);
      }
    });
  }

  if (candidates.length === 0) {
    addCandidate("/api");
  }

  return candidates;
};

export const API_BASE_URL = getApiBaseCandidates()[0];
export const getResolvedApiBaseUrl = () => resolvedApiBaseUrl || API_BASE_URL;

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getResolvedApiBaseUrl()}${normalizedPath}`;
};

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setStoredToken = (token) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const apiRequest = async (
  path,
  { method = "GET", body, headers = {}, token, signal } = {}
) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseCandidates = getApiBaseCandidates();
  let lastError = null;

  for (let index = 0; index < baseCandidates.length; index += 1) {
    const baseUrl = baseCandidates[index];
    const requestHeaders = { ...headers };
    const options = {
      method,
      headers: requestHeaders,
      signal,
    };

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    if (body instanceof FormData) {
      options.body = body;
    } else if (body !== undefined) {
      requestHeaders["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    let response;

    try {
      response = await fetch(`${baseUrl}${normalizedPath}`, options);
    } catch {
      lastError = new ApiError(UNREACHABLE_SERVER_MESSAGE, null, null);
      continue;
    }

    const contentType = response.headers.get("content-type") || "";
    const rawPayload = await response.text();
    const payload = contentType.includes("application/json")
      ? JSON.parse(rawPayload || "{}")
      : rawPayload;
    const shouldTryNextBase =
      index < baseCandidates.length - 1 &&
      (isLikelyHtmlResponse(payload) ||
        (!response.ok && (!contentType.includes("application/json") || response.status === 404)));

    if (shouldTryNextBase) {
      continue;
    }

    if (!response.ok) {
      throw new ApiError(
        payload?.message ||
          (typeof payload === "string" && payload.trim()) ||
          "The request could not be completed.",
        response.status,
        payload
      );
    }

    if (isLikelyHtmlResponse(payload)) {
      throw new ApiError(
        "API endpoint was not found. Please make sure the local backend server is running.",
        response.status,
        payload
      );
    }

    resolvedApiBaseUrl = baseUrl;

    return payload;
  }

  throw lastError || new ApiError(UNREACHABLE_SERVER_MESSAGE, null, null);
};

export const checkApiConnection = async ({ signal } = {}) => {
  return apiRequest("/health", { signal });
};
