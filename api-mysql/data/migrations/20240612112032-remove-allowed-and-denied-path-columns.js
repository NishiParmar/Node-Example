'use strict';

const { PERMISSION_GROUP } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn(PERMISSION_GROUP, 'allowed_paths')
      await queryInterface.removeColumn(PERMISSION_GROUP, 'denied_paths')
    } catch (error) {
      throw new Error(error)
    }
  },

  async down(queryInterface, Sequelize) {
  }
};
