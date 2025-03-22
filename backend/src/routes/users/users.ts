import express, {Request, Response} from 'express';
import UsersController from "./users.controller";

const logger = require('../../utils/logger');
export const users = express.Router();

/**
 * @swagger
 *
 * /users/retrieveUser:
 *   get:
 *    summary: Retrieve the current user's profile.
 *    tags:
 *      - users
 *    description: Retrieves the user profile based on the preferred_username extracted from the Azure access token.
 *    responses:
 *      200:
 *        description: User details with success or error status.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  enum: [success, error]
 *                  description: Status of the request.
 *                  example: success
 *                message:
 *                  oneOf:
 *                    - type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          description: The user ID.
 *                          example: "1f005b07-46cb-6670-85cc-854ff2948567"
 *                        account_name:
 *                          type: string
 *                          description: The user's account name (matches preferred_username).
 *                          example: "xueyang"
 *                        display_name:
 *                          type: string
 *                          description: The user's display name.
 *                          example: "xueyang"
 *                        email:
 *                          type: string
 *                          description: The user's email address.
 *                          example: "pangxueyang@gmail.com"
 *                        last_active:
 *                          type: string
 *                          format: date-time
 *                          description: Last active timestamp.
 *                          example: "2025-03-20 17:26:27"
 *                        account_created:
 *                          type: string
 *                          format: date-time
 *                          description: Account creation timestamp.
 *                          example: "2025-03-20 17:26:27"
 *                        bio:
 *                          type: string
 *                          description: User's biography.
 *                          example: "kiyo's owner"
 *                        profile_picture:
 *                          type: string
 *                          description: URL or hash of profile picture.
 *                          example: ""
 *                        VET:
 *                          type: object
 *                          nullable: true
 *                          description: Veterinarian details if the user is a vet.
 *                          example: null
 *                    - type: string
 *                      description: Error message when user is not found.
 *                      example: "User not found"
 */
users.get('/retrieveUser', async (req: Request, res: Response): Promise<void> => {
    const userInfo = req.headers.userInfo as any;
    try {
        const result: any = await UsersController.retrieveUser(userInfo?.preferred_username);
        if (result === null || result === undefined || result.length === 0) {
            res.status(200).type('text').send({status: 'error', message: 'User not found'});
        } else {
            res.status(200).type('json').send({status: 'success', message: result});
        }
    } catch (error) {
        logger.error(error);
        res.status(200).type('text').send({status: 'error', message: error});
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
        const result = await UsersController.registerUser({
            email: userInfo.preferred_username, ...req.body
        });
        res.status(200).type('text').send(result);
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
 *     summary: Update a user profile.
 *     tags:
 *       - users
 *     description: Update an existing user's profile information. The user is identified by the preferred_username in the access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_name:
 *                 type: string
 *                 description: The user's account name.
 *               display_name:
 *                 type: string
 *                 description: The user's display name.
 *               bio:
 *                 type: string
 *                 description: User's biography.
 *               profile_picture:
 *                 type: string
 *                 description: URL or hash of profile picture.
 *           example:
 *             account_name: username123
 *             display_name: John Doe
 *             bio: Pet lover and outdoor enthusiast
 *             profile_picture: profile_image_hash
 *     responses:
 *       200:
 *         description: Update result with affected rows information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success, error]
 *                   description: The status of the update operation.
 *                   example: success
 *                 message:
 *                   type: object
 *                   properties:
 *                     affectedCount:
 *                       type: integer
 *                       description: Number of rows affected by the update.
 *                       example: 1
 *                     updatedUser:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: The user ID.
 *                           example: "1f005b07-46cb-6670-85cc-854ff2948567"
 *                         account_name:
 *                           type: string
 *                           description: The user's account name.
 *                           example: "username123"
 *                         display_name:
 *                           type: string
 *                           description: The user's display name.
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           description: The user's email address.
 *                           example: "john.doe@example.com"
 *                         last_active:
 *                           type: string
 *                           format: date-time
 *                           description: Last active timestamp.
 *                           example: "2025-03-20 17:26:27"
 *                         account_created:
 *                           type: string
 *                           format: date-time
 *                           description: Account creation timestamp.
 *                           example: "2025-03-20 17:26:27"
 *                         bio:
 *                           type: string
 *                           description: User's biography.
 *                           example: "Pet lover and outdoor enthusiast"
 *                         profile_picture:
 *                           type: string
 *                           description: URL or hash of profile picture.
 *                     message:
 *                       type: string
 *                       description: Human-readable success message.
 *                       example: "Successfully updated 1 user"
 */
users.post('/updateUser', async (req: Request, res: Response): Promise<void> => {
    logger.info(req.headers.userInfo);
    logger.info(req.body);
    const userInfo = req.headers.userInfo as any;
    try {
        const result = await UsersController.updateUser({preferred_username: userInfo.preferred_username, ...req.body});
        if (result === null || result === undefined) {
            res.status(200).type('json').send({status: 'error', message: 'User failed to update'});
        } else {
            const [affectedCount, affectedRows] = result;
            res.status(200).type('json').send({
                status: 'success',
                message: {
                    affectedCount: affectedCount,
                    updatedUser: affectedRows,
                    message: `Successfully updated ${affectedCount} user`
                }
            });
        }
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
        res.status(200).type('text').send();
    } catch (error: any) {
        logger.error(error);
        res.status(500).send(error.message);
    }
});

