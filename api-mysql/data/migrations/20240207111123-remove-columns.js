'use strict';

const { ACCESS_LOGS, ERROR_LOGS, YEARS } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(ACCESS_LOGS, 'updated_at')
    await queryInterface.removeColumn(ERROR_LOGS, 'updated_at')
    await queryInterface.removeColumn(YEARS, 'id')
    await queryInterface.changeColumn(YEARS, 'year_offset', {
      type: Sequelize.INTEGER,
      primaryKey: true
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
