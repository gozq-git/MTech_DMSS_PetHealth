import MedicationRecordsService from "./medication_records.service";

const MedicationRecordsController = {
    getMedicationRecords: async () => {
        try {
            return await MedicationRecordsService.getMedicationRecords();
        } catch (error) {
            console.error(error);
            throw new Error("Error retrieving medication records");
        }
    },

    retrieveMedicationRecord: async (id: string) => {
        try {
            return await MedicationRecordsService.retrieveMedicationRecord(id);
        } catch (error) {
            console.error(error);
            throw new Error("Error retrieving medication record");
        }
    },

    insertMedicationRecord: async (recordData: any) => {
        try {
            return await MedicationRecordsService.insertMedicationRecord(recordData);
        } catch (error) {
            console.error(error);
            throw new Error("Error inserting medication record");
        }
    }
};

export default MedicationRecordsController;
