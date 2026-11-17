import mongoose from "mongoose";
import { MAX_AMOUNT_PAISE } from "../constants/limits.js";
import { MONTH_PATTERN } from "../constants/pattern.js";
import { z } from "zod";

export const categoryRule = z
  .string()
  .refine((val) => mongoose.isObjectIdOrHexString(val), {
    message: "Invalid category id",
  });

export const amountRule = z
  .number()
  .int("Amount must be a whole number in paise")
  .positive("Amount must be greater than zero")
  .max(MAX_AMOUNT_PAISE, "Amount is too large");

export const monthRule = z
  .string()
  .regex(MONTH_PATTERN, "Invalid month. Use YYYY-MM format with a valid year");
