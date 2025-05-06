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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePayment = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../../config/config");
class StripePayment {
    constructor() {
        this.stripe = new stripe_1.default(config_1.config.stripe_secret_key, { apiVersion: '2025-03-31.basil' });
    }
    /**
     * Creates a payment intent with the specified amount and currency.
     * @param amount - The amount to charge in the smallest currency unit (e.g., cents for USD).
     * @param currency - The currency code (e.g., 'usd').
     * @param paymentMethodId - The payment method ID (optional).
     * @returns The payment intent object.
     */
    createPaymentIntent(amount, currency, paymentMethodId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.create({
                    amount,
                    currency,
                    payment_method: paymentMethodId,
                    confirm: paymentMethodId ? true : false, // Automatically confirm if payment method is provided
                });
                return paymentIntent;
            }
            catch (error) {
                console.error('Error creating payment intent:', error);
                throw error;
            }
        });
    }
    /**
     * Retrieves a payment intent by its ID.
     * @param paymentIntentId - The ID of the payment intent to retrieve.
     * @returns The payment intent object.
     */
    retrievePaymentIntent(paymentIntentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.retrieve(paymentIntentId);
                return paymentIntent;
            }
            catch (error) {
                console.error('Error retrieving payment intent:', error);
                throw error;
            }
        });
    }
    /**
     * Confirms a payment intent with a payment method.
     * @param paymentIntentId - The ID of the payment intent to confirm.
     * @param paymentMethodId - The payment method ID to use for confirmation.
     * @returns The confirmed payment intent object.
     */
    confirmPaymentIntent(paymentIntentId, paymentMethodId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.confirm(paymentIntentId, {
                    payment_method: paymentMethodId,
                    return_url: 'https://www.example.com',
                });
                return paymentIntent;
            }
            catch (error) {
                console.error('Error confirming payment intent:', error);
                throw error;
            }
        });
    }
}
exports.StripePayment = StripePayment;
