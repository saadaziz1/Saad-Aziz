import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { env } from "./config/env.config.js";

connectDB();

app.listen(env.port, () => {
  console.log(`🚀 Server running on port ${env.port}`);
});
