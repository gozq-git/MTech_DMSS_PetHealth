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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const uuid_1 = require("uuid");
const logger = require('../../utils/logger');
const models = db_1.sequelize.models;
const AppointmentsService = {
    // Vet marks availability for a given date
    markAvailability: (vetId, availableDate) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Create a new availability record
            const availability = yield models.AVAILABILITIES.create({
                id: (0, uuid_1.v4)(),
                vet_id: vetId,
                available_date: availableDate,
            });
            return availability;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error marking availability");
        }
    }),
    // Get available vets for a given date (optionally include vet details)
    getAvailableVets: (date) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const availabilities = yield models.AVAILABILITIES.findAll({
                where: { available_date: date },
                include: [
                    {
                        model: models.VETS,
                        required: true,
                    }
                ]
            });
            return availabilities;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error retrieving available vets");
        }
    }),
    // Book an appointment by a user with a selected vet on a given date (and time)
    bookAppointment: (appointmentData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newAppointment = yield models.APPOINTMENTS.create({
                id: (0, uuid_1.v4)(),
                user_id: appointmentData.user_id,
                vet_id: appointmentData.vet_id,
                appointment_date: appointmentData.appointment_date,
                appointment_time: appointmentData.appointment_time || null,
                status: 'pending'
            });
            return newAppointment;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error booking appointment");
        }
    }),
    // Vet responds to a booking request
    respondAppointment: (appointmentId, status, rejection_reason) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const appointment = yield models.APPOINTMENTS.findOne({
                where: { id: appointmentId }
            });
            if (!appointment) {
                throw new Error("Appointment not found");
            }
            appointment.status = status;
            if (status === 'rejected') {
                appointment.rejection_reason = rejection_reason || 'No reason provided';
            }
            yield appointment.save();
            return appointment;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error updating appointment response");
        }
    }),
    // Fetch all appointments for a given vet on a specific date (pending, accepted, and rejected)
    getAppointmentsForVet: (vetId, date) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const appointments = yield models.APPOINTMENTS.findAll({
                where: {
                    appointment_date: date,
                    vet_id: vetId,
                },
                include: [
                    {
                        model: models.USERS,
                        required: true,
                    },
                ],
            });
            return appointments;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error retrieving appointments");
        }
    }),
    // Fetch all appointments for a given user(pending, accepted, and rejected)
    getAppointmentsForUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const appointments = yield models.APPOINTMENTS.findAll({
                where: {
                    user_id: userId,
                },
                include: [
                    {
                        model: models.USERS,
                        required: true,
                    },
                ],
            });
            return appointments;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error retrieving appointments");
        }
    })
};
exports.default = AppointmentsService;
