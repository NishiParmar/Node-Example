'use strict';

const { BUSINESS_CASE } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(BUSINESS_CASE, 'start_date', { type: Sequelize.DATEONLY, after: 'scenario_id' })
    await queryInterface.addColumn(BUSINESS_CASE, 'economic_life', { type: Sequelize.INTEGER, after: 'completion_date' })
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn(OPPORTUNITY, 'economic_life')
  }
};
