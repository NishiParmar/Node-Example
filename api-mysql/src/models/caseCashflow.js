'use strict'
const { DataTypes } = require('sequelize')
const { CASE_CASHFLOW, BUSINESS_CASE } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const CaseCashflow = sequelize.define(getModelName(CASE_CASHFLOW), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        business_case_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: BUSINESS_CASE,
                },
                key: 'id',
            }
        },
        name: DataTypes.STRING,
        year_offset: DataTypes.INTEGER,
        cashflow: DataTypes.STRING,
        type: {
            type: DataTypes.STRING
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CASE_CASHFLOW,
    })
    CaseCashflow.associate = function (models) {
        CaseCashflow.belongsTo(models.businessCase, {
            foreignKey: 'business_case_id'
        })
    }

    return CaseCashflow
}