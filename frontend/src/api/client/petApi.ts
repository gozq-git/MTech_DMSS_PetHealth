import {BaseApiClient} from "./createApiClient.ts";
import {Pet} from "../types/pet.ts";

export interface PetApi {
    retrievePet: (petId: string) => Promise<Pet>;
    // getPets: (ownerId?: string) => Promise<Pet[]>;
    // createPet: (petData: Omit<Pet, 'id'>) => Promise<Pet>;
    // TODO: Implement other methods
}

export const createPetApiClient = (baseClient: BaseApiClient): PetApi => {
    return {
        retrievePet: (petId) => baseClient.get<Pet>(`/api/pets/retrieve/${petId}`),
        // getPets: (ownerId) => baseClient.get<Pet[]>('/api/pets', ownerId ? { params: { ownerId } } : undefined),
        // createPet: (petData) => baseClient.post<Pet>('/api/pets', petData),
        // TODO: Implement other methods
    };
};