export interface Pet {
    id: string;
    ownerId: string;
    name: string;
    gender: string;
    species: 'dog' | 'cat' | 'bird' | 'other'
    breed: string;
    dateOfBirth: string;
    weight: number;
    height: number;
    neckGirthCm: number;
    chestGirthCm: number;
    lastMeasured: string;
    isNeutered: boolean;
    microchipNumber: string;
    photoUrl: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}

export interface PetCreateInput {
    ownerId: string;
    name: string;
    gender: string;
    species: 'dog' | 'cat' | 'bird' | 'other'
    breed: string;
    dateOfBirth?: string;
    weight?: number;
    height?: number;
    neckGirthCm?: number;
    chestGirthCm?: number;
    lastMeasured: string;
    isNeutered?: boolean;
    microchipNumber: string;
    photoUrl: string;
}