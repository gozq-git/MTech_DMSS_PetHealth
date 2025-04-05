import express, {Request, Response} from 'express';
import AvailabilitiesController from './availabilities.controller';

export const availabilities = express.Router();

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
availabilities.post('/markAvailability', async (req: Request, res: Response): Promise<void> => {
    const { vet_id, available_date } = req.body;
    try {
      const result = await AvailabilitiesController.markAvailability(vet_id, available_date);
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
  availabilities.get('/availableVets', async (req: Request, res: Response): Promise<void> => {
    const { date } = req.query;
    try {
      const result = await AvailabilitiesController.getAvailableVets(date as string);
      res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      logger.error(error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  /**
 * @swagger
 * /appointments/getAvailabilityForVet:
 *   get:
 *     summary: Get a vet's availability.
 *     tags:
 *       - appointments
 *     description: Retrieve the list of dates a specific vet is available.
 *     parameters:
 *       - in: query
 *         name: vet_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The vet's ID
 *     responses:
 *       200:
 *         description: List of available dates for the vet.
 */
availabilities.get('/getAvailabilityForVet', async (req: Request, res: Response): Promise<void> => {
  const { vet_id } = req.query;
  try {
    const result = await AvailabilitiesController.getAvailabilityForVet(vet_id as string);
    res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});