"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("./users.controller"));
const logger = require('../../utils/logger');
exports.users = express_1.default.Router();
/**
  * @swagger
  *
  * /users/retrieveUser:
  *   get:
  *    summary: Retrieve a single JSONPlaceholder user.
  *    tags:
  *      - users
  *    description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
  *    responses:
  *      200:
  *        description: Logged in user details.
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                data:
  *                  type: array
  *                  items:
  *                    type: object
  *                    properties:
  *                      id:
  *                        type: string
  *                        description: The user ID.
  *                        example: 0
  *                      name:
  *                        type: string
  *                        description: The user's name.
  *                        example: Leanne Bob
  */
exports.users.get('/retrieveUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.headers.users);
    // res.send(`Retrieving user ${req.params.id}`);
    const userInfo = req.headers.userInfo;
    try {
        const result = yield users_controller_1.default.retrieveUser(userInfo === null || userInfo === void 0 ? void 0 : userInfo.preferred_username);
        res.status(200).type('text').send(result);
    }
    catch (error) {
        logger.error(error);
        throw new Error("Error retrieving users");
    }
}));
/**
  * @swagger
  *
  * /users/getUsers:
  *   get:
  *    summary: Retrieve an array of users.
  *    tags:
  *      - users
  *    description: Retrieve an array of users
  *    responses:
  *      200:
  *        description: A list of users.
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *              properties:
  *                data:
  *                  type: array
  *                  items:
  *                    type: object
  *                    properties:
  *                      id:
  *                        type: integer
  *                        description: The user ID.
  *                        example: 0
  *                      name:
  *                        type: string
  *                        description: The user's name.
  *                        example: Leanne Graham
  */
exports.users.get('/getUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    // res.send(`Retrieving user ${req.params.id}`);
    try {
        const result = yield users_controller_1.default.getUsers();
        res.status(200).type('text').send(result);
    }
    catch (error) {
        logger.error(error);
        throw new Error("Error retrieving users");
    }
}));
/**
  * @swagger
  *
  * /users/registerUser:
  *   post:
  *     summary: Register a user.
  *     tags:
  *       - users
  *     description: Register a user
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           example:
  *             email: test@mail.com
  *             account_type: pet_owner
  *             bio: Loerm Ipsum
  *             profile_picture: hash
  *             display_name: testuser
  *     responses:
  *       200:
  *         description: A list of users.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *               data:
  *                 type: objcet
  *                 properties:
  *                   id:
  *                     type: integer
  *                     description: The user ID.
  *                     example: 0
  *                   name:
  *                     type: string
  *                     description: The user's name.
  *                     example: Leanne Graham
  */
exports.users.post('/registerUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(req.headers.userInfo);
    logger.info(req.body);
    const userInfo = req.headers.userInfo;
    try {
        const result = yield users_controller_1.default.registerUser(Object.assign({ id: userInfo.preferred_username }, req.body));
        res.status(200).type('text').send(result);
    }
    catch (error) {
        logger.error(error);
        res.status(200).send(error.message);
    }
}));
/**
  * @swagger
  *
  * /users/updateUser:
  *   post:
  *     summary: Register a user.
  *     tags:
  *       - users
  *     description: Register a user
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           example:
  *             email: test@mail.com
  *             account_type: pet_owner
  *             bio: Loerm Ipsum
  *             profile_picture: hash
  *             display_name: testuser
  *     responses:
  *       200:
  *         description: A list of users.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *               data:
  *                 type: objcet
  *                 properties:
  *                   id:
  *                     type: integer
  *                     description: The user ID.
  *                     example: 0
  *                   name:
  *                     type: string
  *                     description: The user's name.
  *                     example: Leanne Graham
  */
exports.users.post('/updateUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(req.headers.userInfo);
    logger.info(req.body);
    const userInfo = req.headers.userInfo;
    try {
        const result = yield users_controller_1.default.updateUser(Object.assign({ id: userInfo.preferred_username }, req.body));
        res.status(200).type('text').send(result);
    }
    catch (error) {
        logger.error(error);
        res.status(200).send(error.message);
    }
}));
