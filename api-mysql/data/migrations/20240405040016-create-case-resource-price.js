'use strict';

const { CASE_RESOURCE_PRICE, SCENARIO, RESOURCE, LOCATION } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CASE_RESOURCE_PRICE, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      scenario_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: SCENARIO
          },
          key: 'id'
        }
      },
      price: Sequelize.DECIMAL(20, 5),
      resource_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: RESOURCE
          },
          key: 'id'
        }
      },
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
      location_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: LOCATION
          },
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: CASE_RESOURCE_PRICE
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(CASE_RESOURCE_PRICE);
  }
};
