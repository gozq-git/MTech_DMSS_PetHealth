"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pet_owners = void 0;
const { DataTypes } = require('sequelize');
exports.pet_owners = {
    name: 'PET_OWNERS',
    model: {
        ID: { type: DataTypes.STRING, primaryKey: true },
        PET_ID: { type: DataTypes.INTEGER },
    },
    options: {
        freezeTableName: true,
        timestamps: false,
    },
};
