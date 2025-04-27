import { PaymentSystem } from "../../models/payment/payment_system";
import PaymentService from "./payments.service";
const logger = require('../../utils/logger');

const PaymentsController = {
    createPayment: async (userId: string, amount: number, currency: string, description: string, paymentType: string | null = null) => {
        try {
            const paymentSystem = new PaymentSystem(paymentType)
            const paymentId = await paymentSystem.createPayment(amount, currency, description);
            await PaymentService.createPayment(userId, amount, currency, paymentId);
            return paymentId; // Return the order ID

        } catch (error) {
            logger.error("Failed to create payment.", error);
            throw error;
        }
    },
    capturePayment: async (paymentId: string) => {
        try {
            const paymentDetails: any = await PaymentService.checkPaymentStatus(paymentId);
            const paymentSystem = new PaymentSystem(paymentDetails.type)
            const paymentStatus = await paymentSystem.capturePayment(paymentId);
            await PaymentService.capturePayment(paymentId);
            return paymentStatus; // Return the order detils

        } catch (error) {
            logger.error("Failed to capture payment.", error);
            throw error;
        }
    },
    checkPaymentStatus: async (paymentId: string, paymentType: string | null = null) => {
        try {
            const paymentDetails: any = await PaymentService.checkPaymentStatus(paymentId);
            const paymentSystem = new PaymentSystem(paymentDetails.type);
            const paymentStatus = await paymentSystem.checkPaymentStatus(paymentId);
            return paymentStatus; // Return the order detils

        } catch (error) {
            logger.error("Failed to check payment status.", error);
            throw error;
        }
    },
}

export default PaymentsController;