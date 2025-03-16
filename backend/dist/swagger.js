const swaggerJSDoc = require('swagger-jsdoc');
const { config } = require('./config/config');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.1',
    description: 'My API Description',
  },
  servers: [
    {
      url: `https://pethealthplatform-api-uat.azurewebsites.net:${config.port}/api`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'authorization',  
      }
    }
  },
  security: [{
    JWT: []
  }]
};

const options = {
  failOnErrors: true,
  swaggerDefinition,
  apis: ['./routes/**/*.js'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
console.log(swaggerSpec);

module.exports = swaggerSpec;