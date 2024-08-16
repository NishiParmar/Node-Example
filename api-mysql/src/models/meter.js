const { DataTypes } = require('sequelize')
const { METER, CONTRACT, RESOURCE, LOCATION } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

'use strict'

module.exports = (sequelize) => {
    const Meter = sequelize.define(getModelName(METER), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        contract_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: CONTRACT,
                },
                key: 'id',
            }
        },
        resource_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: RESOURCE,
                },
                key: 'id',
            }
        },
        location_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: LOCATION,
                },
                key: 'id',
            }
        },

    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: METER,
    })

    Meter.associate = function (models) {
        Meter.belongsTo(models.resource, {
            foreignKey: 'resource_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Meter.hasOne(models.flow, {
            foreignKey: 'meter_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Meter.hasOne(models.location, {
            sourceKey: 'location_id',
            foreignKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Meter
}
