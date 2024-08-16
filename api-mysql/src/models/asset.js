const { DataTypes } = require('sequelize')
const { ASSET, SITE, PROJECT } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

'use strict'

module.exports = (sequelize) => {
    const Asset = sequelize.define(getModelName(ASSET), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        site_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: SITE,
                },
                key: 'id',
            }
        },
        name: DataTypes.STRING,
        location_gps: {
            type: DataTypes.GEOMETRY('POINT'),
        },
        type: {
            type: DataTypes.ENUM,
            values: ['mobile', 'stationary', 'virtual']
        },
        proportion: DataTypes.STRING,
        project_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: PROJECT,
                },
                key: 'id',
            }
        },
        start_date: DataTypes.DATEONLY,
        end_date: DataTypes.DATEONLY,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: ASSET,
    })

    Asset.associate = function (models) {
        Asset.hasMany(models.impact, {
            foreignKey: 'asset_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Asset.hasOne(models.assetMeter, {
            sourceKey: 'id',
            foreignKey: 'asset_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Asset
}