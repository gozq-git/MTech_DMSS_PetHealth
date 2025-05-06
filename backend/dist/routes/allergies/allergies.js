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
exports.allergies = void 0;
const express_1 = __importDefault(require("express"));
const allergies_controller_1 = __importDefault(require("./allergies.controller"));
exports.allergies = express_1.default.Router();
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
exports.allergies.get('/getAllergiesByPetId/:petId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield allergies_controller_1.default.getAllergiesByPetId(req.params.petId);
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error retrieving allergies by pet ID" });
    }
}));
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
exports.allergies.post('/insertAllergy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield allergies_controller_1.default.insertAllergy(req.body);
        res.status(201).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error inserting allergy" });
    }
}));
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
exports.allergies.put('/updateAllergy/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield allergies_controller_1.default.updateAllergyById(req.params.id, req.body);
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: "Error updating allergy" });
    }
}));
exports.default = exports.allergies;
