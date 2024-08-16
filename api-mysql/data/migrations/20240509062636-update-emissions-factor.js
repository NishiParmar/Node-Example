'use strict';

const { EMISSIONS_FACTOR } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(EMISSIONS_FACTOR, 'scope1', {
      type: Sequelize.DECIMAL(20, 5),
      after: 'resource_id'
    })
    await queryInterface.addColumn(EMISSIONS_FACTOR, 'scope2', {
      type: Sequelize.DECIMAL(20, 5),
      after: 'scope1'
    })
    await queryInterface.addColumn(EMISSIONS_FACTOR, 'scope3', {
      type: Sequelize.DECIMAL(20, 5),
      after: 'scope2'
    })
  },

  async down(queryInterface, Sequelize) {
  }
};
