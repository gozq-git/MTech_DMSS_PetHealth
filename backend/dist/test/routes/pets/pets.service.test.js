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
const pets_service_1 = __importDefault(require("../../../src/routes/pets/pets.service"));
const db_1 = require("../../../src/db");
const mockPetsModel = db_1.sequelize.models.PETS;
jest.mock("../../../src/db", () => ({
    sequelize: {
        models: {
            PETS: {
                findAll: jest.fn(),
                findOne: jest.fn(),
                create: jest.fn(),
            },
        },
    },
}));
describe("PetsService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    /**
     * ✅ Test getPets() method
     * - Should retrieve all pets from the database.
     */
    it("should retrieve all pets", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockPets = [
            { id: 1, name: "Fluffy", type: "Cat", age: 3, vaccinated: true },
            { id: 2, name: "Buddy", type: "Dog", age: 5, vaccinated: false },
        ];
        mockPetsModel.findAll.mockResolvedValue(mockPets);
        const pets = yield pets_service_1.default.getPets();
        expect(pets).toEqual(mockPets);
        expect(mockPetsModel.findAll).toHaveBeenCalledTimes(1);
    }));
    /**
     * ✅ Test getPetById() method
     * - Should retrieve a pet by ID from the database.
     */
    it("should retrieve a pet by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockPet = { id: 1, name: "Fluffy", type: "Cat", age: 3, vaccinated: true };
        mockPetsModel.findOne.mockResolvedValue(mockPet);
        const pet = yield pets_service_1.default.retrievePet("1");
        expect(pet).toEqual(mockPet);
        expect(mockPetsModel.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
        expect(mockPetsModel.findOne).toHaveBeenCalledTimes(1);
    }));
    /**
     * ✅ Test createPet() method
     * - Should create a new pet in the database.
     */
    it("should create a new pet", () => __awaiter(void 0, void 0, void 0, function* () {
        const newPet = { name: "Fluffy", type: "Cat", age: 3, vaccinated: true };
        const createdPet = Object.assign({ id: 1 }, newPet);
        mockPetsModel.create.mockResolvedValue(createdPet);
        const pet = yield pets_service_1.default.insertPet(newPet);
        expect(pet).toEqual(createdPet);
        expect(mockPetsModel.create).toHaveBeenCalledWith(newPet);
        expect(mockPetsModel.create).toHaveBeenCalledTimes(1);
    }));
});
