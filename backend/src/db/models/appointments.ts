const { DataTypes } = require('sequelize');

export const appointments = {
    name: 'APPOINTMENTS',
    model: {
        id: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true 
        },
        user_id: { 
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'USERS',
                key: 'id'
            },
        },
        vet_id: { 
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'VETS',
                key: 'id'
            },
        },
        appointment_date: { 
            type: DataTypes.DATEONLY, 
            allowNull: false 
        },
        appointment_time: { 
            type: DataTypes.TIME, 
            allowNull: true 
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
            defaultValue: 'pending'
        },
        rejection_reason: { 
            type: DataTypes.STRING, 
            allowNull: true 
        }
    },
    options: {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    associate: (models: any) => {
        models.APPOINTMENTS.belongsTo(models.USERS, { foreignKey: 'user_id' });
        models.APPOINTMENTS.belongsTo(models.VETS, { foreignKey: 'vet_id' });
    }
};

// Add CommonJS export so that require(...) finds the property "appointments"
module.exports = { appointments };
