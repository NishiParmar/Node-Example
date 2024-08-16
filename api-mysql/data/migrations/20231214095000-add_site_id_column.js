'use strict';

const { PROJECT, SITE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(PROJECT, 'site_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      after: 'parent_id',
      references: {
        model: {
          tableName: SITE
        },
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(PROJECT, 'site_id')
  }
}
