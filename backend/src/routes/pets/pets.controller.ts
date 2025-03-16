import PetsService from "./pets.service";

const PetsController = {
  getPets: async () => {
    try {
      const pets = await PetsService.getPets();
      return pets;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving pets");
    }
  },
  retrievePet: async (id: string) => {
    try {
      const pet = await PetsService.retrievePet(id);
      return pet;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving pet");
    }
  },
  getPetsByOwner: async (ownerId: string) => {
    try {
      const pets = await PetsService.getPetsByOwner(ownerId);
      return pets;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving pets by owner ID");
    }
  },
  insertPet: async (petData: any) => {
    try {
      const newPet = await PetsService.insertPet(petData);
      return newPet;
    } catch (error) {
      console.error(error);
      throw new Error("Error inserting pet");
    }
  },
};

export default PetsController;