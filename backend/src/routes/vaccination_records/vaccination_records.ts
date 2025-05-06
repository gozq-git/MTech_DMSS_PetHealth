import express, {Request, Response} from 'express';
import VaccinationRecordsController from './vaccination_records.controller';

export const vaccination_records = express.Router();

/**
 * @swagger
 * /vaccination_records/{petId}:
 *   get:
 *     summary: Get vaccination records for a pet
 *     description: Retrieve all vaccination records associated with a given pet ID.
 *     tags:
 *       - vaccination-records
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: UUID of the pet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of vaccination records.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       pet_id: { type: string }
 *                       name: { type: string }
 *                       description: { type: string }
 *                       administered_at: { type: string, format: date-time }
 *                       expires_at: { type: string, format: date-time }
 *                       lot_number: { type: string }
 *                       administered_by: { type: string }
 *                       next_due_at: { type: string, format: date-time }
 *                       is_valid: { type: boolean }
 *                       created_at: { type: string, format: date-time }
 *                       updated_at: { type: string, format: date-time }
 *                 message:
 *                   type: string
 *                   example: Vaccination records retrieved successfully
 *       500:
 *         description: Error retrieving vaccination records.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failure
 *                 data:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: Error retrieving vaccination records
 */
vaccination_records.get('/:petId', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await VaccinationRecordsController.getVaccinationRecordsByPetId(req.params.petId);
        // res.status(200).send(result);
        res.status(201).type('json').send({
            status: 'success',
            data: result,
            message: "Vaccination records retrieved successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({
            status: 'failure',
            data: null,
            error: 'Error retrieving vaccination records'
        });
    }
});

/**
 * @swagger
 * /vaccination_records/{petId}:
 *   post:
 *     summary: Insert a vaccination record for a pet
 *     description: Adds a new vaccination record associated with a given pet ID.
 *     tags:
 *       - vaccination-records
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: UUID of the pet
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               administered_at: { type: string, format: date-time }
 *               expires_at: { type: string, format: date-time }
 *               lot_number: { type: string }
 *               administered_by: { type: string }
 *               next_due_at: { type: string, format: date-time }
 *               is_valid: { type: boolean }
 *     responses:
 *       201:
 *         description: Vaccination record created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     pet_id: { type: string }
 *                     name: { type: string }
 *                     created_at: { type: string, format: date-time }
 *                 message:
 *                   type: string
 *                   example: Vaccination record added successfully
 *       500:
 *         description: Error inserting vaccination record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failure
 *                 data:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: Error inserting vaccination record
 */
vaccination_records.post('/:petId', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await VaccinationRecordsController.insertVaccinationRecord(req.params.petId, req.body);
        res.status(201).type('json').send({
            status: 'success',
            data: result,
            message: "Vaccination record added successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({error: 'Error inserting vaccination record'});
    }
});
