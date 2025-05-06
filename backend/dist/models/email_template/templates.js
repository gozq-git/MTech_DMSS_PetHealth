"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
const email_template_1 = __importDefault(require("./email_template"));
const table_email_template_1 = __importDefault(require("./table_email_template"));
// Welcome Email Template
function welcomeEmailTemplate(recipient, userName) {
    return new email_template_1.default({
        subject: 'Welcome to PetHealth!',
        header: `Hello ${userName}!`,
        body: `Thank you for joining PetHealth. We are excited to have you on board.`,
        footer: 'Best regards, PetHealth Team',
        recipient,
    }).build();
}
// Appointment Reminder Email Template
function appointmentReminderTemplate(recipient, userName, appointmentDetails) {
    return new table_email_template_1.default({
        subject: 'Appointment Reminder',
        header: `Hello ${userName},`,
        body: {
            'Date': appointmentDetails.date,
            'Time': appointmentDetails.time,
            'Location': appointmentDetails.location,
        },
        footer: 'Please contact us if you have any questions.<br><br>Best regards, PetHealth Team',
        recipient,
    }).build();
}
// Welcome Email Template
function defaultEmailTemplate(recipient, userName, subject, message) {
    return new email_template_1.default({
        subject: `[PHP Notification] ${subject}`,
        header: `Hello ${userName}!`,
        body: message,
        footer: 'Best regards, PetHealth Team',
        recipient,
    }).build();
}
exports.emailTemplates = {
    welcomeEmailTemplate,
    appointmentReminderTemplate,
    defaultEmailTemplate,
};
