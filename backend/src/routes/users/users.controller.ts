import UsersService from "./users.service";
const logger = require('../../utils/logger');

const UsersController = {
  retrieveUser: async (preferred_username: string) => {
    try {
      const user = await UsersService.retrieveUser(preferred_username);
      return user;
    } catch (error) {
      logger.error(error);
      throw new Error("Error retrieving user");
    }
  },
  registerUser: async (body: Object) => {
    try {
      const user = await UsersService.registerUser(body);
      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  updateUser: async (body: Object) => {
    try {
      const user = await UsersService.updateUser(body);
      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  deleteUser: async (account_name: string) => {
    try {
      const user = await UsersService.deleteUser(account_name);
      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default UsersController;
