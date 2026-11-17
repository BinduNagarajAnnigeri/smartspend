import User from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import {
  accessCookieOptions,
  createRefreshToken,
  issueAuthToken,
  signAccessToken,
} from "../utils/accessToken.js";
import { hashToken, refreshCookieOptions } from "../utils/refreshToken.js";
import RefreshToken from "../models/RefreshToken.model.js";
import RefreshFamily from "../models/RefreshFamily.model.js";
import { FAMILY_STATUS, TOKEN_STATUS } from "../constants/authStatus.js";
import mongoose from "mongoose";

export const signup = async (req, res) => {
  const { username, fullname, email, password } = req.body;

  const isUserExists = await User.findOne({ $or: [{ username }, { email }] });

  if (isUserExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashPwd = await hashPassword(password);
  const newUser = await User.create({
    username,
    fullname,
    email,
    password: hashPwd,
  });

  await issueAuthToken(res, newUser);

  return res.status(201).json({
    message: "User created successfully",
    user: {
      username: newUser.username,
      fullname: {
        firstname: newUser.fullname.firstname,
        lastname: newUser.fullname.lastname,
      },
      email: newUser.email,
    },
  });
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPassword = await verifyPassword(user.password, password);

  if (!isPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const deviceInfo = {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  };

  await issueAuthToken(res, user, deviceInfo);

  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      username: user.username,
      email: user.email,
      fullname: {
        firstname: user.fullname.firstname,
        lastname: user.fullname.lastname,
      },
    },
  });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.userId).select(
    "username fullname email",
  );

  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  return res.status(200).json({
    user,
  });
};

export const updateUser = async (req, res) => {
  const update = {};

  if (req.body.firstname) update["fullname.firstname"] = req.body.firstname;
  if (req.body.lastname) update["fullname.lastname"] = req.body.lastname;
  if (req.body.avatar) update.avatar = req.body.avatar;

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: update,
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  return res.status(200).json({ message: "User updated successfully", user });
};

const unauthorized = (res) => {
  res.clearCookie("accessToken", accessCookieOptions);
  res.clearCookie("refreshToken", refreshCookieOptions);
  return res.status(401).json({ message: "Unauthorized" });
};
export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) return unauthorized(res);

  const record = await RefreshToken.findOne({
    tokenHash: hashToken(refreshToken),
  });

  if (!record) return unauthorized(res);

  if (record.status === TOKEN_STATUS.REVOKED) return unauthorized(res);

  if (record.status === TOKEN_STATUS.USED) {
    await RefreshFamily.updateOne(
      { _id: record.family },
      {
        $set: {
          status: FAMILY_STATUS.COMPROMISED,
          revokedAt: new Date(),
        },
      },
    );

    await RefreshToken.updateMany(
      { family: record.family, status: TOKEN_STATUS.ACTIVE },
      { $set: { status: TOKEN_STATUS.REVOKED } },
    );

    return unauthorized(res);
  }

  if (record.expiresAt < new Date()) return unauthorized(res);

  const family = await RefreshFamily.findById(record.family);
  if (!family) return unauthorized(res);

  if (family.status !== FAMILY_STATUS.ACTIVE) return unauthorized(res);

  if (family.expiresAt < new Date()) return unauthorized(res);

  const session = await mongoose.startSession();

  let rawToken;
  let rotationFailed = false;
  try {
    await session.withTransaction(async () => {
      const updatedRecord = await RefreshToken.findOneAndUpdate(
        {
          _id: record._id,
          status: TOKEN_STATUS.ACTIVE,
        },
        {
          $set: {
            status: TOKEN_STATUS.USED,
            usedAt: new Date(),
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedRecord) {
        rotationFailed = true;
        return;
      }

      rawToken = await createRefreshToken(family._id, session);
    });
  } finally {
    await session.endSession();
  }

  if (rotationFailed || !rawToken)
    return res.status(401).json({ message: "Refresh Token already used" });

  res.cookie("accessToken", signAccessToken(family.user), accessCookieOptions);
  res.cookie("refreshToken", rawToken, refreshCookieOptions);

  return res.status(200).json({ message: "Token refreshed" });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  try {
    if (refreshToken) {
      const record = await RefreshToken.findOne({
        tokenHash: hashToken(refreshToken),
      });

      if (record) {
        await RefreshFamily.updateOne(
          { _id: record.family, status: FAMILY_STATUS.ACTIVE },
          {
            $set: {
              status: FAMILY_STATUS.REVOKED,
              revokedAt: new Date(),
            },
          },
        );

        await RefreshToken.updateMany(
          { family: record.family, status: TOKEN_STATUS.ACTIVE },
          { $set: { status: TOKEN_STATUS.REVOKED } },
        );
      }

      res.clearCookie("accessToken", accessCookieOptions);
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(200).json({ message: "Logged out successfully" });
    }
  } catch (err) {
    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};
