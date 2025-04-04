import { sequelize } from "../../db";
import { v4 as uuidv4 } from "uuid";
import { format } from 'date-fns';

const logger = require('../../utils/logger');
const models = sequelize.models;

const AppointmentsService = {
  // Vet marks availability for a given date
  markAvailability: async (vetId: string, availableDate: string) => {
    try {
      // Create a new availability record
      const availability = await models.AVAILABILITIES.create({
        id: uuidv4(),
        vet_id: vetId,
        available_date: availableDate,
      });
      return availability;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error marking availability");
    }
  },

  // Get available vets for a given date (optionally include vet details)
  getAvailableVets: async (date: string) => {
    try {
      const availabilities = await models.AVAILABILITIES.findAll({
        where: { available_date: date },
        include: [
          {
            model: models.VETS,
            required: true,
          }
        ]
      });
      return availabilities;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error retrieving available vets");
    }
  },

  // Book an appointment by a user with a selected vet on a given date (and time)
  bookAppointment: async (appointmentData: any) => {
    try {
      const newAppointment = await models.APPOINTMENTS.create({
        id: uuidv4(),
        user_id: appointmentData.user_id,
        vet_id: appointmentData.vet_id,
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time || null,
        status: 'pending'
      });
      return newAppointment;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error booking appointment");
    }
  },

  // Vet responds to a booking request
  respondAppointment: async (appointmentId: string, status: 'accepted' | 'rejected', rejection_reason?: string) => {
    try {
      const appointment = await models.APPOINTMENTS.findOne({
        where: { id: appointmentId }
      }) as any; // Replace 'any' with the actual type of the APPOINTMENTS model if available
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      appointment.status = status;
      if (status === 'rejected') {
        appointment.rejection_reason = rejection_reason || 'No reason provided';
      }
      await appointment.save();
      return appointment;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error updating appointment response");
    }
  },

// Fetch all appointments for a given vet on a specific date (pending, accepted, and rejected)
getAppointmentsForVet: async (vetId: string, date: string) => {
  try {
    // Fetch all appointments for the given vet and date (including all statuses)
    const appointments = await models.APPOINTMENTS.findAll({
      where: {
        appointment_date: date,
        vet_id: vetId,  // Ensure only this vet's appointments are fetched
      },
      include: [
        {
          model: models.USERS, // Optional: include user details
          required: true,
        },
      ],
    });
    return appointments;
  } catch (error: any) {
    logger.error(error);
    throw new Error("Error retrieving appointments");
  }
}

};




export default AppointmentsService;
