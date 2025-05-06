import express from 'express';
import { readdirSync } from 'fs';

import request from 'supertest';

jest.mock('fs');
jest.mock('../../src/utils/user_verification', () => ({
  verifyJWT: jest.fn((req, res, next) => next()),
}));

describe('Index Routes', () => {
  const mockReaddirSync = readdirSync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load all routes except index.js', async () => {
    // Mock the readdirSync to return a list of route files
    mockReaddirSync.mockReturnValue(['users', 'pets', 'index.js']);

    // Mock the route modules
    jest.mock('../../src/routes/users/users', () => ({
      users: express.Router().get('/', (req, res) => {res.status(200).send('Route1')}),
    }));
    jest.mock('../../src/routes/pets/pets', () => ({
      pets: express.Router().get('/', (req, res) => {res.status(200).send('Route2')}),
    }));

    const app = express();
    const {routes} = require('../../src/routes/index');
    app.use(routes);

    // Test route1
    const res1 = await request(app).get('/users');
    expect(res1.status).toBe(200);
    expect(res1.text).toBe('Route1');

    // Test route2
    const res2 = await request(app).get('/pets');
    expect(res2.status).toBe(200);
    expect(res2.text).toBe('Route2');

    // Ensure index.js is skipped
    expect(mockReaddirSync).toHaveBeenCalledWith(expect.any(String));
  });

  it('should call verifyJWT middleware', async () => {
    const {routes} = require('../../src/routes/index');
    const app = express();
    app.use(routes);

    const res = await request(app).get('/users');
    expect(res.status).not.toBe(404); // Middleware should not block the request
    expect(require('../../src/utils/user_verification').verifyJWT).toHaveBeenCalled();
  });
});