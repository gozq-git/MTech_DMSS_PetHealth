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
exports.medication_records = void 0;
const express_1 = __importDefault(require("express"));
const medication_records_controller_1 = __importDefault(require("./medication_records.controller"));
exports.medication_records = express_1.default.Router();
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
exports.medication_records.get('/getAll', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield medication_records_controller_1.default.getMedicationRecords();
        res.status(200).json(records);
    }
    catch (error) {
        res.status(500).json({ error: "Error retrieving medication records" });
    }
}));
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
exports.medication_records.get('/retrieve/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield medication_records_controller_1.default.retrieveMedicationRecord(req.params.id);
        res.status(200).json(record);
    }
    catch (error) {
        res.status(500).json({ error: "Error retrieving medication record" });
    }
}));
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
exports.medication_records.post('/insert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield medication_records_controller_1.default.insertMedicationRecord(req.body);
        res.status(201).json({
            status: 'success',
            data: result,
            message: 'Medication record added successfully'
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error inserting medication record" });
    }
}));
