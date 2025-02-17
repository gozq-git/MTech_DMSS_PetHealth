import { sequelize } from "../../db";
import { QueryTypes } from "sequelize";

const models = sequelize.models;

const PetsServices = {
  getPets: async () => {
    const users = await models.PETS.findAll({});
    return users;
  },
  retrievePet: async (ID: string) => {
    const users = await models.PETS.findOne({
      where: {
        ID
      }
    });
    return users;
  },
  registerUser: async (user: any) => {
    const newUser = await models.PETS.create(user);
    return newUser;
  }
}

export default PetsServices;