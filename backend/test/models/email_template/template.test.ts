import { emailTemplates } from '../../../src/models/email_template/templates';
import EmailTemplate from '../../../src/models/email_template/email_template';
import TableEmailTemplate from '../../../src/models/email_template/table_email_template';

describe('emailTemplates', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('welcomeEmailTemplate', () => {
        it('should generate a welcome email template', () => {
            const result = emailTemplates.welcomeEmailTemplate('user@example.com', 'John Doe');

            expect(result).toEqual({
                subject: 'Welcome to PetHealth!',
                body: 'Hello John Doe!<br><br>Thank you for joining PetHealth. We are excited to have you on board.<br><br>Best regards, PetHealth Team',
            });
        });
    });

    describe('appointmentReminderTemplate', () => {
        it('should generate an appointment reminder email template', () => {
            const appointmentDetails = {
                date: '2025-04-30',
                time: '10:00 AM',
                location: 'PetHealth Clinic',
            };
            const result = emailTemplates.appointmentReminderTemplate(
                'user@example.com',
                'John Doe',
                appointmentDetails
            );

            expect(result).toEqual({
                subject: 'Appointment Reminder',
                body: `Hello John Doe,<br><br>
      <table border=\"1\" cellpadding=\"5\" cellspacing=\"0\" style=\"border-collapse: collapse; width: 100%;\">
        <tr><td><strong>Date</strong></td><td>2025-04-30</td></tr>
<tr><td><strong>Time</strong></td><td>10:00 AM</td></tr>
<tr><td><strong>Location</strong></td><td>PetHealth Clinic</td></tr>

      </table>
    <br><br>Please contact us if you have any questions.<br><br>Best regards, PetHealth Team`,
            });
        });
    });

    describe('defaultEmailTemplate', () => {
        it('should generate a default email template', () => {
            const result = emailTemplates.defaultEmailTemplate(
                'user@example.com',
                'John Doe',
                'Test Subject',
                'This is a test message.'
            );

            expect(result).toEqual({
                subject: '[PHP Notification] Test Subject',
                body: 'Hello John Doe!<br><br>This is a test message.<br><br>Best regards, PetHealth Team',
            });
        });
    });
});