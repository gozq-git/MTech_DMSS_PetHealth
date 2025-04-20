import AllergyController from "../../../src/routes/allergies/allergies.controller";
import AllergyService from "../../../src/routes/allergies/allergies.service";

// Mock the service
jest.mock("../../../src/routes/allergies/allergies.service");

describe("AllergyController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllergiesByPetId", () => {
    it("should return allergies for a pet", async () => {
      const mockData = [{ id: "1", pet_id: "pet123", allergy_name: "Dust" }];
      (AllergyService.getAllergiesByPetId as jest.Mock).mockResolvedValue(mockData);

      const result = await AllergyController.getAllergiesByPetId("pet123");
      expect(result).toEqual(mockData);
      expect(AllergyService.getAllergiesByPetId).toHaveBeenCalledWith("pet123");
    });

    it("should throw error if AllergyService fails", async () => {
      (AllergyService.getAllergiesByPetId as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await expect(AllergyController.getAllergiesByPetId("pet123")).rejects.toThrow(
        "Error retrieving allergies by pet ID"
      );
    });
  });

  describe("insertAllergy", () => {
    it("should insert an allergy", async () => {
      const newAllergy = { pet_id: "pet123", allergy_name: "Pollen" };
      const createdAllergy = { id: "2", ...newAllergy };

      (AllergyService.insertAllergy as jest.Mock).mockResolvedValue(createdAllergy);

      const result = await AllergyController.insertAllergy(newAllergy);
      expect(result).toEqual(createdAllergy);
      expect(AllergyService.insertAllergy).toHaveBeenCalledWith(newAllergy);
    });

    it("should throw error on insert failure", async () => {
      (AllergyService.insertAllergy as jest.Mock).mockRejectedValue(new Error("Insert failed"));

      await expect(
        AllergyController.insertAllergy({ pet_id: "pet123", allergy_name: "Dust" })
      ).rejects.toThrow("Error inserting allergy");
    });
  });

  describe("updateAllergyById", () => {
    it("should update an allergy and return the updated result", async () => {
      const updateData = { allergy_name: "Updated Allergy" };
      const updatedAllergy = { id: "1", pet_id: "pet123", ...updateData };

      (AllergyService.updateAllergyById as jest.Mock).mockResolvedValue(updatedAllergy);

      const result = await AllergyController.updateAllergyById("1", updateData);
      expect(result).toEqual(updatedAllergy);
      expect(AllergyService.updateAllergyById).toHaveBeenCalledWith("1", updateData);
    });

    it("should throw error on update failure", async () => {
      (AllergyService.updateAllergyById as jest.Mock).mockRejectedValue(new Error("Update error"));

      await expect(
        AllergyController.updateAllergyById("1", { allergy_name: "Dust" })
      ).rejects.toThrow("Error updating allergy");
    });
  });
});
