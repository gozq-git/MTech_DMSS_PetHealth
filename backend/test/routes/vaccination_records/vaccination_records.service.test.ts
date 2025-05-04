import VaccinationRecordsService from "../../../src/routes/vaccination_records/vaccination_records.service";
import { sequelize } from "../../../src/db";
import { format } from "date-fns";

const mockVaccinationModel = sequelize.models.VACCINATION_RECORDS;

jest.mock("../../../src/db", () => ({
  sequelize: {
    models: {
      VACCINATION_RECORDS: {
        findAll: jest.fn(),
        create: jest.fn(),
      },
    },
  },
}));

jest.mock("uuid", () => ({
  v6: jest.fn().mockReturnValue("mock-uuid"),
}));

describe("VaccinationRecordsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * ✅ Test getVaccinationRecordsByPetId() method
   * - Should return vaccination records sorted by administered date in descending order.
   */
  it("should retrieve vaccination records by pet ID", async () => {
    const mockRecords = [
      { id: "1", pet_id: "123", name: "Rabies", administered_at: "2023-01-01T00:00:00Z" },
      { id: "2", pet_id: "123", name: "Parvo", administered_at: "2022-01-01T00:00:00Z" },
    ];
    (mockVaccinationModel.findAll as jest.Mock).mockResolvedValue(mockRecords);

    const result = await VaccinationRecordsService.getVaccinationRecordsByPetId("123");

    expect(result).toEqual(mockRecords);
    expect(mockVaccinationModel.findAll).toHaveBeenCalledWith({
      where: { pet_id: "123" },
      order: [["administered_at", "DESC"]],
    });
    expect(mockVaccinationModel.findAll).toHaveBeenCalledTimes(1);
  });

  /**
   * ✅ Test insertVaccinationRecord() method
   * - Should create a new vaccination record with formatted dates and UUID.
   */
  it("should insert a new vaccination record", async () => {
    const mockData = {
      name: "Rabies",
      description: "Annual vaccine",
      administered_at: "2023-01-01T00:00:00Z",
      administered_by: "Dr. Smith",
      lot_number: "ABC123",
      expires_at: "2024-01-01T00:00:00Z",
      next_due_at: "2025-01-01T00:00:00Z",
      is_valid: true,
    };

    const mockCreated = {
      id: "mock-uuid",
      pet_id: "pet123",
      ...mockData,
      created_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      updated_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };

    (mockVaccinationModel.create as jest.Mock).mockResolvedValue(mockCreated);

    const result = await VaccinationRecordsService.insertVaccinationRecord("pet123", mockData);

    expect(result).toEqual(mockCreated);
    expect(mockVaccinationModel.create).toHaveBeenCalledWith(expect.objectContaining({
      id: "mock-uuid",
      pet_id: "pet123",
      name: "Rabies",
      is_valid: true,
    }));
    expect(mockVaccinationModel.create).toHaveBeenCalledTimes(1);
  });
});
