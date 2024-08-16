'use strict';

const { EMISSIONS_FACTOR } = require('../../src/utils/constants')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(EMISSIONS_FACTOR, 'emissions_factor_ibfk_1')
    await queryInterface.removeColumn(EMISSIONS_FACTOR, 'resource_id')
  },

  async down(queryInterface, Sequelize) {

  }
};
