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
const medication_records_service_1 = __importDefault(require("./medication_records.service"));
const MedicationRecordsController = {
    getMedicationRecords: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield medication_records_service_1.default.getMedicationRecords();
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving medication records");
        }
    }),
    retrieveMedicationRecord: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield medication_records_service_1.default.retrieveMedicationRecord(id);
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving medication record");
        }
    }),
    insertMedicationRecord: (recordData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield medication_records_service_1.default.insertMedicationRecord(recordData);
        }
        catch (error) {
            console.error(error);
            throw new Error("Error inserting medication record");
        }
    })
};
exports.default = MedicationRecordsController;
