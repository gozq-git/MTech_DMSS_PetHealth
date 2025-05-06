import { ZohoMailSender } from '../../../src/models/sender/zohomail_sender';
import { config } from '../../../src/config/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ZohoMailSender', () => {
    let zohoMailSender: ZohoMailSender;

    beforeEach(() => {
        zohoMailSender = new ZohoMailSender('cached_token', Date.now() + 60 * 10000);
        jest.clearAllMocks();
    });

    describe('getZohoMailToken', () => {
        it('should return a cached token if it is still valid', async () => {
            // Mock the cached token and expiry time
            zohoMailSender = new ZohoMailSender('cached_token', Date.now() + 60 * 10000);
            
            const token = await (zohoMailSender as any).getZohoMailToken();

            expect(token).toBe('cached_token');
            expect(mockedAxios.post).not.toHaveBeenCalled();
        });

        it('should fetch a new token if the cached token is expired', async () => {
            mockedAxios.post.mockResolvedValue({
                status: 200,
                data: { access_token: 'new_token' },
            });
            zohoMailSender = new ZohoMailSender();
            const token = await (zohoMailSender as any).getZohoMailToken();

            expect(token).toBe('new_token');
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'https://accounts.zoho.com/oauth/v2/token',
                expect.any(URLSearchParams),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
        });

        // it('should throw an error if the token request fails', async () => {
        //     mockedAxios.post.mockRejectedValue(new Error('Token request failed'));
        //     zohoMailSender = new ZohoMailSender();

        //     await expect((zohoMailSender as any).getZohoMailToken()).rejects.toThrow('Token request failed');
        //     expect(mockedAxios.post).toHaveBeenCalled();
        // });
    });

    describe('send', () => {
        it('should send an email successfully', async () => {
            // Mock the token retrieval and email sending
            jest.spyOn(zohoMailSender as any, 'getZohoMailToken').mockResolvedValue('mock_token');
            mockedAxios.post.mockResolvedValue({
                status: 200,
                data: { message: 'Email sent successfully' },
            });

            await zohoMailSender.send('recipient@example.com', 'Test Subject', 'Test Body');

            expect(mockedAxios.post).toHaveBeenCalledWith(
                `https://mail.zoho.com/api/accounts/${config.zoho_account_id}/messages`,
                {
                    fromAddress: config.zoho_email,
                    toAddress: 'recipient@example.com',
                    subject: 'Test Subject',
                    content: 'Test Body',
                },
                {
                    headers: {
                        Authorization: 'Zoho-oauthtoken mock_token',
                        'Content-Type': 'application/json',
                    },
                }
            );
        });

        it('should throw an error if the email sending fails', async () => {
            jest.spyOn(zohoMailSender as any, 'getZohoMailToken').mockResolvedValue('mock_token');
            mockedAxios.post.mockRejectedValue(new Error('Email sending failed'));

            await expect(
                zohoMailSender.send('recipient@example.com', 'Test Subject', 'Test Body')
            ).rejects.toThrow('Email sending failed');

            expect(mockedAxios.post).toHaveBeenCalled();
        });
    });
});