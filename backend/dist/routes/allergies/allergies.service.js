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
const models = db_1.sequelize.models;
const AllergyService = {
    getAllergiesByPetId: (petId) => __awaiter(void 0, void 0, void 0, function* () {
        const allergies = yield models.ALLERGIES.findAll({
            where: {
                pet_id: petId
            }
        });
        return allergies;
    }),
    insertAllergy: (allergyData) => __awaiter(void 0, void 0, void 0, function* () {
        const newAllergy = yield models.ALLERGIES.create(allergyData);
        return newAllergy;
    }),
    updateAllergyById: (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
        const [updatedCount] = yield models.ALLERGIES.update(updateData, {
            where: {
                id
            }
        });
        return updatedCount > 0 ? yield models.ALLERGIES.findOne({ where: { id } }) : null;
    })
};
exports.default = AllergyService;
