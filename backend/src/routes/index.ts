import express from 'express';
import { users } from './users/users';

export const routes = express.Router();
routes.use('/users', users);

