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
const users_service_1 = __importDefault(require("./users.service"));
const logger = require('../../utils/logger');
const UsersController = {
    getUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield users_service_1.default.getUsers();
            return users;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error retrieving users");
        }
    }),
    retrieveUser: (ID) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield users_service_1.default.retrieveUser(ID);
            return users;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error retrieving user");
        }
    }),
    registerUser: (body) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield users_service_1.default.registerUser(body);
            return users;
        }
        catch (error) {
            logger.error(error);
            throw error;
        }
    }),
    updateUser: (body) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield users_service_1.default.updateUser(body);
            return users;
        }
        catch (error) {
            logger.error(error);
            throw error;
        }
    }),
};
exports.default = UsersController;
