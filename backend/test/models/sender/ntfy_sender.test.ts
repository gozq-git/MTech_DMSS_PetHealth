import { NtfySender } from '../../../src/models/sender/ntfy_sender';
import axios from 'axios';
import { config } from '../../../src/config/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NtfySender', () => {
    let ntfySender: NtfySender;

    beforeEach(() => {
        ntfySender = new NtfySender();
        jest.clearAllMocks();
    });

    describe('send', () => {
        it('should send a notification successfully', async () => {
            mockedAxios.post.mockResolvedValue({
                status: 200,
                data: { message: 'Notification sent successfully' },
            });

            await ntfySender.send('recipient@example.com', 'Test Subject', 'Test Body<br>Line 2');

            expect(mockedAxios.post).toHaveBeenCalledWith(
                config.ntfy_url,
                {
                    topic: 'PHP_recipient',
                    message: 'Test Body\nLine 2',
                    title: 'Test Subject',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        });

        it('should throw an error if the notification sending fails', async () => {
            mockedAxios.post.mockRejectedValue(new Error('Notification sending failed'));

            await expect(
                ntfySender.send('recipient@example.com', 'Test Subject', 'Test Body')
            ).rejects.toThrow('Notification sending failed');

            expect(mockedAxios.post).toHaveBeenCalledWith(
                config.ntfy_url,
                {
                    topic: 'PHP_recipient',
                    message: 'Test Body',
                    title: 'Test Subject',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        });
    });
});