import { ApiError } from "../shared/errors/ApiError.js";

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details
    });
  }

  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
};
