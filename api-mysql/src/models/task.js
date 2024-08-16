'use strict'

const { DataTypes } = require('sequelize')
const { TASK, BUSINESS, PROJECT, SITE } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Task = sequelize.define(getModelName(TASK), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        business_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: BUSINESS,
                },
                key: 'id',
            }
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
        site_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            references: {
                model: {
                    tableName: SITE,
                },
                key: 'id',
            }
        },
        status: DataTypes.STRING,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        name: DataTypes.STRING
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: TASK,
    })
    Task.associate = function (models) {
        Task.belongsTo(models.project, {
            foreignKey: 'project_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Task
}