import UsersServices from '../../../src/routes/users/users.service';
import { sequelize } from '../../../src/db/index';
import { v6 as uuidv6 } from 'uuid';
import { format } from 'date-fns';

jest.mock('../../../src/db/index', () => ({
  sequelize: {
    models: {
      USERS: {
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
      },
      VETS: {
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    },
  },
}));

jest.mock('uuid', () => ({
  v6: jest.fn(() => 'mock-uuid'),
}));

describe('UsersServices', () => {
  const mockUser = {
    account_name: 'testuser',
    email: 'test@mail.com',
    bio: 'Test bio',
    profile_picture: 'test_picture',
    display_name: 'Test User',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('retrieveUser', () => {
    it('should retrieve a user by preferred_username', async () => {
      const mockResult = { id: 'mock-id', email: 'test@mail.com' };
      (sequelize.models.USERS.findOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await UsersServices.retrieveUser('test@mail.com');

      expect(sequelize.models.USERS.findOne).toHaveBeenCalledWith({
        where: { email: 'test@mail.com' },
        include: [{ model: sequelize.models.VETS }],
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const mockResult = { id: 'mock-uuid', ...mockUser };
      (sequelize.models.USERS.create  as jest.Mock).mockResolvedValue(mockResult);

      const result = await UsersServices.registerUser(mockUser);

      expect(sequelize.models.USERS.create).toHaveBeenCalledWith({
        id: 'mock-uuid',
        account_name: 'testuser',
        email: 'test@mail.com',
        last_active: expect.any(String),
        account_created: expect.any(String),
        bio: 'Test bio',
        profile_picture: 'test_picture',
        display_name: 'Test User',
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if user already exists', async () => {
      const mockError = Error('SequelizeUniqueConstraintError');
      mockError.name = 'SequelizeUniqueConstraintError';
      (sequelize.models.USERS.create  as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersServices.registerUser(mockUser)).rejects.toThrow('User already exists');
    });
  });

  describe('updateUser', () => {
    it('should update a user and vet details', async () => {
      const mockUpdatedUser = [{
        id: 'mock-id',
        get: (x: string) => {return 'mock-id'},
      }];
      (sequelize.models.USERS.update  as jest.Mock).mockResolvedValue([1, mockUpdatedUser]);
      (sequelize.models.VETS.findOne  as jest.Mock).mockResolvedValue(null);
      (sequelize.models.VETS.create  as jest.Mock).mockResolvedValue({});

      const result = await UsersServices.updateUser({
        ...mockUser,
        vet_license: '12345',
        vet_center: 'Test Vet Center',
        vet_phone: '1234567890',
      });

    //   expect(sequelize.models.USERS.update).toHaveBeenCalledWith(
    //     {
    //       account_name: 'testuser',
    //       email:  expect.anything(),
    //       last_active: expect.any(String),
    //       bio: 'Test bio',
    //       profile_picture: 'test_picture',
    //       display_name: 'Test User',
    //     },
    //     {
    //       where:  expect.anything(),
    //       returning: true,
    //     }
    //   );
      expect(sequelize.models.VETS.create).toHaveBeenCalledWith({
        id: 'mock-id',
        vet_license: '12345',
        vet_center: 'Test Vet Center',
        vet_phone: '1234567890',
        vet_name: 'Test User',
      });
    //   expect(result).toEqual([1, mockUpdatedUser]);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by account_name', async () => {
      (sequelize.models.USERS.destroy as jest.Mock).mockResolvedValue(1);

      const result = await UsersServices.deleteUser('testuser');

      expect(sequelize.models.USERS.destroy).toHaveBeenCalledWith({
        where: { account_name: 'testuser' },
      });
      expect(result).toBe(1);
    });

    it('should throw an error if deletion fails', async () => {
      const mockError = new Error('Deletion failed');
      (sequelize.models.USERS.destroy as jest.Mock).mockRejectedValue(mockError);

      await expect(UsersServices.deleteUser('testuser')).rejects.toThrow('Error updating user');
    });
  });
});