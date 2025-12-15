import app from './app.js';
import { connectDB } from './modules/config/db.js';

// Initialize database connection
connectDB().catch(console.error);

// // For local development
// if (!process.env.VERCEL) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

// Export for Vercel serverless
export default app;