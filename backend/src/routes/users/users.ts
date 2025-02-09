import express, { Request, Response } from 'express';

export const users = express.Router();

/**
  * @swagger
  * 
  * /users/retrieveUser/{id}:
  *   get:
  *    summary: Retrieve a single JSONPlaceholder user.
  *    description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
  *    parameters:
  *      - in: path
  *        name: id
  *        required: true
  *        description: Numeric ID of the user to retrieve.
  *        schema:
  *          type: integer
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
users.get('/retrieveUser/:id', (req: Request, res: Response): void => {
    console.log(req.params.id);
    res.send(`Retrieving user ${req.params.id}`);
});
