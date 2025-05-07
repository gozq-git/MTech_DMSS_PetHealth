import PaymentsService from '../../../src/routes/payments/payments.service';
import { sequelize } from '../../../src/db/index';

jest.mock('../../../src/db/index', () => ({
    sequelize: {
        models: {
            PAYMENTS: {
                create: jest.fn(),
                update: jest.fn(),
                findOne: jest.fn(),
            },
        },
    },
}));

describe('PaymentsService', () => {
    describe('createPayment', () => {
        it('should create a payment successfully', async () => {
            const mockPaymentRecord = {
                id: '1',
                user_id: 'user_123',
                payment_system: 'stripe',
                payment_id: 'pay_12345',
                amount: 100.0,
                currency: 'USD',
                status: 'created',
            };

            (sequelize.models.PAYMENTS.create as jest.Mock).mockResolvedValue(mockPaymentRecord);

            const result = await PaymentsService.createPayment(
                'user_123',
                100.0,
                'USD',
                'pay_12345'
            );

            expect(sequelize.models.PAYMENTS.create).toHaveBeenCalledWith({
                user_id: 'user_123',
                payment_system: 'stripe',
                payment_id: 'pay_12345',
                amount: 100.0,
                currency: 'USD',
                status: 'created',
            });
            expect(result).toEqual(mockPaymentRecord);
        });

        it('should throw an error if payment creation fails', async () => {
            (sequelize.models.PAYMENTS.create as jest.Mock).mockRejectedValue(
                new Error('Database error')
            );

            await expect(
                PaymentsService.createPayment('user_123', 100.0, 'USD', 'pay_12345')
            ).rejects.toThrow('Failed to create payment: Database error');
        });
    });

    describe('capturePayment', () => {
        it('should capture a payment successfully', async () => {
            (sequelize.models.PAYMENTS.update as jest.Mock).mockResolvedValue([1]);

            await PaymentsService.capturePayment('pay_12345');

            expect(sequelize.models.PAYMENTS.update).toHaveBeenCalledWith(
                { status: 'captured' },
                { where: { payment_id: 'pay_12345' } }
            );
        });

        it('should throw an error if capturing payment fails', async () => {
            (sequelize.models.PAYMENTS.update as jest.Mock).mockRejectedValue(
                new Error('Database error')
            );

            await expect(PaymentsService.capturePayment('pay_12345')).rejects.toThrow(
                'Failed to capture payment: Database error'
            );
        });
    });

    describe('checkPaymentStatus', () => {
        it('should retrieve payment status successfully', async () => {
            const mockStatus = { status: 'captured' };

            (sequelize.models.PAYMENTS.findOne as jest.Mock).mockResolvedValue(mockStatus);

            const result = await PaymentsService.checkPaymentStatus('pay_12345');

            expect(sequelize.models.PAYMENTS.findOne).toHaveBeenCalledWith({
                where: { payment_id: 'pay_12345' },
            });
            expect(result).toEqual(mockStatus);
        });

        it('should throw an error if retrieving payment status fails', async () => {
            (sequelize.models.PAYMENTS.findOne as jest.Mock).mockRejectedValue(
                new Error('Database error')
            );

            await expect(PaymentsService.checkPaymentStatus('pay_12345')).rejects.toThrow(
                'Failed to check payment status: Database error'
            );
        });
    });
});