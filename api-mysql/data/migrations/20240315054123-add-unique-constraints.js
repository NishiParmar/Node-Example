'use strict';

const { CASHFLOW, CASE_CASHFLOW } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint(CASE_CASHFLOW, {
      fields: ['business_case_id', 'name', 'year_offset', 'type'],
      type: 'unique',
      name: 'unique_case_cashflow_constraint'
    });

    queryInterface.addConstraint(CASHFLOW, {
      fields: ['project_id', 'name', 'year_offset', 'type'],
      type: 'unique',
      name: 'unique_cashflow_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    
  }
};
