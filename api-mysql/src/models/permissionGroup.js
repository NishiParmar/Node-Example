'use strict'

const { DataTypes } = require('sequelize')
const { PERMISSION_GROUP } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const PermissionGroup = sequelize.define(getModelName(PERMISSION_GROUP), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: PERMISSION_GROUP,
    })
    PermissionGroup.associate = function (models) {
        PermissionGroup.hasMany(models.permission, {
            foreignKey: 'permission_group',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        PermissionGroup.hasMany(models.permission, {
            foreignKey: 'permission_group',
            as: 'business_permissions',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        PermissionGroup.hasMany(models.permission, {
            foreignKey: 'permission_group',
            as: 'site_permissions',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        PermissionGroup.hasMany(models.permissionGroupPath, {
            foreignKey: 'permission_group',
            as: 'allowed_paths',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

    return PermissionGroup
}
