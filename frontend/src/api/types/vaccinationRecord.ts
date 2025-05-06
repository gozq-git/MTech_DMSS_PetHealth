export interface VaccinationRecord {
    id: string;
    pet_id: string;
    name: string;
    description: string;
    administered_at: string;
    administered_by: string;
    expires_at: string;
    next_due_at: string;
    lot_number: string;
    is_valid: boolean;
    created_at: string;
    updated_at: string;
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
