import request from 'supertest';
import express from 'express';
import {users} from '../../../src/routes/users/users';
import UsersController from "../../../src/routes/users/users.controller";

jest.mock('../../../src/routes/users/users.controller');
const verifyJWTMmock = ((req: any, res: any, next: any) => {
  req.headers.userInfo = { preferred_username: 'xueyang' };
  next();
});
const app = express();
app.use(express.json());
app.use(verifyJWTMmock)
app.use('/users', users);


describe('Users Routes', () => {
  describe('GET /users/retrieveUser', () => {
    it('should return user details when user is found', async () => {
      const mockUser = {
        id: '1f005b07-46cb-6670-85cc-854ff2948567',
        account_name: 'xueyang',
        display_name: 'xueyang',
        email: 'pangxueyang@gmail.com',
        last_active: '2025-03-20 17:26:27',
        account_created: '2025-03-20 17:26:27',
        bio: "kiyo's owner",
        profile_picture: '',
        VET: null,
      };

      (UsersController.retrieveUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/users/retrieveUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'xueyang' }));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'success', message: mockUser });
    });

    it('should return error when user is not found', async () => {
      (UsersController.retrieveUser as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/users/retrieveUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'unknown_user' }));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'error', message: 'User not found' });
    });
  });

  describe('POST /users/registerUser', () => {
    it('should register a user successfully', async () => {
      const mockResult = 'User registered successfully';
      (UsersController.registerUser as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/users/registerUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'test@mail.com' }))
        .send({
          account_type: 'pet_owner',
          bio: 'Lorem Ipsum',
          profile_picture: 'hash',
          display_name: 'testuser',
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe(mockResult);
    });

    it('should return error when registration fails', async () => {
      const mockError = new Error('Registration failed');
      (UsersController.registerUser as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app)
        .post('/users/registerUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'test@mail.com' }))
        .send({
          account_type: 'pet_owner',
          bio: 'Lorem Ipsum',
          profile_picture: 'hash',
          display_name: 'testuser',
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe(mockError.message);
    });
  });

  describe('POST /users/updateUser', () => {
    it('should update user profile successfully', async () => {
      const mockResult = [1, { id: '1f005b07-46cb-6670-85cc-854ff2948567', account_name: 'username123' }];
      (UsersController.updateUser as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/users/updateUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'username123' }))
        .send({
          account_name: 'username123',
          display_name: 'John Doe',
          bio: 'Pet lover and outdoor enthusiast',
          profile_picture: 'profile_image_hash',
        });

      expect(response.status).toBe(200);
    });

    it('should return error when update fails', async () => {
      const mockError = new Error('Update failed');
      (UsersController.updateUser as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app)
        .post('/users/updateUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'username123' }))
        .send({
          account_name: 'username123',
          display_name: 'John Doe',
          bio: 'Pet lover and outdoor enthusiast',
          profile_picture: 'profile_image_hash',
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('error');
    });
  });

  describe('DELETE /users/deleteUser', () => {
    it('should delete user successfully', async () => {
      (UsersController.deleteUser as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .delete('/users/deleteUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'username123' }));

      expect(response.status).toBe(200);
    });

    it('should return error when deletion fails', async () => {
      const mockError = new Error('Deletion failed');
      (UsersController.deleteUser as jest.Mock).mockRejectedValue(mockError);

      const response = await request(app)
        .delete('/users/deleteUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'username123' }));

      expect(response.status).toBe(500);
      expect(response.text).toBe(mockError.message);
    });
  });
});