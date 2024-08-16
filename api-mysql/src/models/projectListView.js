'use strict'

const { DataTypes } = require('sequelize')
const { VIEWS: { PROJECT_LIST_VIEW } } = require('../utils/constants')

module.exports = (sequelize) => {
    const ProjectListView = sequelize.define('ProjectListView', {
        project_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        projectType: DataTypes.STRING,
        projectTechnology: DataTypes.STRING,
        irr: DataTypes.INTEGER,
        capex: DataTypes.DOUBLE,
        opex: DataTypes.DOUBLE,
        otherCost: DataTypes.DOUBLE,
        reduction: DataTypes.DOUBLE,
        totalReduction: DataTypes.DECIMAL,
        netAnnualSaving: DataTypes.INTEGER,
    }, { timestamps: false, tableName: PROJECT_LIST_VIEW })

    return ProjectListView
}


