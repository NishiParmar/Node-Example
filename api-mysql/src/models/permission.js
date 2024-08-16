'use strict'

const { DataTypes } = require('sequelize')
const { PERMISSION, PERMISSION_GROUP } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Permission = sequelize.define(getModelName(PERMISSION), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        table: DataTypes.STRING,
        item_id: DataTypes.INTEGER.UNSIGNED,
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
        tableName: PERMISSION,
    })
    Permission.associate = function (models) {
        Permission.belongsTo(models.permissionGroup, {
            foreignKey: 'permission_group',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

    return Permission
}