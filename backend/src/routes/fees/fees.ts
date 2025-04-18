import express, { Request, Response } from 'express';
import FeesController from './fees.controller';

export const fees = express.Router();

/**
 * @swagger
 * /fees/consultation-fee:
 *   get:
 *     summary: Get consultation fee based on current date and time.
 *     description: Returns total consultation fee combining weekday/weekend and time of day charges.
 *     tags:
 *       - fee
 *     responses:
 *       200:
 *         description: Consultation fee details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                 time:
 *                   type: string
 *                 baseFee:
 *                   type: number
 *                 timeFee:
 *                   type: number
 *                 total:
 *                   type: number
 */
fees.get('/consultation-fee', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await FeesController.getConsultationFee();
    res.status(200).type('json').send({
      status: 'success',
      ...result,
      message: 'Consultation fee calculated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).type('json').send({
      status: 'error',
      message: 'Error calculating consultation fee',
    });
  }
});
