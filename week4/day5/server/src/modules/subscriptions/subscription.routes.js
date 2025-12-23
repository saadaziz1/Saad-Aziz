import express from "express";
import { SubscriptionController } from "./subscription.controller.js";
import { SubscriptionService } from "./subscription.service.js";
import { SubscriptionRepository } from "./subscription.repository.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { planActivationValidator, freeTrialValidator } from "./subscription.validators.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();

const subscriptionRepo = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepo);
const subscriptionController = new SubscriptionController(subscriptionService);

router.post("/free-trial", authMiddleware, freeTrialValidator, validate, asyncHandler(subscriptionController.activateFreeTrial));

router.post("/plan", authMiddleware, planActivationValidator, validate, asyncHandler(subscriptionController.activatePaidPlan));

router.get("/check", authMiddleware, asyncHandler(subscriptionController.getMySubscription));

router.patch("/cancel", authMiddleware, asyncHandler(subscriptionController.cancelSubscription));

export default router;
