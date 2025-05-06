import { PaymentAdapter } from "../payment_adapter";
import { StripePayment } from "./stripe_payment";

export class StripePaymentAdapter implements PaymentAdapter {
    private stripe: StripePayment;

    constructor() {
        this.stripe = new StripePayment();
    }

    async initialize(): Promise<void> {
        // Initialization logic if needed
        console.log('Stripe Payment Adapter initialized');
    }

    async createPayment(amount: number, currency: string, description: string): Promise<string> {
        try {
            const paymentIntent = await this.stripe.createPaymentIntent(amount, currency);
            console.log(`Payment created with ID: ${paymentIntent.id}`);
            return paymentIntent.id; // Return the payment intent ID
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    }

    async capturePayment(paymentId: string): Promise<boolean> {
        try {
            const paymentIntent: any = await this.stripe.retrievePaymentIntent(paymentId);
            console.log(paymentIntent);
            
            if (paymentIntent.status === 'requires_payment_method') {
                const confirmedPayment = await this.stripe.confirmPaymentIntent(paymentId, 'pm_card_visa');
                console.log(`Payment captured with ID: ${confirmedPayment.id}`);
                return true;
            } else {
                console.log(`Payment with ID: ${paymentId} does not require capture.`);
                return false;
            }
        } catch (error) {
            console.error('Error capturing payment:', error);
            throw error;
        }
    }

    async checkPaymentStatus(paymentId: string): Promise<string> {
        try {
            const paymentIntent = await this.stripe.retrievePaymentIntent(paymentId);
            return paymentIntent.status; // Return the status of the payment intent
        } catch (error) {
            console.error('Error checking payment status:', error);
            throw error;
        }
    }
}