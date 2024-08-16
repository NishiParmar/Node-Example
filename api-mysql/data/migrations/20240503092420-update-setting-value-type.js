'use strict';

const { SETTING } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(SETTING, 'value', {
      type: Sequelize.TEXT
    })
  },

  async down(queryInterface, Sequelize) {
  }
};
