import { z } from "zod";
import { CATEGORY_TYPE } from "../constants/categoryTypes.js";
import { amountRule, categoryRule } from "./common.validator.js";

const noteRule = z.string().trim().max(500);

const dateRule = z.string().pipe(z.coerce.date());

export const createTransactionSchema = z.strictObject({
  amount: amountRule,
  type: z.enum([CATEGORY_TYPE.EXPENSE, CATEGORY_TYPE.INCOME]),
  category: categoryRule,
  date: dateRule.optional(),
  note: noteRule.optional(),
});

export const updateTransactionSchema = z
  .strictObject({
    amount: amountRule,
    note: noteRule,
    date: dateRule,
    category: categoryRule,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

const queryDateRule = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .pipe(z.coerce.date());

export const listTransactionsQuerySchema = z
  .strictObject({
    type: z.enum([CATEGORY_TYPE.EXPENSE, CATEGORY_TYPE.INCOME]).optional(),
    category: categoryRule.optional(),
    from: queryDateRule.optional(),
    to: queryDateRule.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: "'from' must be before or equal to 'to'",
    path: ["from"],
  })
  .refine((data) => (data.page - 1) * data.limit <= 100_000, {
    message: "Requested page is too large",
    path: ["page"],
  });
