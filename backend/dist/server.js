"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const swaggerSpec = require('./swagger');
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use('/api', routes_1.routes);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
