'use strict'

const { DataTypes } = require('sequelize')
const { ROLE, CONTACT } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Role = sequelize.define(getModelName(ROLE), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        contact_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: CONTACT,
                },
                key: 'id',
            }
        },
        table: DataTypes.STRING,
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        name: DataTypes.STRING,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: ROLE,
    })

    Role.associate = function (models) { }

    return Role
}