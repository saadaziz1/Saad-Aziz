

// Use environment variable or fallback to localhost
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {           // <-- must be 'definition', not 'swaggerDefinition'
    openapi: '3.0.0',
    info: {
      title: 'Tea E-commerce API',
      version: '1.0.0',
      description: `API documentation for Tea E-commerce platform  
Super admin credentials for testing:  
**Email:** admin@teacommerce.com  
**Password:** admin123  
(this Super admin was manually seeded by running  seeding scripts using env in the backend )`
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Products', description: 'Product management' },
      { name: 'Cart', description: 'Shopping cart operations' },
      { name: 'Orders', description: 'Order management' },
      { name: 'Users', description: 'User management (Admin)' },
      { name: 'Dashboard', description: 'Analytics and dashboard' },
      { name: 'Admin', description: 'Role management (Superadmin)' }
    ],
    servers: [
      { url: 'https://week3-day5.vercel.app' }, // adjust for production
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // path to your annotated route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

