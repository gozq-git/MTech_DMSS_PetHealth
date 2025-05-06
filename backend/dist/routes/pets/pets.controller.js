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
const pets_service_1 = __importDefault(require("./pets.service"));
const PetsController = {
    getPets: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pets = yield pets_service_1.default.getPets();
            return pets;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving pets");
        }
    }),
    retrievePet: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pet = yield pets_service_1.default.retrievePet(id);
            return pet;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving pet");
        }
    }),
    getPetsByOwner: (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pets = yield pets_service_1.default.getPetsByOwner(ownerId);
            return pets;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error retrieving pets by owner ID");
        }
    }),
    insertPet: (petData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newPet = yield pets_service_1.default.insertPet(petData);
            return newPet;
        }
        catch (error) {
            console.error(error);
            throw new Error("Error inserting pet");
        }
    }),
};
exports.default = PetsController;
