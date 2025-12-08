// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Swagger spec
const swaggerSpec = require("./docs/swagger");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(express.json());

// Connect to DB
connectDB();


// Serve Swagger JSON for Swagger UI

app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});


// Serve swagger.html via /api-docs

app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "swagger.html"));
});


// API Routes

app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));


// Root route

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Task Manager API",
    docs: "/api-docs",
  });
});

// Export for Vercel
module.exports = app;
