'use strict';

const { IMPACT } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(IMPACT, 'cost', {
      type: Sequelize.DECIMAL(20, 5),
      after: 'change'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
