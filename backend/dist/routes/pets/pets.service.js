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
        const preparedPetData = {
            id: (0, uuid_1.v6)(),
            owner_id: petData.owner_id || '',
            name: petData.name || '',
            gender: petData.gender || '',
            species: petData.species || '',
            breed: petData.breed || '',
            date_of_birth: petData.dateOfBirth ? (0, date_fns_1.format)(new Date(petData.dateOfBirth), 'yyyy-MM-dd HH:mm:ss') : null,
            weight: petData.weight || null,
            height_cm: petData.height || null,
            length_cm: petData.length || null,
            neck_girth_cm: petData.neckGirthCm || null,
            chest_girth_cm: petData.chestGirthCm || null,
            last_measured: petData.lastMeasured ? new Date(petData.lastMeasured) : null,
            is_neutered: petData.isNeutered || false,
            microchip_number: petData.microchipNumber || '',
            photo_url: petData.photoUrl || '',
            created_at: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            updated_at: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            is_deleted: false,
            // Why these fields?
            account_type: null,
            last_active: null,
            account_created: null,
            bio: null,
            profile_picture: null,
            display_name: null
        };
        try {
            console.log('Prepared Pet Data:', preparedPetData);
            const newPet = yield models.PETS.create(preparedPetData);
            return newPet;
        }
        catch (error) {
            console.error('Error inserting pet:', error);
            throw error;
        }
    })
};
exports.default = PetsService;
