'use strict';

const { CASE_IMPACT, SCENARIO } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(CASE_IMPACT, 'cost')
    await queryInterface.changeColumn(SCENARIO, 'baseline_start_date', {
      type: Sequelize.DATEONLY
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
