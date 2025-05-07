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
exports.appointments = void 0;
const express_1 = __importDefault(require("express"));
const appointments_controller_1 = __importDefault(require("./appointments.controller"));
const logger = require('../../utils/logger');
exports.appointments = express_1.default.Router();
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
exports.appointments.post('/markAvailability', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vet_id, available_date } = req.body;
    try {
        const result = yield appointments_controller_1.default.markAvailability(vet_id, available_date);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        logger.error(error);
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
exports.appointments.get('/availableVets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query;
    try {
        const result = yield appointments_controller_1.default.getAvailableVets(date);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
/**
 * @swagger
 * /appointments/getAppointmentsForVet:
 *   get:
 *     summary: Get all appointments for a vet on a given date.
 *     tags:
 *       - appointments
 *     description: Retrieve the list of all appointments (pending, accepted, rejected) for a vet on a specific day.
 *     parameters:
 *       - in: query
 *         name: vet_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vet ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date to check for appointments (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of all appointments (pending, accepted, rejected).
 */
exports.appointments.get('/getAppointmentsForVet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vet_id, date } = req.query;
    try {
        const result = yield appointments_controller_1.default.getAppointmentsForVet(vet_id, date);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
/**
 * @swagger
 * /appointments/getAllAppointmentsForVet:
 *   get:
 *     summary: Get all appointments for a vet (across all dates).
 *     tags:
 *       - appointments
 *     description: Retrieve the list of all appointments (pending, accepted, rejected) for a vet, regardless of the date.
 *     parameters:
 *       - in: query
 *         name: vet_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vet ID
 *     responses:
 *       200:
 *         description: List of all appointments (pending, accepted, rejected) across all dates.
 */
exports.appointments.get('/getAllAppointmentsForVet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vet_id } = req.query;
    try {
        const result = yield appointments_controller_1.default.getAllAppointmentsForVet(vet_id);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
/**
 * @swagger
 * /appointments/getAppointmentsForUser:
 *   get:
 *     summary: Get all appointments for a user.
 *     tags:
 *       - appointments
 *     description: Retrieve the list of all appointments (pending, accepted, rejected) for a user.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of all appointments (pending, accepted, rejected).
 */
exports.appointments.get('/getAppointmentsForUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.query;
    try {
        const result = yield appointments_controller_1.default.getAppointmentsForUser(user_id);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
/**
 * @swagger
 * /appointments/bookAppointment:
 *   post:
 *     summary: Book an appointment with a vet.
 *     tags:
 *       - appointments
 *     description: Allows a user to book an appointment by selecting a vet on an available day.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             user_id: "user-uuid-here"
 *             vet_id: "vet-uuid-here"
 *             pet_id: "pet-uuid-here"
 *             pet_name: "Buddy"
 *             appointment_date: "2025-04-01"
 *             appointment_time: "14:00:00"
 *     responses:
 *       200:
 *         description: Appointment booked successfully.
 */
exports.appointments.post('/bookAppointment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield appointments_controller_1.default.bookAppointment(req.body);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
/**
 * @swagger
 * /appointments/respondAppointment:
 *   post:
 *     summary: Vet responds to an appointment request.
 *     tags:
 *       - appointments
 *     description: Allows a vet to accept or reject an appointment request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             appointment_id: "appointment-uuid-here"
 *             status: "accepted"
 *             rejection_reason: "Not available on this day"
 *     responses:
 *       200:
 *         description: Appointment updated successfully.
 */
exports.appointments.post('/respondAppointment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointment_id, status, rejection_reason } = req.body;
    try {
        const result = yield appointments_controller_1.default.respondAppointment(appointment_id, status, rejection_reason);
        res.status(200).json({ status: 'success', data: result });
    }
    catch (error) {
        logger.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
}));
