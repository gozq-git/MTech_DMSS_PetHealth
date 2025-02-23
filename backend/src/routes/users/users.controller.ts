import UsersService from "./users.service";
const logger = require('../../utils/logger');

const UsersController = {
  getUsers: async () => {
    try {
      const users = await UsersService.getUsers();
      return users;
    } catch (error) {
      logger.error(error);
      throw new Error("Error retrieving users");
    }
  },
  retrieveUser: async (ID: string) => {
    try {
      const users = await UsersService.retrieveUser(ID);
      return users;
    } catch (error) {
      logger.error(error);
      throw new Error("Error retrieving user");
    }
  },
  registerUser: async (body: Object) => {
    try {
      const users = await UsersService.registerUser(body);
      return users;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  updateUser: async (body: Object) => {
    try {
      const users = await UsersService.updateUser(body);
      return users;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default UsersController;
