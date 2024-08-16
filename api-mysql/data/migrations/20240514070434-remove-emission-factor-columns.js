'use strict';

const { EMISSIONS_FACTOR } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(EMISSIONS_FACTOR, 'scope')
    await queryInterface.removeColumn(EMISSIONS_FACTOR, 'value')
  },

  async down(queryInterface, Sequelize) {
  }
};
