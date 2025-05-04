import VaccinationRecordsService from "./vaccination_records.service";

const VaccinationRecordsController = {
  insertVaccinationRecord: async (petId: string, data: any) => {
    try {
      const newRecord = await VaccinationRecordsService.insertVaccinationRecord(petId, data);
      return newRecord;
    } catch (error) {
      console.error(error);
      throw new Error("Error inserting vaccination record");
    }
  },

  getVaccinationRecordsByPetId: async (petId: string) => {
    try {
      const records = await VaccinationRecordsService.getVaccinationRecordsByPetId(petId);
      return records;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving vaccination records by pet ID");
    }
  },
};

export default VaccinationRecordsController;
