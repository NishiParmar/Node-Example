'use strict'

const { DataTypes } = require('sequelize')
const { METRIC_VALUE, METRIC } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const MetricValue = sequelize.define(getModelName(METRIC_VALUE), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        metric_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: METRIC,
                },
                key: 'id',
            }
        },
        value: DataTypes.DECIMAL(20, 5),
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: METRIC_VALUE,
    })

    MetricValue.associate = function (models) { }

    return MetricValue
}