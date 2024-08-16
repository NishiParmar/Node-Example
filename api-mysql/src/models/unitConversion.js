'use strict'

const { DataTypes } = require('sequelize')
const { UNIT_CONVERSION, UNIT } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const UnitConversion = sequelize.define(getModelName(UNIT_CONVERSION), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        unit_from_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: UNIT,
                },
                key: 'id',
                as: 'unitFrom'
            }
        },
        unit_to_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: UNIT,
                },
                key: 'id',
                as: 'unitTo',
            }
        },
        multiplier: DataTypes.DECIMAL(20, 5)
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: UNIT_CONVERSION,
    })

    UnitConversion.associate = function (models) {
        UnitConversion.belongsTo(models.unit, {
            foreignKey: 'unit_from_id',
            as: 'unitFrom',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        UnitConversion.belongsTo(models.unit, {
            foreignKey: 'unit_to_id',
            as: 'unitTo',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return UnitConversion
}