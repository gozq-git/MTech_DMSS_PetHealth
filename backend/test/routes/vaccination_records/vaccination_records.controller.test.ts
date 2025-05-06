import VaccinationRecordsController from '../../../src/routes/vaccination_records/vaccination_records.controller';
import VaccinationRecordsService from '../../../src/routes/vaccination_records/vaccination_records.service';
import { sequelize } from '../../../src/db';

jest.mock('../../../src/routes/vaccination_records/vaccination_records.service');
jest.mock('../../../src/db', () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(undefined),
    authenticate: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('VaccinationRecordsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.restoreAllMocks();
  });

  describe('getVaccinationRecordsByPetId', () => {
    it('should return vaccination records for a pet', async () => {
      const mockRecords = [
        { id: '1', pet_id: 'pet123', name: 'Rabies' },
        { id: '2', pet_id: 'pet123', name: 'Parvo' },
      ];

      (VaccinationRecordsService.getVaccinationRecordsByPetId as jest.Mock).mockResolvedValue(mockRecords);

      const result = await VaccinationRecordsController.getVaccinationRecordsByPetId('pet123');

      expect(result).toEqual(mockRecords);
      expect(VaccinationRecordsService.getVaccinationRecordsByPetId).toHaveBeenCalledWith('pet123');
      expect(VaccinationRecordsService.getVaccinationRecordsByPetId).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when service fails', async () => {
      (VaccinationRecordsService.getVaccinationRecordsByPetId as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        VaccinationRecordsController.getVaccinationRecordsByPetId('pet123')
      ).rejects.toThrow('Error retrieving vaccination records by pet ID');

      expect(VaccinationRecordsService.getVaccinationRecordsByPetId).toHaveBeenCalledWith('pet123');
    });
  });

  describe('insertVaccinationRecord', () => {
    it('should insert a new vaccination record', async () => {
      const payload = {
        name: 'Distemper',
        description: 'Booster',
        administered_at: '2023-01-01T00:00:00Z',
        administered_by: 'Dr. Smith',
        lot_number: 'LOT123',
        expires_at: '2024-01-01T00:00:00Z',
        next_due_at: '2025-01-01T00:00:00Z',
        is_valid: true,
      };

      const mockRecord = {
        id: 'rec123',
        pet_id: 'pet123',
        name: 'Distemper',
      };

      (VaccinationRecordsService.insertVaccinationRecord as jest.Mock).mockResolvedValue(mockRecord);

      const result = await VaccinationRecordsController.insertVaccinationRecord('pet123', payload);

      expect(result).toEqual(mockRecord);
      expect(VaccinationRecordsService.insertVaccinationRecord).toHaveBeenCalledWith('pet123', payload);
    });

    it('should throw an error when service insertion fails', async () => {
      const payload = { name: 'Distemper' };

      (VaccinationRecordsService.insertVaccinationRecord as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        VaccinationRecordsController.insertVaccinationRecord('pet123', payload)
      ).rejects.toThrow('Error inserting vaccination record');

      expect(VaccinationRecordsService.insertVaccinationRecord).toHaveBeenCalledWith('pet123', payload);
    });
  });
});
