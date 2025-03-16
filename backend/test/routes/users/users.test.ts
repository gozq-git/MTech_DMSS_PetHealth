import express = require('express');
import request = require('supertest');
const db = require("../../../src/db");
const { format } = require('date-fns');
const users = require('../../../src/routes/users/users')['users'];

function parseUserInfo (req: any, res: any, next: any) {
  console.log('Request URL:', req.originalUrl)
  req.headers.userInfo = JSON.parse(req.headers.userinfo)
  console.log('USERINFO', req.headers.userInfo);
  next()
}

const app = express();
app.use(express.json());
app.use(parseUserInfo);
app.use('/users', users);

describe('Users Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const mockUser = { 
    account_name: 'john_doe',
    email:'john_doe@mail.com',
    last_active: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    account_created: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    bio: 'I am a test user',
    profile_picture: 'I am a test user',
    display_name: 'John Doe',
  };

  describe('POST /users/registerUser', () => {
    it('should register user successfully', async () => {

      const response = await request(app)
        .post('/users/registerUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'john_doe' }))
        .send(mockUser);
      console.log(response.body);
      console.log(response.headers);

      expect(response.status).toBe(200);
    });

    // it('should handle errors', async () => {
    //   const errorMessage = 'Error retrieving users';
    //   UsersController.retrieveUser.mockRejectedValue(new Error(errorMessage));

    //   const response = await request(app)
    //     .get('/users/retrieveUser')
    //     .set('userInfo', JSON.stringify({ preferred_username: 'john_doe' }));

    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ error: errorMessage });
    //   expect(logger.error).toHaveBeenCalledWith(new Error(errorMessage));
    // });
  });

  describe('GET /users/retrieveUser', () => {
    it('should retrieve user successfully', async () => {

      const response = await request(app)
        .get('/users/retrieveUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'john_doe' }));
      console.log(response.body);
      console.log(response.headers);

      expect(response.status).toBe(200);
      // expect(response.body).toEqual({...mockUser, id: 'john_doe', VET: null});
    });

    // it('should handle errors', async () => {
    //   const errorMessage = 'Error retrieving users';
    //   UsersController.retrieveUser.mockRejectedValue(new Error(errorMessage));

    //   const response = await request(app)
    //     .get('/users/retrieveUser')
    //     .set('userInfo', JSON.stringify({ preferred_username: 'john_doe' }));

    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ error: errorMessage });
    //   expect(logger.error).toHaveBeenCalledWith(new Error(errorMessage));
    // });
  });

  describe('POST /users/updateUser', () => {
    it('should update user successfully', async () => {
      mockUser.bio = 'I am an updated test user!';
      const response = await request(app)
        .post('/users/updateUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'john_doe' }))
        .send(mockUser);
      console.log(response.body);
      console.log(response.headers);

      expect(response.status).toBe(200);
    });

    // it('should handle errors', async () => {
    //   const errorMessage = 'Error retrieving users';
    //   UsersController.retrieveUser.mockRejectedValue(new Error(errorMessage));

    //   const response = await request(app)
    //     .get('/users/retrieveUser')
    //     .set('userInfo', JSON.stringify({ preferred_username: 'john_doe' }));

    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ error: errorMessage });
    //   expect(logger.error).toHaveBeenCalledWith(new Error(errorMessage));
    // });
  });

  describe('DELETE /users/registerUser', () => {
    it('should delete user successfully', async () => {

      const response = await request(app)
        .delete('/users/deleteUser')
        .set('userInfo', JSON.stringify({ preferred_username: 'john_doe' }));
      console.log(response.body);
      console.log(response.headers);

      expect(response.status).toBe(200);
    });

    // it('should handle errors', async () => {
    //   const errorMessage = 'Error retrieving users';
    //   UsersController.retrieveUser.mockRejectedValue(new Error(errorMessage));

    //   const response = await request(app)
    //     .get('/users/retrieveUser')
    //     .set('userInfo', JSON.stringify({ preferred_username: 'john_doe' }));

    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ error: errorMessage });
    //   expect(logger.error).toHaveBeenCalledWith(new Error(errorMessage));
    // });
  });
});


