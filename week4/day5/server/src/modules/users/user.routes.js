import express from "express";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserRepository } from "./user.repository.js";
import { SubscriptionRepository } from "../subscriptions/subscription.repository.js";
import { SubscriptionService } from "../subscriptions/subscription.service.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

const router = express.Router();

const userRepo = new UserRepository();
const subscriptionRepo = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepo);
const userService = new UserService(userRepo, subscriptionService);
const userController = new UserController(userService);

// Super Admin only
router.get("/", authMiddleware, roleMiddleware("SUPER_ADMIN"), asyncHandler(userController.listUsers));

// User profile routes
router.get("/profile", authMiddleware, asyncHandler(userController.getProfile));
router.put("/profile", authMiddleware, asyncHandler(userController.updateProfile));

router.patch("/toggle-block/:id", authMiddleware, roleMiddleware("SUPER_ADMIN"), asyncHandler(userController.toggleBlockUser));

router.patch("/toggle-role/:id", authMiddleware, roleMiddleware("SUPER_ADMIN"), asyncHandler(userController.toggleRoleUser));

export default router;
