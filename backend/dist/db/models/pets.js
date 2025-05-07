"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pets = void 0;
const { DataTypes } = require('sequelize');
exports.pets = {
    name: 'PETS',
    model: {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        account_type: { type: DataTypes.STRING },
        last_active: { type: DataTypes.STRING },
        account_created: { type: DataTypes.STRING },
        bio: { type: DataTypes.STRING },
        profile_picture: { type: DataTypes.STRING },
        display_name: { type: DataTypes.STRING },
        owner_id: { type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'USERS',
                key: 'id'
            },
        },
        name: { type: DataTypes.STRING },
        gender: { type: DataTypes.STRING },
        species: { type: DataTypes.STRING },
        breed: { type: DataTypes.STRING },
        date_of_birth: { type: DataTypes.DATE },
        weight: { type: DataTypes.FLOAT },
        height_cm: { type: DataTypes.FLOAT },
        length_cm: { type: DataTypes.FLOAT },
        neck_girth_cm: { type: DataTypes.FLOAT },
        chest_girth_cm: { type: DataTypes.FLOAT },
        last_measured: { type: DataTypes.DATE },
        is_neutered: { type: DataTypes.BOOLEAN },
        microchip_number: { type: DataTypes.STRING },
        photo_url: { type: DataTypes.STRING },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE },
        is_deleted: { type: DataTypes.BOOLEAN },
    },
    options: {
        freezeTableName: true,
        timestamps: false,
    },
};
