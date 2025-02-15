"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const express_1 = __importDefault(require("express"));
exports.users = express_1.default.Router();
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
exports.users.get('/retrieveUser/:id', (req, res) => {
    console.log(req.params.id);
    res.send(`Retrieving user ${req.params.id}`);
});
