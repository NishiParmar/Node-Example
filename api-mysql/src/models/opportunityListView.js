'use strict'

const { DataTypes } = require('sequelize')
const { VIEWS: { OPPORTUNITY_LIST_VIEW } } = require('../utils/constants')

module.exports = (sequelize) => {
    const OpportunityListView = sequelize.define('OpportunityListView', {
        opportunity_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        projectType: DataTypes.STRING,
        projectTechnology: DataTypes.STRING,
        capex: DataTypes.DOUBLE,
        opex: DataTypes.DOUBLE,
        otherCost: DataTypes.DOUBLE,
        economic_life: DataTypes.INTEGER,
        business_case_id: DataTypes.INTEGER,
        start_date: DataTypes.DOUBLE,
        completion_date: DataTypes.DOUBLE,
        npv: DataTypes.DOUBLE,
        netAnnualSaving: DataTypes.INTEGER,
        irr: DataTypes.INTEGER
    }, { timestamps: false, tableName: OPPORTUNITY_LIST_VIEW })

    return OpportunityListView
}


