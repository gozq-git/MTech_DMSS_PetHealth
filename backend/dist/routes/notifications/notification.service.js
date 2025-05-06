"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const logger = require('../../utils/logger');
const models = db_1.sequelize.models;
const NotificationServices = {
    getAllEmails: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield models.USERS.findAll({
                attributes: ['email'], // Select only the 'email' column
            });
            return users.map(user => user.email); // Extract and return an array of email addresses
        }
        catch (error) {
            logger.error("Error retrieving emails from USERS table:", error);
            throw new Error("Failed to retrieve emails");
        }
    }),
};
exports.default = NotificationServices;
