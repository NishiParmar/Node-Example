'use strict'

const { DataTypes } = require('sequelize')
const { USER, PERMISSION_GROUP, PERMISSION_USER } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const PermissionUser = sequelize.define(getModelName(PERMISSION_USER), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: USER
                },
                key: 'id'
            }
        },
        permission_group: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: PERMISSION_GROUP
                },
                key: 'id'
            }
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: PERMISSION_USER,
    })
    PermissionUser.associate = function (models) {
        PermissionUser.belongsTo(models.user, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        PermissionUser.belongsTo(models.permissionGroup, {
            foreignKey: 'permission_group',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

    return PermissionUser
}