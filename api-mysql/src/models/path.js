'use strict'

const { DataTypes } = require('sequelize')
const { PATH } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Path = sequelize.define(getModelName(PATH), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        parent_id: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: PATH,
    })
    Path.associate = function (models) {
        Path.hasMany(models.permissionGroupPath, {
            foreignKey: 'path_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        Path.belongsTo(models.path, {
            foreignKey: 'parent_id',
            as: 'parent_path',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

    return Path
}
