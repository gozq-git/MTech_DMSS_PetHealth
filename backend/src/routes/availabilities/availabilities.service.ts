import {sequelize} from "../../db";
import {v4 as uuidv4} from "uuid";
import {format} from "date-fns";

const models = sequelize.models;

const AvailabilitiesService = {
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
      console.log(error);
      // logger.error(error);
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
      // logger.error(error);
      throw new Error("Error retrieving available vets");
    }
  },

  getAvailabilityForVet: async (vetId: string) => {
    try {
      const availabilities = await models.AVAILABILITIES.findAll({
        where: { vet_id: vetId },
        attributes: ['available_date'],
        order: [['available_date', 'ASC']]
      });
      return availabilities;
    } catch (error: any) {
      // logger.error(error);
      throw new Error("Error retrieving vet availability");
    }
  },
}

export default AvailabilitiesService;