const { DataTypes } = require('sequelize');

export const availabilities = {
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
    associate: (models: any) => {
        models.AVAILABILITIES.belongsTo(models.VETS, { foreignKey: 'vet_id' });
    }
};

module.exports = { availabilities };
