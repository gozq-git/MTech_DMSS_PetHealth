"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const { DataTypes } = require('sequelize');
exports.users = {
    name: 'USERS',
    model: {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        account_name: { type: DataTypes.STRING, unique: true },
        display_name: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING, unique: true },
        last_active: { type: DataTypes.STRING },
        account_created: { type: DataTypes.STRING },
        bio: { type: DataTypes.TEXT },
        profile_picture: { type: DataTypes.STRING },
    },
    options: {
        freezeTableName: true,
        timestamps: false,
    },
    associate: (models) => {
        models.USERS.hasOne(models.VETS, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    }
};
