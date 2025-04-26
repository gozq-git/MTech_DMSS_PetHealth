import express, { Request, Response } from 'express';
import MedicationsController from './medications.controller';

export const medications = express.Router();

/**
 * @swagger
 * /medications/retrieveMedication/{id}:
 *   get:
 *     summary: Retrieve a medication by ID.
 *     description: Retrieves a single medication record by ID.
 *     tags:
 *       - medications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the medication to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single medication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: string
 *                 requires_prescription:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 */
medications.get('/retrieveMedication/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await MedicationsController.retrieveMedication(req.params.id);
        res.status(200).type('text').send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('json').send({ error: 'Error retrieving medication' });
    }
});

/**
 * @swagger
 * /medications/getMedications:
 *   get:
 *     summary: Retrieve all medications.
 *     description: Returns a list of all available medications.
 *     tags:
 *       - medications
 *     responses:
 *       200:
 *         description: A list of medications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   type:
 *                     type: string
 *                   requires_prescription:
 *                     type: boolean
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
medications.get('/getMedications', async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await MedicationsController.getMedications();
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('json').send({ error: 'Error retrieving medications' });
    }
});

/**
 * @swagger
 * /medications/insertMedication:
 *   post:
 *     summary: Insert a new medication.
 *     description: Adds a new medication to the database.
 *     tags:
 *       - medications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               requires_prescription:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Medication created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Medication'
 *                 message:
 *                   type: string
 */
medications.post('/insertMedication', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await MedicationsController.insertMedication(req.body);
        res.status(201).send({
            status: 'success',
            data: result,
            message: 'Medication added successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).type('json').send({ error: 'Error inserting medication' });
    }
});
