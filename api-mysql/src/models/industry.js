'use strict'

const { DataTypes } = require('sequelize')
const { INDUSTRY } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Industry = sequelize.define(getModelName(INDUSTRY), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        industryDesc: DataTypes.STRING,
        parent_industry: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: INDUSTRY,
                },
                key: 'id',
            }
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: INDUSTRY,
    })

    Industry.associate = function (models) {

    }

    return Industry
}