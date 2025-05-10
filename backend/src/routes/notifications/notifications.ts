import express, {Request, Response} from 'express';
import NotificationController from "./notification.controller";

const logger = require('../../utils/logger');
export const notifications: express.Router = express.Router();

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
notifications.post('/sendNotification', async (req: Request, res: Response) => {
    try {
        const { to, subject, message, engines } = req.body;
        if (!to || !subject || !message || !engines) {
            logger.error("Missing required fields in request body");
            res.status(400).json({ success: false, message: "Missing or invalid required fields in request body." });
            return;
        }
        await NotificationController.sendNotification(to, subject, message, engines);
        logger.info(`Notification sent to ${to}`);
        res.status(200).json({ success: true, message: "Notification sent successfully." });
        return;
    } catch (error) {
        logger.error("Error sending notification:", error);
        res.status(500).json({ success: false, message: "Failed to send notification." });
    }
});

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
notifications.post('/broadcast', async (req: Request, res: Response) => {
    try {
        const { recipients, subject, message, engines } = req.body;
        logger.info("Broadcast request received with values:", {
            recipients,
            subject,
            message,
            engines
        });
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !subject || !message || !engines || !Array.isArray(engines)) {
            logger.error("Missing or invalid required fields in request body");
            res.status(400).json({ success: false, message: "Missing or invalid required fields in request body." });
            return;
        }
        // for (const recipient of recipients) {
        //     await NotificationController.sendNotification(recipient, subject, message, engines);
        //     logger.info(`Notification sent to ${recipient}`);
        // }
        await NotificationController.sendBroadcast(recipients, subject, message, engines);
        res.status(200).json({ success: true, message: "Broadcast message sent successfully." });
        return;
    } catch (error) {
        logger.error("Error sending broadcast message:", error);
        res.status(500).json({ success: false, message: "Failed to send broadcast message." });
    }
});