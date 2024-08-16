'use strict';

const { UNIT } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(UNIT, 'is_base', { type: Sequelize.BOOLEAN, after: 'name' })
  },

  async down(queryInterface, Sequelize) {

  }
};
