export interface PaymentAdapter {
    initialize(): Promise<void>;
    createPayment(amount: number, currency: string, description: string): Promise<string>;
    capturePayment(paymentId: string): Promise<boolean>;
    checkPaymentStatus(paymentId: string): Promise<string>;
}

