import { sequelize } from "../../db";
import { v6 as uuidv6 } from "uuid";
import { format } from "date-fns";

const models = sequelize.models;

const MedicationsService = {
    getMedications: async () => {
        const medications = await models.MEDICATION.findAll({});
        return medications;
    },

    retrieveMedication: async (id: string) => {
        const medication = await models.MEDICATION.findOne({
            where: { id }
        });
        return medication;
    },

    insertMedication: async (medicationData: any) => {
        const preparedMedicationData = {
            id: uuidv6(),
            name: medicationData.name || '',
            description: medicationData.description || '',
            type: medicationData.type || '',
            requires_prescription: medicationData.requiresPrescription || false,
            created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        };

        try {
            console.log('Prepared Medication Data:', preparedMedicationData);
            const newMedication = await models.MEDICATION.create(preparedMedicationData);
            return newMedication;
        } catch (error) {
            console.error('Error inserting medication:', error);
            throw error;
        }
    }
};

export default MedicationsService;
