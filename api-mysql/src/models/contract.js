'use strict'

const { DataTypes } = require('sequelize')
const { CONTRACT, RESOURCE } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Contract = sequelize.define(getModelName(CONTRACT), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
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
        supplier: DataTypes.STRING
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CONTRACT,
    })

    Contract.associate = function (models) {
        Contract.hasMany(models.meter, {
            foreignKey: 'contract_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Contract.hasMany(models.contractPeriod, {
            foreignKey: 'contract_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Contract.belongsTo(models.resource, {
            foreignKey: 'resource_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Contract
}