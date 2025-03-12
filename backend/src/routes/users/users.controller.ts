import UsersService from "./users.service";
const logger = require('../../utils/logger');

const UsersController = {
  retrieveUser: async (account_name: string) => {
    try {
      const users = await UsersService.retrieveUser(account_name);
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
  deleteUser: async (account_name: string) => {
    try {
      const users = await UsersService.deleteUser(account_name);
      return users;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default UsersController;
