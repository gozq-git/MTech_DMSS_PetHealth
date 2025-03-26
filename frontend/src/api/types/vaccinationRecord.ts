export interface VaccinationRecord {
    id: string;
    petId: string;
    name: string;
    description: string;
    administeredDate: string;
    administeredBy: string;
    expiryDate: string;
    nextDueDate: string;
    lotNumber: string;
    isValid: boolean;
    created: string;
    updated: string;
}
export interface VaccinationRecordRequest {
    name: string;
    description: string;
    administered_at: string;
    administered_by: string;
    expires_at: string;
    lot_number: string;
    next_due_at: string;
    is_valid: boolean;
}
