'use strict'

const { DataTypes } = require('sequelize')
const { EMISSIONS_FACTOR, LOCATION, EMISSION } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const EmissionsFactor = sequelize.define(getModelName(EMISSIONS_FACTOR), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        emission_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: EMISSION
                },
                key: 'id',
            }
        },
        scope1: DataTypes.DECIMAL(20, 5),
        scope2: DataTypes.DECIMAL(20, 5),
        scope3: DataTypes.DECIMAL(20, 5),
        reference_desc: DataTypes.STRING,
        location_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: LOCATION,
                },
                key: 'id',
            }
        },
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: EMISSIONS_FACTOR,
    })

    EmissionsFactor.associate = function (models) {
        EmissionsFactor.belongsTo(models.emission, {
            foreignKey: 'emission_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return EmissionsFactor
}