'use strict';

const { OPPORTUNITY, LOCATION } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(OPPORTUNITY, 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      after: 'business_id',
      references: {
        model: {
          tableName: LOCATION
        },
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
