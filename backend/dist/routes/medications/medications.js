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
exports.medications = void 0;
const express_1 = __importDefault(require("express"));
const medications_controller_1 = __importDefault(require("./medications.controller"));
exports.medications = express_1.default.Router();
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
exports.medications.get('/retrieveMedication/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield medications_controller_1.default.retrieveMedication(req.params.id);
        res.status(200).type('text').send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).type('json').send({ error: 'Error retrieving medication' });
    }
}));
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
exports.medications.get('/getMedications', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield medications_controller_1.default.getMedications();
        res.status(200).send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).type('json').send({ error: 'Error retrieving medications' });
    }
}));
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
exports.medications.post('/insertMedication', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield medications_controller_1.default.insertMedication(req.body);
        res.status(201).send({
            status: 'success',
            data: result,
            message: 'Medication added successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).type('json').send({ error: 'Error inserting medication' });
    }
}));
