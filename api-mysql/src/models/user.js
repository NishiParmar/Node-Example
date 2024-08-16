'use strict'

const { DataTypes } = require('sequelize')
const { USER } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const User = sequelize.define(getModelName(USER), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: USER,
    })
    User.associate = function (models) {
        User.hasOne(models.permissionUser, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        User.hasMany(models.AllowedBusinessView, {
            foreignKey: 'user_id',
            as: 'businesses',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
        User.hasMany(models.AllowedSiteView, {
            foreignKey: 'user_id',
            as: 'sites',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

    return User
}