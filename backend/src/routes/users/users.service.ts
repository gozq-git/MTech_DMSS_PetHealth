import {sequelize} from "../../db";
import {v6 as uuidv6} from "uuid";

const logger = require('../../utils/logger');
import {format} from 'date-fns';

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
                email: user.preferred_username,
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
          // Update the user record first
          const updatedResult = await models.USERS.update(
            {
              account_name: user.account_name,
              email: user.preferred_username,
              last_active: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              bio: user.bio,
              profile_picture: user.profile_picture,
              display_name: user.display_name,
            },
            {
              where: {
                email: user.preferred_username,
              },
              returning: true, // returns an array: [affectedCount, affectedRows]
            }
          );
      
          // Get the updated user's id (assuming one row was updated)
          const updatedUser = updatedResult[1][0];
          const userId = updatedUser.get('id');
      
          // If vet-related fields are provided, update or create the vet record
          if (user.vet_license || user.vet_center || user.vet_phone) {
            const vetData = {
              id: userId, // same as user id
              vet_license: user.vet_license,
              vet_center: user.vet_center,
              vet_phone: user.vet_phone,
            };
      
            // Check if a vet record already exists for this user
            const existingVet = await models.VETS.findOne({ where: { id: userId } });
            if (existingVet) {
              // Update the existing vet record
              await models.VETS.update(vetData, { where: { id: userId } });
            } else {
              // Create a new vet record
              await models.VETS.create(vetData);
            }
          }
      
          return updatedResult;
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