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
const VaccinationRecordsService = {
    insertVaccinationRecord: (petId, data) => __awaiter(void 0, void 0, void 0, function* () {
        const newRecord = {
            id: (0, uuid_1.v6)(),
            pet_id: petId,
            name: data.name,
            description: data.description,
            administered_at: data.administered_at,
            administered_by: data.administered_by,
            lot_number: data.lot_number,
            expires_at: data.expires_at,
            next_due_at: data.next_due_at,
            is_valid: data.is_valid,
            created_at: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            updated_at: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };
        const record = yield models.VACCINATION_RECORDS.create(newRecord);
        console.log('Vaccination record created', record);
        return record;
    }),
    getVaccinationRecordsByPetId: (petId) => __awaiter(void 0, void 0, void 0, function* () {
        const records = yield models.VACCINATION_RECORDS.findAll({
            where: {
                pet_id: petId
            },
            order: [['administered_at', 'DESC']] // Optional: recent first
        });
        return records;
    })
};
exports.default = VaccinationRecordsService;
