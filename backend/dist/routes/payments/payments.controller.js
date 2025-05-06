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
const payment_system_1 = require("../../models/payment/payment_system");
const payments_service_1 = __importDefault(require("./payments.service"));
const logger = require('../../utils/logger');
const PaymentsController = {
    createPayment: (userId_1, amount_1, currency_1, description_1, ...args_1) => __awaiter(void 0, [userId_1, amount_1, currency_1, description_1, ...args_1], void 0, function* (userId, amount, currency, description, paymentType = null) {
        try {
            const paymentSystem = new payment_system_1.PaymentSystem(paymentType);
            const paymentId = yield paymentSystem.createPayment(amount, currency, description);
            yield payments_service_1.default.createPayment(userId, amount, currency, paymentId);
            return paymentId; // Return the order ID
        }
        catch (error) {
            logger.error("Failed to create payment.", error);
            throw error;
        }
    }),
    capturePayment: (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const paymentDetails = yield payments_service_1.default.checkPaymentStatus(paymentId);
            const paymentSystem = new payment_system_1.PaymentSystem(paymentDetails.type);
            const paymentStatus = yield paymentSystem.capturePayment(paymentId);
            yield payments_service_1.default.capturePayment(paymentId);
            return paymentStatus; // Return the order detils
        }
        catch (error) {
            logger.error("Failed to capture payment.", error);
            throw error;
        }
    }),
    checkPaymentStatus: (paymentId_1, ...args_1) => __awaiter(void 0, [paymentId_1, ...args_1], void 0, function* (paymentId, paymentType = null) {
        try {
            const paymentDetails = yield payments_service_1.default.checkPaymentStatus(paymentId);
            const paymentSystem = new payment_system_1.PaymentSystem(paymentDetails.type);
            const paymentStatus = yield paymentSystem.checkPaymentStatus(paymentId);
            return paymentStatus; // Return the order detils
        }
        catch (error) {
            logger.error("Failed to check payment status.", error);
            throw error;
        }
    }),
};
exports.default = PaymentsController;
