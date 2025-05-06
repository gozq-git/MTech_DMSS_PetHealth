import express, { Request, Response } from 'express';
import PaymentsController from "./payments.controller";
import UsersController from "../users/users.controller";

export const payments: express.Router = express.Router();

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
payments.post("/create", async (req: Request, res: Response) => {
    // console.debug("payments /create req.headers.userInfo",req.headers.userInfo);
    const { amount, currency, description, paymentType } = req.body;
    let userInfo: any = {};
    try {
        userInfo = typeof req.headers.userInfo === 'string'
            ? JSON.parse(req.headers.userInfo)
            : req.headers.userInfo;
    } catch (error) {
        res.status(500).send({ error: "Invalid user information format" });
        return;
    }
    const preferred_username = userInfo?.preferred_username
    if (!preferred_username || typeof preferred_username !== 'string') {
        res.status(500).send({ error: "Missing or invalid user information(preferred_username)" });
        return;
    }
    try {
        const user = await UsersController.retrieveUser(preferred_username)
        if (!user || !user.id) {
            res.status(500).send({ error: "User not found" });
            return;
        }
        const paymentId = await PaymentsController.createPayment(user.id, amount, currency, description, paymentType);
        res.status(201).send({ paymentId });
        return;
    } catch (error: any) {
        res.status(500).send({ error: "Failed to create payment.", details: error.message });
        return;
    }
});

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
payments.post("/capture", async (req: Request, res: Response) => {
    const { paymentId } = req.body;
    try {
        const success = await PaymentsController.capturePayment(paymentId);
        res.status(200).send({ success });
    } catch (error: any) {
        res.status(500).send({ error: "Failed to capture payment.", details: error.message });
    }
});

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
payments.get("/status/:paymentId", async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    try {
        const status = await PaymentsController.checkPaymentStatus(paymentId);
        res.status(200).send({ status });
    } catch (error: any) {
        res.status(500).send({ error: "Failed to check payment status.", details: error.message });
    }
});

export default payments;