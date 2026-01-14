import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().default('7d'),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  GITHUB_CLIENT_ID: Joi.string().optional(),
  GITHUB_CLIENT_SECRET: Joi.string().optional(),
  DISCORD_CLIENT_ID: Joi.string().optional(),
  DISCORD_CLIENT_SECRET: Joi.string().optional(),
  BACKEND_URL: Joi.string().default('http://localhost:4000'),
  FRONTEND_URL: Joi.string().default('http://localhost:3000'),
});
