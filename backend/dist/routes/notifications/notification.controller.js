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
const logger = require('../../utils/logger');
const notification_service_1 = __importDefault(require("./notification.service"));
const templates_1 = require("../../models/email_template/templates");
const zohomail_notification_1 = require("../../models/notification/zohomail_notification");
const ntfy_notification_1 = require("../../models/notification/ntfy_notification");
function sendZohoMailNotification(to, subject, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const emailTemplate = templates_1.emailTemplates.defaultEmailTemplate(to, to.split('@')[0], subject, message);
        const zohoNotification = new zohomail_notification_1.ZohomailNotification(to, emailTemplate.subject, emailTemplate.body);
        yield zohoNotification.sendNotification();
        return zohoNotification;
    });
}
function sendCustomNotification(engine, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (engine) {
            case 'ntfy':
                logger.info("Sending notification using ntfy engine");
                const ntfyEngine = new ntfy_notification_1.NtfyNotification(notification);
                yield ntfyEngine.sendNotification();
                break;
            default:
                logger.error("Unsupported engine type");
        }
    });
}
const UsersController = {
    sendNotification: (to_1, subject_1, message_1, ...args_1) => __awaiter(void 0, [to_1, subject_1, message_1, ...args_1], void 0, function* (to, subject, message, engines = []) {
        try {
            // Default zohoMail notification
            const notificationDecorator = yield sendZohoMailNotification(to, subject, message);
            logger.info(`Email sent to ${to}`);
            for (const engine of engines) {
                yield sendCustomNotification(engine, notificationDecorator);
            }
            return;
        }
        catch (error) {
            logger.error("Error sending email:", error);
            throw error;
        }
    }),
    sendBroadcast: (to_1, subject_1, message_1, ...args_1) => __awaiter(void 0, [to_1, subject_1, message_1, ...args_1], void 0, function* (to, subject, message, engines = []) {
        try {
            // Default zohoMail notification
            if (to[0] === "all") {
                to = yield notification_service_1.default.getAllEmails();
            }
            for (const recipient of to) {
                const notificationDecorator = yield sendZohoMailNotification(recipient, subject, message);
                logger.info(`Email sent to ${to}`);
                for (const engine of engines) {
                    yield sendCustomNotification(engine, notificationDecorator);
                }
            }
            return;
        }
        catch (error) {
            logger.error("Error sending email:", error);
            throw error;
        }
    }),
};
exports.default = UsersController;
