// src/index.ts
const { config } = require('./config/config');
const logger = require('./utils/logger');
import express, { Express, Request, Response } from "express";
import { routes } from './routes';


const app: Express = express();
const port = config.port;

app.use('/api', routes);

switch (config.env) {
  case 'production':
    
    break;
    
    default: // development
    logger.info('Loading Swagger UI');
    const swaggerUI = require("swagger-ui-express");
    const swaggerSpec = require('./swagger');
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    
    break;
}

app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port} in ${config.env} mode`);
});