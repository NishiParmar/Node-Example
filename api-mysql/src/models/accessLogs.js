'use strict'
const getModelName = require('../utils/getModelName')
const { DataTypes } = require('sequelize')
const { ACCESS_LOGS } = require('../utils/constants')

module.exports = (sequelize) => {
    const AccessLogs = sequelize.define(getModelName(ACCESS_LOGS), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: true
        },
        endpoint: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING
        },
        params: {
            type: DataTypes.JSON
        },
        body: {
            type: DataTypes.JSON
        }
    }, {
        timestamps: true,
        updatedAt: false,
        underscored: true,
        tableName: ACCESS_LOGS,
    })

    AccessLogs.associate = function (models) { }

    return AccessLogs
}