import express from "express";
import multer from "multer";
import { VideoController } from "./video.controller.js";
import { VideoService } from "./video.service.js";
import { VideoRepository } from "./video.repository.js";
import { SubscriptionService } from "../subscriptions/subscription.service.js";
import { SubscriptionRepository } from "../subscriptions/subscription.repository.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { roleMiddleware } from "../../middleware/role.middleware.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { uploadVideoValidator, updateVideoValidator } from "./video.validators.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const subscriptionRepo = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepo);
const videoRepo = new VideoRepository();
const videoService = new VideoService(videoRepo, subscriptionService);
const videoController = new VideoController(videoService);

// Public
router.get("/", asyncHandler(videoController.listVideos));
router.get("/:id", asyncHandler(videoController.getVideo));

// Protected streaming
router.get("/stream/:id", authMiddleware, asyncHandler(videoController.streamVideo));

// Admin (Super Admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  upload.fields([{ name: "video" }, { name: "thumbnail" }, { name: "directorImage" }]),
  uploadVideoValidator,
  validate,
  asyncHandler(videoController.uploadVideo)
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  upload.fields([{ name: "video" }, { name: "thumbnail" }, { name: "directorImage" }]),
  updateVideoValidator,
  validate,
  asyncHandler(videoController.updateVideo)
);

router.delete("/:id", authMiddleware, roleMiddleware("SUPER_ADMIN"), asyncHandler(videoController.deleteVideo));

export default router;
