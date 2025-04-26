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
exports.availabilities = void 0;
const express_1 = __importDefault(require("express"));
const availabilities_controller_1 = __importDefault(require("./availabilities.controller"));
// const logger = require('../../utils/logger');
exports.availabilities = express_1.default.Router();
/**
 * @swagger
 * /appointments/markAvailability:
 *   post:
 *     summary: Vet marks their availability.
 *     tags:
 *       - appointments
 *     description: Allows a vet to mark a day they are available.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             vet_id: "vet-uuid-here"
 *             available_date: "2025-04-01"
 *     responses:
 *       200:
 *         description: Availability marked successfully.
 */
exports.availabilities.post('/markAvailability', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vet_id, available_date } = req.body;
    try {
        const result = yield availabilities_controller_1.default.markAvailability(vet_id, available_date);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
/**
 * @swagger
 * /appointments/availableVets:
 *   get:
 *     summary: Get available vets on a given date.
 *     tags:
 *       - appointments
 *     description: Retrieve the list of vets available on a specific day.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date to check availability (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of available vets.
 */
exports.availabilities.get('/getAvailableVets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query;
    try {
        const result = yield availabilities_controller_1.default.getAvailableVets(date);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
/**
* @swagger
* /appointments/getAvailabilityForVet:
*   get:
*     summary: Get a vet's availability.
*     tags:
*       - appointments
*     description: Retrieve the list of dates a specific vet is available.
*     parameters:
*       - in: query
*         name: vet_id
*         schema:
*           type: string
*         required: true
*         description: The vet's ID
*     responses:
*       200:
*         description: List of available dates for the vet.
*/
exports.availabilities.get('/getAvailabilityForVet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vet_id } = req.query;
    try {
        const result = yield availabilities_controller_1.default.getAvailabilityForVet(vet_id);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
