// ✅ Step 1: Declare mocks FIRST
const mockFindAll = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockFindOne = jest.fn();

// ✅ Step 2: Then mock sequelize
jest.mock("../../../src/db", () => {
  return {
    sequelize: {
      models: {
        ALLERGIES: {
          findAll: mockFindAll,
          create: mockCreate,
          update: mockUpdate,
          findOne: mockFindOne,
        },
      },
    },
  };
});

// ✅ Step 3: Import the service AFTER mock setup
import AllergyService from "../../../src/routes/allergies/allergies.service";

describe("AllergyService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllergiesByPetId", () => {
    it("should return allergies for a given pet ID", async () => {
      const mockAllergies = [{ id: "1", pet_id: "pet1", allergy_name: "Dust" }];
      mockFindAll.mockResolvedValue(mockAllergies);

      const result = await AllergyService.getAllergiesByPetId("pet1");

      expect(mockFindAll).toHaveBeenCalledWith({ where: { pet_id: "pet1" } });
      expect(result).toEqual(mockAllergies);
    });
  });

  describe("insertAllergy", () => {
    it("should insert an allergy and return it", async () => {
      const allergyData = { pet_id: "pet1", allergy_name: "Pollen" };
      const createdAllergy = { id: "2", ...allergyData };

      mockCreate.mockResolvedValue(createdAllergy);

      const result = await AllergyService.insertAllergy(allergyData);

      expect(mockCreate).toHaveBeenCalledWith(allergyData);
      expect(result).toEqual(createdAllergy);
    });
  });

  describe("updateAllergyById", () => {
    it("should update and return the updated allergy if found", async () => {
      const updateData = { allergy_name: "Updated Allergy" };
      const updatedAllergy = { id: "1", pet_id: "pet1", ...updateData };

      mockUpdate.mockResolvedValue([1]); // Sequelize update returns [affectedCount]
      mockFindOne.mockResolvedValue(updatedAllergy);

      const result = await AllergyService.updateAllergyById("1", updateData);

      expect(mockUpdate).toHaveBeenCalledWith(updateData, { where: { id: "1" } });
      expect(mockFindOne).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(result).toEqual(updatedAllergy);
    });

    it("should return null if no rows are updated", async () => {
      mockUpdate.mockResolvedValue([0]);

      const result = await AllergyService.updateAllergyById("1", { allergy_name: "Dust" });

      expect(result).toBeNull();
    });
  });
});
