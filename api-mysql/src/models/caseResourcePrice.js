'use strict'

const { DataTypes } = require('sequelize')
const { CASE_RESOURCE_PRICE, SCENARIO, RESOURCE, LOCATION } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const CaseResourcePrice = sequelize.define(getModelName(CASE_RESOURCE_PRICE), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        scenario_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: SCENARIO
                },
                key: 'id'
            }
        },
        price: DataTypes.DECIMAL(20, 5),
        resource_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: RESOURCE
                },
                key: 'id'
            }
        },
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        location_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: LOCATION
                },
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CASE_RESOURCE_PRICE,
    })

    CaseResourcePrice.associate = function (models) {
        CaseResourcePrice.belongsTo(models.scenario, {
            foreignKey: 'scenario_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        CaseResourcePrice.belongsTo(models.resource, {
            foreignKey: 'resource_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        CaseResourcePrice.belongsTo(models.location, {
            foreignKey: 'location_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return CaseResourcePrice
}