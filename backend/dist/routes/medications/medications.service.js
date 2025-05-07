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
const date_fns_1 = require("date-fns");
const models = db_1.sequelize.models;
const MedicationsService = {
    getMedications: () => __awaiter(void 0, void 0, void 0, function* () {
        const medications = yield models.MEDICATIONS.findAll({});
        return medications;
    }),
    retrieveMedication: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const medication = yield models.MEDICATIONS.findOne({
            where: { id }
        });
        return medication;
    }),
    insertMedication: (medicationData) => __awaiter(void 0, void 0, void 0, function* () {
        const preparedMedicationData = {
            id: (0, uuid_1.v6)(),
            name: medicationData.name || '',
            description: medicationData.description || '',
            type: medicationData.type || '',
            requires_prescription: medicationData.requiresPrescription || false,
            created_at: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss')
        };
        try {
            console.log('Prepared Medication Data:', preparedMedicationData);
            const newMedication = yield models.MEDICATIONS.create(preparedMedicationData);
            return newMedication;
        }
        catch (error) {
            console.error('Error inserting medication:', error);
            throw error;
        }
    })
};
exports.default = MedicationsService;
