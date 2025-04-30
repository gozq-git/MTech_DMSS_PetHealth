import {BaseApiClient} from "./createApiClient.ts";
import {CreatePetRequestBody, Pet} from "../types/pet.ts";
import {MedicationRecord} from "../types/medicationRecord.ts";
import {VaccinationRecord, VaccinationRecordRequest} from "../types/vaccinationRecord.ts";

type DefaultApiResponse = {
    success: boolean;
    data: Pet[] | Pet | VaccinationRecord | VaccinationRecord[] | null;
    message: string;
};

export interface PetApi {
    retrievePet: (petId: string) => Promise<Pet>;
    getPetsByOwnerId: (ownerId: string) => Promise<DefaultApiResponse>;
    insertPet: (petData: CreatePetRequestBody) => Promise<DefaultApiResponse>;
    getVaccinationRecords: (petId: string) => Promise<DefaultApiResponse>;
    getMedicationRecords: (petId: string) => Promise<MedicationRecord[]>;
    createVaccinationRecord: (petId: string, request: VaccinationRecordRequest) => Promise<DefaultApiResponse>;
    createMedicationRecord: (medicationData: Partial<MedicationRecord>) => Promise<MedicationRecord>;
}

export const createPetApiClient = (baseClient: BaseApiClient): PetApi => {
    return {
        retrievePet: (petId) => baseClient.get<Pet>(`/api/pets/retrievePet/${petId}`),
        getPetsByOwnerId: async (ownerId): Promise<DefaultApiResponse> => {
            try {
                const response = await baseClient.get<{
                    status: 'success' | 'error',
                    data: Pet[] | null | any,
                    message: string | any;
                }>(`/api/pets/getPetsByOwner/${ownerId}`);
                if (response.status === 'success') {
                    return {
                        success: true,
                        data: response.data as Pet[],
                        message: 'Pet(s) retrieved successfully'
                    };
                } else {
                    return {
                        success: false,
                        data: null,
                        message: typeof response.message === 'string'
                            ? response.message
                            : 'Failed to retrieve pets'
                    };
                }
            } catch (error) {
                console.error(`Error retrieving pets:`, error);
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                }
            }
        },
        insertPet: async (petData): Promise<DefaultApiResponse> => {
            try {
                const response = await baseClient.post<{
                    status: 'success' | 'error',
                    data: Pet[] | null | any,
                    message: string | any;
                }>('/api/pets/insertPet', petData)
                console.log("insertPet response", response)
                if (response.status === 'success') {
                    return {
                        success: true,
                        data: response.message as Pet[],
                        message: 'Pet added successfully'
                    };
                } else {
                    return {
                        success: false,
                        data: null,
                        message: typeof response.message === 'string'
                            ? response.message
                            : 'Failed to add pet'
                    };
                }
            } catch (error) {
                console.error(`Error inserting Pet:`, error);
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                }
            }
        },
        getVaccinationRecords: async (petId) => {
            try {
                const response = await baseClient.get<{
                    status: 'success' | 'error',
                    data: VaccinationRecord[] | null | any,
                    message: string | any;
                }>(`/api/vaccination_records/${petId}`)
                if (response.status === 'success') {
                    return {
                        success: true,
                        data: response.data as VaccinationRecord[],
                        message: typeof response.message === 'string'
                            ? response.message
                            : 'Vaccination records retrieved successfully'
                    };
                } else {
                    return {
                        success: false,
                        data: null,
                        message: typeof response.message === 'string'
                            ? response.message
                            : 'Failed to retrieve records'
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                }
            }

        },
        getMedicationRecords: (petId) => baseClient.get<MedicationRecord[]>(`/api/medication_records/retrieve/${petId}`),
        createMedicationRecord: (medicationData) => baseClient.post<MedicationRecord>(`/api/pets/medications/${medicationData.id}`, medicationData),
        createVaccinationRecord: async (petId: string, request: VaccinationRecordRequest) => {
            try {
                const response = await baseClient.post<{
                    status: 'success' | 'error',
                    data: VaccinationRecord | null | any,
                    message: string | any;
                }>(`/api/vaccination_records/${petId}`, request)
                if (response.status === 'success') {
                    return {
                        success: true,
                        data: response.data as VaccinationRecord,
                        message: 'Vaccination added successfully'
                    };
                } else {
                    return {
                        success: false,
                        data: null,
                        message: typeof response.message === 'string'
                            ? response.message
                            : 'Failed to add record'
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    data: null,
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                }
            }
        }
    };
};