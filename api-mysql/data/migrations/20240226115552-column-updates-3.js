'use strict';

const { UNIT_CONVERSION, CASE_EMISSIONS_FACTOR, LOCATION } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(UNIT_CONVERSION, 'multiplier', {
      type: Sequelize.DECIMAL(20, 5)
    })

    await queryInterface.addColumn(CASE_EMISSIONS_FACTOR, 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED
    })

    await queryInterface.changeColumn(CASE_EMISSIONS_FACTOR, 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: LOCATION
        },
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
