'use strict'
const { DataTypes } = require('sequelize')
const { METRIC, SITE } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Metric = sequelize.define(getModelName(METRIC), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        table: DataTypes.STRING,
        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: SITE,
                },
                key: 'id',
            }
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: METRIC,
    })

    Metric.associate = function (models) {
        Metric.hasMany(models.metricValue, {
            foreignKey: 'metric_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Metric
}