import AvailabilitiesController from "../../../src/routes/availabilities/availabilities.controller";
import AvailabilitiesService from "../../../src/routes/availabilities/availabilities.service";

// ✅ Mock the service methods
jest.mock("../../../src/routes/availabilities/availabilities.service");

describe("AvailabilitiesController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("markAvailability", () => {
    it("should return result from service", async () => {
      const mockResult = { id: "availability-123", vet_id: "vet-1", available_date: "2025-04-01" };
      (AvailabilitiesService.markAvailability as jest.Mock).mockResolvedValue(mockResult);

      const result = await AvailabilitiesController.markAvailability("vet-1", "2025-04-01");

      expect(result).toEqual(mockResult);
      expect(AvailabilitiesService.markAvailability).toHaveBeenCalledWith("vet-1", "2025-04-01");
    });

    it("should throw error on failure", async () => {
      (AvailabilitiesService.markAvailability as jest.Mock).mockRejectedValue(new Error("Failed"));

      await expect(
        AvailabilitiesController.markAvailability("vet-1", "2025-04-01")
      ).rejects.toThrow("Error marking availability");
    });
  });

  describe("getAvailableVets", () => {
    it("should return available vets from service", async () => {
      const mockResult = [{ vet_id: "vet-1" }];
      (AvailabilitiesService.getAvailableVets as jest.Mock).mockResolvedValue(mockResult);

      const result = await AvailabilitiesController.getAvailableVets("2025-04-01");

      expect(result).toEqual(mockResult);
      expect(AvailabilitiesService.getAvailableVets).toHaveBeenCalledWith("2025-04-01");
    });

    it("should throw error on failure", async () => {
      (AvailabilitiesService.getAvailableVets as jest.Mock).mockRejectedValue(new Error("Oops"));

      await expect(
        AvailabilitiesController.getAvailableVets("2025-04-01")
      ).rejects.toThrow("Error retrieving available vets");
    });
  });

  describe("getAvailabilityForVet", () => {
    it("should return availability dates for vet", async () => {
      const mockDates = ["2025-04-01", "2025-04-03"];
      (AvailabilitiesService.getAvailabilityForVet as jest.Mock).mockResolvedValue(mockDates);

      const result = await AvailabilitiesController.getAvailabilityForVet("vet-1");

      expect(result).toEqual(mockDates);
      expect(AvailabilitiesService.getAvailabilityForVet).toHaveBeenCalledWith("vet-1");
    });

    it("should throw error on failure", async () => {
      (AvailabilitiesService.getAvailabilityForVet as jest.Mock).mockRejectedValue(new Error("Failed"));

      await expect(
        AvailabilitiesController.getAvailabilityForVet("vet-1")
      ).rejects.toThrow("Error retrieving vet availability");
    });
  });
});
