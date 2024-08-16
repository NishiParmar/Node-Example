'use strict'

const { DataTypes } = require('sequelize')
const { LOCATION } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Location = sequelize.define(getModelName(LOCATION), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        postcode: DataTypes.BIGINT,
        location_gps: {
            type: DataTypes.GEOMETRY('POINT'),
        }

    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: LOCATION,
    })
    Location.associate = function (models) {
    }

    return Location
}