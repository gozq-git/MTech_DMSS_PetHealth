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
exports.notifications = void 0;
const express_1 = __importDefault(require("express"));
const notification_controller_1 = __importDefault(require("./notification.controller"));
const logger = require('../../utils/logger');
exports.notifications = express_1.default.Router();
/**
 * @swagger
 * /notifications/sendNotification:
 *   post:
 *     summary: Send an email notification
 *     description: Sends an email notification using the EmailNotification class.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient email address
 *                 example: "example@example.com"
 *               subject:
 *                 type: string
 *                 description: Email subject
 *                 example: "Notification Subject"
 *               message:
 *                 type: string
 *                 description: Email message body
 *                 example: "This is a test notification."
 *               engines:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Engine(s) to send the notification through
 *                 example: ["ntfy"]
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email sent successfully."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.notifications.post('/sendNotification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { to, subject, message, engines } = req.body;
        if (!to || !subject || !message || !engines) {
            logger.error("Missing required fields in request body");
            res.status(400).json({ success: false, message: "Missing required fields: to, subject, or message" });
        }
        yield notification_controller_1.default.sendNotification(to, subject, message, engines);
        logger.info(`Notification sent to ${to}`);
        res.status(200).json({ success: true, message: "Notification sent successfully." });
    }
    catch (error) {
        logger.error("Error sending notification:", error);
        res.status(500).json({ success: false, message: "Failed to send notification." });
    }
}));
/**
 * @swagger
 * /notifications/broadcast:
 *   post:
 *     summary: Broadcast a message to multiple email addresses
 *     description: Sends a message to multiple recipients using the EmailNotification class.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of recipient email addresses
 *                 example: ["user1@example.com", "user2@example.com"]
 *               subject:
 *                 type: string
 *                 description: Email subject
 *                 example: "Broadcast Notification"
 *               message:
 *                 type: string
 *                 description: Email message body
 *                 example: "This is a broadcast message."
 *               engines:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Engine(s) to send the notification through
 *                 example: ["ntfy"]
 *     responses:
 *       200:
 *         description: Emails sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Broadcast message sent successfully."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
exports.notifications.post('/broadcast', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipients, subject, message, engines } = req.body;
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !subject || !message || !!engines || !Array.isArray(engines) || engines.length === 0) {
            logger.error("Missing or invalid required fields in request body");
            res.status(400).json({ success: false, message: "Missing or invalid required fields in request body." });
        }
        for (const recipient of recipients) {
            yield notification_controller_1.default.sendBroadcast(recipient, subject, message, engines);
            logger.info(`Notification sent to ${recipient}`);
        }
        res.status(200).json({ success: true, message: "Broadcast message sent successfully." });
    }
    catch (error) {
        logger.error("Error sending broadcast message:", error);
        res.status(500).json({ success: false, message: "Failed to send broadcast message." });
    }
}));
