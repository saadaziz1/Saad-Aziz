import authRoutes from "./modules/auth/auth.routes.js"; 
import userRoutes from "./modules/users/user.routes.js";
import videoRoutes from "./modules/videos/video.routes.js";
import subscriptionRoutes from "./modules/subscriptions/subscription.routes.js";

import analyticsRoutes from "./modules/analytics/analytics.routes.js";

export const registerRoutes = app => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/videos", videoRoutes);
  app.use("/api/subscriptions", subscriptionRoutes);
  app.use("/api/analytics", analyticsRoutes);
};

