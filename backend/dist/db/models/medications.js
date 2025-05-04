"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medications = void 0;
const { DataTypes } = require('sequelize');
exports.medications = {
    name: 'MEDICATIONS',
    model: {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        requires_prescription: {
            type: DataTypes.BOOLEAN
        }
    },
    options: {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['name'] }
        ]
    }
};
