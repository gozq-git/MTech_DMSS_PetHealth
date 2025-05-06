const { DataTypes } = require('sequelize');

export const vets = {
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