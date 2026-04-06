const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Computer Store API',
      version: '1.0.0',
      description: 'API Documentation for Computer Store Backend',
      contact: {
        name: 'Computer Store Team',
        url: 'http://localhost:3000',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
      {
        url: 'http://backend:5000',
        description: 'Docker Development Server',
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
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Laptop Dell XPS 13' },
            brand: { type: 'string', example: 'Laptop' },
            price: { type: 'number', example: 999.99 },
            rating: { type: 'number', example: 4.5 },
            description: { type: 'string', example: 'High performance laptop' },
            image: { type: 'string', example: 'url-to-image' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            productId: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 2 },
            status: { type: 'string', example: 'pending', enum: ['pending', 'confirmed', 'shipped', 'delivered'] },
            totalPrice: { type: 'number', example: 1999.98 },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', example: 'user', enum: ['user', 'admin'] },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string', example: 'Error details' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
