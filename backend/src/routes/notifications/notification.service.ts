import {sequelize} from "../../db";

const logger = require('../../utils/logger');
const models = sequelize.models;

const NotificationServices = {
    getAllEmails: async () => {
        try {
            const users: Array<any> = await models.USERS.findAll({
                attributes: ['email'], // Select only the 'email' column
            });
            return users.map(user => user.email); // Extract and return an array of email addresses
        } catch (error) {
            logger.error("Error retrieving emails from USERS table:", error);
            throw new Error("Failed to retrieve emails");
        }
    },
}

export default NotificationServices;