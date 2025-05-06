const { DataTypes } = require('sequelize');

export const vaccination_records = {
    name: 'VACCINATION_RECORDS',
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
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        administered_at: { type: DataTypes.DATE },
        expires_at: { type: DataTypes.DATE },
        lot_number: { type: DataTypes.STRING },
        administered_by: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'VETS',
                key: 'id'
            },
        },
        next_due_at: { type: DataTypes.DATE },
        is_valid: { type: DataTypes.BOOLEAN }
    },
    options: {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['pet_id'] }
        ]
    }
};
