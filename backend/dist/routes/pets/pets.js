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
exports.pets = void 0;
const express_1 = __importDefault(require("express"));
const pets_controller_1 = __importDefault(require("./pets.controller"));
exports.pets = express_1.default.Router();
/**
  * @swagger
  *
  * /pets/retrievePet/{id}:
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
exports.pets.get('/retrievePet/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    // res.send(`Retrieving user ${req.params.id}`);
    try {
        const result = yield pets_controller_1.default.retrievePet(req.params.id);
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        throw new Error("Error retrieving users");
    }
}));
/**
  * @swagger
  *
  * /users/getUsers:
  *   get:
  *    summary: Retrieve an array of users.
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
exports.pets.get('/getPets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    // res.send(`Retrieving user ${req.params.id}`);
    try {
        const result = yield pets_controller_1.default.getPets();
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        throw new Error("Error retrieving users");
    }
}));
