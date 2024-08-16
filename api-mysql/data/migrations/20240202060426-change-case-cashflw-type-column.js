'use strict';

const { CASE_CASHFLOW } = require('../../src/utils/constants')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(CASE_CASHFLOW, 'type', { type: Sequelize.STRING })
  },

  async down(queryInterface, Sequelize) {
  }
};
