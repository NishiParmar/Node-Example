'use strict'

const { DataTypes } = require('sequelize')
const { RESOURCE, UNIT, BUSINESS, EMISSION } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Resource = sequelize.define(getModelName(RESOURCE), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        class: DataTypes.STRING,
        sub_class: DataTypes.STRING,
        unit_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: UNIT,
                },
                key: 'id',
            }
        },
        preferred_unit: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: UNIT,
                },
                key: 'id',
            },
        },
        business_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: BUSINESS
                },
                key: 'id'
            }
        },
        emission_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: EMISSION
                },
                key: 'id',
            }
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: RESOURCE,
    })

    Resource.associate = function (models) {
        Resource.hasOne(models.contract, {
            foreignKey: 'resource_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Resource.belongsTo(models.unit, { foreignKey: 'unit_id' })
        Resource.hasMany(models.meter, {
            foreignKey: 'resource_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Resource.hasMany(models.caseImpact, {
            foreignKey: 'resource_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Resource.belongsTo(models.unit, { foreignKey: 'preferred_unit', as: 'preferredUnit' })
        Resource.hasMany(models.caseEmissionsFactor, {
            foreignKey: 'resource_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Resource.hasMany(models.caseEmissionsFactor, {
            foreignKey: 'resource_id',
            as: 'case_emissions_factors',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Resource.belongsTo(models.business, {
            foreignKey: 'business_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Resource.belongsTo(models.emission, {
            foreignKey: 'emission_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Resource
}