import request from 'supertest';
import express from 'express';
import { medication_records } from '../../../src/routes/medication_records/medication_records';
import MedicationRecordsController from '../../../src/routes/medication_records/medication_records.controller';
import { sequelize } from '../../../src/db';

// Mock controller methods and db
jest.mock('../../../src/routes/medication_records/medication_records.controller');
jest.mock('../../../src/db', () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(undefined),
    authenticate: jest.fn().mockResolvedValue(undefined),
  }
}));

const app = express();
app.use(express.json());
app.use('/medication_records', medication_records);

describe('Medication Records Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.restoreAllMocks();
  });

  describe('GET /medication_records/getAll', () => {
    it('should retrieve all medication records', async () => {
      const mockRecords = [
        { id: '1', pet_id: 'p1', medication_id: 'm1' },
        { id: '2', pet_id: 'p2', medication_id: 'm2' },
      ];

      (MedicationRecordsController.getMedicationRecords as jest.Mock).mockResolvedValue(mockRecords);

      const res = await request(app).get('/medication_records/getAll');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockRecords);
    });

    it('should handle errors when retrieving all records', async () => {
      (MedicationRecordsController.getMedicationRecords as jest.Mock).mockRejectedValue(new Error('Error'));

      const res = await request(app).get('/medication_records/getAll');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error retrieving medication records' });
    });
  });

  describe('GET /medication_records/retrieve/:id', () => {
    it('should retrieve a medication record by ID', async () => {
      const mockRecord = {
        id: 'rec1',
        pet_id: 'pet123',
        medication_id: 'med456',
        dosage: '10mg',
      };

      (MedicationRecordsController.retrieveMedicationRecord as jest.Mock).mockResolvedValue(mockRecord);

      const res = await request(app).get('/medication_records/retrieve/rec1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockRecord);
    });

    it('should handle errors when retrieving a record', async () => {
      (MedicationRecordsController.retrieveMedicationRecord as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/medication_records/retrieve/rec1');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error retrieving medication record' });
    });
  });

  describe('POST /medication_records/insert', () => {
    it('should insert a new medication record', async () => {
      const newRecord = {
        pet_id: 'pet123',
        medication_id: 'med456',
        dosage: '5ml',
        frequency: 'twice a day',
        start_date: '2025-04-20',
        end_date: '2025-04-30',
        prescribed_by: 'Dr. Smith',
        notes: 'Take after food',
        is_active: true,
      };

      const insertedRecord = {
        id: 'mock-id',
        ...newRecord,
        created_at: '2025-04-20T13:00:00Z'
      };

      (MedicationRecordsController.insertMedicationRecord as jest.Mock).mockResolvedValue(insertedRecord);

      const res = await request(app).post('/medication_records/insert').send(newRecord);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: 'success',
        data: insertedRecord,
        message: 'Medication record added successfully'
      });
    });

    it('should handle errors when inserting medication record', async () => {
      (MedicationRecordsController.insertMedicationRecord as jest.Mock).mockRejectedValue(new Error('Insert error'));

      const res = await request(app).post('/medication_records/insert').send({
        pet_id: 'pet123',
        medication_id: 'med456'
      });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error inserting medication record' });
    });
  });
});
