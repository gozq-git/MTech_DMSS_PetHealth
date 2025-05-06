const logger = require('../../utils/logger');
import NotificationServices from './notification.service';
import { emailTemplates } from '../../models/email_template/templates';
import { ZohomailNotification } from "../../models/notification/zohomail_notification";
import { NtfyNotification } from "../../models/notification/ntfy_notification";


async function sendZohoMailNotification(to: string, subject: string, message: string) {
    const emailTemplate = emailTemplates.defaultEmailTemplate(to, to.split('@')[0], subject, message);
    const zohoNotification = new ZohomailNotification(to, emailTemplate.subject, emailTemplate.body);
    await zohoNotification.sendNotification();
    return zohoNotification;
}

async function sendCustomNotification(engine: string, notification: PhPNotification) {
    switch (engine) {
        case 'ntfy':
            logger.info("Sending notification using ntfy engine");
            const ntfyEngine = new NtfyNotification(notification);
            await ntfyEngine.sendNotification()
            break;
        default:
            logger.error("Unsupported engine type");
    }
}

const NotificationController = {
    sendNotification: async (to: string, subject: string, message: string, engines: Array<string> = []) => {
        try {
            // Default zohoMail notification
            const notificationDecorator = await sendZohoMailNotification(to, subject, message);
            logger.info(`Email sent to ${to}`);

            for (const engine of engines) {
                await sendCustomNotification(engine, notificationDecorator);
            }

            return;

        } catch (error) {
            logger.error("Error sending email:", error);
            throw error;
        }
    },
    sendBroadcast: async (to: Array<string>, subject: string, message: string, engines: Array<string> = []) => {
        try {
            // Default zohoMail notification
            if (to[0] === "all") {
                to = await NotificationServices.getAllEmails();
            }

            for (const recipient of to) {
                const notificationDecorator = await sendZohoMailNotification(recipient, subject, message);
                logger.info(`Email sent to ${to}`);
                for (const engine of engines) {
                    await sendCustomNotification(engine, notificationDecorator);
                }
            }

            return;

        } catch (error) {
            logger.error("Error sending email:", error);
            throw error;
        }
    },
}

export default NotificationController;