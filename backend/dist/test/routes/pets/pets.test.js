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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const pets_1 = require("../../../src/routes/pets/pets");
const pets_controller_1 = __importDefault(require("../../../src/routes/pets/pets.controller"));
const db_1 = require("../../../src/db");
jest.mock('../../../src/routes/pets/pets.controller');
jest.mock('../../../src/db', () => ({
    sequelize: {
        close: jest.fn().mockResolvedValue(undefined), // Mock DB closing
        authenticate: jest.fn().mockResolvedValue(undefined), // Prevents actual DB auth
    }
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/pets', pets_1.pets);
describe('Pets Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db_1.sequelize.close(); // Ensures all DB connections are closed
        jest.restoreAllMocks();
    }));
    describe('GET /pets/retrievePet/:id', () => {
        it('should retrieve a pet by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPet = { id: '1', name: 'Fluffy', type: 'Cat', age: 3, vaccinated: true };
            pets_controller_1.default.retrievePet.mockResolvedValue(mockPet);
            const res = yield (0, supertest_1.default)(app).get('/pets/retrievePet/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockPet);
        }));
        it('should handle errors when retrieving a pet by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            pets_controller_1.default.retrievePet.mockRejectedValue(new Error('Database error'));
            const res = yield (0, supertest_1.default)(app).get('/pets/retrievePet/1');
            expect(res.status).toBe(500);
            //expect(res.body).toEqual({ error: 'Error retrieving pet' });
        }));
    });
    describe('GET /pets/getPetsByOwner/:ownerId', () => {
        it('should retrieve all pets by owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPets = [
                { id: '1', name: 'Buddy', owner_id: '1' },
                { id: '2', name: 'Whiskers', owner_id: '1' }
            ];
            pets_controller_1.default.getPetsByOwner.mockResolvedValue(mockPets);
            const res = yield (0, supertest_1.default)(app).get('/pets/getPetsByOwner/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockPets);
        }));
        it('should handle errors when retrieving pets by owner ID', () => __awaiter(void 0, void 0, void 0, function* () {
            pets_controller_1.default.getPetsByOwner.mockRejectedValue(new Error('Database error'));
            const res = yield (0, supertest_1.default)(app).get('/pets/getPetsByOwner/1');
            expect(res.status).toBe(500);
            //expect(res.body).toEqual({ error: 'Error retrieving pets by owner ID' });
        }));
    });
    describe('POST /pets/insertPet', () => {
        it('should create a new pet', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPet = { name: 'Max', type: 'Dog', age: 2, vaccinated: true };
            const createdPet = Object.assign({ id: '3' }, newPet);
            pets_controller_1.default.insertPet.mockResolvedValue(createdPet);
            const res = yield (0, supertest_1.default)(app).post('/pets/insertPet').send(newPet);
            expect(res.status).toBe(201);
            expect(res.body).toEqual(createdPet);
        }));
        it('should handle errors when creating a new pet', () => __awaiter(void 0, void 0, void 0, function* () {
            pets_controller_1.default.insertPet.mockRejectedValue(new Error('Database error'));
            const res = yield (0, supertest_1.default)(app).post('/pets/insertPet').send({ name: 'Max' });
            expect(res.status).toBe(500);
            //expect(res.body).toEqual({ error: 'Error inserting pet' });
        }));
    });
    describe('GET /pets/getPets', () => {
        it('should retrieve all pets', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPets = [
                { id: '1', name: 'Buddy' },
                { id: '2', name: 'Whiskers' }
            ];
            pets_controller_1.default.getPets.mockResolvedValue(mockPets);
            const res = yield (0, supertest_1.default)(app).get('/pets/getPets');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockPets);
        }));
        it('should handle errors when retrieving all pets', () => __awaiter(void 0, void 0, void 0, function* () {
            pets_controller_1.default.getPets.mockRejectedValue(new Error('Database error'));
            const res = yield (0, supertest_1.default)(app).get('/pets/getPets');
            expect(res.status).toBe(500);
            //expect(res.body).toEqual({ error: 'Error retrieving pets' });
        }));
    });
});
