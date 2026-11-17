import mongoose from "mongoose";
import { MAX_AMOUNT_PAISE } from "../constants/limits.js";
import { MONTH_PATTERN } from "../constants/pattern.js";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    limitAmount: {
      type: Number,
      required: true,
      min: 1,
      max: MAX_AMOUNT_PAISE,
      validate: {
        validator: Number.isSafeInteger,
        message: "Budget must be a positive whole number in paise",
      },
    },
    month: {
      type: String,
      required: true,
      match: MONTH_PATTERN,
    },
  },
  {
    timestamps: true,
  },
);

budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });
budgetSchema.index({ user: 1, month: 1 });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
