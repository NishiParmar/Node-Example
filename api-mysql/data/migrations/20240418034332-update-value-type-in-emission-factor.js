'use strict';

const { EMISSIONS_FACTOR } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(EMISSIONS_FACTOR, 'value', {
      type: Sequelize.DECIMAL(20, 5)
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
