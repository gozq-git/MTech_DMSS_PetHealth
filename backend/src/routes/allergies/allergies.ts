import express, { Request, Response } from 'express';
import AllergyController from './allergies.controller';

export const allergies = express.Router();

/**
 * @swagger
 * /allergies/getAllergiesByPetId/{petId}:
 *   get:
 *     summary: Retrieve all allergies for a specific pet.
 *     description: Fetch a list of allergies associated with a pet ID.
 *     tags:
 *       - allergies
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         description: UUID of the pet.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of allergies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   pet_id:
 *                     type: string
 *                   allergy_name:
 *                     type: string
 *                   severity:
 *                     type: string
 *                   first_observed:
 *                     type: string
 *                     format: date
 *                   last_updated:
 *                     type: string
 *                     format: date
 *                   notes:
 *                     type: string
 */
allergies.get('/getAllergiesByPetId/:petId', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await AllergyController.getAllergiesByPetId(req.params.petId);
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error retrieving allergies by pet ID" });
    }
});

/**
 * @swagger
 * /allergies/insertAllergy:
 *   post:
 *     summary: Insert a new allergy record.
 *     description: Adds a new allergy for a pet.
 *     tags:
 *       - allergies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pet_id:
 *                 type: string
 *               allergy_name:
 *                 type: string
 *               severity:
 *                 type: string
 *               first_observed:
 *                 type: string
 *                 format: date
 *               last_updated:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Allergy added successfully.
 */
allergies.post('/insertAllergy', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await AllergyController.insertAllergy(req.body);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error inserting allergy" });
    }
});

/**
 * @swagger
 * /allergies/updateAllergy/{id}:
 *   put:
 *     summary: Update an existing allergy by ID.
 *     description: Modifies details of an existing allergy.
 *     tags:
 *       - allergies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the allergy record.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               allergy_name:
 *                 type: string
 *               severity:
 *                 type: string
 *               first_observed:
 *                 type: string
 *                 format: date
 *               last_updated:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Allergy updated successfully.
 */
allergies.put('/updateAllergy/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await AllergyController.updateAllergyById(req.params.id, req.body);
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error updating allergy" });
    }
});

export default allergies;
