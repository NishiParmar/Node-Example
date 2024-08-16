'use strict'

const { DataTypes } = require('sequelize')
const { CASE_EMISSIONS_FACTOR, SCENARIO, RESOURCE, LOCATION } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const CaseEmissionsFactor = sequelize.define(getModelName(CASE_EMISSIONS_FACTOR), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
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
        scope1: DataTypes.DECIMAL(20, 5),
        scope2: DataTypes.DECIMAL(20, 5),
        scope3: DataTypes.DECIMAL(20, 5),
        resource_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: RESOURCE
                },
                key: 'id'
            }
        },
        year_offset: DataTypes.INTEGER,
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        location_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: LOCATION,
                },
                key: 'id',
            }
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CASE_EMISSIONS_FACTOR,
    })

    CaseEmissionsFactor.associate = function (models) {

    }

    return CaseEmissionsFactor
}