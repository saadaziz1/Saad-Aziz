import jwt from "jsonwebtoken";
import { env } from "../../config/env.config.js";

export const generateToken = user => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiry }
  );
};

export const verifyToken = token => {
  return jwt.verify(token, env.jwtSecret);
};
