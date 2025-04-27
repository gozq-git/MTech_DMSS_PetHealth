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
exports.StripePaymentAdapter = void 0;
const stripe_payment_1 = require("./stripe_payment");
class StripePaymentAdapter {
    constructor() {
        this.stripe = new stripe_payment_1.StripePayment();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialization logic if needed
            console.log('Stripe Payment Adapter initialized');
        });
    }
    createPayment(amount, currency, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.createPaymentIntent(amount, currency);
                console.log(`Payment created with ID: ${paymentIntent.id}`);
                return paymentIntent.id; // Return the payment intent ID
            }
            catch (error) {
                console.error('Error creating payment:', error);
                throw error;
            }
        });
    }
    capturePayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.retrievePaymentIntent(paymentId);
                console.log(paymentIntent);
                if (paymentIntent.status === 'requires_payment_method') {
                    const confirmedPayment = yield this.stripe.confirmPaymentIntent(paymentId, 'pm_card_visa');
                    console.log(`Payment captured with ID: ${confirmedPayment.id}`);
                    return true;
                }
                else {
                    console.log(`Payment with ID: ${paymentId} does not require capture.`);
                    return false;
                }
            }
            catch (error) {
                console.error('Error capturing payment:', error);
                throw error;
            }
        });
    }
    checkPaymentStatus(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.retrievePaymentIntent(paymentId);
                return paymentIntent.status; // Return the status of the payment intent
            }
            catch (error) {
                console.error('Error checking payment status:', error);
                throw error;
            }
        });
    }
}
exports.StripePaymentAdapter = StripePaymentAdapter;
