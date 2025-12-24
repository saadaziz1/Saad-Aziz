// app.js
require('dotenv').config();
const http = require('http');
const express = require('express');

const app = express();

app.use(express.json()); // parses application/json
app.use(express.urlencoded({ extended: true }));


const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require("path");

// Swagger spec
const swaggerSpec = require("./docs/swagger");

const PORT = process.env.PORT || 5000;


// Global middlewares
app.use(helmet());
app.use(cors()); // customize origin when you wire frontend

app.use(cookieParser());
app.use(morgan('dev'));

// Swagger JSON spec
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Standard OpenAPI JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

// Swagger HTML
app.get("/api-docs", (req, res) => {
    res.setHeader("Content-Security-Policy", "");
  res.sendFile(path.join(__dirname, "docs", "swagger.html"));
});

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "Teacommerce API is running",
    docs: "/api-docs",
  });
});



// 404 handler for unknown routes
app.use(notFound);

// Central error handler
app.use(errorHandler);

// Connect to DB and start server
async function start() {
  try {
    await connectDB();
    // const server = http.createServer(app);
    // server.listen(PORT, () => {
    //   console.log(`Server running on http://localhost:${PORT}`);
    // });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

module.exports = app;
