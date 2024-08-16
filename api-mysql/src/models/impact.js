'use strict'

const { DataTypes } = require('sequelize')
const { IMPACT, PROJECT, CONTRACT, ASSET } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Impact = sequelize.define(getModelName(IMPACT), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        project_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: PROJECT,
                },
                key: 'id',
            }
        },
        contract_period_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: CONTRACT,
                },
                key: 'id',
            }
        },
        year_offset: DataTypes.INTEGER,
        change: DataTypes.STRING,
        cost: DataTypes.DECIMAL(20, 5),
        asset_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: ASSET,
                },
                key: 'id',
            }
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: IMPACT,
    })

    Impact.associate = function (models) {
        Impact.belongsTo(models.asset, {
            foreignKey: 'asset_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Impact.belongsTo(models.project, {
            foreignKey: 'project_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        Impact.belongsTo(models.contractPeriod, {
            foreignKey: 'contract_period_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Impact
}