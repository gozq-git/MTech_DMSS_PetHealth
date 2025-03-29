import { sequelize } from "../../db";
import { v6 as uuidv6 } from "uuid";
import { format } from "date-fns";

const models = sequelize.models;

const MedicationRecordsService = {
    getMedicationRecords: async () => {
        return await models.MEDICATION_RECORD.findAll({});
    },

    retrieveMedicationRecord: async (id: string) => {
        return await models.MEDICATION_RECORD.findOne({
            where: { id }
        });
    },

    insertMedicationRecord: async (recordData: any) => {
        const preparedRecord = {
            id: uuidv6(),
            pet_id: recordData.pet_id,
            medication_id: recordData.medication_id,
            dosage: recordData.dosage || '',
            frequency: recordData.frequency || '',
            start_date: recordData.start_date ? new Date(recordData.start_date) : null,
            end_date: recordData.end_date ? new Date(recordData.end_date) : null,
            prescribed_by: recordData.prescribed_by || null,
            notes: recordData.notes || '',
            is_active: recordData.is_active ?? true,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        };

        try {
            const newRecord = await models.MEDICATION_RECORD.create(preparedRecord);
            return newRecord;
        } catch (error) {
            console.error('Error inserting medication record:', error);
            throw error;
        }
    }
};

export default MedicationRecordsService;
