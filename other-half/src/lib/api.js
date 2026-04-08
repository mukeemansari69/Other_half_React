const TOKEN_STORAGE_KEY = "other-half-auth-token";
const UNREACHABLE_SERVER_MESSAGE =
  "Unable to reach the server right now. Make sure the backend is running with `npm run dev:server`.";

const normalizeBaseUrl = (value = "") => value.trim().replace(/\/$/, "");

const isLikelyHtmlResponse = (payload) => {
  return (
    typeof payload === "string" &&
    /<!doctype html>|<html[\s>]/i.test(payload)
  );
};

const getApiBaseCandidates = () => {
  const candidates = [];
  const addCandidate = (value) => {
    const normalizedValue = normalizeBaseUrl(value);

    if (!normalizedValue || candidates.includes(normalizedValue)) {
      return;
    }

    candidates.push(normalizedValue);
  };

  addCandidate(import.meta.env.VITE_API_BASE_URL || "");
  addCandidate("/api");

  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    const browserProtocol = protocol === "https:" ? "https:" : "http:";
    const localHosts = ["localhost", "127.0.0.1"];

    if (hostname) {
      addCandidate(`${browserProtocol}//${hostname}:4000/api`);
      addCandidate(`http://${hostname}:4000/api`);
    }

    localHosts.forEach((host) => {
      addCandidate(`${browserProtocol}//${host}:4000/api`);
      addCandidate(`http://${host}:4000/api`);
    });
  }

  if (candidates.length === 0) {
    addCandidate("/api");
  }

  return candidates;
};

export const API_BASE_URL = getApiBaseCandidates()[0];

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

    return payload;
  }

  throw lastError || new ApiError(UNREACHABLE_SERVER_MESSAGE, null, null);
};
