import express, { Request, Response } from 'express';
import MedicationRecordsController from './medication_records.controller';

export const medication_records = express.Router();

/**
 * @swagger
 * /medication_records/getAll:
 *   get:
 *     summary: Get all medication records
 *     tags: [medication_records]
 *     responses:
 *       200:
 *         description: List of medication records
 */
medication_records.get('/getAll', async (_req: Request, res: Response) => {
    try {
        const records = await MedicationRecordsController.getMedicationRecords();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving medication records" });
    }
});

/**
 * @swagger
 * /medication_records/retrieve/{id}:
 *   get:
 *     summary: Retrieve a medication record by ID
 *     tags: [medication_records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A medication record
 */
medication_records.get('/retrieve/:id', async (req: Request, res: Response) => {
    try {
        const record = await MedicationRecordsController.retrieveMedicationRecord(req.params.id);
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving medication record" });
    }
});

/**
 * @swagger
 * /medication_records/insert:
 *   post:
 *     summary: Insert a new medication record
 *     tags: [medication_records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pet_id, medication_id]
 *             properties:
 *               pet_id:
 *                 type: string
 *               medication_id:
 *                 type: string
 *               dosage:
 *                 type: string
 *               frequency:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               prescribed_by:
 *                 type: string
 *               notes:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Medication record created
 */
medication_records.post('/insert', async (req: Request, res: Response) => {
    try {
        const result = await MedicationRecordsController.insertMedicationRecord(req.body);
        res.status(201).json({
            status: 'success',
            data: result,
            message: 'Medication record added successfully'
        });
    } catch (error) {
        res.status(500).json({ error: "Error inserting medication record" });
    }
});
