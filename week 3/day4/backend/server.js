// Load .env first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Swagger spec
const swaggerSpec = require("./docs/swagger");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB (safe for Vercel)
connectDB()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
  });

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/stats", require("./routes/stats.route"));
app.use("/api/members", require("./routes/member.routes"));
app.use("/api/projects", require("./routes/project.routes"));

// Swagger JSON
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Swagger HTML
app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "swagger.html"));
});

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Project Manager API is running",
    docs: "/api-docs",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res
    .status(500)
    .json({ success: false, message: err.message || "Something went wrong!" });
});

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


module.exports = app;

