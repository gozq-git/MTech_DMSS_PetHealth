import {BaseApiClient} from "./createApiClient.ts";
import {CreatePetRequestBody, Pet} from "../types/pet.ts";
import VaccinationRecord from "../types/vaccinationRecord.ts";
import {MedicationRecord} from "../types/medicationRecord.ts";

type PetsApiResponse = {
    success: boolean;
    data: Pet[] | Pet | null;
    message: string;
};

export interface PetApi {
    retrievePet: (petId: string) => Promise<Pet>;
    getPetsByOwnerId: (ownerId: string) => Promise<PetsApiResponse>;
    insertPet: (petData: CreatePetRequestBody) => Promise<PetsApiResponse>;
    getVaccinationRecords: (petId: string) => Promise<VaccinationRecord[]>;
    getMedicationRecords: (petId: string) => Promise<MedicationRecord[]>;
    createVaccinationRecord: (vaccinationData: Partial<VaccinationRecord>) => Promise<VaccinationRecord>;
    createMedicationRecord: (medicationData: Partial<MedicationRecord>) => Promise<MedicationRecord>;
}

export const createPetApiClient = (baseClient: BaseApiClient): PetApi => {
    return {
        retrievePet: (petId) => baseClient.get<Pet>(`/api/pets/retrieve/${petId}`),
        getPetsByOwnerId: async (ownerId): Promise<PetsApiResponse> => {
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
        insertPet: async (petData) : Promise<PetsApiResponse> =>  {
            try {
                const response = await baseClient.post<{
                    status: 'success' | 'error',
                    data: Pet[] | null | any,
                    message: string | any;
                }>('/api/pets/insertPet', petData)
                console.log("insertPet response",response)
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
        /**
         * This API is not the actual thing, Only used in [mockPetApi.ts]
         * @param petId
         */
        getVaccinationRecords: (petId) => baseClient.get<VaccinationRecord[]>(`/api/pets/vaccinations/${petId}`),
        getMedicationRecords: (petId) => baseClient.get<MedicationRecord[]>(`/api/pets/medications/${petId}`),
        createMedicationRecord: (medicationData) => baseClient.post<MedicationRecord>(`/api/pets/medications/${medicationData.id}`, medicationData),
        createVaccinationRecord: (vaccinationData) => baseClient.post<VaccinationRecord>(`/api/pets/vaccinations/${vaccinationData.id}`, vaccinationData)
    };
};