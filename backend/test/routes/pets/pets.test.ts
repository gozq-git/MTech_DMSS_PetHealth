import request from 'supertest';
import express from 'express';
import { pets } from '../../../src/routes/pets/pets';
import PetsController from '../../../src/routes/pets/pets.controller';
import { sequelize } from "../../../src/db";

jest.mock('../../../src/routes/pets/pets.controller');
jest.mock('../../../src/db', () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(undefined), // Mock DB closing
    authenticate: jest.fn().mockResolvedValue(undefined), // Prevents actual DB auth
  }
}));


const app = express();
app.use(express.json());
app.use('/pets', pets);

describe('Pets Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close(); // Ensures all DB connections are closed
    jest.restoreAllMocks();
  });

  describe('GET /pets/retrievePet/:id', () => {
    it('should retrieve a pet by ID', async () => {
      const mockPet = { id: '1', name: 'Fluffy', type: 'Cat', age: 3, vaccinated: true };
      (PetsController.retrievePet as jest.Mock).mockResolvedValue(mockPet);

      const res = await request(app).get('/pets/retrievePet/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockPet);
    });

    it('should handle errors when retrieving a pet by ID', async () => {
      (PetsController.retrievePet as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/pets/retrievePet/1');

      expect(res.status).toBe(500);
      //expect(res.body).toEqual({ error: 'Error retrieving pet' });
    });
  });

  describe('GET /pets/getPetsByOwner/:ownerId', () => {
    it('should retrieve all pets by owner ID', async () => {
      const mockPets = [
        { id: '1', name: 'Buddy', owner_id: '1' },
        { id: '2', name: 'Whiskers', owner_id: '1' }
      ];
      (PetsController.getPetsByOwner as jest.Mock).mockResolvedValue(mockPets);

      const res = await request(app).get('/pets/getPetsByOwner/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockPets);
    });

    it('should handle errors when retrieving pets by owner ID', async () => {
      (PetsController.getPetsByOwner as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/pets/getPetsByOwner/1');

      expect(res.status).toBe(500);
      //expect(res.body).toEqual({ error: 'Error retrieving pets by owner ID' });
    });
  });

  describe('POST /pets/insertPet', () => {
    it('should create a new pet', async () => {
      const newPet = { name: 'Max', type: 'Dog', age: 2, vaccinated: true };
      const createdPet = { id: '3', ...newPet };
      (PetsController.insertPet as jest.Mock).mockResolvedValue(createdPet);

      const res = await request(app).post('/pets/insertPet').send(newPet);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(createdPet);
    });

    it('should handle errors when creating a new pet', async () => {
      (PetsController.insertPet as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/pets/insertPet').send({ name: 'Max' });

      expect(res.status).toBe(500);
      //expect(res.body).toEqual({ error: 'Error inserting pet' });
    });
  });

  describe('GET /pets/getPets', () => {
    it('should retrieve all pets', async () => {
      const mockPets = [
        { id: '1', name: 'Buddy' },
        { id: '2', name: 'Whiskers' }
      ];
      (PetsController.getPets as jest.Mock).mockResolvedValue(mockPets);

      const res = await request(app).get('/pets/getPets');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockPets);
    });

    it('should handle errors when retrieving all pets', async () => {
      (PetsController.getPets as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/pets/getPets');

      expect(res.status).toBe(500);
      //expect(res.body).toEqual({ error: 'Error retrieving pets' });
    });
  });
});