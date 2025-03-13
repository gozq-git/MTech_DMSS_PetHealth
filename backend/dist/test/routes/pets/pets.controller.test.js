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
// filepath: /Users/venkatkrishna/Documents/TEST/MTech_DMSS_PetHealth/backend/test/routes/pets/pets.controller.test.ts
const pets_controller_1 = __importDefault(require("../../../src/routes/pets/pets.controller"));
const pets_service_1 = __importDefault(require("../../../src/routes/pets/pets.service"));
const db_1 = require("../../../src/db");
jest.mock('../../../src/routes/pets/pets.service');
jest.mock('../../../src/db', () => ({
    sequelize: {
        close: jest.fn().mockResolvedValue(undefined), // Mock DB closing
        authenticate: jest.fn().mockResolvedValue(undefined), // Prevents actual DB auth
    }
}));
describe('PetsController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.sequelize.close(); // Ensures all DB connections are closed
        jest.restoreAllMocks();
    }));
    describe('getPets', () => {
        it('should retrieve all pets', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPets = [
                { id: '1', name: 'Buddy' },
                { id: '2', name: 'Whiskers' }
            ];
            pets_service_1.default.getPets.mockResolvedValue(mockPets);
            const pets = yield pets_controller_1.default.getPets();
            expect(pets).toEqual(mockPets);
            expect(pets_service_1.default.getPets).toHaveBeenCalledTimes(1);
        }));
        it('should handle errors when retrieving all pets', () => __awaiter(void 0, void 0, void 0, function* () {
            pets_service_1.default.getPets.mockRejectedValue(new Error('Database error'));
            yield expect(pets_controller_1.default.getPets()).rejects.toThrow('Error retrieving pets');
            expect(pets_service_1.default.getPets).toHaveBeenCalledTimes(1);
        }));
    });
    describe('retrievePet', () => {
        it('should retrieve a pet by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPet = { id: '1', name: 'Fluffy', type: 'Cat', age: 3, vaccinated: true };
            pets_service_1.default.retrievePet.mockResolvedValue(mockPet);
            const pet = yield pets_controller_1.default.retrievePet('1');
            expect(pet).toEqual(mockPet);
            expect(pets_service_1.default.retrievePet).toHaveBeenCalledWith('1');
            expect(pets_service_1.default.retrievePet).toHaveBeenCalledTimes(1);
        }));
        it('should handle errors when retrieving a pet by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            pets_service_1.default.retrievePet.mockRejectedValue(new Error('Database error'));
            yield expect(pets_controller_1.default.retrievePet('1')).rejects.toThrow('Error retrieving pet');
            expect(pets_service_1.default.retrievePet).toHaveBeenCalledWith('1');
            expect(pets_service_1.default.retrievePet).toHaveBeenCalledTimes(1);
        }));
    });
    describe('getPetsByOwner', () => {
        it('should retrieve all pets by owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPets = [
                { id: '1', name: 'Buddy', owner_id: '1' },
                { id: '2', name: 'Whiskers', owner_id: '1' }
            ];
            pets_service_1.default.getPetsByOwner.mockResolvedValue(mockPets);
            const pets = yield pets_controller_1.default.getPetsByOwner('1');
            expect(pets).toEqual(mockPets);
            expect(pets_service_1.default.getPetsByOwner).toHaveBeenCalledWith('1');
            expect(pets_service_1.default.getPetsByOwner).toHaveBeenCalledTimes(1);
        }));
        it('should handle errors when retrieving pets by owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            pets_service_1.default.getPetsByOwner.mockRejectedValue(new Error('Database error'));
            yield expect(pets_controller_1.default.getPetsByOwner('1')).rejects.toThrow('Error retrieving pets by owner ID');
            expect(pets_service_1.default.getPetsByOwner).toHaveBeenCalledWith('1');
            expect(pets_service_1.default.getPetsByOwner).toHaveBeenCalledTimes(1);
        }));
    });
});
