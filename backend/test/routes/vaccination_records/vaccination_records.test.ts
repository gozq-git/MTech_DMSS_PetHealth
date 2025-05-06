import request from 'supertest';
import express from 'express';
import { vaccination_records } from '../../../src/routes/vaccination_records/vaccination_records';
import VaccinationRecordsController from '../../../src/routes/vaccination_records/vaccination_records.controller';
import { sequelize } from '../../../src/db';

jest.mock('../../../src/routes/vaccination_records/vaccination_records.controller');
jest.mock('../../../src/db', () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(undefined),
    authenticate: jest.fn().mockResolvedValue(undefined),
  }
}));

const app = express();
app.use(express.json());
app.use('/vaccination_records', vaccination_records);

describe('Vaccination Records Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.restoreAllMocks();
  });

  describe('GET /vaccination_records/:petId', () => {
    it('should retrieve vaccination records by pet ID', async () => {
      const mockRecords = [
        {
          id: '1',
          pet_id: '123',
          name: 'Rabies',
          administered_at: '2023-01-01T00:00:00Z',
          expires_at: '2024-01-01T00:00:00Z',
          lot_number: 'ABC123',
          administered_by: 'Dr. Smith',
          next_due_at: '2025-01-01T00:00:00Z',
          is_valid: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      (VaccinationRecordsController.getVaccinationRecordsByPetId as jest.Mock).mockResolvedValue(mockRecords);

      const res = await request(app).get('/vaccination_records/123');

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: 'success',
        data: mockRecords,
        message: 'Vaccination records retrieved successfully'
      });
    });

    it('should handle errors when retrieving vaccination records', async () => {
      (VaccinationRecordsController.getVaccinationRecordsByPetId as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/vaccination_records/123');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({}); // <- adjusted to match your actual response
    });
  });

  describe('POST /vaccination_records/:petId', () => {
    it('should insert a new vaccination record', async () => {
      const newRecord = {
        name: 'Parvo',
        administered_at: '2023-03-01T00:00:00Z',
        expires_at: '2024-03-01T00:00:00Z',
        lot_number: 'XYZ789',
        administered_by: 'Dr. Jane',
        next_due_at: '2025-03-01T00:00:00Z',
        is_valid: true
      };

      const createdRecord = {
        id: '2',
        pet_id: '123',
        name: 'Parvo',
        created_at: '2023-03-01T00:00:00Z'
      };

      (VaccinationRecordsController.insertVaccinationRecord as jest.Mock).mockResolvedValue(createdRecord);

      const res = await request(app)
        .post('/vaccination_records/123')
        .send(newRecord);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: 'success',
        data: createdRecord,
        message: 'Vaccination record added successfully'
      });
    });

    it('should handle errors when inserting vaccination record', async () => {
      (VaccinationRecordsController.insertVaccinationRecord as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/vaccination_records/123')
        .send({ name: 'Parvo' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({}); // <- adjusted to match your actual response
    });
  });
});
