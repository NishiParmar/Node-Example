'use strict'

const { DataTypes } = require('sequelize')
const { OPPORTUNITY, BUSINESS, SITE, LOCATION } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Opportunity = sequelize.define(getModelName(OPPORTUNITY), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        parent_id: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        business_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: BUSINESS
                },
                key: 'id'
            }
        },
        location_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: LOCATION
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
        description: DataTypes.STRING
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: OPPORTUNITY,
    })

    Opportunity.associate = function (models) {
        Opportunity.belongsTo(models.businessCase, { foreignKey: 'id', targetKey: 'opportunity_id', onDelete: 'CASCADE' })
        Opportunity.belongsTo(models.business, { onDelete: 'CASCADE' })
        Opportunity.hasOne(models.site, {
            sourceKey: 'site_id',
            foreignKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            as: 'mainSite'
        })
        Opportunity.hasOne(models.OpportunityListView, {
            foreignKey: 'opportunity_id',
            as: 'opportunityDetails',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Opportunity.hasOne(models.AllowedSiteView, {
            foreignKey: 'id',
            sourceKey: 'site_id',
            as: 'site',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Opportunity
}
