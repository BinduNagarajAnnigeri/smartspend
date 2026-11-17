import mongoose from "mongoose";
import { CATEGORY_TYPE_VALUES } from "../constants/categoryTypes.js";
import { MAX_AMOUNT_PAISE } from "../constants/limits.js";

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: MAX_AMOUNT_PAISE,
      validate: {
        validator: Number.isSafeInteger,
        message: "Amount must be a positive whole number in paise",
      },
    },
    type: {
      type: String,
      enum: {
        values: CATEGORY_TYPE_VALUES,
      },
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxLength: 500,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
