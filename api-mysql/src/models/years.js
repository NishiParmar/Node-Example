'use strict'

const { DataTypes } = require('sequelize')
const { YEARS } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Years = sequelize.define(getModelName(YEARS), {
        year_offset: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName: YEARS,
    })
    Years.associate = function (models) { }

    return Years
}