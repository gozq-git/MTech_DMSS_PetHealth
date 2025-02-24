import { sequelize } from "../../db";
import { QueryTypes } from "sequelize";
const logger = require('../../utils/logger');
import { format } from 'date-fns';

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
    try {
      const newUser = await models.USERS.create({
        ID: user.id,
        EMAIL: user.email,
        ACCOUNT_TYPE: user.account_type,
        LAST_ACTIVE: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        ACCOUNT_CREATED: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        BIO: user.bio,
        PROFILE_PICTURE: user.profile_picture,
        DISPLAY_NAME: user.display_name,
      });
      
      return newUser;
    } catch (error: any) {
      logger.error(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error("User already exists");
      }
      throw new Error("Error registering user");
    }
  },
  updateUser: async (user: any) => {
    try {
      const updatedUser = await models.USERS.update({
        EMAIL: user.email,
        ACCOUNT_TYPE: user.account_type,
        LAST_ACTIVE: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        BIO: user.bio,
        PROFILE_PICTURE: user.profile_picture,
        DISPLAY_NAME: user.display_name,
      }, {
        where: {
          ID: user.id
        }
    });
      return updatedUser;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error updating user");
    }
  }
}

export default UsersServices;