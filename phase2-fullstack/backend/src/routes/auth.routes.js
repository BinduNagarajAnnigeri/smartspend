import express from "express";
import {
  login,
  signup,
  getUser,
  refresh,
  logout,
  updateUser,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  signupSchema,
  updateUserSchema,
} from "../validators/auth.validator.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  authLimiterLogin,
  authLimiterSignup,
} from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", authLimiterSignup, validate(signupSchema), signup);
router.post("/login", authLimiterLogin, validate(loginSchema), login);
router.get("/me", requireAuth, getUser);
router.patch("/me", requireAuth, validate(updateUserSchema), updateUser);
router.post("/refresh", refresh);
router.post("/logout", logout);
export default router;
