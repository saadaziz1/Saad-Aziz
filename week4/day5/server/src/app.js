import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { registerRoutes } from "./routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

registerRoutes(app);

// Swagger docs
app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "swagger.html"));
});

app.get("/api-docs/swagger.json", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "swagger.json"));
});

app.use(errorMiddleware);

export default app;
