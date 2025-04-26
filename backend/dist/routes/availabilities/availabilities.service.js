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
const sequelize_1 = require("sequelize");
const models = db_1.sequelize.models;
const AvailabilitiesService = {
    // Vet marks availability for a given date
    markAvailability: (vetId, availableDate) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Create a new availability record
            const availability = yield models.AVAILABILITIES.create({
                id: (0, sequelize_1.UUIDV4)(),
                vet_id: vetId,
                available_date: availableDate,
            });
            return availability;
        }
        catch (error) {
            // logger.error(error);
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
            // logger.error(error);
            throw new Error("Error retrieving available vets");
        }
    }),
    getAvailabilityForVet: (vetId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const availabilities = yield models.AVAILABILITIES.findAll({
                where: { vet_id: vetId },
                attributes: ['available_date'],
                order: [['available_date', 'ASC']]
            });
            return availabilities;
        }
        catch (error) {
            // logger.error(error);
            throw new Error("Error retrieving vet availability");
        }
    }),
};
exports.default = AvailabilitiesService;
