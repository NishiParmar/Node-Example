'use strict'
const { DataTypes } = require('sequelize')
const { CONTACT } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
    const Contact = sequelize.define(getModelName(CONTACT), {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: CONTACT,
    })

    Contact.associate = function (models) {
        Contact.hasMany(models.role, {
            foreignKey: 'contact_id',
            sourceKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return Contact
}