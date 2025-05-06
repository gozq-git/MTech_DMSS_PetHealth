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
exports.vaccination_records = void 0;
const express_1 = __importDefault(require("express"));
const vaccination_records_controller_1 = __importDefault(require("./vaccination_records.controller"));
exports.vaccination_records = express_1.default.Router();
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
exports.vaccination_records.get('/:petId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield vaccination_records_controller_1.default.getVaccinationRecordsByPetId(req.params.petId);
        // res.status(200).send(result);
        res.status(201).type('json').send({
            status: 'success',
            data: result,
            message: "Vaccination records retrieved successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({
            status: 'failure',
            data: null,
            error: 'Error retrieving vaccination records'
        });
    }
}));
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
exports.vaccination_records.post('/:petId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield vaccination_records_controller_1.default.insertVaccinationRecord(req.params.petId, req.body);
        res.status(201).type('json').send({
            status: 'success',
            data: result,
            message: "Vaccination record added successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).type('text').send({ error: 'Error inserting vaccination record' });
    }
}));
