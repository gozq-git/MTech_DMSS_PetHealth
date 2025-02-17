"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const { config } = require('./config/config');
const logger = require('./utils/logger');
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const port = config.port;
app.use('/api', routes_1.routes);
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
