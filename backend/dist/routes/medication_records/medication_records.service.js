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
const MedicationRecordsService = {
    getMedicationRecords: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield models.MEDICATION_RECORD.findAll({});
    }),
    retrieveMedicationRecord: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield models.MEDICATION_RECORD.findOne({
            where: { id }
        });
    }),
    insertMedicationRecord: (recordData) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const preparedRecord = {
            id: (0, uuid_1.v6)(),
            pet_id: recordData.pet_id,
            medication_id: recordData.medication_id,
            dosage: recordData.dosage || '',
            frequency: recordData.frequency || '',
            start_date: recordData.start_date ? new Date(recordData.start_date) : null,
            end_date: recordData.end_date ? new Date(recordData.end_date) : null,
            prescribed_by: recordData.prescribed_by || null,
            notes: recordData.notes || '',
            is_active: (_a = recordData.is_active) !== null && _a !== void 0 ? _a : true,
            created_at: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss')
        };
        try {
            const newRecord = yield models.MEDICATION_RECORD.create(preparedRecord);
            return newRecord;
        }
        catch (error) {
            console.error('Error inserting medication record:', error);
            throw error;
        }
    })
};
exports.default = MedicationRecordsService;
