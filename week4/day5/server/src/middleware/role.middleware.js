import { ApiError } from "../shared/errors/ApiError.js";

export const roleMiddleware = requiredRole => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return next(
        new ApiError(403, "Access denied")
      );
    }
    next();
  };
};
