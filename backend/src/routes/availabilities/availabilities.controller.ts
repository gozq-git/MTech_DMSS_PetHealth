import AvailabilitiesService from "./availabilities.service";

const AvailabilitiesController = {
 // For a vet to mark their availability
 markAvailability: async (vetId: string, availableDate: string) => {
    try {
      const result = await AvailabilitiesService.markAvailability(vetId, availableDate);
      return result;
    } catch (error) {
      // logger.error(error);
      throw new Error("Error marking availability");
    }
  },

  // For a user to get the list of available vets for a specific date
  getAvailableVets: async (date: string) => {
    try {
      const result = await AvailabilitiesService.getAvailableVets(date);
      return result;
    } catch (error) {
      // logger.error(error);
      throw new Error("Error retrieving available vets");
    }
  },

  getAvailabilityForVet: async (vetId: string) => {
    try {
      const result = await AvailabilitiesService.getAvailabilityForVet(vetId);
      return result;
    } catch (error) {
      // logger.error(error);
      throw new Error("Error retrieving vet availability");
    }
  }
};

export default AvailabilitiesController;