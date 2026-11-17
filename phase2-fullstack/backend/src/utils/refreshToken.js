import crypto from "crypto";

export const REFRESH_TIME = 7 * 24 * 60 * 60;

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: REFRESH_TIME * 1000,
  path: "/api/auth",
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
