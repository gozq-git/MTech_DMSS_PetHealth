"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const { config } = require('./config/config');
const logger = require('./utils/logger');
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
let activeSockets = [];
io.on("connection", socket => {
    logger.info(`Socket connected: ${socket.id}`);
    const existingSocket = activeSockets.find(existingSocket => existingSocket === socket.id);
    if (!existingSocket) {
        activeSockets.push(socket.id);
        socket.emit("update-user-list", {
            users: activeSockets.filter(existingSocket => existingSocket !== socket.id)
        });
        socket.broadcast.emit("update-user-list", {
            users: [socket.id]
        });
    }
    socket.on("call-user", (data) => {
        socket.to(data.to).emit("call-made", {
            offer: data.offer,
            socket: socket.id
        });
    });
    socket.on("make-answer", data => {
        socket.to(data.to).emit("answer-made", {
            socket: socket.id,
            answer: data.answer
        });
    });
    socket.on("reject-call", data => {
        socket.to(data.from).emit("call-rejected", {
            socket: socket.id
        });
    });
    socket.on("disconnect", () => {
        activeSockets = activeSockets.filter(existingSocket => existingSocket !== socket.id);
        socket.broadcast.emit("remove-user", {
            socketId: socket.id
        });
    });
});
app.disable('x-powered-by');
app.use(body_parser_1.default.json());
const port = config.port;
app.use((0, cors_1.default)());
app.use('/api', routes_1.routes);
app.use('/', express_1.default.static(path_1.default.join(__dirname, "./public")));
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
httpServer.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port} in ${config.env} mode`);
});
