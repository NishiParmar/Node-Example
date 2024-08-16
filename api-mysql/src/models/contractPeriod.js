'use strict'

const { DataTypes } = require('sequelize')
const { CONTRACT, CONTRACT_PERIOD } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const ContractPeriod = sequelize.define(getModelName(CONTRACT_PERIOD), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        contract_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: CONTRACT,
                },
                key: 'id',
            }
        },
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.INTEGER,
        projected: DataTypes.BOOLEAN,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CONTRACT_PERIOD,
    })

    ContractPeriod.associate = function (models) {
        ContractPeriod.hasOne(models.contractPricing, {
            foreignKey: 'contract_period_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        ContractPeriod.belongsTo(models.contract, {
            foreignKey: 'contract_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return ContractPeriod
}