"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalPaymentAdapter = void 0;
const paypal_payment_1 = require("./paypal_payment");
class PayPalPaymentAdapter {
    constructor() {
        this.paypal = new paypal_payment_1.PayPalPayment();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialization logic if needed
            console.log("PayPal Payment Adapter initialized");
        });
    }
    createPayment(amount, currency, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = yield this.paypal.createOrder(amount, currency, description);
                console.log(`PayPal order created with ID: ${orderId}`);
                return orderId; // Return the order ID
            }
            catch (error) {
                console.error("Error creating PayPal payment:", error);
                throw error;
            }
        });
    }
    capturePayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isCaptured = yield this.paypal.captureOrder(paymentId);
                if (isCaptured) {
                    console.log(`PayPal payment captured with ID: ${paymentId}`);
                }
                else {
                    console.log(`PayPal payment with ID: ${paymentId} could not be captured.`);
                }
                return isCaptured;
            }
            catch (error) {
                console.error("Error capturing PayPal payment:", error);
                throw error;
            }
        });
    }
    checkPaymentStatus(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield this.paypal.getOrderStatus(paymentId);
                console.log(`PayPal payment status for ID ${paymentId}: ${status}`);
                return status; // Return the payment status
            }
            catch (error) {
                console.error("Error checking PayPal payment status:", error);
                throw error;
            }
        });
    }
}
exports.PayPalPaymentAdapter = PayPalPaymentAdapter;
