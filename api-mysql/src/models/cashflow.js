'use strict'
const { DataTypes } = require('sequelize')
const { CASHFLOW, PROJECT } = require('../utils/constants')
const getModelName = require('../utils/getModelName')
module.exports = (sequelize) => {
    const Cashflow = sequelize.define(getModelName(CASHFLOW), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        project_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: PROJECT,
                },
                key: 'id',
            }
        },
        name: DataTypes.STRING,
        year_offset: DataTypes.INTEGER.UNSIGNED,
        cashflow: DataTypes.STRING,
        type: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CASHFLOW,
    })
    Cashflow.associate = function (models) {

    }

    return Cashflow
}