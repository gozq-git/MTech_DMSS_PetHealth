const { DataTypes } = require('sequelize');

export const pets = {
    name: 'PETS',
    model: {
        ID: { type: DataTypes.STRING, primaryKey: true },
        ACCOUNT_TYPE: { type: DataTypes.STRING },
        LAST_ACTIVE: { type: DataTypes.STRING },
        ACCOUNT_CREATED: { type: DataTypes.STRING },
        BIO: { type: DataTypes.STRING },
        PROFILE_PICTURE: { type: DataTypes.STRING },
        DISPLAY_NAME: { type: DataTypes.STRING },
    },
    options: {
        freezeTableName: true,
        timestamps: false,
    },
};