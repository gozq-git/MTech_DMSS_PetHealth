import AppointmentsService from "./appointments.service";
const logger = require('../../utils/logger');

const AppointmentsController = {
  // For a vet to mark their availability
  markAvailability: async (vetId: string, availableDate: string) => {
    try {
      const result = await AppointmentsService.markAvailability(vetId, availableDate);
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error("Error marking availability");
    }
  },

  // For a user to get the list of available vets for a specific date
  getAvailableVets: async (date: string) => {
    try {
      const result = await AppointmentsService.getAvailableVets(date);
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error("Error retrieving available vets");
    }
  },

  // For a vet to fetch all appointments for a specific day
  getAppointmentsForVet: async (vetId: string, date: string) => {
    try {
      const result = await AppointmentsService.getAppointmentsForVet(vetId, date);
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error("Error retrieving pending appointments for vet");
    }
  },

  
  // For a user to fetch all appointments
  getAppointmentsForUser: async (userId: string) => {
    try {
      const result = await AppointmentsService.getAppointmentsForUser(userId);
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error("Error retrieving pending appointments for user");
    }
  },

  // For a user to book an appointment
  bookAppointment: async (appointmentData: any) => {
    try {
      const result = await AppointmentsService.bookAppointment(appointmentData);
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error("Error booking appointment");
    }
  },

  // For a vet to respond to an appointment request
  respondAppointment: async (appointmentId: string, status: 'accepted' | 'rejected', rejection_reason?: string) => {
    try {
      const result = await AppointmentsService.respondAppointment(appointmentId, status, rejection_reason);
      return result;
    } catch (error) {
      logger.error(error);
      throw new Error("Error responding to appointment");
    }
  }
};

export default AppointmentsController;
