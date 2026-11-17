import { z } from "zod";
import { monthRule } from "./common.validator.js";
import { CATEGORY_TYPE } from "../constants/categoryTypes.js";

const getCurrentMonth = () => {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;

  return `${year}-${month}`;
};

export const monthlySummaryQuerySchema = z.strictObject({
  month: monthRule.default(getCurrentMonth),
});

export const categorySummaryQuerySchema = monthlySummaryQuerySchema.extend({
  type: z
    .enum([CATEGORY_TYPE.EXPENSE, CATEGORY_TYPE.INCOME])
    .default(CATEGORY_TYPE.EXPENSE),
});
