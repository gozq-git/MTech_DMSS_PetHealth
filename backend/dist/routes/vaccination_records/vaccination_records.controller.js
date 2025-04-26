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
const vaccination_records_service_1 = __importDefault(require("./vaccination_records.service"));
const VaccinationRecordsController = {
    insertVaccinationRecord: (petId, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newRecord = yield vaccination_records_service_1.default.insertVaccinationRecord(petId, data);
            return newRecord;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error inserting vaccination record");
        }
    }),
    getVaccinationRecordsByPetId: (petId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const records = yield vaccination_records_service_1.default.getVaccinationRecordsByPetId(petId);
            return records;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving vaccination records by pet ID");
        }
    }),
};
exports.default = VaccinationRecordsController;
