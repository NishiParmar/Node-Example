'use strict';

const { BUSINESS_RESOURCE, BUSINESS, RESOURCE } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(BUSINESS_RESOURCE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      business_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: BUSINESS,
          },
          key: 'id',
        }
      },
      resource_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: RESOURCE,
          },
          key: 'id',
        }
      },
      preferred_unit: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: BUSINESS_RESOURCE,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(BUSINESS_RESOURCE, 'business_resource_ibfk_1')
    await queryInterface.removeConstraint(BUSINESS_RESOURCE, 'business_resource_ibfk_2')
    await queryInterface.dropTable(BUSINESS_RESOURCE);
  }
};