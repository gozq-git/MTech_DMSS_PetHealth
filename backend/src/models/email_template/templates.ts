import EmailTemplate from './email_template';
import TableEmailTemplate from './table_email_template';

// Welcome Email Template
function welcomeEmailTemplate(recipient: string, userName: string): {subject: string; body: string} {
  return new EmailTemplate({
    subject: 'Welcome to PetHealth!',
    header: `Hello ${userName}!`,
    body: `Thank you for joining PetHealth. We are excited to have you on board.`,
    footer: 'Best regards, PetHealth Team',
    recipient,
  }).build();
}

// Appointment Reminder Email Template
function appointmentReminderTemplate(
  recipient: string,
  userName: string,
  appointmentDetails: { date: string; time: string; location: string }
): { subject: string; body: string } {
  return new TableEmailTemplate({
    subject: 'Appointment Reminder',
    header: `Hello ${userName},`,
    body: [
      { key: 'Date', value: appointmentDetails.date },
      { key: 'Time', value: appointmentDetails.time },
      { key: 'Location', value: appointmentDetails.location },
    ],
    footer: 'Please contact us if you have any questions.<br><br>Best regards, PetHealth Team',
    recipient,
  }).build();
}

export const emailTemplates = {
  welcomeEmailTemplate,
  appointmentReminderTemplate,
};
