import { PayPalPaymentAdapter } from "../../../../src/models/payment/paypal/paypal_adapter";
import { PayPalPayment } from "../../../../src/models/payment/paypal/paypal_payment";

jest.mock("../../../../src/models/payment/paypal/paypal_payment");

describe("PayPalPaymentAdapter", () => {
    let paypalAdapter: PayPalPaymentAdapter;
    let mockPayPalPayment: jest.Mocked<PayPalPayment>;

    beforeEach(() => {
        mockPayPalPayment = new PayPalPayment() as jest.Mocked<PayPalPayment>;
        (PayPalPayment as jest.Mock).mockImplementation(() => mockPayPalPayment);
        paypalAdapter = new PayPalPaymentAdapter();
    });

    it("should initialize the PayPal adapter", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await paypalAdapter.initialize();
        expect(consoleSpy).toHaveBeenCalledWith("PayPal Payment Adapter initialized");
    });

    it("should create a payment and return the order ID", async () => {
        mockPayPalPayment.createOrder.mockResolvedValue("order_12345");

        const orderId = await paypalAdapter.createPayment(100, "USD", "Test Payment");
        expect(orderId).toBe("order_12345");
        expect(mockPayPalPayment.createOrder).toHaveBeenCalledWith(100, "USD", "Test Payment");
    });

    it("should capture a payment and return true if successful", async () => {
        mockPayPalPayment.captureOrder.mockResolvedValue(true);

        const isCaptured = await paypalAdapter.capturePayment("order_12345");
        expect(isCaptured).toBe(true);
        expect(mockPayPalPayment.captureOrder).toHaveBeenCalledWith("order_12345");
    });

    it("should return the payment status", async () => {
        mockPayPalPayment.getOrderStatus.mockResolvedValue("COMPLETED");

        const status = await paypalAdapter.checkPaymentStatus("order_12345");
        expect(status).toBe("COMPLETED");
        expect(mockPayPalPayment.getOrderStatus).toHaveBeenCalledWith("order_12345");
    });

    it("should throw an error if createPayment fails", async () => {
        mockPayPalPayment.createOrder.mockRejectedValue(new Error("Create payment failed"));

        await expect(paypalAdapter.createPayment(100, "USD", "Test Payment")).rejects.toThrow("Create payment failed");
    });

    it("should throw an error if capturePayment fails", async () => {
        mockPayPalPayment.captureOrder.mockRejectedValue(new Error("Capture payment failed"));

        await expect(paypalAdapter.capturePayment("order_12345")).rejects.toThrow("Capture payment failed");
    });

    it("should throw an error if checkPaymentStatus fails", async () => {
        mockPayPalPayment.getOrderStatus.mockRejectedValue(new Error("Check payment status failed"));

        await expect(paypalAdapter.checkPaymentStatus("order_12345")).rejects.toThrow("Check payment status failed");
    });
});