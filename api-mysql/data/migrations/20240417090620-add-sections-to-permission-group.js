'use strict';

const { PERMISSION_GROUP } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(PERMISSION_GROUP, 'sections', {
      type: Sequelize.JSON,
      after: 'name'
    })
  },

  async down (queryInterface, Sequelize) {
  }
};
