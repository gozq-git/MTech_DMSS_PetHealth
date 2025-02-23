const { DataTypes } = require('sequelize');

export const pet_owners = {
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