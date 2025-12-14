import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  algorithm: 'HS256'
};

export const jwtOptions = {
  expiresIn: jwtConfig.expiresIn,
  algorithm: jwtConfig.algorithm
};