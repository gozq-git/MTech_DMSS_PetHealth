import {PetApi} from "./petApi";
import {Pet} from "../types/pet";
import VaccinationRecord from "../types/vaccinationRecord.ts";

// fake data
const mockPets: Pet[] = [
    {
        id: "1",
        ownerId: "owner-789012",
        name: "Kiyo",
        gender: "Female",
        species: "dog",
        breed: "Cockapoo",
        dateOfBirth: "2018-05-24",
        weight: 8.8,
        height: 58,
        neckGirthCm: 42,
        chestGirthCm: 75,
        lastMeasured: "2024-02-10T14:30:00Z",
        isNeutered: true,
        microchipNumber: "985121054367890",
        photoUrl: "https://images.unsplash.com/photo-1605459082134-3b8162f3de8b?q=80&w=3009&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        createdAt: "2020-06-01T10:15:30Z",
        updatedAt: "2024-02-10T14:35:22Z",
        isDeleted: false
    },
    {
        id: "2",
        ownerId: "owner-789012",
        name: "Max",
        gender: "male",
        species: "dog",
        breed: "Golden Retriever",
        dateOfBirth: "2020-05-15",
        weight: 32.5,
        height: 58,
        neckGirthCm: 42,
        chestGirthCm: 75,
        lastMeasured: "2024-02-10T14:30:00Z",
        isNeutered: true,
        microchipNumber: "985121054367890",
        photoUrl: "https://images.unsplash.com/photo-1577175825697-56e88f5b6aa5?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        createdAt: "2020-06-01T10:15:30Z",
        updatedAt: "2024-02-10T14:35:22Z",
        isDeleted: false
    },
    {
        id: "3",
        ownerId: "owner-789012",
        name: "Luna",
        gender: "female",
        species: "cat",
        breed: "Maine Coon",
        dateOfBirth: "2021-09-23",
        weight: 6.8,
        height: 30,
        neckGirthCm: 20,
        chestGirthCm: 38,
        lastMeasured: "2024-01-05T09:15:00Z",
        isNeutered: true,
        microchipNumber: "675432198034567",
        photoUrl: "https://images.unsplash.com/photo-1606213651356-0272cc0becd2?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        createdAt: "2021-10-10T14:25:30Z",
        updatedAt: "2024-01-05T09:20:15Z",
        isDeleted: false
    }
];

const mockVaccinationRecords: VaccinationRecord[] = [
    {
        id: "vac-001",
        petId: "1",
        name: "Rabies",
        description: "Standard rabies vaccination, 3-year protection",
        administeredDate: "2023-11-15T09:30:00Z",
        administeredBy: "Dr. Sarah Johnson",
        nextDueDate: "2026-11-15T00:00:00Z",
        isValid: true,
        created: "2023-11-15T09:45:00Z",
        updated: "2023-11-15T09:45:00Z"
    },
    {
        id: "vac-002",
        petId: "1",
        name: "DHPP",
        description: "Distemper, Hepatitis, Parainfluenza and Parvovirus combo vaccine",
        administeredDate: "2023-10-20T14:15:00Z",
        administeredBy: "Dr. Michael Chen",
        nextDueDate: "2024-10-20T00:00:00Z",
        isValid: true,
        created: "2023-10-20T14:30:00Z",
        updated: "2023-10-20T14:30:00Z"
    },
    {
        id: "vac-003",
        petId: "1",
        name: "FVRCP",
        description: "Feline Viral Rhinotracheitis, Calicivirus and Panleukopenia",
        administeredDate: "2023-09-05T11:00:00Z",
        administeredBy: "Dr. Sarah Johnson",
        nextDueDate: "2024-09-05T00:00:00Z",
        isValid: true,
        created: "2023-09-05T11:20:00Z",
        updated: "2023-09-05T11:20:00Z"
    },
    {
        id: "vac-004",
        petId: "2",
        name: "Bordetella",
        description: "Kennel cough vaccination",
        administeredDate: "2022-12-10T10:15:00Z",
        administeredBy: "Dr. Robert Martinez",
        nextDueDate: "2023-12-10T00:00:00Z",
        isValid: false,
        created: "2022-12-10T10:30:00Z",
        updated: "2022-12-10T10:30:00Z"
    },
    {
        id: "vac-005",
        petId: "2",
        name: "Leptospirosis",
        description: "Protects against bacterial infection",
        administeredDate: "2024-01-05T13:45:00Z",
        administeredBy: "Dr. Michael Chen",
        nextDueDate: "2025-01-05T00:00:00Z",
        isValid: true,
        created: "2024-01-05T14:00:00Z",
        updated: "2024-01-05T14:00:00Z"
    },
    {
        id: "vac-006",
        petId: "2",
        name: "Rabies",
        description: "Standard rabies vaccination, 1-year protection",
        administeredDate: "2023-08-12T15:30:00Z",
        administeredBy: "Dr. Sarah Johnson",
        nextDueDate: "2024-08-12T00:00:00Z",
        isValid: true,
        created: "2023-08-12T15:45:00Z",
        updated: "2023-08-12T15:45:00Z"
    },
    {
        id: "vac-007",
        petId: "1",
        name: "Lyme Disease",
        description: "Protection against Lyme disease for dogs",
        administeredDate: "2023-05-22T09:00:00Z",
        administeredBy: "Dr. Robert Martinez",
        nextDueDate: "2024-05-22T00:00:00Z",
        isValid: true,
        created: "2023-05-22T09:15:00Z",
        updated: "2023-05-22T09:15:00Z"
    }
];


// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock implementation of PetApi
export const createMockPetApiClient = (): PetApi => {
    return {
        retrievePet: async (petId: string) => {
            await delay(300); // Simulate network delay
            const pet = mockPets.find(pet => pet.id === petId);
            if (!pet) {
                throw new Error(`Pet with ID ${petId} not found`);
            }
            return pet;
        },

        getPets: async (ownerId: string) => {
            await delay(500); // Simulate network delay
            if (ownerId.includes("error")) {
                throw new Error("Owner not found or has no pets");
            }
            const pets = mockPets.filter(pet => pet.ownerId === ownerId)
            if (!pets) {
                throw new Error(`No pets with owner ${ownerId} found.`)
            }
            return pets
        },

        getVaccinationRecords: async (petId: string) => {
            await delay(500); // Simulate network delay
            if (petId.includes("error")) {
                throw new Error("Error fetching vaccination records");
            }
            const records = mockVaccinationRecords.filter(record => record.petId === petId);
            if (!records) {
                throw new Error(`Health record for pet ID ${petId} not found`);
            }
            return records;
        },

        insertPet: async (petData) => {
            await delay(500); // Simulate network delay
            const id = "pet-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            return { ...petData, id };
        }
    };
};