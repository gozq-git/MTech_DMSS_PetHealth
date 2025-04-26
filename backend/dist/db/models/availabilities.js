"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilities = void 0;
const { DataTypes } = require('sequelize');
exports.availabilities = {
    name: 'AVAILABILITIES',
    model: {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        vet_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'VETS',
                key: 'id'
            },
        },
        available_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    },
    options: {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    associate: (models) => {
        models.AVAILABILITIES.belongsTo(models.VETS, { foreignKey: 'vet_id' });
    }
};
module.exports = { availabilities: exports.availabilities };
