import { z } from "zod";
import { amountRule, categoryRule, monthRule } from "./common.validator.js";

export const createBudgetSchema = z.strictObject({
  category: categoryRule,
  limitAmount: amountRule,
  month: monthRule,
});

export const listBudgetsQuerySchema = z.strictObject({
  month: monthRule.optional(),
});

export const updateBudgetSchema = z.strictObject({
  limitAmount: amountRule,
});
