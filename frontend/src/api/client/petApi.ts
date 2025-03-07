import {BaseApiClient} from "./createApiClient.ts";
import {Pet} from "../types/pet.ts";
import VaccinationRecord from "../types/vaccinationRecord.ts";

export interface PetApi {
    retrievePet: (petId: string) => Promise<Pet>;
    getPets: (ownerId: string) => Promise<Pet[]>;
    insertPet: (petData: Omit<Pet, 'id'>) => Promise<Pet>;
    /**
     * This API is not the actual thing, Only used in [MockPetApi]
     * @param petId
     */
    getVaccinationRecords: (petId: string) => Promise<VaccinationRecord[]>;
}

export const createPetApiClient = (baseClient: BaseApiClient): PetApi => {
    return {
        retrievePet: (petId) => baseClient.get<Pet>(`/api/pets/retrieve/${petId}`),
        getPets: (ownerId) => baseClient.get<Pet[]>('/api/pets', ownerId ? { params: { ownerId } } : undefined),
        insertPet: (petData) => baseClient.post<Pet>('/api/pets/insertPet', petData),
        /**
         * This API is not the actual thing, Only used in [mockPetApi.ts]
         * @param petId
         */
        getVaccinationRecords: (petId) => baseClient.get<VaccinationRecord[]>(`/api/pets/vaccinations/${petId}`),
    };
};