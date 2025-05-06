import PetsService from "../../../src/routes/pets/pets.service";
import { sequelize } from "../../../src/db";

// Mock the PETS model from sequelize
const mockPetsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

// Override sequelize mock with mocked PETS model
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

  it("should retrieve all pets", async () => {
    const mockPets = [
      { id: 1, name: "Fluffy", type: "Cat", age: 3, vaccinated: true },
      { id: 2, name: "Buddy", type: "Dog", age: 5, vaccinated: false },
    ];

    (sequelize.models.PETS.findAll as jest.Mock).mockResolvedValue(mockPets);

    const pets = await PetsService.getPets();

    expect(pets).toEqual(mockPets);
    expect(sequelize.models.PETS.findAll).toHaveBeenCalledTimes(1);
  });

  it("should retrieve a pet by ID", async () => {
    const mockPet = { id: 1, name: "Fluffy", type: "Cat", age: 3, vaccinated: true };

    (sequelize.models.PETS.findOne as jest.Mock).mockResolvedValue(mockPet);

    const pet = await PetsService.retrievePet("1");

    expect(pet).toEqual(mockPet);
    expect(sequelize.models.PETS.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(sequelize.models.PETS.findOne).toHaveBeenCalledTimes(1);
  });

  it("should create a new pet", async () => {
    const newPet = { name: "Fluffy", type: "Cat", age: 3, vaccinated: true };
  
    const fullPayload = {
      id: expect.any(String),
      name: "Fluffy",
      owner_id: "",
      gender: "",
      species: "",
      breed: "",
      date_of_birth: null,
      weight: null,
      height_cm: null,
      length_cm: null,
      neck_girth_cm: null,
      chest_girth_cm: null,
      last_measured: null,
      is_neutered: false,
      microchip_number: "",
      photo_url: "",
      created_at: expect.any(String),
      updated_at: expect.any(String),
      is_deleted: false,
      account_type: null,
      last_active: null,
      account_created: null,
      bio: null,
      profile_picture: null,
      display_name: null,
    };
  
    const createdPet = { ...fullPayload, id: 'mock-id', created_at: 'mock-time', updated_at: 'mock-time' };
  
    (sequelize.models.PETS.create as jest.Mock).mockResolvedValue(createdPet);
  
    const pet = await PetsService.insertPet(newPet);
  
    expect(pet).toEqual(createdPet);
    expect(sequelize.models.PETS.create).toHaveBeenCalledWith(expect.objectContaining({
      ...fullPayload,
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    }));
  });
  
  
});
