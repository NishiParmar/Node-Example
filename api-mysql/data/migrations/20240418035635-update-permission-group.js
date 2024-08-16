'use strict';

const { PERMISSION_GROUP } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(PERMISSION_GROUP, 'sections')
    await queryInterface.addColumn(PERMISSION_GROUP, 'allowed_paths', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn(PERMISSION_GROUP, 'denied_paths', {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
  }
};
