import { EmailNotification } from '../../../src/models/notification/email_notification';

class MockSender {
    async send(to: string, subject: string, body: string): Promise<void> {
        // Mock implementation of send
    }
}

class TestEmailNotification extends EmailNotification {
    async initSender(): Promise<MockSender> {
        return new MockSender();
    }
}

describe('EmailNotification', () => {
    let emailNotification: TestEmailNotification;

    beforeEach(() => {
        emailNotification = new TestEmailNotification('test@example.com', 'Test Subject', 'Test Body');
    });

    it('should initialize with correct properties', () => {
        expect(emailNotification.to).toBe('test@example.com');
        expect(emailNotification.subject).toBe('Test Subject');
        expect(emailNotification.body).toBe('Test Body');
    });

    it('should call sendEmail when sendNotification is invoked', async () => {
        const sendEmailSpy = jest.spyOn(emailNotification, 'sendEmail').mockResolvedValue();
        await emailNotification.sendNotification();
        expect(sendEmailSpy).toHaveBeenCalled();
    });

    it('should initialize sender and send email', async () => {
        const mockSender = new MockSender();
        const initSenderSpy = jest.spyOn(emailNotification, 'initSender').mockResolvedValue(mockSender);
        const sendSpy = jest.spyOn(mockSender, 'send').mockResolvedValue();

        await emailNotification.sendEmail();

        expect(initSenderSpy).toHaveBeenCalled();
        expect(sendSpy).toHaveBeenCalledWith('test@example.com', 'Test Subject', 'Test Body');
    });

    it('should throw an error if email sending fails', async () => {
        const mockSender = new MockSender();
        jest.spyOn(emailNotification, 'initSender').mockResolvedValue(mockSender);
        jest.spyOn(mockSender, 'send').mockRejectedValue(new Error('Send failed'));

        await expect(emailNotification.sendEmail()).rejects.toThrow('Send failed');
    });

    it('should not reinitialize sender if already initialized', async () => {
        const mockSender = new MockSender();
        const initSenderSpy = jest.spyOn(emailNotification, 'initSender').mockResolvedValue(mockSender);
        const sendSpy = jest.spyOn(mockSender, 'send').mockResolvedValue();

        // First call to initialize sender
        await emailNotification.sendEmail();
        // Second call should reuse the existing sender
        await emailNotification.sendEmail();

        expect(initSenderSpy).toHaveBeenCalledTimes(1);
        expect(sendSpy).toHaveBeenCalledTimes(2);
    });

    it('should log success message when email is sent successfully', async () => {
        const mockSender = new MockSender();
        jest.spyOn(emailNotification, 'initSender').mockResolvedValue(mockSender);
        jest.spyOn(mockSender, 'send').mockResolvedValue();
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        await emailNotification.sendEmail();

        expect(consoleLogSpy).toHaveBeenCalledWith('Email sent successfully');
        consoleLogSpy.mockRestore();
    });

    it('should log error message when email sending fails', async () => {
        const mockSender = new MockSender();
        jest.spyOn(emailNotification, 'initSender').mockResolvedValue(mockSender);
        jest.spyOn(mockSender, 'send').mockRejectedValue(new Error('Send failed'));
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        await expect(emailNotification.sendEmail()).rejects.toThrow('Send failed');
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
        consoleErrorSpy.mockRestore();
    });
});