import { z } from "zod";
import { CATEGORY_TYPE } from "../constants/categoryTypes.js";

const nameRule = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Category name is required")
  .max(50, "Category name cannot exceed 50 characters");

const colorRule = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color");

export const createCategorySchema = z.strictObject({
  name: nameRule,
  type: z.enum([CATEGORY_TYPE.EXPENSE, CATEGORY_TYPE.INCOME]),
  color: colorRule.optional(),
});

export const updateCategorySchema = z
  .strictObject({
    name: nameRule,
    color: colorRule,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
