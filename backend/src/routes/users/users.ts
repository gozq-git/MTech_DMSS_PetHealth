import express, { Request, Response } from 'express';
import UsersController from "./users.controller";
const logger = require('../../utils/logger');
export const users = express.Router();

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
users.get('/retrieveUser', async (req: Request, res: Response): Promise<void> => {
    // res.send(`Retrieving user ${req.params.id}`);
    const userInfo = req.headers.userInfo as any;
    try {
      const result = await UsersController.retrieveUser(userInfo?.preferred_username);
      res.status(200).send(result);
    } catch (error) {
      logger.error(error);
      throw new Error("Error retrieving users");
    }
});

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
users.post('/registerUser', async (req: Request, res: Response): Promise<void> => {
  logger.info(req.headers.userInfo);
  logger.info(req.body);
  const userInfo = req.headers.userInfo as any;
  try {
    const result = await UsersController.registerUser({account_name: userInfo.preferred_username, ...req.body});
    res.status(200).send(result);
  } catch (error: any) {
    logger.error(error);
    res.status(200).send(error.message);
  }
});

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
users.post('/updateUser', async (req: Request, res: Response): Promise<void> => {
  logger.info(req.headers.userInfo);
  logger.info(req.body);
  const userInfo = req.headers.userInfo as any;
  try {
    const result = await UsersController.updateUser({account_name: userInfo.preferred_username, ...req.body});
    res.status(200).send(result);
  } catch (error: any) {
    logger.error(error);
    res.status(200).send(error.message);
  }
});

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
users.delete('/deleteUser', async (req: Request, res: Response): Promise<void> => {
  logger.info(req.headers.userInfo);
  logger.info(req.body);
  const userInfo = req.headers.userInfo as any;
  try {
    const result = await UsersController.deleteUser(userInfo?.preferred_username);
    res.status(200).send();
  } catch (error: any) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

