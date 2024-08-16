'use strict'

const { DataTypes } = require('sequelize')
const { VIEWS: { ALLOWED_BUSINESS_VIEW } } = require('../utils/constants')

module.exports = (sequelize) => {
    const AllowedBusinessView = sequelize.define('AllowedBusinessView', {
        row_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },
        id: DataTypes.INTEGER.UNSIGNED,
        name: DataTypes.STRING,
        industry_id: DataTypes.INTEGER.UNSIGNED,
        main_office_site_id: DataTypes.INTEGER.UNSIGNED,
        user_id: DataTypes.INTEGER.UNSIGNED,
        permission_group: DataTypes.INTEGER.UNSIGNED,
        permission_group_name: DataTypes.STRING
    }, {
        timestamps: true,
        underscored: true,
        tableName: ALLOWED_BUSINESS_VIEW
    })

    AllowedBusinessView.associate = function (models) {
        AllowedBusinessView.hasOne(models.AllowedSiteView, {
            foreignKey: 'id',
            sourceKey: 'main_office_site_id',
            as: 'mainSite',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
    }

    return AllowedBusinessView
}
