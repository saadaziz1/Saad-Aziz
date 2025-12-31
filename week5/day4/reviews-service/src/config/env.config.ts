export const envConfig = () => ({
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
});
