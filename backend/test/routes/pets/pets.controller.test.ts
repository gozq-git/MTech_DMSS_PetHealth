// filepath: /Users/venkatkrishna/Documents/TEST/MTech_DMSS_PetHealth/backend/test/routes/pets/pets.controller.test.ts
import PetsController from '../../../src/routes/pets/pets.controller';
import PetsService from '../../../src/routes/pets/pets.service';
import { sequelize } from "../../../src/db";

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
  afterAll(async () => {
    await sequelize.close(); // Ensures all DB connections are closed
    jest.restoreAllMocks();
  });

  describe('getPets', () => {
    it('should retrieve all pets', async () => {
      const mockPets = [
        { id: '1', name: 'Buddy' },
        { id: '2', name: 'Whiskers' }
      ];
      (PetsService.getPets as jest.Mock).mockResolvedValue(mockPets);

      const pets = await PetsController.getPets();

      expect(pets).toEqual(mockPets);
      expect(PetsService.getPets).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when retrieving all pets', async () => {
      (PetsService.getPets as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(PetsController.getPets()).rejects.toThrow('Error retrieving pets');
      expect(PetsService.getPets).toHaveBeenCalledTimes(1);
    });
  });

  describe('retrievePet', () => {
    it('should retrieve a pet by ID', async () => {
      const mockPet = { id: '1', name: 'Fluffy', type: 'Cat', age: 3, vaccinated: true };
      (PetsService.retrievePet as jest.Mock).mockResolvedValue(mockPet);

      const pet = await PetsController.retrievePet('1');

      expect(pet).toEqual(mockPet);
      expect(PetsService.retrievePet).toHaveBeenCalledWith('1');
      expect(PetsService.retrievePet).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when retrieving a pet by ID', async () => {
      (PetsService.retrievePet as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(PetsController.retrievePet('1')).rejects.toThrow('Error retrieving pet');
      expect(PetsService.retrievePet).toHaveBeenCalledWith('1');
      expect(PetsService.retrievePet).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPetsByOwner', () => {
    it('should retrieve all pets by owner ID', async () => {
      const mockPets = [
        { id: '1', name: 'Buddy', owner_id: '1' },
        { id: '2', name: 'Whiskers', owner_id: '1' }
      ];
      (PetsService.getPetsByOwner as jest.Mock).mockResolvedValue(mockPets);

      const pets = await PetsController.getPetsByOwner('1');

      expect(pets).toEqual(mockPets);
      expect(PetsService.getPetsByOwner).toHaveBeenCalledWith('1');
      expect(PetsService.getPetsByOwner).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when retrieving pets by owner ID', async () => {
      (PetsService.getPetsByOwner as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(PetsController.getPetsByOwner('1')).rejects.toThrow('Error retrieving pets by owner ID');
      expect(PetsService.getPetsByOwner).toHaveBeenCalledWith('1');
      expect(PetsService.getPetsByOwner).toHaveBeenCalledTimes(1);
    });
  });
});