'use strict'

const { DataTypes } = require('sequelize')
const { CONTRACT_PRICING, CONTRACT_PERIOD } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const ContractPricing = sequelize.define(getModelName(CONTRACT_PRICING), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        contract_period_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: CONTRACT_PERIOD,
                },
                key: 'id',
            }
        },
        time_of_day: DataTypes.TIME,
        price: DataTypes.INTEGER
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CONTRACT_PRICING,
    })

    ContractPricing.associate = function (models) {

    }

    return ContractPricing
}