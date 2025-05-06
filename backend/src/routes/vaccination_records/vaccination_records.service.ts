import { sequelize } from "../../db";
import { QueryTypes } from "sequelize";
import {v6 as uuidv6} from "uuid";
import {format} from "date-fns";
const models = sequelize.models;

const VaccinationRecordsService = {
  insertVaccinationRecord: async (petId: string, data: any) => {
    const newRecord = {
      id: uuidv6(),
      pet_id: petId,
      name: data.name,
      description: data.description,
      administered_at: data.administered_at,
      administered_by: data.administered_by,
      lot_number: data.lot_number,
      expires_at: data.expires_at,
      next_due_at: data.next_due_at,
      is_valid: data.is_valid,
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    }
    const record = await models.VACCINATION_RECORDS.create(newRecord);
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
