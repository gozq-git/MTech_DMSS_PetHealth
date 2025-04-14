import UsersService from "./users.service";
const logger = require('../../utils/logger');
import { ZohomailNotification } from "../../models/notification/zohomail_notification";
import { emailTemplates } from "../../models/email_template/templates";
const notification = new ZohomailNotification();

const UsersController = {
  retrieveUser: async (preferred_username: string) => {
    try {
      const user: any = await UsersService.retrieveUser(preferred_username);
      return user;
    } catch (error) {
      logger.error(error);
      throw new Error("Error retrieving user");
    }
  },
  registerUser: async (body: Object) => {
    try {
      const user: any = await UsersService.registerUser(body);
      const emailTemplate = emailTemplates.welcomeEmailTemplate(user.email, user.display_name);
      notification.sendEmail(user.email, emailTemplate.subject, emailTemplate.body);
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
