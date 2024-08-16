'use strict'

const { DataTypes } = require('sequelize')
const { TARGET, SCENARIO } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Target = sequelize.define(getModelName(TARGET), {
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
        name: DataTypes.STRING,
        target_date: DataTypes.DATE,
        type: DataTypes.STRING,
        target: DataTypes.STRING,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: TARGET,
    })

    Target.associate = function (models) {

    }

    return Target
}