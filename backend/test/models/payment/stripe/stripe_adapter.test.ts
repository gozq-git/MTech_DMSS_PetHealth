import { StripePaymentAdapter } from "../../../../src/models/payment/stripe/stripe_adapter";
import { StripePayment } from "../../../../src/models/payment/stripe/stripe_payment";

jest.mock("../../../../src/models/payment/stripe/stripe_payment");

describe("StripePaymentAdapter", () => {
    let stripePaymentAdapter: StripePaymentAdapter;
    let stripePaymentMock: jest.Mocked<StripePayment>;

    beforeEach(() => {
        stripePaymentMock = new StripePayment() as jest.Mocked<StripePayment>;
        stripePaymentAdapter = new StripePaymentAdapter();
        (stripePaymentAdapter as any).stripe = stripePaymentMock;
    });

    it("should initialize the adapter", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await stripePaymentAdapter.initialize();
        expect(consoleSpy).toHaveBeenCalledWith("Stripe Payment Adapter initialized");
    });

    it("should create a payment and return the payment ID", async () => {
        const mockPaymentIntent: any = { id: "pi_12345" };
        stripePaymentMock.createPaymentIntent.mockResolvedValue(mockPaymentIntent);

        const paymentId = await stripePaymentAdapter.createPayment(100, "USD", "Test Payment");

        expect(stripePaymentMock.createPaymentIntent).toHaveBeenCalledWith(100, "USD");
        expect(paymentId).toBe("pi_12345");
    });

    it("should capture a payment if it requires a payment method", async () => {
        const mockPaymentIntent: any = { status: "requires_payment_method", id: "pi_12345" };
        const mockConfirmedPayment: any = { id: "pi_12345" };

        stripePaymentMock.retrievePaymentIntent.mockResolvedValue(mockPaymentIntent);
        stripePaymentMock.confirmPaymentIntent.mockResolvedValue(mockConfirmedPayment);

        const result = await stripePaymentAdapter.capturePayment("pi_12345");

        expect(stripePaymentMock.retrievePaymentIntent).toHaveBeenCalledWith("pi_12345");
        expect(stripePaymentMock.confirmPaymentIntent).toHaveBeenCalledWith("pi_12345", "pm_card_visa");
        expect(result).toBe(true);
    });

    it("should not capture a payment if it does not require a payment method", async () => {
        const mockPaymentIntent: any = { status: "succeeded", id: "pi_12345" };

        stripePaymentMock.retrievePaymentIntent.mockResolvedValue(mockPaymentIntent);

        const result = await stripePaymentAdapter.capturePayment("pi_12345");

        expect(stripePaymentMock.retrievePaymentIntent).toHaveBeenCalledWith("pi_12345");
        expect(result).toBe(false);
    });

    it("should check the payment status and return it", async () => {
        const mockPaymentIntent: any = { status: "succeeded" };

        stripePaymentMock.retrievePaymentIntent.mockResolvedValue(mockPaymentIntent);

        const status = await stripePaymentAdapter.checkPaymentStatus("pi_12345");

        expect(stripePaymentMock.retrievePaymentIntent).toHaveBeenCalledWith("pi_12345");
        expect(status).toBe("succeeded");
    });

    it("should throw an error if createPayment fails", async () => {
        stripePaymentMock.createPaymentIntent.mockRejectedValue(new Error("Payment creation failed"));

        await expect(stripePaymentAdapter.createPayment(100, "USD", "Test Payment")).rejects.toThrow("Payment creation failed");
    });

    it("should throw an error if capturePayment fails", async () => {
        stripePaymentMock.retrievePaymentIntent.mockRejectedValue(new Error("Payment retrieval failed"));

        await expect(stripePaymentAdapter.capturePayment("pi_12345")).rejects.toThrow("Payment retrieval failed");
    });

    it("should throw an error if checkPaymentStatus fails", async () => {
        stripePaymentMock.retrievePaymentIntent.mockRejectedValue(new Error("Payment status retrieval failed"));

        await expect(stripePaymentAdapter.checkPaymentStatus("pi_12345")).rejects.toThrow("Payment status retrieval failed");
    });
});