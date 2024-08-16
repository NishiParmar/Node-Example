'use strict'

const { DataTypes } = require('sequelize')
const { EMISSION, BUSINESS, UNIT } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Emission = sequelize.define(getModelName(EMISSION), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        business_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: BUSINESS,
                },
                key: 'id',
            }
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        unit_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: UNIT
                },
                key: 'id',
            }
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: EMISSION,
    })

    Emission.associate = function (models) {
        Emission.hasMany(models.emissionsFactor, {
            foreignKey: 'emission_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Emission
}