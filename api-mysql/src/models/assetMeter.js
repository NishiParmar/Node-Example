const { DataTypes } = require('sequelize')
const { ASSET_METER, ASSET, METER } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

'use strict'

module.exports = (sequelize) => {
    const AssetMeter = sequelize.define(getModelName(ASSET_METER), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        asset_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: ASSET
                },
                key: 'id',
            }
        },
        meter_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: METER,
                },
                key: 'id',
            }
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: ASSET_METER,
    })

    AssetMeter.associate = function (models) {
        AssetMeter.hasOne(models.meter, {
            sourceKey: 'meter_id',
            foreignKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        AssetMeter.hasOne(models.asset, {
            sourceKey: 'asset_id',
            foreignKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return AssetMeter
}