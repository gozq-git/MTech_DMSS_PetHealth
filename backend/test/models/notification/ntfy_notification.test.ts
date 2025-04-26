import { NtfyNotification } from '../../../src/models/notification/ntfy_notification';
import {  ZohomailNotification } from "../../../src/models/notification/zohomail_notification";
import { NtfySender } from '../../../src/models/sender/ntfy_sender';

jest.mock('../../../src/models/sender/ntfy_sender');

const MockedNtfySender = NtfySender as jest.MockedClass<typeof NtfySender>;

describe('NtfyNotification', () => {
    let ntfyNotification: NtfyNotification;

    beforeEach(() => {
        let notification = new ZohomailNotification('recipient@example.com', 'Test Subject', 'Test Body');
        ntfyNotification = new NtfyNotification(notification);
        jest.clearAllMocks();
    });

    describe('initSender', () => {
        it('should initialize and return an NtfySender instance', async () => {
            const sender = await ntfyNotification.initSender();

            expect(sender).toBeInstanceOf(NtfySender);
            expect(MockedNtfySender).toHaveBeenCalledTimes(1);
        });
    });

    describe('sendNotification', () => {
        it('should send a notification successfully', async () => {
            const mockSend = jest.fn();
            MockedNtfySender.prototype.send = mockSend.mockResolvedValue('');

            await ntfyNotification.sendNotification();

            expect(mockSend).toHaveBeenCalledWith('recipient@example.com', 'Test Subject', 'Test Body');
            expect(mockSend).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if sending the notification fails', async () => {
            const mockSend = jest.fn().mockRejectedValue(new Error('Notification sending failed'));
            MockedNtfySender.prototype.send = mockSend;

            await expect(ntfyNotification.sendNotification()).rejects.toThrow('Notification sending failed');

            expect(mockSend).toHaveBeenCalledWith('recipient@example.com', 'Test Subject', 'Test Body');
            expect(mockSend).toHaveBeenCalledTimes(1);
        });
    });
});