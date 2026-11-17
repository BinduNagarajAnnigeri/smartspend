import express from "express";
import {
  getCategorySummary,
  getMonthlySummary,
  getBudgetSummary,
  getAlerts,
} from "../controllers/summary.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateQuery } from "../middlewares/validate.middleware.js";
import {
  categorySummaryQuerySchema,
  monthlySummaryQuerySchema,
} from "../validators/summary.validator.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", validateQuery(monthlySummaryQuerySchema), getMonthlySummary);

router.get(
  "/categories",
  validateQuery(categorySummaryQuerySchema),
  getCategorySummary,
);

router.get(
  "/budgets",
  validateQuery(monthlySummaryQuerySchema),
  getBudgetSummary,
);

router.get("/alerts", validateQuery(monthlySummaryQuerySchema), getAlerts);
export default router;
