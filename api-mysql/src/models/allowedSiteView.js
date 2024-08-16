'use strict'

const { DataTypes } = require('sequelize')
const { VIEWS: { ALLOWED_SITE_VIEW } } = require('../utils/constants')

module.exports = (sequelize) => {
    const AllowedSiteView = sequelize.define('AllowedSiteView', {
        row_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },
        id: DataTypes.INTEGER.UNSIGNED,
        name: DataTypes.STRING,
        business_id: DataTypes.INTEGER.UNSIGNED,
        location_id: DataTypes.INTEGER.UNSIGNED,
        user_id: DataTypes.INTEGER.UNSIGNED,
        permission_group: DataTypes.INTEGER.UNSIGNED,
        permission_group_name: DataTypes.STRING,
        allowed: DataTypes.INTEGER
    }, {
        timestamps: true,
        underscored: true,
        tableName: ALLOWED_SITE_VIEW
    })
    AllowedSiteView.associate = function (models) {
        AllowedSiteView.belongsTo(models.AllowedBusinessView, {
            foreignKey: 'business_id',
            targetKey: 'id',
            as: 'business',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        AllowedSiteView.hasOne(models.location, {
            sourceKey: 'location_id',
            foreignKey: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return AllowedSiteView
}
