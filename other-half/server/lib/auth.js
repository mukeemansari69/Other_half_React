import "../loadEnv.js";
import jwt from "jsonwebtoken";

import { readDatabase, sanitizeUser } from "./database.js";

const DEFAULT_JWT_SECRET = "other-half-dev-secret";
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
const TOKEN_EXPIRY = "7d";

if (
  process.env.NODE_ENV === "production" &&
  JWT_SECRET === DEFAULT_JWT_SECRET
) {
  throw new Error(
    "JWT_SECRET must be set to a strong value before starting the server in production."
  );
}

const getBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
};

export const signAuthToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: "Please log in to continue." });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const database = await readDatabase();
    const user = database.users.find((candidate) => candidate.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }

    req.user = user;
    req.safeUser = sanitizeUser(user);
    return next();
  } catch {
    return res.status(401).json({ message: "Your session expired. Please sign in again." });
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return next();
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const database = await readDatabase();
    const user = database.users.find((candidate) => candidate.id === payload.sub);

    if (user) {
      req.user = user;
      req.safeUser = sanitizeUser(user);
    }

    return next();
  } catch {
    return next();
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access is required for this action." });
  }

  return next();
};
