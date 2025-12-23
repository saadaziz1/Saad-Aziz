import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRES_IN,
  cardKey: process.env.CARD_ENCRYPTION_KEY,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`
};
