import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task manager API',
      version: '1.0.0',
      description: 'API documentation',
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'tasks', description: 'task management' },
    ],
    servers: [
      {
        url: 'https://week4-day1-backend.vercel.app',
      },
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
  apis: ['./src/modules/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
