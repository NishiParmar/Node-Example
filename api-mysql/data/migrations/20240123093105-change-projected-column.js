'use strict';

const { CONTRACT_PERIOD } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(CONTRACT_PERIOD, 'projected', { type: Sequelize.BOOLEAN })
  },

  async down(queryInterface, Sequelize) {

  }
};
