const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.1',
    description: 'My API Description',
  },
  servers: [
    {
      url: 'http://localhost:8000/api',
      description: 'Development server',
    },
  ],
};

const options = {
  failOnErrors: true,
  swaggerDefinition,
  apis: ['./routes/**/*.js'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
console.log(swaggerSpec);

module.exports = swaggerSpec;