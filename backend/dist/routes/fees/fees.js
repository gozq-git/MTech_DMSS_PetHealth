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
exports.fees = void 0;
const express_1 = __importDefault(require("express"));
const fees_controller_1 = __importDefault(require("./fees.controller"));
exports.fees = express_1.default.Router();
/**
 * @swagger
 * /fees/consultation-fee:
 *   get:
 *     summary: Get consultation fee based on current date and time.
 *     description: Returns total consultation fee combining weekday/weekend and time of day charges.
 *     tags:
 *       - fee
 *     responses:
 *       200:
 *         description: Consultation fee details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                 time:
 *                   type: string
 *                 baseFee:
 *                   type: number
 *                 timeFee:
 *                   type: number
 *                 total:
 *                   type: number
 */
exports.fees.get('/consultation-fee', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield fees_controller_1.default.getConsultationFee();
        res.status(200).type('json').send(Object.assign(Object.assign({ status: 'success' }, result), { message: 'Consultation fee calculated successfully' }));
    }
    catch (error) {
        console.error(error);
        res.status(500).type('json').send({
            status: 'error',
            message: 'Error calculating consultation fee',
        });
    }
}));
