import jwt from "jsonwebtoken";
import {
  REFRESH_TIME,
  generateRefreshToken,
  hashToken,
  refreshCookieOptions,
} from "./refreshToken.js";
import RefreshToken from "../models/RefreshToken.model.js";
import RefreshFamily from "../models/RefreshFamily.model.js";
import mongoose from "mongoose";

const ACCESS_TIME = 5 * 60;

export const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", // sameSite: "none", secure:true  when we deploy
  maxAge: ACCESS_TIME * 1000,
  path: "/",
};

export const signAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_KEY, {
    expiresIn: ACCESS_TIME,
  });
};

export const createRefreshToken = async (familyId, session) => {
  const rawToken = generateRefreshToken();
  const tokenHash = hashToken(rawToken);

  await RefreshToken.create(
    [
      {
        family: familyId,
        tokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TIME * 1000),
      },
    ],
    { session },
  );

  return rawToken;
};

export const issueAuthToken = async (res, user, deviceInfo) => {
  const session = await mongoose.startSession();
  let rawToken;
  try {
    await session.withTransaction(async () => {
      const [family] = await RefreshFamily.create(
        [
          {
            user: user._id,
            expiresAt: new Date(Date.now() + REFRESH_TIME * 1000),
            deviceInfo,
          },
        ],
        { session },
      );
      rawToken = await createRefreshToken(family._id, session);
    });
  } finally {
    await session.endSession();
  }

  res.cookie("accessToken", signAccessToken(user._id), accessCookieOptions);

  res.cookie("refreshToken", rawToken, refreshCookieOptions);
};
