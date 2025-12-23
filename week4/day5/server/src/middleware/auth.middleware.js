import { ApiError } from "../shared/errors/ApiError.js";
import { verifyToken } from "../shared/utils/jwt.util.js";
import User from "../modules/users/user.model.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(401, "Authorization token missing")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    if (user.isBlocked) {
      return next(new ApiError(403, "User is blocked"));
    }

    req.user = {
      id: user._id,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
