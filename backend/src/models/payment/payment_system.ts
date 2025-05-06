import { PaymentAdapter } from "./payment_adapter";
import { PayPalPaymentAdapter } from "./paypal/paypal_adapter";
import { StripePaymentAdapter } from "./stripe/stripe_adapter";

export class PaymentSystem {
    private paymentAdapter: PaymentAdapter;

    constructor(adapterType: string | null= null) {
        switch (adapterType) {
            case "paypal":
                this.paymentAdapter = new PayPalPaymentAdapter();
                break;
            default:
                this.paymentAdapter = new StripePaymentAdapter();
        }
    }
    

    async initialize(): Promise<void> {
        await this.paymentAdapter.initialize();
    }

    async createPayment(amount: number, currency: string, description: string): Promise<string> {
        return await this.paymentAdapter.createPayment(amount, currency, description);
    }

    async capturePayment(paymentId: string): Promise<boolean> {
        return await this.paymentAdapter.capturePayment(paymentId);
    }

    async checkPaymentStatus(paymentId: string): Promise<string> {
        return await this.paymentAdapter.checkPaymentStatus(paymentId);
    }
}