import PetsService from "../../../src/routes/pets/pets.service";
import { sequelize } from "../../../src/db";
import { Model } from "sequelize";

const mockPetsModel = sequelize.models.PETS;

jest.mock("../../../src/db", () => ({
  sequelize: {
    models: {
      PETS: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
      },
    },
  },
}));

describe("PetsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * ✅ Test getPets() method
   * - Should retrieve all pets from the database.
   */
  it("should retrieve all pets", async () => {
    const mockPets = [
      { id: 1, name: "Fluffy", type: "Cat", age: 3, vaccinated: true },
      { id: 2, name: "Buddy", type: "Dog", age: 5, vaccinated: false },
    ];
    (mockPetsModel.findAll as jest.Mock).mockResolvedValue(mockPets);

    const pets = await PetsService.getPets();

    expect(pets).toEqual(mockPets);
    expect(mockPetsModel.findAll).toHaveBeenCalledTimes(1);
  });

  /**
   * ✅ Test getPetById() method
   * - Should retrieve a pet by ID from the database.
   */
  it("should retrieve a pet by ID", async () => {
    const mockPet = { id: 1, name: "Fluffy", type: "Cat", age: 3, vaccinated: true };
    (mockPetsModel.findOne as jest.Mock).mockResolvedValue(mockPet);

    const pet = await PetsService.retrievePet("1");

    expect(pet).toEqual(mockPet);
    expect(mockPetsModel.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(mockPetsModel.findOne).toHaveBeenCalledTimes(1);
  });

  /**
   * ✅ Test createPet() method
   * - Should create a new pet in the database.
   */
  it("should create a new pet", async () => {
    const newPet = { name: "Fluffy", type: "Cat", age: 3, vaccinated: true };
    const createdPet = { id: 1, ...newPet };
    (mockPetsModel.create as jest.Mock).mockResolvedValue(createdPet);

    const pet = await PetsService.insertPet(newPet);

    expect(pet).toEqual(createdPet);
    expect(mockPetsModel.create).toHaveBeenCalledWith(newPet);
    expect(mockPetsModel.create).toHaveBeenCalledTimes(1);
  });
});