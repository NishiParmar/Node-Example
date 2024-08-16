'use strict';

const { RESOURCE, BUSINESS } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(RESOURCE, 'business_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: BUSINESS
        },
        key: 'id'
      },
      after: 'preferred_unit'
    })
  },

  async down(queryInterface, Sequelize) {
  }
};
