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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("./users.service"));
const logger = require('../../utils/logger');
const zohomail_notification_1 = require("../../models/notification/zohomail_notification");
const templates_1 = require("../../models/email_template/templates");
const UsersController = {
    retrieveUser: (preferred_username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield users_service_1.default.retrieveUser(preferred_username);
            return user;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error retrieving user");
        }
    }),
    registerUser: (body) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield users_service_1.default.registerUser(body);
            const emailTemplate = templates_1.emailTemplates.welcomeEmailTemplate(user.email, user.display_name);
            const notification = new zohomail_notification_1.ZohomailNotification(user.email, emailTemplate.subject, emailTemplate.body);
            notification.sendEmail();
            return user;
        }
        catch (error) {
            logger.error(error);
            throw error;
        }
    }),
    updateUser: (body) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield users_service_1.default.updateUser(body);
            return user;
        }
        catch (error) {
            logger.error(error);
            throw error;
        }
    }),
    deleteUser: (account_name) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield users_service_1.default.deleteUser(account_name);
            return user;
        }
        catch (error) {
            logger.error(error);
            throw error;
        }
    }),
};
exports.default = UsersController;
