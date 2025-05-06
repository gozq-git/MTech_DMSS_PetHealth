import { sequelize } from "../../db";
import { v4 as uuidv4 } from "uuid";

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
        pet_id: appointmentData.pet_id,
        pet_name: appointmentData.pet_name,
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
      }) as any;
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
      const appointments = await models.APPOINTMENTS.findAll({
        where: {
          appointment_date: date,
          vet_id: vetId,
        },
        include: [
          {
            model: models.USERS,
            required: true,
          },
        ],
      });
      return appointments;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error retrieving appointments");
    }
  },

  // Fetch all appointments for a given vet, across all dates (pending, accepted, and rejected)
  getAllAppointmentsForVet: async (vetId: string) => {
    try {
      const appointments = await models.APPOINTMENTS.findAll({
        where: {
          vet_id: vetId, // Only filter by vetId
        },
        include: [
          {
            model: models.USERS,
            required: true,
          },
        ],
      });
      return appointments;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error retrieving all appointments for vet");
    }
  },

  // Fetch all appointments for a given user (pending, accepted, and rejected)
  getAppointmentsForUser: async (userId: string) => {
    try {
      const appointments = await models.APPOINTMENTS.findAll({
        where: {
          user_id: userId,
        },
        include: [
          {
            model: models.USERS,
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
