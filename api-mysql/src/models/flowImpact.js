'use strict'

const { DataTypes } = require('sequelize')
const { FLOW_IMPACT, FLOW } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const FlowImpact = sequelize.define(getModelName(FLOW_IMPACT), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        flow_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: FLOW,
                },
                key: 'id',
            }
        },
        cost: DataTypes.DECIMAL(20, 5),
        emissions_scope1: DataTypes.DECIMAL(20, 5),
        emissions_scope2: DataTypes.DECIMAL(20, 5),
        emissions_scope3: DataTypes.DECIMAL(20, 5),
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: FLOW_IMPACT,
    })
    FlowImpact.associate = function (models) { }

    return FlowImpact
}