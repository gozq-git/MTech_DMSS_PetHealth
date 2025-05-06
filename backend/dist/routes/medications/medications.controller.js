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
const medications_service_1 = __importDefault(require("./medications.service"));
const MedicationsController = {
    getMedications: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const medications = yield medications_service_1.default.getMedications();
            return medications;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving medications");
        }
    }),
    retrieveMedication: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const medication = yield medications_service_1.default.retrieveMedication(id);
            return medication;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving medication");
        }
    }),
    insertMedication: (medicationData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newMedication = yield medications_service_1.default.insertMedication(medicationData);
            return newMedication;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error inserting medication");
        }
    })
};
exports.default = MedicationsController;
