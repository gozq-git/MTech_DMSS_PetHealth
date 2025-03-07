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
const PetsService = {
    getPets: () => __awaiter(void 0, void 0, void 0, function* () {
        const pets = yield models.PETS.findAll({});
        return pets;
    }),
    retrievePet: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const pet = yield models.PETS.findOne({
            where: {
                id
            }
        });
        return pet;
    }),
    getPetsByOwner: (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        const pets = yield models.PETS.findAll({
            where: {
                owner_id: ownerId
            }
        });
        return pets;
    }),
    insertPet: (petData) => __awaiter(void 0, void 0, void 0, function* () {
        const newPet = yield models.PETS.create(petData);
        return newPet;
    })
};
exports.default = PetsService;
