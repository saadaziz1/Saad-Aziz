import express from "express";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";

import {
  registerValidator,
  loginValidator
} from "./auth.validator.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authRateLimiter } from "../../middleware/rateLimit.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = express.Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post(
  "/register",
  authRateLimiter,
  registerValidator,
  validate,
  asyncHandler(authController.register)
);

router.post(
  "/login",
  authRateLimiter,
  loginValidator,
  validate,
  asyncHandler(authController.login)
);

export default router;
