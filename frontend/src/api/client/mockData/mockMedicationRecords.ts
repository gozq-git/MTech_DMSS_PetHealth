// Mock medication records
import {MedicationRecord} from "../../types/medicationRecord.ts";

export const mockMedicationRecords: MedicationRecord[] = [
    {
        id: "med-001",
        petId: "1",
        name: "NexGard SPECTRA®",
        description: "Monthly preventative medication against fleas, ticks, mites, heartworm disease, lungworm disease, and intestinal worms",
        dosage: "1 chewable tablet (for dogs 7.5-15 kg)",
        frequency: "Monthly",
        startDate: "2025-01-22T00:00:00Z",
        endDate: "2026-01-22T00:00:00Z",
        requiresPrescription: true,
        prescribedBy: "Dr. Jason Chen",
        created: "2023-01-15T10:30:00Z"
    },
    {
        id: "med-002",
        petId: "1",
        name: "Prednisone",
        description: "Anti-inflammatory steroid for seasonal allergies",
        dosage: "5mg",
        frequency: "Once daily for 7 days, then every other day for 7 days",
        startDate: "2023-05-10T00:00:00Z",
        endDate: "2023-05-24T00:00:00Z",
        requiresPrescription: true,
        prescribedBy: "Dr. Michael Lim",
        created: "2023-05-10T14:15:00Z"
    },
    {
        id: "med-003",
        petId: "3",
        name: "NexGard® COMBO",
        description: "Monthly topical solution that safeguards against fleas, ticks, mites, heartworm disease, lungworm disease, and intestinal worms including tapeworms",
        dosage: "1 chewable tablet (for cats 2.5-7.5 Kg)",
        frequency: "Monthly",
        startDate: "2025-03-01T00:00:00Z",
        endDate: "2026-03-01T00:00:00Z",
        requiresPrescription: true,
        prescribedBy: "Dr. Sarah Tay",
        created: "2023-03-01T09:45:00Z"
    },
    {
        id: "med-004",
        petId: "2",
        name: "Amoxicillin",
        description: "Antibiotic for treating skin infection",
        dosage: "250mg",
        frequency: "Twice daily for 10 days",
        startDate: "2023-08-05T00:00:00Z",
        endDate: "2023-08-15T00:00:00Z",
        requiresPrescription: true,
        prescribedBy: "Dr. Willam Soh",
        created: "2023-08-05T11:30:00Z"
    },
    {
        id: "med-005",
        petId: "3",
        name: "Revolution",
        description: "Flea, tick, ear mite, heartworm preventative for cats",
        dosage: "1 topical application (for cats 5.1-15 lbs)",
        frequency: "Monthly",
        startDate: "2023-04-10T00:00:00Z",
        endDate: "2024-04-10T00:00:00Z",
        requiresPrescription: true,
        prescribedBy: "Dr. Michael Lim",
        created: "2023-04-10T15:20:00Z"
    },
    {
        id: "med-006",
        petId: "3",
        name: "Lysine",
        description: "Supplement to support immune system",
        dosage: "250mg",
        frequency: "Twice daily with food",
        startDate: "2023-09-20T00:00:00Z",
        endDate: "2023-12-20T00:00:00Z",
        requiresPrescription: false,
        prescribedBy: "Dr. Sarah Tay",
        created: "2023-09-20T10:15:00Z"
    }
];