'use strict'

const { DataTypes } = require('sequelize')
const { UNIT } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Unit = sequelize.define(getModelName(UNIT), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        is_base: DataTypes.BOOLEAN
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: UNIT,
    })

    Unit.associate = function (models) {
        Unit.hasMany(models.resource, { onDelete: 'CASCADE' })
        Unit.hasMany(models.unitConversion, { foreignKey: 'unit_from_id', onDelete: 'CASCADE', as: 'unitFrom' })
        Unit.hasMany(models.unitConversion, { foreignKey: 'unit_to_id', onDelete: 'CASCADE', as: 'unitTo' })
    }

    return Unit
}