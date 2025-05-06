"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vets = void 0;
const { DataTypes } = require('sequelize');
exports.vets = {
    name: 'VETS',
    model: {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        vet_license: { type: DataTypes.INTEGER },
        vet_center: { type: DataTypes.STRING },
        vet_phone: { type: DataTypes.INTEGER },
        vet_name: { type: DataTypes.STRING },
    },
    options: {
        freezeTableName: true,
        timestamps: false,
    },
};
