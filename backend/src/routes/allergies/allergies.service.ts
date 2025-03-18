import { sequelize } from "../../db";
import { QueryTypes } from "sequelize";

const models = sequelize.models;

const AllergyService = {
  getAllergiesByPetId: async (petId: string) => {
    const allergies = await models.ALLERGIES.findAll({
      where: {
        pet_id: petId
      }
    });
    return allergies;
  },
  insertAllergy: async (allergyData: any) => {
    const newAllergy = await models.ALLERGIES.create(allergyData);
    return newAllergy;
  },
  updateAllergyById: async (id: string, updateData: any) => {
    const [updatedCount] = await models.ALLERGIES.update(updateData, {
      where: {
        id
      }
    });
    return updatedCount > 0 ? await models.ALLERGIES.findOne({ where: { id } }) : null;
  }
};

export default AllergyService;
