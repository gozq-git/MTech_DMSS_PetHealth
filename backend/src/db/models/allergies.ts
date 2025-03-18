const { DataTypes } = require('sequelize');

export const allergies = {
    name: 'ALLERGIES',
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
        allergy_name: { type: DataTypes.STRING, allowNull: false },
        severity: { type: DataTypes.ENUM('Mild', 'Moderate', 'Severe'), allowNull: false },
        first_observed: { type: DataTypes.DATE },
        last_updated: { type: DataTypes.DATE },
        notes: { type: DataTypes.STRING },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    options: {
        freezeTableName: true,
        timestamps: false,
    }
    
    
};


