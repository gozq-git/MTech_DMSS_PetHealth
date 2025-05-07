import PaymentsController from "../../../src/routes/payments/payments.controller";
import PaymentService from "../../../src/routes/payments/payments.service";
import { PaymentSystem } from "../../../src/models/payment/payment_system";

jest.mock("../../../src/routes/payments/payments.service");
jest.mock("../../../src/models/payment/payment_system");

describe("PaymentsController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createPayment", () => {
        it("should create a payment and return the payment ID", async () => {
            const mockPaymentId = "pay_12345";
            const mockUserId = "user_123";
            const mockAmount = 100.0;
            const mockCurrency = "USD";
            const mockDescription = "Test payment";
            const mockPaymentType = "stripe";

            (PaymentSystem.prototype.createPayment as jest.Mock).mockResolvedValue(mockPaymentId);
            (PaymentService.createPayment as jest.Mock).mockResolvedValue(undefined);

            const paymentId = await PaymentsController.createPayment(
                mockUserId,
                mockAmount,
                mockCurrency,
                mockDescription,
                mockPaymentType
            );

            expect(paymentId).toBe(mockPaymentId);
            expect(PaymentSystem.prototype.createPayment).toHaveBeenCalledWith(mockAmount, mockCurrency, mockDescription);
            expect(PaymentService.createPayment).toHaveBeenCalledWith(mockUserId, mockAmount, mockCurrency, mockPaymentId);
        });

        it("should throw an error if payment creation fails", async () => {
            const mockError = new Error("Payment creation failed");
            (PaymentSystem.prototype.createPayment as jest.Mock).mockRejectedValue(mockError);

            await expect(
                PaymentsController.createPayment("user_123", 100.0, "USD", "Test payment", "stripe")
            ).rejects.toThrow("Payment creation failed");
        });
    });

    describe("capturePayment", () => {
        it("should capture a payment and return the status", async () => {
            const mockPaymentId = "pay_12345";
            const mockPaymentStatus = { success: true };
            const mockPaymentDetails = { type: "stripe" };

            (PaymentService.checkPaymentStatus as jest.Mock).mockResolvedValue(mockPaymentDetails);
            (PaymentSystem.prototype.capturePayment as jest.Mock).mockResolvedValue(mockPaymentStatus);
            (PaymentService.capturePayment as jest.Mock).mockResolvedValue(undefined);

            const status = await PaymentsController.capturePayment(mockPaymentId);

            expect(status).toEqual(mockPaymentStatus);
            expect(PaymentService.checkPaymentStatus).toHaveBeenCalledWith(mockPaymentId);
            expect(PaymentSystem.prototype.capturePayment).toHaveBeenCalledWith(mockPaymentId);
            expect(PaymentService.capturePayment).toHaveBeenCalledWith(mockPaymentId);
        });

        it("should throw an error if payment capture fails", async () => {
            const mockError = new Error("Payment capture failed");
            (PaymentService.checkPaymentStatus as jest.Mock).mockRejectedValue(mockError);

            await expect(PaymentsController.capturePayment("pay_12345")).rejects.toThrow("Payment capture failed");
        });
    });

    describe("checkPaymentStatus", () => {
        it("should return the payment status", async () => {
            const mockPaymentId = "pay_12345";
            const mockPaymentStatus = "captured";
            const mockPaymentDetails = { type: "stripe" };

            (PaymentService.checkPaymentStatus as jest.Mock).mockResolvedValue(mockPaymentDetails);
            (PaymentSystem.prototype.checkPaymentStatus as jest.Mock).mockResolvedValue(mockPaymentStatus);

            const status = await PaymentsController.checkPaymentStatus(mockPaymentId);

            expect(status).toBe(mockPaymentStatus);
            expect(PaymentService.checkPaymentStatus).toHaveBeenCalledWith(mockPaymentId);
            expect(PaymentSystem.prototype.checkPaymentStatus).toHaveBeenCalledWith(mockPaymentId);
        });

        it("should throw an error if checking payment status fails", async () => {
            const mockError = new Error("Failed to check payment status");
            (PaymentService.checkPaymentStatus as jest.Mock).mockRejectedValue(mockError);

            await expect(PaymentsController.checkPaymentStatus("pay_12345")).rejects.toThrow("Failed to check payment status");
        });
    });
});