'use strict'

const { DataTypes } = require('sequelize')
const { SCENARIO } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Scenario = sequelize.define(getModelName(SCENARIO), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        baseline_start_date: DataTypes.DATE
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: SCENARIO,
    })

    Scenario.associate = function (models) {
        Scenario.hasMany(models.caseEmissionsFactor, { foreignKey: 'scenario_id', sourceKey: 'id' })
    }

    return Scenario
}