import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createBudget,
  deleteBudget,
  listBudgets,
  updateBudget,
} from "../controllers/budget.controller.js";
import {
  validate,
  validateObjectId,
  validateQuery,
} from "../middlewares/validate.middleware.js";
import {
  createBudgetSchema,
  listBudgetsQuerySchema,
  updateBudgetSchema,
} from "../validators/budget.validator.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", validate(createBudgetSchema), createBudget);
router.get("/", validateQuery(listBudgetsQuerySchema), listBudgets);

router.patch(
  "/:id",
  validateObjectId,
  validate(updateBudgetSchema),
  updateBudget,
);

router.delete("/:id", validateObjectId, deleteBudget);

export default router;
