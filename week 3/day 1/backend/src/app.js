const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const taskRoutes = require('./routes/tasks');
const { getTaskStats } = require('./controllers/taskController');

// Create Express app
const app = express();

// Load Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', getTaskStats)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Welcome route - Redirect to API docs
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;