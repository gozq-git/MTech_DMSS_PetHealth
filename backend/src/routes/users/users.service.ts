import { sequelize } from "../../db";
import { QueryTypes } from "sequelize";

const models = sequelize.models;

const UsersServices = {
  getUsers: async () => {
    const users = await models.USERS.findAll({});
    return users;
  },
  retrieveUser: async (ID: string) => {
    const users = await models.USERS.findOne({
      where: {
        ID
      }
    });
    return users;
  },
  registerUser: async (user: any) => {
    const newUser = await models.USERS.create(user);
    return newUser;
  }
}

export default UsersServices;