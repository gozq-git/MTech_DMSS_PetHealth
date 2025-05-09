export interface MedicationRecord {
    id: string;
    pet_id: string;
    name: string;
    description: string;
    dosage: string;
    frequency: string;
    start_date: string;
    end_date: string;
    requiresPrescription: boolean;
    prescribed_by: string;
    created: string;

}

