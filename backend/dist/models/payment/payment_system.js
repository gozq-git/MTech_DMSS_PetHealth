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
exports.PaymentSystem = void 0;
const paypal_adapter_1 = require("./paypal/paypal_adapter");
const stripe_adapter_1 = require("./stripe/stripe_adapter");
class PaymentSystem {
    constructor(adapterType = null) {
        switch (adapterType) {
            case "paypal":
                this.paymentAdapter = new paypal_adapter_1.PayPalPaymentAdapter();
                break;
            default:
                this.paymentAdapter = new stripe_adapter_1.StripePaymentAdapter();
        }
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.paymentAdapter.initialize();
        });
    }
    createPayment(amount, currency, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentAdapter.createPayment(amount, currency, description);
        });
    }
    capturePayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentAdapter.capturePayment(paymentId);
        });
    }
    checkPaymentStatus(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentAdapter.checkPaymentStatus(paymentId);
        });
    }
}
exports.PaymentSystem = PaymentSystem;
