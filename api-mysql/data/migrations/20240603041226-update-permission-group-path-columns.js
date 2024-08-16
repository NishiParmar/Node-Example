'use strict';

const { PERMISSION_GROUP } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.changeColumn(PERMISSION_GROUP, 'allowed_paths', {
        type: Sequelize.TEXT
      })
      await queryInterface.changeColumn(PERMISSION_GROUP, 'denied_paths', {
        type: Sequelize.TEXT
      })
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  },

  async down(queryInterface, Sequelize) {
  }
};
