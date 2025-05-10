import request from 'supertest';
import express from 'express';
import { pets } from '../../../src/routes/pets/pets';
import PetsController from '../../../src/routes/pets/pets.controller';

jest.mock('../../../src/routes/pets/pets.controller');

const app = express();
app.use(express.json());
app.use('/pets', pets);

describe('Pets Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /pets/retrievePet/:id', () => {
        it('should retrieve a pet by ID', async () => {
            const mockPet = { id: '1', name: 'Buddy', species: 'Dog' };
            (PetsController.retrievePet as jest.Mock).mockResolvedValue(mockPet);

            const response = await request(app).get('/pets/retrievePet/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPet);
            expect(PetsController.retrievePet).toHaveBeenCalledWith('1');
        });

        it('should return 500 if an error occurs', async () => {
            (PetsController.retrievePet as jest.Mock).mockRejectedValue(new Error('Error'));

            const response = await request(app).get('/pets/retrievePet/1');

            expect(response.status).toBe(500);            
        });
    });

    describe('GET /pets/getPetsByOwner/:ownerId', () => {
        it('should retrieve pets by owner ID', async () => {
            const mockPets = [{ id: '1', name: 'Buddy' }, { id: '2', name: 'Max' }];
            (PetsController.getPetsByOwner as jest.Mock).mockResolvedValue(mockPets);

            const response = await request(app).get('/pets/getPetsByOwner/123');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: 'success',
                data: mockPets,
                message: 'Pets retrieved successfully',
            });
            expect(PetsController.getPetsByOwner).toHaveBeenCalledWith('123');
        });

        it('should return a message if no pets are found', async () => {
            (PetsController.getPetsByOwner as jest.Mock).mockResolvedValue([]);

            const response = await request(app).get('/pets/getPetsByOwner/123');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: 'error', message: 'No pets found!' });
        });

        it('should return 500 if an error occurs', async () => {
            (PetsController.getPetsByOwner as jest.Mock).mockRejectedValue(new Error('Error'));

            const response = await request(app).get('/pets/getPetsByOwner/123');

            expect(response.status).toBe(500);
        });
    });

    describe('POST /pets/insertPet', () => {
        it('should insert a new pet', async () => {
            const mockPet = { id: '1', name: 'Buddy' };
            (PetsController.insertPet as jest.Mock).mockResolvedValue(mockPet);

            const response = await request(app)
                .post('/pets/insertPet')
                .send({ name: 'Buddy', species: 'Dog' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                status: 'success',
                data: mockPet,
                message: 'Pet added successfully',
            });
            expect(PetsController.insertPet).toHaveBeenCalledWith({ name: 'Buddy', species: 'Dog' });
        });

        it('should return 500 if an error occurs', async () => {
            (PetsController.insertPet as jest.Mock).mockRejectedValue(new Error('Error'));

            const response = await request(app)
                .post('/pets/insertPet')
                .send({ name: 'Buddy', species: 'Dog' });

            expect(response.status).toBe(500);
        });
    });

    describe('GET /pets/getPets', () => {
        it('should retrieve all pets', async () => {
            const mockPets = [{ id: '1', name: 'Buddy' }, { id: '2', name: 'Max' }];
            (PetsController.getPets as jest.Mock).mockResolvedValue(mockPets);

            const response = await request(app).get('/pets/getPets');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPets);
            expect(PetsController.getPets).toHaveBeenCalled();
        });

        it('should return 500 if an error occurs', async () => {
            (PetsController.getPets as jest.Mock).mockRejectedValue(new Error('Error'));

            const response = await request(app).get('/pets/getPets');

            expect(response.status).toBe(500);
        });
    });
});