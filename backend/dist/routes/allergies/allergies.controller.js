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
const db_1 = require("../../db");
const allergies_service_1 = __importDefault(require("./allergies.service"));
const models = db_1.sequelize.models;
const AllergyController = {
    getAllergiesByPetId: (petId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allergies = yield allergies_service_1.default.getAllergiesByPetId(petId);
            return allergies;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving allergies by pet ID");
        }
    }),
    insertAllergy: (allergyData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newAllergy = yield allergies_service_1.default.insertAllergy(allergyData);
            return newAllergy;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error inserting allergy");
        }
    }),
    updateAllergyById: (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedAllergy = yield allergies_service_1.default.updateAllergyById(id, updateData);
            return updatedAllergy;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error updating allergy");
        }
    })
};
exports.default = AllergyController;
