export default interface VaccinationRecord {
    id: string;
    petId: string;
    name: string;
    description: string;
    administeredDate: string;
    administeredBy: string;
    nextDueDate: string;
    isValid: boolean;
    created: string;
    updated: string;
}