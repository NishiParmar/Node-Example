'use strict';

const { METER, LOCATION } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(METER, 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED,
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
