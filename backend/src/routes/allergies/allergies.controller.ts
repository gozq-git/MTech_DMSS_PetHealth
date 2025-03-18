import { sequelize } from "../../db";
import { QueryTypes } from "sequelize";
import AllergyService from "./allergies.service";

const models = sequelize.models;

const AllergyController = {
  getAllergiesByPetId: async (petId: string) => {
    try {
      const allergies = await AllergyService.getAllergiesByPetId(petId);
      return allergies;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving allergies by pet ID");
    }
  },
  insertAllergy: async (allergyData: any) => {
    try {
      const newAllergy = await AllergyService.insertAllergy(allergyData);
      return newAllergy;
    } catch (error) {
      console.error(error);
      throw new Error("Error inserting allergy");
    }
  },
  updateAllergyById: async (id: string, updateData: any) => {
    try {
      const updatedAllergy = await AllergyService.updateAllergyById(id, updateData);
      return updatedAllergy;
    } catch (error) {
      console.error(error);
      throw new Error("Error updating allergy");
    }
  }
};

export default AllergyController;