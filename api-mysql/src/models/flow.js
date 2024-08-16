'use strict'

const { DataTypes } = require('sequelize')
const { FLOW, METER } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Flow = sequelize.define(getModelName(FLOW), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        meter_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: METER,
                },
                key: 'id',
            }
        },
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        value: DataTypes.DECIMAL(20, 5),
        cost: DataTypes.DECIMAL(20, 5),
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: FLOW,
    })

    Flow.associate = function (models) {
        Flow.hasOne(models.flowImpact, {
            foreignKey: 'flow_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Flow.belongsTo(models.meter, {
            foreignKey: 'meter_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Flow
}