import { sequelize } from "../../db";
import { QueryTypes } from "sequelize";

const models = sequelize.models;

const VaccinationRecordsService = {
  insertVaccinationRecord: async (petId: string, data: any) => {
    const record = await models.VACCINATION_RECORDS.create({
      ...data,
      pet_id: petId
    });
    console.log('Vaccination record created', record);
    return record;
  },

  getVaccinationRecordsByPetId: async (petId: string) => {
    const records = await models.VACCINATION_RECORDS.findAll({
      where: {
        pet_id: petId
      },
      order: [['administered_at', 'DESC']] // Optional: recent first
    });
    return records;
  }
};

export default VaccinationRecordsService;
