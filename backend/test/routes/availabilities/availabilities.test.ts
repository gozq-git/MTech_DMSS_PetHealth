import request from 'supertest';
import express from 'express';
import { availabilities } from '../../../src/routes/availabilities/availabilities';
import AvailabilitiesController from '../../../src/routes/availabilities/availabilities.controller';
import { sequelize } from '../../../src/db';

jest.mock('../../../src/routes/availabilities/availabilities.controller');
jest.mock('../../../src/db', () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(undefined),
    authenticate: jest.fn().mockResolvedValue(undefined),
  },
}));

const app = express();
app.use(express.json());
app.use('/appointments', availabilities);

describe('Availabilities Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
    jest.restoreAllMocks();
  });

  describe('POST /appointments/markAvailability', () => {
    it('should mark vet availability', async () => {
      const body = { vet_id: 'vet-123', available_date: '2025-04-01' };
      const mockResult = { id: 'availability-1', ...body };

      (AvailabilitiesController.markAvailability as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app)
        .post('/appointments/markAvailability')
        .send(body);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: mockResult,
      });
    });

    it('should handle error when marking availability', async () => {
      (AvailabilitiesController.markAvailability as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .post('/appointments/markAvailability')
        .send({ vet_id: 'vet-123', available_date: '2025-04-01' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        status: 'error',
        message: 'DB error',
      });
    });
  });

  describe('GET /appointments/getAvailableVets', () => {
    it('should get available vets for a date', async () => {
      const mockVets = [
        { vet_id: 'vet-1', name: 'Dr. Max' },
        { vet_id: 'vet-2', name: 'Dr. Bella' },
      ];

      (AvailabilitiesController.getAvailableVets as jest.Mock).mockResolvedValue(mockVets);

      const res = await request(app).get('/appointments/getAvailableVets?date=2025-04-01');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: mockVets,
      });
    });

    it('should handle error for getAvailableVets', async () => {
      (AvailabilitiesController.getAvailableVets as jest.Mock).mockRejectedValue(new Error('DB fail'));

      const res = await request(app).get('/appointments/getAvailableVets?date=2025-04-01');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        status: 'error',
        message: 'DB fail',
      });
    });
  });

  describe('GET /appointments/getAvailabilityForVet', () => {
    it('should return available dates for a vet', async () => {
      const mockDates = ['2025-04-01', '2025-04-03'];
      (AvailabilitiesController.getAvailabilityForVet as jest.Mock).mockResolvedValue(mockDates);

      const res = await request(app).get('/appointments/getAvailabilityForVet?vet_id=vet-123');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: mockDates,
      });
    });

    it('should handle error when fetching vet availability', async () => {
      (AvailabilitiesController.getAvailabilityForVet as jest.Mock).mockRejectedValue(new Error('Something broke'));

      const res = await request(app).get('/appointments/getAvailabilityForVet?vet_id=vet-123');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Something broke',
      });
    });
  });
});
