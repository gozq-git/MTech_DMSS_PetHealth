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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../db");
const uuid_1 = require("uuid");
const logger = require('../../utils/logger');
const date_fns_1 = require("date-fns");
const models = db_1.sequelize.models;
const UsersServices = {
    retrieveUser: (account_name) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield models.USERS.findOne({
            where: {
                account_name
            },
            include: [
                {
                    model: models.VETS
                }
            ]
        });
        return users;
    }),
    registerUser: (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newUser = yield models.USERS.create({
                id: (0, uuid_1.v6)(),
                account_name: user.account_name,
                email: user.email,
                last_active: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                account_created: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                bio: user.bio,
                profile_picture: user.profile_picture,
                display_name: user.display_name,
            });
            return newUser;
        }
        catch (error) {
            logger.error(error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error("User already exists");
            }
            throw new Error("Error registering user");
        }
    }),
    updateUser: (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield models.USERS.update({
                email: user.email,
                account_type: user.account_type,
                last_active: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                bio: user.bio,
                profile_picture: user.profile_picture,
                display_name: user.display_name,
            }, {
                where: {
                    ID: user.id
                }
            });
            return updatedUser;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error updating user");
        }
    }),
    deleteUser: (account_name) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deleted = yield models.USERS.destroy({
                where: {
                    account_name
                }
            });
            return deleted;
        }
        catch (error) {
            logger.error(error);
            throw new Error("Error updating user");
        }
    })
};
exports.default = UsersServices;
