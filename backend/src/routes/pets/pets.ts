import express, { Request, Response } from 'express';
import PetsController from './pets.controller';

export const pets = express.Router();

/**
 * @swagger
 * /pets/retrievePet/{id}:
 *   get:
 *     summary: Retrieve a single pet by ID.
 *     description: Retrieve a single pet by ID. Can be used to populate a pet profile when prototyping or testing an API.
 *     tags:
 *       - pets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the pet to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single pet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 owner_id:
 *                   type: string
 *                 species:
 *                   type: string
 *                 breed:
 *                   type: string
 *                 date_of_birth:
 *                   type: string
 *                   format: date
 *                 weight:
 *                   type: number
 *                 height_cm:
 *                   type: number
 *                 length_cm:
 *                   type: number
 *                 neck_girth_cm:
 *                   type: number
 *                 chest_girth_cm:
 *                   type: number
 *                 last_measured:
 *                   type: string
 *                   format: date
 *                 is_neutered:
 *                   type: boolean
 *                 microchip_number:
 *                   type: string
 *                 photo_url:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 is_deleted:
 *                   type: boolean
 */
pets.get('/retrievePet/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await PetsController.retrievePet(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error retrieving pet" });
    }
});

/**
 * @swagger
 * /pets/getPetsByOwner/{ownerId}:
 *   get:
 *     summary: Retrieve all pets by owner ID.
 *     description: Retrieve a list of all pets owned by a specific owner.
 *     tags:
 *       - pets
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         description: Numeric ID of the owner.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of pets.
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
 *                   owner_id:
 *                     type: string
 *                   species:
 *                     type: string
 *                   breed:
 *                     type: string
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                   weight:
 *                     type: number
 *                   height_cm:
 *                     type: number
 *                   length_cm:
 *                     type: number
 *                   neck_girth_cm:
 *                     type: number
 *                   chest_girth_cm:
 *                     type: number
 *                   last_measured:
 *                     type: string
 *                     format: date
 *                   is_neutered:
 *                     type: boolean
 *                   microchip_number:
 *                     type: string
 *                   photo_url:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                   is_deleted:
 *                     type: boolean
 */
pets.get('/getPetsByOwner/:ownerId', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await PetsController.getPetsByOwner(req.params.ownerId);
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error retrieving pets by owner ID" });
    }
});

/**
 * @swagger
 * /pets/insertPet:
 *   post:
 *     summary: Insert a new pet.
 *     description: Insert a new pet into the database.
 *     tags:
 *       - pets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               owner_id:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               weight:
 *                 type: number
 *               height_cm:
 *                 type: number
 *               length_cm:
 *                 type: number
 *               neck_girth_cm:
 *                 type: number
 *               chest_girth_cm:
 *                 type: number
 *               is_neutered:
 *                 type: boolean
 *               microchip_number:
 *                 type: string
 *               photo_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pet created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 owner_id:
 *                   type: string
 *                 species:
 *                   type: string
 *                 breed:
 *                   type: string
 *                 date_of_birth:
 *                   type: string
 *                   format: date
 *                 weight:
 *                   type: number
 *                 height_cm:
 *                   type: number
 *                 length_cm:
 *                   type: number
 *                 neck_girth_cm:
 *                   type: number
 *                 chest_girth_cm:
 *                   type: number
 *                 is_neutered:
 *                   type: boolean
 *                 microchip_number:
 *                   type: string
 *                 photo_url:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 is_deleted:
 *                   type: boolean
 */
pets.post('/insertPet', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await PetsController.insertPet(req.body);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error inserting pet" });
    }
});

/**
 * @swagger
 * /pets/getPets:
 *   get:
 *     summary: Retrieve all pets.
 *     description: Retrieve a list of all pets.
 *     tags:
 *       - pets
 *     responses:
 *       200:
 *         description: A list of pets.
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
 *                   owner_id:
 *                     type: string
 *                   species:
 *                     type: string
 *                   breed:
 *                     type: string
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                   weight:
 *                     type: number
 *                   height_cm:
 *                     type: number
 *                   length_cm:
 *                     type: number
 *                   neck_girth_cm:
 *                     type: number
 *                   chest_girth_cm:
 *                     type: number
 *                   last_measured:
 *                     type: string
 *                     format: date
 *                   is_neutered:
 *                     type: boolean
 *                   microchip_number:
 *                     type: string
 *                   photo_url:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                   is_deleted:
 *                     type: boolean
 */
pets.get('/getPets', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await PetsController.getPets();
        res.status(200).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error retrieving pets" });
    }
});