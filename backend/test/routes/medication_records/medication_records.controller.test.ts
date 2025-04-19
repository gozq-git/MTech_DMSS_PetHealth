// ✅ Declare these before mocking sequelize
const findAll = jest.fn();
const findOne = jest.fn();
const create = jest.fn();

// ✅ Mock Sequelize models
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

// ✅ Mock UUID + Date
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
  
    const insertedRecord = {
      id: 'mock-uuid',
      ...input,
      start_date: new Date('2025-04-20'),
      end_date: new Date('2025-05-01'),
      created_at: '2025-04-20 13:00:00',
    };
  
    create.mockResolvedValue(insertedRecord);
  
    const result = await MedicationRecordsService.insertMedicationRecord(input);
  
    expect(result).toEqual(insertedRecord);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-uuid',
        pet_id: 'pet1',
        medication_id: 'med1',
        dosage: '5mg',
        frequency: 'daily',
        prescribed_by: 'Dr. A',
        notes: 'After food',
        is_active: true,
        created_at: '2025-04-20 13:00:00',
        start_date: expect.any(Date),
        end_date: expect.any(Date),
      })
    );
  });
  
});
