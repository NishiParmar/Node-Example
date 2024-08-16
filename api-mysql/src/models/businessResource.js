'use strict'
const { DataTypes } = require('sequelize')
const { BUSINESS_RESOURCE, BUSINESS, RESOURCE } = require('../utils/constants')
const getModelName = require('../utils/getModelName')

module.exports = (sequelize) => {
  const BusinessResource = sequelize.define(getModelName(BUSINESS_RESOURCE), {
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
    resource_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: RESOURCE,
        },
        key: 'id',
      }
    },
    preferred_unit: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    paranoid: true,
    underscored: true,
    tableName: BUSINESS_RESOURCE,
  })
  BusinessResource.associate = function (models) {
    BusinessResource.belongsTo(models.business, { foreignKey: 'business_id', targetKey: 'id' })
    BusinessResource.belongsTo(models.resource, { foreignKey: 'resource_id', targetKey: 'id' })
  }

  return BusinessResource
}