// ✅ Declare mock methods before importing service
const create = jest.fn();
const findAll = jest.fn();

jest.mock('../../db', () => ({
  sequelize: {
    models: {
      AVAILABILITIES: {
        create,
        findAll,
      },
      VETS: {}, // needed for `.include` references
    },
  },
}));

import AvailabilitiesService from '../../../src/routes/availabilities/availabilities.service';
import { UUIDV4 } from 'sequelize';

jest.mock('sequelize', () => ({
  UUIDV4: jest.fn(() => 'mock-uuid'),
}));

describe('AvailabilitiesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('markAvailability', () => {
    it('should create and return availability', async () => {
      const mockAvailability = {
        id: 'mock-uuid',
        vet_id: 'vet-1',
        available_date: '2025-04-01',
      };

      create.mockResolvedValue(mockAvailability);

      const result = await AvailabilitiesService.markAvailability('vet-1', '2025-04-01');

      expect(result).toEqual(mockAvailability);
      expect(create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        vet_id: 'vet-1',
        available_date: '2025-04-01',
      });
    });

    it('should throw error when create fails', async () => {
      create.mockRejectedValue(new Error('DB Error'));

      await expect(
        AvailabilitiesService.markAvailability('vet-1', '2025-04-01')
      ).rejects.toThrow('Error marking availability');
    });
  });

  describe('getAvailableVets', () => {
    it('should return vets available on given date', async () => {
      const mockVets = [{ vet_id: 'vet-1' }, { vet_id: 'vet-2' }];
      findAll.mockResolvedValue(mockVets);

      const result = await AvailabilitiesService.getAvailableVets('2025-04-01');

      expect(result).toEqual(mockVets);
      expect(findAll).toHaveBeenCalledWith({
        where: { available_date: '2025-04-01' },
        include: [
          {
            model: expect.any(Object),
            required: true,
          },
        ],
      });
    });

    it('should throw error when fetching available vets fails', async () => {
      findAll.mockRejectedValue(new Error('DB Fail'));

      await expect(
        AvailabilitiesService.getAvailableVets('2025-04-01')
      ).rejects.toThrow('Error retrieving available vets');
    });
  });

  describe('getAvailabilityForVet', () => {
    it('should return availability dates for a vet', async () => {
      const mockDates = [
        { available_date: '2025-04-01' },
        { available_date: '2025-04-03' },
      ];

      findAll.mockResolvedValue(mockDates);

      const result = await AvailabilitiesService.getAvailabilityForVet('vet-1');

      expect(result).toEqual(mockDates);
      expect(findAll).toHaveBeenCalledWith({
        where: { vet_id: 'vet-1' },
        attributes: ['available_date'],
        order: [['available_date', 'ASC']],
      });
    });

    it('should throw error when retrieving vet availability fails', async () => {
      findAll.mockRejectedValue(new Error('DB down'));

      await expect(
        AvailabilitiesService.getAvailabilityForVet('vet-1')
      ).rejects.toThrow('Error retrieving vet availability');
    });
  });
});
