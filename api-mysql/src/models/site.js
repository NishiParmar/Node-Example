'use strict'

const { DataTypes } = require('sequelize')
const { SITE, BUSINESS, LOCATION } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
  const Site = sequelize.define(getModelName(SITE), {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    business_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: BUSINESS,
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
    tableName: SITE,
  })

  Site.associate = function (models) {
    Site.belongsTo(models.business)
    Site.hasOne(models.location, {
      sourceKey: 'location_id',
      foreignKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    Site.hasMany(models.asset, {
      foreignKey: 'site_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    Site.hasMany(models.metric, {
      foreignKey: 'item_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    Site.hasMany(models.task, {
      foreignKey: 'site_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
  }

  return Site
}