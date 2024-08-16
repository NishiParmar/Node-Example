'use strict'

const { DataTypes } = require('sequelize')
const { BUSINESS_CASE, OPPORTUNITY, SCENARIO } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const BusinessCase = sequelize.define(getModelName(BUSINESS_CASE), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        opportunity_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: OPPORTUNITY,
                },
                key: 'id',
            }
        },
        scenario_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: SCENARIO,
                },
                key: 'id',
            }
        },
        start_date: DataTypes.DATEONLY,
        completion_date: DataTypes.DATEONLY,
        economic_life: DataTypes.INTEGER
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: BUSINESS_CASE,
    })

    BusinessCase.associate = function (models) {
        BusinessCase.hasOne(models.scenario, {
            foreignKey: 'id',
            sourceKey: 'scenario_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        BusinessCase.hasMany(models.caseCashflow, {
            foreignKey: 'business_case_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        BusinessCase.hasMany(models.caseImpact, {
            foreignKey: 'business_case_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        BusinessCase.hasOne(models.opportunity, {
            foreignKey: 'id',
            sourceKey: 'opportunity_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return BusinessCase
}