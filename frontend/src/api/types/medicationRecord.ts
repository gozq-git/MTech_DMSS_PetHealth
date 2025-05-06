export interface MedicationRecord {
    id: string;
    petId: string;
    name: string;
    description: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    requiresPrescription: boolean;
    prescribedBy: string;
    created: string;

}
