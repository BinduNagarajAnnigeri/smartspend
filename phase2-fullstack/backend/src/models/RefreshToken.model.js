import mongoose from "mongoose";
import { TOKEN_STATUS_VALUES, TOKEN_STATUS } from "../constants/authStatus.js";

const RefreshTokenSchema = new mongoose.Schema(
  {
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RefreshFamily",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: { values: TOKEN_STATUS_VALUES },
      default: TOKEN_STATUS.ACTIVE,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

RefreshTokenSchema.index({ tokenHash: 1 }, { unique: true });

RefreshTokenSchema.index({ family: 1, status: 1 });

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
