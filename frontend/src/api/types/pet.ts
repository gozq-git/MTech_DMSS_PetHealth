export interface Pet {
    id: string;
    owner_id: string;
    name: string;
    gender: string;
    species: 'dog' | 'cat' | 'bird' | 'other'
    breed: string;
    date_of_birth: string;
    weight: number;
    height_cm: number;
    neck_girth_cm: number;
    chest_girth_cm: number;
    last_measured: string;
    is_neutered: boolean;
    microchip_number: string;
    photo_url: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

export interface CreatePetRequestBody {
    name: string;
    ownerId: string;
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