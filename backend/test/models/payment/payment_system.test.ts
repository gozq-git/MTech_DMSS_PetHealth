import { PaymentSystem } from "../../../src/models/payment/payment_system";
import { PayPalPaymentAdapter } from "../../../src/models/payment/paypal/paypal_adapter";
import { StripePaymentAdapter } from "../../../src/models/payment/stripe/stripe_adapter";

jest.mock("../../../src/models/payment/paypal/paypal_adapter");
jest.mock("../../../src/models/payment/stripe/stripe_adapter");

describe("PaymentSystem", () => {
    let paypalMock: jest.Mocked<PayPalPaymentAdapter>;
    let stripeMock: jest.Mocked<StripePaymentAdapter>;

    beforeEach(() => {
        paypalMock = new PayPalPaymentAdapter() as jest.Mocked<PayPalPaymentAdapter>;
        stripeMock = new StripePaymentAdapter() as jest.Mocked<StripePaymentAdapter>;

        jest.clearAllMocks();
    });

    it("should use PayPalPaymentAdapter when adapterType is 'paypal'", () => {
        const paymentSystem = new PaymentSystem("paypal");
        expect(PayPalPaymentAdapter).toHaveBeenCalled();
        expect(StripePaymentAdapter).not.toHaveBeenCalled();
    });

    it("should use StripePaymentAdapter when adapterType is not 'paypal'", () => {
        const paymentSystem = new PaymentSystem("stripe");
        expect(StripePaymentAdapter).toHaveBeenCalled();
        expect(PayPalPaymentAdapter).not.toHaveBeenCalled();
    });

    it("should initialize the payment adapter", async () => {
        const paymentSystem = new PaymentSystem("paypal");
        paypalMock.initialize.mockResolvedValueOnce();
        await paymentSystem.initialize();
        expect(paypalMock.initialize).toHaveBeenCalled();
    });

    it("should create a payment using the payment adapter", async () => {
        const paymentSystem = new PaymentSystem("paypal");
        const mockPaymentId = "payment123";
        paypalMock.createPayment.mockResolvedValueOnce(mockPaymentId);

        const paymentId = await paymentSystem.createPayment(100, "USD", "Test Payment");
        expect(paypalMock.createPayment).toHaveBeenCalledWith(100, "USD", "Test Payment");
        expect(paymentId).toBe(mockPaymentId);
    });

    it("should capture a payment using the payment adapter", async () => {
        const paymentSystem = new PaymentSystem("paypal");
        paypalMock.capturePayment.mockResolvedValueOnce(true);

        const result = await paymentSystem.capturePayment("payment123");
        expect(paypalMock.capturePayment).toHaveBeenCalledWith("payment123");
        expect(result).toBe(true);
    });

    it("should check payment status using the payment adapter", async () => {
        const paymentSystem = new PaymentSystem("paypal");
        const mockStatus = "COMPLETED";
        paypalMock.checkPaymentStatus.mockResolvedValueOnce(mockStatus);

        const status = await paymentSystem.checkPaymentStatus("payment123");
        expect(paypalMock.checkPaymentStatus).toHaveBeenCalledWith("payment123");
        expect(status).toBe(mockStatus);
    });
});