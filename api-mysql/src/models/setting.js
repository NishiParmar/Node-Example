'use strict'

const { DataTypes } = require('sequelize')
const { SETTING, BUSINESS } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Setting = sequelize.define(getModelName(SETTING), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        setting_name: {
            type: DataTypes.STRING,
        },
        business_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: BUSINESS,
                },
                key: 'id',
            }
        },
        title: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.TEXT
        },
        suffix: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.TEXT
        },
        options: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: SETTING,
    })

    Setting.associate = function (models) {
        Setting.belongsTo(models.business)
    }

    return Setting
}