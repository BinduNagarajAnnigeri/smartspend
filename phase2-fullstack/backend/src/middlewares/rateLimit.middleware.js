import { rateLimit } from "express-rate-limit";

export const authLimiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { status: "error", message: "Too many attempts. Try again later." },
});

export const authLimiterSignup = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { status: "error", message: "Too many attempts. Try again later." },
});
