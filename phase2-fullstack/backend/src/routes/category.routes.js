import express from "express";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  validate,
  validateObjectId,
} from "../middlewares/validate.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategoryByID,
  listCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();
router.use(requireAuth);

router.post("/", validate(createCategorySchema), createCategory);

router.get("/", listCategory);

router.patch(
  "/:id",
  validateObjectId,
  validate(updateCategorySchema),
  updateCategory,
);

router.get("/:id", validateObjectId, getCategoryByID);

router.delete("/:id", validateObjectId, deleteCategory);
export default router;
