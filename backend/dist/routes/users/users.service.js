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
    retrieveUser: (preferred_username) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield models.USERS.findOne({
            where: {
                email: preferred_username,
            },
            include: [
                {
                    model: models.VETS
                }
            ]
        });
        return user;
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
            // Update the user record first
            const updatedResult = yield models.USERS.update({
                account_name: user.account_name,
                email: user.preferred_username,
                last_active: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                bio: user.bio,
                profile_picture: user.profile_picture,
                display_name: user.display_name,
            }, {
                where: {
                    email: user.preferred_username,
                },
                returning: true, // returns an array: [affectedCount, affectedRows]
            });
            // Get the updated user's id (assuming one row was updated)
            const updatedUser = updatedResult[1][0];
            const userId = updatedUser.get('id');
            // If vet-related fields are provided, update or create the vet record
            if (user.vet_license || user.vet_center || user.vet_phone || user.display_name) {
                const vetData = {
                    id: userId, // same as user id
                    vet_license: user.vet_license,
                    vet_center: user.vet_center,
                    vet_phone: user.vet_phone,
                    vet_name: user.display_name,
                };
                // Check if a vet record already exists for this user
                const existingVet = yield models.VETS.findOne({ where: { id: userId } });
                if (existingVet) {
                    // Update the existing vet record
                    yield models.VETS.update(vetData, { where: { id: userId } });
                }
                else {
                    // Create a new vet record
                    yield models.VETS.create(vetData);
                }
            }
            return updatedResult;
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
