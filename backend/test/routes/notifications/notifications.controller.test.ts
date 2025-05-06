import UsersController from '../../../src/routes/notifications/notification.controller';
import NotificationServices from '../../../src/routes/notifications/notification.service';
import { ZohomailNotification } from '../../../src/models/notification/zohomail_notification';
import { NtfyNotification } from '../../../src/models/notification/ntfy_notification';
import { emailTemplates } from '../../../src/models/email_template/templates';

jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));
jest.mock('../../../src/routes/notifications/notification.service');
jest.mock('../../../src/models/notification/zohomail_notification');
jest.mock('../../../src/models/notification/ntfy_notification');
jest.mock('../../../src/models/email_template/templates');

describe('UsersController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendNotification', () => {
    it('should send a ZohoMail notification and log success', async () => {
      const mockSendNotification = jest.fn();
      (ZohomailNotification as jest.Mock).mockImplementation(() => ({
        sendNotification: mockSendNotification,
      }));
      emailTemplates.defaultEmailTemplate = jest.fn(() => ({
        subject: 'Test Subject',
        body: 'Test Body',
      }));

      await UsersController.sendNotification('test@example.com', 'Test Subject', 'Test Message');

      expect(emailTemplates.defaultEmailTemplate).toHaveBeenCalledWith(
        'test@example.com',
        'test',
        'Test Subject',
        'Test Message'
      );
      expect(mockSendNotification).toHaveBeenCalled();
    });

    it('should send notifications using additional engines', async () => {
      const mockSendNotification = jest.fn();
      (ZohomailNotification as jest.Mock).mockImplementation(() => ({
        sendNotification: mockSendNotification,
      }));
      (NtfyNotification as jest.Mock).mockImplementation(() => ({
        sendNotification: mockSendNotification,
      }));
      emailTemplates.defaultEmailTemplate = jest.fn(() => ({
        subject: 'Test Subject',
        body: 'Test Body',
      }));

      await UsersController.sendNotification('test@example.com', 'Test Subject', 'Test Message', ['ntfy']);

      expect(mockSendNotification).toHaveBeenCalledTimes(2); // ZohoMail + Ntfy
    });

    it('should log an error if sending fails', async () => {
      const logger = require('../../../src/utils/logger');
      const mockSendNotification = jest.fn().mockRejectedValue(new Error('Send failed'));
      (ZohomailNotification as jest.Mock).mockImplementation(() => ({
        sendNotification: mockSendNotification,
      }));
      emailTemplates.defaultEmailTemplate = jest.fn(() => ({
        subject: 'Test Subject',
        body: 'Test Body',
      }));

      await expect(
        UsersController.sendNotification('test@example.com', 'Test Subject', 'Test Message')
      ).rejects.toThrow('Send failed');

      expect(logger.error).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
    });
  });

  describe('sendBroadcast', () => {
    it('should send broadcast emails to all recipients', async () => {
      const mockSendNotification = jest.fn();
      (ZohomailNotification as jest.Mock).mockImplementation(() => ({
        sendNotification: mockSendNotification,
      }));
      emailTemplates.defaultEmailTemplate = jest.fn(() => ({
        subject: 'Test Subject',
        body: 'Test Body',
      }));
      (NotificationServices.getAllEmails as jest.Mock).mockResolvedValue(['user1@example.com', 'user2@example.com']);

      await UsersController.sendBroadcast(['all'], 'Test Subject', 'Test Message');

      expect(NotificationServices.getAllEmails).toHaveBeenCalled();
      expect(mockSendNotification).toHaveBeenCalledTimes(2); // Two recipients
    });

    it('should send broadcast emails to specific recipients', async () => {
      const mockSendNotification = jest.fn();
      (ZohomailNotification as jest.Mock).mockImplementation(() => ({
        sendNotification: mockSendNotification,
      }));
      emailTemplates.defaultEmailTemplate = jest.fn(() => ({
        subject: 'Test Subject',
        body: 'Test Body',
      }));

      await UsersController.sendBroadcast(['user1@example.com', 'user2@example.com'], 'Test Subject', 'Test Message');

      expect(mockSendNotification).toHaveBeenCalledTimes(2); // Two recipients
    });

    it('should log an error if sending broadcast fails', async () => {
      const logger = require('../../../src/utils/logger');
      const mockSendNotification = jest.fn().mockRejectedValue(new Error('Broadcast failed'));
      (ZohomailNotification as jest.Mock).mockImplementation(() => ({
        sendNotification: mockSendNotification,
      }));
      emailTemplates.defaultEmailTemplate = jest.fn(() => ({
        subject: 'Test Subject',
        body: 'Test Body',
      }));

      await expect(
        UsersController.sendBroadcast(['user1@example.com'], 'Test Subject', 'Test Message')
      ).rejects.toThrow('Broadcast failed');

      expect(logger.error).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
    });
  });
});