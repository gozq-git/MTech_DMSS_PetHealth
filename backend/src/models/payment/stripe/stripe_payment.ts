import Stripe from 'stripe';
import { config } from "../../../config/config";

export class StripePayment {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(config.stripe_secret_key, { apiVersion: '2025-03-31.basil' });
    }

    /**
     * Creates a payment intent with the specified amount and currency.
     * @param amount - The amount to charge in the smallest currency unit (e.g., cents for USD).
     * @param currency - The currency code (e.g., 'usd').
     * @param paymentMethodId - The payment method ID (optional).
     * @returns The payment intent object.
     */
    async createPaymentIntent(amount: number, currency: string, paymentMethodId?: string): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                payment_method: paymentMethodId,
                confirm: paymentMethodId ? true : false, // Automatically confirm if payment method is provided
            });
            return paymentIntent;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }

    /**
     * Retrieves a payment intent by its ID.
     * @param paymentIntentId - The ID of the payment intent to retrieve.
     * @returns The payment intent object.
     */
    async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent;
        } catch (error) {
            console.error('Error retrieving payment intent:', error);
            throw error;
        }
    }

    /**
     * Confirms a payment intent with a payment method.
     * @param paymentIntentId - The ID of the payment intent to confirm.
     * @param paymentMethodId - The payment method ID to use for confirmation.
     * @returns The confirmed payment intent object.
     */
    async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
                payment_method: paymentMethodId,
                return_url: 'https://www.example.com',
            });
            return paymentIntent;
        } catch (error) {
            console.error('Error confirming payment intent:', error);
            throw error;
        }
    }
}