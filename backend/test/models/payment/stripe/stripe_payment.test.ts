import Stripe from 'stripe';
import { StripePayment } from '../../../../src/models/payment/stripe/stripe_payment';

jest.mock('stripe');

describe('StripePayment', () => {
    let stripePayment: StripePayment;
    let mockStripe: any;

    beforeEach(() => {
        mockStripe = new Stripe('test_key', { apiVersion: '2025-03-31.basil' }) as jest.Mocked<Stripe>;
        const testStripe: any = Stripe;
        (testStripe as jest.Mock).mockImplementation(() => mockStripe);
        stripePayment = new StripePayment();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // describe('createPaymentIntent', () => {
    //     it('should create a payment intent successfully', async () => {
    //         const mockPaymentIntent = { id: 'pi_123', amount: 1000, currency: 'usd' } as Stripe.PaymentIntent;
    //         mockStripe.create.mockResolvedValue(mockPaymentIntent);

    //         const result = await stripePayment.createPaymentIntent(1000, 'usd');

    //         expect(mockStripe.create).toHaveBeenCalledWith({
    //             amount: 1000,
    //             currency: 'usd',
    //             payment_method: undefined,
    //             confirm: false,
    //         });
    //         expect(result).toEqual(mockPaymentIntent);
    //     });

    //     it('should throw an error when creating a payment intent fails', async () => {
    //         mockStripe.paymentIntents.create.mockRejectedValue(new Error('Failed to create payment intent'));

    //         await expect(stripePayment.createPaymentIntent(1000, 'usd')).rejects.toThrow('Failed to create payment intent');
    //     });
    // });

    // describe('retrievePaymentIntent', () => {
    //     it('should retrieve a payment intent successfully', async () => {
    //         const mockPaymentIntent = { id: 'pi_123', amount: 1000, currency: 'usd' } as Stripe.PaymentIntent;
    //         mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent);

    //         const result = await stripePayment.retrievePaymentIntent('pi_123');

    //         expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_123');
    //         expect(result).toEqual(mockPaymentIntent);
    //     });

    //     it('should throw an error when retrieving a payment intent fails', async () => {
    //         mockStripe.paymentIntents.retrieve.mockRejectedValue(new Error('Failed to retrieve payment intent'));

    //         await expect(stripePayment.retrievePaymentIntent('pi_123')).rejects.toThrow('Failed to retrieve payment intent');
    //     });
    // });

    // describe('confirmPaymentIntent', () => {
    //     it('should confirm a payment intent successfully', async () => {
    //         const mockPaymentIntent = { id: 'pi_123', status: 'succeeded' } as Stripe.PaymentIntent;
    //         mockStripe.paymentIntents.confirm.mockResolvedValue(mockPaymentIntent);

    //         const result = await stripePayment.confirmPaymentIntent('pi_123', 'pm_123');

    //         expect(mockStripe.paymentIntents.confirm).toHaveBeenCalledWith('pi_123', {
    //             payment_method: 'pm_123',
    //             return_url: 'https://www.example.com',
    //         });
    //         expect(result).toEqual(mockPaymentIntent);
    //     });

    //     it('should throw an error when confirming a payment intent fails', async () => {
    //         mockStripe.paymentIntents.confirm.mockRejectedValue(new Error('Failed to confirm payment intent'));

    //         await expect(stripePayment.confirmPaymentIntent('pi_123', 'pm_123')).rejects.toThrow('Failed to confirm payment intent');
    //     });
    // });
});