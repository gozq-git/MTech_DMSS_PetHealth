import request from 'supertest';
import express from 'express';
import { notifications } from '../../../src/routes/notifications/notifications';
import NotificationController from '../../../src/routes/notifications/notification.controller';

jest.mock('../../../src/routes/notifications/notification.controller');

const app = express();
app.use(express.json());
app.use('/notifications', notifications);

describe('Notifications Routes', () => {
    describe('POST /notifications/sendNotification', () => {
        it('should send a notification successfully', async () => {
            (NotificationController.sendNotification as jest.Mock).mockResolvedValueOnce(undefined);

            const response = await request(app)
                .post('/notifications/sendNotification')
                .send({
                    to: 'example@example.com',
                    subject: 'Test Subject',
                    message: 'Test Message',
                    engines: ['ntfy']
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: 'Notification sent successfully.'
            });
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/notifications/sendNotification')
                .send({
                    subject: 'Test Subject',
                    message: 'Test Message'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                message: 'Missing or invalid required fields in request body.'
            });
        });

        it('should return 500 if there is a server error', async () => {
            (NotificationController.sendNotification as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

            const response = await request(app)
                .post('/notifications/sendNotification')
                .send({
                    to: 'example@example.com',
                    subject: 'Test Subject',
                    message: 'Test Message',
                    engines: ['ntfy']
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Failed to send notification.'
            });
        });
    });

    describe('POST /notifications/broadcast', () => {
        it('should broadcast a message successfully', async () => {
            (NotificationController.sendBroadcast as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app)
                .post('/notifications/broadcast')
                .send({
                    recipients: ['user1@example.com', 'user2@example.com'],
                    subject: 'Broadcast Subject',
                    message: 'Broadcast Message',
                    engines: ['ntfy']
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: 'Broadcast message sent successfully.'
            });
        });

        it('should return 400 if recipients field is missing or invalid', async () => {
            const response = await request(app)
                .post('/notifications/broadcast')
                .send({
                    subject: 'Broadcast Subject',
                    message: 'Broadcast Message'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                message: 'Missing or invalid required fields in request body.'
            });
        });

        it('should return 500 if there is a server error', async () => {
            (NotificationController.sendBroadcast as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

            const response = await request(app)
                .post('/notifications/broadcast')
                .send({
                    recipients: ['user1@example.com', 'user2@example.com'],
                    subject: 'Broadcast Subject',
                    message: 'Broadcast Message',
                    engines: ['ntfy']
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Failed to send broadcast message.'
            });
        });
    });
});