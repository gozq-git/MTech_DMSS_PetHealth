"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const { verifyJWT } = require('../utils/user_verification');
exports.routes = express_1.default.Router();
exports.routes.use(verifyJWT);
((0, fs_1.readdirSync)(__dirname)).forEach(routeName => {
    if (routeName === 'index.js')
        return;
    const route = require(`./${routeName}/${routeName}`)[routeName];
    exports.routes.use(`/${routeName}`, route);
});
