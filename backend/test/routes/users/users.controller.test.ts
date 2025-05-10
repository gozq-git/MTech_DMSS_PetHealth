import UsersController from '../../../src/routes/users/users.controller';
import UsersService from '../../../src/routes/users/users.service';
import { ZohomailNotification } from '../../../src/models/notification/zohomail_notification';
import { emailTemplates } from '../../../src/models/email_template/templates';

jest.mock('../../../src/routes/users/users.service');
jest.mock('../../../src/models/notification/zohomail_notification');
jest.mock('../../../src/models/email_template/templates');

describe('UsersController', () => {
  const mockUser = {
    id: 'mock-id',
    account_name: 'testuser',
    email: 'test@mail.com',
    display_name: 'Test User',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('retrieveUser', () => {
    it('should retrieve a user by preferred_username', async () => {
      (UsersService.retrieveUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await UsersController.retrieveUser('test@mail.com');

      expect(UsersService.retrieveUser).toHaveBeenCalledWith('test@mail.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if retrieval fails', async () => {
      const mockError = new Error('Error retrieving user');
      (UsersService.retrieveUser as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersController.retrieveUser('test@mail.com')).rejects.toThrow('Error retrieving user');
    });
  });

  describe('registerUser', () => {
    it('should register a user and send a welcome email', async () => {
      const mockEmailTemplate = { subject: 'Welcome', body: 'Welcome to our platform!' };
      (UsersService.registerUser as jest.Mock).mockResolvedValue(mockUser);
      (emailTemplates.welcomeEmailTemplate as jest.Mock).mockReturnValue(mockEmailTemplate);
      const mockSendEmail = jest.fn();
      (ZohomailNotification as jest.Mock).mockImplementation(() => ({
        sendEmail: mockSendEmail,
      }));

      const result = await UsersController.registerUser(mockUser);

      expect(UsersService.registerUser).toHaveBeenCalledWith(mockUser);
      expect(emailTemplates.welcomeEmailTemplate).toHaveBeenCalledWith(mockUser.email, mockUser.display_name);
      expect(ZohomailNotification).toHaveBeenCalledWith(mockUser.email, mockEmailTemplate.subject, mockEmailTemplate.body);
      expect(mockSendEmail).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if registration fails', async () => {
      const mockError = new Error('Error registering user');
      (UsersService.registerUser as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersController.registerUser(mockUser)).rejects.toThrow('Error registering user');
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      (UsersService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await UsersController.updateUser(mockUser);

      expect(UsersService.updateUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if update fails', async () => {
      const mockError = new Error('Error updating user');
      (UsersService.updateUser as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersController.updateUser(mockUser)).rejects.toThrow('Error updating user');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by account_name', async () => {
      (UsersService.deleteUser as jest.Mock).mockResolvedValue(1);

      const result = await UsersController.deleteUser('testuser');

      expect(UsersService.deleteUser).toHaveBeenCalledWith('testuser');
      expect(result).toBe(1);
    });

    it('should throw an error if deletion fails', async () => {
      const mockError = new Error('Error deleting user');
      (UsersService.deleteUser as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersController.deleteUser('testuser')).rejects.toThrow('Error deleting user');
    });
  });
});