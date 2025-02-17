import PetsService from "./pets.service";


const PetsController = {
  getPets: async () => {
    try {
      const pets = await PetsService.getPets();
      return pets;
    } catch (error) {
      console.log(error);
      throw new Error("Error retrieving Pets");
    }
  },
  retrievePet: async (ID: string) => {
    try {
      const pets = await PetsService.retrievePet(ID);
      return pets;
    } catch (error) {
      console.log(error);
      throw new Error("Error retrieving user");
    }
  },
};

export default PetsController;
