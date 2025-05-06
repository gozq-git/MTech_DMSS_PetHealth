import MedicationsService from "./medications.service";

const MedicationsController = {
  getMedications: async () => {
    try {
      const medications = await MedicationsService.getMedications();
      return medications;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving medications");
    }
  },

  retrieveMedication: async (id: string) => {
    try {
      const medication = await MedicationsService.retrieveMedication(id);
      return medication;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving medication");
    }
  },

  insertMedication: async (medicationData: any) => {
    try {
      const newMedication = await MedicationsService.insertMedication(medicationData);
      return newMedication;
    } catch (error) {
      console.error(error);
      throw new Error("Error inserting medication");
    }
  }
};

export default MedicationsController;
