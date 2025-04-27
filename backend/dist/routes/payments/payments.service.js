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
const index_1 = require("../../db/index"); // Import the Sequelize instance
const Models = index_1.sequelize.models;
const PaymentsService = {
    createPayment: (userId, amount, currency, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Store payment details in the database
            const paymentRecord = yield Models.PAYMENTS.create({
                user_id: userId || '1f010b3d-e2b5-6ea0-a416-e5e84a17696f',
                payment_system: "stripe", // Assuming Stripe as the default system
                payment_id: paymentId,
                amount,
                currency,
                status: "created",
            });
            return paymentRecord;
        }
        catch (error) {
            throw new Error(`Failed to create payment: ${error.message}`);
        }
    }),
    capturePayment: (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Update payment status in the database
            yield Models.PAYMENTS.update({ status: "captured" }, { where: { payment_id: paymentId } });
            return;
        }
        catch (error) {
            throw new Error(`Failed to capture payment: ${error.message}`);
        }
    }),
    checkPaymentStatus: (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Update payment status in the database
            const status = yield Models.PAYMENTS.findOne({ where: { payment_id: paymentId } });
            return status;
        }
        catch (error) {
            throw new Error(`Failed to check payment status: ${error.message}`);
        }
    }),
};
exports.default = PaymentsService;
