import express from "express";
import { AnalyticsController } from "./analytics.controller.js";
import { AnalyticsService } from "./analytics.service.js";
import { UserRepository } from "../users/user.repository.js";
import { VideoRepository } from "../videos/video.repository.js";
import { SubscriptionRepository } from "../subscriptions/subscription.repository.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = express.Router();

const userRepo = new UserRepository();
const videoRepo = new VideoRepository();
const subscriptionRepo = new SubscriptionRepository();
const analyticsService = new AnalyticsService(userRepo, videoRepo, subscriptionRepo);
const analyticsController = new AnalyticsController(analyticsService);

router.get("/dashboard", authMiddleware, roleMiddleware("SUPER_ADMIN"), asyncHandler(analyticsController.getDashboardStats));

export default router;