import MedicationRecordsController from "../../../src/routes/medication_records/medication_records.controller";
import MedicationRecordsService from "../../../src/routes/medication_records/medication_records.service";

// 🧪 Mock the service
jest.mock("../../../src/routes/medication_records/medication_records.service");

describe("MedicationRecordsController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMedicationRecords", () => {
    it("should return medication records", async () => {
      const mockData = [{ id: "m1", pet_id: "p1", medication: "X" }];
      (MedicationRecordsService.getMedicationRecords as jest.Mock).mockResolvedValue(mockData);

      const result = await MedicationRecordsController.getMedicationRecords();
      expect(result).toEqual(mockData);
    });

    it("should throw error on failure", async () => {
      (MedicationRecordsService.getMedicationRecords as jest.Mock).mockRejectedValue(new Error("fail"));
      await expect(MedicationRecordsController.getMedicationRecords()).rejects.toThrow(
        "Error retrieving medication records"
      );
    });
  });

  describe("retrieveMedicationRecord", () => {
    it("should return a single medication record", async () => {
      const mockData = { id: "m1", medication: "X" };
      (MedicationRecordsService.retrieveMedicationRecord as jest.Mock).mockResolvedValue(mockData);

      const result = await MedicationRecordsController.retrieveMedicationRecord("m1");
      expect(result).toEqual(mockData);
    });

    it("should throw error on failure", async () => {
      (MedicationRecordsService.retrieveMedicationRecord as jest.Mock).mockRejectedValue(new Error("fail"));
      await expect(MedicationRecordsController.retrieveMedicationRecord("m1")).rejects.toThrow(
        "Error retrieving medication record"
      );
    });
  });

  describe("insertMedicationRecord", () => {
    it("should insert and return new medication record", async () => {
      const input = { pet_id: "p1", medication: "Y" };
      const mockResult = { id: "m2", ...input };
      (MedicationRecordsService.insertMedicationRecord as jest.Mock).mockResolvedValue(mockResult);

      const result = await MedicationRecordsController.insertMedicationRecord(input);
      expect(result).toEqual(mockResult);
    });

    it("should throw error on failure", async () => {
      (MedicationRecordsService.insertMedicationRecord as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(MedicationRecordsController.insertMedicationRecord({})).rejects.toThrow(
        "Error inserting medication record"
      );
    });
  });
});
