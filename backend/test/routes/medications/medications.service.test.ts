// ✅ Declare mocks FIRST
const findAll = jest.fn();
const findOne = jest.fn();
const create = jest.fn();

// ✅ Then mock the db module
jest.mock("../../../src/db", () => ({
  sequelize: {
    models: {
      MEDICATION: {
        findAll,
        findOne,
        create,
      },
    },
  },
}));

import MedicationsService from "../../../src/routes/medications/medications.service";
import { v6 as uuidv6 } from "uuid";
import { format } from "date-fns";

// ✅ Mock uuid and date-fns
jest.mock("uuid", () => ({
  v6: jest.fn(() => "mock-uuid"),
}));

jest.mock("date-fns", () => {
  const actual = jest.requireActual("date-fns");
  return {
    ...actual,
    format: jest.fn(() => "2025-04-20 13:00:00"),
  };
});

describe("MedicationsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMedications", () => {
    it("should return all medications", async () => {
      const mockMedications = [{ id: "1", name: "Paracetamol" }];
      findAll.mockResolvedValue(mockMedications);

      const result = await MedicationsService.getMedications();

      expect(result).toEqual(mockMedications);
      expect(findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("retrieveMedication", () => {
    it("should return a medication by ID", async () => {
      const mockMedication = { id: "1", name: "Ibuprofen" };
      findOne.mockResolvedValue(mockMedication);

      const result = await MedicationsService.retrieveMedication("1");

      expect(result).toEqual(mockMedication);
      expect(findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    });
  });

  describe("insertMedication", () => {
    it("should insert a new medication with defaults and generated fields", async () => {
      const newMed = {
        name: "Cetirizine",
        description: "Allergy relief",
        type: "Tablet",
        requiresPrescription: true,
      };

      const expected = {
        id: "mock-uuid",
        name: "Cetirizine",
        description: "Allergy relief",
        type: "Tablet",
        requires_prescription: true,
        created_at: "2025-04-20 13:00:00",
      };

      const inserted = { ...expected };
      create.mockResolvedValue(inserted);

      const result = await MedicationsService.insertMedication(newMed);

      expect(result).toEqual(inserted);
      expect(create).toHaveBeenCalledWith(expected);
    });

    it("should use default values when input is incomplete", async () => {
      const fallback = {
        id: "mock-uuid",
        name: "",
        description: "",
        type: "",
        requires_prescription: false,
        created_at: "2025-04-20 13:00:00",
      };

      create.mockResolvedValue(fallback);

      const result = await MedicationsService.insertMedication({});

      expect(result).toEqual(fallback);
      expect(create).toHaveBeenCalledWith(fallback);
    });

    it("should throw and log error if create fails", async () => {
      const error = new Error("DB insert failed");
      create.mockRejectedValue(error);
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});

      await expect(
        MedicationsService.insertMedication({ name: "Test" })
      ).rejects.toThrow("DB insert failed");

      expect(spy).toHaveBeenCalledWith("Error inserting medication:", error);
      spy.mockRestore();
    });
  });
});
