'use strict';

const { CASHFLOW } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(CASHFLOW, 'type', { type: Sequelize.STRING })
  },

  async down(queryInterface, Sequelize) {
    
  }
};
