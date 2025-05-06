import { PaymentAdapter } from "../payment_adapter";
import { PayPalPayment } from "./paypal_payment";

export class PayPalPaymentAdapter implements PaymentAdapter {
    private paypal: PayPalPayment;

    constructor() {
        this.paypal = new PayPalPayment();
    }

    async initialize(): Promise<void> {
        // Initialization logic if needed
        console.log("PayPal Payment Adapter initialized");
    }

    async createPayment(amount: number, currency: string, description: string): Promise<string> {
        try {
            const orderId = await this.paypal.createOrder(amount, currency, description);
            console.log(`PayPal order created with ID: ${orderId}`);
            return orderId; // Return the order ID
        } catch (error) {
            console.error("Error creating PayPal payment:", error);
            throw error;
        }
    }

    async capturePayment(paymentId: string): Promise<boolean> {
        try {
            const isCaptured = await this.paypal.captureOrder(paymentId);
            if (isCaptured) {
                console.log(`PayPal payment captured with ID: ${paymentId}`);
            } else {
                console.log(`PayPal payment with ID: ${paymentId} could not be captured.`);
            }
            return isCaptured;
        } catch (error) {
            console.error("Error capturing PayPal payment:", error);
            throw error;
        }
    }

    async checkPaymentStatus(paymentId: string): Promise<string> {
        try {
            const status = await this.paypal.getOrderStatus(paymentId);
            console.log(`PayPal payment status for ID ${paymentId}: ${status}`);
            return status; // Return the payment status
        } catch (error) {
            console.error("Error checking PayPal payment status:", error);
            throw error;
        }
    }
}