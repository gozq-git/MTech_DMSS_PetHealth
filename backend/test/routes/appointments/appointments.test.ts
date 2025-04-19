import request from 'supertest';
import express from 'express';
import { appointments } from '../../../src/routes/appointments/appointments';
import AppointmentsController from '../../../src/routes/appointments/appointments.controller';

// ✅ Mock controller and logger
jest.mock('../../../src/routes/appointments/appointments.controller');
jest.mock('../../../src/utils/logger', () => ({
  error: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/appointments', appointments);

describe('Appointments Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /appointments/markAvailability', () => {
    it('should mark vet availability', async () => {
      const mockResponse = { id: 'availability-1' };
      (AppointmentsController.markAvailability as jest.Mock).mockResolvedValue(mockResponse);

      const res = await request(app).post('/appointments/markAvailability').send({
        vet_id: 'vet-123',
        available_date: '2025-04-01',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'success', data: mockResponse });
    });

    it('should return 500 on error', async () => {
      (AppointmentsController.markAvailability as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await request(app).post('/appointments/markAvailability').send({
        vet_id: 'vet-123',
        available_date: '2025-04-01',
      });

      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /appointments/availableVets', () => {
    it('should return available vets', async () => {
      const mockData = [{ vet_id: 'vet-1' }];
      (AppointmentsController.getAvailableVets as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get('/appointments/availableVets?date=2025-04-01');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'success', data: mockData });
    });
  });

  describe('GET /appointments/getAppointmentsForVet', () => {
    it('should return appointments for a vet', async () => {
      const mockAppointments = [{ id: 'a1' }];
      (AppointmentsController.getAppointmentsForVet as jest.Mock).mockResolvedValue(mockAppointments);

      const res = await request(app).get('/appointments/getAppointmentsForVet?vet_id=vet1&date=2025-04-01');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'success', data: mockAppointments });
    });
  });

  describe('GET /appointments/getAppointmentsForUser', () => {
    it('should return appointments for a user', async () => {
      const mockAppointments = [{ id: 'a1' }];
      (AppointmentsController.getAppointmentsForUser as jest.Mock).mockResolvedValue(mockAppointments);

      const res = await request(app).get('/appointments/getAppointmentsForUser?user_id=user1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'success', data: mockAppointments });
    });
  });

  describe('POST /appointments/bookAppointment', () => {
    it('should book an appointment', async () => {
      const mockAppointment = { id: 'appointment-1' };
      (AppointmentsController.bookAppointment as jest.Mock).mockResolvedValue(mockAppointment);

      const res = await request(app).post('/appointments/bookAppointment').send({
        user_id: 'user1',
        vet_id: 'vet1',
        appointment_date: '2025-04-01',
        appointment_time: '14:00:00',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'success', data: mockAppointment });
    });
  });

  describe('POST /appointments/respondAppointment', () => {
    it('should update appointment status', async () => {
      const mockUpdate = { id: 'appointment-1', status: 'accepted' };
      (AppointmentsController.respondAppointment as jest.Mock).mockResolvedValue(mockUpdate);

      const res = await request(app).post('/appointments/respondAppointment').send({
        appointment_id: 'appointment-1',
        status: 'accepted',
        rejection_reason: '',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'success', data: mockUpdate });
    });
  });
});
