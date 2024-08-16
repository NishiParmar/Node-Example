'use strict'

const { DataTypes } = require('sequelize')
const { PROJECT, BUSINESS, SITE } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Project = sequelize.define(getModelName(PROJECT), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        description: DataTypes.STRING,
        parent_id: DataTypes.INTEGER.UNSIGNED,
        business_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: BUSINESS
                },
                key: 'id'
            }
        },
        site_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: SITE
                },
                key: 'id'
            }
        },
        name: DataTypes.STRING,
        status: DataTypes.STRING,
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
        economic_life: DataTypes.INTEGER
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: PROJECT,
    })
    Project.associate = function (models) {
        Project.hasMany(models.impact, {
            foreignKey: 'project_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Project.hasMany(models.cashflow, {
            foreignKey: 'project_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Project.hasMany(models.task, {
            foreignKey: 'project_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Project.hasOne(models.asset, {
            foreignKey: 'project_id',
            onDelete: 'CASCADE'
        })
        Project.belongsTo(models.business, {
            foreignKey: 'business_id',
            as: 'mainBusiness'
        })
        Project.hasOne(models.site, {
            sourceKey: 'site_id',
            foreignKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'mainSite'
        })
        Project.hasOne(models.ProjectListView, {
            sourceKey: 'id',
            foreignKey: 'project_id',
            as: 'projectDetails'
        })
        Project.hasOne(models.AllowedSiteView, {
            foreignKey: 'id',
            sourceKey: 'site_id',
            as: 'site',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Project.belongsTo(models.AllowedBusinessView, {
            foreignKey: 'business_id',
            targetKey: 'id',
            as: 'business',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Project
}


