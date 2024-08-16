'use strict'

const { DataTypes } = require('sequelize')
const { GROUP_TAG, GROUP } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const GroupTag = sequelize.define(getModelName(GROUP_TAG), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        group_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: GROUP,
                },
                key: 'id',
            }
        },
        table: DataTypes.STRING,
        item_id: DataTypes.INTEGER.UNSIGNED,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: GROUP_TAG,
    })
    GroupTag.associate = function (models) { 
        GroupTag.belongsTo(models.group, {
            foreignKey: 'group_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        })
    }

    return GroupTag
}