import request from 'supertest';
import express from 'express';
import payments from '../../../src/routes/payments/payments';
import PaymentsController from '../../../src/routes/payments/payments.controller';
import UsersController from '../../../src/routes/users/users.controller';

jest.mock('../../../src/routes/payments/payments.controller');
jest.mock('../../../src/routes/users/users.controller');

const app = express();
app.use(express.json());
app.use('/payments', payments);

describe('Payments API', () => {
    describe('POST /payments/create', () => {
        // it('should create a new payment successfully', async () => {
        //     const mockUser = { id: 'user_123', preferred_username: 'testuser' };
        //     const mockPaymentId = 'pay_12345';

        //     (UsersController.retrieveUser as jest.Mock).mockResolvedValue(mockUser);
        //     (PaymentsController.createPayment as jest.Mock).mockResolvedValue(mockPaymentId);

        //     const response = await request(app)
        //         .post('/payments/create')
        //         .set('userInfo', JSON.stringify({ preferred_username: 'testuser' }))
        //         .send({
        //             amount: 100.0,
        //             currency: 'USD',
        //             description: 'Payment for order #1234',
        //             paymentType: 'stripe',
        //         });

        //     expect(response.status).toBe(201);
        //     expect(response.body).toEqual({ paymentId: mockPaymentId });
        // });

        it('should return 500 if user information is invalid', async () => {
            const response = await request(app)
                .post('/payments/create')
                .set('userInfo', '')
                .send({
                    amount: 100.0,
                    currency: 'USD',
                    description: 'Payment for order #1234',
                    paymentType: 'stripe',
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Missing or invalid user information(preferred_username)' });
        });

        it('should return 500 if user is not found', async () => {
            (UsersController.retrieveUser as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/payments/create')
                .set('userInfo', JSON.stringify({ preferred_username: 'test1' }))
                .send({
                    amount: 100.0,
                    currency: 'USD',
                    description: 'Payment for order #1234',
                    paymentType: 'stripe',
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Missing or invalid user information(preferred_username)' });
        });
    });

    describe('POST /payments/capture', () => {
        it('should capture a payment successfully', async () => {
            (PaymentsController.capturePayment as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/payments/capture')
                .send({ paymentId: 'pay_12345' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
        });

        it('should return 500 if capturing payment fails', async () => {
            (PaymentsController.capturePayment as jest.Mock).mockRejectedValue(new Error('Capture failed'));

            const response = await request(app)
                .post('/payments/capture')
                .send({ paymentId: 'pay_12345' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'Failed to capture payment.',
                details: 'Capture failed',
            });
        });
    });

    describe('GET /payments/status/:paymentId', () => {
        it('should retrieve payment status successfully', async () => {
            (PaymentsController.checkPaymentStatus as jest.Mock).mockResolvedValue('captured');

            const response = await request(app).get('/payments/status/pay_12345');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: 'captured' });
        });

        it('should return 500 if retrieving payment status fails', async () => {
            (PaymentsController.checkPaymentStatus as jest.Mock).mockRejectedValue(new Error('Status check failed'));

            const response = await request(app).get('/payments/status/pay_12345');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'Failed to check payment status.',
                details: 'Status check failed',
            });
        });
    });
});