import express, { Request, Response } from 'express';
import AppointmentsController from "./appointments.controller";
const logger = require('../../utils/logger');

export const appointments = express.Router();

/**
 * @swagger
 * /appointments/markAvailability:
 *   post:
 *     summary: Vet marks their availability.
 *     tags:
 *       - appointments
 *     description: Allows a vet to mark a day they are available.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             vet_id: "vet-uuid-here"
 *             available_date: "2025-04-01"
 *     responses:
 *       200:
 *         description: Availability marked successfully.
 */
appointments.post('/markAvailability', async (req: Request, res: Response): Promise<void> => {
  const { vet_id, available_date } = req.body;
  try {
    const result = await AppointmentsController.markAvailability(vet_id, available_date);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /appointments/availableVets:
 *   get:
 *     summary: Get available vets on a given date.
 *     tags:
 *       - appointments
 *     description: Retrieve the list of vets available on a specific day.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date to check availability (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of available vets.
 */
appointments.get('/availableVets', async (req: Request, res: Response): Promise<void> => {
  const { date } = req.query;
  try {
    const result = await AppointmentsController.getAvailableVets(date as string);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /appointments/getAppointmentsForVet:
 *   get:
 *     summary: Get all appointments for a vet on a given date.
 *     tags:
 *       - appointments
 *     description: Retrieve the list of all appointments (pending, accepted, rejected) for a vet on a specific day.
 *     parameters:
 *       - in: query
 *         name: vet_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vet ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: The date to check for appointments (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of all appointments (pending, accepted, rejected).
 */
appointments.get('/getAppointmentsForVet', async (req: Request, res: Response): Promise<void> => {
  const { vet_id, date } = req.query;
  try {
    const result = await AppointmentsController.getAppointmentsForVet(vet_id as string, date as string);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /appointments/getAllAppointmentsForVet:
 *   get:
 *     summary: Get all appointments for a vet (across all dates).
 *     tags:
 *       - appointments
 *     description: Retrieve the list of all appointments (pending, accepted, rejected) for a vet, regardless of the date.
 *     parameters:
 *       - in: query
 *         name: vet_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vet ID
 *     responses:
 *       200:
 *         description: List of all appointments (pending, accepted, rejected) across all dates.
 */
appointments.get('/getAllAppointmentsForVet', async (req: Request, res: Response): Promise<void> => {
  const { vet_id } = req.query;
  try {
    const result = await AppointmentsController.getAllAppointmentsForVet(vet_id as string);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /appointments/getAppointmentsForUser:
 *   get:
 *     summary: Get all appointments for a user.
 *     tags:
 *       - appointments
 *     description: Retrieve the list of all appointments (pending, accepted, rejected) for a user.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of all appointments (pending, accepted, rejected).
 */
appointments.get('/getAppointmentsForUser', async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.query;
  try {
    const result = await AppointmentsController.getAppointmentsForUser(user_id as string);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /appointments/bookAppointment:
 *   post:
 *     summary: Book an appointment with a vet.
 *     tags:
 *       - appointments
 *     description: Allows a user to book an appointment by selecting a vet on an available day.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             user_id: "user-uuid-here"
 *             vet_id: "vet-uuid-here"
 *             pet_id: "pet-uuid-here"
 *             pet_name: "Buddy"
 *             appointment_date: "2025-04-01"
 *             appointment_time: "14:00:00"
 *     responses:
 *       200:
 *         description: Appointment booked successfully.
 */
appointments.post('/bookAppointment', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await AppointmentsController.bookAppointment(req.body);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * @swagger
 * /appointments/respondAppointment:
 *   post:
 *     summary: Vet responds to an appointment request.
 *     tags:
 *       - appointments
 *     description: Allows a vet to accept or reject an appointment request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             appointment_id: "appointment-uuid-here"
 *             status: "accepted"
 *             rejection_reason: "Not available on this day"
 *     responses:
 *       200:
 *         description: Appointment updated successfully.
 */
appointments.post('/respondAppointment', async (req: Request, res: Response): Promise<void> => {
  const { appointment_id, status, rejection_reason } = req.body;
  try {
    const result = await AppointmentsController.respondAppointment(appointment_id, status, rejection_reason);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});
