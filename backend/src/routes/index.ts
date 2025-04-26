import express from 'express';
import { readdirSync } from "fs";
const {verifyJWT} = require('../utils/user_verification');
export const routes = express.Router();

routes.use(verifyJWT);

(readdirSync(__dirname)).forEach(routeName => {
  if (routeName === 'index.js') return;
  const route = require(`./${routeName}/${routeName}`)[routeName];
  routes.use(`/${routeName}`, route);
});


