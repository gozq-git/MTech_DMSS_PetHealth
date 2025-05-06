// ✅ Declare mocks first to avoid hoisting issues
const findAll = jest.fn();
const findOne = jest.fn();
const create = jest.fn();

// ✅ Mock sequelize models
jest.mock('../../../src/db', () => ({
  sequelize: {
    models: {
      MEDICATION_RECORD: {
        findAll,
        findOne,
        create,
      },
    },
  },
}));

import MedicationRecordsService from '../../../src/routes/medication_records/medication_records.service';
import { v6 as uuidv6 } from 'uuid';
import { format } from 'date-fns';

// ✅ Mock uuid and date-fns
jest.mock('uuid', () => ({
  v6: jest.fn(() => 'mock-uuid'),
}));

jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  return {
    ...actual,
    format: jest.fn(() => '2025-04-20 13:00:00'),
  };
});

describe('MedicationRecordsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMedicationRecords', () => {
    it('should return all medication records', async () => {
      const mockData = [{ id: '1' }, { id: '2' }];
      findAll.mockResolvedValue(mockData);

      const result = await MedicationRecordsService.getMedicationRecords();

      expect(result).toEqual(mockData);
      expect(findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('retrieveMedicationRecord', () => {
    it('should return a medication record by ID', async () => {
      const mockRecord = { id: '123', pet_id: 'p1' };
      findOne.mockResolvedValue(mockRecord);

      const result = await MedicationRecordsService.retrieveMedicationRecord('123');

      expect(result).toEqual(mockRecord);
      expect(findOne).toHaveBeenCalledWith({ where: { id: '123' } });
    });
  });

  describe('insertMedicationRecord', () => {
    it('should insert a new medication record with parsed dates', async () => {
      const input = {
        pet_id: 'pet1',
        medication_id: 'med1',
        dosage: '5mg',
        frequency: 'daily',
        start_date: '2025-04-20',
        end_date: '2025-05-01',
        prescribed_by: 'Dr. A',
        notes: 'After food',
        is_active: true,
      };

      const expectedPayload = {
        id: 'mock-uuid',
        pet_id: 'pet1',
        medication_id: 'med1',
        dosage: '5mg',
        frequency: 'daily',
        start_date: new Date('2025-04-20'),
        end_date: new Date('2025-05-01'),
        prescribed_by: 'Dr. A',
        notes: 'After food',
        is_active: true,
        created_at: '2025-04-20 13:00:00',
      };

      create.mockResolvedValue(expectedPayload);

      const result = await MedicationRecordsService.insertMedicationRecord(input);

      expect(result).toEqual(expectedPayload);
      expect(create).toHaveBeenCalledWith(expectedPayload);
    });

    it('should throw and log an error if insert fails', async () => {
      const error = new Error('DB insert failed');
      create.mockRejectedValue(error);
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        MedicationRecordsService.insertMedicationRecord({
          pet_id: 'p1',
          medication_id: 'm1',
        })
      ).rejects.toThrow('DB insert failed');

      expect(spy).toHaveBeenCalledWith('Error inserting medication record:', error);
      spy.mockRestore();
    });
  });
});
