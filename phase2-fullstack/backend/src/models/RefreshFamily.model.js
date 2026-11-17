import mongoose from "mongoose";
import {
  FAMILY_STATUS,
  FAMILY_STATUS_VALUES,
} from "../constants/authStatus.js";

const RefreshFamilySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: FAMILY_STATUS_VALUES,
      },
      default: FAMILY_STATUS.ACTIVE,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    deviceInfo: {
      ipAddress: {
        type: String,
      },
      userAgent: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

RefreshFamilySchema.index({ user: 1, status: 1 });

RefreshFamilySchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      status: { $in: [FAMILY_STATUS.ACTIVE, FAMILY_STATUS.REVOKED] },
    },
  },
);

const RefreshFamily = mongoose.model("RefreshFamily", RefreshFamilySchema);

export default RefreshFamily;
