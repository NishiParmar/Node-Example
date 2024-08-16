'use strict';

const { YEARS } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(YEARS, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      year_offset: Sequelize.INTEGER
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
