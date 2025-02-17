import express from 'express';
import { readdirSync } from "fs";
const resolve = require('path').resolve;
const {verifyJWT} = require('../utils/user_verification');
// const users = require(`./users`)['users'];
// console.log(users);


export const routes = express.Router();
// console.log('verifyJWT');

// console.log(verifyJWT);

routes.use(verifyJWT);

(readdirSync(__dirname)).forEach(routeName => {
  console.log(__dirname,routeName);
  if (routeName === 'index.js') return;
  const route = require(`./${routeName}/${routeName}`)[routeName];
  routes.use(`/${routeName}`, route);
});


