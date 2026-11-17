import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  validate,
  validateObjectId,
  validateQuery,
} from "../middlewares/validate.middleware.js";
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  updateTransactionSchema,
} from "../validators/transaction.validator.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", validate(createTransactionSchema), createTransaction);

router.get("/", validateQuery(listTransactionsQuerySchema), listTransactions);

router.get("/:id", validateObjectId, getTransactionById);

router.patch(
  "/:id",
  validateObjectId,
  validate(updateTransactionSchema),
  updateTransaction,
);

router.delete("/:id", validateObjectId, deleteTransaction);

export default router;
