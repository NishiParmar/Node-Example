'use strict'

const { DataTypes } = require('sequelize')
const { ERROR_LOGS } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const AccessLogs = sequelize.define(getModelName(ERROR_LOGS), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        message: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: true,
        updatedAt: false,
        paranoid: true,
        underscored: true,
        tableName: ERROR_LOGS,
    })
    AccessLogs.associate = function (models) {

    }

    return AccessLogs
}