const { DataTypes } = require('sequelize');

export const users = {
    name: 'USERS',
    model: {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        account_name: { type: DataTypes.STRING, unique: {msg: "Account name is already registered"} },
        display_name: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING, unique: {msg: "Email is already registered"} },
        last_active: { type: DataTypes.STRING },
        account_created: { type: DataTypes.STRING },
        bio: { type: DataTypes.TEXT },
        profile_picture: { type: DataTypes.STRING },
    },
    options: {
        freezeTableName: true,
        timestamps: false,
    },
    associate: (models: any) => {
        models.USERS.hasOne(models.VETS, {
            foreignKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    }
};