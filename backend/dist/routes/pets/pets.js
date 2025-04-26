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
exports.pets = void 0;
const express_1 = __importDefault(require("express"));
const pets_controller_1 = __importDefault(require("./pets.controller"));
exports.pets = express_1.default.Router();
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
exports.pets.get('/retrievePet/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pets_controller_1.default.retrievePet(req.params.id);
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error retrieving pet" });
    }
}));
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
 *           type: string
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
exports.pets.get('/getPetsByOwner/:ownerId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pets_controller_1.default.getPetsByOwner(req.params.ownerId);
        // res.status(200).send(result);
        if (result === null || result === undefined || result.length === 0) {
            res.status(200).type('json').send({ status: 'error', message: 'No pets found!' });
        }
        else {
            res.status(200).type('json').send({
                status: 'success',
                data: result,
                message: "Pets retrieved successfully"
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error retrieving pets by owner ID" });
    }
}));
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
exports.pets.post('/insertPet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const result = yield pets_controller_1.default.insertPet(req.body);
        res.status(201).type('json').send({ status: 'success', data: result, message: "Pet added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error inserting pet" });
    }
}));
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
exports.pets.get('/getPets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pets_controller_1.default.getPets();
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error retrieving pets" });
    }
}));
