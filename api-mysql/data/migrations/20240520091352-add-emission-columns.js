'use strict';

const { RESOURCE, EMISSIONS_FACTOR, EMISSION } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(RESOURCE, 'emission_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: EMISSION
        },
        key: 'id'
      },
      after: 'preferred_unit'
    })
    await queryInterface.addColumn(EMISSIONS_FACTOR, 'emission_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: EMISSION
        },
        key: 'id'
      },
      after: 'resource_id'
    })
  },

  async down(queryInterface, Sequelize) {
  }
};
