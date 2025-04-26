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
const availabilities_service_1 = __importDefault(require("./availabilities.service"));
const AvailabilitiesController = {
    // For a vet to mark their availability
    markAvailability: (vetId, availableDate) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield availabilities_service_1.default.markAvailability(vetId, availableDate);
            return result;
        }
        catch (error) {
            // logger.error(error);
            throw new Error("Error marking availability");
        }
    }),
    // For a user to get the list of available vets for a specific date
    getAvailableVets: (date) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield availabilities_service_1.default.getAvailableVets(date);
            return result;
        }
        catch (error) {
            // logger.error(error);
            throw new Error("Error retrieving available vets");
        }
    }),
    getAvailabilityForVet: (vetId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield availabilities_service_1.default.getAvailabilityForVet(vetId);
            return result;
        }
        catch (error) {
            // logger.error(error);
            throw new Error("Error retrieving vet availability");
        }
    })
};
exports.default = AvailabilitiesController;
