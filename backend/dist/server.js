"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const { config } = require('./config/config');
const logger = require('./utils/logger');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const wss = require('./utils/wss');
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use(body_parser_1.default.json());
const port = config.port;
app.use((0, cors_1.default)());
app.use('/api', routes_1.routes);
wss.init(config.wssport);
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
