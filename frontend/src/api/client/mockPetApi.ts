import {PetApi} from "./petApi";

import {mockPets} from "./mockData/mockPets.ts";
import {mockVaccinationRecords} from "./mockData/mockVaccinationRecords.ts";
import {MedicationRecord} from "../types/medicationRecord.ts";
import {mockMedicationRecords} from "./mockData/mockMedicationRecords.ts";
import VaccinationRecord from "../types/vaccinationRecord.ts";
import {v4 as uuid} from "uuid";

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

        getPetsByOwnerId: async (ownerId: string) => {
            await delay(500); // Simulate network delay
            if (ownerId.includes("error")) {
                throw new Error("Owner not found or has no pets");
            }
            const pets = mockPets.filter(pet => pet.ownerId === ownerId)
            if (!pets) {
                return {
                    success: false,
                    data: null,
                    message: `No pets with owner ${ownerId} found.`
                }
            } else {
                return {
                    success: true,
                    data: pets,
                    message: `Pets retrieved successfully`
                }
            }

        },
        // insertPet: (petData: CreatePetRequestBody) => Promise<PetsApiResponse>;
        insertPet: async (petData) => {
            await delay(500); // Simulate network delay
            const id = uuid()
            return {
                success: true,
                data: {
                    ...petData,
                    id: id,
                    isDeleted: false,
                    dateOfBirth: petData.dateOfBirth ? petData.dateOfBirth : new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    weight: petData.weight ? petData.weight : 0,
                    height: petData.height ? petData.height : 0,
                    neckGirthCm: petData.neckGirthCm ? petData.neckGirthCm : 0,
                    chestGirthCm: petData.chestGirthCm ? petData.chestGirthCm : 0,
                    isNeutered: petData.isNeutered ? petData.isNeutered : false,
                },
                message: "Insert success"
            }
        },

        getVaccinationRecords: async (petId: string) => {
            await delay(500); // Simulate network delay
            if (petId.includes("error")) {
                throw new Error("Error fetching vaccination records");
            }
            const records = mockVaccinationRecords.filter(record => record.petId === petId);
            if (!records || records.length === 0) {
                throw new Error(`Health record for pet ID ${petId} not found`);
            }
            return records;
        },

        getMedicationRecords: async (petId: string): Promise<MedicationRecord[]> => {
            await delay(500); // Simulate network delay
            if (petId.includes("error")) {
                throw new Error("Error fetching medication records");
            }
            const records = mockMedicationRecords.filter(record => record.petId === petId);
            if (!records || records.length === 0) {
                throw new Error(`Medication record for pet ID ${petId} not found`);
            }
            return records;
        },

        createVaccinationRecord: async (vaccinationData: Partial<VaccinationRecord>): Promise<VaccinationRecord> => {
            await delay(500); // Simulate network delay
            const id = "vac-" + Math.random().toString(36).substring(2, 7);
            const now = new Date().toISOString();

            const newRecord: VaccinationRecord = {
                id,
                petId: vaccinationData.petId || "",
                name: vaccinationData.name || "",
                description: vaccinationData.description || "",
                administeredDate: vaccinationData.administeredDate || now,
                administeredBy: vaccinationData.administeredBy || "",
                nextDueDate: vaccinationData.nextDueDate || now,
                isValid: vaccinationData.isValid !== undefined ? vaccinationData.isValid : true,
                created: now,
                updated: now
            };

            // Add to mock data array (this won't persist after page refresh in a real app)
            mockVaccinationRecords.push(newRecord);

            return newRecord;
        },

        createMedicationRecord: async (medicationData: Partial<MedicationRecord>): Promise<MedicationRecord> => {
            await delay(500); // Simulate network delay
            const id = "med-" + Math.random().toString(36).substring(2, 7);
            const now = new Date().toISOString();

            const newRecord: MedicationRecord = {
                id,
                petId: medicationData.petId || "",
                name: medicationData.name || "",
                description: medicationData.description || "",
                dosage: medicationData.dosage || "",
                frequency: medicationData.frequency || "",
                startDate: medicationData.startDate || now,
                endDate: medicationData.endDate || now,
                requiresPrescription: medicationData.requiresPrescription !== undefined ? medicationData.requiresPrescription : false,
                prescribedBy: medicationData.prescribedBy || "",
                created: now
            };

            // Add to mock data array
            mockMedicationRecords.push(newRecord);

            return newRecord;
        }

    };
};