'use strict'

const { DataTypes } = require('sequelize')
const { PERMISSION_GROUP_PATH, PERMISSION_GROUP, PATH } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const PermissionGroupPath = sequelize.define(getModelName(PERMISSION_GROUP_PATH), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        permission_group: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: PERMISSION_GROUP,
                }
            },
            key: 'id',
            allowNull: false
        },
        path_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: PATH,
                }
            },
            key: 'id',
            allowNull: false
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: PERMISSION_GROUP_PATH,
    })
    PermissionGroupPath.associate = function (models) {
        PermissionGroupPath.belongsTo(models.permissionGroup, {
            foreignKey: 'permission_group',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        PermissionGroupPath.belongsTo(models.path, {
            foreignKey: 'path_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

    return PermissionGroupPath
}
