'use strict'

const { DataTypes } = require('sequelize')
const { VIEWS: { FLOW_VIEW } } = require('../utils/constants')

module.exports = (sequelize) => {
    const FlowView = sequelize.define('FlowView', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },
        business_id: DataTypes.INTEGER.UNSIGNED,
        business_name: DataTypes.STRING,
        site_id: DataTypes.INTEGER.UNSIGNED,
        site_name: DataTypes.STRING,
        asset_id: DataTypes.INTEGER.UNSIGNED,
        asset_name: DataTypes.STRING,
        meter_id: DataTypes.INTEGER.UNSIGNED,
        meter_name: DataTypes.STRING,
        resource_id: DataTypes.INTEGER.UNSIGNED,
        resource_name: DataTypes.STRING,
        class: DataTypes.STRING,
        sub_class: DataTypes.STRING,
        period: DataTypes.DATEONLY,
        value: DataTypes.DECIMAL(20, 5),
        metric: DataTypes.STRING,
        to_metric: DataTypes.STRING,
        multiplier: DataTypes.DECIMAL(20, 5),
        tco2: DataTypes.DECIMAL(50, 18),
        cost: DataTypes.DECIMAL(20, 5),
        scope1: DataTypes.DECIMAL(40, 10),
        scope2: DataTypes.DECIMAL(40, 10),
        scope3: DataTypes.DECIMAL(40, 10)
    }, {
        timestamps: false,
        underscored: true,
        tableName: FLOW_VIEW
    })
    FlowView.associate = function (models) {
    }

    return FlowView
}
