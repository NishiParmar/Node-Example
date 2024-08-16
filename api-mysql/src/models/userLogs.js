'use strict'

const { DataTypes } = require('sequelize')
const { USER_LOGS } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const UserLogs = sequelize.define(getModelName(USER_LOGS), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        login_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        paranoid: true,
        updatedAt: false,
        underscored: true,
        tableName: USER_LOGS,
    })
    UserLogs.associate = function (models) {

    }

    return UserLogs
}