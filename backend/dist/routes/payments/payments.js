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
exports.payments = void 0;
const express_1 = __importDefault(require("express"));
const payments_controller_1 = __importDefault(require("./payments.controller"));
exports.payments = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API for managing payments
 */
/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100.0
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               description:
 *                 type: string
 *                 example: "Payment for order #1234"
 *               paymentType:
 *                 type: string
 *                 example: "stripe"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentId:
 *                   type: string
 *                   example: "pay_12345"
 *       500:
 *         description: Failed to create payment
 */
exports.payments.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency, description, paymentType } = req.body;
    try {
        const paymentId = yield payments_controller_1.default.createPayment(req.headers.userInfo, amount, currency, description, paymentType);
        res.status(201).send({ paymentId });
    }
    catch (error) {
        res.status(500).send({ error: "Failed to create payment.", details: error.message });
    }
}));
/**
 * @swagger
 * /payments/capture:
 *   post:
 *     summary: Capture a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: "pay_12345"
 *     responses:
 *       200:
 *         description: Payment captured successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Failed to capture payment
 */
exports.payments.post("/capture", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.body;
    try {
        const success = yield payments_controller_1.default.capturePayment(paymentId);
        res.status(200).send({ success });
    }
    catch (error) {
        res.status(500).send({ error: "Failed to capture payment.", details: error.message });
    }
}));
/**
 * @swagger
 * /payments/status/{paymentId}:
 *   get:
 *     summary: Check the status of a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the payment
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "captured"
 *       500:
 *         description: Failed to check payment status
 */
exports.payments.get("/status/:paymentId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.params;
    try {
        const status = yield payments_controller_1.default.checkPaymentStatus(paymentId);
        res.status(200).send({ status });
    }
    catch (error) {
        res.status(500).send({ error: "Failed to check payment status.", details: error.message });
    }
}));
exports.default = exports.payments;
