import { sequelize } from "../../db";
import { v6 as uuidv6 } from "uuid";
const logger = require('../../utils/logger');
import { format } from 'date-fns';

const models = sequelize.models;

const UsersServices = {
  retrieveUser: async (preferred_username: string) => {
    const user = await models.USERS.findOne({
      where: {
        email: preferred_username,
      },
      include: [
        {
          model: models.VETS
        }
      ]
    });
    return user;
  },
  registerUser: async (user: any) => {
    try {
      const newUser = await models.USERS.create({
        id: uuidv6(),
        account_name: user.account_name,
        email: user.email,
        last_active: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        account_created: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        bio: user.bio,
        profile_picture: user.profile_picture,
        display_name: user.display_name,
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
        account_name: user.account_name,
        email: user.email,
        last_active: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        bio: user.bio,
        profile_picture: user.profile_picture,
        display_name: user.display_name,
      }, {
        where: {
          account_name: user.account_name,
        }
    });
      return updatedUser;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error updating user");
    }
  },
  deleteUser: async (account_name: string) => {
    try {
      const deleted = await models.USERS.destroy({
        where: {
          account_name
        }
      });
      return deleted;
    } catch (error: any) {
      logger.error(error);
      throw new Error("Error updating user");
    }
  }
}

export default UsersServices;