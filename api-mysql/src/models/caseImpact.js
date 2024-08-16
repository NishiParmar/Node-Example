'use strict'

const { DataTypes } = require('sequelize')
const { CASE_IMPACT, BUSINESS_CASE, RESOURCE } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const CaseImpact = sequelize.define(getModelName(CASE_IMPACT), {
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
        year_offset: DataTypes.INTEGER,
        resource_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: RESOURCE
                },
                key: 'id'
            }
        },
        change: DataTypes.STRING,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CASE_IMPACT,
    })

    CaseImpact.associate = function (models) {
        CaseImpact.belongsTo(models.resource, {
            foreignKey: 'resource_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        CaseImpact.belongsTo(models.businessCase, {
            foreignKey: 'business_case_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return CaseImpact
}