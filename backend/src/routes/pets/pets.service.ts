import { sequelize } from "../../db";
import { QueryTypes } from "sequelize";

const models = sequelize.models;

const PetsService = {
  getPets: async () => {
    const pets = await models.PETS.findAll({});
    return pets;
  },
  retrievePet: async (id: string) => {
    const pet = await models.PETS.findOne({
      where: {
        id
      }
    });
    return pet;
  },
  getPetsByOwner: async (ownerId: string) => {
    const pets = await models.PETS.findAll({
      where: {
        owner_id: ownerId
      }
    });
    return pets;
  },
  insertPet: async (petData: any) => {
    const newPet = await models.PETS.create(petData);
    return newPet;
  }
}

export default PetsService;