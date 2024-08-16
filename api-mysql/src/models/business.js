'use strict'

const { DataTypes } = require('sequelize')
const { BUSINESS } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
  const Business = sequelize.define(getModelName(BUSINESS), {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    industry_id: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    main_office_site_id: {
      type: DataTypes.INTEGER.UNSIGNED
    },
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: BUSINESS,
  })

  Business.associate = function (models) {
    Business.hasMany(models.site, {
      foreignKey: 'business_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'mainSite'
    })
    Business.hasMany(models.role, {
      foreignKey: 'item_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    Business.hasMany(models.groupTag, {
      foreignKey: 'item_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    Business.hasMany(models.project, {
      foreignKey: 'business_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    Business.hasMany(models.task, {
      foreignKey: 'business_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    Business.hasMany(models.opportunity, {
      foreignKey: 'business_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    Business.hasMany(models.setting, { onDelete: 'CASCADE' })
    Business.hasMany(models.businessResource, { foreignKey: 'business_id', sourceKey: 'id' })
    Business.hasMany(models.AllowedSiteView, {
      foreignKey: 'business_id',
      as: 'sites',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  }

  return Business
}
