"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medication_records = void 0;
const { DataTypes } = require('sequelize');
exports.medication_records = {
    name: 'MEDICATION_RECORDS',
    model: {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        pet_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'PETS',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        medication_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'MEDICATIONS',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        dosage: { type: DataTypes.STRING },
        frequency: { type: DataTypes.STRING },
        start_date: { type: DataTypes.DATE },
        end_date: { type: DataTypes.DATE },
        prescribed_by: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'VETS',
                key: 'id'
            }
        },
        notes: { type: DataTypes.STRING },
        is_active: { type: DataTypes.BOOLEAN }
    },
    options: {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['pet_id'] },
            { fields: ['medication_id'] }
        ]
    }
};
