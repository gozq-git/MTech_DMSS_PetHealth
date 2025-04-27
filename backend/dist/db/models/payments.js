"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payments = void 0;
const { DataTypes } = require('sequelize');
exports.payments = {
    name: 'PAYMENTS',
    model: {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'USERS',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        payment_system: { type: DataTypes.STRING, allowNull: false },
        payment_id: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false },
        currency: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    options: {
        freezeTableName: true,
        timestamps: false,
    }
};
