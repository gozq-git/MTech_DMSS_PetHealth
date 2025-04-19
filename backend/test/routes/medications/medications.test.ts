import request from 'supertest';
import express from 'express';
import { medications } from '../../../src/routes/medications/medications';
import MedicationsController from '../../../src/routes/medications/medications.controller';
import { sequelize } from '../../../src/db';

jest.mock('../../../src/routes/medications/medications.controller');
jest.mock('../../../src/db', () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(undefined),
    authenticate: jest.fn().mockResolvedValue(undefined),
  }
}));

const app = express();
app.use(express.json());
app.use('/medications', medications);

describe('Medications Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.restoreAllMocks();
  });

  describe('GET /medications/retrieveMedication/:id', () => {
    it('should retrieve a medication by ID', async () => {
      const mockMedication = {
        id: 'med1',
        name: 'Paracetamol',
        description: 'Pain relief',
        type: 'Tablet',
        requires_prescription: false,
        created_at: '2025-04-20T12:00:00Z'
      };
      (MedicationsController.retrieveMedication as jest.Mock).mockResolvedValue(mockMedication);

      const res = await request(app).get('/medications/retrieveMedication/med1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMedication);
    });

    it('should handle errors when retrieving a medication', async () => {
      (MedicationsController.retrieveMedication as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/medications/retrieveMedication/med1');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error retrieving medication' });
    });
  });

  describe('GET /medications/getMedications', () => {
    it('should retrieve all medications', async () => {
      const mockList = [
        {
          id: 'med1',
          name: 'Paracetamol',
          description: 'Pain relief',
          type: 'Tablet',
          requires_prescription: false,
          created_at: '2025-04-20T12:00:00Z'
        },
        {
          id: 'med2',
          name: 'Ibuprofen',
          description: 'Anti-inflammatory',
          type: 'Capsule',
          requires_prescription: true,
          created_at: '2025-04-19T10:00:00Z'
        }
      ];
      (MedicationsController.getMedications as jest.Mock).mockResolvedValue(mockList);

      const res = await request(app).get('/medications/getMedications');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockList);
    });

    it('should handle errors when retrieving all medications', async () => {
      (MedicationsController.getMedications as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/medications/getMedications');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error retrieving medications' });
    });
  });

  describe('POST /medications/insertMedication', () => {
    it('should insert a new medication', async () => {
      const newMedication = {
        name: 'Cetirizine',
        description: 'Allergy relief',
        type: 'Tablet',
        requires_prescription: false
      };

      const insertedMedication = {
        id: 'med3',
        ...newMedication,
        created_at: '2025-04-20T12:00:00Z'
      };

      (MedicationsController.insertMedication as jest.Mock).mockResolvedValue(insertedMedication);

      const res = await request(app)
        .post('/medications/insertMedication')
        .send(newMedication);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: 'success',
        data: insertedMedication,
        message: 'Medication added successfully'
      });
    });

    it('should handle errors when inserting medication', async () => {
      (MedicationsController.insertMedication as jest.Mock).mockRejectedValue(new Error('DB insert error'));

      const res = await request(app)
        .post('/medications/insertMedication')
        .send({
          name: 'Cetirizine'
        });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error inserting medication' });
    });
  });
});
