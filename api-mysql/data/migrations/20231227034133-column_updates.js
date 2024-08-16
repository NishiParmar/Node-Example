const { CASE_EMISSIONS_FACTOR, RESOURCE, CASE_IMPACT } = require('../../src/utils/constants')
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(CASE_IMPACT, 'cost', {
      type: Sequelize.DECIMAL(20, 5),
    });
    await queryInterface.addColumn(CASE_EMISSIONS_FACTOR, 'year_offset', {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) { }
};
