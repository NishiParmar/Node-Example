'use strict'

const { DataTypes } = require('sequelize')
const { GROUP } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Group = sequelize.define(getModelName(GROUP), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        parent_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: GROUP,
                },
                key: 'id',
            }
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: GROUP,
    })
    Group.associate = function (models) {
        Group.hasMany(models.groupTag, {
            foreignKey: 'group_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        })

    }

    return Group
}
