import { PayPalPaymentAdapter } from "../../../../src/models/payment/paypal/paypal_adapter";

describe("PayPalPaymentAdapter", () => {
    let paypalAdapter: PayPalPaymentAdapter;

    beforeEach(() => {
        paypalAdapter = new PayPalPaymentAdapter();
    });

    it("should initialize the PayPal adapter", async () => {
        const consoleSpy = jest.spyOn(console, "log");
        await paypalAdapter.initialize();
        expect(consoleSpy).toHaveBeenCalledWith("PayPal Payment Adapter initialized");
        consoleSpy.mockRestore();
    });

    it("should create a payment and return an order ID", async () => {
        const mockOrderId = "ORDER123";
        const createOrderSpy = jest.spyOn(paypalAdapter["paypal"], "createOrder").mockResolvedValue(mockOrderId);

        const orderId = await paypalAdapter.createPayment(100, "USD", "Test Payment");
        expect(orderId).toBe(mockOrderId);
        expect(createOrderSpy).toHaveBeenCalledWith(100, "USD", "Test Payment");

        createOrderSpy.mockRestore();
    });

    it("should capture a payment and return true if successful", async () => {
        const mockPaymentId = "PAYMENT123";
        const captureOrderSpy = jest.spyOn(paypalAdapter["paypal"], "captureOrder").mockResolvedValue(true);

        const isCaptured = await paypalAdapter.capturePayment(mockPaymentId);
        expect(isCaptured).toBe(true);
        expect(captureOrderSpy).toHaveBeenCalledWith(mockPaymentId);

        captureOrderSpy.mockRestore();
    });

    it("should return the payment status", async () => {
        const mockPaymentId = "PAYMENT123";
        const mockStatus = "COMPLETED";
        const getOrderStatusSpy = jest.spyOn(paypalAdapter["paypal"], "getOrderStatus").mockResolvedValue(mockStatus);

        const status = await paypalAdapter.checkPaymentStatus(mockPaymentId);
        expect(status).toBe(mockStatus);
        expect(getOrderStatusSpy).toHaveBeenCalledWith(mockPaymentId);

        getOrderStatusSpy.mockRestore();
    });

    it("should throw an error if createPayment fails", async () => {
        const createOrderSpy = jest.spyOn(paypalAdapter["paypal"], "createOrder").mockRejectedValue(new Error("Create payment error"));

        await expect(paypalAdapter.createPayment(100, "USD", "Test Payment")).rejects.toThrow("Create payment error");
        createOrderSpy.mockRestore();
    });

    it("should throw an error if capturePayment fails", async () => {
        const captureOrderSpy = jest.spyOn(paypalAdapter["paypal"], "captureOrder").mockRejectedValue(new Error("Capture payment error"));

        await expect(paypalAdapter.capturePayment("PAYMENT123")).rejects.toThrow("Capture payment error");
        captureOrderSpy.mockRestore();
    });

    it("should throw an error if checkPaymentStatus fails", async () => {
        const getOrderStatusSpy = jest.spyOn(paypalAdapter["paypal"], "getOrderStatus").mockRejectedValue(new Error("Check status error"));

        await expect(paypalAdapter.checkPaymentStatus("PAYMENT123")).rejects.toThrow("Check status error");
        getOrderStatusSpy.mockRestore();
    });
});